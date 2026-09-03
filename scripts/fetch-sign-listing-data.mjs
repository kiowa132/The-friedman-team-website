// scripts/fetch-sign-listing-data.mjs
//
// Build-time Lofty pull for the For Sale sign listing pages.
//
// For every content/listings/*.md that has an `mlsId`, this calls Lofty
// ONCE at build time and bakes the result (address, price, beds/baths/sqft,
// status, photo gallery, remarks) into src/data/signListingsData.json.
// SignListingPage then renders that static data instantly - no per-visitor
// API call, no "pulling the latest details..." spinner, no dependency on
// Lofty being up when someone scans the sign in a parking lot.
//
// Field precedence downstream (src/lib/content.ts and
// generate-listings-manifest.mjs): CMS override field -> this baked Lofty
// data -> photo folder.
//
// Safe by design: if LOFTY_API_KEY isn't set, or Lofty can't find a
// listing, this logs and moves on. It never throws and never fails the
// build - the CMS override fields are always the fallback.
//
// Runs FIRST in "prebuild" (see package.json), before
// generate-listings-manifest.mjs, which merges this data into the manifest
// that middleware.ts reads for crawler link previews.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'src/data/signListingsData.json');
const LISTINGS_DIR = path.join(ROOT, 'content/listings');

function readFrontmatterField(raw, field) {
  const fm = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return '';
  const line = fm[1].split('\n').find((l) => l.startsWith(`${field}:`));
  if (!line) return '';
  let v = line.slice(field.length + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  return v.trim();
}

function writeOut(obj) {
  fs.writeFileSync(OUT, JSON.stringify(obj, null, 2) + '\n');
}

async function main() {
  if (!fs.existsSync(LISTINGS_DIR)) {
    writeOut({});
    console.log('[sign-listings] no content/listings dir; wrote empty signListingsData.json');
    return;
  }

  const wanted = fs
    .readdirSync(LISTINGS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .map((slug) => ({
      slug,
      mlsId: readFrontmatterField(fs.readFileSync(path.join(LISTINGS_DIR, `${slug}.md`), 'utf-8'), 'mlsId'),
    }))
    .filter((x) => x.mlsId);

  if (wanted.length === 0) {
    writeOut({});
    console.log('[sign-listings] no listings have an mlsId; wrote empty signListingsData.json');
    return;
  }

  if (!process.env.LOFTY_API_KEY) {
    // Keep any existing baked data rather than wiping it - a prior good
    // build's data beats nothing if the key is briefly missing.
    if (!fs.existsSync(OUT)) writeOut({});
    console.warn(
      `[sign-listings] LOFTY_API_KEY not set - skipping Lofty pull for ${wanted.length} listing(s). ` +
        `Pages will use their CMS override fields. Existing ${path.basename(OUT)} left as-is.`
    );
    return;
  }

  const { fetchListingByMls } = await import('../server/mlsClient.js');

  const out = {};
  for (const { slug, mlsId } of wanted) {
    try {
      const data = await fetchListingByMls(mlsId);
      if (!data) {
        console.warn(
          `[sign-listings] MLS ${mlsId} ("${slug}") not found in the Lofty feed ` +
            `- page will use its CMS override fields.`
        );
        continue;
      }
      out[slug] = { ...data, fetchedAt: new Date().toISOString() };
      console.log(
        `[sign-listings] ${slug}: baked ${mlsId} - ${data.streetAddress || '(no address)'}, ` +
          `${(data.gallery || []).length} photo(s)`
      );
    } catch (err) {
      console.warn(
        `[sign-listings] ${slug}: Lofty lookup for ${mlsId} failed (${err && err.message}) ` +
          `- page will use its CMS override fields.`
      );
    }
  }

  writeOut(out);
  console.log(`[sign-listings] wrote ${path.basename(OUT)} with ${Object.keys(out).length} baked listing(s)`);
}

main().catch((err) => {
  console.warn('[sign-listings] unexpected error, continuing build anyway:', err);
  try {
    if (!fs.existsSync(OUT)) writeOut({});
  } catch {}
  process.exit(0);
});

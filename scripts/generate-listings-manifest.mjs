// scripts/generate-listings-manifest.mjs
//
// Generates src/data/listingsManifest.json - a plain JSON list of every
// hand-curated "sign listing" (content/listings/*.md): slug, status,
// address, price, beds/baths/sqft, the active flag, and the batch-uploaded
// photo list found in public/images/listings/<slug>/.
//
// WHY: middleware.ts (crawler link previews) and src/lib/content.ts both
// need this data without reading the filesystem at runtime. This reads the
// markdown straight off disk with fs (same pattern as
// generate-blog-manifest.mjs) and also scans the per-listing photo folder
// so Kyle can drop 20 photos in at once (GitHub web UI multi-upload)
// instead of adding them one by one in the CMS.
//
// Runs in "prebuild" (see package.json) so it can't go stale.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const IMG_RE = /\.(jpe?g|png|webp|avif|gif)$/i;

function getMarkdownSlugs(dir) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name.replace(/\.md$/, ''));
}

// Photos for a listing live in public/images/listings/<slug>/. Sorted by
// filename (name them 01.jpg, 02.jpg... for a specific order). A file whose
// name starts with "hero" is used as the main image; otherwise the first
// file is. Returns { hero, photos } with web paths under /images/.
function getFolderPhotos(slug) {
  const dir = path.join(ROOT, 'public/images/listings', slug);
  if (!fs.existsSync(dir)) return { hero: '', photos: [] };
  const files = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && IMG_RE.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  if (files.length === 0) return { hero: '', photos: [] };
  const heroFile = files.find((f) => /^hero/i.test(f)) || files[0];
  const toUrl = (f) => `/images/listings/${slug}/${f}`;
  return {
    hero: toUrl(heroFile),
    photos: [toUrl(heroFile), ...files.filter((f) => f !== heroFile).map(toUrl)],
  };
}

function extractFrontmatterBlock(raw) {
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n/);
  return match ? match[1] : '';
}

function readField(frontmatter, field) {
  const lines = frontmatter.split('\n');
  const startIndex = lines.findIndex((l) => l.startsWith(`${field}:`));
  if (startIndex === -1) return undefined;
  let value = lines[startIndex].slice(field.length + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return value.trim();
}

const listings = [];
for (const slug of getMarkdownSlugs('content/listings')) {
  const raw = fs.readFileSync(path.join(ROOT, 'content/listings', `${slug}.md`), 'utf-8');
  const fm = extractFrontmatterBlock(raw);
  const { hero, photos } = getFolderPhotos(slug);
  listings.push({
    slug,
    active: readField(fm, 'active') === 'true',
    status: readField(fm, 'status') || 'Active',
    streetAddress: readField(fm, 'streetAddress') || '',
    cityStateZip: readField(fm, 'cityStateZip') || '',
    listPrice: readField(fm, 'listPrice') || '',
    beds: readField(fm, 'beds') || '',
    baths: readField(fm, 'baths') || '',
    sqft: readField(fm, 'sqft') || '',
    mlsId: readField(fm, 'mlsId') || '',
    heroImage: readField(fm, 'heroImage') || '',
    hero, // from the photo folder
    photos, // from the photo folder
  });
}

const outPath = path.join(ROOT, 'src/data/listingsManifest.json');
fs.writeFileSync(outPath, JSON.stringify(listings, null, 2) + '\n');
console.log(`Generated listingsManifest.json with ${listings.length} sign listing(s)`);

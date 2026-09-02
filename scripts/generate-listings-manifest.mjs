// scripts/generate-listings-manifest.mjs
//
// Generates src/data/listingsManifest.json - a plain JSON list of every
// hand-curated "sign listing" (content/listings/*.md): slug, status,
// address, price, beds/baths/sqft, hero image, and the active flag.
//
// WHY: middleware.ts (Vercel Edge Middleware, serves real crawler-facing
// meta for link previews) can't import src/lib/content.ts, which loads
// these via Vite's import.meta.glob. This reads the files straight off
// disk with fs - the same pattern generate-blog-manifest.mjs already uses
// - so middleware.ts can import the result directly.
//
// Runs in "prebuild" (see package.json) so it can't go stale.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function getMarkdownSlugs(dir) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name.replace(/\.md$/, ''));
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
    heroImage: readField(fm, 'heroImage') || '',
  });
}

const outPath = path.join(ROOT, 'src/data/listingsManifest.json');
fs.writeFileSync(outPath, JSON.stringify(listings, null, 2) + '\n');
console.log(`Generated listingsManifest.json with ${listings.length} sign listing(s)`);

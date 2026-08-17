// scripts/generate-fmmi-data.mjs
//
// Generates src/data/fmmi.generated.json at build time by scanning every
// post in content/blog for an optional `fmmi:` frontmatter block (added
// via the CMS's "Friedman Market Momentum Index" field group, or by
// editing frontmatter directly on GitHub).
//
// This is what makes the homepage Market Pulse card update itself every
// time a real market report is published - no manual data-file editing
// required. A post with no `fmmi:` block (i.e. every non-market-report
// post) is simply skipped; nothing breaks.
//
// Unlike generate-blog-manifest.mjs, this uses a real YAML parser
// (js-yaml) rather than hand-rolled line parsing, since the fmmi block is
// nested (score/label/signal plus four sub-objects) and hand-rolling that
// robustly isn't worth the risk of silently mis-parsing a real number.
//
// Run automatically before every build (see package.json's "prebuild").

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'js-yaml';

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
  // Normalize CRLF -> LF first (real files in this repo mix both).
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n/);
  return match ? match[1] : '';
}

// Turns a CMS sub-object ({score, previous, note}) into a FmmiSubScore, or
// null if it wasn't filled in (score is the only truly required field -
// previous/note are allowed to be missing, e.g. the very first week ever
// published won't have a "previous" to compare against).
function readSubScore(name, obj) {
  if (!obj || typeof obj.score !== 'number') return null;
  return {
    name,
    score: obj.score,
    previousScore: typeof obj.previous === 'number' ? obj.previous : null,
    note: typeof obj.note === 'string' && obj.note.trim() ? obj.note.trim() : '',
  };
}

const entries = [];

for (const slug of getMarkdownSlugs('content/blog')) {
  const raw = fs.readFileSync(path.join(ROOT, 'content/blog', `${slug}.md`), 'utf-8');
  const frontmatterBlock = extractFrontmatterBlock(raw);
  if (!frontmatterBlock) continue;

  let data;
  try {
    data = yaml.load(frontmatterBlock);
  } catch (err) {
    console.warn(`Skipping ${slug} for FMMI data: could not parse frontmatter YAML (${err.message})`);
    continue;
  }

  const fmmi = data && data.fmmi;
  if (!fmmi || typeof fmmi.score !== 'number') continue; // not a market-report post, or FMMI left blank

  const publishDateRaw = data.publishDate;
  if (!publishDateRaw) {
    console.warn(`Skipping ${slug} for FMMI data: has an fmmi block but no publishDate`);
    continue;
  }
  // publishDate is usually a quoted "YYYY-MM-DD" string, but some existing
  // posts have it unquoted, which YAML auto-parses as a real Date object.
  // Normalize either case back to a plain YYYY-MM-DD string.
  const publishDate =
    publishDateRaw instanceof Date ? publishDateRaw.toISOString().slice(0, 10) : String(publishDateRaw);

  const subScores = [
    readSubScore('Demand', fmmi.demand),
    readSubScore('Seller Strength', fmmi.sellerStrength),
    readSubScore('Market Speed', fmmi.marketSpeed),
    readSubScore('Rate Environment', fmmi.rateEnvironment),
  ].filter(Boolean);

  entries.push({
    date: publishDate,
    score: fmmi.score,
    label: typeof fmmi.label === 'string' && fmmi.label.trim() ? fmmi.label.trim() : null,
    signal: typeof fmmi.signal === 'string' && fmmi.signal.trim() ? fmmi.signal.trim() : null,
    sourceSlug: slug,
    subScores: subScores.length > 0 ? subScores : undefined,
  });
}

entries.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

const outPath = path.join(ROOT, 'src/data/fmmi.generated.json');
fs.writeFileSync(outPath, JSON.stringify(entries, null, 2) + '\n');
console.log(`Generated fmmi.generated.json with ${entries.length} weekly score(s)`);

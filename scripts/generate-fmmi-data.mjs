// scripts/generate-fmmi-data.mjs
//
// Generates src/data/fmmi.generated.json at build time by reading the real
// FMMI numbers straight out of each week's Market Report post - no manual
// re-entry required for a normal report.
//
// TWO SOURCES, IN PRIORITY ORDER:
//   1. Body text - the gauge chart's alt text ("...Momentum Index at 51
//      out of 100..."), the label paragraph right below it, the sub-score
//      chart's alt text ("Demand 58%, Seller Strength 52%, ..."), and the
//      "## The Friedman Signal(tm): X" heading. This is what a normal
//      weekly report already contains - nothing extra to fill in.
//   2. The `fmmi:` frontmatter block (added via the CMS's "Friedman Market
//      Momentum Index" field group) - a MANUAL OVERRIDE for the rare case
//      where body parsing can't find a clean match (e.g. the report
//      template's wording changes and this script needs an update, or you
//      want to add sub-score explanation notes body-parsing can't see).
//      If both are present, frontmatter wins.
//
// SAFETY RULE: if a post's score can't be confidently parsed from either
// source, that post is skipped with a console warning - never guessed.
// A skipped week just means the gauge doesn't update that week; it never
// shows a wrong number.
//
// Run automatically before every build (see package.json's "prebuild").

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SUB_SCORE_NAMES = ['Demand', 'Seller Strength', 'Market Speed', 'Rate Environment'];

function getMarkdownSlugs(dir) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name.replace(/\.md$/, ''));
}

function splitFrontmatterAndBody(raw) {
  // Normalize CRLF -> LF first (real files in this repo mix both).
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  return match ? { frontmatter: match[1], body: match[2] } : { frontmatter: '', body: normalized };
}

function normalizeDate(raw) {
  if (!raw) return null;
  return raw instanceof Date ? raw.toISOString().slice(0, 10) : String(raw);
}

// ---------- Source 1: parse straight out of the published report body ----------
function extractFmmiSection(body) {
  const lines = body.split('\n');
  const start = lines.findIndex((l) => /^##\s+.*Friedman Market Momentum Index/i.test(l));
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join('\n');
}

function parseFromBody(body) {
  const section = extractFmmiSection(body);
  if (!section) return null;

  const scoreMatch = section.match(/Momentum Index at (\d{1,3})\s*(?:out of|\/)\s*100/i);
  if (!scoreMatch) return null;
  const score = Number(scoreMatch[1]);
  if (!(score >= 0 && score <= 100)) return null;

  const labelMatch = section.match(/<p[^>]*>([^<]+)<\/p>/);
  const label = labelMatch ? labelMatch[1].trim() : null;

  // Signal heading can appear right after this section or elsewhere in the
  // post ("## The Friedman Signal(tm): Stabilizing") - search the whole
  // body for it since it isn't always inside the FMMI section itself.
  const signalMatch = body.match(/Friedman Signal(?:&trade;|™|\(tm\))?:?\s*([A-Za-z]+)/i);
  const signal = signalMatch ? signalMatch[1].trim() : null;

  // Sub-score chart alt text, e.g. "Demand 58%, Seller Strength 52%,
  // Market Speed 58%, Rate Environment 35%". Match generically (any
  // "Name %" pair) then keep only the four known component names, so this
  // doesn't silently pick up an unrelated number if the wording shifts.
  let subScores;
  const subAltMatch = section.match(/alt="([^"]*sub-scores?:[^"]*)"/i);
  if (subAltMatch) {
    const pairs = [...subAltMatch[1].matchAll(/([A-Za-z][A-Za-z ]*?)\s+(\d{1,3})%/g)];
    const found = [];
    for (const [, rawName, rawScore] of pairs) {
      const name = SUB_SCORE_NAMES.find((n) => n.toLowerCase() === rawName.trim().toLowerCase());
      if (name) found.push({ name, score: Number(rawScore), previousScore: null, note: '' });
    }
    if (found.length > 0) subScores = found;
  }

  return { score, label, signal, subScores };
}

// ---------- Source 2: explicit fmmi: frontmatter (manual override) ----------
function readSubScore(name, obj) {
  if (!obj || typeof obj.score !== 'number') return null;
  return {
    name,
    score: obj.score,
    previousScore: typeof obj.previous === 'number' ? obj.previous : null,
    note: typeof obj.note === 'string' && obj.note.trim() ? obj.note.trim() : '',
  };
}

function parseFromFrontmatter(frontmatterBlock, slug) {
  if (!frontmatterBlock) return null;
  let data;
  try {
    data = yaml.load(frontmatterBlock);
  } catch (err) {
    console.warn(`${slug}: could not parse frontmatter YAML for FMMI override (${err.message})`);
    return null;
  }
  const fmmi = data && data.fmmi;
  if (!fmmi || typeof fmmi.score !== 'number') return null;

  const subScores = [
    readSubScore('Demand', fmmi.demand),
    readSubScore('Seller Strength', fmmi.sellerStrength),
    readSubScore('Market Speed', fmmi.marketSpeed),
    readSubScore('Rate Environment', fmmi.rateEnvironment),
  ].filter(Boolean);

  return {
    score: fmmi.score,
    label: typeof fmmi.label === 'string' && fmmi.label.trim() ? fmmi.label.trim() : null,
    signal: typeof fmmi.signal === 'string' && fmmi.signal.trim() ? fmmi.signal.trim() : null,
    subScores: subScores.length > 0 ? subScores : undefined,
  };
}

// ---------- Main ----------
const entries = [];

for (const slug of getMarkdownSlugs('content/blog')) {
  const raw = fs.readFileSync(path.join(ROOT, 'content/blog', `${slug}.md`), 'utf-8');
  const { frontmatter, body } = splitFrontmatterAndBody(raw);
  if (!frontmatter) continue;

  let data;
  try {
    data = yaml.load(frontmatter);
  } catch (err) {
    console.warn(`Skipping ${slug} for FMMI data: could not parse frontmatter YAML (${err.message})`);
    continue;
  }

  const publishDate = normalizeDate(data && data.publishDate);
  if (!publishDate) continue;

  // Frontmatter override wins when present; otherwise parse the real
  // published report body.
  const fromFrontmatter = parseFromFrontmatter(frontmatter, slug);
  const parsed = fromFrontmatter || parseFromBody(body);
  if (!parsed) continue; // not a market-report post, or FMMI section not found/parseable

  entries.push({
    date: publishDate,
    score: parsed.score,
    label: parsed.label,
    signal: parsed.signal,
    sourceSlug: slug,
    subScores: parsed.subScores,
    _parsedFrom: fromFrontmatter ? 'frontmatter' : 'body',
  });
}

entries.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

// Backfill missing sub-score "previousScore" values (body-parsed weeks only
// give this week's number, not last week's) by looking up the nearest
// earlier week that reported the same component - a real number, never a
// guess. If no earlier week reported it, it just stays null (first-ever
// reading for that component).
const lastSeenByName = {};
for (const entry of entries) {
  if (!entry.subScores) continue;
  for (const sub of entry.subScores) {
    if (sub.previousScore === null && lastSeenByName[sub.name] !== undefined) {
      sub.previousScore = lastSeenByName[sub.name];
    }
    lastSeenByName[sub.name] = sub.score;
  }
}

for (const entry of entries) {
  console.log(`  FMMI ${entry.date}: score ${entry.score} (parsed from ${entry._parsedFrom}) - ${entry.sourceSlug}`);
  delete entry._parsedFrom;
}

const outPath = path.join(ROOT, 'src/data/fmmi.generated.json');
fs.writeFileSync(outPath, JSON.stringify(entries, null, 2) + '\n');
console.log(`Generated fmmi.generated.json with ${entries.length} weekly score(s)`);

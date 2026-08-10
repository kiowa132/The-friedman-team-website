// scripts/generate-blog-manifest.mjs
//
// Generates src/data/blogManifest.json at build time - a small plain JSON
// file listing every blog post's slug, title, description, and hero image.
//
// WHY THIS EXISTS: middleware.ts (Vercel Edge Middleware, serves real
// social-crawler-facing meta tags for link previews) can't safely import
// content.ts, since content.ts loads posts via Vite's import.meta.glob,
// which only works inside the actual app bundle, not a standalone edge
// function. This script reads content/blog directly off disk with fs (the
// same approach generate-sitemap.mjs already uses) and writes out a plain
// JSON file that middleware.ts CAN import directly, just like it already
// imports src/data/towns.ts.
//
// Robust against real quirks found in these files: Windows CRLF line
// endings, and YAML values that wrap across multiple lines (either plain
// indented continuation, or explicit `|`/`>` block scalars). A naive
// single-line regex silently truncates those - this extracts the full
// frontmatter block first, then reads each field's complete value
// (including continuation lines) before falling back cleanly if a field
// is missing.
//
// Run automatically before every build (see package.json's "prebuild"
// script) so this can never go stale relative to the real posts.

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
  // Normalize CRLF -> LF first, so every downstream regex only has to
  // handle one line-ending style.
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n/);
  return match ? match[1] : '';
}

function readField(frontmatter, field) {
  const lines = frontmatter.split('\n');
  const startIndex = lines.findIndex((l) => l.startsWith(`${field}:`));
  if (startIndex === -1) return undefined;

  let firstLine = lines[startIndex].slice(field.length + 1).trim();

  // YAML block scalars (`|` literal or `>` folded) - the real value lives
  // on the following indented lines, not on the field's own line.
  if (firstLine === '|' || firstLine === '>') {
    const collected = [];
    for (let i = startIndex + 1; i < lines.length; i++) {
      if (lines[i].startsWith('  ') || lines[i].trim() === '') {
        collected.push(lines[i].trim());
      } else {
        break;
      }
    }
    return collected.join(' ').trim();
  }

  // Plain value that may continue onto subsequent indented lines (YAML's
  // implicit line-folding for a long unquoted or quoted string).
  let value = firstLine;
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (lines[i].startsWith('  ') && !lines[i].trim().startsWith('- ')) {
      value += ' ' + lines[i].trim();
    } else {
      break;
    }
  }

  // Strip a matching pair of surrounding quotes, if present.
  value = value.trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return value.trim();
}

const posts = [];
for (const slug of getMarkdownSlugs('content/blog')) {
  const raw = fs.readFileSync(path.join(ROOT, 'content/blog', `${slug}.md`), 'utf-8');
  const frontmatter = extractFrontmatterBlock(raw);
  const title = readField(frontmatter, 'title');
  const metaDescription = readField(frontmatter, 'metaDescription');
  const heroImage = readField(frontmatter, 'heroImage');
  if (!title) {
    console.warn(`Skipping ${slug}: no title found in frontmatter`);
    continue;
  }
  posts.push({ slug, title, metaDescription: metaDescription || '', heroImage: heroImage || '' });
}

const outPath = path.join(ROOT, 'src/data/blogManifest.json');
fs.writeFileSync(outPath, JSON.stringify(posts, null, 2) + '\n');
console.log(`Generated blogManifest.json with ${posts.length} posts`);

// scripts/generate-sitemap.mjs
//
// Generates public/sitemap.xml from the site's actual real routes and
// content, so Vite copies it into dist/ on every build automatically (see
// the "prebuild" script in package.json). Runs as a plain Node script, not
// through Vite, so it reads content/blog and content/guides directly off
// disk with fs instead of Vite's import.meta.glob (which only works inside
// the app bundle itself, not a standalone build script).
//
// SCOPE: covers every static/CMS-driven page - home, the 30 neighborhood
// pages, all blog posts, and guides. It deliberately does NOT include
// individual /listings/:mlsNumber pages: those are live MLS data with no
// stable list at build time (properties come and go), so a static
// build-time sitemap isn't the right tool for them. If that's wanted
// later, it needs a small dynamic sitemap endpoint (e.g. an /api route
// that queries the MLS feed and returns XML) rather than this script.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://www.friedmanreteam.com';

// --- Static routes, taken directly from src/App.tsx's <Route> list -------
const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/sell', changefreq: 'monthly', priority: '0.8' },
  { path: '/sell/marketing-strategy', changefreq: 'monthly', priority: '0.6' },
  { path: '/buy', changefreq: 'monthly', priority: '0.8' },
  { path: '/neighborhoods', changefreq: 'weekly', priority: '0.9' },
  { path: '/listings', changefreq: 'daily', priority: '0.8' },
  { path: '/contact', changefreq: 'yearly', priority: '0.5' },
  { path: '/blog', changefreq: 'weekly', priority: '0.7' },
  { path: '/guides', changefreq: 'monthly', priority: '0.6' },
  { path: '/luxury', changefreq: 'monthly', priority: '0.6' },
  { path: '/team', changefreq: 'monthly', priority: '0.5' },
  { path: '/giving-back', changefreq: 'yearly', priority: '0.4' },
];

// --- Neighborhood pages, from the same data the site itself renders from -
function getTownSlugs() {
  const townsSrc = fs.readFileSync(path.join(ROOT, 'src/data/towns.ts'), 'utf-8');
  const slugs = [...townsSrc.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]);
  return [...new Set(slugs)];
}

// --- Blog posts and guides, straight off disk (mirrors slugFromPath in
// src/lib/content.ts, and skips any nested subdirectories the same way
// Vite's non-recursive `*.md` glob does) ----------------------------------
function getMarkdownSlugs(dir) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name.replace(/\.md$/, ''));
}

function readFrontmatterDate(dir, slug) {
  try {
    const raw = fs.readFileSync(path.join(ROOT, dir, `${slug}.md`), 'utf-8');
    const match = raw.match(/publishDate:\s*"?(\d{4}-\d{2}-\d{2})"?/);
    return match ? match[1] : undefined;
  } catch {
    return undefined;
  }
}

function xmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

function generate() {
  const entries = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const route of STATIC_ROUTES) {
    entries.push(urlEntry({ loc: `${SITE_URL}${route.path}`, lastmod: today, changefreq: route.changefreq, priority: route.priority }));
  }

  for (const slug of getTownSlugs()) {
    entries.push(
      urlEntry({ loc: `${SITE_URL}/neighborhoods/${slug}`, lastmod: today, changefreq: 'weekly', priority: '0.8' })
    );
  }

  for (const slug of getMarkdownSlugs('content/blog')) {
    entries.push(
      urlEntry({
        loc: `${SITE_URL}/blog/${slug}`,
        lastmod: readFrontmatterDate('content/blog', slug) || today,
        changefreq: 'monthly',
        priority: '0.6',
      })
    );
  }

  for (const slug of getMarkdownSlugs('content/guides')) {
    entries.push(urlEntry({ loc: `${SITE_URL}/guides/${slug}`, lastmod: today, changefreq: 'monthly', priority: '0.6' }));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

  const outPath = path.join(ROOT, 'public/sitemap.xml');
  fs.writeFileSync(outPath, xml);
  console.log(`Generated sitemap.xml with ${entries.length} URLs -> ${path.relative(ROOT, outPath)}`);
}

generate();

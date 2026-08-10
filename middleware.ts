// middleware.ts
//
// PROBLEM: This site is a client-rendered React SPA. index.html carries one
// static <title>/description/og:* block for the entire site, and per-page
// values are only set client-side (see src/lib/usePageMeta.ts) after React
// runs. Social crawlers - Facebook, Instagram, LinkedIn, Slack, iMessage,
// Discord, etc. - do not execute JavaScript when they fetch a link to build
// a preview card, so every shared link (a Westminster guide, a Friedman
// Report post) has shown the generic homepage title/description/image
// instead of that page's own.
//
// FIX: Vercel Edge Middleware runs on every matched request before the SPA
// rewrite in vercel.json takes effect. When the request's User-Agent
// matches a known social-media crawler, this returns a small, real,
// server-rendered HTML document with correct <title>/meta/og:*/twitter:*
// tags for that specific URL - built from the same static town data
// (src/data/towns.ts) the real page renders from, so the two can't drift
// out of sync. Real browsers (i.e. everyone else) are untouched and get
// the normal SPA exactly as before.
//
// SCOPE: covers the homepage, all 30 neighborhood pages, the neighborhoods
// list, every blog post, and every guide. Blog posts are handled via a
// small generated manifest (src/data/blogManifest.json, built by
// scripts/generate-blog-manifest.mjs before every build) since their real
// content loads through Vite's import.meta.glob, which isn't safely
// importable into an Edge Middleware bundle. Guides are plain TypeScript
// data files (src/data/guides), so they're imported directly, the same
// way TOWNS already is.
//
// IMPORTANT CAVEAT: written against Vercel's documented framework-agnostic
// Edge Middleware API (plain Request/Response, no next/server import,
// since this is a Vite project, not Next.js), but could not be live-tested
// against real Vercel infrastructure from this sandbox - no network access
// to deploy or curl a live preview from here. After deploying, verify with
// Facebook's Sharing Debugger (developers.facebook.com/tools/debug) and
// Twitter/X's Card Validator, or simply:
//   curl -A "facebookexternalhit/1.1" https://www.friedmanreteam.com/neighborhoods/westminster
// and confirm the returned HTML has the right <title> and og:image for
// Westminster, not the generic homepage ones. If it doesn't fire at all,
// double check Vercel's project settings recognize this file - some Vercel
// framework presets need "Edge Middleware" confirmed active for non-Next.js
// projects in the dashboard.

import { TOWNS } from './src/data/towns';
import blogManifest from './src/data/blogManifest.json';
import { HANDBOOK_GUIDES } from './src/data/guides';

const SITE_URL = 'https://www.friedmanreteam.com';
const DEFAULT_TITLE = 'The Friedman Team | Carroll, Howard, Frederick & Baltimore County Real Estate';
const DEFAULT_DESCRIPTION =
  'Local, data-driven real estate representation for buyers and sellers across Carroll, Baltimore, Howard, and Frederick County, Maryland.';
const DEFAULT_IMAGE = `${SITE_URL}/images/kyle-portrait.jpg`;

// Known social/link-preview crawlers. Deliberately broad - false positives
// here just mean an extra crawler gets a correct, lightweight HTML response
// instead of the full SPA shell, which is harmless. Googlebot is included
// too: Google can render JS, but serving it accurate meta directly is still
// a small, free assist rather than relying on client-side rendering.
const CRAWLER_UA = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|WhatsApp|TelegramBot|Discordbot|Pinterest|redditbot|Applebot|Googlebot|bingbot|DuckDuckBot|SkypeUriPreview|vkShare|W3C_Validator|Iframely|Embedly|quora|Yahoo! Slurp/i;

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}...`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function metaHtml(opts: { title: string; description: string; image: string; url: string }): string {
  const { title, description, image, url } = opts;
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${image}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="The Friedman Team">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${image}">
</head>
<body></body>
</html>`;
}

export default function middleware(request: Request): Response | undefined {
  const userAgent = request.headers.get('user-agent') || '';
  if (!CRAWLER_UA.test(userAgent)) {
    // Not a known crawler - let the request through untouched.
    return undefined;
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESCRIPTION;
  let image = DEFAULT_IMAGE;

  if (path === '/neighborhoods') {
    title = 'Maryland Neighborhoods & Towns | The Friedman Team';
    description =
      'Explore real, local neighborhood guides across Carroll, Baltimore, Howard, and Frederick County. Real demographics, walkability, schools, and live listings for every town.';
    image = `${SITE_URL}/images/hero/neighborhoods-hero.jpg`;
  } else if (path.startsWith('/neighborhoods/')) {
    const slug = path.slice('/neighborhoods/'.length);
    const town = TOWNS.find((t) => t.slug === slug);
    if (town) {
      title = `${town.name}, MD Real Estate & Neighborhood Guide | The Friedman Team`;
      description = town.content
        ? truncate(town.content.overview, 200)
        : `Homes for sale, local demographics, walkability, and schools in ${town.name}, MD.`;
      image = town.image.startsWith('http') ? town.image : `${SITE_URL}${town.image}`;
    }
    // If the slug doesn't match a real town, fall through to site defaults
    // rather than a broken/empty preview.
  } else if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length);
    const post = (blogManifest as { slug: string; title: string; metaDescription: string; heroImage: string }[]).find((p) => p.slug === slug);
    if (post) {
      title = `${post.title} | The Friedman Team`;
      description = post.metaDescription || DEFAULT_DESCRIPTION;
      image = post.heroImage.startsWith('http') ? post.heroImage : `${SITE_URL}${post.heroImage}`;
    }
    // Unknown slug falls through to site defaults rather than a broken preview.
  } else if (path.startsWith('/guides/')) {
    const slug = path.slice('/guides/'.length);
    const guide = HANDBOOK_GUIDES.find((g) => g.slug === slug);
    if (guide) {
      title = `${guide.title} | The Friedman Team`;
      description = guide.description;
      image = guide.coverImage.startsWith('http') ? guide.coverImage : `${SITE_URL}${guide.coverImage}`;
    }
  }
  // path === '/' falls through to the site defaults set above.

  return new Response(metaHtml({ title, description, image, url: url.toString() }), {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

export const config = {
  matcher: ['/', '/neighborhoods', '/neighborhoods/:slug*', '/blog/:slug*', '/guides/:slug*'],
};

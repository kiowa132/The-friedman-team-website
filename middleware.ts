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
// SCOPE: covers effectively every page on the site - homepage, all 30
// neighborhood pages, every blog post, every guide, the full Maryland
// Professional Network section (general pages plus every member profile,
// using that member's own real headshot), every mentor transaction
// detail page, and every other static page (about, team, sell, buy,
// listings, contact, testimonials, giving back, calculators, luxury,
// Zillow Showcase, senior relocation, legal pages). Per Kyle's direction,
// only /about and /team show his portrait - every other page uses the
// site logo mark instead of a personal photo, unless that specific page
// has its own real hero image (luxury, Zillow Showcase, senior
// relocation, or a specific transaction's listing photo).
//
// ONE KNOWN GAP: individual listing pages (/listings/:mlsNumber) are not
// covered - that data is live MLS data fetched client-side at runtime,
// not a static file this middleware can import the way everything else
// here is. A crawler hitting a specific listing URL currently falls
// through to the general /listings preview rather than a broken one.
// Making that fully per-listing would mean this middleware calling the
// live MLS API itself on every crawler hit - a real, separate feature
// worth building deliberately and testing, not bolting on here.
//
// Blog posts are handled via a small generated manifest
// (src/data/blogManifest.json, built by scripts/generate-blog-manifest.mjs
// before every build) since their real content loads through Vite's
// import.meta.glob, which isn't safely importable into an Edge
// Middleware bundle. Guides, network members, and mentor transactions
// are plain TypeScript data files, so they're imported directly, the
// same way TOWNS already is.
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
import listingsManifest from './src/data/listingsManifest.json';
import { HANDBOOK_GUIDES } from './src/data/guides';
import { NETWORK_MEMBERS, isPlaceholder } from './src/data/network';
import { MENTOR_TRANSACTIONS } from './src/data/mentorTransactions';

const SITE_URL = 'https://www.friedmanreteam.com';
const DEFAULT_TITLE = 'The Friedman Team | Carroll, Howard, Frederick & Baltimore County Real Estate';
const DEFAULT_DESCRIPTION =
  'Local, data-driven real estate representation for buyers and sellers across Carroll, Baltimore, Howard, and Frederick County, Maryland.';
const DEFAULT_IMAGE = `${SITE_URL}/images/kyle-portrait.jpg`;
// Neutral fallback for pages that aren't about Kyle personally - the site
// logo mark, not his face. Per his direction, only /about (and /team,
// which already deliberately uses his portrait) show his photo; every
// other page gets this instead.
const GENERIC_DEFAULT_IMAGE = `${SITE_URL}/favicon-192.png`;

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
  } else if (path.startsWith('/network/members/')) {
    const slug = path.slice('/network/members/'.length);
    const member = NETWORK_MEMBERS.find((m) => m.slug === slug);
    if (member) {
      title = `${member.name} | Maryland Professional Network`;
      description = !isPlaceholder(member.bio)
        ? truncate(member.bio.split('\n\n')[0], 200)
        : `${member.name} - ${member.industry}, Maryland Professional Network.`;
      image = !isPlaceholder(member.headshot)
        ? (member.headshot.startsWith('http') ? member.headshot : `${SITE_URL}${member.headshot}`)
        : GENERIC_DEFAULT_IMAGE;
    }
    // Unknown slug falls through to network defaults below rather than a broken preview.
    else {
      title = 'Member Not Found | Maryland Professional Network';
      image = GENERIC_DEFAULT_IMAGE;
    }
  } else if (path === '/network') {
    title = 'The Maryland Professional Network | The Friedman Team';
    description = 'A curated network of trusted Maryland professionals connecting, referring business, and helping one another grow.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/network/directory') {
    title = 'Directory | Maryland Professional Network';
    description = 'Search the Maryland Professional Network by name, industry, county, or specialty to find a trusted professional.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/network/join') {
    title = 'Apply to Join | Maryland Professional Network';
    description = 'Apply to join The Maryland Professional Network, a curated group of Maryland professionals building meaningful relationships and referring business.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/network/about') {
    title = 'About | Maryland Professional Network';
    description = 'About The Maryland Professional Network, a curated group of trusted Maryland professionals founded by Kyle Friedman.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/network/events') {
    title = 'Events | Maryland Professional Network';
    description = 'Small, curated events and roundtables for members of The Maryland Professional Network - coming soon.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/about') {
    title = 'Kyle Friedman | Realtor, The Friedman Team | Carroll County, MD';
    description = 'Meet Kyle Friedman, Real Estate Professional & Expert Negotiator with The Friedman Team at eXp Realty, serving Carroll, Baltimore, Howard, and Frederick County, Maryland.';
    image = DEFAULT_IMAGE;
  } else if (path === '/team') {
    title = 'Meet the Team | The Friedman Team';
    description = 'Your Listing Agent, Home Prep Advisor, and Transaction Coordinator: the full team behind every Friedman Team sale.';
    image = DEFAULT_IMAGE;
  } else if (path === '/sell/marketing-strategy') {
    title = 'What Actually Happens When You List | The Friedman Team';
    description = "Step by step, here's exactly what happens when you list your home with The Friedman Team, from pre-launch prep to closing day.";
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/sell') {
    title = 'Sell Your Home in Carroll or Baltimore County, MD | The Friedman Team';
    description = 'Get a data-driven pricing strategy and marketing plan to sell your home for more in Carroll, Howard, Frederick, or Baltimore County.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/buy') {
    title = 'Find a Home in Carroll or Baltimore County, MD | The Friedman Team';
    description = 'Searching for a home in Carroll, Howard, Frederick, or Baltimore County? The Friedman Team helps buyers find the right property with a real strategy, not just a search.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path.startsWith('/listings/')) {
    // Hand-curated "sign listing" pages (content/listings/*.md), imported
    // here via the generated listingsManifest.json - the same disk-read
    // manifest pattern as blogManifest. Live MLS-number pages
    // (/listings/:mlsNumber) and the /listings/active redirect aren't in
    // the manifest and fall through to the general /listings preview.
    const slug = path.slice('/listings/'.length);
    const listing = (listingsManifest as {
      slug: string; status: string; streetAddress: string; cityStateZip: string;
      listPrice: string; beds: string; baths: string; sqft: string; heroImage: string;
    }[]).find((l) => l.slug === slug);
    if (listing) {
      title = `${[listing.streetAddress, listing.cityStateZip].filter(Boolean).join(', ')} | The Friedman Team`;
      const facts = [
        listing.beds && `${listing.beds} bed`,
        listing.baths && `${listing.baths} bath`,
        listing.sqft && `${listing.sqft} sq ft`,
      ].filter(Boolean).join(' / ');
      description = [listing.status, listing.listPrice, facts].filter(Boolean).join(' · ')
        + ' — presented by Kyle Friedman, The Friedman Team.';
      image = listing.heroImage
        ? (listing.heroImage.startsWith('http') ? listing.heroImage : `${SITE_URL}${listing.heroImage}`)
        : GENERIC_DEFAULT_IMAGE;
    } else {
      title = 'Homes for Sale | Carroll, Baltimore, Howard & Frederick County, MD';
      description = 'Search current homes for sale across Carroll, Baltimore, Howard, and Frederick County, Maryland with The Friedman Team.';
      image = GENERIC_DEFAULT_IMAGE;
    }
  } else if (path === '/listings') {
    title = 'Homes for Sale | Carroll, Baltimore, Howard & Frederick County, MD';
    description = 'Search current homes for sale across Carroll, Baltimore, Howard, and Frederick County, Maryland with The Friedman Team.';
    image = GENERIC_DEFAULT_IMAGE;
    // Live MLS-number listing pages (/listings/:mlsNumber) are still not
    // covered - that data is fetched client-side at runtime (see
    // src/lib/mlsApi.ts), not a static file. A crawler hitting one falls
    // through to this general listings preview rather than a broken one.
  } else if (path === '/contact') {
    title = 'Contact The Friedman Team | Kyle Friedman, eXp Realty';
    description = 'Get in touch with Kyle Friedman and The Friedman Team - buying, selling, or just exploring your options in Carroll, Baltimore, Howard, or Frederick County, Maryland.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/testimonials') {
    title = 'Client Testimonials | The Friedman Team';
    description = 'Real client reviews for Kyle Friedman and The Friedman Team, serving Carroll, Baltimore, Howard, and Frederick County, Maryland.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/giving-back') {
    title = 'Giving Back | The Friedman Team';
    description = 'Every referral to The Friedman Team means a real donation to a cause you care about, at closing.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/privacy-policy') {
    title = 'Privacy Policy | The Friedman Team';
    description = 'How The Friedman Team collects, uses, and protects your information.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/terms-of-use') {
    title = 'Terms of Use | The Friedman Team';
    description = 'The terms governing your use of The Friedman Team website.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/calculators/mortgage') {
    title = 'Mortgage Calculator | The Friedman Team';
    description = 'Estimate your monthly mortgage payment, including principal, interest, taxes, and insurance.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/calculators/affordability') {
    title = 'Affordability Calculator | The Friedman Team';
    description = 'Estimate how much home you can afford, including real cash-to-close costs for Maryland first-time homebuyers.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/calculators/net-proceeds') {
    title = 'Home Sale Net Proceeds Calculator | The Friedman Team';
    description = 'Estimate what you could walk away with after selling your Maryland home, in any county.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/calculators') {
    title = 'Real Estate Calculators | The Friedman Team';
    description = 'Free mortgage, affordability, and net proceeds calculators for Maryland buyers and sellers.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path.startsWith('/transactions/')) {
    const slug = path.slice('/transactions/'.length);
    const txn = MENTOR_TRANSACTIONS.find((t) => t.slug === slug);
    if (txn) {
      title = `${txn.address}, ${txn.cityStateZip} | The Friedman Team`;
      description = truncate(txn.description, 200);
      image = txn.image ? (txn.image.startsWith('http') ? txn.image : `${SITE_URL}${txn.image}`) : GENERIC_DEFAULT_IMAGE;
    }
    // Unknown slug falls through to /past-transactions-style defaults below.
  } else if (path === '/past-transactions') {
    title = 'Mentorship & Team Experience | The Friedman Team';
    description = 'Building on proven strategies, systems, and transaction experience from experienced real estate professionals within eXp Realty.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/videos') {
    title = 'Videos | The Friedman Team';
    description = 'Market updates, neighborhood tours, and real talk about buying and selling in Maryland from Kyle Friedman.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/financing-options') {
    title = 'Financing Options | The Friedman Team';
    description = 'A real, plain-language overview of conventional, FHA, VA, USDA, and Maryland Mortgage Program loans.';
    image = GENERIC_DEFAULT_IMAGE;
  } else if (path === '/luxury') {
    title = 'Fine Homes & Estate Properties | The Friedman Team';
    description = 'Distinctive homes and estate properties across Carroll, Howard, Frederick, and Baltimore County, marketed and represented with the presentation they deserve.';
    image = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80';
  } else if (path === '/zillow-showcase') {
    title = 'Zillow Showcase | The Friedman Team';
    description = 'Zillow Showcase gives eligible listings premium placement, interactive floor plans, and professional media on Zillow - available for select Friedman Team listings.';
    image = `${SITE_URL}/images/zillow-showcase/blog-thumbnail.jpg`;
  } else if (path === '/senior-relocation') {
    title = 'Senior Relocation Services | The Friedman Team';
    description = 'A thoughtful, expertly handled transition for homeowners downsizing or relocating later in life - right-sizing guidance, home preparation, sale strategy, and coordinated moving support.';
    image = `${SITE_URL}/images/senior-relocation/banner-crop.jpg`;
  }
  // path === '/' falls through to the site defaults set above.

  // The canonical tag always points to a clean, normalized URL (site
  // domain + trailing-slash-stripped path) regardless of how the page was
  // actually requested - never the raw request URL. Without this, a
  // trailing slash or a tracking parameter (e.g. ?utm_source=facebook)
  // produced a canonical tag pointing right back at that exact variant,
  // which is what caused Search Console's "Duplicate without user-selected
  // canonical" and "Google chose a different canonical than user" issues.
  return new Response(metaHtml({ title, description, image, url: `${SITE_URL}${path}` }), {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

export const config = {
  matcher: [
    '/', '/neighborhoods', '/neighborhoods/:slug*', '/blog/:slug*', '/guides/:slug*',
    '/network', '/network/directory', '/network/members/:slug*', '/network/join', '/network/about', '/network/events',
    '/about', '/team', '/sell', '/sell/marketing-strategy', '/buy', '/listings', '/listings/:slug*', '/contact',
    '/testimonials', '/giving-back', '/privacy-policy', '/terms-of-use',
    '/calculators', '/calculators/mortgage', '/calculators/affordability', '/calculators/net-proceeds',
    '/past-transactions', '/transactions/:slug*', '/videos', '/financing-options',
    '/luxury', '/zillow-showcase', '/senior-relocation',
  ],
};

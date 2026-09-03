/// <reference types="vite/client" />
import { marked } from 'marked';
import { BlogPost, Guide, SignListing } from '../types';
import { normalizePublishDate } from './formatDate';
// Generated in "prebuild" by scripts/generate-listings-manifest.mjs. Used
// here only for the per-listing photo folder scan (public/images/listings/
// <slug>/) so a batch photo upload shows up without any CMS photo entry.
import listingsManifest from '../data/listingsManifest.json';
// Generated in "prebuild" by scripts/fetch-sign-listing-data.mjs - one
// build-time Lofty pull per sign listing (address, price, beds/baths/sqft,
// status, photo gallery, remarks), so the page renders instantly with no
// live API call. Merged below UNDER any CMS override field.
import signListingsData from '../data/signListingsData.json';

// gray-matter (a common frontmatter-parsing library) relies on Node.js's
// Buffer internally, which doesn't exist in the browser and crashes the
// whole site on load. This is a small hand-written replacement that only
// needs to handle the schema our content actually uses: scalar "key: value"
// lines, simple YAML lists (both inline `[]` and the multi-line "- item"
// form Decap CMS writes for list fields), YAML "|" block literals, and
// wrapped plain scalars (a value that continues on indented lines below
// the key, which Decap CMS writes for any long single-line text field).
//
// The two multi-line forms matter in practice: without handling them, a
// long metaDescription either came out as the literal string "|" (for the
// "|" block form) or silently truncated to just its first line (for the
// wrapped-plain-scalar form) - both are real bugs that were shipping
// wrong/broken meta descriptions, not just a theoretical gap.
function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  // Normalize Windows line endings first. Several content files were saved
  // with CRLF, and without this every scalar value ends up with a stray
  // trailing \r baked in - which then also survives the quote-stripping
  // step below, since the regex only strips a quote at the very end of the
  // string, not a quote followed by an invisible \r.
  const normalized = raw.replace(/\r\n/g, '\n');

  const match = normalized.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: normalized };

  const [, frontmatterBlock, content] = match;
  const data: Record<string, any> = {};
  const lines = frontmatterBlock.split('\n');

  const stripQuotes = (s: string) => s.trim().replace(/^["']|["']$/g, '');
  const indentOf = (s: string) => s.match(/^\s*/)?.[0].length ?? 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (!keyMatch) continue;

    const [, key, rest] = keyMatch;

    if (rest === '|' || rest === '>') {
      // YAML block scalar: every following line indented more than the key
      // belongs to the value. "|" keeps line breaks; ">" folds them into
      // spaces - our content only ever needs plain text either way, so
      // both are joined with spaces here.
      const parts: string[] = [];
      let j = i + 1;
      while (j < lines.length && (lines[j].trim() === '' || indentOf(lines[j]) > 0)) {
        if (lines[j].trim() !== '') parts.push(lines[j].trim());
        j++;
      }
      data[key] = parts.join(' ');
      i = j - 1;
    } else if (rest === '' || rest === undefined) {
      // Possible multi-line list: collect following "  - item" lines.
      const items: string[] = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s*/.test(lines[j])) {
        items.push(stripQuotes(lines[j].replace(/^\s*-\s*/, '')));
        j++;
      }
      if (items.length > 0) {
        data[key] = items;
        i = j - 1;
        continue;
      }
      data[key] = '';
    } else if (rest === '[]') {
      data[key] = [];
    } else {
      // Scalar value, possibly wrapped: Decap CMS line-folds long plain
      // (unquoted) text fields onto indented continuation lines with no
      // "-" prefix. Quoted values ("...") are never wrapped this way, so
      // only fold when the value doesn't start with a quote.
      const parts = [rest];
      if (!/^["']/.test(rest.trim())) {
        let j = i + 1;
        while (j < lines.length && indentOf(lines[j]) > 0 && !/^\s*-\s*/.test(lines[j]) && !/^\s*\w+:/.test(lines[j])) {
          parts.push(lines[j].trim());
          j++;
        }
        i = j - 1;
      }
      data[key] = stripQuotes(parts.join(' '));
    }
  }

  return { data, content: content.trim() };
}

// Loads every .md file in content/blog and content/guides at build time,
// parses the frontmatter (title, category, etc.) and converts the markdown
// body to HTML. This is what Decap CMS actually edits - each file here is
// one entry in the CMS admin screen.
const blogFiles = import.meta.glob('/content/blog/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const guideFiles = import.meta.glob('/content/guides/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const listingFiles = import.meta.glob('/content/listings/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

function slugFromPath(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1].replace(/\.md$/, '');
}

export const BLOG_POSTS: BlogPost[] = Object.entries(blogFiles)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    return {
      slug: slugFromPath(path),
      title: data.title || 'Untitled',
      metaDescription: data.metaDescription || '',
      category: data.category || 'Market Reports',
      publishDate: normalizePublishDate(data.publishDate),
      heroImage: data.heroImage || '',
      youtubeVideoId: data.youtubeVideoId || '',
      youtubeIsShort: data.youtubeIsShort === true || data.youtubeIsShort === 'true',
      youtubeVideoId2: data.youtubeVideoId2 || '',
      youtubeIsShort2: data.youtubeIsShort2 === true || data.youtubeIsShort2 === 'true',
      carouselImages: data.carouselImages || [],
      bodyHtml: marked.parse(content || '') as string,
      relatedGuideSlug: data.relatedGuideSlug || undefined,
      relatedAreaSlug: data.relatedAreaSlug || undefined,
    };
  })
  .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

export const GUIDES: Guide[] = Object.entries(guideFiles).map(([path, raw]) => {
  const { data, content } = parseFrontmatter(raw);
  return {
    slug: slugFromPath(path),
    title: data.title || 'Untitled',
    description: data.description || '',
    coverImage: data.coverImage || '',
    pdfUrl: data.pdfUrl || undefined,
    relatedPostSlug: data.relatedPostSlug || undefined,
    previewPoints: data.previewPoints || [],
    fullContentHtml: marked.parse(content || '') as string,
    publuuEmbedUrl: data.publuuEmbedUrl || undefined,
    flipbookPages: data.flipbookPages || undefined,
  };
});

// Hand-curated "sign listings" - one .md per slot in content/listings/.
// These back /listings/<slug> pages and the /listings/active redirect
// (see src/pages/SignListingPage.tsx and ActiveListingRedirect). Each field
// layers: CMS override -> Lofty data baked at build time
// (signListingsData.json) -> the batch-uploaded photo folder
// (public/images/listings/<slug>/). No runtime API call.
const listingMediaBySlug = Object.fromEntries(
  (listingsManifest as { slug: string; hero?: string; photos?: string[] }[]).map((m) => [m.slug, m])
);
const bakedLoftyBySlug = signListingsData as Record<string, Record<string, any>>;

// First non-empty value wins. Used to layer: CMS override -> baked Lofty -> ''.
const firstFilled = (...vals: any[]): string => {
  for (const v of vals) {
    if (v != null && String(v).trim() !== '') return String(v);
  }
  return '';
};
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const SIGN_LISTINGS: SignListing[] = Object.entries(listingFiles).map(([path, raw]) => {
  const { data, content } = parseFrontmatter(raw);
  const slug = slugFromPath(path);
  const media = listingMediaBySlug[slug] || {};
  const lofty = bakedLoftyBySlug[slug] || {};
  const folderPhotos = Array.isArray(media.photos) ? media.photos : [];
  const cmsPhotos = Array.isArray(data.photos) ? data.photos : [];
  const loftyPhotos = Array.isArray(lofty.gallery) ? lofty.gallery : [];
  // Photos: what Kyle put in the CMS, else the batch-uploaded folder, else
  // whatever Lofty had.
  const photos = cmsPhotos.length ? cmsPhotos : folderPhotos.length ? folderPhotos : loftyPhotos;

  const bodyHtml = content && content.trim() ? (marked.parse(content) as string) : '';
  const loftyDescHtml = lofty.description
    ? `<p>${escapeHtml(String(lofty.description)).replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
    : '';

  return {
    slug,
    active: data.active === true || data.active === 'true',
    status: firstFilled(data.status, lofty.status),
    streetAddress: firstFilled(data.streetAddress, lofty.streetAddress),
    cityStateZip: firstFilled(data.cityStateZip, lofty.cityStateZip),
    listPrice: firstFilled(data.listPrice, lofty.listPrice),
    beds: firstFilled(data.beds, lofty.beds),
    baths: firstFilled(data.baths, lofty.baths),
    sqft: firstFilled(data.sqft, lofty.sqft),
    lotSize: firstFilled(data.lotSize, lofty.lotSize),
    yearBuilt: firstFilled(data.yearBuilt, lofty.yearBuilt),
    mlsId: data.mlsId || '',
    tourUrl: firstFilled(data.tourUrl, lofty.tourUrl),
    heroImage: firstFilled(data.heroImage, media.hero, photos[0]),
    photos,
    highlightsHtml: bodyHtml || loftyDescHtml,
  };
});

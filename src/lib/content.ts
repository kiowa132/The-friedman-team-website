/// <reference types="vite/client" />
import { marked } from 'marked';
import { BlogPost, Guide, SignListing } from '../types';
import { normalizePublishDate } from './formatDate';
// Generated in "prebuild" by scripts/generate-listings-manifest.mjs. Used
// here only for the per-listing photo folder scan (public/images/listings/
// <slug>/) so a batch photo upload shows up without any CMS photo entry.
import listingsManifest from '../data/listingsManifest.json';

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
// (see src/pages/SignListingPage.tsx and ActiveListingRedirect). Any field
// left blank falls back to the photo folder (public/images/listings/<slug>/)
// and then, on the page itself, to a live Lofty lookup by MLS number.
const listingMediaBySlug = Object.fromEntries(
  (listingsManifest as { slug: string; hero?: string; photos?: string[] }[]).map((m) => [m.slug, m])
);

export const SIGN_LISTINGS: SignListing[] = Object.entries(listingFiles).map(([path, raw]) => {
  const { data, content } = parseFrontmatter(raw);
  const slug = slugFromPath(path);
  const media = listingMediaBySlug[slug] || {};
  const folderPhotos = Array.isArray(media.photos) ? media.photos : [];
  const cmsPhotos = Array.isArray(data.photos) ? data.photos : [];
  const photos = folderPhotos.length ? folderPhotos : cmsPhotos;
  return {
    slug,
    active: data.active === true || data.active === 'true',
    status: data.status || '',
    streetAddress: data.streetAddress || '',
    cityStateZip: data.cityStateZip || '',
    listPrice: data.listPrice || '',
    beds: data.beds != null ? String(data.beds) : '',
    baths: data.baths != null ? String(data.baths) : '',
    sqft: data.sqft != null ? String(data.sqft) : '',
    lotSize: data.lotSize != null ? String(data.lotSize) : '',
    yearBuilt: data.yearBuilt != null ? String(data.yearBuilt) : '',
    mlsId: data.mlsId || '',
    tourUrl: data.tourUrl || '',
    heroImage: data.heroImage || media.hero || photos[0] || '',
    photos,
    highlightsHtml: marked.parse(content || '') as string,
  };
});

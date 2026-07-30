/// <reference types="vite/client" />
import { marked } from 'marked';
import { BlogPost, Guide } from '../types';

// gray-matter (a common frontmatter-parsing library) relies on Node.js's
// Buffer internally, which doesn't exist in the browser and crashes the
// whole site on load. This is a small hand-written replacement that only
// needs to handle the simple schema our content actually uses: scalar
// "key: value" lines and simple YAML lists (both inline `[]` and the
// multi-line "- item" form Decap CMS writes for list fields).
function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const [, frontmatterBlock, content] = match;
  const data: Record<string, any> = {};
  const lines = frontmatterBlock.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (!keyMatch) continue;

    const [, key, rest] = keyMatch;

    if (rest === '' || rest === undefined) {
      // Possible multi-line list: collect following "  - item" lines.
      const items: string[] = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s*/.test(lines[j])) {
        items.push(lines[j].replace(/^\s*-\s*/, '').trim().replace(/^["']|["']$/g, ''));
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
      // Strip surrounding quotes if present.
      data[key] = rest.replace(/^["']|["']$/g, '');
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
      publishDate: data.publishDate || new Date().toISOString().slice(0, 10),
      heroImage: data.heroImage || '',
      youtubeVideoId: data.youtubeVideoId || '',
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
  };
});

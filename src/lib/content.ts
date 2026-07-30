/// <reference types="vite/client" />
import matter from 'gray-matter';
import { marked } from 'marked';
import { BlogPost, Guide } from '../types';

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
    const { data, content } = matter(raw);
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
  const { data } = matter(raw);
  return {
    slug: slugFromPath(path),
    title: data.title || 'Untitled',
    description: data.description || '',
    coverImage: data.coverImage || '',
    pdfUrl: data.pdfUrl || undefined,
    relatedPostSlug: data.relatedPostSlug || undefined,
  };
});

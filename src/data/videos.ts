// Every video shown on /videos is pulled directly from blog post
// frontmatter (youtubeVideoId / youtubeVideoId2, set via the CMS or
// directly in a post's frontmatter) - there is nothing to manually
// maintain here. Publish a post with a video ID set and it appears here
// automatically on the next build.
import { BLOG_POSTS } from '../lib/content';

export interface VideoEntry {
  title: string;
  description: string;
  youtubeId: string;
  isShort?: boolean; // true for vertical YouTube Shorts (9:16) vs standard landscape videos (16:9)
  publishDate: string; // "YYYY-MM-DD"
  sourceSlug: string;
}

export const VIDEOS: VideoEntry[] = BLOG_POSTS.flatMap((post) => {
  const entries: VideoEntry[] = [];
  if (post.youtubeVideoId) {
    entries.push({
      title: post.title,
      description: post.metaDescription,
      youtubeId: post.youtubeVideoId,
      isShort: post.youtubeIsShort,
      publishDate: post.publishDate,
      sourceSlug: post.slug,
    });
  }
  if (post.youtubeVideoId2) {
    entries.push({
      title: post.title,
      description: post.metaDescription,
      youtubeId: post.youtubeVideoId2,
      isShort: post.youtubeIsShort2,
      publishDate: post.publishDate,
      sourceSlug: post.slug,
    });
  }
  return entries;
}).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

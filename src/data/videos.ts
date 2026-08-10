// Real videos Kyle has published (YouTube uploads, Reels reposted to
// YouTube, etc.). Only add real, published videos here - use the actual
// YouTube video ID (the part after "v=" or after "youtu.be/" in the URL).

export interface VideoEntry {
  title: string;
  description: string;
  youtubeId: string;
  isShort?: boolean; // true for vertical YouTube Shorts (9:16) vs standard landscape videos (16:9)
  publishDate: string; // "YYYY-MM-DD"
}

export const VIDEOS: VideoEntry[] = [
  {
    title: 'Maryland Housing Market Update: Week of August 3\u20139, 2026',
    description: 'This week\'s Maryland market numbers, explained \u2014 closings, pending contracts, mortgage rates, and what it means for buyers and sellers.',
    youtubeId: 'pLw1zeMCZ5E',
    isShort: true,
    publishDate: '2026-08-09',
  },
];

// Real videos Kyle has published (YouTube uploads, Reels reposted to
// YouTube, etc.). Only add real, published videos here - use the actual
// YouTube video ID (the part after "v=" or after "youtu.be/" in the URL).

export interface VideoEntry {
  title: string;
  description: string;
  youtubeId: string;
  publishDate: string; // "YYYY-MM-DD"
}

export const VIDEOS: VideoEntry[] = [
  // Add real videos here, e.g.:
  // {
  //   title: 'The Friedman Report: Week of August 3, 2026',
  //   description: 'This week\'s Carroll County market numbers, explained.',
  //   youtubeId: 'dQw4w9WgXcQ',
  //   publishDate: '2026-08-03',
  // },
];

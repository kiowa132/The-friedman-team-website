import { BlogPost, Guide } from '../types';

// Real content structure for The Friedman Report. This is a starter post
// showing the full system working end-to-end (video embed, carousel,
// guide CTA, related area link). Add new posts by copying this pattern -
// or once Decap CMS is wired up, through the /admin editor screen instead.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'carroll-county-market-update-july-2026',
    title: 'Carroll County Market Update: July 2026',
    metaDescription: "This week's real numbers on Carroll County inventory, pricing, and what it means if you're buying or selling right now.",
    category: 'Market Reports',
    publishDate: '2026-07-30',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    // TODO: replace with your real YouTube video ID once you upload the
    // short-form video for this post (the part after "v=" in the URL,
    // or after "youtu.be/").
    youtubeVideoId: '',
    carouselImages: [],
    body: [
      "Inventory in Carroll County is tighter than it's been in months. If you've been waiting for more competition to ease up before listing, the data says now is worth a serious look.",
      "Here's what I'm actually seeing on the ground, not just what the aggregate numbers say: well-priced homes in Westminster and Eldersburg are getting real showings in the first week, and the ones sitting are almost always priced against last year's comps instead of this month's.",
      "For buyers, that tighter inventory means less room to lowball, but it also means the homes that are overpriced are staying overpriced longer - there's still room to negotiate on the properties that have sat for 30+ days.",
      "If you're thinking about either side of this, the honest answer is it depends on your specific street, not the county average. That's exactly what a real comparative market analysis is for.",
    ],
    relatedGuideSlug: 'carroll-county-seller-guide',
    relatedAreaSlug: 'carroll-county',
  },
];

export const GUIDES: Guide[] = [
  {
    slug: 'carroll-county-seller-guide',
    title: "The Carroll County Seller's Guide",
    description: 'A straight-talk breakdown of pricing strategy, timing, and what actually moves a home in this market - not generic advice, the real local numbers.',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    // TODO: once you have a real PDF, upload it to /public/guides/ and set
    // this to the path, e.g. '/guides/carroll-county-seller-guide.pdf'
    pdfUrl: '',
    relatedPostSlug: 'carroll-county-market-update-july-2026',
  },
];

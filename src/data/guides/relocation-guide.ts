import { HandbookGuide } from '../../types/handbook';

// The Relocation Survival Guide. Source files were named/organized like a
// copy of the Seller's Guide project (stale filenames left over from
// duplicating that template), but every page's actual visible content was
// checked individually - this is genuine, distinct relocation content:
// timing, budgeting for a move, choosing a Maryland community, coordinating
// a simultaneous sale and purchase, movers, decluttering, packing, and
// building a relocation team. Nothing here overlaps with the Seller's
// Guide's own content, which remains a separate, unrelated guide.
export const relocationGuide: HandbookGuide = {
  slug: 'relocation-survival-guide',
  title: 'The Relocation Survival Guide',
  subtitle: 'A Practical Guide to Moving, Selling, Buying, and Starting Fresh in Maryland.',
  edition: '2026 Edition',
  description: 'A practical, step-by-step guide for anyone selling, buying, and moving at the same time - budgeting, timing, choosing a Maryland community, and coordinating both transactions without losing your mind.',
  category: 'For Relocating Buyers & Sellers',
  estimatedReadMinutes: 15,
  lastUpdated: 'August 2026',
  pageCount: 18,
  coverImage: '/images/guides/maryland-relocation-guide/page-01-cover.jpg',
  pdfUrl: '/guides/friedman-team-maryland-relocation-guide.pdf',
  whatsInside: [
    'The real, full cost of relocating - not just the purchase price',
    'Sell first, buy first, or coordinate both: weighing the trade-offs',
    'A realistic 90-day-out relocation timeline',
    'Eleven things worth checking before choosing a Maryland community',
    'Vetting movers, decluttering, and packing without losing your mind',
    'Building the right team: eleven roles worth knowing',
  ],
  pages: [
    { image: '/images/guides/maryland-relocation-guide/page-01-cover.jpg', label: 'Cover' },
    { image: '/images/guides/maryland-relocation-guide/page-02-toc.jpg', label: 'Table of Contents' },
    { image: '/images/guides/maryland-relocation-guide/page-03.jpg', label: "Start With The 'Why'" },
    { image: '/images/guides/maryland-relocation-guide/page-04.jpg', label: 'Define Your New Life' },
    { image: '/images/guides/maryland-relocation-guide/page-05.jpg', label: 'The Relocation Budget' },
    { image: '/images/guides/maryland-relocation-guide/page-06.jpg', label: 'Should You Sell Before You Buy?' },
    { image: '/images/guides/maryland-relocation-guide/page-07.jpg', label: 'Preparing Your Home for Sale' },
    { image: '/images/guides/maryland-relocation-guide/page-08.jpg', label: "What Determines Your Home's Value" },
    { image: '/images/guides/maryland-relocation-guide/page-09.jpg', label: "Build Your Buyer's Profile" },
    { image: '/images/guides/maryland-relocation-guide/page-10.jpg', label: 'Choosing the Right Community' },
    { image: '/images/guides/maryland-relocation-guide/page-11.jpg', label: 'The Right House vs. The Right Fit' },
    { image: '/images/guides/maryland-relocation-guide/page-12.jpg', label: 'The Relocation Timeline' },
    { image: '/images/guides/maryland-relocation-guide/page-13.jpg', label: 'Coordinate Selling and Buying' },
    { image: '/images/guides/maryland-relocation-guide/page-14.jpg', label: 'Choosing a Moving Company' },
    { image: '/images/guides/maryland-relocation-guide/page-15.jpg', label: 'The Decluttering Decision' },
    { image: '/images/guides/maryland-relocation-guide/page-16.jpg', label: 'Packing Without Losing Your Mind' },
    { image: '/images/guides/maryland-relocation-guide/page-17.jpg', label: 'Build Your Relocation Team' },
    { image: '/images/guides/maryland-relocation-guide/page-18-cta.jpg', label: 'Your Next Move Starts With a Plan' },
  ],
};

import { HandbookGuide } from '../../types/handbook';

// The 2026 Maryland Home Seller's Guide - real, finished 14-page document.
//
// One real gap to flag: the printed Table of Contents page lists a
// Chapter 7, "Getting Your Home Ready for Showings," but no page for it
// was included in the delivered file set (files jump from Chapter 6
// straight to Chapter 8). The interactive table of contents below only
// lists the chapters that actually have a page, so navigation stays
// accurate - but the printed TOC graphic itself still shows "07" since
// that's baked into the image. Swap in the missing page whenever it's
// available and add it to the `pages` array between page-08 and page-09.
export const sellerGuide: HandbookGuide = {
  slug: 'seller-guide-2026',
  title: "The 2026 Home Seller's Guide",
  subtitle: 'A complete, county-specific walkthrough for selling your Maryland home for the most money, with the least stress.',
  edition: '2026 Edition',
  description: 'From "should you sell now" through closing day - pricing strategy, which repairs actually matter, negotiating offers, and what to do if your home doesn\u2019t sell right away.',
  category: 'For Sellers',
  estimatedReadMinutes: 14,
  lastUpdated: 'August 2026',
  pageCount: 14,
  coverImage: '/images/guides/seller-guide-2026/page-01-cover.jpg',
  pdfUrl: '/guides/friedman-team-seller-guide-2026.pdf',
  whatsInside: [
    '14 premium pages, Maryland-specific from cover to close',
    'Which repairs actually matter before listing (and which don\u2019t)',
    'Pricing strategy and how comps really work',
    'Evaluating and negotiating offers with confidence',
    'What to do if your home doesn\u2019t sell right away',
  ],
  pages: [
    { image: '/images/guides/seller-guide-2026/page-01-cover.jpg', label: 'Cover' },
    { image: '/images/guides/seller-guide-2026/page-02-toc.jpg', label: 'Table of Contents' },
    { image: '/images/guides/seller-guide-2026/page-03.jpg', label: 'Should You Sell Your Maryland Home Now?' },
    { image: '/images/guides/seller-guide-2026/page-04.jpg', label: 'How Much Is Your Maryland Home Worth?' },
    { image: '/images/guides/seller-guide-2026/page-05.jpg', label: 'Preparing Your Maryland Home for Market' },
    { image: '/images/guides/seller-guide-2026/page-06.jpg', label: 'Which Repairs Actually Matter?' },
    { image: '/images/guides/seller-guide-2026/page-07.jpg', label: 'Pricing Your Maryland Home' },
    { image: '/images/guides/seller-guide-2026/page-08.jpg', label: 'Photography, Marketing & First Impressions' },
    // Chapter 7 in the printed TOC, "Getting Your Home Ready for
    // Showings," is missing here - see the note above.
    { image: '/images/guides/seller-guide-2026/page-09.jpg', label: 'Evaluating & Negotiating Offers' },
    { image: '/images/guides/seller-guide-2026/page-10.jpg', label: 'Inspection & Appraisal' },
    { image: '/images/guides/seller-guide-2026/page-11.jpg', label: 'Closing Your Maryland Home Sale' },
    { image: '/images/guides/seller-guide-2026/page-12-checklist.jpg', label: "The Seller's Strategy Checklist" },
    { image: '/images/guides/seller-guide-2026/page-13.jpg', label: "What If Your Home Doesn't Sell?" },
    { image: '/images/guides/seller-guide-2026/page-14-cta.jpg', label: 'Free Home Valuation & Strategy Session' },
  ],
};

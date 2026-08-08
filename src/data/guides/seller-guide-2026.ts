import { HandbookGuide } from '../../types/handbook';

// The 2026 Home Seller's Guide - rebuilt from Kyle's newer, complete
// version of the document. This version resolves the earlier gap: what
// was a missing Chapter 7 ("Getting Your Home Ready for Showings") in
// the first version is now merged directly into the Photography &
// Marketing page here, so the full 14-page set is complete with nothing
// missing.
export const sellerGuide: HandbookGuide = {
  slug: 'seller-guide-2026',
  title: "The 2026 Home Seller's Guide",
  subtitle: 'Prepare. Price. Sell with Confidence.',
  edition: '2026 Edition',
  description: 'A practical, county-specific guide to preparing, pricing, and selling your Maryland home for the most money, with the least stress.',
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
    { image: '/images/guides/seller-guide-2026/page-08.jpg', label: 'Photography, Marketing & Showings' },
    { image: '/images/guides/seller-guide-2026/page-09.jpg', label: 'Evaluating & Negotiating Offers' },
    { image: '/images/guides/seller-guide-2026/page-10.jpg', label: 'Inspection & Appraisal' },
    { image: '/images/guides/seller-guide-2026/page-11.jpg', label: 'Closing Your Maryland Home Sale' },
    { image: '/images/guides/seller-guide-2026/page-12-checklist.jpg', label: "The Seller's Strategy Checklist" },
    { image: '/images/guides/seller-guide-2026/page-13.jpg', label: "What If Your Home Doesn't Sell?" },
    { image: '/images/guides/seller-guide-2026/page-14-cta.jpg', label: 'Free Home Valuation & Strategy Session' },
  ],
};

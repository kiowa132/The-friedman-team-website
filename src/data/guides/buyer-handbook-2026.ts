// The 2026 Maryland Home Buyer's Handbook - built from Kyle's own real,
// finished document (10 professionally designed pages, real content, real
// photo, real preferred lender partner). Rendered as real page images
// inside a premium magazine-style reader shell, rather than re-transcribed
// into HTML - these pages are already well-designed graphic layouts, not
// screenshots of plain text, so the honest engineering call here is to
// upgrade the reading experience around them rather than risk introducing
// transcription errors into a document Kyle already finished.

export interface HandbookPage {
  image: string;
  label: string; // shown in the table of contents
}

export interface HandbookGuide {
  slug: string;
  title: string;
  subtitle: string;
  edition: string;
  description: string;
  category: string;
  estimatedReadMinutes: number;
  lastUpdated: string;
  pageCount: number;
  coverImage: string;
  pdfUrl: string;
  pages: HandbookPage[];
  whatsInside: string[];
}

export const buyerHandbook: HandbookGuide = {
  slug: 'buyer-handbook-2026',
  title: "The 2026 Maryland Home Buyer's Handbook",
  subtitle: 'Everything you need to buy a home in Maryland without costly mistakes.',
  edition: '2026 Edition',
  description: "A complete, county-specific walkthrough from financial readiness to closing day - built for Carroll, Baltimore, and Howard County buyers, not a generic national guide.",
  category: 'For Buyers',
  estimatedReadMinutes: 12,
  lastUpdated: 'August 2026',
  pageCount: 10,
  coverImage: '/images/guides/buyer-handbook-v2/page-01-cover.jpg',
  pdfUrl: '/guides/friedman-team-buyer-handbook-2026.pdf',
  whatsInside: [
    '10 premium pages, Maryland-specific from cover to close',
    'The real 28/36 rule, worked through with real numbers',
    'Maryland Mortgage Program down payment assistance details',
    'County-specific inspections: radon, well & septic, WDI',
    'A trusted local lender partner, ready when you are',
  ],
  pages: [
    { image: '/images/guides/buyer-handbook-v2/page-01-cover.jpg', label: 'Cover' },
    { image: '/images/guides/buyer-handbook-v2/page-02.jpg', label: 'Table of Contents' },
    { image: '/images/guides/buyer-handbook-v2/page-03.jpg', label: 'Financial Readiness & Budgeting' },
    { image: '/images/guides/buyer-handbook-v2/page-04.jpg', label: 'Credit Scores & the 28/36 Rule' },
    { image: '/images/guides/buyer-handbook-v2/page-05.jpg', label: 'Pre-Approval & Loan Types' },
    { image: '/images/guides/buyer-handbook-v2/page-06.jpg', label: 'Finding Your Home & Making an Offer' },
    { image: '/images/guides/buyer-handbook-v2/page-07.jpg', label: "Your Buyer's Agent & Making Offers" },
    { image: '/images/guides/buyer-handbook-v2/page-08.jpg', label: 'Under Contract to Closing Day' },
    { image: '/images/guides/buyer-handbook-v2/page-09-lender.jpg', label: 'Our Preferred Lender' },
    { image: '/images/guides/buyer-handbook-v2/page-10-cta.jpg', label: 'Start Here: Free Strategy Session' },
  ],
};

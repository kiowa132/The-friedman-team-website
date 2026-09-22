import { HandbookGuide } from '../../types/handbook';

// The Carroll County Town-by-Town Buyer's Guide (October 2026 Edition), the
// first of a monthly county series that goes with the AM card QR code.
// 12 designed page images. Market figures are Bright MLS closed sales,
// March 25 to September 21, 2026; tax rates are from the Maryland Department
// of Assessments and Taxation 2025-2026 rate sheet.
export const carrollCountyBuyerGuide: HandbookGuide = {
  slug: 'carroll-county-town-by-town-buyers-guide',
  title: 'The Carroll County Town by Town Buyer’s Guide',
  subtitle: 'Which Carroll County town fits your budget, your commute, and your life?',
  edition: 'October 2026 Edition',
  description: 'Real Bright MLS numbers for eleven Carroll County towns: median prices, how fast homes sell, what buyers actually paid versus list, property tax rates, and how to win an offer right now.',
  category: 'For Buyers',
  estimatedReadMinutes: 8,
  lastUpdated: 'October 2026',
  pageCount: 12,
  coverImage: '/images/guides/carroll-county-town-by-town-guide/page-01-cover.jpg',
  pdfUrl: '/guides/friedman-team-carroll-county-buyer-guide.pdf',
  whatsInside: [
    'Median sold price, days to contract, and sold vs. list price for 11 towns',
    'A price to monthly payment table at today’s rate',
    'Property tax rates for every Carroll County town, with real examples',
    'Kyle’s take on each town',
    'A side by side comparison of all the towns',
    'Four moves that win an offer in this market',
  ],
  pages: [
    { image: '/images/guides/carroll-county-town-by-town-guide/page-01-cover.jpg', label: 'Cover' },
    { image: '/images/guides/carroll-county-town-by-town-guide/page-02.jpg', label: 'Carroll County at a Glance' },
    { image: '/images/guides/carroll-county-town-by-town-guide/page-03.jpg', label: 'What You Can Afford' },
    { image: '/images/guides/carroll-county-town-by-town-guide/page-04.jpg', label: 'Westminster' },
    { image: '/images/guides/carroll-county-town-by-town-guide/page-05.jpg', label: 'South Carroll: Eldersburg, Sykesville, Finksburg' },
    { image: '/images/guides/carroll-county-town-by-town-guide/page-06.jpg', label: 'Hampstead and Manchester' },
    { image: '/images/guides/carroll-county-town-by-town-guide/page-07.jpg', label: 'Mount Airy' },
    { image: '/images/guides/carroll-county-town-by-town-guide/page-08.jpg', label: 'New Windsor and Taneytown' },
    { image: '/images/guides/carroll-county-town-by-town-guide/page-09.jpg', label: 'Union Bridge and Upperco' },
    { image: '/images/guides/carroll-county-town-by-town-guide/page-10.jpg', label: 'All Towns Compared' },
    { image: '/images/guides/carroll-county-town-by-town-guide/page-11.jpg', label: 'How to Win an Offer Right Now' },
    { image: '/images/guides/carroll-county-town-by-town-guide/page-12-cta.jpg', label: 'Your Next Step' },
  ],
};

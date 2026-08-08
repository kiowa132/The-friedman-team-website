import { HandbookGuide } from '../../types/handbook';

// The Complete Maryland Home Valuation Guide - real, finished 15-page
// document. Full page set, nothing missing - table of contents cross-
// checked against every file and all 15 are accounted for.
export const homeValuationGuide: HandbookGuide = {
  slug: 'home-valuation-guide',
  title: 'What Is My Maryland Home Worth?',
  subtitle: 'The complete Maryland home valuation guide - what actually determines value, why online estimates get it wrong, and what you\u2019d really walk away with.',
  edition: '2026 Edition',
  description: 'A clear-eyed look at how Maryland home values are actually determined, why automated estimates miss the mark, and the real factors that move your number up or down.',
  category: 'For Sellers',
  estimatedReadMinutes: 13,
  lastUpdated: 'August 2026',
  pageCount: 15,
  coverImage: '/images/guides/home-valuation-guide/page-01-cover.jpg',
  pdfUrl: '/guides/friedman-team-home-valuation-guide.pdf',
  whatsInside: [
    '15 premium pages on how Maryland home values actually work',
    'Why online estimates (Zestimate and similar) can be wrong',
    'The 7 biggest factors that actually affect your value',
    'What your comps are really telling you',
    'What you\u2019d actually walk away with after selling',
  ],
  pages: [
    { image: '/images/guides/home-valuation-guide/page-01-cover.jpg', label: 'Cover' },
    { image: '/images/guides/home-valuation-guide/page-02-intro.jpg', label: 'What Is My Maryland Home Worth?' },
    { image: '/images/guides/home-valuation-guide/page-03-toc.jpg', label: 'Table of Contents' },
    { image: '/images/guides/home-valuation-guide/page-04.jpg', label: "What Does 'Market Value' Actually Mean?" },
    { image: '/images/guides/home-valuation-guide/page-05.jpg', label: "How Is a Maryland Home's Value Determined?" },
    { image: '/images/guides/home-valuation-guide/page-06.jpg', label: 'Why Online Estimates Can Be Wrong' },
    { image: '/images/guides/home-valuation-guide/page-07.jpg', label: 'The 7 Biggest Factors That Affect Value' },
    { image: '/images/guides/home-valuation-guide/page-08.jpg', label: 'What Are Your Comps Actually Telling You?' },
    { image: '/images/guides/home-valuation-guide/page-09.jpg', label: 'What Should You Fix Before Selling?' },
    { image: '/images/guides/home-valuation-guide/page-10.jpg', label: 'Why Pricing Your Home Correctly Matters' },
    { image: '/images/guides/home-valuation-guide/page-11.jpg', label: 'How Much Will You Actually Walk Away With?' },
    { image: '/images/guides/home-valuation-guide/page-12-checklist.jpg', label: 'Your Maryland Home Value Checklist' },
    { image: '/images/guides/home-valuation-guide/page-13.jpg', label: 'The Friedman Approach to Home Valuation' },
    { image: '/images/guides/home-valuation-guide/page-14-cta.jpg', label: 'Get Your Free Maryland Home Valuation' },
    { image: '/images/guides/home-valuation-guide/page-15.jpg', label: 'A Final Word From Kyle' },
  ],
};

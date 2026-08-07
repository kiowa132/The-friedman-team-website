import { GuideContent } from '../../types/guide';

// Transcribed from the original Gamma-exported flipbook (public/images/
// guides/buyer-checklist/page-1.jpg through page-8.jpg) into real,
// structured content. Two changes from the source on purpose:
//   1. Step numbering is corrected to run 1-15 straight through (the
//      original mislabeled Phase 2's five steps as 1-5 instead of 4-8).
//   2. The two stock photos and the unsourced "80% more views" / "5,000+
//      calls/month" stats from the original are not carried over - see
//      the conversation this was built in for why.
export const firstTimeBuyerGuide: GuideContent = {
  slug: 'first-time-buyer-checklist',
  title: "The First-Time Buyer's Checklist",
  description: "15 steps to your front door in Carroll, Baltimore & Howard County - the exact roadmap I walk every first-time buyer through, not a generic national checklist.",
  category: 'For Buyers',
  estimatedReadMinutes: 6,
  lastUpdated: 'August 2026',
  coverImage: '/images/guides/buyer-checklist/page-1.jpg',
  pdfUrl: '/guides/friedman-team-buyer-checklist.pdf',

  sections: [
    {
      type: 'cover',
      eyebrow: 'Free Guide',
      title: "The First-Time Buyer's Checklist",
      subtitle: '15 Steps to Your Front Door in Carroll, Baltimore & Howard County',
      meta: 'Kyle Friedman | The Friedman Team | eXp Realty',
    },
    {
      type: 'overview',
      title: 'Your Roadmap to Homeownership',
      body: "Whether you're eyeing a rowhome in Baltimore County, a colonial in Carroll County, or something close to Columbia in Howard County, this is the roadmap I walk every first-time buyer through. Fifteen steps, four phases, from pre-approval to keys in hand.",
      phases: [
        { icon: 'wallet', label: 'Finances' },
        { icon: 'users', label: 'Build Team' },
        { icon: 'file-text', label: 'Contract' },
        { icon: 'key', label: 'Closing' },
      ],
    },
    {
      type: 'phase',
      phaseLabel: 'Phase 1',
      phaseIcon: 'dollar-sign',
      title: 'Get Your Finances Right First',
      layout: 'featured',
      steps: [
        {
          number: 1,
          title: 'Know Your Real Number',
          body: 'Lender approval and what you can comfortably afford are two different things. Taxes vary across Baltimore, Carroll, and Howard counties. Keep your debt-to-income ratio under 43% and factor in any HOA fees.',
        },
        {
          number: 2,
          title: 'Your Down Payment Is Smaller Than You Think',
          body: 'Most first-time buyers put down 3-5%, and the Maryland Mortgage Program offers 0%-interest down payment assistance. Budget an additional 2-5% for closing costs like transfer taxes and title insurance.',
        },
        {
          number: 3,
          title: 'Clean Up Your Credit Before You Apply',
          body: 'Pay card balances below 30% utilization to secure the best interest rate. Avoid opening new credit or financing anything while your loan is in process - lenders re-check before closing.',
        },
      ],
    },
    {
      type: 'phase',
      phaseLabel: 'Phase 2',
      phaseIcon: 'users',
      title: 'Build Your Team, Start Looking',
      layout: 'list',
      steps: [
        { number: 4, title: 'Work With Someone Who Knows These Counties', body: 'Septic systems, ground rent, and county quirks require a hyper-local agent.' },
        { number: 5, title: 'Get Pre-Approved, Not Just Pre-Qualified', body: "Sellers in competitive markets won't consider offers without a verified pre-approval." },
        { number: 6, title: 'Research the Actual Neighborhood', body: 'Test the commute at rush hour and check internet availability before committing.' },
        { number: 7, title: 'Separate Must-Haves From Nice-to-Haves', body: 'Lock in non-negotiables early, including water/sewer versus well and septic.' },
        { number: 8, title: 'Start Touring, and Look Past the Paint', body: 'Focus on roof, windows, and HVAC - not staging or cosmetics.' },
      ],
    },
    {
      type: 'phase',
      phaseLabel: 'Phase 3',
      phaseIcon: 'file-text',
      title: 'The Contract',
      layout: 'cards',
      steps: [
        { number: 9, title: 'Make a Real Offer, Not a Guess', body: "I pull actual comparable sales so your offer is grounded in real data, not a feeling. Your contingencies - financing, appraisal, inspection - are your protection if something doesn't check out." },
        { number: 10, title: 'Negotiate Like a Conversation, Not a Fight', body: 'First-time buyers often ask sellers to cover a portion of closing costs, keeping more cash available for moving day. Counter-offers are normal, not a red flag.' },
        { number: 11, title: 'Never Skip the Inspection', body: 'Radon testing is recommended every time, and wood-destroying insect inspections are standard - often required by lenders. In rural Carroll County, a well and septic inspection is non-negotiable.' },
        { number: 12, title: 'The Appraisal Is Your Safety Net', body: "Your lender orders an independent appraisal to confirm the home is worth what you're paying. If it comes in low, you can renegotiate the price, cover the gap, or walk away." },
      ],
    },
    {
      type: 'phase',
      phaseLabel: 'Phase 4',
      phaseIcon: 'key',
      title: 'Closing',
      layout: 'columns',
      steps: [
        { number: 13, title: 'Your Loan Gets Its Final Check', body: 'The underwriter issues "Clear to Close" after a final review. Your Closing Disclosure arrives at least three days before settlement with your exact cash-to-close amount.' },
        { number: 14, title: "Title Work Catches What You Can't See", body: 'I check for Maryland-specific issues like ground rent and front foot benefit charges - surprises that can show up as unexpected annual bills.' },
        { number: 15, title: 'Maryland Does "Wet" Settlements', body: 'All parties sign together in one session. Funds transfer immediately and you walk out with keys the same day.' },
      ],
    },
    {
      type: 'callout',
      icon: 'message-circle',
      body: "Ready to start? I'm happy to walk through your specific situation - just reach out.",
    },
    {
      type: 'profile',
      title: "Let's Talk",
      body: 'Ready to get started? Here\u2019s what working with me actually looks like.',
      stats: [
        { icon: 'shield-check', label: 'Honest Guidance', body: 'Straight talk about your situation so you can make the best decision.' },
        { icon: 'trending-up', label: 'Data-Driven Offers', body: 'Real comparable sales back every offer strategy, not guesswork.' },
        { icon: 'repeat', label: 'Full-Service Support', body: 'From pre-approval through closing day, every step covered.' },
        { icon: 'map-pin', label: 'Local Expertise', body: 'Deep knowledge of Carroll, Baltimore, and Howard County, from septic quirks to ground rent.' },
      ],
      disclosure: 'Equal Housing Opportunity. Kyle Friedman is a licensed real estate salesperson in Maryland affiliated with eXp Realty. All information is deemed reliable but not guaranteed and should be independently verified.',
    },
  ],

  ctas: [
    {
      afterSectionIndex: 2, // after Phase 1 (finances)
      label: 'Curious what you could afford?',
      description: 'Run your real numbers, including Maryland Mortgage Program savings.',
      buttonLabel: 'Affordability Calculator',
      action: 'affordability-calculator',
    },
    {
      afterSectionIndex: 4, // after Phase 3 (contract)
      label: 'Ready to see what fits your budget?',
      description: 'Estimate a monthly payment before you write an offer.',
      buttonLabel: 'Mortgage Calculator',
      action: 'mortgage-calculator',
    },
  ],
};

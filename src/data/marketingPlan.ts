// Content for the seller "Marketing Plan" page (/sell/marketing-plan).
//
// Source of truth: Friedman Brain/projects/listing-marketing-menu.md (Part A).
// Part B of that file (costs, credit dollars, economics) is PRIVATE and must
// never appear here or anywhere on the public site. Extras are counted in
// "picks", never in dollars.

export type TierId = 't1' | 't2' | 't3a' | 't3b' | 't4' | 't5';

export type Status =
  | 'included' // part of the plan at this price
  | 'rec' // included when Kyle recommends it
  | 'zs' // part of the Zillow Showcase package
  | 'zsplus' // part of the upgraded Showcase level
  | 'swap' // can be used as the seller's one prep pick
  | 'extra' // a selectable extra, costs 1 pick
  | 'extra2' // a selectable extra, costs 2 picks
  | 'ask' // available, built in at the strategy session
  | 'na'; // not offered at this price

export interface Tier {
  id: TierId;
  range: string;
  name: string;
  extras: number; // number of picks; 0 means none
  blurb: string;
}

// Order matters: index 0 to 4 line up with the status codes below.
export const TIERS: Tier[] = [
  { id: 't1', range: 'Under $300K', name: 'Essentials', extras: 0, blurb: 'Everything you need to sell well, with more available when we talk.' },
  { id: 't2', range: '$300K to $500K', name: 'Standard', extras: 1, blurb: 'Cleaning, a 3D tour and open houses, plus an extra of your choice.' },
  { id: 't3a', range: '$501K to $649K', name: 'Signature', extras: 1, blurb: 'Zillow Showcase, weekend open houses and an extra of your choice.' },
  { id: 't3b', range: '$650K to $800K', name: 'Signature', extras: 1, blurb: 'Showcase with drone, SkyTour and video, plus an extra of your choice.' },
  { id: 't4', range: '$800K to $1.2M', name: 'Premier', extras: 3, blurb: 'The full Showcase package and three extras, including staging.' },
  { id: 't5', range: '$1.2M and up', name: 'Estate', extras: 0, blurb: 'A custom plan built with Kyle around your home.' },
];

// Tiers that use the status codes (t5 reuses t4's list, shown as custom).
export const TIER_ORDER: TierId[] = ['t1', 't2', 't3a', 't3b', 't4'];

export function tierIndex(id: TierId): number {
  const i = TIER_ORDER.indexOf(id);
  return i === -1 ? TIER_ORDER.length - 1 : i;
}

export const CATEGORIES = [
  'Prep & Protect',
  'Photography & Visuals',
  'Video',
  'Online Reach',
  'Local & Print',
  'Launch & Events',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Item {
  category: Category;
  name: string;
  detail?: string;
  // One status per tier in TIER_ORDER (t1, t2, t3a, t3b, t4).
  status: Status[];
}

const CODE: Record<string, Status> = {
  I: 'included',
  R: 'rec',
  Z: 'zs',
  P: 'zsplus',
  W: 'swap',
  E: 'extra',
  F: 'extra2',
  A: 'ask',
  N: 'na',
};

function item(category: Category, name: string, codes: string, detail?: string): Item {
  return { category, name, detail, status: codes.split('').map((c) => CODE[c] || 'na') };
}

// Delivered on every listing, no matter the price.
export const FOUNDATION: { name: string; detail: string }[] = [
  { name: 'Data-backed pricing strategy', detail: 'Comps and pricing scenarios so you see real options, not one guess.' },
  { name: 'Professional-quality photography', detail: 'Edited and ready for every site.' },
  { name: 'MLS listing on every major site', detail: 'Syndicated to Zillow, Realtor.com, Redfin, Trulia, Homes.com and more.' },
  { name: 'Dedicated property website', detail: 'A website built for your home.' },
  { name: 'Email to our buyer and client network', detail: 'Past clients and active buyers hear about your home.' },
  { name: 'Social media posts', detail: 'Your listing promoted on our channels.' },
  { name: 'Yard sign and showing setup', detail: 'Sign, lockbox and showing scheduling.' },
  { name: 'Launch timing plan', detail: 'Coming Soon and go-live strategy for your home.' },
  { name: 'Showing feedback', detail: 'What buyers said after they toured.' },
  { name: 'Disclosure and contract paperwork', detail: 'Prepared and reviewed with you.' },
  { name: 'Negotiation', detail: 'Price, terms and contingencies handled with your equity in mind.' },
  { name: 'Weekly updates', detail: 'You always know where things stand.' },
  { name: 'Transaction coordination', detail: 'Managed through closing.' },
  { name: 'Vendor coordination and prep timeline', detail: 'We schedule your prep vendors and set the order so everything is finished before photo day.' },
];

// Status codes, one letter per tier: t1 t2 t3a t3b t4
// I included, R when recommended, Z ZS, P ZS+, W swap (prep pick),
// E extra (1 pick), F extra (2 picks), A ask Kyle, N not offered.
export const ITEMS: Item[] = [
  // Prep & Protect
  item('Prep & Protect', 'Home Prep Advisor walkthrough and room-by-room plan', 'ARRRR', 'Kyle tells you honestly whether your home needs one.'),
  item('Prep & Protect', 'Professional cleaning', 'NWWWW'),
  item('Prep & Protect', 'Pre-listing home inspection', 'NWWWW'),
  item('Prep & Protect', 'Landscaping refresh (mulch, trim, edging)', 'NWWWW'),
  item('Prep & Protect', 'Power washing', 'NWWWW'),
  item('Prep & Protect', 'Junk removal and haul-away', 'NWWWW'),
  item('Prep & Protect', 'Handyman punch list (small repairs)', 'NWWWW'),
  item('Prep & Protect', 'Paint touch-up', 'NWWWW'),
  item('Prep & Protect', 'Seller home warranty during the listing', 'NWWWW'),
  item('Prep & Protect', 'Partial professional staging (living room, primary bedroom, kitchen)', 'NAAAF'),

  // Photography & Visuals
  item('Photography & Visuals', 'AI virtual staging on your listing photos', 'IIZZZ'),
  item('Photography & Visuals', 'Enhanced photo gallery', 'NAZZZ'),
  item('Photography & Visuals', 'Interactive 3D Home tour', 'AIIII', 'Buyers walk through your home online.'),
  item('Photography & Visuals', 'Interactive floor plan', 'AIIII', 'Comes with the 3D tour.'),
  item('Photography & Visuals', 'Aerial and drone photos', 'NAAPP'),
  item('Photography & Visuals', 'Twilight photos', 'NNEEE'),
  item('Photography & Visuals', 'Lawn and yard photo touch-ups', 'NEEEE'),

  // Video
  item('Video', 'Social media video', 'NAAPP'),
  item('Video', 'SkyTour drone 3D flyover', 'NAAPP'),
  item('Video', 'Walkthrough video', 'NNEEE'),
  item('Video', 'Property tour video with Kyle', 'NNFFF'),

  // Online Reach
  item('Online Reach', '3D tour search tags and buyer email alerts on Zillow and Trulia', 'NIIII', 'Comes with the 3D tour.'),
  item('Online Reach', 'Showcase priority search placement', 'NAZZZ'),
  item('Online Reach', 'Showcase filters and special search results', 'NAZZZ'),
  item('Online Reach', 'Dedicated Showcase email alerts to serious buyers', 'NAZZZ'),
  item('Online Reach', 'Paid social ad boost', 'NNEEE'),
  item('Online Reach', 'Targeted buyer ads', 'NNEEE'),

  // Local & Print
  item('Local & Print', 'Just-listed neighborhood postcards', 'NEEEE'),
  item('Local & Print', 'Feature flyer and brochure', 'NEEEE'),
  item('Local & Print', 'Open house door hangers', 'NNEEE'),

  // Launch & Events
  item('Launch & Events', 'Saturday open house', 'NIIII'),
  item('Launch & Events', 'Sunday open house', 'NNIII'),
  item('Launch & Events', 'Open house promotion (email and social)', 'NIIII'),
  item('Launch & Events', 'Agent preview event', 'NNEEI'),
  item('Launch & Events', 'Neighbor preview event', 'NNEEE'),
];

// Kyle's recommended starting point for each price range. Sellers can change it.
export const DEFAULT_PREP_PICK = 'Professional cleaning';
export const DEFAULT_EXTRAS: Record<TierId, string[]> = {
  t1: [],
  t2: ['Just-listed neighborhood postcards'],
  t3a: ['Twilight photos'],
  t3b: ['Twilight photos'],
  t4: ['Partial professional staging (living room, primary bedroom, kitchen)', 'Twilight photos'],
  t5: [],
};

export function statusFor(it: Item, tier: TierId): Status {
  return it.status[tierIndex(tier)] || 'na';
}

export function pickCost(status: Status): number {
  return status === 'extra2' ? 2 : status === 'extra' ? 1 : 0;
}

export const ZS_NOTE =
  'ZS marks the Zillow Showcase package. Choose any one ZS item and you get the whole package for your price range. ZS+ marks the upgraded level with drone, SkyTour and social video.';

export const SAME_KYLE = 'Same Kyle, same service, same negotiation at every price. What changes is how much marketing we put behind your home.';

export const CANCEL_LINE = "Cancel your listing agreement any time. If we're not the right fit, no lengthy contract and no risk.";

export const ADVISOR_BULLETS: string[] = [
  'Evaluates your home and finds the improvements that will help most',
  'Recommends what to repair, replace, refresh or leave as is',
  'Prioritizes improvements by likely return, so you avoid unnecessary spending',
  'Builds a room-by-room preparation plan and timeline',
  'Advises on curb appeal and staging',
  'Coordinates vendors so your home is fully market-ready before photography and launch',
];

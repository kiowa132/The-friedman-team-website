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
  { name: 'Professional-quality photography', detail: 'Daytime photography, edited and ready for every site.' },
  { name: 'Coordinated launch on every major site', detail: 'MLS, Zillow, Redfin, Realtor.com, Trulia, Homes.com and more.' },
  { name: 'Coming Soon and go-live strategy', detail: 'A Coming Soon phase to build early buzz and, when useful, test pricing. Off-market exposure where it makes sense.' },
  { name: 'Email to our network', detail: 'Past clients, active buyers, and agents across surrounding brokerages hear about your home.' },
  { name: 'Personal phone outreach', detail: 'We call agents and neighbors to surface buyers who have not seen your home online yet.' },
  { name: 'Social media posts', detail: 'Your listing promoted on our channels.' },
  { name: 'A for-sale sign built to promote your home', detail: 'Your home is the star of the sign, not your agent. It carries a QR code and a 24-hour info line, so buyers can reach us any time and their contact information is captured immediately.' },
  { name: 'Showing setup and feedback within 48 hours', detail: 'Lockbox and scheduling, and what buyers said after every showing within 48 hours.' },
  { name: 'A weekly call', detail: 'We review activity and pricing together every week.' },
  { name: 'Fast, reliable communication', detail: 'Available for your calls Monday through Saturday, with same-day returned calls and emails, often within the hour.' },
  { name: 'Disclosure and contract paperwork', detail: 'Prepared and reviewed with you.' },
  { name: 'Negotiation strategy', detail: 'A plan in place before an offer ever comes in, covering price, terms and contingencies with your equity in mind.' },
  { name: 'Transaction coordination', detail: 'A dedicated coordinator manages every deadline and document through closing.' },
  { name: 'Vendor coordination and prep timeline', detail: 'We schedule your prep vendors and set the order so everything is finished before photo day.' },
];

// Status codes, one letter per tier: t1 t2 t3a t3b t4
// I included, R when recommended, Z ZS, P ZS+, W swap (prep pick),
// E extra (1 pick), F extra (2 picks), A ask Kyle, N not offered.
export const ITEMS: Item[] = [
  // Prep & Protect
  item('Prep & Protect', 'Home Prep Advisor walkthrough', 'ARRRR', 'Includes a staging consultation (decluttering, furniture placement, virtual staging where it helps) and a room-by-room plan. Kyle tells you honestly whether your home needs one.'),
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
  item('Video', 'Walkthrough video', 'AAEEE'),
  item('Video', 'Property tour video with Kyle', 'NNFFF'),

  // Online Reach
  item('Online Reach', 'Dedicated property website', 'AIIII', 'A website built for your home.'),
  item('Online Reach', '3D tour search tags and buyer email alerts on Zillow and Trulia', 'NIIII', 'Comes with the 3D tour.'),
  item('Online Reach', 'Showcase priority search placement', 'NAZZZ'),
  item('Online Reach', 'Showcase filters and special search results', 'NAZZZ'),
  item('Online Reach', 'Dedicated Showcase email alerts to serious buyers', 'NAZZZ'),
  item('Online Reach', 'Paid digital and social media campaign', 'AAEEE', 'Puts your home in front of targeted buyers across Maryland.'),
  item('Online Reach', 'Targeted buyer ads', 'AAEEE'),

  // Local & Print
  item('Local & Print', 'Targeted print postcard campaign', 'AEEEE', 'Just-listed postcards to the neighborhood and likely buyers.'),
  item('Local & Print', 'Feature flyer and brochure', 'NEEEE'),
  item('Local & Print', 'Open house door hangers', 'NNEEE'),

  // Launch & Events
  item('Launch & Events', 'Saturday open house', 'NIIII'),
  item('Launch & Events', 'Sunday open house', 'NNIII'),
  item('Launch & Events', 'Open house promotion (email and social)', 'NIIII'),
  item('Launch & Events', 'Brokers Open with a social media kit', 'AAEEI', 'Local agents tour in person and get a kit to push your home to their buyers.'),
  item('Launch & Events', 'Neighbor preview event', 'NNEEE'),
];

// Kyle's recommended starting point for each price range. Sellers can change it.
export const DEFAULT_PREP_PICK = 'Professional cleaning';
export const DEFAULT_EXTRAS: Record<TierId, string[]> = {
  t1: [],
  t2: ['Targeted print postcard campaign'],
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
  'ZS marks the Zillow Showcase package. Choose any one ZS item and you get the whole package for your price range. ZS+ marks the upgraded level with drone, SkyTour and social video. Showcase is not available on every listing, and Kyle will tell you honestly whether yours qualifies.';

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

export const GUARANTEE_POINTS: string[] = [
  'Feedback within 48 hours of every showing',
  'A weekly call to review activity and pricing',
  'Available for your calls Monday through Saturday',
  'Same-day returned calls and emails, often within the hour',
];

export const TEAM: { role: string; detail: string }[] = [
  { role: 'Listing Agent', detail: 'Leads strategy and negotiation for your home.' },
  { role: 'Home Prep Advisor', detail: 'Trained to help your home show its best.' },
  { role: 'Transaction Coordinator', detail: 'Manages every deadline and document through closing.' },
];

export const PERFORMANCE_NOTE =
  'Ask Kyle for current, verified numbers on list to sale ratio, average days on market, and listing reach, sourced from Bright MLS for the most recent reporting period.';

export interface Step {
  title: string;
  text: string;
  categories: Category[];
  image: string;
}

export const STEPS: Step[] = [
  {
    title: 'Before we go live',
    text: 'Your Home Prep Advisor walkthrough, staging consultation, cleaning and any prep work, all scheduled so everything is finished before photo day. Then a Coming Soon phase builds early buzz, backed by a for-sale sign that promotes your home.',
    categories: ['Prep & Protect'],
    image: '/images/marketing-plan/step-1.jpg',
  },
  {
    title: 'Imagery and launch',
    text: 'Professional photography, and for many homes a 3D tour and floor plan, with walkthrough video and drone where your plan includes them. Then a coordinated launch across the MLS, Zillow, Redfin and your own property website.',
    categories: ['Photography & Visuals', 'Video'],
    image: '/images/marketing-plan/step-2.jpg',
  },
  {
    title: 'Getting the word out',
    text: 'A targeted email goes to our full network, including agents at surrounding brokerages, with a print campaign to the neighborhood if you choose it, and personal calls to agents and neighbors to reach buyers who have not seen your home online.',
    categories: ['Local & Print'],
    image: '/images/marketing-plan/step-3.jpg',
  },
  {
    title: 'Paid reach and online exposure',
    text: 'Paid digital and social campaigns put your home in front of targeted buyers across Maryland, and Zillow Showcase gives eligible homes premium placement, interactive floor plans and priority in search.',
    categories: ['Online Reach'],
    image: '/images/marketing-plan/step-4.jpg',
  },
  {
    title: 'Showings, offers and closing',
    text: 'Open houses, a Brokers Open where local agents tour in person, showing feedback within 48 hours, a weekly call, a negotiation strategy set before an offer arrives, and a coordinator managing every deadline until you close.',
    categories: ['Launch & Events'],
    image: '/images/marketing-plan/step-5.jpg',
  },
];

// Which plan a home falls into, from the seller's estimated value. The
// seller never sees this: the page only shows them the options that apply.
export function tierForValue(value: number): TierId {
  if (value < 300000) return 't1';
  if (value <= 500000) return 't2';
  if (value < 650000) return 't3a';
  if (value <= 800000) return 't3b';
  if (value <= 1200000) return 't4';
  return 't5';
}

export type StepSlug = 'home' | 'prep' | 'visuals' | 'reach' | 'launch' | 'plan' | 'book';

export interface PlanStep {
  slug: StepSlug;
  label: string;
  title: string;
  intro: string;
  categories: Category[];
}

export const PLAN_STEPS: PlanStep[] = [
  { slug: 'home', label: 'Your home', title: 'Tell us about your home', intro: 'About what do you think it is worth? A rough guess is perfect.', categories: [] },
  { slug: 'prep', label: 'Getting ready', title: 'First, we get your home ready', intro: 'Your Home Prep Advisor figures out what is worth doing, and we line up everything else.', categories: ['Prep & Protect'] },
  { slug: 'visuals', label: 'Showing it off', title: 'Then we show it off', intro: 'Photos, tours and video that make buyers stop scrolling.', categories: ['Photography & Visuals', 'Video'] },
  { slug: 'reach', label: 'Getting it seen', title: 'Then we get it seen', intro: 'Every major site, our buyer network and paid reach put your home in front of the right people.', categories: ['Online Reach', 'Local & Print'] },
  { slug: 'launch', label: 'Buyers at the door', title: 'Then we bring buyers through the door', intro: 'Open houses, showings and events to turn interest into offers.', categories: ['Launch & Events'] },
  { slug: 'plan', label: 'Your plan', title: 'Your plan', intro: 'Here is everything, all in one place.', categories: [] },
  { slug: 'book', label: 'Book', title: 'Pick a time to meet', intro: 'Choose a day and time for your listing consultation. We will go over your plan in person and start scheduling your vendors.', categories: [] },
];

// The items in a step's categories that apply at this price (hides "not offered").
export function itemsForStep(step: PlanStep, tier: TierId): Item[] {
  return ITEMS.filter((i) => step.categories.includes(i.category) && statusFor(i, tier) !== 'na');
}

// Consultation scheduling. Kyle confirms every request, so these are the
// windows he is willing to be asked for, not live availability.
export const CONSULT_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
export const CONSULT_CLOSED_DAYS = [0]; // 0 = Sunday
export const CONSULT_DAYS_AHEAD = 30;

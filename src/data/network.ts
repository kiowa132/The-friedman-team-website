// Data model for The Maryland Professional Network. Scales from 2 members
// to hundreds without changing structure - add a new NetworkMember object
// to the array below to add a member.
//
// IMPORTANT: fields marked with a PLACEHOLDER value below are genuinely
// unconfirmed - Kyle did not supply this information. Never replace a
// PLACEHOLDER value with invented specifics (a made-up company name, a
// stock headshot, a fabricated bio detail). When real information comes
// in, replace the placeholder directly in this file. The UI renders
// PLACEHOLDER-prefixed values with distinct, visibly "pending" styling
// so a placeholder is never mistaken for real, confirmed content.

export const PLACEHOLDER_PREFIX = 'PLACEHOLDER:';

export type NetworkMemberStatus = 'Pending' | 'Verified Member' | 'Recommended' | 'Trusted Partner' | 'Founding Member';

export interface NetworkMember {
  id: string;
  name: string;
  slug: string;
  headshot: string; // PLACEHOLDER: if no real headshot supplied
  videoUrl?: string; // optional short-form reel-style video, if supplied
  videoIsShort?: boolean;
  title: string;
  company: string;
  industry: string;
  subindustry?: string;
  county: string;
  markets: string[];
  bio: string;
  certifications?: string[];
  services: string[];
  clientsServed?: string;
  lookingToMeet: string[];
  canHelpWith: string[];
  canIntroduce?: string[];
  website?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
  status: NetworkMemberStatus;
  referredBy?: string;
  dateJoined: string; // "YYYY-MM-DD"
}

export const NETWORK_MEMBERS: NetworkMember[] = [
  {
    id: 'nicholas-purcell',
    slug: 'nicholas-purcell',
    name: 'Nicholas Purcell',
    headshot: '/images/network/nicholas-purcell.jpg',
    title: 'CFP\u00ae, Financial Planner & Associate Director of Financial Planning',
    company: 'Heritage Financial Consultants, LLC',
    industry: 'Financial Planning / Wealth Management',
    county: 'Baltimore City / Baltimore County',
    markets: ['Baltimore area'],
    bio: 'Nick Purcell, CFP\u00ae, is a Financial Planner with Heritage Financial Consultants, LLC, and also serves as Associate Director of Financial Planning. He began his career at Heritage as an intern while completing his B.S. in Business Administration with a concentration in Finance and a minor in Economics from Towson University.\n\nOver the years, by working closely with many planners in the Financial Planning Department, Nick has developed deep expertise in creating personalized financial plans and helping clients achieve both short- and long-term financial goals.\n\nA proud CERTIFIED FINANCIAL PLANNER\u00ae professional, Nick also holds the Series 7 and Series 66 securities registrations, along with Life, Accident, and Health Insurance licenses. His combination of credentials and hands-on experience reflects a strong foundation in holistic financial planning and a commitment to continuous professional growth.\n\nOriginally from Long Island, New York, Nick now lives in Baltimore. Outside of work, he enjoys playing and watching sports, attending live music events, and spending time outdoors. He is passionate about giving back to his community, volunteering for initiatives such as neighborhood cleanups, feeding the homeless, and participating annually in the Red Shoe Shuffle to support the Ronald McDonald House Charities of Maryland.',
    certifications: ['CERTIFIED FINANCIAL PLANNER\u00ae practitioner', 'Series 7 & 66 registered', 'Life, Accident, and Health insurance licensed'],
    services: [`${PLACEHOLDER_PREFIX} specific services not yet confirmed`],
    lookingToMeet: ['Business owners', 'CPAs', 'Attorneys', 'Real estate professionals', 'Other trusted professionals'],
    canHelpWith: ['Financial planning and related planning conversations'],
    website: 'https://www.heritageconsultants.com/project/nicholas-purcell/',
    linkedin: 'https://www.linkedin.com/in/nicholaspurcell7/',
    status: 'Founding Member',
    dateJoined: '2026-08-01',
  },
  {
    id: 'cullen-mcnulty',
    slug: 'cullen-mcnulty',
    name: 'Cullen McNulty',
    headshot: `${PLACEHOLDER_PREFIX} headshot not yet supplied`,
    title: 'Lender',
    company: `${PLACEHOLDER_PREFIX} company not yet confirmed`,
    industry: 'Mortgage Lending',
    county: `${PLACEHOLDER_PREFIX} county not yet confirmed`,
    markets: [`${PLACEHOLDER_PREFIX} markets not yet confirmed`],
    bio: `${PLACEHOLDER_PREFIX} bio not yet supplied`,
    services: [`${PLACEHOLDER_PREFIX} specific services not yet confirmed`],
    lookingToMeet: [`${PLACEHOLDER_PREFIX} not yet confirmed`],
    canHelpWith: [`${PLACEHOLDER_PREFIX} not yet confirmed`],
    website: undefined,
    linkedin: undefined,
    status: 'Founding Member',
    dateJoined: '2026-08-01',
  },
];

export function getNetworkMember(slug: string): NetworkMember | undefined {
  return NETWORK_MEMBERS.find((m) => m.slug === slug);
}

export function isPlaceholder(value?: string): boolean {
  return !!value && value.startsWith(PLACEHOLDER_PREFIX);
}

export function displayValue(value?: string): string {
  if (!value) return '';
  return isPlaceholder(value) ? value.replace(`${PLACEHOLDER_PREFIX} `, '') : value;
}

// Real closed transactions belonging to James Buckley, Kyle's mentor, not
// Kyle. Kept in a separate file and rendered in a separate, clearly labeled
// section from PAST_TRANSACTIONS (Kyle's own deals) so nothing here is ever
// presented as Kyle's own production - it's shown specifically as James's
// track record, offered as context for the mentorship relationship.
//
// Source: canopy-re.com/properties/sold, provided directly by Kyle.

export interface MentorTransaction {
  slug: string;
  address: string;
  cityStateZip: string;
  priceDisplay: string;
  beds: number;
  baths: number;
  sqft: number;
  image?: string;
  images?: string[]; // additional gallery photos, if available
}

export const MENTOR_NAME = 'James Buckley';
export const MENTOR_AFFILIATION = 'Canopy Real Estate Group, eXp Realty';

export const MENTOR_TRANSACTIONS: MentorTransaction[] = [
  { slug: '4327-16th-st-n-arlington-va', address: '4327 16th St N', cityStateZip: 'Arlington, VA 22207', priceDisplay: '$2,100,000', beds: 5, baths: 5, sqft: 4500 },
  { slug: '9209-vendome-drive-bethesda-md', address: '9209 Vendome Drive', cityStateZip: 'Bethesda, MD 20817', priceDisplay: '$1,970,000', beds: 7, baths: 7, sqft: 6588 },
  { slug: '626-a-old-county-road-severna-park-md', address: '626-A Old County Road', cityStateZip: 'Severna Park, MD 21146', priceDisplay: '$1,631,700', beds: 6, baths: 5, sqft: 4979 },
  { slug: '6302-30th-st-nw-washington-dc', address: '6302 30th St NW', cityStateZip: 'Washington, DC 20015', priceDisplay: '$1,528,000', beds: 4, baths: 4, sqft: 3276 },
  { slug: '7812-preakness-ln-fairfax-station-va', address: '7812 Preakness Ln', cityStateZip: 'Fairfax Station, VA 22039', priceDisplay: '$1,275,000', beds: 5, baths: 5, sqft: 4835 },
  { slug: '6920-mystic-woods-way-columbia-md', address: '6920 Mystic Woods Way', cityStateZip: 'Columbia, MD 21044', priceDisplay: '$1,170,000', beds: 5, baths: 4, sqft: 5557 },
  { slug: '803-c-st-ne-washington-dc', address: '803 C St NE', cityStateZip: 'Washington, DC 20002', priceDisplay: '$1,110,000', beds: 3, baths: 2, sqft: 1568 },
  { slug: '7106-stratos-ln-gaithersburg-md', address: '7106 Stratos Ln', cityStateZip: 'Gaithersburg, MD 20879', priceDisplay: '$1,075,000', beds: 6, baths: 5, sqft: 5477 },
  { slug: '6614-eastern-avenue-nw-washington-dc', address: '6614 Eastern Avenue NW', cityStateZip: 'Washington, DC 20012', priceDisplay: '$1,000,000', beds: 7, baths: 4, sqft: 2902 },
  { slug: '5-orleans-ter-kensington-md', address: '5 Orleans Ter', cityStateZip: 'Kensington, MD 20895', priceDisplay: '$957,000', beds: 5, baths: 4, sqft: 2627 },
  { slug: '5809-tudor-ln-rockville-md', address: '5809 Tudor Ln', cityStateZip: 'Rockville, MD 20852', priceDisplay: '$943,000', beds: 5, baths: 4, sqft: 2878 },
  { slug: '2291-stratton-dr-potomac-md', address: '2291 Stratton Dr', cityStateZip: 'Potomac, MD 20854', priceDisplay: '$920,000', beds: 4, baths: 3, sqft: 2500 },
  { slug: '30-sharpstead-lane-gaithersburg-md', address: '30 Sharpstead Lane', cityStateZip: 'Gaithersburg, MD 20878', priceDisplay: '$872,500', beds: 3, baths: 4, sqft: 2976 },
  { slug: '321-linden-ave-annapolis-md', address: '321 Linden Ave', cityStateZip: 'Annapolis, MD 21401', priceDisplay: '$860,000', beds: 4, baths: 4, sqft: 3277 },
  { slug: '6815-kincaid-ave-falls-church-va', address: '6815 Kincaid Ave', cityStateZip: 'Falls Church, VA 22042', priceDisplay: '$850,000', beds: 4, baths: 3, sqft: 1332 },
  { slug: '3413-metzerott-road-college-park-md', address: '3413 Metzerott Road', cityStateZip: 'College Park, MD 20740', priceDisplay: '$840,000', beds: 5, baths: 2, sqft: 2518 },
  { slug: '13503-stonebridge-ter-germantown-md', address: '13503 Stonebridge Ter', cityStateZip: 'Germantown, MD 20874', priceDisplay: '$835,000', beds: 4, baths: 4, sqft: 3656 },
];

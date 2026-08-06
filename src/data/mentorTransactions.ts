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

  // Everything below is optional MLS-depth detail. Only present when Kyle
  // has supplied the actual MLS sheet for that property - never inferred
  // or estimated. The detail page renders each section conditionally, so
  // a property without this data just shows the basics, never a guess
  // dressed up as a fact.
  mlsId?: string;
  description?: string;
  fullBaths?: number;
  halfBaths?: number;
  yearBuilt?: number;
  architectureStyle?: string;
  propertyType?: string;
  structureType?: string;
  stories?: number;
  county?: string;
  subdivision?: string;
  lotSizeDisplay?: string;
  pricePerSqft?: number;
  schoolDistrict?: string;
  elementarySchool?: string;
  middleSchool?: string;
  highSchool?: string;
  hoaFeeDisplay?: string;
  taxAnnualDisplay?: string;
  taxYear?: string;
  waterSource?: string;
  parking?: string;
  heatType?: string;
  airConditioning?: string;
  sewer?: string;
  interiorFeatures?: string;
  exteriorFeatures?: string;
  closeDate?: string; // "MM/DD/YY"
  daysOnMarket?: number;
  listingAgentName?: string;
  listingOfficeName?: string;
}

export const MENTOR_NAME = 'James Buckley';
export const MENTOR_AFFILIATION = 'Canopy Real Estate Group, eXp Realty';

export const MENTOR_TRANSACTIONS: MentorTransaction[] = [
  { slug: '4327-16th-st-n-arlington-va', address: '4327 16th St N', cityStateZip: 'Arlington, VA 22207', priceDisplay: '$2,100,000', beds: 5, baths: 5, sqft: 4500, image: '/images/transactions/4327-16th-st-n-arlington-va.jpg', images: ['/images/transactions/4327-16th-st-n-arlington-va-2.jpg', '/images/transactions/4327-16th-st-n-arlington-va-3.jpg', '/images/transactions/4327-16th-st-n-arlington-va-4.jpg', '/images/transactions/4327-16th-st-n-arlington-va-5.jpg', '/images/transactions/4327-16th-st-n-arlington-va-6.jpg', '/images/transactions/4327-16th-st-n-arlington-va-7.jpg', '/images/transactions/4327-16th-st-n-arlington-va-8.jpg', '/images/transactions/4327-16th-st-n-arlington-va-9.jpg', '/images/transactions/4327-16th-st-n-arlington-va-10.jpg', '/images/transactions/4327-16th-st-n-arlington-va-11.jpg', '/images/transactions/4327-16th-st-n-arlington-va-12.jpg', '/images/transactions/4327-16th-st-n-arlington-va-13.jpg', '/images/transactions/4327-16th-st-n-arlington-va-14.jpg', '/images/transactions/4327-16th-st-n-arlington-va-15.jpg'] },
  { slug: '9209-vendome-drive-bethesda-md', address: '9209 Vendome Drive', cityStateZip: 'Bethesda, MD 20817', priceDisplay: '$1,970,000', beds: 7, baths: 7, sqft: 6588, image: '/images/transactions/9209-vendome-drive-bethesda-md.jpg', images: ['/images/transactions/9209-vendome-drive-bethesda-md-2.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-3.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-4.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-5.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-6.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-7.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-8.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-9.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-10.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-11.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-12.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-13.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-14.jpg', '/images/transactions/9209-vendome-drive-bethesda-md-15.jpg'] },
  {
    slug: '626-a-old-county-road-severna-park-md',
    address: '626-A Old County Road',
    cityStateZip: 'Severna Park, MD 21146',
    priceDisplay: '$1,631,700',
    beds: 6,
    baths: 5,
    sqft: 4979,
    mlsId: 'MDAA2132672',
    description: "New construction in the waterfront Round Bay community, built by Grand Villa Homes and delivered in 2025. The Mid-Century Modern/Tudor-style home spans four levels with an elevator connecting them, a gourmet kitchen opening to the family room, a screened porch and terrace for outdoor living, a primary suite with a spa-style bath, and a finished lower level with a theater room, exercise room, and full bar. Community amenities include two marinas and a pool, with river views from multiple levels.",
    fullBaths: 4,
    halfBaths: 1,
    yearBuilt: 2025,
    architectureStyle: 'Mid-Century Modern, Tudor',
    propertyType: 'Residential',
    structureType: 'Detached',
    stories: 4,
    county: 'Anne Arundel County, MD',
    subdivision: 'Round Bay',
    lotSizeDisplay: '0.5 acres',
    pricePerSqft: 327.72,
    schoolDistrict: 'Anne Arundel County Public Schools',
    elementarySchool: 'Jones',
    middleSchool: 'Severna Park',
    highSchool: 'Severna Park',
    hoaFeeDisplay: '$400/year',
    taxAnnualDisplay: '$1,200',
    taxYear: '2025',
    waterSource: 'Public',
    parking: 'Attached garage, 2 spaces',
    heatType: 'Heat pump, natural gas',
    airConditioning: 'Central A/C',
    sewer: 'Public sewer',
    interiorFeatures: 'Elevator, open floor plan, gourmet kitchen, gas fireplace, stainless steel appliances, upper floor laundry',
    exteriorFeatures: 'Community pool, two community marinas, screened porch, terrace',
    closeDate: '01/29/26',
    daysOnMarket: 26,
    listingAgentName: 'Alexander VonBussenius',
    listingOfficeName: 'VB Realty, LLC',
    image: '/images/transactions/626-a-old-county-road-severna-park-md.jpg', images: ['/images/transactions/626-a-old-county-road-severna-park-md-2.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-3.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-4.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-5.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-6.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-7.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-8.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-9.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-10.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-11.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-12.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-13.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-14.jpg', '/images/transactions/626-a-old-county-road-severna-park-md-15.jpg']
  },
  { slug: '6302-30th-st-nw-washington-dc', address: '6302 30th St NW', cityStateZip: 'Washington, DC 20015', priceDisplay: '$1,528,000', beds: 4, baths: 4, sqft: 3276, image: '/images/transactions/6302-30th-st-nw-washington-dc.jpg', images: ['/images/transactions/6302-30th-st-nw-washington-dc-2.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-3.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-4.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-5.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-6.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-7.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-8.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-9.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-10.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-11.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-12.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-13.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-14.jpg', '/images/transactions/6302-30th-st-nw-washington-dc-15.jpg'] },
  { slug: '7812-preakness-ln-fairfax-station-va', address: '7812 Preakness Ln', cityStateZip: 'Fairfax Station, VA 22039', priceDisplay: '$1,275,000', beds: 5, baths: 5, sqft: 4835, image: '/images/transactions/7812-preakness-ln-fairfax-station-va.jpg', images: ['/images/transactions/7812-preakness-ln-fairfax-station-va-2.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-3.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-4.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-5.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-6.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-7.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-8.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-9.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-10.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-11.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-12.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-13.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-14.jpg', '/images/transactions/7812-preakness-ln-fairfax-station-va-15.jpg'] },
  { slug: '6920-mystic-woods-way-columbia-md', address: '6920 Mystic Woods Way', cityStateZip: 'Columbia, MD 21044', priceDisplay: '$1,170,000', beds: 5, baths: 4, sqft: 5557, image: '/images/transactions/6920-mystic-woods-way-columbia-md.jpg', images: ['/images/transactions/6920-mystic-woods-way-columbia-md-2.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-3.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-4.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-5.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-6.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-7.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-8.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-9.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-10.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-11.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-12.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-13.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-14.jpg', '/images/transactions/6920-mystic-woods-way-columbia-md-15.jpg'] },
  { slug: '803-c-st-ne-washington-dc', address: '803 C St NE', cityStateZip: 'Washington, DC 20002', priceDisplay: '$1,110,000', beds: 3, baths: 2, sqft: 1568, image: '/images/transactions/803-c-st-ne-washington-dc.jpg', images: ['/images/transactions/803-c-st-ne-washington-dc-2.jpg', '/images/transactions/803-c-st-ne-washington-dc-3.jpg', '/images/transactions/803-c-st-ne-washington-dc-4.jpg', '/images/transactions/803-c-st-ne-washington-dc-5.jpg', '/images/transactions/803-c-st-ne-washington-dc-6.jpg', '/images/transactions/803-c-st-ne-washington-dc-7.jpg', '/images/transactions/803-c-st-ne-washington-dc-8.jpg', '/images/transactions/803-c-st-ne-washington-dc-9.jpg', '/images/transactions/803-c-st-ne-washington-dc-10.jpg', '/images/transactions/803-c-st-ne-washington-dc-11.jpg', '/images/transactions/803-c-st-ne-washington-dc-12.jpg', '/images/transactions/803-c-st-ne-washington-dc-13.jpg', '/images/transactions/803-c-st-ne-washington-dc-14.jpg', '/images/transactions/803-c-st-ne-washington-dc-15.jpg'] },
  { slug: '7106-stratos-ln-gaithersburg-md', address: '7106 Stratos Ln', cityStateZip: 'Gaithersburg, MD 20879', priceDisplay: '$1,075,000', beds: 6, baths: 5, sqft: 5477, image: '/images/transactions/7106-stratos-ln-gaithersburg-md.jpg', images: ['/images/transactions/7106-stratos-ln-gaithersburg-md-2.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-3.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-4.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-5.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-6.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-7.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-8.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-9.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-10.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-11.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-12.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-13.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-14.jpg', '/images/transactions/7106-stratos-ln-gaithersburg-md-15.jpg'] },
  { slug: '6614-eastern-avenue-nw-washington-dc', address: '6614 Eastern Avenue NW', cityStateZip: 'Washington, DC 20012', priceDisplay: '$1,000,000', beds: 7, baths: 4, sqft: 2902, image: '/images/transactions/6614-eastern-avenue-nw-washington-dc.jpg', images: ['/images/transactions/6614-eastern-avenue-nw-washington-dc-2.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-3.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-4.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-5.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-6.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-7.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-8.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-9.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-10.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-11.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-12.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-13.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-14.jpg', '/images/transactions/6614-eastern-avenue-nw-washington-dc-15.jpg'] },
  { slug: '5-orleans-ter-kensington-md', address: '5 Orleans Ter', cityStateZip: 'Kensington, MD 20895', priceDisplay: '$957,000', beds: 5, baths: 4, sqft: 2627, image: '/images/transactions/5-orleans-ter-kensington-md.jpg', images: ['/images/transactions/5-orleans-ter-kensington-md-2.jpg', '/images/transactions/5-orleans-ter-kensington-md-3.jpg', '/images/transactions/5-orleans-ter-kensington-md-4.jpg', '/images/transactions/5-orleans-ter-kensington-md-5.jpg', '/images/transactions/5-orleans-ter-kensington-md-6.jpg', '/images/transactions/5-orleans-ter-kensington-md-7.jpg', '/images/transactions/5-orleans-ter-kensington-md-8.jpg', '/images/transactions/5-orleans-ter-kensington-md-9.jpg', '/images/transactions/5-orleans-ter-kensington-md-10.jpg', '/images/transactions/5-orleans-ter-kensington-md-11.jpg', '/images/transactions/5-orleans-ter-kensington-md-12.jpg', '/images/transactions/5-orleans-ter-kensington-md-13.jpg', '/images/transactions/5-orleans-ter-kensington-md-14.jpg', '/images/transactions/5-orleans-ter-kensington-md-15.jpg'] },
  { slug: '5809-tudor-ln-rockville-md', address: '5809 Tudor Ln', cityStateZip: 'Rockville, MD 20852', priceDisplay: '$943,000', beds: 5, baths: 4, sqft: 2878, image: '/images/transactions/5809-tudor-ln-rockville-md.jpg', images: ['/images/transactions/5809-tudor-ln-rockville-md-2.jpg', '/images/transactions/5809-tudor-ln-rockville-md-3.jpg', '/images/transactions/5809-tudor-ln-rockville-md-4.jpg', '/images/transactions/5809-tudor-ln-rockville-md-5.jpg', '/images/transactions/5809-tudor-ln-rockville-md-6.jpg', '/images/transactions/5809-tudor-ln-rockville-md-7.jpg', '/images/transactions/5809-tudor-ln-rockville-md-8.jpg', '/images/transactions/5809-tudor-ln-rockville-md-9.jpg', '/images/transactions/5809-tudor-ln-rockville-md-10.jpg', '/images/transactions/5809-tudor-ln-rockville-md-11.jpg', '/images/transactions/5809-tudor-ln-rockville-md-12.jpg', '/images/transactions/5809-tudor-ln-rockville-md-13.jpg', '/images/transactions/5809-tudor-ln-rockville-md-14.jpg', '/images/transactions/5809-tudor-ln-rockville-md-15.jpg'] },
  { slug: '2291-stratton-dr-potomac-md', address: '2291 Stratton Dr', cityStateZip: 'Potomac, MD 20854', priceDisplay: '$920,000', beds: 4, baths: 3, sqft: 2500, image: '/images/transactions/2291-stratton-dr-potomac-md.jpg', images: ['/images/transactions/2291-stratton-dr-potomac-md-2.jpg', '/images/transactions/2291-stratton-dr-potomac-md-3.jpg', '/images/transactions/2291-stratton-dr-potomac-md-4.jpg', '/images/transactions/2291-stratton-dr-potomac-md-5.jpg', '/images/transactions/2291-stratton-dr-potomac-md-6.jpg', '/images/transactions/2291-stratton-dr-potomac-md-7.jpg', '/images/transactions/2291-stratton-dr-potomac-md-8.jpg', '/images/transactions/2291-stratton-dr-potomac-md-9.jpg', '/images/transactions/2291-stratton-dr-potomac-md-10.jpg', '/images/transactions/2291-stratton-dr-potomac-md-11.jpg', '/images/transactions/2291-stratton-dr-potomac-md-12.jpg', '/images/transactions/2291-stratton-dr-potomac-md-13.jpg', '/images/transactions/2291-stratton-dr-potomac-md-14.jpg', '/images/transactions/2291-stratton-dr-potomac-md-15.jpg'] },
  { slug: '30-sharpstead-lane-gaithersburg-md', address: '30 Sharpstead Lane', cityStateZip: 'Gaithersburg, MD 20878', priceDisplay: '$872,500', beds: 3, baths: 4, sqft: 2976, image: '/images/transactions/30-sharpstead-lane-gaithersburg-md.jpg', images: ['/images/transactions/30-sharpstead-lane-gaithersburg-md-2.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-3.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-4.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-5.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-6.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-7.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-8.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-9.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-10.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-11.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-12.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-13.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-14.jpg', '/images/transactions/30-sharpstead-lane-gaithersburg-md-15.jpg'] },
  { slug: '321-linden-ave-annapolis-md', address: '321 Linden Ave', cityStateZip: 'Annapolis, MD 21401', priceDisplay: '$860,000', beds: 4, baths: 4, sqft: 3277, image: '/images/transactions/321-linden-ave-annapolis-md.jpg', images: ['/images/transactions/321-linden-ave-annapolis-md-2.jpg', '/images/transactions/321-linden-ave-annapolis-md-3.jpg', '/images/transactions/321-linden-ave-annapolis-md-4.jpg', '/images/transactions/321-linden-ave-annapolis-md-5.jpg', '/images/transactions/321-linden-ave-annapolis-md-6.jpg', '/images/transactions/321-linden-ave-annapolis-md-7.jpg', '/images/transactions/321-linden-ave-annapolis-md-8.jpg', '/images/transactions/321-linden-ave-annapolis-md-9.jpg', '/images/transactions/321-linden-ave-annapolis-md-10.jpg', '/images/transactions/321-linden-ave-annapolis-md-11.jpg', '/images/transactions/321-linden-ave-annapolis-md-12.jpg', '/images/transactions/321-linden-ave-annapolis-md-13.jpg', '/images/transactions/321-linden-ave-annapolis-md-14.jpg', '/images/transactions/321-linden-ave-annapolis-md-15.jpg'] },
  { slug: '6815-kincaid-ave-falls-church-va', address: '6815 Kincaid Ave', cityStateZip: 'Falls Church, VA 22042', priceDisplay: '$850,000', beds: 4, baths: 3, sqft: 1332, image: '/images/transactions/6815-kincaid-ave-falls-church-va.jpg', images: ['/images/transactions/6815-kincaid-ave-falls-church-va-2.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-3.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-4.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-5.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-6.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-7.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-8.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-9.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-10.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-11.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-12.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-13.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-14.jpg', '/images/transactions/6815-kincaid-ave-falls-church-va-15.jpg'] },
  { slug: '3413-metzerott-road-college-park-md', address: '3413 Metzerott Road', cityStateZip: 'College Park, MD 20740', priceDisplay: '$840,000', beds: 5, baths: 2, sqft: 2518, image: '/images/transactions/3413-metzerott-road-college-park-md.jpg', images: ['/images/transactions/3413-metzerott-road-college-park-md-2.jpg', '/images/transactions/3413-metzerott-road-college-park-md-3.jpg', '/images/transactions/3413-metzerott-road-college-park-md-4.jpg', '/images/transactions/3413-metzerott-road-college-park-md-5.jpg', '/images/transactions/3413-metzerott-road-college-park-md-6.jpg', '/images/transactions/3413-metzerott-road-college-park-md-7.jpg', '/images/transactions/3413-metzerott-road-college-park-md-8.jpg', '/images/transactions/3413-metzerott-road-college-park-md-9.jpg', '/images/transactions/3413-metzerott-road-college-park-md-10.jpg', '/images/transactions/3413-metzerott-road-college-park-md-11.jpg', '/images/transactions/3413-metzerott-road-college-park-md-12.jpg', '/images/transactions/3413-metzerott-road-college-park-md-13.jpg', '/images/transactions/3413-metzerott-road-college-park-md-14.jpg', '/images/transactions/3413-metzerott-road-college-park-md-15.jpg'] },
  { slug: '13503-stonebridge-ter-germantown-md', address: '13503 Stonebridge Ter', cityStateZip: 'Germantown, MD 20874', priceDisplay: '$835,000', beds: 4, baths: 4, sqft: 3656, image: '/images/transactions/13503-stonebridge-ter-germantown-md.jpg', images: ['/images/transactions/13503-stonebridge-ter-germantown-md-2.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-3.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-4.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-5.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-6.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-7.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-8.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-9.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-10.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-11.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-12.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-13.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-14.jpg', '/images/transactions/13503-stonebridge-ter-germantown-md-15.jpg'] },
];

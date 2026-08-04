// src/data/towns.ts
//
// Real towns/neighborhoods within Kyle's 4-county service area, used for
// the individual neighborhood detail pages. Coordinates are approximate
// town-center points (accurate enough for Walk Score/Census/Places
// lookups, which don't need pinpoint precision - just "the right town").
//
// countyFips is the 5-digit county code (2-digit MD state prefix + 3-digit
// county code), used to filter the Urban Institute school data:
//   Carroll County   = 24013
//   Baltimore County = 24005
//   Howard County    = 24027
//   Frederick County = 24021

export interface Town {
  slug: string;
  name: string;
  county: 'Carroll County' | 'Baltimore County' | 'Howard County' | 'Frederick County';
  countyFips: string;
  lat: number;
  lng: number;
}

export const TOWNS: Town[] = [
  // Carroll County
  { slug: 'westminster', name: 'Westminster', county: 'Carroll County', countyFips: '24013', lat: 39.575, lng: -76.996 },
  { slug: 'eldersburg', name: 'Eldersburg', county: 'Carroll County', countyFips: '24013', lat: 39.4109, lng: -76.9483 },
  { slug: 'sykesville', name: 'Sykesville', county: 'Carroll County', countyFips: '24013', lat: 39.3712, lng: -76.9691 },
  { slug: 'mount-airy', name: 'Mount Airy', county: 'Carroll County', countyFips: '24013', lat: 39.3765, lng: -77.1522 },
  { slug: 'taneytown', name: 'Taneytown', county: 'Carroll County', countyFips: '24013', lat: 39.6587, lng: -77.1697 },
  { slug: 'hampstead', name: 'Hampstead', county: 'Carroll County', countyFips: '24013', lat: 39.6062, lng: -76.8508 },
  { slug: 'manchester', name: 'Manchester', county: 'Carroll County', countyFips: '24013', lat: 39.6668, lng: -76.8838 },
  { slug: 'new-windsor', name: 'New Windsor', county: 'Carroll County', countyFips: '24013', lat: 39.5387, lng: -77.0716 },

  // Howard County
  { slug: 'columbia', name: 'Columbia', county: 'Howard County', countyFips: '24027', lat: 39.2037, lng: -76.8610 },
  { slug: 'ellicott-city', name: 'Ellicott City', county: 'Howard County', countyFips: '24027', lat: 39.2673, lng: -76.7983 },
  { slug: 'elkridge', name: 'Elkridge', county: 'Howard County', countyFips: '24027', lat: 39.2126, lng: -76.7105 },
  { slug: 'clarksville', name: 'Clarksville', county: 'Howard County', countyFips: '24027', lat: 39.2181, lng: -76.9550 },
  { slug: 'fulton', name: 'Fulton', county: 'Howard County', countyFips: '24027', lat: 39.1651, lng: -76.9077 },
  { slug: 'highland', name: 'Highland', county: 'Howard County', countyFips: '24027', lat: 39.1704, lng: -76.9666 },
  { slug: 'savage', name: 'Savage', county: 'Howard County', countyFips: '24027', lat: 39.1373, lng: -76.8236 },

  // Baltimore County
  { slug: 'towson', name: 'Towson', county: 'Baltimore County', countyFips: '24005', lat: 39.4015, lng: -76.6019 },
  { slug: 'timonium', name: 'Timonium', county: 'Baltimore County', countyFips: '24005', lat: 39.4515, lng: -76.6383 },
  { slug: 'cockeysville', name: 'Cockeysville', county: 'Baltimore County', countyFips: '24005', lat: 39.4762, lng: -76.6427 },
  { slug: 'owings-mills', name: 'Owings Mills', county: 'Baltimore County', countyFips: '24005', lat: 39.4198, lng: -76.7805 },
  { slug: 'reisterstown', name: 'Reisterstown', county: 'Baltimore County', countyFips: '24005', lat: 39.4707, lng: -76.8266 },
  { slug: 'hunt-valley', name: 'Hunt Valley', county: 'Baltimore County', countyFips: '24005', lat: 39.4954, lng: -76.6455 },
  { slug: 'catonsville', name: 'Catonsville', county: 'Baltimore County', countyFips: '24005', lat: 39.2721, lng: -76.7319 },
  { slug: 'parkville', name: 'Parkville', county: 'Baltimore County', countyFips: '24005', lat: 39.3801, lng: -76.5461 },

  // Frederick County
  { slug: 'downtown-frederick', name: 'Downtown Frederick', county: 'Frederick County', countyFips: '24021', lat: 39.4143, lng: -77.4105 },
  { slug: 'urbana', name: 'Urbana', county: 'Frederick County', countyFips: '24021', lat: 39.3204, lng: -77.3552 },
  { slug: 'new-market', name: 'New Market', county: 'Frederick County', countyFips: '24021', lat: 39.3862, lng: -77.2769 },
  { slug: 'walkersville', name: 'Walkersville', county: 'Frederick County', countyFips: '24021', lat: 39.4854, lng: -77.3488 },
  { slug: 'middletown', name: 'Middletown', county: 'Frederick County', countyFips: '24021', lat: 39.4437, lng: -77.5461 },
  { slug: 'brunswick', name: 'Brunswick', county: 'Frederick County', countyFips: '24021', lat: 39.3143, lng: -77.6280 },
  { slug: 'emmitsburg', name: 'Emmitsburg', county: 'Frederick County', countyFips: '24021', lat: 39.7051, lng: -77.3241 },
];

export function getTownBySlug(slug: string): Town | undefined {
  return TOWNS.find((t) => t.slug === slug);
}

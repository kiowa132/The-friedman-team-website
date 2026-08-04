// src/data/towns.ts
//
// Real towns/neighborhoods within Kyle's 4-county service area.
//
// countyFips = 5-digit county code (2-digit MD state prefix + 3-digit
// county code): Carroll=24013, Baltimore=24005, Howard=24027, Frederick=24021
//
// image: representative/atmospheric stock photography (Unsplash) - NOT
// claimed to be an actual photo of that specific town, same convention
// used elsewhere on this site for thematic imagery.
//
// content: real, researched written sections (overview, restaurants/
// retail, things to do, transportation, schools resource). Currently
// written for 4 example towns (one per county) as a proven pattern before
// writing the remaining 26 - every fact here was checked against real
// sources, nothing invented. Towns without a `content` block simply don't
// show those sections yet, rather than showing placeholder text.

export interface TownContent {
  overview: string;
  restaurantsRetail: string;
  thingsToDo: string[];
  transportation: string;
  schoolsResourceUrl?: string;
  schoolsResourceLabel?: string;
}

export interface Town {
  slug: string;
  name: string;
  county: 'Carroll County' | 'Baltimore County' | 'Howard County' | 'Frederick County';
  countyFips: string;
  lat: number;
  lng: number;
  image: string;
  content?: TownContent;
}

export const TOWNS: Town[] = [
  // ------------------------- Carroll County -------------------------
  {
    slug: 'westminster',
    name: 'Westminster',
    county: 'Carroll County',
    countyFips: '24013',
    lat: 39.575,
    lng: -76.996,
    image: '/images/towns/westminster.jpg',
    content: {
      overview: "Westminster is the seat of Carroll County and one of Maryland's Nationally Accredited Main Street communities, with a walkable historic downtown built up along Main Street since the city was laid out in 1764. It's home to McDaniel College, and sits within easy reach of Baltimore (about 45 minutes), Washington D.C. (about 90 minutes), and Gettysburg (about 35 minutes).",
      restaurantsRetail: "Main Street is lined with locally-owned restaurants, shops, and galleries rather than national chains - it's a genuine small-town commercial strip, not a shopping center. The Downtown Westminster Farmers' Market has run every spring, summer, and fall since 1994.",
      thingsToDo: [
        'Walk Historic Main Street and its 19th-century commercial buildings and landmark homes',
        'Catch a show at the Carroll Arts Center, a restored 263-seat Art Deco theater',
        'Visit the Carroll County Farm Museum, a 140-acre living-history farm complex',
        'Tour the Sherman-Fisher-Shellman House, home of the Historical Society of Carroll County',
        'Attend the annual Maryland Wine Festival, held on the Farm Museum grounds each September',
      ],
      transportation: "Westminster is a car-oriented small city - Main Street and the surrounding neighborhoods are walkable, but getting to Baltimore, Howard County, or DC means driving. Route 140 and Route 97 are the main roads in and out of town.",
      schoolsResourceUrl: 'https://www.carrollk12.org/',
      schoolsResourceLabel: 'Carroll County Public Schools',
    },
  },
  { slug: 'eldersburg', name: 'Eldersburg', county: 'Carroll County', countyFips: '24013', lat: 39.4109, lng: -76.9483, image: '/images/towns/eldersburg.jpg' },
  { slug: 'sykesville', name: 'Sykesville', county: 'Carroll County', countyFips: '24013', lat: 39.3712, lng: -76.9691, image: '/images/towns/sykesville.jpg' },
  { slug: 'mount-airy', name: 'Mount Airy', county: 'Carroll County', countyFips: '24013', lat: 39.3765, lng: -77.1522, image: '/images/towns/mount-airy.jpg' },
  { slug: 'taneytown', name: 'Taneytown', county: 'Carroll County', countyFips: '24013', lat: 39.6587, lng: -77.1697, image: '/images/towns/taneytown.jpg' },
  { slug: 'hampstead', name: 'Hampstead', county: 'Carroll County', countyFips: '24013', lat: 39.6062, lng: -76.8508, image: '/images/towns/hampstead.jpg' },
  { slug: 'manchester', name: 'Manchester', county: 'Carroll County', countyFips: '24013', lat: 39.6668, lng: -76.8838, image: '/images/towns/manchester.jpg' },
  { slug: 'new-windsor', name: 'New Windsor', county: 'Carroll County', countyFips: '24013', lat: 39.5387, lng: -77.0716, image: '/images/towns/new-windsor.jpg' },

  // ------------------------- Howard County -------------------------
  {
    slug: 'columbia',
    name: 'Columbia',
    county: 'Howard County',
    countyFips: '24027',
    lat: 39.2037,
    lng: -76.8610,
    image: '/images/towns/columbia.jpg',
    content: {
      overview: "Columbia is a large planned community that makes up much of Howard County, built around a series of self-contained villages surrounding Lake Kittamaqundi and the Downtown Columbia Lakefront. It's centered on the Merriweather District, home to Merriweather Post Pavilion - the Frank Gehry-designed outdoor amphitheater that's hosted touring music acts for over four decades.",
      restaurantsRetail: "The Mall in Columbia anchors traditional retail, while the Lakefront and Merriweather District have grown into Columbia's dining and nightlife center, with restaurants and bars like Blackwall Barn & Lodge and Smashing Grapes set right along the water.",
      thingsToDo: [
        'Walk or bike the one-mile loop around Lake Kittamaqundi',
        'Catch a concert at Merriweather Post Pavilion or the Chrysalis Amphitheater at Symphony Woods',
        "See a show at Toby's Dinner Theater, an all-you-can-eat dinner theater founded by Toby Orenstein",
        'Take the kids to the Robinson Nature Center for hands-on environmental exhibits',
        'Attend Lakefront Live!, free weekly summer concerts and outdoor movies at the Downtown Lakefront',
      ],
      transportation: 'Columbia was built around a road network connecting its villages, plus a growing network of trails, including the Downtown Columbia Trail and the Merriweather District Trail, both built for walking, running, and biking between neighborhoods. Howard Transit and MTA bus routes serve the area, and BWI Airport is a short drive away.',
      schoolsResourceUrl: 'https://www.hcpss.org/',
      schoolsResourceLabel: 'Howard County Public School System',
    },
  },
  { slug: 'ellicott-city', name: 'Ellicott City', county: 'Howard County', countyFips: '24027', lat: 39.2673, lng: -76.7983, image: '/images/towns/ellicott-city.jpg' },
  { slug: 'elkridge', name: 'Elkridge', county: 'Howard County', countyFips: '24027', lat: 39.2126, lng: -76.7105, image: '/images/towns/elkridge.jpg' },
  { slug: 'clarksville', name: 'Clarksville', county: 'Howard County', countyFips: '24027', lat: 39.2181, lng: -76.9550, image: '/images/towns/clarksville.jpg' },
  { slug: 'fulton', name: 'Fulton', county: 'Howard County', countyFips: '24027', lat: 39.1651, lng: -76.9077, image: '/images/towns/fulton.jpg' },
  { slug: 'highland', name: 'Highland', county: 'Howard County', countyFips: '24027', lat: 39.1704, lng: -76.9666, image: '/images/towns/highland.jpg' },
  { slug: 'savage', name: 'Savage', county: 'Howard County', countyFips: '24027', lat: 39.1373, lng: -76.8236, image: '/images/towns/savage.jpg' },

  // ------------------------- Baltimore County -------------------------
  {
    slug: 'towson',
    name: 'Towson',
    county: 'Baltimore County',
    countyFips: '24005',
    lat: 39.4015,
    lng: -76.6019,
    image: '/images/towns/towson.jpg',
    content: {
      overview: 'Towson is the seat of Baltimore County, a college town about 8 miles north of downtown Baltimore built around Towson University. Landmarks include the Baltimore County Courthouse, which dates back to 1854, and Towson Town Center, one of the largest shopping malls in Maryland.',
      restaurantsRetail: 'Towson Town Center is the retail anchor, with over 180 stores spanning mainstream brands, specialty shops, and international dining. Downtown Towson itself has a walkable mix of restaurants, bookstores, and a Cinemark movie theater within reach of the university.',
      thingsToDo: [
        "Shop and dine at Towson Town Center, one of Maryland's largest indoor malls",
        'Catch a game or concert at SECU Arena or Johnny Unitas Stadium on the Towson University campus',
        'Tour the historic Baltimore County Courthouse, built in 1854',
        "Walk the tree-lined streets around Towson University's campus",
        'Take the short drive into downtown Baltimore for the Inner Harbor, Camden Yards, and Fells Point',
      ],
      transportation: 'Towson is well connected by MTA bus and light rail service into Baltimore, and I-695 (the Baltimore Beltway) runs along the edge of town, making it an easy commute into the city or out toward the rest of Baltimore County.',
      schoolsResourceUrl: 'https://www.bcps.org/',
      schoolsResourceLabel: 'Baltimore County Public Schools',
    },
  },
  { slug: 'timonium', name: 'Timonium', county: 'Baltimore County', countyFips: '24005', lat: 39.4515, lng: -76.6383, image: '/images/towns/timonium.jpg' },
  { slug: 'cockeysville', name: 'Cockeysville', county: 'Baltimore County', countyFips: '24005', lat: 39.4762, lng: -76.6427, image: '/images/towns/cockeysville.jpg' },
  { slug: 'owings-mills', name: 'Owings Mills', county: 'Baltimore County', countyFips: '24005', lat: 39.4198, lng: -76.7805, image: '/images/towns/owings-mills.jpg' },
  { slug: 'reisterstown', name: 'Reisterstown', county: 'Baltimore County', countyFips: '24005', lat: 39.4707, lng: -76.8266, image: '/images/towns/reisterstown.jpg' },
  { slug: 'hunt-valley', name: 'Hunt Valley', county: 'Baltimore County', countyFips: '24005', lat: 39.4954, lng: -76.6455, image: '/images/towns/hunt-valley.jpg' },
  { slug: 'catonsville', name: 'Catonsville', county: 'Baltimore County', countyFips: '24005', lat: 39.2721, lng: -76.7319, image: '/images/towns/catonsville.jpg' },
  { slug: 'parkville', name: 'Parkville', county: 'Baltimore County', countyFips: '24005', lat: 39.3801, lng: -76.5461, image: '/images/towns/parkville.jpg' },

  // ------------------------- Frederick County -------------------------
  {
    slug: 'downtown-frederick',
    name: 'Downtown Frederick',
    county: 'Frederick County',
    countyFips: '24021',
    lat: 39.4143,
    lng: -77.4105,
    image: '/images/towns/downtown-frederick.jpg',
    content: {
      overview: 'Downtown Frederick is a genuinely walkable historic district of well-preserved 18th- and 19th-century architecture, built around Carroll Creek Linear Park - a 1.3-mile park built atop a former flood-control channel through the center of town, now lined with public art, water features, and restaurants.',
      restaurantsRetail: "Downtown Frederick has an eclectic, mostly independent mix of boutiques, antique shops, breweries, and restaurants, many facing directly onto Carroll Creek Park. McClintock Distilling is one of several craft producers along the creek.",
      thingsToDo: [
        'Walk Carroll Creek Linear Park and its water gardens, public art, and pedestrian bridges',
        'Catch a show at the Weinberg Center for the Arts',
        'Visit the National Museum of Civil War Medicine',
        'Browse the Delaplaine Visual Arts Education Center',
        "Explore Historic Downtown Frederick's 18th- and 19th-century architecture on foot",
      ],
      transportation: 'Downtown Frederick is compact and walkable on its own, with MARC train service connecting Frederick to Washington D.C. and easy access to I-70 and I-270 for commutes toward Baltimore, DC, and the rest of Frederick County.',
      schoolsResourceUrl: 'https://www.fcps.org/',
      schoolsResourceLabel: 'Frederick County Public Schools',
    },
  },
  { slug: 'urbana', name: 'Urbana', county: 'Frederick County', countyFips: '24021', lat: 39.3204, lng: -77.3552, image: '/images/towns/urbana.jpg' },
  { slug: 'new-market', name: 'New Market', county: 'Frederick County', countyFips: '24021', lat: 39.3862, lng: -77.2769, image: '/images/towns/new-market.jpg' },
  { slug: 'walkersville', name: 'Walkersville', county: 'Frederick County', countyFips: '24021', lat: 39.4854, lng: -77.3488, image: '/images/towns/walkersville.jpg' },
  { slug: 'middletown', name: 'Middletown', county: 'Frederick County', countyFips: '24021', lat: 39.4437, lng: -77.5461, image: '/images/towns/middletown.jpg' },
  { slug: 'brunswick', name: 'Brunswick', county: 'Frederick County', countyFips: '24021', lat: 39.3143, lng: -77.6280, image: '/images/towns/brunswick.jpg' },
  { slug: 'emmitsburg', name: 'Emmitsburg', county: 'Frederick County', countyFips: '24021', lat: 39.7051, lng: -77.3241, image: '/images/towns/emmitsburg.jpg' },
];

export function getTownBySlug(slug: string): Town | undefined {
  return TOWNS.find((t) => t.slug === slug);
}

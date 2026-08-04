import { Listing, Neighborhood, MarketTrendData, MarketStat, EditorialArticle } from '../types';

export const FEATURED_LISTINGS: Listing[] = [
  {
    id: 'friedman-01',
    title: 'The Manor at Green Spring Valley',
    price: 3850000,
    formattedPrice: '$3,850,000',
    address: '11200 Falls Road',
    city: 'Lutherville-Timonium',
    county: 'Baltimore County',
    zip: '21093',
    beds: 6,
    baths: 8,
    sqft: 9850,
    acres: 14.5,
    propertyType: 'Historic Manor',
    status: 'Active',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An iconic Maryland stone manor positioned amidst 14.5 rolling acres in prestigious Green Spring Valley. Featuring custom fieldstone masonry, hand-milled hardwood floors, a temperature-controlled 1,200-bottle wine cellar, saltwater infinity pool overlooking private woods, and a 4-stall equestrian facility.',
    highlights: [
      'Custom Fieldstone Construction',
      '1,200-Bottle Climate Controlled Cellar',
      '4-Stall Barn with Paddocks',
      'Resort Saltwater Pool & Outdoor Kitchen',
      'Geothermal HVAC & Solar Infrastructure'
    ],
    yearBuilt: 2018,
    mlsNumber: 'MDBA2039410',
    virtualTourUrl: 'https://my.matterport.com/show/?m=sample',
    featured: true
  },
  {
    id: 'friedman-02',
    title: 'Whispering Pines Equestrian Estate',
    price: 2495000,
    formattedPrice: '$2,495,000',
    address: '2840 Sykesville Road',
    city: 'Eldersburg',
    county: 'Carroll County',
    zip: '21784',
    beds: 5,
    baths: 6,
    sqft: 7200,
    acres: 22.8,
    propertyType: 'Equestrian Farm',
    status: 'Active',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Premier Carroll County horse farm and luxury residence set on 22+ preserved acres. Complete with a 10-stall state-of-the-art barn, indoor riding arena with custom footing, fenced pastures, and a stone main residence with main-floor primary retreat and panoramic pastoral vistas.',
    highlights: [
      '10-Stall Barn with Tack Room & Wash Bay',
      '100x200 Indoor Riding Arena',
      '4 board-fenced turnout pastures',
      'First-floor Owner Suite with Heated Floors',
      'Adjacent to Liberty Reservoir Conservation Trails'
    ],
    yearBuilt: 2021,
    mlsNumber: 'CRRL2018492',
    featured: true
  },
  {
    id: 'friedman-03',
    title: 'The Glass Pavilion at River Hill',
    price: 2950000,
    formattedPrice: '$2,950,000',
    address: '7410 Maple Lawn Boulevard',
    city: 'Fulton',
    county: 'Howard County',
    zip: '20759',
    beds: 5,
    baths: 7,
    sqft: 8100,
    acres: 3.2,
    propertyType: 'Modern Sanctuary',
    status: 'Active',
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753086-35f133c65dae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An architectural masterpiece in Fulton, Howard County. Designed around seamless indoor-outdoor living, this modern sanctuary features floor-to-ceiling glass walls, a minimalist floating staircase, motor court, smart home automation, and an indoor spa lounge.',
    highlights: [
      'Architectural Glass & Steel Construction',
      'Smart Home Control4 Ecosystem',
      'Automated Screened Lanai with Fireplace',
      'Commercial-Grade Chef Kitchen with Gaggenau Appliances',
      'Private Spa Room with Steam Shower & Sauna'
    ],
    yearBuilt: 2023,
    mlsNumber: 'HWDC2009381',
    featured: true
  },
  {
    id: 'friedman-04',
    title: 'Fairview Farm & Country Estate',
    price: 1895000,
    formattedPrice: '$1,895,000',
    address: '4100 Ridge Road',
    city: 'Mount Airy',
    county: 'Carroll County',
    zip: '21771',
    beds: 4,
    baths: 4.5,
    sqft: 5800,
    acres: 35.0,
    propertyType: 'Equestrian Farm',
    status: 'Active',
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Generational 35-acre farm estate in Mount Airy. Blending classic country architecture with high-end modern comforts. Private pond, 6-stall restored timber barn, agricultural tax assessment, and sweeping sunset views over western Carroll County.',
    highlights: [
      '35 Acres of Preserved Agricultural Land',
      'Private Stocked Spring-Fed Pond',
      'Restored Historic Timber Frame Barn',
      'Low Agricultural Property Tax Status',
      'Wrap-Around Mahogany Porch'
    ],
    yearBuilt: 2019,
    mlsNumber: 'CRRL2021004',
    featured: true
  },
  {
    id: 'friedman-05',
    title: 'The Reserve at Springfield Manor',
    price: 3200000,
    formattedPrice: '$3,200,000',
    address: '520 Springfield Avenue',
    city: 'Sykesville',
    county: 'Carroll County',
    zip: '21784',
    beds: 6,
    baths: 7,
    sqft: 8900,
    acres: 8.5,
    propertyType: 'Luxury Estate',
    status: 'Private Placement',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An exclusive off-market estate situated on a high ridge in Sykesville. Custom crafted by premier Maryland luxury builders, featuring dual primary suites, private executive wing, subterranean golf simulator room, and resort pool complex.',
    highlights: [
      'Off-Market Private Placement',
      'Custom TrackMan Golf Simulator Facility',
      'Dual Primary Luxury Suites',
      'Discreet Gated Entryway',
      'Custom Heated Swimming Pool & Cabana'
    ],
    yearBuilt: 2022,
    mlsNumber: 'CRRL2038119',
    featured: true
  },
  {
    id: 'friedman-06',
    title: 'Historic Uniontown Stone Residence',
    price: 1650000,
    formattedPrice: '$1,650,000',
    address: '145 Main Street',
    city: 'Westminster',
    county: 'Carroll County',
    zip: '21157',
    beds: 4,
    baths: 4,
    sqft: 4900,
    acres: 5.8,
    propertyType: 'Historic Manor',
    status: 'Active',
    heroImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Meticulously restored 1840s stone landmark near historic Westminster. Seamlessly fuses 19th-century craftsmanship with 21st-century geothermal systems, a bespoke La Cornue kitchen, and lush manicured English boxwood gardens.',
    highlights: [
      'National Register Historic Significance',
      'Restored Original Exposed Beams & Fireplaces',
      'La Cornue Chateau Series Range',
      'Geothermal Heating & Cooling Systems',
      'English Boxwood Courtyard'
    ],
    yearBuilt: 1842,
    mlsNumber: 'CRRL2029910',
    featured: false
  }
];

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'frederick-county',
    name: 'Frederick County',
    county: 'Frederick County',
    tagline: 'Historic Downtown Charm, Mountain Views & Small-Town Character',
    avgHomeValue: '$450,000 to $1,800,000+',
    medianDaysOnMarket: 13,
    heroImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    ],
    marketOverview: 'Frederick County pairs a genuinely walkable, historic downtown with easy access to the mountains and quick commutes toward Baltimore, DC, and Carroll County. From in-town rowhomes to acreage on the county\'s western edge, it offers a range most nearby counties can\'t match at the same price point.',
    lifestyle: 'Downtown Frederick\'s restaurant and arts scene, Catoctin Mountain hiking and orchards, small-town main streets in Thurmont, Walkersville, and Middletown, and easy commuter access via Route 15 and I-70.',
    localAttractions: [
      'Historic Downtown Frederick',
      'Catoctin Mountain Park',
      'Carroll Creek Linear Park',
      'Sugarloaf Mountain',
      'Thurmont & Emmitsburg Main Streets'
    ],
    schoolsRating: '8/10 Strong Public School System',
    featuredListingIds: [],
    seoKeywords: ['Frederick County MD real estate', 'Downtown Frederick homes for sale', 'Frederick County land for sale', 'Walkersville MD homes']
  },
  {
    id: 'carroll-county',
    name: 'Carroll County',
    county: 'Carroll County',
    tagline: 'Rolling Pastoral Hills, Historic Towns & Premier Farm Estates',
    avgHomeValue: '$875,000 to $3,500,000+',
    medianDaysOnMarket: 14,
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    marketOverview: 'Carroll County offers a rare combination of serene rural privacy, expansive agricultural land, and convenient proximity to Baltimore and Washington, D.C. Famous for its horse farms, historic stone manors, and high quality of life, Carroll County remains a top destination for luxury estate buyers and equestrian enthusiasts.',
    lifestyle: 'Equestrian living, estate privacy, boutique dining in historic downtown Westminster and Sykesville, and outdoor recreation along the Liberty Reservoir trails.',
    localAttractions: [
      'Liberty Reservoir & Scenic Trails',
      'Piney Run Park & Lake',
      'Historic Downtown Sykesville (Main Street)',
      'Baugher’s Orchard & Country Market',
      'Gillis Falls Trail System'
    ],
    schoolsRating: '9/10 Top Public & Private Schools',
    featuredListingIds: ['friedman-02', 'friedman-04', 'friedman-05', 'friedman-06'],
    seoKeywords: ['Carroll County luxury real estate', 'Carroll County horse farms for sale', 'Eldersburg luxury homes', 'Westminster MD estates']
  },
  {
    id: 'baltimore-county',
    name: 'Baltimore County',
    county: 'Baltimore County',
    tagline: 'Green Spring Valley, Worthington Valley & Prestigious Country Club Enclaves',
    avgHomeValue: '$1,200,000 to $7,500,000+',
    medianDaysOnMarket: 12,
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    marketOverview: 'Baltimore County’s northern valleys—including Green Spring Valley, Worthington Valley, and Caves Valley—represent old-money Maryland elegance. Known for grand stone manors, steeplechase traditions, private golf clubs, and sprawling gated compounds.',
    lifestyle: 'Golfing at Caves Valley Golf Club, fox hunting, private equestrian events, fine dining in Towson and Lutherville, and elite private school traditions.',
    localAttractions: [
      'Caves Valley Golf Club',
      'Green Spring Valley Hunt Club',
      'Oregon Ridge Park & Nature Center',
      'Garrison Forest School Grounds',
      'Lutherville Historic District'
    ],
    schoolsRating: '10/10 Private Academy Corridor (McDonogh, Garrison Forest, Gilman)',
    featuredListingIds: ['friedman-01'],
    seoKeywords: ['Green Spring Valley real estate', 'Baltimore County luxury homes', 'Lutherville Timonium estates', 'Worthington Valley land']
  },
  {
    id: 'howard-county',
    name: 'Howard County',
    tagline: 'Tech Hub Sophistication, Fulton Architecture & Top-Ranked Schools',
    county: 'Howard County',
    avgHomeValue: '$950,000 to $4,200,000+',
    medianDaysOnMarket: 9,
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753086-35f133c65dae?auto=format&fit=crop&w=1200&q=80'
    ],
    marketOverview: 'Ranked consistently among the richest and highest quality of life counties in the United States. Howard County attracts executives, tech leaders, and discerning families seeking modern custom architecture, top-tier public school clusters, and easy access to Washington D.C. and Baltimore.',
    lifestyle: 'Modern luxury, walkable planned enclaves like Maple Lawn, Merriweather Post Pavilion arts, fine dining, and extensive park systems.',
    localAttractions: [
      'Maple Lawn Village Center',
      'Merriweather Post Pavilion',
      'Centennial Park & Lake',
      'Historic Ellicott City',
      'Turf Valley Resort & Golf'
    ],
    schoolsRating: '10/10 Nationally Ranked Public Schools',
    featuredListingIds: ['friedman-03'],
    seoKeywords: ['Howard County luxury real estate', 'Fulton MD luxury homes', 'Maple Lawn estates', 'River Hill Howard County homes']
  },
  {
    id: 'eldersburg',
    name: 'Eldersburg & South Carroll',
    county: 'Carroll County',
    tagline: 'Lakeside Serenity, Gated Acreage & Quick Route 26 Access',
    avgHomeValue: '$750,000 to $2,200,000',
    medianDaysOnMarket: 11,
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'],
    marketOverview: 'Eldersburg sits in southern Carroll County along the pristine borders of the Liberty Reservoir. Offering expansive lot sizes, modern custom homes, and exceptional access to both Howard and Baltimore counties.',
    lifestyle: 'Boating, kayaking, trail running, equestrian riding, and family-centered luxury living.',
    localAttractions: ['Liberty Reservoir Trailheads', 'Morgan Run Environmental Area', 'Piney Run Park'],
    schoolsRating: '9/10 Century High / Liberty High district',
    featuredListingIds: ['friedman-02'],
    seoKeywords: ['Eldersburg MD homes for sale', 'South Carroll real estate', 'Liberty Reservoir luxury homes']
  },
  {
    id: 'fulton',
    name: 'Fulton & Maple Lawn',
    county: 'Howard County',
    tagline: 'Modern Architectural Luxury & Master-Planned Prestige',
    avgHomeValue: '$1,100,000 to $3,800,000',
    medianDaysOnMarket: 8,
    heroImage: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'],
    marketOverview: 'Fulton represents the pinnacle of modern luxury housing in Howard County, boasting custom architectural estates, smart green construction, and high-speed commuter connections to Fort Meade, NSA, D.C., and Columbia.',
    lifestyle: 'Boutique fitness, artisan dining, walkable town squares, and private club amenities.',
    localAttractions: ['Maple Lawn Club & Pool', 'Sidling Hill Nature Preserve', 'Johns Hopkins APL Corridor'],
    schoolsRating: '10/10 Reservoir & River Hill High School Clusters',
    featuredListingIds: ['friedman-03'],
    seoKeywords: ['Fulton MD real estate', 'Maple Lawn luxury houses', 'Howard County modern custom homes']
  },
  {
    id: 'sykesville',
    name: 'Sykesville',
    county: 'Carroll County',
    tagline: 'Voted Coolest Small Town & Premier Estate Countryside',
    avgHomeValue: '$800,000 to $2,800,000',
    medianDaysOnMarket: 10,
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    marketOverview: 'Sykesville seamlessly blends historic charm with high-end enclave developments. Voted America’s Coolest Small Town, it features vibrant community events, private estate compounds, and gorgeous Patapsco river valley topography.',
    lifestyle: 'Farmers markets, outdoor concerts, dining at E.W. Beck’s, and private estate living.',
    localAttractions: ['Historic Sykesville Main Street', 'Patapsco Valley State Park McKeldin Area', 'Sykesville Farmers Market'],
    schoolsRating: '9/10 Century High School district',
    featuredListingIds: ['friedman-05'],
    seoKeywords: ['Sykesville MD luxury real estate', 'Springfield Manor homes', 'Patapsco River estates']
  },
  {
    id: 'westminster',
    name: 'Westminster',
    county: 'Carroll County',
    tagline: 'Carroll County Seat, Historic Landmarks & Agricultural Haven',
    avgHomeValue: '$650,000 to $2,100,000',
    medianDaysOnMarket: 15,
    heroImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'],
    marketOverview: 'As the county seat of Carroll County, Westminster boasts a rich historic heritage, McDaniel College, and beautiful countryside offering multi-acre farm estates, historic stone manors, and private custom builds.',
    lifestyle: 'Collegiate arts, historic walking tours, farm-to-table dining, and equestrian activities.',
    localAttractions: ['McDaniel College Campus', 'Union Mills Homestead', 'Carroll County Farm Museum'],
    schoolsRating: '8.5/10 Westminster High School district',
    featuredListingIds: ['friedman-06'],
    seoKeywords: ['Westminster MD homes for sale', 'Uniontown historic stone homes', 'Carroll County acreage']
  },
  {
    id: 'mount-airy',
    name: 'Mount Airy',
    county: 'Carroll County',
    tagline: 'Four-County Crossroads, Vineyards & Sprawling Farm Estates',
    avgHomeValue: '$780,000 to $2,500,000',
    medianDaysOnMarket: 13,
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'],
    marketOverview: 'Situated uniquely where Carroll, Frederick, Howard, and Montgomery counties intersect. Mount Airy is famed for its local wineries, rolling farm terrain, expansive equestrian facilities, and custom luxury residences.',
    lifestyle: 'Winery tours at Black Ankle Vineyards, horseback riding, local orchards, and rural tranquility with easy I-70 access.',
    localAttractions: ['Black Ankle Vineyards', 'Linganore Winecellars', 'Mount Airy Main Street'],
    schoolsRating: '9/10 South Carroll / Linganore school cluster',
    featuredListingIds: ['friedman-04'],
    seoKeywords: ['Mount Airy MD farms for sale', 'Mount Airy luxury estates', 'Black Ankle vineyards real estate']
  }
];

export const MARKET_TRENDS: MarketTrendData[] = [
  { month: 'Aug 2025', carrollAvgPrice: 810000, baltimoreAvgPrice: 1150000, howardAvgPrice: 910000, activeListings: 142 },
  { month: 'Oct 2025', carrollAvgPrice: 825000, baltimoreAvgPrice: 1180000, howardAvgPrice: 935000, activeListings: 135 },
  { month: 'Dec 2025', carrollAvgPrice: 840000, baltimoreAvgPrice: 1210000, howardAvgPrice: 948000, activeListings: 118 },
  { month: 'Feb 2026', carrollAvgPrice: 862000, baltimoreAvgPrice: 1245000, howardAvgPrice: 962000, activeListings: 128 },
  { month: 'Apr 2026', carrollAvgPrice: 875000, baltimoreAvgPrice: 1280000, howardAvgPrice: 980000, activeListings: 145 },
  { month: 'Jun 2026', carrollAvgPrice: 895000, baltimoreAvgPrice: 1310000, howardAvgPrice: 1010000, activeListings: 152 }
];

export const MARKET_STATS: MarketStat[] = [
  { county: 'Carroll County', avgPrice: '$895,000', yoyGrowth: '+7.4%', inventoryLevel: '1.8 Months (Tight Seller Market)', avgDaysOnMarket: 14 },
  { county: 'Baltimore County (North)', avgPrice: '$1,310,000', yoyGrowth: '+6.2%', inventoryLevel: '2.1 Months (High Demand)', avgDaysOnMarket: 12 },
  { county: 'Howard County', avgPrice: '$1,010,000', yoyGrowth: '+8.1%', inventoryLevel: '1.4 Months (Extreme Demand)', avgDaysOnMarket: 9 }
];

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    id: 'article-1',
    title: 'The Shift toward Rural Luxury & Equestrian Compounds in Maryland',
    date: 'July 22, 2026',
    category: 'Market Trends',
    readTime: '6 min read',
    summary: 'An analysis of high-net-worth buyers migrating from metropolitan hubs to multi-acre estates in Carroll and northern Baltimore counties.',
    content: [
      'Over the past 24 months, the luxury real estate dynamics in central Maryland have undergone a fundamental evolution. Ultra-high-net-worth buyers are prioritizing privacy, land security, and custom agricultural preservation over traditional suburban density.',
      'In Carroll County, acreage properties featuring custom equestrian amenities, private ponds, and high-speed fiber connectivity are commanding 12% to 18% premiums over standard luxury subdivisions.',
      'Our analysis indicates that off-market placement accounts for nearly 28% of all luxury sales over $2.5 Million in the Green Spring and South Carroll corridors. Positioning a home strategically before public MLS broadcast remains the single most lucrative tactic for estate owners.'
    ],
    author: 'Kyle Friedman',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-2',
    title: 'Pricing Strategy vs. Listing Strategy: How 1% Differences Yield $150K+',
    date: 'July 10, 2026',
    category: 'Seller Strategy',
    readTime: '5 min read',
    summary: 'Why traditional real estate marketing fails luxury properties, and how algorithmic valuation combined with private buyer networks unlocks maximum return.',
    content: [
      'Listing a luxury property is simple. Strategically launching a luxury property to high-intent global capital requires a precise mix of narrative positioning, cinematic photography, architectural storytelling, and discrete negotiation protection.',
      'When an estate is priced 4% above market equilibrium without strategic positioning, it sits on the market for an average of 64 days, eventually suffering price cuts that erode net proceeds by up to 8%.',
      'Conversely, our Strategic Launch Framework leverages pre-market private previews, targeted digital exposure to high-earning relocations, and structured offer windows to generate competitive urgency.'
    ],
    author: 'Kyle Friedman',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-3',
    title: 'Navigating Preservation Easements & Tax Credits for Maryland Farms',
    date: 'June 28, 2026',
    category: 'Estate Management',
    readTime: '7 min read',
    summary: 'A complete breakdown of MALPF, Rural Legacy, and Agricultural Preservation tax incentives for Carroll and Baltimore County land owners.',
    content: [
      'Maryland offers some of the nation’s most robust agricultural preservation incentives. For owners of 10+ acres in Carroll or Baltimore County, understanding the nuances of the Maryland Agricultural Land Preservation Foundation (MALPF) can yield substantial tax relief and capital preservation.',
      'Whether evaluating property tax reductions under agricultural status or negotiating conservation easements, having an advisory team with deep rural land experience is non-negotiable.'
    ],
    author: 'Kyle Friedman',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
  }
];

export const TESTIMONIALS = [
  {
    id: 't-1',
    quote: 'Kyle’s strategic approach turned what could have been a complex $3.8M estate transaction into a flawless experience. He brought three qualified buyers through private placement before our property even hit the public MLS.',
    author: 'Dr. Arthur & Elena Vance',
    property: 'Green Spring Valley Estate',
    location: 'Baltimore County, MD'
  },
  {
    id: 't-2',
    quote: 'Selling a 25-acre horse farm requires someone who understands land value, agricultural zoning, and high-end buyers. Kyle Friedman is hands down the most articulate and strategic real estate advisor in Maryland.',
    author: 'Garrison & Claire Thorne',
    property: 'Whispering Pines Farm',
    location: 'Carroll County, MD'
  },
  {
    id: 't-3',
    quote: 'The level of marketing, cinematic production, and digital reach Kyle deployed for our Fulton home was unmatched. We received two full-price offers within 5 days.',
    author: 'Marcus Chen, Tech Executive',
    property: 'Modern Glass Sanctuary',
    location: 'Howard County, MD'
  }
];

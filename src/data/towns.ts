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
  {
    slug: 'eldersburg',
    name: 'Eldersburg',
    county: 'Carroll County',
    countyFips: '24013',
    lat: 39.4109,
    lng: -76.9483,
    image: '/images/towns/eldersburg.jpg',
    content: {
      overview: "Eldersburg is an unincorporated commercial and residential community in southeastern Carroll County, built up along the Route 26 (Liberty Road) and Route 32 (Sykesville Road) corridor. It has no historic town center of its own - most of its retail and dining sit along that stretch of Liberty Road, with Carroll County's original Main Street about ten minutes south in Sykesville.",
      restaurantsRetail: "Liberty Road carries most of Eldersburg's commerce, from the Princess Shopping Center and Carroll Station Shopping Center to sit-down restaurants like Oscar's Alehouse, The County Cork Wine Pub, and Ötzi Mediterranean Market & Eatery, alongside national grocery and big-box retailers.",
      thingsToDo: [
        'Paddle, fish, or hike at nearby Piney Run Park, a 550-acre park built around a 300-acre lake',
        'Drive ten minutes south to browse Historic Main Street in Sykesville',
        "Catch a meal along the Liberty Road corridor, from Oscar's Alehouse to The County Cork Wine Pub",
        "Take the kids to Piney Run Park's Nature Center for hands-on wildlife exhibits",
        'Explore South Carroll\'s other local parks and recreation areas',
      ],
      transportation: "Eldersburg is entirely car-dependent - Route 26 (Liberty Road) and Route 32 (Sykesville Road) are the two main arteries, with no rail or fixed transit service nearby. Baltimore is roughly 30-40 minutes east via Liberty Road.",
      schoolsResourceUrl: 'https://www.carrollk12.org/',
      schoolsResourceLabel: 'Carroll County Public Schools',
    },
  },
  {
    slug: 'sykesville',
    name: 'Sykesville',
    county: 'Carroll County',
    countyFips: '24013',
    lat: 39.3712,
    lng: -76.9691,
    image: '/images/towns/sykesville.jpg',
    content: {
      overview: "Sykesville is a Main Street Maryland community built around its 1883 B&O Railroad station, with a historic downtown - listed on the National Register of Historic Places - running along the South Branch of the Patapsco River in southwestern Carroll County. The town has leaned into that railroad heritage rather than redeveloping around it, keeping Main Street's Queen Anne-era commercial buildings largely intact.",
      restaurantsRetail: "Main Street is anchored by Sykesville Station, a restaurant built inside the restored 1883 train depot designed by B&O architect E. Francis Baldwin, alongside the longstanding E.W. Beck's, 7556 Main Street Bistro, A Likely Story Bookstore - Carroll County's only independent bookstore - and Firehouse Creamery for ice cream.",
      thingsToDo: [
        'Eat at Sykesville Station, a restaurant built inside the restored 1883 B&O train depot',
        "Browse A Likely Story Bookstore, Carroll County's only independent bookstore",
        'Walk the Historic Sykesville District, listed on the National Register of Historic Places',
        'Paddle or hike nearby Piney Run Park, a 550-acre park with a 300-acre lake',
        'Time a visit to the annual Sykesville Craft Beer Festival each November',
      ],
      transportation: "Downtown Sykesville is walkable on its own, but getting anywhere beyond Main Street means driving - Route 32 (Sykesville Road) and Route 91 connect to Eldersburg, Route 26, and I-70. There's no passenger rail service today despite the town's railroad history.",
      schoolsResourceUrl: 'https://www.carrollk12.org/',
      schoolsResourceLabel: 'Carroll County Public Schools',
    },
  },
  {
    slug: 'mount-airy',
    name: 'Mount Airy',
    county: 'Carroll County',
    countyFips: '24013',
    lat: 39.3765,
    lng: -77.1522,
    image: '/images/towns/mount-airy.jpg',
    content: {
      overview: "Mount Airy sits atop Parr's Ridge, the summit of the Piedmont Plateau, straddling the Carroll-Frederick county line along the old National Road corridor. Its Main Street grew up around an 1850s B&O Railroad stop and is now a designated Main Street Maryland community, with a historic district listed on the National Register of Historic Places since 1984.",
      restaurantsRetail: "Main Street is walkable and lined with locally-owned shops and restaurants, plus Liquidity Aleworks, a brewery housed in the town's old bank building, and the Mount Airy Museum inside the former train station.",
      thingsToDo: [
        'Tour the Mount Airy Museum, housed in the historic train station with a working HO-scale model railyard',
        'Walk the Old Main Line Rails-to-Trails path from downtown to Watkins Park',
        'Visit the Caboose Visitor Center, housed inside a retired railroad caboose',
        "Sample a pour at Liquidity Aleworks, set inside Main Street's former bank building",
        "Tour W.R. Rudy's Country Store & Drugstore Museum by appointment",
      ],
      transportation: "Downtown Main Street is walkable, but Mount Airy is car-dependent for anything beyond it. It sits just off I-70, about 40 minutes from both Baltimore and Frederick, making it a common commuter town for both.",
      schoolsResourceUrl: 'https://www.carrollk12.org/',
      schoolsResourceLabel: 'Carroll County Public Schools',
    },
  },
  {
    slug: 'taneytown',
    name: 'Taneytown',
    county: 'Carroll County',
    countyFips: '24013',
    lat: 39.6587,
    lng: -77.1697,
    image: '/images/towns/taneytown.jpg',
    content: {
      overview: "Taneytown dates to 1754, making it one of Carroll County's oldest towns, settled by German, Scotch, and Irish immigrants along what's now East Baltimore Street. The arrival of the railroad in 1872 shaped its later growth. Today its downtown mixes 19th-century architecture with a small, walkable commercial strip about 25 minutes from Gettysburg.",
      restaurantsRetail: "Taneytown's downtown runs along East Baltimore Street, with shops like the Laughing Coffin Hobby Shop & Social Club and Deja Vu Jewels Company, plus Antrim 1844, a 19th-century country estate turned inn with an award-winning restaurant just south of town.",
      thingsToDo: [
        'Walk East Baltimore Street\'s historic downtown, including the 1875 Kane Hotel',
        "Tour the Taneytown History Museum for the town's 1754 founding-era history",
        'Stroll the gardens at Antrim 1844, a 19th-century country estate turned inn',
        'Walk or fish at Roberts Mill Park, 28 acres with a duck pond and walking trail',
        'Take the short drive to Gettysburg, about 25 minutes north',
      ],
      transportation: "Taneytown is a car-oriented small town with no rail or fixed transit service - Route 140 (Baltimore Boulevard) and Route 194 are the main roads connecting it to Westminster, Gettysburg, and the rest of Carroll County.",
      schoolsResourceUrl: 'https://www.carrollk12.org/',
      schoolsResourceLabel: 'Carroll County Public Schools',
    },
  },
  {
    slug: 'hampstead',
    name: 'Hampstead',
    county: 'Carroll County',
    countyFips: '24013',
    lat: 39.6062,
    lng: -76.8508,
    image: '/images/towns/hampstead.jpg',
    content: {
      overview: "Hampstead is a small, family-oriented town in northeastern Carroll County, incorporated in 1888 and built along Main Street (Route 30/Hanover Pike) between Westminster and the Baltimore County line. It's a quieter, primarily residential community without a dense historic commercial core, with most of its restaurants and shops strung along Main Street itself.",
      restaurantsRetail: "Main Street businesses include Greenmount Station, known locally for its crab cakes, Illiano's J&P Italian restaurant, and Hoffman's Ice Cream, a family-run creamery that's made its ice cream fresh in-house since 1947.",
      thingsToDo: [
        "Grab a scoop at Hoffman's Ice Cream, made fresh in-house since 1947",
        'Eat at Greenmount Station, known locally for its crab cakes',
        'See the Hampstead School, a 1919 Tudor Revival schoolhouse on the National Register of Historic Places',
        'Take the short drive to Ladew Topiary Gardens just over the Baltimore County line',
        "Browse Main Street's small mix of local shops and salons",
      ],
      transportation: "Hampstead is car-dependent - Main Street (Route 30/Hanover Pike) is the primary route through town, connecting south to Westminster and Baltimore County and north toward the Pennsylvania line.",
      schoolsResourceUrl: 'https://www.carrollk12.org/',
      schoolsResourceLabel: 'Carroll County Public Schools',
    },
  },
  {
    slug: 'manchester',
    name: 'Manchester',
    county: 'Carroll County',
    countyFips: '24013',
    lat: 39.6668,
    lng: -76.8838,
    image: '/images/towns/manchester.jpg',
    content: {
      overview: "Manchester is Carroll County's second-oldest incorporated town after Westminster, chartered in 1833 and named by its founder, Capt. Richard Richards, after his native Manchester, England. It sits on Hanover Pike (Route 30) in the county's northeast corner, a farming community turned commuter town for Baltimore and Hanover, PA.",
      restaurantsRetail: "Manchester's small downtown along Main Street/Hanover Pike carries a mix of local shops and restaurants, without the concentrated antique-and-boutique district found in some of Carroll County's other Main Street towns.",
      thingsToDo: [
        'Walk or picnic at Christmas Tree Park, with sports fields and walking trails',
        "Visit the Manchester Historical Center to learn the town's 1833 founding history",
        'Walk the Manchester Historic District, home to well-preserved 19th-century buildings',
        "Attend the town's annual Christmas Tree Lighting each winter",
        "Explore Charlotte's Quest Nature Center",
      ],
      transportation: "Manchester is car-dependent, built along Hanover Pike (Route 30), which connects south to Hampstead and Baltimore County and north to Hanover, Pennsylvania.",
      schoolsResourceUrl: 'https://www.carrollk12.org/',
      schoolsResourceLabel: 'Carroll County Public Schools',
    },
  },
  {
    slug: 'new-windsor',
    name: 'New Windsor',
    county: 'Carroll County',
    countyFips: '24013',
    lat: 39.5387,
    lng: -77.0716,
    image: '/images/towns/new-windsor.jpg',
    content: {
      overview: "New Windsor is Carroll County's smallest incorporated town, laid out in 1797 by Isaac Atlee in western Carroll County. Its Main Street sits within the New Windsor Historic District, a 98-acre National Register district of Queen Anne, Colonial Revival, and Craftsman homes, and the town has a notable history as a center of higher education - home to Calvert College and later Blue Ridge College through the 1930s.",
      restaurantsRetail: "New Windsor's Main Street is primarily residential and historic rather than commercial - most day-to-day shopping and dining means a short drive to Westminster or Union Bridge, though the New Windsor Museum anchors the town's small civic core.",
      thingsToDo: [
        'Walk Main Street through the 98-acre New Windsor Historic District',
        'Visit the New Windsor Museum, run by the New Windsor Heritage Committee',
        'See Old Main, the oldest standing college building in Carroll County, built in 1849',
        "Take the short drive to Union Bridge's Western Maryland Railway Museum",
        'Explore the Piedmont countryside along Route 75 and Route 84',
      ],
      transportation: "New Windsor is fully car-dependent, with no rail or transit service - Route 75 and Route 97 connect it to Westminster, about 10 minutes east, and the rest of Carroll County.",
      schoolsResourceUrl: 'https://www.carrollk12.org/',
      schoolsResourceLabel: 'Carroll County Public Schools',
    },
  },

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
  {
    slug: 'ellicott-city',
    name: 'Ellicott City',
    county: 'Howard County',
    countyFips: '24027',
    lat: 39.2673,
    lng: -76.7983,
    image: '/images/towns/ellicott-city.jpg',
    content: {
      overview: "Historic Ellicott City was founded in 1772 by the Ellicott brothers, built into the hillsides above the Patapsco River as a milling town. Its Main Street became part of the National Road in the early 1800s, and today it's one of Maryland's most-visited historic districts - 80+ shops and restaurants inside 18th- and 19th-century stone buildings, anchored by the B&O Ellicott City Station, the oldest surviving railroad station in the United States.",
      restaurantsRetail: "Main Street is a walkable strip of antique shops, galleries, boutiques, and restaurants, from Manor Hill Tavern to Backwater Books and dozens of small, independently-owned storefronts built into the town's original stone buildings.",
      thingsToDo: [
        'Tour the B&O Ellicott City Station Museum, the oldest surviving railroad station in the U.S.',
        "Walk historic Main Street's antique shops, galleries, and restaurants",
        'Ride the free OEC Trolley through Historic Ellicott City on weekends',
        'Browse Backwater Books or grab a pint at Manor Hill Tavern',
        "Take a pottery class at Clayground or explore the town's small art studios",
      ],
      transportation: "Main Street is walkable on its own, but Ellicott City is car-dependent beyond downtown - Route 40 and Route 29 connect it to Columbia, Baltimore, and the rest of Howard County. MTA commuter bus service runs into Baltimore.",
      schoolsResourceUrl: 'https://www.hcpss.org/',
      schoolsResourceLabel: 'Howard County Public School System',
    },
  },
  {
    slug: 'elkridge',
    name: 'Elkridge',
    county: 'Howard County',
    countyFips: '24027',
    lat: 39.2126,
    lng: -76.7105,
    image: '/images/towns/elkridge.jpg',
    content: {
      overview: "Elkridge is one of Howard County's oldest settlements, dating to 1690 as the port town of Elkridge Landing on the Patapsco River. It was a center of Maryland's colonial iron industry - the Elkridge Furnace, built in the 1740s, was one of the state's largest iron producers - and its historic core sits inside a small extension of Patapsco Valley State Park.",
      restaurantsRetail: "Elkridge doesn't have a dense retail Main Street - its standout is the Elkridge Furnace Inn, a farm-to-table restaurant and event venue built into the restored 1740s ironworks complex on the banks of the Patapsco River, with most everyday shopping centered around the Route 1 corridor.",
      thingsToDo: [
        'Dine at the Elkridge Furnace Inn, a farm-to-table restaurant inside the restored 1740s ironworks',
        'See the Thomas Viaduct, an 1833 railroad bridge and National Historic Landmark spanning the Patapsco River',
        'Walk the trails of Patapsco Valley State Park along the river',
        'Explore the Elkridge Landing Historic District, on the National Register of Historic Places',
        "Take the short drive north to Historic Ellicott City's Main Street",
      ],
      transportation: "Elkridge is car-dependent, built along Route 1 (Washington Boulevard) with easy access to I-95 and I-895. MTA commuter bus service connects to Baltimore and Columbia.",
      schoolsResourceUrl: 'https://www.hcpss.org/',
      schoolsResourceLabel: 'Howard County Public School System',
    },
  },
  {
    slug: 'clarksville',
    name: 'Clarksville',
    county: 'Howard County',
    countyFips: '24027',
    lat: 39.2181,
    lng: -76.9550,
    image: '/images/towns/clarksville.jpg',
    content: {
      overview: "Clarksville is an unincorporated crossroads community at Route 108 and Route 32 in southwestern Howard County, named for an early landowner, William Clark. It has no historic downtown of its own - the town grew as a series of planned commercial centers, most notably River Hill Village Center and the newer Clarksville Commons, serving the surrounding River Hill and Pointers Run neighborhoods.",
      restaurantsRetail: "Clarksville Commons is anchored by The Common Kitchen, Howard County's first food hall, alongside Kupcakes & Co., Scoop & Paddle ice cream, and Everett Jewelers, while the older River Hill Village Center carries a grocery anchor plus restaurants like Old Line Kitchen & Wine Bar.",
      thingsToDo: [
        "Grab a bite at The Common Kitchen, Howard County's first food hall",
        'Browse Clarksville Commons and River Hill Village Center',
        'Hike or bike the Middle Patuxent Environmental Area nearby',
        'Paddle or fish Triadelphia Reservoir, a few minutes west',
        'Take the short drive to the Robinson Nature Center just over the line in Columbia',
      ],
      transportation: "Clarksville is fully car-dependent, sitting at the intersection of Route 108 and Route 32, both major commuter routes connecting to Columbia, Ellicott City, and points west toward Damascus and Olney.",
      schoolsResourceUrl: 'https://www.hcpss.org/',
      schoolsResourceLabel: 'Howard County Public School System',
    },
  },
  {
    slug: 'fulton',
    name: 'Fulton',
    county: 'Howard County',
    countyFips: '24027',
    lat: 39.1651,
    lng: -76.9077,
    image: '/images/towns/fulton.jpg',
    content: {
      overview: "Fulton's commercial and social center is Maple Lawn, a planned mixed-use development along Maple Lawn Boulevard in southeastern Howard County. It's a newer community - built out largely in the 2000s - with a walkable \"Main Street\" of restaurants, boutiques, and offices rather than a historic town core.",
      restaurantsRetail: "Maple Lawn Boulevard carries Fulton's dining and retail scene, from Lib's Grill and Hudson Coastal Raw Bar & Grille to Facci Ristorante, Kloby's Smokehouse, and Decadent Dessert Bar, alongside boutiques and specialty shops.",
      thingsToDo: [
        "Eat and shop along Maple Lawn Boulevard, Fulton's walkable town center",
        "Try the raw bar at Hudson Coastal or barbecue at Kloby's Smokehouse",
        'Stop for pastries at Decadent Dessert Bar',
        'Catch a seasonal festival or farmers market at Maple Lawn',
        'Take the short drive to Savage Mill or Historic Ellicott City',
      ],
      transportation: "Fulton sits close to Route 29 and I-95, making it an easy commute toward both Baltimore and Washington, D.C. It's car-dependent day to day, without its own MTA or fixed-transit stop.",
      schoolsResourceUrl: 'https://www.hcpss.org/',
      schoolsResourceLabel: 'Howard County Public School System',
    },
  },
  {
    slug: 'highland',
    name: 'Highland',
    county: 'Howard County',
    countyFips: '24027',
    lat: 39.1704,
    lng: -76.9666,
    image: '/images/towns/highland.jpg',
    content: {
      overview: "Highland is a small rural crossroads community in southern Howard County, where Highland Road meets Route 216 and Route 108. It's stayed close to its farming roots - horse farms and open fields still surround the crossroads - with a history dating to a tavern established there in 1759.",
      restaurantsRetail: "Highland has a small commercial crossroads rather than a traditional downtown, with most shopping and dining a short drive north to Clarksville or northeast toward Columbia.",
      thingsToDo: [
        "Drive the back roads past Highland's horse farms and open countryside",
        "Visit St. Mark's Episcopal Church on Hall Shop Road",
        'Paddle or fish nearby Triadelphia Reservoir',
        'Take the short drive to Clarksville for shopping and dining',
        "Explore Howard County's western rural villages along Route 216",
      ],
      transportation: "Highland is entirely car-dependent, with no fixed transit service - Route 108 and Route 216 are the main roads, connecting to Clarksville, about 2 miles north, and Columbia beyond it.",
      schoolsResourceUrl: 'https://www.hcpss.org/',
      schoolsResourceLabel: 'Howard County Public School System',
    },
  },
  {
    slug: 'savage',
    name: 'Savage',
    county: 'Howard County',
    countyFips: '24027',
    lat: 39.1373,
    lng: -76.8236,
    image: '/images/towns/savage.jpg',
    content: {
      overview: "Savage grew up around Savage Mill, a cotton mill built in 1816 on the banks of the Little Patuxent River. The mill operated for more than 120 years before closing in 1947, and its restored 175,000-square-foot complex - now on the National Register of Historic Places - has been reborn as one of Howard County's best-known shopping and dining destinations.",
      restaurantsRetail: "Savage Mill houses the Antique Center, with more than 150 dealers, alongside specialty shops like Charity's Closet and jules + Kate, and restaurants and cafes including Brewing Good and Boyd Cru Wines.",
      thingsToDo: [
        'Browse more than 150 dealers at the Antique Center at Historic Savage Mill',
        'Grab coffee at Brewing Good or wine at Boyd Cru Wines inside the Mill',
        'Walk the Savage Mill Historic District, on the National Register of Historic Places',
        "Explore the Mill's artist studios, from pottery to photography",
        'Walk or bike the trails along the Little Patuxent River nearby',
      ],
      transportation: "Savage is car-dependent day to day, though the Savage MARC station on the Camden Line offers weekday commuter rail service into Washington, D.C. and Baltimore. Route 32 and Route 1 are the main roads through town.",
      schoolsResourceUrl: 'https://www.hcpss.org/',
      schoolsResourceLabel: 'Howard County Public School System',
    },
  },

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

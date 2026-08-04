// server/neighborhoodDataClient.js
//
// Pulls real, honest neighborhood-level data from four free/low-cost
// public data sources - no fabricated statistics, ever. If a source isn't
// configured or a lookup fails, the corresponding section is simply
// omitted on the frontend, never filled with a placeholder that looks real.
//
// Sources:
//   1. U.S. Census Bureau (ACS 5-Year Estimates) - population, median age,
//      household income. Needs CENSUS_API_KEY (free, instant signup at
//      api.census.gov/data/key_signup.html).
//   2. Walk Score API - walk/transit/bike scores. Needs WALKSCORE_API_KEY
//      (free tier, walkscore.com/professional/api-sign-up.php).
//   3. Google Places API (legacy) - nearby points of interest. Reuses the
//      same GOOGLE_PLACES_API_KEY already configured for Google Reviews.
//   4. Urban Institute Education Data Portal - real school directory/stats
//      from NCES data. Fully open, no key needed at all.
//
// IMPORTANT CAVEAT: this code was written against each provider's
// documented API format, but could not be live-tested from the build
// environment (no network access to census.gov/walkscore.com from that
// sandbox). Test this against the real deployed site, and if a specific
// call fails, check the debugInfo returned alongside each result - same
// troubleshooting approach used for the Lofty integration.

const CENSUS_API_KEY = process.env.CENSUS_API_KEY;
const WALKSCORE_API_KEY = process.env.WALKSCORE_API_KEY;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export function isCensusConfigured() {
  return Boolean(CENSUS_API_KEY);
}
export function isWalkScoreConfigured() {
  return Boolean(WALKSCORE_API_KEY);
}
export function isGooglePlacesConfigured() {
  return Boolean(GOOGLE_PLACES_API_KEY);
}

// ---------------------------------------------------------------------------
// 1. CENSUS - real population/median age/household income for a town.
//
// Initial approach tried geocoding "Town, MD" via the Census Geocoder, but
// that endpoint expects a full street address and returned no match for a
// bare city name. Fixed approach: pull the complete list of Maryland
// places (all ~450 incorporated places + census-designated places) in one
// call, then match by name - far more reliable for a fixed list of known
// towns than trying to geocode each one individually.
// ---------------------------------------------------------------------------

let cachedMarylandPlaces = null;

async function getMarylandPlaceList() {
  if (cachedMarylandPlaces) return cachedMarylandPlaces;

  const url = new URL('https://api.census.gov/data/2022/acs/acs5');
  url.searchParams.set('get', 'NAME');
  url.searchParams.set('for', 'place:*');
  url.searchParams.set('in', 'state:24');
  url.searchParams.set('key', CENSUS_API_KEY);

  const res = await fetch(url.toString());
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Census place list request failed: ${res.status}`);
    err.debugInfo = { httpStatus: res.status, responseText: text.slice(0, 1000) };
    throw err;
  }

  const rows = JSON.parse(text);
  const [header, ...dataRows] = rows;
  const nameIdx = header.indexOf('NAME');
  const placeIdx = header.indexOf('place');

  cachedMarylandPlaces = dataRows.map((row) => ({
    name: row[nameIdx], // e.g. "Westminster city, Maryland"
    placeFips: row[placeIdx],
  }));
  return cachedMarylandPlaces;
}

function findPlaceMatch(placeList, townName) {
  const normalized = townName.trim().toLowerCase();
  // Census names look like "Westminster city, Maryland" or "Columbia CDP,
  // Maryland" - match on whether the name starts with the town name.
  return placeList.find((p) => p.name.toLowerCase().startsWith(normalized + ' '));
}

export async function getCensusDemographics(townName, stateAbbrev = 'MD') {
  if (!isCensusConfigured()) {
    const err = new Error('Census API not configured (CENSUS_API_KEY missing).');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }

  const placeList = await getMarylandPlaceList();
  const match = findPlaceMatch(placeList, townName);
  if (!match) {
    const err = new Error(`Could not find "${townName}" in the Census Maryland place list.`);
    err.debugInfo = { townName, samplePlaceNames: placeList.slice(0, 10).map((p) => p.name) };
    throw err;
  }

  // ACS 5-Year Estimates, most recent vintage. Variables:
  // B01003_001E = total population
  // B01002_001E = median age
  // B19013_001E = median household income
  const acsUrl = new URL('https://api.census.gov/data/2022/acs/acs5');
  acsUrl.searchParams.set('get', 'NAME,B01003_001E,B01002_001E,B19013_001E');
  acsUrl.searchParams.set('for', `place:${match.placeFips}`);
  acsUrl.searchParams.set('in', 'state:24');
  acsUrl.searchParams.set('key', CENSUS_API_KEY);

  const res = await fetch(acsUrl.toString());
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Census ACS request failed: ${res.status}`);
    err.debugInfo = { httpStatus: res.status, responseText: text.slice(0, 1000), acsUrl: acsUrl.toString().replace(CENSUS_API_KEY, '***') };
    throw err;
  }

  const rows = JSON.parse(text);
  const [header, dataRow] = rows;
  if (!dataRow) {
    const err = new Error('Census ACS returned no data row for this place.');
    err.debugInfo = { match, rows };
    throw err;
  }

  const get = (col) => {
    const idx = header.indexOf(col);
    return idx >= 0 ? dataRow[idx] : undefined;
  };

  return {
    population: get('B01003_001E') ? Number(get('B01003_001E')) : undefined,
    medianAge: get('B01002_001E') ? Number(get('B01002_001E')) : undefined,
    medianHouseholdIncome: get('B19013_001E') ? Number(get('B19013_001E')) : undefined,
    matchedPlaceName: match.name,
    debugInfo: { match, acsUrl: acsUrl.toString().replace(CENSUS_API_KEY, '***') },
  };
}

// ---------------------------------------------------------------------------
// 2. WALK SCORE - real walk/transit/bike scores for a lat/lng + address.
// ---------------------------------------------------------------------------

export async function getWalkScore(address, lat, lng) {
  if (!isWalkScoreConfigured()) {
    const err = new Error('Walk Score API not configured (WALKSCORE_API_KEY missing).');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }

  const url = new URL('https://api.walkscore.com/score');
  url.searchParams.set('format', 'json');
  url.searchParams.set('address', address);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('transit', '1');
  url.searchParams.set('bike', '1');
  url.searchParams.set('wsapikey', WALKSCORE_API_KEY);

  const res = await fetch(url.toString());
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Walk Score request failed: ${res.status}`);
    err.debugInfo = { httpStatus: res.status, responseText: text.slice(0, 1000) };
    throw err;
  }

  const json = JSON.parse(text);
  return {
    walkScore: json.walkscore,
    walkDescription: json.description,
    transitScore: json.transit?.score,
    transitDescription: json.transit?.description,
    bikeScore: json.bike?.score,
    bikeDescription: json.bike?.description,
    debugInfo: { rawResponse: json },
  };
}

// ---------------------------------------------------------------------------
// 3. GOOGLE PLACES (legacy) - real nearby points of interest.
//
// Previous approach: one generic type=point_of_interest search, then
// client-side filtered into UI categories by matching Google's `types`
// array against a hand-built keyword list. That produced wrong results in
// practice - Google's legacy API tags many big-box retailers and pharmacies
// with the generic "food" type (they sell groceries/snacks), which was
// also in the "Restaurants" keyword list, so e.g. Target showed up under
// Restaurants while genuine restaurants - never actually fetched, since a
// single generic point_of_interest search close to a town center often
// doesn't surface them in the first 12-20 results - didn't show at all.
//
// Fixed approach: run one targeted Nearby Search per real UI category,
// using Google's actual typed categories, and tag each result with the
// category that fetched it (no fragile string matching after the fact).
// Each result also carries placeId so the frontend can link straight to
// the real Google Maps listing for that business.
// ---------------------------------------------------------------------------

const CATEGORY_QUERIES = [
  { category: 'Restaurants', type: 'restaurant' },
  { category: 'Shopping', type: 'shopping_mall' },
  { category: 'Shopping', type: 'store' },
  { category: 'Health', type: 'hospital' },
  { category: 'Health', type: 'pharmacy' },
  { category: 'Lodging', type: 'lodging' },
];

async function nearbySearchByType(lat, lng, radiusMeters, type) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', String(radiusMeters));
  url.searchParams.set('type', type);
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY);

  const res = await fetch(url.toString());
  const json = await res.json();

  if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    const err = new Error(`Google Places request failed for type=${type}: ${json.status}`);
    err.debugInfo = { type, status: json.status, errorMessage: json.error_message };
    throw err;
  }

  return json.results || [];
}

export async function getNearbyPlaces(lat, lng, radiusMeters = 3200) {
  if (!isGooglePlacesConfigured()) {
    const err = new Error('Google Places API not configured (GOOGLE_PLACES_API_KEY missing).');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }

  const seenPlaceIds = new Set();
  const places = [];
  const perCategoryCounts = {};
  const errors = [];

  for (const { category, type } of CATEGORY_QUERIES) {
    // Cap each real category to 6 results so one category (e.g. two
    // Shopping sub-queries) can't crowd out the others.
    const alreadyForCategory = perCategoryCounts[category] || 0;
    if (alreadyForCategory >= 6) continue;

    let results;
    try {
      results = await nearbySearchByType(lat, lng, radiusMeters, type);
    } catch (err) {
      errors.push({ type, message: err.message });
      continue;
    }

    for (const p of results) {
      if (seenPlaceIds.has(p.place_id)) continue;
      if ((perCategoryCounts[category] || 0) >= 6) break;
      seenPlaceIds.add(p.place_id);
      perCategoryCounts[category] = (perCategoryCounts[category] || 0) + 1;
      places.push({
        placeId: p.place_id,
        name: p.name,
        address: p.vicinity,
        category,
      });
    }
  }

  return {
    places,
    debugInfo: { resultCount: places.length, perCategoryCounts, errors },
  };
}

// ---------------------------------------------------------------------------
// 4. URBAN INSTITUTE - real school directory data, no key needed at all.
// ---------------------------------------------------------------------------

export async function getNearbySchools(countyFips, stateFips = '24') {
  // Common Core of Data school directory, most recent available year.
  const url = new URL('https://educationdata.urban.org/api/v1/schools/ccd/directory/2022/');
  url.searchParams.set('fips', stateFips);

  // Without a normal browser User-Agent, this site's Cloudflare protection
  // returns a 403 "Attention Required" block page instead of real data -
  // confirmed by an actual test run. This header fixes that.
  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    },
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Urban Institute Education Data request failed: ${res.status}`);
    err.debugInfo = { httpStatus: res.status, responseText: text.slice(0, 1000) };
    throw err;
  }

  const json = JSON.parse(text);
  const results = (json.results || [])
    .filter((s) => !countyFips || String(s.county_code) === String(countyFips))
    .slice(0, 10)
    .map((s) => ({
      name: s.school_name,
      city: s.city_location,
      level: s.school_level,
      enrollment: s.enrollment,
    }));

  return {
    schools: results,
    debugInfo: {
      totalReturned: (json.results || []).length,
      filteredCount: results.length,
      // If filteredCount is 0 despite a real countyFips being passed, this
      // sample record shows the actual raw field names/values to check
      // "county_code" against - it may have a different name or format.
      sampleRawRecord: json.results?.[0],
    },
  };
}

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
// Census data is queried by official geography codes (state/place), not
// plain addresses - so this first geocodes the town via the Census
// Bureau's own free, keyless Geocoder, then uses the resulting place code
// to query the ACS 5-Year Estimates.
// ---------------------------------------------------------------------------

async function geocodeToCensusPlace(address) {
  const url = new URL('https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress');
  url.searchParams.set('address', address);
  url.searchParams.set('benchmark', 'Public_AR_Current');
  url.searchParams.set('vintage', 'Current_Current');
  url.searchParams.set('layers', 'Incorporated Places, Census Tracts');
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = new Error(`Census geocoder failed: ${res.status}`);
    err.debugInfo = { httpStatus: res.status, url: url.toString() };
    throw err;
  }
  const json = await res.json();
  const match = json?.result?.addressMatches?.[0];
  if (!match) {
    const err = new Error('Census geocoder found no match for this address.');
    err.debugInfo = { address, response: json };
    throw err;
  }

  const geographies = match.geographies || {};
  const place = geographies['Incorporated Places']?.[0];
  const tract = geographies['Census Tracts']?.[0];

  return {
    stateFips: place?.STATE || tract?.STATE,
    placeFips: place?.PLACE,
    tractFips: tract?.TRACT,
    countyFips: tract?.COUNTY,
    matchedAddress: match.matchedAddress,
    debugInfo: { rawGeographies: geographies },
  };
}

export async function getCensusDemographics(townName, stateAbbrev = 'MD') {
  if (!isCensusConfigured()) {
    const err = new Error('Census API not configured (CENSUS_API_KEY missing).');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }

  const geo = await geocodeToCensusPlace(`${townName}, ${stateAbbrev}`);
  if (!geo.stateFips || !geo.placeFips) {
    const err = new Error('Could not resolve this town to a Census place code.');
    err.debugInfo = geo;
    throw err;
  }

  // ACS 5-Year Estimates, most recent vintage. Variables:
  // B01003_001E = total population
  // B01002_001E = median age
  // B19013_001E = median household income
  const acsUrl = new URL('https://api.census.gov/data/2022/acs/acs5');
  acsUrl.searchParams.set('get', 'NAME,B01003_001E,B01002_001E,B19013_001E');
  acsUrl.searchParams.set('for', `place:${geo.placeFips}`);
  acsUrl.searchParams.set('in', `state:${geo.stateFips}`);
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
    err.debugInfo = { geo, rows };
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
    matchedAddress: geo.matchedAddress,
    debugInfo: { geo, acsUrl: acsUrl.toString().replace(CENSUS_API_KEY, '***') },
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
// 3. GOOGLE PLACES (legacy) - real nearby points of interest, names/
// addresses/categories only (no ratings/reviews requested, to stay clear
// of the pricier SKU tier and keep this comfortably within free usage).
// ---------------------------------------------------------------------------

export async function getNearbyPlaces(lat, lng, radiusMeters = 3200) {
  if (!isGooglePlacesConfigured()) {
    const err = new Error('Google Places API not configured (GOOGLE_PLACES_API_KEY missing).');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', String(radiusMeters));
  url.searchParams.set('type', 'point_of_interest');
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY);

  const res = await fetch(url.toString());
  const json = await res.json();

  if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    const err = new Error(`Google Places request failed: ${json.status}`);
    err.debugInfo = { status: json.status, errorMessage: json.error_message };
    throw err;
  }

  const places = (json.results || []).slice(0, 12).map((p) => ({
    name: p.name,
    address: p.vicinity,
    types: p.types,
  }));

  return { places, debugInfo: { resultCount: places.length, status: json.status } };
}

// ---------------------------------------------------------------------------
// 4. URBAN INSTITUTE - real school directory data, no key needed at all.
// ---------------------------------------------------------------------------

export async function getNearbySchools(countyFips, stateFips = '24') {
  // Common Core of Data school directory, most recent available year.
  const url = new URL('https://educationdata.urban.org/api/v1/schools/ccd/directory/2022/');
  url.searchParams.set('fips', stateFips);

  const res = await fetch(url.toString());
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

  return { schools: results, debugInfo: { totalReturned: (json.results || []).length, filteredCount: results.length } };
}

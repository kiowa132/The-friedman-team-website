// server/mlsClient.js
//
// Talks to Lofty's real listings API (the same Bright MLS feed Kyle already
// pays for through his Lofty subscription) - not a separate vendor.
// Docs: https://developer.lofty.com (API Reference > Listings)
//
// You need one thing to make this live: a Lofty API key.
//   Lofty account -> Settings -> Integrations -> API -> Create API Key
// Put it in .env as LOFTY_API_KEY. Never commit it or paste it anywhere else -
// treat it like a password.
//
// IMPORTANT - a few response field names below (photos, description, status)
// were NOT shown in Lofty's public docs excerpt we had while building this -
// only request/filter shapes and a "key fields" table were documented. Set
// DEBUG_MLS=true in .env to log one raw listing to the server console the
// first time a search runs, then compare against the mapping below and
// adjust field names here if anything doesn't match what Lofty actually
// returns.

const LOFTY_API_BASE = 'https://api.lofty.com';
const LOFTY_API_KEY = process.env.LOFTY_API_KEY;
const DEBUG_MLS = process.env.DEBUG_MLS === 'true';

export function isMlsConfigured() {
  return Boolean(LOFTY_API_KEY);
}

// Lofty's price/beds/baths filters are "min,max" strings, not separate fields.
function buildFilterConditions({ maxPrice, minBeds, propertyType, q }) {
  const filterConditions = {};

  // When searching by keyword (address, MLS#, etc.), skip the price/bed/type
  // filters entirely - searching for a specific property shouldn't be
  // constrained by whatever the price slider happens to be set to.
  if (q && q.trim()) {
    return filterConditions;
  }

  if (maxPrice) {
    filterConditions.price = `,${Number(maxPrice)}`;
  }
  if (minBeds) {
    filterConditions.beds = `${Number(minBeds)},`;
  }
  if (propertyType && propertyType !== 'All') {
    filterConditions.propertyType = [propertyType];
  }

  return filterConditions;
}

// Lofty wraps results under "listing" (singular) alongside a "metadata" key -
// confirmed from a real response. Keeping the other fallbacks too in case
// this varies by account/dataset.
function extractRawListings(json) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.listing)) return json.listing;
  if (Array.isArray(json.listings)) return json.listings;
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.result)) return json.result;
  if (Array.isArray(json.records)) return json.records;
  if (json.data && Array.isArray(json.data.listings)) return json.data.listings;
  return [];
}

// Best-effort city -> county lookup for Kyle's core Maryland service area.
// Lofty's response has no explicit "county" field, only city/state/zip, so
// this is the practical way to support the county filter dropdown. Cities
// not in this list will just show under "All Counties" rather than being
// mis-filed - add more as needed.
const CITY_TO_COUNTY = {
  westminster: 'Carroll County',
  eldersburg: 'Carroll County',
  finksburg: 'Carroll County',
  hampstead: 'Carroll County',
  manchester: 'Carroll County',
  'mount airy': 'Carroll County',
  sykesville: 'Carroll County',
  'new windsor': 'Carroll County',
  'union bridge': 'Carroll County',
  taneytown: 'Carroll County',
  towson: 'Baltimore County',
  timonium: 'Baltimore County',
  cockeysville: 'Baltimore County',
  lutherville: 'Baltimore County',
  'owings mills': 'Baltimore County',
  reisterstown: 'Baltimore County',
  parkville: 'Baltimore County',
  essex: 'Baltimore County',
  dundalk: 'Baltimore County',
  'perry hall': 'Baltimore County',
  'white marsh': 'Baltimore County',
  'middle river': 'Baltimore County',
  baltimore: 'Baltimore County',
  columbia: 'Howard County',
  'ellicott city': 'Howard County',
  elkridge: 'Howard County',
  clarksville: 'Howard County',
  fulton: 'Howard County',
  highland: 'Howard County',
};

function guessCounty(city) {
  if (!city) return '';
  return CITY_TO_COUNTY[city.trim().toLowerCase()] || '';
}

// Maps a raw Lofty listing record onto the shape the frontend's Listing type
// expects (see src/types.ts). Field names below are confirmed from an actual
// live Lofty response (not just docs) as of this build.
function mapListing(raw) {
  const price = typeof raw.price === 'string' ? parseFloat(raw.price) : (raw.price || 0);
  const sqft = typeof raw.sqft === 'number' && raw.sqft > 0 ? raw.sqft : 0;
  const beds = typeof raw.bedrooms === 'number' && raw.bedrooms >= 0 ? raw.bedrooms : 0;
  const baths = typeof raw.bathrooms === 'number' && raw.bathrooms >= 0 ? raw.bathrooms : 0;
  // lotSize/totalAvailableAcres come back in square feet, not acres.
  const lotSizeSqft = typeof raw.lotSize === 'number' && raw.lotSize > 0 ? raw.lotSize : 0;
  const acres = lotSizeSqft ? Math.round((lotSizeSqft / 43560) * 100) / 100 : 0;

  const statusText = (raw.listingStatus || '').toLowerCase();
  let status = 'Active';
  if (raw.soldListingYN === true || statusText === 'sold' || statusText === 'closed') {
    status = 'Sold';
  } else if (statusText.includes('contract') || statusText.includes('pending')) {
    status = 'Pending';
  }

  return {
    id: String(raw.id ?? raw.mlsListingId),
    title: raw.address || raw.fullAddress || `${raw.streetAddress || ''} ${raw.city || ''}`.trim() || 'Property',
    price,
    formattedPrice: price ? `$${price.toLocaleString()}` : 'Call for Price',
    address: raw.streetAddress || raw.address || '',
    city: raw.city || '',
    county: guessCounty(raw.city),
    zip: raw.zipCode || '',
    beds,
    baths,
    sqft,
    acres,
    propertyType: raw.propertyTypePrimary || raw.primaryType || raw.propertyType || 'Residential',
    status,
    heroImage: raw.previewPicture || '',
    gallery: raw.previewPicture ? [raw.previewPicture] : [],
    description: raw.remarks || raw.description || raw.publicRemarks || '',
    highlights: [],
    yearBuilt: raw.builtYear || 0,
    mlsNumber: raw.mlsListingId || '',
    virtualTourUrl: raw.virtualTourUrl || undefined,
    featured: false,
  };
}

/**
 * Search live MLS listings via Lofty's V2 search endpoint.
 * @param {{ county?: string, propertyType?: string, maxPrice?: number, minBeds?: number, q?: string, skip?: number, top?: number }} params
 */
export async function searchListings(params = {}) {
  if (!isMlsConfigured()) {
    const err = new Error('MLS feed is not configured (LOFTY_API_KEY missing).');
    err.code = 'MLS_NOT_CONFIGURED';
    throw err;
  }

  // When searching by keyword, pull a much bigger batch since we're
  // searching by substring match across whatever comes back - a small
  // recent-activity page is unlikely to contain the specific property
  // someone's typing in an address for.
  const pageSize = params.q && params.q.trim()
    ? 100
    : Math.min(params.top || 24, 50);

  const body = {
    searchScope: 'all',
    soldFlag: false,
    filterConditions: buildFilterConditions(params),
    // Sorting by most-recently-listed rather than price - this feed spans
    // multiple states, and sorting by price first risked burying Maryland
    // listings behind more expensive out-of-state ones before our
    // Maryland-only filter (below) even got a chance to see them.
    sortFields: ['MLS_LIST_DATE_L_DESC'],
    pageSize,
    pageNum: 1,
  };

  const res = await fetch(`${LOFTY_API_BASE}/v2.0/listings/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${LOFTY_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Lofty API request failed: ${res.status} ${text}`);
    err.code = 'MLS_REQUEST_FAILED';
    err.debugInfo = { httpStatus: res.status, requestBody: body, responseText: text.slice(0, 2000) };
    throw err;
  }

  const json = await res.json();
  const rawListings = extractRawListings(json);

  // This Bright MLS feed spans multiple states (confirmed: PA and VA listings
  // showed up in testing) - filter to Maryland only, since that's what this
  // site is for. Do this on the raw records (which have `state`) before
  // mapping, since the mapped Listing type doesn't carry state through.
  const marylandRaw = rawListings.filter((l) => (l.state || '').toUpperCase() === 'MD');

  let listings = marylandRaw.map(mapListing);

  // County isn't a documented filter field for the search endpoint, so we
  // filter client-side on the county value Lofty returns per listing.
  if (params.county && params.county !== 'All') {
    const wanted = params.county.toLowerCase();
    listings = listings.filter((l) => l.county.toLowerCase() === wanted);
  }

  // Same deal for free-text search - not a documented filter, so we match
  // against address/city/MLS number after the fact.
  if (params.q && params.q.trim()) {
    const q = params.q.trim().toLowerCase();
    listings = listings.filter(
      (l) =>
        l.address.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.mlsNumber.toLowerCase().includes(q)
    );
  }

  const result = {
    listings,
    total: listings.length,
  };

  // TEMPORARILY always attaching debug info (not gated behind DEBUG_MLS)
  // while we diagnose why listings aren't coming back correctly. Once
  // fixed, this can go back to being gated behind DEBUG_MLS again.
  result.debugInfo = {
    httpStatus: res.status,
    requestBodySent: body,
    responseTopLevelKeys: Object.keys(json),
    rawListingsFoundByExtractor: rawListings.length,
    marylandListingsAfterStateFilter: marylandRaw.length,
    responseSample: JSON.stringify(json).slice(0, 3000),
  };

  return result;
}

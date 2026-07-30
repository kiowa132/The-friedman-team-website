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
function buildFilterConditions({ maxPrice, minBeds, propertyType }) {
  const filterConditions = {};

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

// Lofty's response wrapper shape wasn't shown in the docs excerpt we had -
// this defensively checks the common possibilities so a wrapper mismatch
// doesn't silently produce zero results.
function extractRawListings(json) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.listings)) return json.listings;
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.result)) return json.result;
  if (Array.isArray(json.records)) return json.records;
  if (json.data && Array.isArray(json.data.listings)) return json.data.listings;
  return [];
}

// Maps a raw Lofty listing record onto the shape the frontend's Listing type
// expects (see src/types.ts).
function mapListing(raw) {
  const zip = Array.isArray(raw.listingZipcode) ? raw.listingZipcode[0] : raw.listingZipcode;
  const price = typeof raw.price === 'string' ? parseFloat(raw.price) : (raw.price || 0);

  // Best-effort photo lookup - field name wasn't in the docs excerpt.
  // Check a few likely shapes; falls back to empty if none match.
  const photoCandidates = raw.photos || raw.images || raw.media || [];
  const photos = Array.isArray(photoCandidates)
    ? photoCandidates.map((p) => (typeof p === 'string' ? p : p?.url)).filter(Boolean)
    : [];
  const singlePhoto = raw.mainPhotoUrl || raw.photoUrl || raw.imageUrl;
  const gallery = photos.length ? photos : (singlePhoto ? [singlePhoto] : []);

  return {
    id: String(raw.listingId),
    title: [raw.listingStreetName, raw.listingCity].filter(Boolean).join(', ') || 'Property',
    price,
    formattedPrice: price ? `$${price.toLocaleString()}` : 'Call for Price',
    address: raw.listingStreetName || '',
    city: raw.listingCity || '',
    county: raw.county || '',
    zip: zip || '',
    beds: raw.beds ?? 0,
    baths: raw.baths ?? 0,
    sqft: raw.sqft ?? 0,
    acres: raw.lotSizeAcres ?? 0, // not in documented field table - verify if populated
    propertyType: raw.propertyType || raw.property_type || 'Residential',
    status: raw.soldFlag || raw.status === 'Sold' ? 'Sold' : 'Active',
    heroImage: gallery[0] || '',
    gallery,
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

  const pageSize = Math.min(params.top || 24, 50);

  const body = {
    searchScope: 'all',
    soldFlag: false,
    filterConditions: buildFilterConditions(params),
    sortFields: ['PRICE_DESC'],
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

  let listings = rawListings.map(mapListing);

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
    total: json.total ?? json.totalCount ?? listings.length,
  };

  // TEMPORARILY always attaching debug info (not gated behind DEBUG_MLS)
  // while we diagnose why listings aren't coming back correctly. Once
  // fixed, this can go back to being gated behind DEBUG_MLS again.
  result.debugInfo = {
    httpStatus: res.status,
    requestBodySent: body,
    responseTopLevelKeys: Object.keys(json),
    rawListingsFoundByExtractor: rawListings.length,
    responseSample: JSON.stringify(json).slice(0, 3000),
  };

  return result;
}

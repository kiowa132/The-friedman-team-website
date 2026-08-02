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
function buildFilterConditions({ maxPrice, minPrice, minBeds, propertyType, q }) {
  const filterConditions = {};

  // When searching by keyword (address, MLS#, etc.), skip the price/bed/type
  // filters entirely - searching for a specific property shouldn't be
  // constrained by whatever the price slider happens to be set to.
  if (q && q.trim()) {
    return filterConditions;
  }

  // Lofty's range syntax: value before the comma = minimum, value after =
  // maximum, either side can be left blank for "no bound." minBeds already
  // used the "value," (min-only) form below - minPrice follows the same
  // pattern. If both are set, combine into one "min,max" range string.
  if (minPrice && maxPrice) {
    filterConditions.price = `${Number(minPrice)},${Number(maxPrice)}`;
  } else if (minPrice) {
    filterConditions.price = `${Number(minPrice)},`;
  } else if (maxPrice) {
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
  frederick: 'Frederick County',
  brunswick: 'Frederick County',
  emmitsburg: 'Frederick County',
  middletown: 'Frederick County',
  myersville: 'Frederick County',
  'new market': 'Frederick County',
  thurmont: 'Frederick County',
  walkersville: 'Frederick County',
  urbana: 'Frederick County',
  'point of rocks': 'Frederick County',
  ijamsville: 'Frederick County',
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

  // CONFIRMED against a real raw response on 2026-08-02 (see rawSampleListing
  // in debugInfo when DEBUG_MLS=true): Lofty's /v2.0/listings/search endpoint
  // is a lightweight summary view. It does NOT include a photo array
  // (only one "previewPicture"), no description/remarks field, and none of
  // tax amount, garage spaces, subdivision, HOA fee, architectural style,
  // water source, sewer, or zoning. Those all either come from a separate
  // "get single listing" endpoint (if Lofty's API has one - worth checking
  // their docs or asking their support directly) or aren't available via
  // this API at all. Do not guess at these again without a confirmed
  // sample - showing "-" or omitting the field entirely is correct;
  // fabricating a value is not.
  const gallery = raw.previewPicture ? [raw.previewPicture] : [];
  const heroImage = raw.previewPicture || '';

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
    heroImage,
    gallery,
    description: raw.remarks || raw.description || raw.publicRemarks || '',
    highlights: [],
    yearBuilt: raw.builtYear || 0,
    mlsNumber: raw.mlsListingId || '',
    virtualTourUrl: raw.virtualTourUrl || undefined,
    featured: false,
    // Confirmed real fields:
    daysOnMarket: typeof raw.daysOnList === 'number' ? raw.daysOnList : undefined,
    listAgentName: raw.agentName || undefined,
    listOfficeName: raw.agentOrganizationName || undefined,
    // Confirmed NOT present in this endpoint's response - left undefined
    // on purpose rather than guessed:
    taxAnnualAmount: undefined,
    garageSpaces: undefined,
    subdivisionName: undefined,
    associationFee: undefined,
    architecturalStyle: undefined,
    waterSource: undefined,
    sewer: undefined,
    zoning: undefined,
  };
}

/**
 * Search live MLS listings via Lofty's V2 search endpoint.
 * @param {{ county?: string, propertyType?: string, maxPrice?: number, minPrice?: number, minBeds?: number, q?: string, skip?: number, top?: number }} params
 */
async function fetchLoftyPage({ filterConditions, pageSize, pageNum }) {
  const body = {
    searchScope: 'all',
    soldFlag: false,
    filterConditions,
    sortFields: ['MLS_LIST_DATE_L_DESC'],
    pageSize,
    pageNum,
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
  return { json, rawListings: extractRawListings(json), requestBody: body, httpStatus: res.status };
}

/**
 * Fetches full listing detail (multiple photos, description, and whatever
 * else Lofty's richer detail view includes) for a single listing, using
 * the /listings/details endpoint - confirmed to exist via Lofty support,
 * but its exact response shape was NOT confirmed before this was written.
 * Enable DEBUG_MLS to see the raw response the first time this runs and
 * adjust the extraction below if it doesn't match.
 */
export async function getListingDetails(listingId) {
  if (!isMlsConfigured()) {
    const err = new Error('MLS feed is not configured (LOFTY_API_KEY missing).');
    err.code = 'MLS_NOT_CONFIGURED';
    throw err;
  }

  const body = { listingId };

  const res = await fetch(`${LOFTY_API_BASE}/v2.0/listings/details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${LOFTY_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Lofty details API request failed: ${res.status} ${text}`);
    err.code = 'MLS_REQUEST_FAILED';
    err.debugInfo = { httpStatus: res.status, requestBody: body, responseText: text.slice(0, 2000) };
    throw err;
  }

  const json = await res.json();

  if (DEBUG_MLS) {
    console.log('[DEBUG_MLS] Raw /listings/details response:', JSON.stringify(json, null, 2));
  }

  // Response shape not confirmed ahead of time - try the most likely
  // possibilities defensively rather than assuming one.
  const raw = json.listing || json.data || json.result || json;

  // Photos - try several likely shapes, same defensive approach as the
  // search endpoint mapping, since this is genuinely unconfirmed.
  let gallery = [];
  const photoCandidates = raw.photos || raw.media || raw.pictures || raw.images || raw.photoUrls;
  if (Array.isArray(photoCandidates) && photoCandidates.length > 0) {
    gallery = photoCandidates
      .map((p) => (typeof p === 'string' ? p : p?.url || p?.uri || p?.href || ''))
      .filter(Boolean);
  } else if (raw.previewPicture) {
    gallery = [raw.previewPicture];
  }

  const description = raw.remarks || raw.description || raw.publicRemarks || raw.remarksPublic || '';

  return {
    gallery,
    description,
    raw, // full raw object included so any other useful fields (tax, garage, etc.) can be checked and mapped once confirmed
    debugInfo: { httpStatus: res.status, requestBody: body, responseTopLevelKeys: Object.keys(json) },
  };
}

function matchesKeyword(listing, q) {
  const query = q.trim().toLowerCase();
  return (
    listing.address.toLowerCase().includes(query) ||
    listing.city.toLowerCase().includes(query) ||
    listing.mlsNumber.toLowerCase().includes(query)
  );
}

export async function searchListings(params = {}) {
  if (!isMlsConfigured()) {
    const err = new Error('MLS feed is not configured (LOFTY_API_KEY missing).');
    err.code = 'MLS_NOT_CONFIGURED';
    throw err;
  }

  const isKeywordSearch = Boolean(params.q && params.q.trim());
  const filterConditions = buildFilterConditions(params);

  // Best-effort attempt at filtering to Maryland server-side (only
  // documented location filter example was `{ city: [...] }`, but trying
  // `state` under the same "location" key in case it's supported too).
  // Applied for BOTH browsing and keyword search - restricting to Maryland
  // shrinks the haystack either way, which helps keyword search actually
  // find things instead of scanning irrelevant multi-state noise.
  filterConditions.location = { state: ['MD'] };

  let allDebugPages = [];
  let lastJson = {};
  let lastHttpStatus = 0;
  let lastRequestBody = {};
  let usedExperimentalAddressFilter = false;

  if (isKeywordSearch) {
    // Keyword search: scan multiple pages looking for matches, since the
    // target property could be anywhere in a large multi-state feed, not
    // just the most recent page. Capped to avoid excessive requests/timeouts.
    const PAGE_SIZE = 100;
    const MAX_PAGES = 8; // scans up to 800 raw listings
    const MATCH_TARGET = 30; // stop early once we have enough matches

    // EXPERIMENTAL: try asking Lofty to filter by address server-side too -
    // undocumented, a guess based on the pattern of the documented `city`
    // filter. If Lofty rejects this (400 error), we automatically retry
    // without it rather than breaking keyword search entirely.
    const experimentalFilterConditions = {
      ...filterConditions,
      location: { ...filterConditions.location, address: [params.q.trim()] },
    };

    let activeFilterConditions = experimentalFilterConditions;
    usedExperimentalAddressFilter = true;

    try {
      await fetchLoftyPage({ filterConditions: activeFilterConditions, pageSize: 1, pageNum: 1 });
    } catch (probeErr) {
      // Lofty didn't like the experimental filter - fall back to plain state filter.
      activeFilterConditions = filterConditions;
      usedExperimentalAddressFilter = false;
    }

    let matchedRaw = [];
    let pagesScanned = 0;
    let ranOutOfData = false;

    for (let pageNum = 1; pageNum <= MAX_PAGES; pageNum++) {
      const { json, rawListings, requestBody, httpStatus } = await fetchLoftyPage({
        filterConditions: activeFilterConditions,
        pageSize: PAGE_SIZE,
        pageNum,
      });
      lastJson = json;
      lastHttpStatus = httpStatus;
      lastRequestBody = requestBody;
      pagesScanned++;
      allDebugPages.push({ pageNum, rawCount: rawListings.length });

      const marylandRaw = rawListings.filter((l) => (l.state || '').toUpperCase() === 'MD');
      const matches = marylandRaw.filter((l) => matchesKeyword(mapListing(l), params.q));
      matchedRaw.push(...matches);

      if (rawListings.length < PAGE_SIZE) {
        ranOutOfData = true;
        break; // no more pages available from Lofty
      }
      if (matchedRaw.length >= MATCH_TARGET) {
        break; // found enough, stop scanning further pages
      }
    }

    const listings = matchedRaw.map(mapListing);

    return {
      listings,
      total: listings.length,
      hasMore: false, // keyword search returns everything found within the scan cap
      nextSkip: 0,
      debugInfo: {
        mode: 'keyword-multi-page-scan',
        keyword: params.q,
        usedExperimentalAddressFilter,
        pagesScanned,
        ranOutOfData,
        matchesFound: listings.length,
        lastHttpStatus,
        lastRequestBody,
        pageDebug: allDebugPages,
        lastResponseTopLevelKeys: Object.keys(lastJson),
        lastResponseMetadata: lastJson.metadata,
      },
    };
  }

  // Normal browsing (no keyword): single page per call, "Load More" pages forward.
  const pageSize = Math.min(params.top || 50, 100);
  const pageNum = Math.floor((params.skip || 0) / pageSize) + 1;

  const { json, rawListings, requestBody, httpStatus } = await fetchLoftyPage({
    filterConditions,
    pageSize,
    pageNum,
  });

  const marylandRaw = rawListings.filter((l) => (l.state || '').toUpperCase() === 'MD');
  let listings = marylandRaw.map(mapListing);

  // Logs one real raw listing object so the actual field names Lofty
  // returns can be confirmed and compared against the guesses in
  // mapListing() above (tax, garage, subdivision, HOA, photos, etc. were
  // never confirmed against real output - only typical RESO naming
  // conventions). Set DEBUG_MLS=true in .env, run one search, then check
  // the server console (or this response's debugInfo.rawSampleListing if
  // this endpoint is hit directly) and adjust field names in mapListing()
  // to match reality.
  if (DEBUG_MLS && marylandRaw.length > 0) {
    console.log('[DEBUG_MLS] Raw listing sample - full field list:', JSON.stringify(marylandRaw[0], null, 2));
  }

  if (params.county && params.county !== 'All') {
    const wanted = params.county.toLowerCase();
    listings = listings.filter((l) => l.county.toLowerCase() === wanted);
  }

  return {
    listings,
    // Confirmed accurate via testing: Lofty's location.state filter genuinely
    // restricts results to Maryland server-side (verified every listing in
    // a real response had state:"MD"), so this total is a real count of
    // active Maryland listings matching the price filter - not a multi-state
    // artifact. Restored after incorrectly distrusting it earlier.
    total: json.metadata?.totalCount ?? json.metadata?.total ?? listings.length,
    hasMore: rawListings.length >= pageSize,
    nextSkip: (params.skip || 0) + pageSize,
    debugInfo: {
      mode: 'browse-single-page',
      httpStatus,
      requestBodySent: requestBody,
      responseTopLevelKeys: Object.keys(json),
      responseMetadata: json.metadata,
      rawListingsFoundByExtractor: rawListings.length,
      marylandListingsAfterStateFilter: marylandRaw.length,
      rawSampleListing: DEBUG_MLS && marylandRaw.length > 0 ? marylandRaw[0] : undefined,
      responseSample: JSON.stringify(json).slice(0, 3000),
    },
  };
}

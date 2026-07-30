// server/reviewsClient.js
//
// Pulls real Google reviews for Kyle's Google Business Profile via the
// Google Places API. Real reviews only - if this isn't configured, the
// frontend shows nothing (no fake/sample reviews, ever).
//
// You only need ONE thing to make this live: a Google Places API key.
//   - Go to console.cloud.google.com, create/select a project
//   - Enable the "Places API"
//   - Credentials > Create Credentials > API Key
//   - Google requires billing on the project, but this usage level
//     (a few requests per site visit, well under free-tier limits) is
//     realistically $0/month for a small-business site.
//
// The Place ID is resolved AUTOMATICALLY from the business name below via
// Google's "Find Place From Text" API - no manual Place ID lookup needed.
// If Kyle's business name/address on Google ever changes, update
// BUSINESS_NAME_QUERY below to match.
//
// NOTE: Google's Place Details API only returns up to 5 reviews (their
// "most relevant" selection, not literally all reviews) - that's a Google
// API limitation, not something this code can change.

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Confirmed exact business name from Kyle's real Google Maps listing.
const BUSINESS_NAME_QUERY = process.env.GOOGLE_PLACE_NAME_QUERY
  || 'The Friedman Team by Kyle Friedman';

// Coordinates confirmed from Kyle's actual Google Maps share link - used as
// a location bias to help Google's text search disambiguate, since the
// business name alone returned ZERO_RESULTS on its own.
const BUSINESS_LAT = 39.2162004;
const BUSINESS_LNG = -76.9824265;

export function isReviewsConfigured() {
  return Boolean(GOOGLE_PLACES_API_KEY);
}

let cachedPlaceId = null;

// Safety check: after resolving a candidate, verify its name actually looks
// like Kyle's business before trusting it. This exists because a real test
// run returned a completely different, unrelated company ("Team Friedman
// IPRG") that happened to share the word "Friedman" - showing that on the
// site would mean displaying a stranger's reviews under Kyle's name, which
// is worse than showing nothing. Never skip this check.
//
// IMPORTANT: an earlier version of this also accepted the exact string
// "The Friedman Team" (no "Kyle") - that turned out to be a DIFFERENT,
// apparently duplicate/stale Google listing with only 1 old review. Kyle's
// real, active listing (confirmed directly on Google Maps: same phone
// number 443-789-3101, 7 reviews) is named "The Friedman Team by Kyle
// Friedman" - so the check below intentionally requires "kyle" AND
// "friedman" both present, and does NOT accept the shorter name anymore.
function looksLikeKylesBusiness(name) {
  if (!name) return false;
  const n = name.toLowerCase().trim();
  return n.includes('kyle') && n.includes('friedman');
}

async function resolvePlaceId() {
  if (cachedPlaceId) return cachedPlaceId;

  const url = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
  url.searchParams.set('input', BUSINESS_NAME_QUERY);
  url.searchParams.set('inputtype', 'textquery');
  url.searchParams.set('fields', 'place_id,name');
  url.searchParams.set('locationbias', `point:${BUSINESS_LAT},${BUSINESS_LNG}`);
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY);

  const res = await fetch(url.toString());
  const json = await res.json();

  if (json.status === 'OK' && json.candidates?.length && looksLikeKylesBusiness(json.candidates[0].name)) {
    cachedPlaceId = json.candidates[0].place_id;
    return cachedPlaceId;
  }

  // Fallback: Find Place From Text is strict about exact matches - Text
  // Search is more forgiving (same style as typing into Google Maps search)
  // and more likely to find the listing even if the name string isn't a
  // perfect match. Radius widened back to 20km - the strict "kyle"+"friedman"
  // name check above is what actually protects against wrong matches now,
  // not a tight radius, since Kyle's real listing wasn't found within a
  // 200m radius in testing (likely registered at a slightly different
  // point than the coordinates we have on file).
  const fallbackUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  fallbackUrl.searchParams.set('query', BUSINESS_NAME_QUERY);
  fallbackUrl.searchParams.set('location', `${BUSINESS_LAT},${BUSINESS_LNG}`);
  fallbackUrl.searchParams.set('radius', '20000');
  fallbackUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY);

  const fallbackRes = await fetch(fallbackUrl.toString());
  const fallbackJson = await fallbackRes.json();

  const validFallback = (fallbackJson.results || []).find((r) => looksLikeKylesBusiness(r.name));

  if (fallbackJson.status === 'OK' && validFallback) {
    cachedPlaceId = validFallback.place_id;
    return cachedPlaceId;
  }

  // Second fallback: Nearby Search ranks by proximity to an exact point
  // rather than text relevance - useful here because Text Search wasn't
  // surfacing Kyle's listing at all despite it existing at these exact
  // confirmed coordinates (verified directly on Google Maps). A tight
  // 50m radius means almost anything returned should genuinely be at
  // that pin, not just something text-similar.
  const nearbyUrl = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  nearbyUrl.searchParams.set('location', `${BUSINESS_LAT},${BUSINESS_LNG}`);
  nearbyUrl.searchParams.set('radius', '50');
  nearbyUrl.searchParams.set('keyword', 'Friedman');
  nearbyUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY);

  const nearbyRes = await fetch(nearbyUrl.toString());
  const nearbyJson = await nearbyRes.json();

  const validNearby = (nearbyJson.results || []).find((r) => looksLikeKylesBusiness(r.name));

  if (nearbyJson.status === 'OK' && validNearby) {
    cachedPlaceId = validNearby.place_id;
    return cachedPlaceId;
  }

  const err = new Error(`Could not confidently resolve Kyle's Place ID for "${BUSINESS_NAME_QUERY}" - either no match or the match didn't look like his business.`);
  err.code = 'REVIEWS_PLACE_LOOKUP_FAILED';
  err.debugInfo = {
    findPlaceStatus: json.status,
    findPlaceTopCandidateName: json.candidates?.[0]?.name,
    findPlaceErrorMessage: json.error_message,
    textSearchStatus: fallbackJson.status,
    textSearchCandidateNames: (fallbackJson.results || []).map((r) => r.name),
    textSearchErrorMessage: fallbackJson.error_message,
    nearbySearchStatus: nearbyJson.status,
    nearbySearchCandidateNames: (nearbyJson.results || []).map((r) => r.name),
    nearbySearchErrorMessage: nearbyJson.error_message,
    businessNameQuery: BUSINESS_NAME_QUERY,
  };
  throw err;
}

export async function fetchGoogleReviews() {
  if (!isReviewsConfigured()) {
    const err = new Error('Google reviews not configured (GOOGLE_PLACES_API_KEY missing).');
    err.code = 'REVIEWS_NOT_CONFIGURED';
    throw err;
  }

  const placeId = await resolvePlaceId();

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews,url');
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY);

  const res = await fetch(url.toString());
  const json = await res.json();

  if (json.status !== 'OK') {
    const err = new Error(`Google Places API error: ${json.status} ${json.error_message || ''}`);
    err.code = 'REVIEWS_REQUEST_FAILED';
    err.debugInfo = { status: json.status, errorMessage: json.error_message, resolvedPlaceId: placeId };
    throw err;
  }

  const result = json.result || {};

  // Final safety net (defense in depth, in addition to the check in
  // resolvePlaceId): refuse to return reviews for anything that doesn't
  // look like Kyle's actual business. Never remove this check.
  if (!looksLikeKylesBusiness(result.name)) {
    const err = new Error(`Resolved place "${result.name}" does not look like Kyle's business - refusing to display its reviews.`);
    err.code = 'REVIEWS_WRONG_BUSINESS';
    err.debugInfo = { resolvedPlaceId: placeId, resolvedBusinessName: result.name };
    throw err;
  }

  const reviews = (result.reviews || []).map((r) => ({
    authorName: r.author_name,
    authorPhotoUrl: r.profile_photo_url,
    rating: r.rating,
    text: r.text,
    relativeTime: r.relative_time_description,
    time: r.time,
  }));

  return {
    businessName: result.name || '',
    overallRating: result.rating || 0,
    totalReviewCount: result.user_ratings_total || 0,
    googleMapsUrl: result.url || '',
    reviews,
  };
}

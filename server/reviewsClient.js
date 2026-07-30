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
  || 'The Friedman Team by Kyle Friedman, Maryland';

export function isReviewsConfigured() {
  return Boolean(GOOGLE_PLACES_API_KEY);
}

let cachedPlaceId = null;

async function resolvePlaceId() {
  if (cachedPlaceId) return cachedPlaceId;

  const url = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
  url.searchParams.set('input', BUSINESS_NAME_QUERY);
  url.searchParams.set('inputtype', 'textquery');
  url.searchParams.set('fields', 'place_id,name');
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY);

  const res = await fetch(url.toString());
  const json = await res.json();

  if (json.status !== 'OK' || !json.candidates?.length) {
    const err = new Error(`Could not resolve Place ID for "${BUSINESS_NAME_QUERY}": ${json.status}`);
    err.code = 'REVIEWS_PLACE_LOOKUP_FAILED';
    err.debugInfo = { status: json.status, errorMessage: json.error_message, businessNameQuery: BUSINESS_NAME_QUERY };
    throw err;
  }

  cachedPlaceId = json.candidates[0].place_id;
  return cachedPlaceId;
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

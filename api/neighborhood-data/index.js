// api/neighborhood-data/index.js
// GET /api/neighborhood-data?town=Westminster&lat=39.575&lng=-76.996&countyFips=24013
// Combines all 4 real data sources for one town - production version used
// by the actual neighborhood detail pages.

import {
  getCensusDemographics,
  getWalkScore,
  getNearbyPlaces,
  getNearbySchools,
  isCensusConfigured,
  isWalkScoreConfigured,
  isGooglePlacesConfigured,
} from '../../server/neighborhoodDataClient.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { town, lat, lng, countyFips } = req.query;
  if (!town || !lat || !lng) {
    return res.status(400).json({ ok: false, error: 'MISSING_PARAMS', message: 'town, lat, and lng query params are required.' });
  }

  const results = {};

  if (isCensusConfigured()) {
    try {
      results.census = { status: 'ok', data: await getCensusDemographics(town, 'MD') };
    } catch (err) {
      results.census = { status: 'error', message: err.message };
    }
  } else {
    results.census = { status: 'not_configured' };
  }

  if (isWalkScoreConfigured()) {
    try {
      results.walkScore = { status: 'ok', data: await getWalkScore(`${town}, MD`, Number(lat), Number(lng)) };
    } catch (err) {
      results.walkScore = { status: 'error', message: err.message };
    }
  } else {
    results.walkScore = { status: 'not_configured' };
  }

  if (isGooglePlacesConfigured()) {
    try {
      results.nearbyPlaces = { status: 'ok', data: await getNearbyPlaces(Number(lat), Number(lng)) };
    } catch (err) {
      results.nearbyPlaces = { status: 'error', message: err.message };
    }
  } else {
    results.nearbyPlaces = { status: 'not_configured' };
  }

  try {
    results.schools = { status: 'ok', data: await getNearbySchools(countyFips || null, '24') };
  } catch (err) {
    results.schools = { status: 'error', message: err.message };
  }

  // Cache at the edge for 24 hours - this data doesn't change minute to
  // minute, and it keeps repeat visits to the same town from re-hitting
  // all 4 external APIs every single time.
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  return res.status(200).json({ ok: true, town, results });
}

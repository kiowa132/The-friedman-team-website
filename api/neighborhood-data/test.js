// api/neighborhood-data/test.js
// Vercel serverless function - GET /api/neighborhood-data/test?town=Westminster&lat=39.575&lng=-76.996&county=Carroll
// Combines all 4 real data sources for ONE town, for verification before
// scaling this out to all 30 neighborhood pages.

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

  const { town, lat, lng, county } = req.query;
  if (!town || !lat || !lng) {
    return res.status(400).json({ ok: false, error: 'MISSING_PARAMS', message: 'town, lat, and lng query params are required.' });
  }

  const results = {};

  if (isCensusConfigured()) {
    try {
      results.census = { status: 'ok', data: await getCensusDemographics(town, 'MD') };
    } catch (err) {
      results.census = { status: 'error', message: err.message, debugInfo: err.debugInfo };
    }
  } else {
    results.census = { status: 'not_configured' };
  }

  if (isWalkScoreConfigured()) {
    try {
      results.walkScore = { status: 'ok', data: await getWalkScore(`${town}, MD`, Number(lat), Number(lng)) };
    } catch (err) {
      results.walkScore = { status: 'error', message: err.message, debugInfo: err.debugInfo };
    }
  } else {
    results.walkScore = { status: 'not_configured' };
  }

  if (isGooglePlacesConfigured()) {
    try {
      results.nearbyPlaces = { status: 'ok', data: await getNearbyPlaces(Number(lat), Number(lng)) };
    } catch (err) {
      results.nearbyPlaces = { status: 'error', message: err.message, debugInfo: err.debugInfo };
    }
  } else {
    results.nearbyPlaces = { status: 'not_configured' };
  }

  try {
    results.schools = { status: 'ok', data: await getNearbySchools(null, '24') };
  } catch (err) {
    results.schools = { status: 'error', message: err.message, debugInfo: err.debugInfo };
  }

  return res.status(200).json({ ok: true, town, results });
}

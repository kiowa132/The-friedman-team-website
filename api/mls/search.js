// api/mls/search.js
// Vercel serverless function - handles GET /api/mls/search
// Reuses the same Lofty integration logic in server/mlsClient.js.

import { searchListings, isMlsConfigured } from '../../server/mlsClient.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!isMlsConfigured()) {
    return res.status(501).json({
      ok: false,
      error: 'MLS_NOT_CONFIGURED',
      message: 'No live MLS feed is connected yet. Set LOFTY_API_KEY in your Vercel project environment variables (get it from Lofty: Settings > Integrations > API).',
    });
  }

  try {
    const { county, propertyType, maxPrice, minPrice, minBeds, q, skip, top } = req.query;
    const { listings, total, hasMore, nextSkip, debugInfo } = await searchListings({
      county,
      propertyType,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      minBeds: minBeds ? Number(minBeds) : undefined,
      q,
      skip: skip ? Number(skip) : undefined,
      top: top ? Number(top) : undefined,
    });
    return res.status(200).json({ ok: true, listings, total, hasMore, nextSkip, debugInfo });
  } catch (err) {
    console.error('MLS search failed:', err);
    return res.status(502).json({
      ok: false,
      error: 'MLS_REQUEST_FAILED',
      message: 'Could not reach the MLS feed.',
      debugInfo: err.debugInfo,
    });
  }
}

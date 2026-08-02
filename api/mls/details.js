// api/mls/details.js
// Vercel serverless function - handles GET /api/mls/details?listingId=X
// Reuses the same Lofty integration logic in server/mlsClient.js.

import { getListingDetails, isMlsConfigured } from '../../server/mlsClient.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!isMlsConfigured()) {
    return res.status(501).json({
      ok: false,
      error: 'MLS_NOT_CONFIGURED',
      message: 'No live MLS feed is connected yet. Set LOFTY_API_KEY in your Vercel project environment variables.',
    });
  }

  const { listingId } = req.query;
  if (!listingId) {
    return res.status(400).json({ ok: false, error: 'MISSING_LISTING_ID', message: 'listingId query param is required.' });
  }

  try {
    const result = await getListingDetails(listingId);
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error('MLS listing details failed:', err);
    return res.status(502).json({
      ok: false,
      error: 'MLS_REQUEST_FAILED',
      message: 'Could not reach the MLS feed for listing details.',
      debugInfo: err.debugInfo,
    });
  }
}

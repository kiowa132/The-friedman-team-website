// api/reviews.js
// Vercel serverless function - handles GET /api/reviews
// Pulls real Google reviews for Kyle's business. See server/reviewsClient.js.

import { fetchGoogleReviews, isReviewsConfigured } from '../server/reviewsClient.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!isReviewsConfigured()) {
    return res.status(501).json({
      ok: false,
      error: 'REVIEWS_NOT_CONFIGURED',
      message: 'Google reviews are not connected yet. Set GOOGLE_PLACES_API_KEY in your Vercel environment variables.',
    });
  }

  try {
    const data = await fetchGoogleReviews();
    return res.status(200).json({ ok: true, ...data });
  } catch (err) {
    console.error('Fetching Google reviews failed:', err);
    return res.status(502).json({
      ok: false,
      error: 'REVIEWS_REQUEST_FAILED',
      message: 'Could not reach Google right now.',
      debugInfo: err.debugInfo,
    });
  }
}

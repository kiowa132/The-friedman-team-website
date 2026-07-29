// server.js
// Express backend for The Friedman Team website.
//
// What this does:
//   1. Serves the built React site (the `dist/` folder produced by `npm run build`)
//   2. POST /api/leads    - forwards form submissions to Follow Up Boss
//   3. GET  /api/mls/search - queries Kyle's real Lofty MLS feed so the
//      Listings page shows actual live inventory, not mock data. See
//      server/mlsClient.js for the Lofty API integration itself.
//
// Why a backend at all, instead of calling these APIs directly from the
// browser? Both your FUB API key and your MLS access token have to stay
// secret. If they're in frontend JavaScript, anyone who views page source
// can copy them. This server holds both in environment variables and the
// browser never sees them.

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { searchListings, isMlsConfigured } from './server/mlsClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const FUB_API_KEY = process.env.FUB_API_KEY;
const FUB_SOURCE = process.env.FUB_SOURCE || 'TheFriedmanTeam.com';

app.use(express.json());

// ---------------------------------------------------------------------------
// POST /api/leads
// Body shape (all forms on the site send this same shape):
// {
//   name, email, phone,
//   type: "Seller Inquiry" | "General Inquiry" | "Property Inquiry" | "Registration",
//   message: string,          // free text - property details, timeline, etc.
// }
// ---------------------------------------------------------------------------
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, type, message } = req.body || {};

    if (!name || (!email && !phone)) {
      return res.status(400).json({ ok: false, error: 'Name and at least one of email/phone are required.' });
    }

    if (!FUB_API_KEY) {
      console.error('FUB_API_KEY is not set. Add it to your .env file (see .env.example).');
      return res.status(500).json({ ok: false, error: 'Lead routing is not configured on the server yet.' });
    }

    const [firstName, ...rest] = String(name).trim().split(/\s+/);
    const lastName = rest.join(' ') || '-';

    const fubPayload = {
      source: FUB_SOURCE,
      system: 'CustomWebsite',
      type: type || 'General Inquiry',
      message: message || '',
      person: {
        firstName,
        lastName,
        emails: email ? [{ value: email }] : [],
        phones: phone ? [{ value: phone }] : [],
      },
    };

    const fubResponse = await fetch('https://api.followupboss.com/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // FUB uses HTTP Basic Auth with the API key as the username, blank password.
        Authorization: 'Basic ' + Buffer.from(`${FUB_API_KEY}:`).toString('base64'),
      },
      body: JSON.stringify(fubPayload),
    });

    if (!fubResponse.ok) {
      const errText = await fubResponse.text();
      console.error('Follow Up Boss rejected the lead:', fubResponse.status, errText);
      return res.status(502).json({ ok: false, error: 'Follow Up Boss rejected the submission.' });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Error forwarding lead to Follow Up Boss:', err);
    return res.status(500).json({ ok: false, error: 'Unexpected server error.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/mls/search
// Query params: county, propertyType, maxPrice, minBeds, q, skip, top
// Returns: { ok: true, listings: [...], total } once LOFTY_API_KEY is set in
// .env. Until then, returns a 501 with a clear "not configured" message so
// the frontend can show a friendly state instead of pretending to have live
// data.
// ---------------------------------------------------------------------------
app.get('/api/mls/search', async (req, res) => {
  if (!isMlsConfigured()) {
    return res.status(501).json({
      ok: false,
      error: 'MLS_NOT_CONFIGURED',
      message: 'No live MLS feed is connected yet. Set LOFTY_API_KEY in .env (get it from Lofty: Settings > Integrations > API).',
    });
  }

  try {
    const { county, propertyType, maxPrice, minBeds, q, skip, top } = req.query;
    const { listings, total } = await searchListings({
      county,
      propertyType,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minBeds: minBeds ? Number(minBeds) : undefined,
      q,
      skip: skip ? Number(skip) : undefined,
      top: top ? Number(top) : undefined,
    });
    return res.json({ ok: true, listings, total });
  } catch (err) {
    console.error('MLS search failed:', err);
    return res.status(502).json({ ok: false, error: 'MLS_REQUEST_FAILED', message: 'Could not reach the MLS feed.' });
  }
});

// ---------------------------------------------------------------------------
// Serve the built frontend in production (after `npm run build`).
// In dev, run `npm run dev` (Vite) in one terminal and `npm run server` in
// another - Vite is configured to proxy /api requests to this server.
// ---------------------------------------------------------------------------
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  if (!FUB_API_KEY) {
    console.warn('WARNING: FUB_API_KEY is not set - leads will fail to send until you add it to .env');
  }
  if (!isMlsConfigured()) {
    console.warn('WARNING: LOFTY_API_KEY not set - Listings page will show the "not connected" state until you add it to .env');
  }
});

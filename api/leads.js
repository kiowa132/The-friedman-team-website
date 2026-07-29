// api/leads.js
// Vercel serverless function - handles POST /api/leads
// Forwards form submissions to Follow Up Boss via their /v1/events API.
// See server/mlsClient.js's sibling comment style for the "why a backend"
// explanation - short version: your FUB API key must never reach the browser.

const FUB_SOURCE = process.env.FUB_SOURCE || 'TheFriedmanTeam.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, type, message } = req.body || {};

    if (!name || (!email && !phone)) {
      return res.status(400).json({ ok: false, error: 'Name and at least one of email/phone are required.' });
    }

    const FUB_API_KEY = process.env.FUB_API_KEY;
    if (!FUB_API_KEY) {
      console.error('FUB_API_KEY is not set in Vercel project environment variables.');
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
        Authorization: 'Basic ' + Buffer.from(`${FUB_API_KEY}:`).toString('base64'),
      },
      body: JSON.stringify(fubPayload),
    });

    if (!fubResponse.ok) {
      const errText = await fubResponse.text();
      console.error('Follow Up Boss rejected the lead:', fubResponse.status, errText);
      return res.status(502).json({ ok: false, error: 'Follow Up Boss rejected the submission.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error forwarding lead to Follow Up Boss:', err);
    return res.status(500).json({ ok: false, error: 'Unexpected server error.' });
  }
}

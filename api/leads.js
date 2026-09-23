// api/leads.js
// Vercel serverless function - handles POST /api/leads
// Forwards form submissions to Follow Up Boss via their /v1/events API, and
// (2026-09-22, dual-send while phasing out FUB) also to the new CRM's
// intake-lead edge function. The CRM call is fire-and-forget: if it fails,
// the lead still reaches FUB and the visitor's submission still succeeds,
// FUB stays the source of truth until the CRM side is confirmed reliable.
// See server/mlsClient.js's sibling comment style for the "why a backend"
// explanation - short version: your FUB API key must never reach the browser.

const FUB_SOURCE = process.env.FUB_SOURCE || 'TheFriedmanTeam.com';
const CRM_INTAKE_URL = process.env.CRM_INTAKE_URL; // e.g. https://<project>.supabase.co/functions/v1/intake-lead
const CRM_INTAKE_SECRET = process.env.CRM_INTAKE_SECRET; // must match LEAD_INTAKE_SECRET in the CRM's Supabase secrets

// Awaited (not truly fire-and-forget) so the request actually completes
// before this serverless function returns - a Vercel Node function can stop
// running pending work as soon as the response is sent, unresolved promises
// aren't guaranteed to finish. Its own try/catch means a CRM problem still
// never affects the visitor's submission or the FUB call above.
async function forwardToCrm(payload) {
  if (!CRM_INTAKE_URL || !CRM_INTAKE_SECRET) return;
  try {
    const res = await fetch(CRM_INTAKE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-intake-secret': CRM_INTAKE_SECRET },
      body: JSON.stringify(payload),
    });
    if (!res.ok) console.error('CRM lead intake rejected the lead:', res.status, await res.text());
  } catch (err) {
    console.error('Could not reach the CRM lead intake endpoint:', err);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, type, message, address, tags } = req.body || {};

    const hasUsableAddress =
      address && String(address.street || '').trim() && String(address.zip || '').trim();

    if (!name || (!email && !phone && !hasUsableAddress)) {
      return res
        .status(400)
        .json({ ok: false, error: 'Name and at least one of email, phone, or a mailing address are required.' });
    }

    const FUB_API_KEY = process.env.FUB_API_KEY;
    if (!FUB_API_KEY) {
      console.error('FUB_API_KEY is not set in Vercel project environment variables.');
      return res.status(500).json({ ok: false, error: 'Lead routing is not configured on the server yet.' });
    }

    const [firstName, ...rest] = String(name).trim().split(/\s+/);
    const lastName = rest.join(' ') || '-';

    const person = {
      firstName,
      lastName,
      emails: email ? [{ value: email }] : [],
      phones: phone ? [{ value: phone }] : [],
    };

    // Structured mailing address (mailing-list signup) so Kyle can pull an
    // actual mail-merge list out of Follow Up Boss by tag.
    if (address && (address.street || address.city || address.zip)) {
      person.addresses = [
        {
          type: 'home',
          street: address.street || '',
          city: address.city || '',
          state: address.state || 'MD',
          code: address.zip || '',
        },
      ];
    }

    if (Array.isArray(tags) && tags.length) {
      person.tags = tags.map((t) => String(t)).slice(0, 20);
    }

    // "Mailing List" isn't a Follow Up Boss event type - send it as a
    // Registration and let the person's tags do the segmenting. Every other
    // value passes through unchanged (existing forms already work).
    const eventType = type === 'Mailing List' ? 'Registration' : type || 'General Inquiry';

    const fubPayload = {
      source: FUB_SOURCE,
      system: 'CustomWebsite',
      type: eventType,
      message: message || '',
      person,
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

    // Original `type` (not FUB's remapped eventType), the CRM's intake_lead
    // RPC has its own mapping for "Mailing List" etc.
    await forwardToCrm({ name, email, phone, type: type || 'General Inquiry', message, address, tags, source: FUB_SOURCE });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error forwarding lead to Follow Up Boss:', err);
    return res.status(500).json({ ok: false, error: 'Unexpected server error.' });
  }
}

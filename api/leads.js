// api/leads.js
// Vercel serverless function - handles POST /api/leads
// Sends every form submission to BOTH destinations independently:
//   - the new CRM's intake-lead edge function (the future source of truth), and
//   - Follow Up Boss via its /v1/events API (until the cutover, 2026-10-31).
// Neither destination can block the other. A lead is accepted when AT LEAST ONE of them took it,
// so cancelling FUB (or a FUB outage, or a rejected key) can never lose a lead or show the visitor
// an error while the CRM is working. If neither took it, the visitor sees an error AND the lead's
// details are written to the function log (Vercel > project > Logs, search "LEAD NOT DELIVERED")
// so it can still be followed up by hand.
//
// Switches (Vercel project environment variables):
//   FUB_ENABLED=false   stop sending to Follow Up Boss (do this when FUB is cancelled). FUB_API_KEY can then be removed.
//   CRM_INTAKE_URL / CRM_INTAKE_SECRET   the CRM destination (secret must match LEAD_INTAKE_SECRET in the CRM's Supabase secrets).
// See server/mlsClient.js's sibling comment style for the "why a backend" explanation - short
// version: your FUB API key must never reach the browser.

const FUB_SOURCE = process.env.FUB_SOURCE || 'TheFriedmanTeam.com';
const CRM_INTAKE_URL = process.env.CRM_INTAKE_URL; // e.g. https://<project>.supabase.co/functions/v1/intake-lead
const CRM_INTAKE_SECRET = process.env.CRM_INTAKE_SECRET; // must match LEAD_INTAKE_SECRET in the CRM's Supabase secrets
const FUB_ENABLED = String(process.env.FUB_ENABLED ?? 'true').trim().toLowerCase() !== 'false';

// Awaited (not truly fire-and-forget) so the request actually completes before this serverless
// function returns - a Vercel Node function can stop running pending work as soon as the response
// is sent. Never throws: it reports what happened.
async function sendToCrm(payload) {
  if (!CRM_INTAKE_URL || !CRM_INTAKE_SECRET) return { ok: false, skipped: true, why: 'CRM_INTAKE_URL or CRM_INTAKE_SECRET is not set' };
  try {
    const res = await fetch(CRM_INTAKE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-intake-secret': CRM_INTAKE_SECRET },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const why = `CRM lead intake rejected the lead: ${res.status} ${await res.text()}`;
      console.error(why);
      return { ok: false, why };
    }
    return { ok: true };
  } catch (err) {
    const why = `Could not reach the CRM lead intake endpoint: ${err}`;
    console.error(why);
    return { ok: false, why };
  }
}

async function sendToFub(fubPayload) {
  const key = process.env.FUB_API_KEY;
  if (!FUB_ENABLED) return { ok: false, skipped: true, why: 'FUB_ENABLED is false' };
  if (!key) return { ok: false, skipped: true, why: 'FUB_API_KEY is not set' };
  try {
    const res = await fetch('https://api.followupboss.com/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(`${key}:`).toString('base64'),
      },
      body: JSON.stringify(fubPayload),
    });
    if (!res.ok) {
      const why = `Follow Up Boss rejected the lead: ${res.status} ${await res.text()}`;
      console.error(why);
      return { ok: false, why };
    }
    return { ok: true };
  } catch (err) {
    const why = `Could not reach Follow Up Boss: ${err}`;
    console.error(why);
    return { ok: false, why };
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

    const fubActive = FUB_ENABLED && !!process.env.FUB_API_KEY;
    const crmActive = !!(CRM_INTAKE_URL && CRM_INTAKE_SECRET);
    if (!fubActive && !crmActive) {
      console.error('No lead destination is configured: set CRM_INTAKE_URL and CRM_INTAKE_SECRET (and FUB_API_KEY while FUB is still used) in the Vercel project environment variables.');
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
    // actual mail-merge list out of the CRM (or FUB) by tag.
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

    // Original `type` (not FUB's remapped eventType), the CRM's intake_lead
    // RPC has its own mapping for "Mailing List" etc.
    const crmPayload = { name, email, phone, type: type || 'General Inquiry', message, address, tags, source: FUB_SOURCE };

    // Both go out at the same time and neither waits for the other.
    const [fub, crm] = await Promise.all([sendToFub(fubPayload), sendToCrm(crmPayload)]);

    if (!fub.ok && !crm.ok) {
      console.error('LEAD NOT DELIVERED (follow up by hand):', JSON.stringify({ name, email, phone, type, message, address, tags, fub: fub.why, crm: crm.why }));
      return res.status(502).json({ ok: false, error: 'We could not record your submission just now. Please call or email us.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error handling a lead:', err);
    return res.status(500).json({ ok: false, error: 'Unexpected server error.' });
  }
}

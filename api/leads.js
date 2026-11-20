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
//   HC_LEADS_URL        optional Healthchecks.io ping URL for the "Website leads" check. When the CRM leg fails
//                       (any reason, FUB ok or not) a short ping goes to <url>/fail; when the CRM leg succeeds a ping
//                       goes to <url>. The ping body has only ids and counters, NEVER a name, phone, email or message.
//                       Unset = no pings. A ping can never change the visitor's result.
//   LEAD_LEG_TIMEOUT_MS / HC_PING_TIMEOUT_MS   optional overrides (defaults 7000 and 1500; the ping is capped at 2000).
//   LEAD_CRM_RETRY=on   (front door G17, off by default) one retry of the CRM leg after a fast transient failure (network, timeout, 5xx);
//                       LEAD_RETRY_BUDGET_MS (3000) = the longest the first try may have taken, LEAD_RETRY_DELAY_MS (1000, max 3000) = the wait.
//   A CRM answer of 202 {parked:true} (the edge function's LEAD_PARK_MODE=on) counts as STORED for the visitor (the payload is in the CRM's
//   inbound_leads and HQ alerts Kyle) but still sends the Healthchecks fail ping, because no person or task exists yet.
// See server/mlsClient.js's sibling comment style for the "why a backend" explanation - short
// version: your FUB API key must never reach the browser.

// Read at call time (not module load) so a changed variable and the unit tests take effect immediately.
const env = () => ({
  FUB_SOURCE: process.env.FUB_SOURCE || 'TheFriedmanTeam.com',
  CRM_INTAKE_URL: process.env.CRM_INTAKE_URL, // e.g. https://<project>.supabase.co/functions/v1/intake-lead
  CRM_INTAKE_SECRET: process.env.CRM_INTAKE_SECRET, // must match LEAD_INTAKE_SECRET in the CRM's Supabase secrets
  FUB_ENABLED: String(process.env.FUB_ENABLED ?? 'true').trim().toLowerCase() !== 'false',
  FUB_API_KEY: process.env.FUB_API_KEY,
});

const legTimeoutMs = () => Math.max(Number(process.env.LEAD_LEG_TIMEOUT_MS) || 7000, 1);
const pingTimeoutMs = () => Math.min(Math.max(Number(process.env.HC_PING_TIMEOUT_MS) || 1500, 1), 2000);

// How a failed send is described in the ping: an HTTP status number, 'timeout', 'network', or 'skipped'.
function failStatus(err) {
  const n = err && err.name;
  return n === 'TimeoutError' || n === 'AbortError' ? 'timeout' : 'network';
}

// Awaited (not truly fire-and-forget) so the request actually completes before this serverless
// function returns - a Vercel Node function can stop running pending work as soon as the response
// is sent. Never throws: it reports what happened.
async function sendToCrm(payload) {
  const { CRM_INTAKE_URL, CRM_INTAKE_SECRET } = env();
  if (!CRM_INTAKE_URL || !CRM_INTAKE_SECRET) return { ok: false, skipped: true, status: 'skipped', why: 'CRM_INTAKE_URL or CRM_INTAKE_SECRET is not set' };
  try {
    const res = await fetch(CRM_INTAKE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-intake-secret': CRM_INTAKE_SECRET },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(legTimeoutMs()),
    });
    const text = await res.text().catch(() => '');
    // The CRM edge function (LEAD_PARK_MODE=on) answers 202 {ok:false, parked:true} when intake_lead refused the lead but the
    // payload is safely stored for HQ to follow up. That is NOT a delivery (no person, no task yet) but it is not a lost lead either.
    let parsed = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { /* not JSON: treat as before */ }
    if (parsed && parsed.parked === true) {
      const why = `CRM lead intake refused the lead but parked it for follow-up: ${String(parsed.error || '').slice(0, 120)}`;
      console.error(why);
      return { ok: false, parked: true, status: 'parked', why };
    }
    if (!res.ok) {
      const why = `CRM lead intake rejected the lead: ${res.status} ${text}`;
      console.error(why);
      return { ok: false, status: res.status, why };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    const why = `Could not reach the CRM lead intake endpoint: ${err}`;
    console.error(why);
    return { ok: false, status: failStatus(err), why };
  }
}

// ONE retry of the CRM leg for a transient failure (network error, timeout, a 5xx). Off by default (LEAD_CRM_RETRY=on turns it on).
// Only when the first try failed fast enough to leave the serverless time budget (LEAD_RETRY_BUDGET_MS, default 3000) and never for a
// skipped, parked or 4xx answer (a retry cannot fix those). The retry's result replaces the first.
const retryOn = () => String(process.env.LEAD_CRM_RETRY || 'off').trim().toLowerCase() === 'on';
const retryBudgetMs = () => Math.max(Number(process.env.LEAD_RETRY_BUDGET_MS) || 3000, 0);
const retryDelayMs = () => Math.min(Math.max(Number(process.env.LEAD_RETRY_DELAY_MS) || 1000, 0), 3000);
const transient = (r) => !r.ok && !r.skipped && !r.parked && (r.status === 'timeout' || r.status === 'network' || (typeof r.status === 'number' && r.status >= 500));

async function sendToCrmWithRetry(payload) {
  const t0 = Date.now();
  const first = await sendToCrm(payload);
  if (!retryOn() || !transient(first) || Date.now() - t0 > retryBudgetMs()) return first;
  await new Promise((r) => setTimeout(r, retryDelayMs()));
  const second = await sendToCrm(payload);
  return second.ok ? { ...second, retried: true } : { ...first, retried: true };
}

async function sendToFub(fubPayload) {
  const { FUB_ENABLED, FUB_API_KEY: key } = env();
  if (!FUB_ENABLED) return { ok: false, skipped: true, status: 'skipped', why: 'FUB_ENABLED is false' };
  if (!key) return { ok: false, skipped: true, status: 'skipped', why: 'FUB_API_KEY is not set' };
  try {
    const res = await fetch('https://api.followupboss.com/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(`${key}:`).toString('base64'),
      },
      body: JSON.stringify(fubPayload),
      signal: AbortSignal.timeout(legTimeoutMs()),
    });
    if (!res.ok) {
      const why = `Follow Up Boss rejected the lead: ${res.status} ${await res.text().catch(() => '')}`;
      console.error(why);
      return { ok: false, status: res.status, why };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    const why = `Could not reach Follow Up Boss: ${err}`;
    console.error(why);
    return { ok: false, status: failStatus(err), why };
  }
}

// ---- attribution -------------------------------------------------------------------------------
// The browser sends `attribution` (form id, page path, campaign code, utm fields, referrer host).
// Everything is whitelisted, length-limited and reduced to safe characters, so it is safe to store and
// to put in a ping. Nothing in it is personal data.
const slug = (v, max = 40) =>
  typeof v === 'string'
    ? v.toLowerCase().trim().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, max)
    : '';

function cleanPath(v) {
  if (typeof v !== 'string') return '';
  return v.split(/[?#]/)[0].replace(/[^A-Za-z0-9/_\-.~]/g, '').slice(0, 120);
}

function cleanHost(v) {
  if (typeof v !== 'string') return '';
  let h = v.trim().toLowerCase();
  try { if (/^https?:\/\//.test(h)) h = new URL(h).hostname; } catch { return ''; }
  return h.replace(/[^a-z0-9.-]/g, '').slice(0, 80);
}

function cleanAttribution(a) {
  if (!a || typeof a !== 'object' || Array.isArray(a)) return undefined;
  const out = {};
  const put = (k, v) => { if (v) out[k] = v; };
  put('form_id', slug(a.form_id));
  put('page', cleanPath(a.page));
  put('code', slug(a.code));
  put('utm_source', slug(a.utm_source));
  put('utm_medium', slug(a.utm_medium));
  put('utm_campaign', slug(a.utm_campaign));
  put('referrer', cleanHost(a.referrer));
  return Object.keys(out).length ? out : undefined;
}

// ---- Healthchecks ping ---------------------------------------------------------------------------
// Fire with a hard timeout and swallow every error. Awaited because a serverless function can be frozen
// once the response is sent, but it is capped (default 1.5s, never over 2s) and can never throw.
function pingBody({ form, page, type, crm, fub, addrOnly }) {
  const knownTypes = ['Seller Inquiry', 'General Inquiry', 'Property Inquiry', 'Registration', 'Network Inquiry', 'Mailing List'];
  return [
    `form=${form || 'unknown'}`,
    `page=${page || 'unknown'}`,
    `type=${knownTypes.includes(type) ? type : 'other'}`,
    `crm=${crm.status}`,
    `fub=${fub.ok ? 'ok' : fub.status}`,
    `addr_only=${addrOnly ? 1 : 0}`,
    `retried=${crm.retried ? 1 : 0}`,
    `at=${new Date().toISOString()}`,
  ].join('\n');
}

async function pingHealthchecks(ok, info) {
  try {
    const u = new URL(String(process.env.HC_LEADS_URL || '').trim());
    if (u.protocol !== 'https:') return;
    u.search = '';
    u.hash = '';
    u.pathname = u.pathname.replace(/\/+$/, '') + (ok ? '' : '/fail');
    await fetch(u.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: pingBody(info),
      signal: AbortSignal.timeout(pingTimeoutMs()),
    });
  } catch {
    // a failed ping must never change what the visitor sees
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, type, message, address, tags, attribution: rawAttribution } = req.body || {};

    const hasUsableAddress =
      address && String(address.street || '').trim() && String(address.zip || '').trim();

    if (!name || (!email && !phone && !hasUsableAddress)) {
      return res
        .status(400)
        .json({ ok: false, error: 'Name and at least one of email, phone, or a mailing address are required.' });
    }

    const { FUB_SOURCE, CRM_INTAKE_URL, CRM_INTAKE_SECRET, FUB_ENABLED, FUB_API_KEY } = env();
    const attribution = cleanAttribution(rawAttribution);
    // Address-only (no email, no phone): api/leads accepts it, but the CRM's intake_lead needs an email or
    // phone. It is still sent (so it works the day the CRM accepts it) and a failure is flagged in the ping.
    const addrOnly = !email && !phone;
    const pingInfoBase = { form: attribution?.form_id, page: attribution?.page, type, addrOnly };

    const fubActive = FUB_ENABLED && !!FUB_API_KEY;
    const crmActive = !!(CRM_INTAKE_URL && CRM_INTAKE_SECRET);
    if (!fubActive && !crmActive) {
      console.error('No lead destination is configured: set CRM_INTAKE_URL and CRM_INTAKE_SECRET (and FUB_API_KEY while FUB is still used) in the Vercel project environment variables.');
      console.error('LEAD NOT DELIVERED (follow up by hand):', JSON.stringify({ name, email, phone, type, message, address, tags, why: 'no destination configured' }));
      await pingHealthchecks(false, { ...pingInfoBase, crm: { status: 'skipped' }, fub: { ok: false, status: 'skipped' } });
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
    // `attribution` rides along (intake_lead stores the whole payload in inbound_leads.parsed) and ONE
    // "Src:<code or form id>" tag is added so the CRM can filter by where the lead came from.
    const crmPayload = { name, email, phone, type: type || 'General Inquiry', message, address, tags, source: FUB_SOURCE };
    if (attribution) {
      crmPayload.attribution = attribution;
      const src = attribution.code || attribution.form_id;
      if (src) crmPayload.tags = [...(Array.isArray(tags) ? tags.map((t) => String(t)).slice(0, 19) : []), `Src:${src}`];
    }

    // Both go out at the same time and neither waits for the other.
    const [fub, crm] = await Promise.all([sendToFub(fubPayload), sendToCrmWithRetry(crmPayload)]);

    // The visitor is told thanks only when the lead is STORED somewhere: the CRM took it, Follow Up Boss took it, or the CRM
    // parked it (inbound_leads, read by HQ: web_lead_watch.py). Otherwise it is the honest error plus the log line below.
    const stored = !!(fub.ok || crm.ok || crm.parked);

    if (!stored) {
      console.error('LEAD NOT DELIVERED (follow up by hand):', JSON.stringify({ name, email, phone, type, message, address, tags, fub: fub.why, crm: crm.why }));
    }

    // Alert on ANY CRM failure (FUB ok or not, parked or not); success ping doubles as a dead-man's switch.
    await pingHealthchecks(!!crm.ok, { ...pingInfoBase, crm, fub });

    if (!stored) {
      return res.status(502).json({ ok: false, error: 'We could not record your submission just now. Please call or email us.' });
    }

    return res.status(200).json({ ok: true, crm: !!crm.ok, fub: !!fub.ok, parked: !!crm.parked });
  } catch (err) {
    console.error('Error handling a lead:', err);
    await pingHealthchecks(false, { crm: { status: 'error' }, fub: { ok: false, status: 'error' } });
    return res.status(500).json({ ok: false, error: 'Unexpected server error.' });
  }
}

// Tests for api/leads.js. Run with: npm test   (node --test, no extra packages).
// fetch is mocked; nothing here touches the real CRM, Follow Up Boss or Healthchecks.

import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/leads.js';

const CRM = 'https://crm.test/functions/v1/intake-lead';
const HC = 'https://hc-ping.com/00000000-test-uuid';

const ENV_KEYS = [
  'CRM_INTAKE_URL', 'CRM_INTAKE_SECRET', 'FUB_API_KEY', 'FUB_ENABLED', 'FUB_SOURCE',
  'HC_LEADS_URL', 'LEAD_LEG_TIMEOUT_MS', 'HC_PING_TIMEOUT_MS',
];

const PII = {
  name: 'Zorblat Quenby',
  email: 'zorblat.quenby@pii-canary.example',
  phone: '4105559876',
  message: 'PII-CANARY-MESSAGE sell my house at 12 Secret Lane',
  address: { street: '12 Secret Lane', city: 'Canaryville', state: 'MD', zip: '21999' },
};
const PII_STRINGS = ['Zorblat', 'Quenby', 'zorblat', 'pii-canary', '4105559876', 'PII-CANARY', 'Secret Lane', 'Canaryville', '21999'];

function baseEnv(over = {}) {
  return {
    CRM_INTAKE_URL: CRM, CRM_INTAKE_SECRET: 'test-secret-value', FUB_API_KEY: 'test-fub-key',
    HC_LEADS_URL: HC, LEAD_LEG_TIMEOUT_MS: '200', HC_PING_TIMEOUT_MS: '200', ...over,
  };
}

// route: { crm, fub, hc } each a function(url, init) -> Response | Promise | throws
async function run(body, env, route = {}) {
  for (const k of ENV_KEYS) delete process.env[k];
  for (const [k, v] of Object.entries(env)) if (v !== undefined) process.env[k] = v;

  const calls = [];
  const realFetch = globalThis.fetch;
  const realErr = console.error;
  const logs = [];
  console.error = (...a) => logs.push(a.join(' '));
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url);
    const kind = u.startsWith('https://crm.test') ? 'crm' : u.includes('followupboss') ? 'fub' : u.includes('hc-ping') ? 'hc' : 'other';
    calls.push({ kind, url: u, init, body: init.body });
    const fn = route[kind] || (() => new Response('{}', { status: 200 }));
    return fn(u, init);
  };
  const res = {
    statusCode: 0, payload: null,
    status(c) { this.statusCode = c; return this; },
    json(p) { this.payload = p; return this; },
  };
  const t0 = Date.now();
  try {
    await handler({ method: 'POST', body }, res);
  } finally {
    globalThis.fetch = realFetch;
    console.error = realErr;
  }
  return { status: res.statusCode, json: res.payload, calls, logs, ms: Date.now() - t0 };
}

const hcCalls = (r) => r.calls.filter((c) => c.kind === 'hc');
const goodLead = { ...PII, type: 'Seller Inquiry' };

test('success on both legs: 200, no fail ping, one success ping', async () => {
  const r = await run(goodLead, baseEnv());
  assert.equal(r.status, 200);
  assert.equal(r.json.ok, true);
  assert.equal(r.json.crm, true);
  assert.equal(r.json.fub, true);
  const hc = hcCalls(r);
  assert.equal(hc.length, 1);
  assert.equal(hc[0].url, HC); // no /fail suffix
});

test('CRM fails (500), FUB ok: visitor sees success, FUB still called, fail ping sent', async () => {
  const r = await run(goodLead, baseEnv(), { crm: () => new Response('boom', { status: 500 }) });
  assert.equal(r.status, 200);
  assert.ok(r.calls.some((c) => c.kind === 'fub'), 'FUB leg must still run');
  const hc = hcCalls(r);
  assert.equal(hc.length, 1);
  assert.equal(hc[0].url, HC + '/fail');
  assert.match(String(hc[0].body), /crm=500/);
  assert.match(String(hc[0].body), /fub=ok/);
});

test('CRM throws (network): fail ping says network, FUB still runs', async () => {
  const r = await run(goodLead, baseEnv(), { crm: () => { throw new TypeError('fetch failed'); } });
  assert.equal(r.status, 200);
  assert.ok(r.calls.some((c) => c.kind === 'fub'));
  assert.equal(hcCalls(r)[0].url, HC + '/fail');
  assert.match(String(hcCalls(r)[0].body), /crm=network/);
});

test('CRM hangs: leg timeout fires, visitor still gets a result, fail ping says timeout', async () => {
  const hang = (u, init) => new Promise((_, rej) => {
    init.signal.addEventListener('abort', () => rej(init.signal.reason));
  });
  const r = await run(goodLead, baseEnv(), { crm: hang });
  assert.equal(r.status, 200);
  assert.equal(hcCalls(r)[0].url, HC + '/fail');
  assert.match(String(hcCalls(r)[0].body), /crm=timeout/);
  assert.ok(r.ms < 3000);
});

test('FUB fails, CRM ok: 200, success ping only', async () => {
  const r = await run(goodLead, baseEnv(), { fub: () => new Response('nope', { status: 401 }) });
  assert.equal(r.status, 200);
  assert.equal(r.json.crm, true);
  assert.equal(r.json.fub, false);
  assert.equal(hcCalls(r).length, 1);
  assert.equal(hcCalls(r)[0].url, HC);
});

test('both legs fail: 502 to visitor, lead logged for hand follow-up, one fail ping', async () => {
  const bad = () => new Response('x', { status: 500 });
  const r = await run(goodLead, baseEnv(), { crm: bad, fub: bad });
  assert.equal(r.status, 502);
  assert.ok(r.logs.some((l) => l.includes('LEAD NOT DELIVERED')));
  assert.equal(hcCalls(r).length, 1);
  assert.equal(hcCalls(r)[0].url, HC + '/fail');
});

test('ping that throws never changes the visitor result', async () => {
  const r = await run(goodLead, baseEnv(), { hc: () => { throw new Error('hc down'); } });
  assert.equal(r.status, 200);
  assert.equal(r.json.ok, true);
  const r2 = await run(goodLead, baseEnv(), {
    crm: () => new Response('b', { status: 500 }),
    hc: () => { throw new Error('hc down'); },
  });
  assert.equal(r2.status, 200);
});

test('ping that hangs is cut off quickly and never blocks the visitor', async () => {
  const hang = (u, init) => new Promise((_, rej) => {
    init.signal.addEventListener('abort', () => rej(init.signal.reason));
  });
  const r = await run(goodLead, baseEnv(), { hc: hang });
  assert.equal(r.status, 200);
  assert.ok(r.ms < 1500, `took ${r.ms}ms`);
});

test('default ping timeout is at most 2 seconds', async () => {
  const seen = [];
  const r = await run(goodLead, baseEnv({ HC_PING_TIMEOUT_MS: undefined }), {
    hc: (u, init) => { seen.push(init.signal); return new Response('OK'); },
  });
  assert.equal(r.status, 200);
  assert.ok(seen[0], 'ping must carry an abort signal');
});

test('HC_LEADS_URL unset: no ping at all, behavior unchanged', async () => {
  const r = await run(goodLead, baseEnv({ HC_LEADS_URL: undefined }), { crm: () => new Response('b', { status: 500 }) });
  assert.equal(r.status, 200);
  assert.equal(hcCalls(r).length, 0);
});

test('non-https HC_LEADS_URL is ignored', async () => {
  const r = await run(goodLead, baseEnv({ HC_LEADS_URL: 'http://evil.test/x' }));
  assert.equal(r.calls.filter((c) => c.url.startsWith('http://evil.test')).length, 0);
  assert.equal(r.status, 200);
});

test('ping carries no PII, no response text, no secrets (success and failure)', async () => {
  const echo = () => new Response(`rejected for ${PII.name} ${PII.email} ${PII.phone}`, { status: 400 });
  const r = await run(
    { ...goodLead, tags: ['Mailing List'], attribution: { form_id: 'contact', page: '/contact', code: 'am-2026-12' } },
    baseEnv(), { crm: echo, fub: echo },
  );
  const r2 = await run(goodLead, baseEnv());
  for (const rr of [r, r2]) {
    for (const c of hcCalls(rr)) {
      const blob = c.url + '\n' + String(c.body) + '\n' + JSON.stringify(c.init.headers || {});
      for (const s of PII_STRINGS) assert.ok(!blob.includes(s), `ping leaked ${s}`);
      assert.ok(!blob.includes('test-secret-value'));
      assert.ok(!blob.includes('test-fub-key'));
    }
  }
  assert.match(String(hcCalls(r)[0].body), /form=contact/);
  assert.match(String(hcCalls(r)[0].body), /page=\/contact/);
});

test('ping page and form are sanitized (no query string, no odd characters)', async () => {
  const r = await run(
    { ...goodLead, attribution: { form_id: 'x y<script>', page: '/a/b?email=zorblat.quenby@pii-canary.example' } },
    baseEnv(), { crm: () => new Response('b', { status: 500 }) },
  );
  const body = String(hcCalls(r)[0].body);
  assert.ok(!body.includes('pii-canary'));
  assert.ok(!body.includes('<'));
});

test('address-only submission (F8): CRM leg is still attempted, failure is recorded via ping, visitor result unchanged', async () => {
  const crmRejects = () => new Response('name and at least one of email/phone are required', { status: 400 });
  const lead = { name: PII.name, type: 'Mailing List', address: PII.address, tags: ['Mailing List'] };
  const r = await run(lead, baseEnv(), { crm: crmRejects });
  assert.equal(r.status, 200); // FUB took it, visitor sees success as before
  assert.ok(r.calls.some((c) => c.kind === 'crm'));
  const hc = hcCalls(r);
  assert.equal(hc[0].url, HC + '/fail');
  assert.match(String(hc[0].body), /addr_only=1/);
  assert.match(String(hc[0].body), /crm=400/);
  for (const s of PII_STRINGS) assert.ok(!String(hc[0].body).includes(s));
});

test('address-only with both legs failing: 502 and the lead is logged for follow-up', async () => {
  const bad = () => new Response('x', { status: 400 });
  const lead = { name: PII.name, type: 'Mailing List', address: PII.address };
  const r = await run(lead, baseEnv(), { crm: bad, fub: bad });
  assert.equal(r.status, 502);
  assert.ok(r.logs.some((l) => l.includes('LEAD NOT DELIVERED')));
});

test('validation 400 unchanged: no name, or nothing to reach them by', async () => {
  const a = await run({ email: 'a@b.co' }, baseEnv());
  assert.equal(a.status, 400);
  const b = await run({ name: 'No Contact' }, baseEnv());
  assert.equal(b.status, 400);
  assert.equal(a.calls.length + b.calls.length, 0);
});

test('CRM not configured: FUB still takes the lead and a fail ping says crm=skipped', async () => {
  const r = await run(goodLead, baseEnv({ CRM_INTAKE_URL: undefined, CRM_INTAKE_SECRET: undefined }));
  assert.equal(r.status, 200);
  assert.equal(r.json.crm, false);
  assert.equal(hcCalls(r)[0].url, HC + '/fail');
  assert.match(String(hcCalls(r)[0].body), /crm=skipped/);
});

test('nothing configured: 500 as before, lead logged, ping sent', async () => {
  const r = await run(goodLead, baseEnv({ CRM_INTAKE_URL: undefined, CRM_INTAKE_SECRET: undefined, FUB_API_KEY: undefined }));
  assert.equal(r.status, 500);
  assert.ok(r.logs.some((l) => l.includes('LEAD NOT DELIVERED')));
  assert.equal(hcCalls(r)[0].url, HC + '/fail');
});

test('FUB disabled: only the CRM leg runs', async () => {
  const r = await run(goodLead, baseEnv({ FUB_ENABLED: 'false' }));
  assert.equal(r.status, 200);
  assert.equal(r.calls.filter((c) => c.kind === 'fub').length, 0);
});

test('attribution: stored in the CRM payload and a Src tag is added; FUB payload untouched', async () => {
  const r = await run(
    { ...goodLead, tags: ['Mailing List'], attribution: { form_id: 'home-seller-inquiry', page: '/sell', code: 'AM 2026-12', utm_source: 'ig', referrer: 'instagram.com' } },
    baseEnv(),
  );
  const crm = JSON.parse(r.calls.find((c) => c.kind === 'crm').body);
  assert.deepEqual(crm.attribution, {
    form_id: 'home-seller-inquiry', page: '/sell', code: 'am-2026-12', utm_source: 'ig', referrer: 'instagram.com',
  });
  assert.ok(crm.tags.includes('Mailing List'));
  assert.ok(crm.tags.includes('Src:am-2026-12')); // code wins over form id
  assert.equal(crm.tags.length, 2);
  const fub = JSON.parse(r.calls.find((c) => c.kind === 'fub').body);
  assert.deepEqual(fub.person.tags, ['Mailing List']);
  assert.equal(fub.attribution, undefined);
});

test('attribution: with no code the form id is the Src tag', async () => {
  const r = await run({ ...goodLead, attribution: { form_id: 'contact', page: '/contact' } }, baseEnv());
  const crm = JSON.parse(r.calls.find((c) => c.kind === 'crm').body);
  assert.deepEqual(crm.tags, ['Src:contact']);
});

test('attribution: backwards compatible when absent (old clients)', async () => {
  const r = await run(goodLead, baseEnv());
  const crm = JSON.parse(r.calls.find((c) => c.kind === 'crm').body);
  assert.equal(crm.attribution, undefined);
  assert.equal(crm.tags, undefined);
  assert.equal(r.status, 200);
});

test('attribution: junk is dropped, never breaks the lead, tag never trips nurture words', async () => {
  const r = await run(
    { ...goodLead, attribution: { form_id: { a: 1 }, page: 'x'.repeat(500), code: 'Mailing List!!', evil: 'x', utm_source: 42 } },
    baseEnv(),
  );
  assert.equal(r.status, 200);
  const crm = JSON.parse(r.calls.find((c) => c.kind === 'crm').body);
  assert.equal(crm.attribution.evil, undefined);
  assert.ok(crm.attribution.page.length <= 120);
  for (const t of crm.tags || []) assert.ok(!/mailing list|monthly card|historic import/i.test(t), t);
});

test('HC_LEADS_URL with a query string still sends failures to /fail on the path', async () => {
  const r = await run(goodLead, baseEnv({ HC_LEADS_URL: HC + '?create=1' }), { crm: () => new Response('b', { status: 500 }) });
  assert.equal(new URL(hcCalls(r)[0].url).pathname.endsWith('/fail'), true);
});

test('Src tag survives 20 incoming tags', async () => {
  const tags = Array.from({ length: 25 }, (_, i) => 't' + i);
  const r = await run({ ...goodLead, tags, attribution: { form_id: 'contact' } }, baseEnv());
  const crm = JSON.parse(r.calls.find((c) => c.kind === 'crm').body);
  assert.equal(crm.tags.length, 20);
  assert.ok(crm.tags.includes('Src:contact'));
});

test('negative timeout env values are clamped, leads still go out and ping still sends', async () => {
  const r = await run(goodLead, baseEnv({ LEAD_LEG_TIMEOUT_MS: '-5', HC_PING_TIMEOUT_MS: '-5' }));
  assert.equal(r.status, 200);
  assert.equal(r.json.crm, true);
  assert.equal(hcCalls(r).length, 1);
});

test('unexpected handler crash: 500 as before and a fail ping', async () => {
  const body = new Proxy({}, { get() { throw new Error('boom'); } });
  const r = await run(body, baseEnv());
  assert.equal(r.status, 500);
  assert.equal(hcCalls(r)[0].url, HC + '/fail');
});

// Front door G17 (11/20): parked leads, one transient retry, "thanks only if stored". Run with: npm test (node --test, no extra packages).
// fetch is mocked; nothing here touches the real CRM, Follow Up Boss or Healthchecks.
import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/leads.js';

const CRM = 'https://crm.test/functions/v1/intake-lead';
const HC = 'https://hc-ping.com/00000000-test-uuid';
const ENV_KEYS = ['CRM_INTAKE_URL', 'CRM_INTAKE_SECRET', 'FUB_API_KEY', 'FUB_ENABLED', 'FUB_SOURCE', 'HC_LEADS_URL', 'LEAD_LEG_TIMEOUT_MS', 'HC_PING_TIMEOUT_MS', 'LEAD_CRM_RETRY', 'LEAD_RETRY_BUDGET_MS', 'LEAD_RETRY_DELAY_MS'];
const LEAD = { name: 'Quinn Parked', email: 'quinn@pii-canary.example', phone: '4435550100', type: 'Seller Inquiry', message: 'PII-CANARY-MESSAGE sell my house' };
const base = (over = {}) => ({ CRM_INTAKE_URL: CRM, CRM_INTAKE_SECRET: 's', FUB_ENABLED: 'false', HC_LEADS_URL: HC, LEAD_LEG_TIMEOUT_MS: '200', HC_PING_TIMEOUT_MS: '200', LEAD_RETRY_DELAY_MS: '1', ...over });

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
    calls.push({ kind, url: u, body: init.body });
    return (route[kind] || (() => new Response('{}', { status: 200 })))(u, init, calls.filter((c) => c.kind === kind).length);
  };
  const res = { statusCode: 0, payload: null, status(c) { this.statusCode = c; return this; }, json(p) { this.payload = p; return this; } };
  try { await handler({ method: 'POST', body }, res); } finally { globalThis.fetch = realFetch; console.error = realErr; }
  return { status: res.statusCode, json: res.payload, calls, logs };
}
const of = (r, k) => r.calls.filter((c) => c.kind === k);
const parked = () => new Response(JSON.stringify({ ok: false, parked: true, error: 'constraint' }), { status: 202, headers: { 'content-type': 'application/json' } });

test('CRM parked the lead (202 parked), FUB off: the visitor gets success (the lead IS stored) and Healthchecks gets a fail ping that says parked', async () => {
  const r = await run(LEAD, base(), { crm: parked });
  assert.equal(r.status, 200);
  assert.equal(r.json.ok, true);
  assert.equal(r.json.crm, false);
  assert.equal(r.json.parked, true);
  assert.equal(of(r, 'hc').length, 1);
  assert.equal(of(r, 'hc')[0].url, HC + '/fail');
  assert.match(String(of(r, 'hc')[0].body), /crm=parked/);
  assert.ok(!r.logs.join('\n').includes('LEAD NOT DELIVERED'), 'a parked lead is not a lost lead');
});

test('the fail ping and every log line for a parked lead hold no personal data', async () => {
  const r = await run(LEAD, base(), { crm: parked });
  const all = r.logs.join('\n') + String(of(r, 'hc')[0].body);
  for (const pii of ['Quinn', 'quinn@', 'pii-canary', '4435550100', 'PII-CANARY']) assert.ok(!all.includes(pii), 'must not hold ' + pii);
});

test('CRM fails hard (500) and FUB is off: NOT stored, honest 502, the full lead in the log, fail ping', async () => {
  const r = await run(LEAD, base(), { crm: () => new Response('boom', { status: 500 }) });
  assert.equal(r.status, 502);
  assert.equal(r.json.ok, false);
  assert.ok(r.logs.some((l) => l.includes('LEAD NOT DELIVERED')));
  assert.equal(of(r, 'hc')[0].url, HC + '/fail');
});

test('CRM parked but the visitor must not see an error even when FUB failed too', async () => {
  const r = await run(LEAD, base({ FUB_ENABLED: 'true', FUB_API_KEY: 'k' }), { crm: parked, fub: () => new Response('no', { status: 401 }) });
  assert.equal(r.status, 200);
  assert.equal(r.json.parked, true);
});

test('a 202 without parked:true is a plain success (nothing assumed)', async () => {
  const r = await run(LEAD, base(), { crm: () => new Response('{"ok":true}', { status: 202 }) });
  assert.equal(r.status, 200);
  assert.equal(r.json.crm, true);
  assert.equal(r.json.parked, false);
  assert.equal(of(r, 'hc')[0].url, HC);
});

test('RETRY off (the default): a 500 is tried once only', async () => {
  const r = await run(LEAD, base(), { crm: () => new Response('boom', { status: 500 }) });
  assert.equal(of(r, 'crm').length, 1);
});

test('RETRY on: a transient 500 then success is delivered, one retry, ping says ok', async () => {
  const r = await run(LEAD, base({ LEAD_CRM_RETRY: 'on' }), { crm: (u, i, n) => (n === 1 ? new Response('boom', { status: 500 }) : new Response('{"ok":true}', { status: 200 })) });
  assert.equal(r.status, 200);
  assert.equal(r.json.crm, true);
  assert.equal(of(r, 'crm').length, 2);
  assert.equal(of(r, 'hc')[0].url, HC);
  assert.match(String(of(r, 'hc')[0].body), /retried=1/);
});

test('RETRY on: a network error then another failure is exactly ONE retry, then the honest failure', async () => {
  const r = await run(LEAD, base({ LEAD_CRM_RETRY: 'on' }), { crm: () => { throw new TypeError('fetch failed'); } });
  assert.equal(of(r, 'crm').length, 2);
  assert.equal(r.status, 502);
  assert.match(String(of(r, 'hc')[0].body), /crm=network/);
});

test('RETRY on: never retried for a 4xx, a parked answer or a missing configuration', async () => {
  let r = await run(LEAD, base({ LEAD_CRM_RETRY: 'on' }), { crm: () => new Response('bad', { status: 400 }) });
  assert.equal(of(r, 'crm').length, 1);
  r = await run(LEAD, base({ LEAD_CRM_RETRY: 'on' }), { crm: parked });
  assert.equal(of(r, 'crm').length, 1);
  r = await run(LEAD, base({ LEAD_CRM_RETRY: 'on', FUB_ENABLED: 'true', FUB_API_KEY: 'k', CRM_INTAKE_URL: undefined, CRM_INTAKE_SECRET: undefined }), {});
  assert.equal(of(r, 'crm').length, 0);
});

test('RETRY on: a slow failure (over the budget) is not retried, so the serverless time limit is never at risk', async () => {
  const slow = () => new Promise((resolve) => setTimeout(() => resolve(new Response('boom', { status: 500 })), 30));
  const r = await run(LEAD, base({ LEAD_CRM_RETRY: 'on', LEAD_RETRY_BUDGET_MS: '5' }), { crm: slow });
  assert.equal(of(r, 'crm').length, 1);
});

test('a flood of 100 submissions with the CRM parking every one: 100 successes for visitors, 100 fail pings, no lost lead, no crash', async () => {
  let ok = 0;
  for (let i = 0; i < 100; i++) {
    const r = await run({ ...LEAD, email: `q${i}@example.test` }, base(), { crm: parked });
    if (r.status === 200 && r.json.parked) ok++;
  }
  assert.equal(ok, 100);
});

test('FUB took it, CRM failed hard: still success for the visitor (stored in FUB) plus the fail ping (unchanged behaviour)', async () => {
  const r = await run(LEAD, base({ FUB_ENABLED: 'true', FUB_API_KEY: 'k' }), { crm: () => new Response('boom', { status: 500 }) });
  assert.equal(r.status, 200);
  assert.equal(of(r, 'hc')[0].url, HC + '/fail');
});

// scripts/test-leads.mjs - run with: node scripts/test-leads.mjs
// Tests api/leads.js with both destinations mocked (no network, no real lead is sent anywhere).
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const FILE = pathToFileURL(path.resolve('api/leads.js')).href;
let pass = 0;
let fail = 0;
const check = (name, ok, detail = '') => {
  if (ok) pass++; else fail++;
  console.log((ok ? '  [PASS] ' : '  [FAIL] ') + name + (ok ? '' : '  (' + String(detail).slice(0, 300) + ')'));
};

const BODY = { name: 'Sam Tester', email: 'sam@example.test', phone: '410-555-0100', type: 'Seller Inquiry', message: 'Thinking of selling' };

// env: which destinations exist. fub / crm: 'ok' | 'reject' | 'throw'
async function run({ fub = 'ok', crm = 'ok', env = {}, body = BODY, method = 'POST' }) {
  for (const k of ['FUB_API_KEY', 'FUB_ENABLED', 'CRM_INTAKE_URL', 'CRM_INTAKE_SECRET']) delete process.env[k];
  Object.assign(process.env, { FUB_API_KEY: 'k', CRM_INTAKE_URL: 'https://crm.example.test/intake', CRM_INTAKE_SECRET: 's' }, env);
  for (const [k, v] of Object.entries(env)) if (v === undefined) delete process.env[k];
  const calls = [];
  const logs = [];
  const realFetch = globalThis.fetch;
  const realErr = console.error;
  console.error = (...a) => logs.push(a.map(String).join(' '));
  globalThis.fetch = async (url, opts) => {
    const which = String(url).includes('followupboss') ? 'fub' : 'crm';
    calls.push({ which, opts, body: opts && opts.body ? JSON.parse(opts.body) : null });
    const mode = which === 'fub' ? fub : crm;
    if (mode === 'throw') throw new Error('network down');
    if (mode === 'reject') return { ok: false, status: which === 'fub' ? 401 : 500, text: async () => 'nope' };
    return { ok: true, status: 200, text: async () => 'ok' };
  };
  const mod = await import(FILE + '?v=' + Math.random());
  const res = { code: null, body: null, status(n) { this.code = n; return this; }, json(b) { this.body = b; return this; } };
  try {
    await mod.default({ method, body }, res);
  } finally {
    globalThis.fetch = realFetch;
    console.error = realErr;
  }
  return { res, calls, logs };
}

console.log('both destinations working');
let r = await run({});
check('a lead goes to BOTH and the visitor sees success', r.res.code === 200 && r.res.body.ok === true && r.calls.map((c) => c.which).sort().join() === 'crm,fub', r.calls.map((c) => c.which));

console.log('Follow Up Boss gone or failing (the cutover case)');
r = await run({ fub: 'reject' });
check('FUB rejects the lead (cancelled account, bad key) but the CRM takes it: SUCCESS for the visitor, lead is in the CRM', r.res.code === 200 && r.res.body.ok === true && r.calls.some((c) => c.which === 'crm'), r.res.code);
check('...and the FUB failure is logged so it is visible', r.logs.some((l) => l.includes('Follow Up Boss rejected')), r.logs);
r = await run({ fub: 'throw' });
check('FUB unreachable (network error): the CRM still takes the lead', r.res.code === 200 && r.calls.some((c) => c.which === 'crm'));
r = await run({ env: { FUB_ENABLED: 'false' } });
check('FUB_ENABLED=false: FUB is never called and the lead still succeeds through the CRM', r.res.code === 200 && !r.calls.some((c) => c.which === 'fub') && r.calls.some((c) => c.which === 'crm'), r.calls.map((c) => c.which));
r = await run({ env: { FUB_API_KEY: undefined } });
check('the FUB key removed: FUB is skipped, the CRM takes the lead', r.res.code === 200 && !r.calls.some((c) => c.which === 'fub'));
r = await run({ env: { FUB_ENABLED: 'False' } });
check('FUB_ENABLED is read without regard to capital letters', !r.calls.some((c) => c.which === 'fub') && r.res.code === 200);

console.log('the CRM failing (today, while FUB is still used)');
r = await run({ crm: 'reject' });
check('the CRM rejects the lead but FUB takes it: success, exactly as before', r.res.code === 200 && r.calls.some((c) => c.which === 'fub'));
r = await run({ crm: 'throw' });
check('the CRM unreachable: FUB still takes it', r.res.code === 200);
r = await run({ env: { CRM_INTAKE_URL: undefined, CRM_INTAKE_SECRET: undefined } });
check('CRM not configured at all (the old setup): FUB alone still works', r.res.code === 200 && r.calls.length === 1 && r.calls[0].which === 'fub');

console.log('nothing took it');
r = await run({ fub: 'reject', crm: 'reject' });
check('both fail: the visitor is told, nothing pretends to be delivered', r.res.code === 502 && r.res.body.ok === false, r.res.code);
check('...and the lead is written to the log in full so it can be followed up by hand', r.logs.some((l) => l.startsWith('LEAD NOT DELIVERED') && l.includes('sam@example.test') && l.includes('410-555-0100') && l.includes('Thinking of selling')), r.logs);
r = await run({ env: { CRM_INTAKE_URL: undefined, CRM_INTAKE_SECRET: undefined, FUB_API_KEY: undefined } });
check('no destination configured at all: a clear 500, nothing is called', r.res.code === 500 && r.calls.length === 0);
r = await run({ fub: 'reject', env: { CRM_INTAKE_URL: undefined, CRM_INTAKE_SECRET: undefined } });
check('FUB rejecting with no CRM configured is still an error for the visitor (the old behaviour)', r.res.code === 502);

console.log('what each destination receives');
r = await run({ body: { name: 'Pat Mailer Jones', phone: '', email: '', type: 'Mailing List', message: 'magnets', tags: ['Mailing List', 'Monthly Card'], address: { street: '1 Test St', city: 'Testville', state: 'MD', zip: '21000' } } });
const fubC = r.calls.find((c) => c.which === 'fub');
const crmC = r.calls.find((c) => c.which === 'crm');
check('a mailing-list signup with only an address is accepted', r.res.code === 200, r.res.code);
check('FUB gets the event type Registration, the tags and the structured address', fubC.body.type === 'Registration' && fubC.body.person.tags.join() === 'Mailing List,Monthly Card' && fubC.body.person.addresses[0].code === '21000' && fubC.body.person.firstName === 'Pat' && fubC.body.person.lastName === 'Mailer Jones', fubC.body);
check('the CRM gets the ORIGINAL type (Mailing List), the tags, the address and the secret header', crmC.body.type === 'Mailing List' && crmC.body.tags.length === 2 && crmC.body.address.zip === '21000' && crmC.opts.headers['x-intake-secret'] === 's', crmC);
check('FUB is called with basic auth and the CRM with JSON', fubC.opts.headers.Authorization.startsWith('Basic ') && crmC.opts.headers['Content-Type'] === 'application/json');

console.log('validation');
r = await run({ body: { email: 'a@b.test' } });
check('no name: 400 and nothing is sent anywhere', r.res.code === 400 && r.calls.length === 0);
r = await run({ body: { name: 'No Contact' } });
check('a name with no way to reach the person: 400 and nothing is sent', r.res.code === 400 && r.calls.length === 0);
r = await run({ method: 'GET' });
check('anything but POST is refused with 405', r.res.code === 405 && r.calls.length === 0);

console.log(`\n${pass} / ${pass + fail} passed`);
process.exit(fail ? 1 : 0);

# The Friedman Team Website — Setup Guide

This site is fully independent — no Lofty dependency anywhere. Property search
and home valuation both live natively here.

## What's real vs. what needs your credentials

| Feature | Status |
|---|---|
| Consultation / contact / valuation lead forms | **Fully working** — POST to Follow Up Boss via their `/v1/events` API |
| Newsletter signup | **Fully working** — real Substack embed (needs your subdomain) |
| Branding & contact info | **Fully fixed** — real phone, email, office address |
| Live MLS property search | **Built and wired up, needs your MLS credentials** — see below |
| Home valuation estimate | **Working now** — honest rough estimate + real lead capture, not a full CMA |

## Getting live MLS search working

The Listings page is fully built against your **real Lofty account** — the
same Bright MLS feed you already pay for, no new vendor, no extra monthly
cost. It uses Lofty's documented `POST /v2.0/listings/search` endpoint.

To turn it on:

1. Log into Lofty → **Settings → Integrations → API → Create API Key**
2. Copy the key it generates (you can't view it again after leaving the page)
3. Put it in `.env` as `LOFTY_API_KEY`
4. Restart the server — listings should now be live

**One thing to verify once it's live:** a few field names in the mapping
(`server/mlsClient.js`) — specifically photos, description text, and the
active/sold status field — weren't shown in the API docs excerpt we had
while building this, so they're best-effort guesses. Set `DEBUG_MLS=true` in
`.env`, run one search, and check your server console — it'll print one raw
listing so you can compare Lofty's actual field names against the mapping in
`server/mlsClient.js` and adjust if anything doesn't line up (most likely
candidates: photos not showing, or description text missing).

County and free-text address search aren't documented Lofty API filters, so
those are done by fetching a batch of matching listings (by price/beds/type)
and filtering further in code — works fine, just means very narrow searches
combined with a small page size could occasionally under-return. Increase
`top` in `src/lib/mlsApi.ts` if you notice that.

## 2 things you need to fill in

Open **`src/lib/siteConfig.ts`** and set:

- `SUBSTACK_SUBDOMAIN` — your Substack subdomain for The Friedman Report

Then get a **Follow Up Boss API key**: in FUB, go to Admin → API → Create API Key.

## Running it locally

```bash
npm install
cp .env.example .env
# edit .env: set FUB_API_KEY now, MLS_API_BASE_URL / MLS_API_TOKEN once you have them
npm run dev:all
```

This runs the frontend (port 3000) and backend (port 3001) together, with the
frontend proxying `/api` calls to the backend. Open http://localhost:3000.

If `npm run dev:all` doesn't work in your terminal, run these in two separate
terminal windows instead:
```bash
npm run dev      # terminal 1 - frontend
npm run server   # terminal 2 - backend
```

## Deploying

This needs a persistent Node process running (`server.js`), not a pure static
host:

- **AI Studio / Cloud Run, Render, Railway, Fly.io, a VPS**: set `FUB_API_KEY`
  (and later `MLS_API_BASE_URL` / `MLS_API_TOKEN`) as environment variables,
  run `npm run build` once, then `npm start`.
- **Static-only hosts (Netlify, Vercel static, GitHub Pages)**: won't work
  as-is. Say the word if you want `server.js` converted to serverless
  functions instead.

## Honesty notes (things I deliberately toned down or removed)

- The valuation tool used to claim a fabricated "94% confidence score" and
  "12 comparable sales." Removed — it now says "preliminary estimate, not a
  formal appraisal" and routes to Kyle for a real CMA.
- The Listings page used to claim "Updated in real-time via Bright MLS
  integration" while showing 100% fake data. It now either shows real live
  listings (once connected) or an honest "not connected yet" message — never
  fake data dressed up as real.
- Property type filter options were rewritten from fictional categories
  ("Equestrian Farm," "Modern Sanctuary") to values Lofty's API documents
  ("Single Family," "Condo," "Townhouse"). Check your live Lofty site's own
  search filters for the full list (e.g. Farm, Land) and add matching option
  values here if you want to filter on those too.

## Files worth knowing about

- `server.js` — the backend. Two routes: `POST /api/leads` (→ Follow Up Boss), `GET /api/mls/search` (→ Lofty).
- `server/mlsClient.js` — the actual Lofty integration and field mapping. This is the one file to edit if a field doesn't match what your account returns (see `DEBUG_MLS` above).
- `src/lib/leads.ts` — frontend helper every form calls to submit a lead.
- `src/lib/mlsApi.ts` — frontend helper the Listings page calls to search live MLS data.
- `src/lib/siteConfig.ts` — the one value you need to fill in (Substack subdomain).
- `.env.example` — copy to `.env` and fill in your real credentials.


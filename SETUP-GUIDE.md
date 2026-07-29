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

## Deploying via GitHub + Vercel (no terminal required)

This is now set up to deploy on Vercel using serverless functions (`/api/leads.js`
and `/api/mls/search.js`) instead of a standalone server — which means Vercel
builds and runs everything automatically. You don't need to run `npm install`
or any command on your own computer at all.

**Step 1 — Get the code onto GitHub**
1. Unzip this project on your computer.
2. Go to [github.com](https://github.com) and sign in (or create a free account).
3. Click **New repository**, give it a name (e.g. `friedman-team-site`), leave it Private if you prefer, click **Create repository**.
4. On the empty repo page, click the **"uploading an existing file"** link.
5. Drag the unzipped project folder's contents into the browser window (all the files and folders at once — there are about 46 files, well under GitHub's drag-and-drop limit).
6. Scroll down, click **Commit changes**.

**Step 2 — Connect it to Vercel**
1. Go to [vercel.com](https://vercel.com) and sign up using **"Continue with GitHub"** (easiest option — links your accounts automatically).
2. Click **Add New... → Project**.
3. Find and import the repo you just created.
4. Before clicking Deploy, expand **Environment Variables** and add these (same values that would've gone in `.env`):
   - `LOFTY_API_KEY` — your Lofty API key
   - `FUB_API_KEY` — your Follow Up Boss API key
   - `FUB_SOURCE` — e.g. `TheFriedmanTeam.com`
   - `DEBUG_MLS` — `false` (flip to `true` temporarily later if you need to check field names)
5. Click **Deploy**.

That's it — Vercel gives you a live URL (something like `friedman-team-site.vercel.app`) within a minute or two. Every time you push new changes to GitHub, Vercel automatically redeploys.

**If something's not working after deploying**, the fastest way to check is: Vercel dashboard → your project → **Deployments** → click the latest one → **Functions** tab — this shows you the server-side logs for `/api/leads` and `/api/mls/search`, including the `DEBUG_MLS` output if you turned it on.

## Running it locally instead (optional)

If you do want to test on your own computer before pushing to GitHub, you have two options:

**Simplest — matches Vercel exactly:**
```bash
npx vercel dev
```
(Requires Node.js installed and the Vercel CLI, which `npx` installs automatically the first time. Also asks you to log into Vercel once.)

**Alternative — separate frontend/backend (uses the older Express server.js, kept for other hosts like Render/Railway):**
```bash
npm install
cp .env.example .env
# fill in .env with your real keys
npm run dev:all
```

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


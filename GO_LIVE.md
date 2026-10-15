# GO_LIVE — Car Atlas deploy rulebook

This file closes ticket **QA-004** (filed round 1, 2026-10-13: every
other fleet repo carried a deploy rulebook; Car Atlas did not). It is
written *before* any deploy exists, on purpose: the first push to a
release track must never be improvised.

## Two-track rule (standing, never confuse the tracks)

- **Working repo:** `astercast/car-atlas` (this repo). Build here,
  wave by wave. It is **never deployed** and has no Vercel project.
- **Release repo:** a future `astercast/car-atlas-live`, created only
  when the owner explicitly orders a push ("push" / "ship it").
  Release pushes are snapshots of the working repo, never a second
  place where work happens.
- Before **every** push, verify `git remote get-url origin` names the
  intended track. When in doubt, stop and report instead of pushing.
- As of wave 4 (2026-10-13) no `-live` repo exists and none is
  authorised.

## Vercel configuration (fleet standard, 2026-10-12)

- **Build machine: Standard, never Turbo** (project setting, chosen
  at import time — the September 2026 Turbo invoice was $38.64;
  never repeat it). Static builds are negligible minutes; Hobby
  covers them.
- `vercel.json` lists function paths **explicitly** (never broad
  globs). Each entry holds `{"maxDuration": 10}` and **no `runtime`
  key anywhere** — the property is only for community runtimes;
  Node is auto-detected, and `nodejs20.x`/`nodejs22.x` both fail
  build validation.
- The `functions` map is **not** an allowlist: every `.js` under
  `api/` deploys as a function. Keep static `.js` data files out of
  `api/` entirely, and watch for same-basename collisions
  (`x.js` + `x.json` in one directory fails the build).
- **All static data lives in `data/v1/`** (plain `.json` only).
  Vercel does not serve static files from under `api/`, so nothing
  the frontend fetches may live there. Generator scripts emit to
  `data/v1/` only.
- Current shape: 5 functions (`api/health.js`, `api/makes.js`,
  `api/model.js`, `api/search.js`, `api/clubs.js`), no crons.

## Free-tier posture (summary of the wave-3 audit in LIVE_CHECKLIST.md)

- **Function count: 5** against a fleet cap of 12 — headroom 7.
- **Browsing costs zero invocations**: the frontend is static-first
  and reads `data/v1/*.json` from the CDN; the API is an optional
  mirror of the same data.
- Modelled load at 10,000 page views/month: **~10,000
  invocations/month (≈10% of the Hobby budget)**, and SWR caching
  (`s-maxage=300, stale-while-revalidate=86400` on API, `/data/*`,
  and long-cache SWR on `/assets/*`) means origin load lands only
  on cache misses.
- Worst measured cold handler: **188 ms** against the 10 s
  `maxDuration` ceiling.
- First degradation point: cache-busting `/api/search` traffic —
  it degrades the API only, never the static site.
- **Price Watch stays inside this posture.** Stages 1–12 (waves 4–11,
  rotations 25–30)
  are a static file, `data/v1/price-watch.json` (130 certified
  results), plus the build-computed `data/v1/cohorts.json` — no function, no cron, no external service. Any future ingest cron gets its own explicit
  `vercel.json` entry and its own audit line here *before* it ships;
  no stage may add a paid service.

## Deploy-time checklist (run in order, on the release snapshot)

1. `git remote get-url origin` names the `-live` repo.
2. `python3 scripts/build.py` passes (schema, counts, baked
   snapshot, price-watch source check).
3. Vercel project: build machine **Standard**; `vercel.json` as
   above (explicit paths, `maxDuration: 10`, no `runtime` key).
4. **Absolutize URLs against the real domain** — the working repo
   ships these root-relative on purpose (no domain exists yet):
   - `og:image` and `twitter:image` in all six pages currently read
     `assets/og-card.png`. Major social crawlers do not render
     relative `og:image` URLs: rewrite both to
     `https://<domain>/assets/og-card.png` in one sweep.
   - `rel="canonical"` hrefs (`/`, `/make.html`, `/model.html`,
     `/buy.html`, `/clubs.html`, `/404.html`) become
     `https://<domain>/…`.
   - JSON-LD `image` fields emitted by `assets/js/app.js` (model
     and make pages) are dataset-relative paths; absolutize them in
     the same sweep, or strip the `image` field from the emitted
     JSON-LD until the sweep lands — never ship a relative `image`
     pretending to be final.
   - Favicon links are root-relative (`/favicon.ico`,
     `/favicon.svg`, `/apple-touch-icon.png`) and need no change.
5. `robots.txt` ships allow-all with **no** Sitemap line (no
   sitemap exists). If a sitemap is generated at deploy time, add
   its absolute `Sitemap:` URL in the same commit.
6. Smoke-test the deployed site: homepage stats load, one make
   page, one model page (full live record, not just the baked
   snapshot), Buy page Price Watch results, Clubs filters, and
   `/api/health` counts matching `scripts/build.py`.
7. Record the deploy (domain, commit SHA, date) in `WAVELOG.md`.

## Data honesty gates (deploy-blocking)

- No price appears anywhere unless it is a certified Price Watch
  record with a source link and a date (`data/v1/price-watch.json`
  is validated by `scripts/build.py`).
- Every photograph carries its caption and attribution line from
  the Foundry manifest; a photo without its credit does not ship.
- `COVERAGE.md` counts match `scripts/build.py` output.

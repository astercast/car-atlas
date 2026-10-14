# LIVE_CHECKLIST — car-atlas live-readiness

Car Atlas is a **working repo** (`astercast/car-atlas`). There is **no
`-live` repo** and no Vercel project for it. This checklist documents
that the repo is structured to fleet live standard so a future release
— only on the owner's explicit "push"/"ship it" order — is mechanical.

## Structure (verified wave 1)

- Static frontend at root: `index.html`, `make.html`, `model.html`,
  `buy.html`, `clubs.html`, `404.html`; assets in `assets/`.
- `data/v1/` — ALL static data lives here (`.json` only):
  `makes.json`, `models/<make>.json`, `clubs.json`, `buying.json`,
  generated `search-index.json`.
- `api/` — 5 real serverless functions only: `health.js`, `makes.js`,
  `model.js`, `search.js`, `clubs.js`. No static data under `api/`, no
  `.js` data files there, no basename collisions.
- `lib/data.js` — shared dataset loader for the functions.
- `scripts/build.py` — validates the dataset and regenerates
  `data/v1/search-index.json`. Generator emits only to `data/v1/`.
- `vercel.json` — prepared, **not deployed**: explicit function paths,
  each `{"maxDuration": 10}`; **no `runtime` key anywhere**; no crons
  in wave 1 (Price Watch ingest cron arrives with the ingest wave and
  gets its own explicit entry then).

## Standing Vercel rules (fleet lessons, 2026-10-12)

- **Never pin `runtime` for Node functions** — the property is only
  for community runtimes (npm package names); Node is auto-detected.
  `nodejs20.x`/`nodejs22.x` both fail build validation.
- Functions entries must hold ≥1 valid property: `{"maxDuration": 10}`.
- The `functions` map is NOT an allowlist — every `.js` under `api/`
  deploys as a function; keep static `.js` out of `api/` entirely.
- Vercel never serves static files from under `api/` — hence `data/v1/`.
- Build machine: **Standard, never Turbo** (project setting, set at
  import time — Sept 2026 Turbo invoice was $38.64).
- Before any future `-live` push: verify `git remote get-url origin`
  names the `-live` repo, and re-run this audit.

## Data honesty gates

- `scripts/build.py` must pass (schema + counts) before any commit.
- No live prices are displayed until Price Watch ingest is real;
  every future price record carries `firstSeen`/`lastSeen` timestamps.

## Free-tier / best-pattern audit (wave 3, 2026-10-13)

Measured against the dataset as of wave 3: 40 makes, 180 models,
354 generations, 35 clubs; total `data/v1/` payload 396 KB, of which
the generated search index is 109 KB.

**Function count: 5** — `api/health.js`, `api/makes.js`,
`api/model.js`, `api/search.js`, `api/clubs.js` (verified: those are
the only `.js` files under `api/`). Fleet cap is ≤12 per site, so
headroom is 7. No functions added in wave 3; no crons exist; no
external service is called by any function.

**Estimated monthly invocations.** Assumption (stated, pre-launch
working repo): 10,000 page views/month if this were live today.
The frontend is static-first — browsing costs **zero** function
invocations (pages read `data/v1/*.json` from the CDN). The API is
an optional mirror of the same data. Modelled API load: ~5% of page
views make one API call (~500/mo), crawlers/developer traffic
~1,000/mo, and a 5-minute-interval health monitor worst case
~8,600/mo — **~10,000 invocations/month total, ≈10% of the Hobby
budget recorded in fleet notes (100k invocations/mo)**. Even that
overstates origin load: every API response carries
`s-maxage=300, stale-while-revalidate=86400`, so the edge absorbs
repeat traffic and origin invocations land only on cache misses
and revalidations.

**Worst-case duration vs the 10 s ceiling.** Measured locally with
a Node harness (fresh module load per endpoint = cold path, repeat
call = warm): worst cold handler time **188 ms** (`/api/health`,
which walks the whole dataset), worst warm **≤3.5 ms**, typical
warm <1 ms. That is ~2% of the 10 s `maxDuration` at the measured
worst — platform cold-start overhead on top still leaves >10×
headroom. (Local measurement, not a Vercel timing; the margin is
the point.)

**First degradation point.** Not latency — invocation economics on
`/api/search`. Distinct `?q=` values each miss the edge cache, so
sustained cache-busting search traffic above ~100k origin
invocations/month would exhaust the Hobby invocation budget and
the API would start returning platform errors. The static site —
the actual product — is unaffected, which is the honest-failure
design working as intended. Second, further out: `allModels()`
walks every model file on a cold container; at ~10× the dataset
(~4 MB) the cold parse is still under ~1 s, so this only matters
after the search-invocation ceiling.

**Pattern alignment.**

- *Static-first:* ✓ frontend never requires the API; it reads the
  same JSON statically.
- *SWR caching:* ✓ API responses (`s-maxage=300, SWR 86400`, set in
  `lib/data.js`); **fixed in wave 3** — `vercel.json` now gives the
  static layer the same policy: `/data/(.*)` gets
  `max-age=0, s-maxage=300, stale-while-revalidate=86400` and
  `/assets/(.*)` a long cache with SWR.
- *Precomputed JSON:* ✓ `search-index.json` is generated by
  `scripts/build.py` at build time; no request-time index building.
- *Request coalescing / dedupe:* ✓ dataset JSON is parsed once per
  warm container (`lib/data.js` cache); **fixed in wave 3** —
  `allModels()` is now memoized per container instead of re-walking
  40 files on every search/health invocation.
- *Honest failure fallbacks:* ✓ API errors are explicit envelopes
  (400 for missing params, 404 "not in the atlas yet"); the frontend
  renders fully without the API and shows a plain-language error
  note if its static fetch fails. No fabricated data anywhere.
- *Health surfacing:* ✓ `/api/health` is this site's Live-Wire-style
  surface — it computes real makes/models/generations/clubs counts
  from the dataset on every call, and **as of wave 3 also returns
  `datasetUpdatedAt`** so a stale deploy is visible at a glance.

**Hardcoded-value fix (wave 3).** `lib/data.js` carried a literal
`datasetUpdatedAt: "2026-10-12"` in every API response — the same
class of bug as wave 2's hardcoded clubs stat. It is now derived
from `makes.json`'s `updatedAt` at response time and cannot drift
again. A sweep for sibling literals across HTML/JS found none:
homepage stats are all read from the data at runtime.

**Billing/throttle risks found:** none outstanding. No paid
services, no unbounded endpoints besides the search-query cache
note above, no function anywhere near its duration ceiling, and
the total dataset would need to grow ~25× before bandwidth became
a conversation.

## Wave-4 addendum (2026-10-13)

- **Price Watch stage 1** is a static file (`data/v1/price-watch.json`,
  7 certified auction results): no function added (still 5), no
  cron, no external call. The audit above is unchanged.
- **Wave-7 addendum (2026-10-13):** Price Watch stage 2 extended the
  same static file to 19 certified results (waves 5 and 7 added 4 +
  8). Still no function, no cron, no external call — the audit
  above is unchanged.
- **Wave-8 addendum (2026-10-13):** Price Watch stage 3 extended the
  same static file to 28 certified results (wave 8 added 9). Still
  no function, no cron, no external call — the audit above is
  unchanged.
- **Wave-9 addendum (2026-10-13):** Price Watch stage 4 extended the
  same static file to 37 certified results (wave 9 added 9). Still
  no function, no cron, no external call — the audit above is
  unchanged.
- **Photography:** 49 sourced photos (~13 MB) now live under
  `assets/photos/`, plus `assets/og-card.png`. They are lazy-loaded
  (`loading="lazy"`), served under the existing `/assets/*` SWR
  cache policy, and only fetched by pages that render them — the
  invocation model is untouched; bandwidth per full model-page view
  grows by one hero image (~120–470 KB) plus any detail shots.
- `GO_LIVE.md` now carries the deploy rulebook (QA-004), including
  the deploy-time absolutizing checklist for the relative
  `og:image` / canonical / JSON-LD URLs shipped this wave.
- **Wave-10 addendum (2026-10-13):** Price Watch stage 5 extended the
  same static file to 46 certified results (wave 10 added 9), gave
  every record a chassis key (34/46 populated) plus condition (4/46)
  and mileage (1/46) fields populated only where a source states
  them, and linked seven earlier records to existing model pages
  (linked 7 → 21 of 46; orphans 30/37 → 25/46). Still no function,
  no cron, no external call — the audit above is unchanged.
- **Wave-11 addendum (2026-10-13):** Price Watch stage 6 extended
  the same static file to 56 certified results (wave 11 added 10;
  linked 21 → 29 of 56, orphans 25/46 → 27/56, share 54% → 48%;
  condition 4/46 → 11/56, mileage 1/46 → 7/56, chassis 34/46 →
  44/56), and the Buy page gained the T-CARS-1 first rung (cohort
  ranges from certified records only, computed client-side from
  the same static file). `BENCHMARK.md` added: the standing
  scorecard against the top car sites, with T-CARS-1 / T-CARS-5
  re-argued and priced there. Still no function, no cron, no
  external call — the audit above is unchanged.
- **Rotation-25 addendum (2026-10-14):** Price Watch stage 7
  extended the same static file to 66 certified results (10 added,
  all linked to model records; linked 29 → 39 of 66, orphans
  unchanged at 27, share 48% → 41%; condition 11/56 → 13/66,
  mileage 7/56 → 12/66, chassis 44/56 → 49/66), and shipped the
  T-CARS-1 cohort machinery: cohorts computed in `scripts/build.py`
  into `data/v1/cohorts.json` (9 cohorts at n≥2; the F40/EUR cohort
  reached the n≥8 trigger and publishes its median). Still no
  function, no cron, no external call — the audit above is
  unchanged.
- **Rotation-26 addendum (2026-10-14):** Price Watch stage 8
  extended the same static file to 83 certified results (17 added,
  all linked to model records; linked 39 → 56 of 83, orphans
  unchanged at 27, share 41% → 33%; condition 13/66 → 16/83,
  mileage 12/66 → 17/83, chassis 49/66 → 61/83), and the Ford GT
  dollar cohort reached the n≥8 trigger as the second benchmark
  cohort (10 cohorts at n≥2 in `data/v1/cohorts.json`). Still no
  function, no cron, no external call — the audit above is
  unchanged.
- **Rotation-27 addendum (2026-10-14):** Price Watch stage 9
  extended the same static file to 96 certified results (13 added,
  all linked to model records; linked 56 → 69 of 96, orphans
  unchanged at 27, share 33% → 28%; condition 16/83 → 19/96,
  mileage 17/83 → 21/96, chassis 61/83 → 72/96), and the Corvette
  dollar cohort (n=10) and Model J dollar cohort (n=9) reached
  the n≥8 trigger as the third and fourth benchmark cohorts (10
  cohorts at n≥2 in `data/v1/cohorts.json`). Still no function,
  no cron, no external call — the audit above is unchanged.

- **Rotation-23 addendum (2026-10-14):** photography completed
  (257/257 models, 59/59 makes photographed from licensed Commons
  sources, per-photo credit + file-page URL in the dataset for the
  217 rotation-23 photos; ~69 MB under `assets/photos/`, still
  lazy-loaded under the existing `/assets/*` SWR policy, so the
  invocation model above is unchanged). A second self-hosted font
  (Newsreader, OFL variable, normal + italic) joins Inter under
  `assets/fonts/` with provenance in `assets/fonts/FONTS.md`; it is
  not preloaded. Function count still 5; `vercel.json` unchanged;
  no cron; no external call at runtime (fonts and photos are
  same-origin static files).

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
- **Rotation-28 addendum (2026-10-14):** Price Watch stage 10
  extended the same static file to 107 certified results (11 added,
  all linked to model records; linked 69 → 80 of 107, orphans
  unchanged at 27, share 28% → 25%; condition 19/96 → 25/107,
  mileage 21/96 → 27/107, chassis 72/96 → 81/107), and the DB5
  dollar cohort (n=8), Miura dollar cohort (n=8) and Miura euro
  cohort (n=8) reached the n≥8 trigger as the fifth, sixth and
  seventh benchmark cohorts (10 cohorts at n≥2 in
  `data/v1/cohorts.json`). Still no function, no cron, no external
  call — the audit above is unchanged.
- **Rotation-29 addendum (2026-10-14):** Price Watch stage 11
  extended the same static file to 119 certified results (12 added,
  all linked to model records; linked 80 → 92 of 119, orphans
  unchanged at 27, share 25% → 23%; condition 25/107 → 30/119,
  mileage 27/107 → 33/119, chassis 81/107 → 90/119), and the F40
  dollar cohort (n=8) and DB5 euro cohort (n=8) reached the n≥8
  trigger as the eighth and ninth benchmark cohorts (10 cohorts at
  n≥2 in `data/v1/cohorts.json`; DB5 dollar median re-derived at
  $1,100,000 over n=9). Still no function, no cron, no external
  call — the audit above is unchanged.

- **Rotation-30 stage-3 addendum (2026-10-14, S5 residue):** the
  home cover source link grows to a 44px+ target at phone widths
  inside the ≤700px block (.cover-src a, invisible growth); the
  sub-44 residue stands at 9 per phone width (cert-line Buy page
  prose links ×5, caption File page credit links ×4), named and
  left with measured arguments in landing-cars-r30-residue.md. Do
  not grow the two prose classes without re-arguing their
  neighbours; any new prose-embedded link class gets the same
  measure-and-argue treatment.

- **Rotation-30 stage-2 addendum (2026-10-14, VP-0041):** one nav
  vocabulary on every page (The Atlas / Price Watch / The Journal /
  Buy / Clubs, plus the header search reaching a model page by
  name); the Buy page takes a car choice itself (Pick the car) and
  lands on that car's buying channels; footers map all five real
  sections; breadcrumbs unchanged. If any template's header or
  footer is edited, keep the label set, order and destinations
  identical across all six templates (index, buy, clubs, make,
  model, 404) and keep the header search wired (app.js
  initNavSearch). Census retest and cold-read retest pass on the
  stage-2 tree; see landing-cars-r30-nav.md in the wave-engine
  records.

- **Rotation-30 addendum (2026-10-14):** Price Watch stage 12
  extended the same static file to 125 certified results (6 added,
  all linked to the McLaren F1 model record; linked 92 → 98 of
  125, orphans unchanged at 27, share 23% → 22%; condition
  30/119 → 32/125, mileage 33/119 → 36/125, chassis 90/119 →
  96/125), and the McLaren F1 dollar cohort (n=8) reached the
  n≥8 trigger as the tenth benchmark cohort (10 cohorts at n≥2
  in `data/v1/cohorts.json`, all of them benchmarks; F1 dollar
  median $14,685,000 over eight sales, 2006–2026). Still no
  function, no cron, no external call — the audit above is
  unchanged.
- **Rotation-31 addendum (2026-10-15):** Price Watch stage 13
  extended the same static file to 130 certified results (5 added,
  all linked to the Toyota 2000GT model record; linked 98 → 103 of
  130, orphans unchanged at 27; condition 32/125 → 33/130, mileage
  36/125 → 40/130, chassis 96/125 → 100/130). The 2000GT dollar
  cohort (n=6) stands as a range-only cohort below the n≥8 trigger;
  the ten benchmark cohorts are unchanged. The same rotation
  restored three name-level photographs on Commons licence-verified
  evidence (Cord Westchester sedan, plain McLaren 720S, badged
  Stutz Blackhawk), closing the restorations item open since
  rotation 29. Still no function, no cron, no external call.
- **Rotation-32 addendum (2026-10-15):** Price Watch stage 14
  extended the same static file to 133 certified results (3 added,
  all Toyota 2000GT dollar sales; linked 103 → 106 of 133, orphans
  unchanged at 27; condition 33/130 → 33/133, mileage 40/130 →
  41/133, chassis 100/130 → 102/133). The 2000GT dollar cohort
  (n=9) passed the n≥8 trigger and publishes its median
  ($880,000) as the eleventh benchmark cohort; no range-only
  cohort remains. Still no function, no cron, no external call.
- **Rotation-33 addendum (2026-10-15):** Price Watch stage 15
  extended the same static file to 136 certified results (3 added,
  all Mercedes-Benz 300 SL Gullwing dollar sales, linked to the
  SL model record; linked 106 → 109 of 136, orphans unchanged
  at 27; condition 33/133, mileage 41/133 → 44/136, chassis
  102/133 → 105/136). The SL dollar cohort (n=4) stands as a
  range cohort below the n≥8 trigger; the eleven benchmark
  cohorts are unchanged. Still no function, no cron, no
  external call.
- **Rotation-34 addendum (2026-10-15):** Price Watch stage 16
  extended the same static file to 140 certified results (4 added,
  all Mercedes-Benz 300 SL Gullwing dollar sales, linked to the
  SL model record; linked 109 → 113 of 140, orphans unchanged
  at 27; condition 33/136, mileage 44/136 → 48/140, chassis
  105/136 → 109/140). The SL dollar cohort (n=8) passed the
  n≥8 trigger and publishes its median ($1,723,750) as the
  twelfth benchmark cohort; no range-only cohort remains.
  Still no function, no cron, no external call.
- **Rotation-35 addendum (2026-10-15):** Price Watch stage 17
  extended the same static file to 143 certified results (3 added:
  a Ferrari F40, a Lamborghini Miura P400 S and a Mercedes-Benz
  300 SL Gullwing, each linked to its standing model record;
  linked 113 → 116 of 143, orphans unchanged at 27; condition
  33/140, mileage 48/140 → 51/143, chassis 109/140 → 112/143).
  The F40, Miura and 300 SL dollar cohorts deepen to n=9 each;
  the twelve benchmark cohorts stand. Still no function, no
  cron, no external call.
- **Rotation-36 addendum (2026-10-15):** Price Watch stage 18
  extended the same static file to 146 certified results (3 added:
  two Mercedes-Benz 300 SL Gullwings and a Lamborghini Miura
  P400 SV, each linked to its standing model record; linked
  116 → 119 of 146, orphans unchanged at 27; condition
  33/143 → 36/146, mileage 51/143 → 54/146, chassis
  112/143 → 115/146). The 300 SL dollar cohort deepens to
  n=11 and the Miura dollar cohort to n=10; the twelve
  benchmark cohorts stand. Still no function, no cron, no
  external call.
- **Rotation-37 addendum (2026-10-15):** Price Watch stage 19
  extended the same static file to 148 certified results (2 added:
  two Lamborghini Countach LP400 Periscopo sales at Gooding &
  Company's Pebble Beach auctions, 2014 and 2018, each linked to
  the standing Countach model record; linked 119 → 121 of 148,
  orphans unchanged at 27; mileage 54/146 → 56/148, chassis
  115/146 → 117/148, condition unchanged at 36). A new Countach
  dollar cohort opens at n=2, range only; the twelve benchmark
  cohorts stand. Still no function, no cron, no external call.
- **Rotation-38 addendum (2026-10-15):** Price Watch stage 20
  extended the same static file to 151 certified results (3 added:
  three Lamborghini Countach sales at Gooding & Company, Amelia
  Island 2018 and Pebble Beach 2021, each linked to the standing
  Countach model record; linked 121 → 124 of 151, orphans
  unchanged at 27; condition 36/148 → 39/151, mileage
  56/148 → 57/151, chassis 117/148 → 120/151). The Countach
  dollar cohort deepens from n=2 to n=5, range only; the twelve
  benchmark cohorts stand. Still no function, no cron, no
  external call.
- **Rotation-39 addendum (2026-10-15):** Price Watch stage 21
  extended the same static file to 154 certified results (3 added:
  two Lamborghini Countach sales at Gooding & Company, Pebble
  Beach 2012 and Amelia Island 2010, and one at RM Sotheby's
  Monterey 2022, each linked to the standing Countach model
  record; linked 124 → 127 of 154, orphans unchanged at 27;
  condition 39/151 → 40/154, mileage 57/151 → 59/154, chassis
  120/151 → 123/154). The Countach dollar cohort deepens from
  n=5 to n=8 and becomes the thirteenth benchmark cohort
  (median $690,000); no range-only cohort remains. Still no
  function, no cron, no external call.
- **Rotation-40 addendum (2026-10-15):** Price Watch stage 22
  extended the same static file to 157 certified results (3 added:
  three Ferrari Enzo sales, RM Sotheby's Monterey 2015, RM
  Sotheby's Paris 2016 and Gooding & Company Pebble Beach 2022,
  each linked to the standing Enzo model record; linked 127 → 130
  of 157, orphans unchanged at 27; condition 40/154 → 43/157,
  mileage 59/154 → 61/157, chassis 123/154 → 125/157). The Enzo
  cohorts open in euros and in dollars at n=2 each, ranges only;
  the thirteen benchmark cohorts stand. Still no function, no
  cron, no external call.
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

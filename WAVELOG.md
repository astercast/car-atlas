# WAVELOG — Car Atlas

## Wave 1 — Foundation (2026-10-12)

The founding wave. Repo created (`astercast/car-atlas`, private,
working track only) and a flagship first build shipped:

- **Encyclopedia seeded:** 20 makes, 92 models, 229 generations — the
  models that matter most, generations with flagship specs, collector
  notes where the market demands them. Schema validated by
  `scripts/build.py`.
- **Navigation & UI:** search-first homepage (single generated index,
  instant results, keyboard navigation), browse by make / era / body
  style, progressive disclosure on model pages, one accent color,
  editorial type, no clutter.
- **Buying layer:** buying classes per era, 13 curated channels with
  editorial notes, per-model channel routing on every model page,
  Price Watch schema + design published (no fake live data).
- **Clubs:** 22 real clubs/networks, filterable by region and marque.
- **API:** 5 serverless functions mirroring the static dataset;
  `vercel.json` prepared to fleet standard (explicit paths,
  `maxDuration: 10`, no `runtime` key) — not deployed.
- **Honesty infrastructure:** `COVERAGE.md` ledger (seeded vs planned),
  `LIVE_CHECKLIST.md`, screenshots in `screenshots/`.

### Next waves (planned)

- Wave 3: historic marques batch 1 (DeLorean, Duesenberg, Packard,
  Saab, Studebaker, Tucker, AMC, Pontiac, Oldsmobile, Plymouth).
- Wave 4: full generation depth for the 911, Corvette, Mustang, and
  Land Cruiser; Price Watch ingest stage 1 (auction results).

## Wave 2 — Breadth: ten living makes + clubs chapters begin (2026-10-12)

Executed the wave-1 roadmap's first item at flagship scale:

- **Encyclopedia:** 20 → **30 makes**, 92 → **139 models**,
  229 → **299 generations**. The ten roadmap makes (Lexus, Alfa
  Romeo, Aston Martin, Cadillac, Dodge, GMC, Kia, Lotus, Maserati,
  McLaren) arrive with 47 models in the house format — landmark
  generations, flagship specs, collector notes where the market
  demands them (LFA, McLaren F1, Charger, Viper, Elise, MC12…).
  Every spec is standard published data for the car in question,
  hedged with a range or omitted where figures vary by market —
  no invented numbers, per the house rule.
- **Clubs:** 22 → **28 entries**, and chapter-level data begins:
  two regional chapters with their own calendars (SCCA San
  Francisco Region, PCA Golden Gate Region) plus marque clubs for
  four of the new makes (AROC-USA, Cadillac & LaSalle Club,
  Lotus Ltd., Maserati Club UK). The registry's `regions` list is
  now derived from the entries themselves, so it can't drift.
- **Honesty fixes:** COVERAGE.md updated to the new counts and the
  seeded/planned split; clubs.json note now says chapters have
  begun rather than promising them later; the homepage "Clubs
  seeded" stat was hardcoded at 22 in `index.html` — it is now
  read from `clubs.json` at runtime like the other three stats,
  so it cannot go stale again.
- **Validation:** `scripts/build.py` passes (schema + regenerated
  search index). Screenshot script extended: desktop shots for a
  new make (Lexus) and model (LFA), clubs page, and mobile-viewport
  hero + model shots — zero console/page errors.

### Next waves (planned)

- Wave 3: historic marques batch 1 (DeLorean, Duesenberg, Packard,
  Saab, Studebaker, Tucker, AMC, Pontiac, Oldsmobile, Plymouth).
- Wave 4: full generation depth for the 911, Corvette, Mustang, and
  Land Cruiser; Price Watch ingest stage 1 (auction results).

## Wave 3 — Historic marques batch 1 + free-tier audit (2026-10-13)

The roadmap's historic batch, in exact house format, plus the
fleet-ordered free-tier / best-pattern audit:

- **Encyclopedia:** 30 → **40 makes**, 139 → **180 models**,
  299 → **354 generations**. The ten defunct marques (DeLorean,
  Duesenberg, Packard, Saab, Studebaker, Tucker, AMC, Pontiac,
  Oldsmobile, Plymouth) arrive with 41 models and 55 landmark
  generations — Model J and SJ, the Tucker 48, Rocket 88, the
  Hemi 'Cuda, Saab's turbo line from the 99 to the Turbo X.
  Specs are standard published figures, ranged where they vary by
  year/market; no fetches were needed or made (house format from
  established knowledge, per the fetch rule). Shaky candidates
  were cut rather than hedged — see the run report.
- **Clubs:** 28 → **35 entries**: marque clubs for seven of the
  new makes (ACD Club for Duesenberg, Packard Club, Saab Club of
  North America, Studebaker Drivers Club, DeLorean Owners
  Association, POCI, Oldsmobile Club of America).
- **Hardcoded-value sweep:** the API's `datasetUpdatedAt` was a
  literal string in `lib/data.js` — the last known sibling of the
  wave-2 clubs-stat bug. It is now derived from the dataset, and
  `/api/health` surfaces it. Full sweep found no other literals.
- **Audit (in `LIVE_CHECKLIST.md`):** 5 functions (cap 12);
  ~10k modelled invocations/month at a stated 10k-page-view
  assumption (≈10% of the Hobby budget, and the browsing site
  itself costs zero invocations); worst measured cold handler
  188 ms vs the 10 s ceiling; first degradation point is
  cache-busting `/api/search` traffic, which degrades the API
  only, never the static site. Fixes shipped: `allModels()`
  memoized per warm container, SWR cache headers extended to
  `/data/*` and `/assets/*` in `vercel.json`.
- **Validation:** `scripts/build.py` passes at the new counts;
  API smoke test across all 5 functions (12 cases incl. honest
  400/404s) against the new data; screenshot script extended
  (DeLorean make + DMC-12 model, desktop and mobile) — zero page
  errors beyond the known sandbox Google-Fonts tunnel artifact.

### Next waves (planned)

- Wave 4: full generation depth for the 911, Corvette, Mustang, and
  Land Cruiser; Price Watch ingest stage 1 (auction results).
- Historic marques batch 2 (from the COVERAGE list): Cord, Hudson,
  Nash, Kaiser, Stutz, and the British defuncts (Triumph, Austin-
  Healey, Jensen, TVR).

## Priority fix — VP-0003: model pages can no longer stall at the loader (2026-10-13)

Visitor Panel VP-0003 reproduced across three consecutive rounds at
HEAD `e433bf3`: model pages intermittently sat at "Loading the
record…" forever — round 3 counted **1 of 5 DOM loads completing**
(911 desktop ×3, 911 mobile, Tucker 48) while screenshot loads
completed 3/3. The data was never the problem (per-make files ~7 KB).

- **Root cause, pinned in the code:** `assets/js/app.js`'s
  `fetchJSON` was a bare `await fetch(path)` — no timeout, no abort,
  no deadline — feeding a `Promise.all` in `initModel`. A fetch that
  never settles never rejects, so the boot `.catch` (the page's only
  error path) could never fire; and `model.html`'s `#model-root`
  contained nothing but the loader text, so a hang painted an
  eternal spinner over a blank page. A no-timeout race, exactly as
  the ticket diagnosed.
- **Pattern adopted:** Fleet Commons **honest-fallback v1.0.0**
  (`~/workspace/fleet-commons/patterns/honest-fallback/` — harvested
  from Trend Machine's certified VP-0001 fix, wave 30 at `c687d5f`),
  adopted in its canonical shape, not re-invented: both canonical
  files copied verbatim (Commons verified the adoption
  byte-identical from its side) — `bake_fallback.py` →
  `scripts/bake_fallback.py`, `fetch_deadline.js` →
  `assets/js/fetch_deadline.js` (loaded by all five pages).
  - **Layer 1 — baked snapshot.** `scripts/build.py` now bakes the
    record's genuine static essentials (make/model names, intro,
    years, status, segment, body styles, generation count — from
    the same stored dataset) for all 180 models into `model.html`
    between `<!--FB:model-essentials-->` markers, wholesale and
    idempotent. `initModel` paints that snapshot synchronously,
    before any fetch, in the live renderer's own markup, stamped
    with the dataset's date and the words "static snapshot". A
    stalled load now reads as the car's own page from the first
    second.
  - **Layer 2 — fetch deadline + watchdog.** Every loader in the
    app now goes through `HonestFetch.getJSON` (canonical default
    12 s); the model page's three loaders carry an 8 s per-loader
    deadline (files are ~7 KB; a healthy local load is
    milliseconds), backed by the canonical 12 s `armWatchdog`. On
    deadline the load resolves into the baked snapshot with an
    honest "didn't finish loading" status and a **Retry the full
    record** button (or, for a model with no baked entry, an honest
    error with retry) — the terminal-state law: live content · a
    labeled baked snapshot · an honest error. Never a spinner
    without a deadline.
  - **Happy path unchanged:** on success the live renderer replaces
    the snapshot wholesale, exactly as the panel's screenshots
    showed.
- **Before / after, panel-style verification** (headless Chromium,
  cold loads, local server):
  - Before: 1/5 DOM loads completing at `e433bf3`, the rest eternal
    stalls (panel rounds 1–3).
  - After, normal reps — **10/10 full live renders** (Where to buy
    present, correct titles), zero page errors: 911 desktop ×3
    (2.3–3.0 s), 911 mobile ×2 (1.2–1.7 s), Tucker 48 desktop ×2
    (2.6–3.0 s) + mobile ×1 (2.4 s), Lexus LFA desktop ×2
    (2.3–2.5 s).
  - After, hang-injected reps (make-file fetch continued to a
    never-responding endpoint — a fetch that never settles) —
    **3/3 landed in the honest baked fallback** (911 desktop 13.1 s,
    911 mobile 12.5 s, Tucker 48 mobile 11.6 s — the 8 s deadline /
    12 s watchdog band), with the baked snapshot already painted at
    1 s in every rep, and the Retry button recovering to the full
    live record in 3/3 once the hang was removed.
  - **Zero eternal stalls across all 13 reps.**
- **Regression:** `scripts/build.py` passes (schema validation;
  40 makes / 180 models / 354 generations; index regenerated
  byte-identical; bake idempotent across repeat runs). API smoke
  12/12 across all 5 functions (incl. honest 400/404s; health
  reports the dataset's real counts and date). Screenshots harness
  completed all 13 shots — the only console errors are the known
  sandbox Google-Fonts tunnel artifact, no page errors.
- **Also this fix:** `llms.txt` authored at the repo root per the
  **llms-txt canonical contract (Commons round 7)**
  (`~/workspace/fleet-commons/patterns/llms-txt/`) — the site had
  none. H1 + blockquote summary in the atlas's editorial voice,
  sections of canonical markdown links to the real pages, records,
  data files, API notes, and docs, with an `## Optional` section.
  The Commons checker (`check_llms.py`) verdict: **PASS — 0 errors,
  0 warnings** (16/16 items canonical markdown-link, 16/16 targets
  exist on disk).

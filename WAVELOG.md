# WAVELOG — Car Atlas

## Wave 7 — Price Watch ingest stage 2: certified results 11 → 19 (2026-10-13)

**Headline (named before building):** Price Watch ingest stage 2 —
extend the certified-results set beyond the 11 stage-1 results using
the stage-1 standard exactly: real auction results only, each sourced
+ day-dated, status recorded honestly; a result whose sale day cannot
be pinned by sources is SKIPPED and recorded in the file (the SSJ
precedent), never approximated.

- **Price Watch stage 2:** **11 → 19 certified results**, each
  certified at ingest on 2026-10-13 against a published source naming
  car, price, house and day: the 1970 Porsche 917K, chassis 917-024
  ($14,080,000, Gooding & Company Pebble Beach, 2017-08-18); the 1955
  Jaguar D-Type, XKD 501 ($21,780,000 incl. premium, RM Sotheby's
  Monterey, Friday session 2016-08-19 — the day pinned by RM's own
  sale report); the 1956 Ferrari 290 MM, chassis 0626 ($28,050,000
  incl. premium, RM Sotheby's New York — Driven by Disruption,
  2015-12-10); the 1964 Ferrari 275 GTB/C Speciale, chassis 06701
  ($26,400,000 incl. premium, RM Auctions Monterey, day two
  2014-08-16); the 1962 Ferrari 250 GTO Berlinetta, chassis 3851 GT
  ($38,115,000 incl. premium, Bonhams Quail Lodge, 2014-08-15); the
  1967 Ferrari 275 GTB/4*S N.A.R.T. Spider, chassis 10709
  ($27,500,000 incl. premium, RM Auctions Monterey, Saturday
  2013-08-17); the 1954 Mercedes-Benz W 196 R, chassis 00006/54
  (£19,601,500 incl. premium — the file's first GBP record — Bonhams
  Goodwood Festival of Speed, Friday 2013-07-12); the 1957 Ferrari
  250 Testa Rossa Prototype, chassis 0666 TR ($16,390,000 incl.
  premium, Gooding & Company Pebble Beach, Saturday night
  2011-08-20). All eight carry `modelSlug: null` — the atlas has no
  model records for them, and none was invented; they link at make
  level, as the earlier GTO/DBR1 records do. Results stay ordered
  newest first and render on the Buy page (verified: 19 tiles).
- **Skipped, recorded in the file itself (2 new):** the 1939 Alfa
  Romeo 8C 2900B Lungo Spider ($19,800,000 incl. premium, RM
  Sotheby's Monterey) — car, price and house published, but the
  sources consulted date the sale only to the two-day event
  (19–20 August 2016), not to the session day; skipped rather than
  dated by inference (the SSJ precedent, applied exactly). And the
  first Shelby Cobra, CSX 2000 ($13,750,000 incl. premium, RM
  Sotheby's Monterey, 2016-08-19) — car, price, house and day all
  published, but the atlas carries no Shelby marque record and the
  car is not a Ford; skipped rather than misattributed.
- **What stage 2 is not:** the listings ingest + cron parked in
  earlier roadmaps is still not built — it still needs a deploy
  target and its own free-tier audit. Stage 2 here is results ingest
  only: still a static file, no function, no cron, no external call.
  The file's `stage` field, the Buy page heading, `buying.json`'s new
  `stage2` note, `API.md`, `GO_LIVE.md`, `LIVE_CHECKLIST.md` and
  `COVERAGE.md` all say so in the same words.
- **Secondary (icons): not taken.** The four roadmapped icons
  already hold full generation depth from wave 4; no honest delta
  was available there this wave, and none was manufactured.
- **Regression: VP-0003 holds.** Build passes (schema + counts +
  price-watch source check: "19 certified auction results";
  59 / 257 / 469 unchanged) and re-bakes idempotently; FB markers
  (BEGIN + END) intact in `model.html`; `fetch_deadline.js` on all
  five content pages; both canonical files byte-identical to Fleet
  Commons; llms checker **PASS — 0 errors, 0 warnings** (17/17
  targets). Spot checks (headless Chromium, ThreadingHTTPServer):
  the Buy page renders all 19 results with zero page errors
  (desktop + mobile screenshots refreshed); one cold load of the
  911 rendered the full live record (one `<h1>`, zero page errors);
  one hang-injected load (porsche make file never answering —
  server-side hang) painted the baked snapshot and settled in the
  honest terminal state — snapshot + "didn't finish loading" +
  Retry — at 11.1 s, inside the deadline/watchdog band.
- **Parked decisions (unchanged):** (1) a dedicated Ferrari 250 GTO
  model record — the photo and now three auction results (2018,
  2014, 2023) sit at make level until the owner calls it; (2) the
  listings-ingest form of Price Watch stage 2 — needs a deploy
  target and its own free-tier audit; (3) a sitemap — lands with
  GO_LIVE step 5.

### Next waves (planned)

- Living-makes breadth from the COVERAGE list (Bentley, Bugatti,
  Genesis, MINI, Mitsubishi, Rivian, Rolls-Royce, and the rest).
- Generation depth for the wave-2/3 models (the wave-4 icon
  treatment, extended).
- Remaining historic marques from the COVERAGE list (Marlin, MG
  pre-SAIC lineage, Morgan, Opel, Saturn, Vauxhall).
- Price Watch: further certified results to the same standard as
  sources allow; listings ingest only alongside a deploy decision.

## Wave 6 — Historic marques batch 3 + rotation-15 capture (2026-10-13)

**Headline (named before building):** the WAVELOG roadmap's
largest named batch — historic batch 3, all ten marques — at the
wave-3/5 scale. The living-makes list and generation depth remain
on the roadmap below.

- **Historic marques batch 3:** **49 → 59 makes, 216 → 257
  models, 421 → 469 generations.** The ten defunct marques from
  the COVERAGE list arrive with 41 models and 48 generations in
  house format: Austin (Seven, A30/A35, Mini, 1100/1300, Metro),
  Borgward (Hansa 1500, Isabella, Arabella, P100), De Tomaso
  (Vallelunga, Mangusta, Pantera, Longchamp, Guarà), Facel Vega
  (HK500, Excellence, Facellia, Facel II), Iso (Rivolta, Grifo,
  Fidia, Lele), NSU (Prinz, 1000/TT, Spider, Ro80), Panhard
  (Dyna X, Dyna Z, PL 17, 24), Simca (Aronde, Vedette, 1000,
  1100), Talbot-Lago (T150C-SS, T26, America), Willys (MB, CJ,
  Station Wagon/Pickup, Aero). Specs are the standard published
  flagship figures, ranged where they vary by year, market or
  engine fitted; nothing was fetched for specs and nothing was
  invented. No photographs are wired for the new makes — the
  Foundry library holds none for them, and a photo without
  provenance does not ship; the pages render complete without
  one, as the wave-5 pages did.
- **Clubs:** **43 → 46 entries**: Austin Seven Clubs'
  Association (`a7ca.org`), Borgward Drivers Club
  (`borgward.org.uk`) and Pantera Owners Club of America
  (`poca.com`). The first two domains were re-verified against
  published sources this pass. The other seven batch-3 marques
  take no new entry this wave: no further club domain was carried
  to the registry's standard, and an unverified address does not
  ship. (Willys practice routes through the Jeep-era clubs
  already listed in spirit; a dedicated entry waits for a
  verifiable house.)
- **Price Watch: untouched this wave** — still the 11 certified
  results of waves 4–5. No new result was certified, so none was
  added and no skip needed recording beyond the file's existing
  `skippedSources`. Stage 2 stays parked (below).
- **Capture duty (rotation 15):** the progress-archive set for
  this rotation is complete at
  `~/workspace/progress-archive/car-atlas/rotation-015/` — 22
  dated stills (hero, home, search, make, model, Buy, Clubs;
  desktop + mobile) plus a homepage search-interaction clip.
  Ticket sweep note: the ticket book was verified empty for Car
  Atlas at this rotation's start (QA-003 and QA-004 both stand
  closed in the fleet index — QA-003 was close-verified at
  round 4 against the rotation-001/012 sets); this set covers
  every baseline page type QA-003 named, in both viewports, so
  no remainder is outstanding under any reading of the ticket.
- **Honesty maintenance on touch:** `llms.txt` counts updated to
  the wave-6 record (59 / 257 / 469 / 46, including the stale
  clubs line in the Data section) and the Commons checker
  re-run: **PASS — 0 errors, 0 warnings** (17/17 targets exist).
  `COVERAGE.md` updated to the new counts, batch 3 moved from
  roadmap to seeded.
- **Commons adoption note:** honest-fallback (VP-0003) and the
  view-transitions quiet form are untouched this wave; both
  canonical files re-verified byte-identical to Fleet Commons,
  and the VT block re-checked in place (opacity only, 0.22 s
  out / 0.32 s in, inside the no-preference guard, cross-document
  only — no `startViewTransition` anywhere in the site JS).
- **Rule 1762 (line endings):** `.gitattributes` pin and binary
  carve-outs untouched; all binary blobs re-verified
  byte-identical (sizes + hashes) after staging, as routine.
- **Regression: 17/17 checks pass, zero page errors** — build
  (schema + counts) and idempotent re-bake; FB markers intact;
  `fetch_deadline.js` on all five content pages; static `<h1>`
  census clean (make/model render theirs from data — rendered
  census below); llms checker PASS 0/0; VT quiet-form in place;
  photo wiring unchanged (40 models / 40 makes, attribution rows
  intact, old records byte-identical to HEAD). API smoke across
  all 5 functions passes (health reports 59 / 257 / 469 / 46;
  Ro80 model record serves; Pantera search hits; honest 404
  intact). VP-0003 spot checks (headless Chromium, local server):
  one cold load of the 911 rendered the full live record (Where
  to buy, one `<h1>`, zero page errors); one hang-injected load
  (make-file fetch never answering) painted the baked snapshot
  inside 1.5 s and settled in the honest terminal state —
  snapshot + "didn't finish loading" + Retry — at 12.5 s, inside
  the deadline/watchdog band. New-content spot checks: Pantera,
  Ro80, Mini model pages and the Talbot-Lago make page all render
  live with exactly one `<h1>`; homepage stats read
  59 / 257 / 469 / 46; the Buy page still renders the Price
  Watch results. Screenshot harness extended (Austin make, Mini,
  Pantera, Ro80, Grifo, Willys desktop; Isabella mobile) — the
  only console noise is the known sandbox Google-Fonts tunnel
  artifact.
- **Parked decisions (unchanged):** (1) a dedicated Ferrari
  250 GTO model record — the photo and two auction results sit
  at make level until the owner calls it; (2) Price Watch
  stage 2 (listings ingest + a cron) — needs a deploy target
  and its own free-tier audit before it is built; (3) a
  sitemap — only meaningful with a domain; lands with GO_LIVE
  step 5.

### Next waves (planned)

- Living-makes breadth from the COVERAGE list (Bentley, Bugatti,
  Genesis, MINI, Mitsubishi, Rivian, Rolls-Royce, and the rest).
- Generation depth for the wave-2/3 models (the wave-4 icon
  treatment, extended).
- Remaining historic marques from the COVERAGE list (Marlin, MG
  pre-SAIC lineage, Morgan, Opel, Saturn, Vauxhall).
- Price Watch stage 2 design (listings ingest) — build only
  alongside a deploy decision.

## Wave 5 — Historic marques batch 2, Price Watch +4, view transitions adopted quiet (2026-10-13)

The wave-4 frontier's named next tier, at the wave-3/4 standard:

- **Historic marques batch 2:** **40 → 49 makes, 180 → 216
  models, 373 → 421 generations.** The nine defunct marques from
  the COVERAGE list arrive with 36 models and 48 generations in
  house format: Cord (L-29, 810/812), Hudson (Essex, Terraplane,
  Jet, Hornet), Nash (Ambassador, Rambler, Metropolitan,
  Nash-Healey), Kaiser (Special–Manhattan, Henry J, Darrin),
  Stutz (Bearcat, Vertical Eight), Triumph (TR2/3, TR4/5, TR6,
  TR7/8, Spitfire, Stag, Dolomite), Austin-Healey (100, 100-6,
  3000, Sprite), Jensen (541, C-V8, Interceptor, Jensen-Healey),
  TVR (Grantura, Griffith, Chimaera, Cerbera, Tuscan, Sagaris).
  Specs are the standard published flagship figures, ranged where
  they vary by year, market or engine fitted; nothing was fetched
  and nothing was invented. No photographs are wired for the new
  makes — the Foundry library holds none for them, and a photo
  without provenance does not ship; the make and model pages render
  complete without one, as the pre-wave-4 pages did.
- **Clubs:** **35 → 43 entries**: marque clubs for eight of the
  nine new makes (Hudson-Essex-Terraplane Club, Nash Car Club of
  America, Kaiser Frazer Owners Club International, The Stutz
  Club, TR Register, Austin Healey Club, Jensen Owners' Club,
  TVR Car Club). Cord takes no new entry — the Auburn Cord
  Duesenberg Club, already listed, is its club, and the registry
  note now says so. Three club domains were re-verified against
  published sources this pass; the Kaiser club's official site is
  recorded as `kfclubmembers.com`, per its own bulletin.
- **Price Watch stage 1, extended:** **7 → 11 certified
  results**, each with car, price, currency, price basis,
  house/event, sale date and a linked published source, certified
  at ingest on 2026-10-13: the 1954 Mercedes-Benz W 196 R
  Stromlinienwagen (€51,155,000 incl. premium, RM Sotheby's
  Stuttgart, 2025-02-01); the 1962 Ferrari 330 LM / 250 GTO
  ($51,705,000 incl. premium, RM Sotheby's New York, 2023-11-13);
  the 1957 Ferrari 335 Sport Scaglietti (€32,075,200 incl.
  premium, Artcurial Rétromobile Paris, 2016-02-05); the 1956
  Aston Martin DBR1 ($22,550,000 incl. premium, RM Sotheby's
  Monterey, Friday evening 2017-08-18). **Skipped, recorded in
  the file itself:** the 1935 Duesenberg SSJ ($22,000,000,
  Gooding & Company, Pebble Beach) — car, price and house are
  published, but the sources consulted date the sale only to the
  two-day event (24–25 August 2018), not to the day; skipped
  rather than dated by inference. Results are now ordered newest
  first. Stage 1 remains a static file — no function, no cron.
- **View Transitions — ADOPTED, in the quiet form.** Assessment
  for the gallery-minimal identity: the site's motion budget is
  deliberately near zero (one hover lift, smooth scroll) and its
  pages are sheets in a gallery — but a bare navigation flash is
  not stillness, it is a blink. The graduated Fleet Commons
  pattern (view-transitions v1.0.0) is therefore adopted for
  cross-document navigation only, shaped as a plain crossfade —
  opacity only, 0.22 s out / 0.32 s in, no travel, no settle —
  the quietest idiom in the fleet table (the 9th breathes, Aster
  fades on browser defaults, Film cuts). Everything sits inside
  `@media (prefers-reduced-motion: no-preference)` in
  `assets/css/style.css`; browsers without cross-document view
  transitions ignore the rule and navigate exactly as before.
  The pattern's same-document half is **not** adopted: in-page
  swaps here (instant search, club filters) are instant by
  design, and animating them would add motion where the identity
  calls for none. No `view-transition-name` pairings, per the
  canonical form's own caution.
- **Honesty maintenance on touch:** `llms.txt` counts updated to
  the wave-5 record (49 / 216 / 421 / 43) and the Commons
  checker re-run: **PASS — 0 errors, 0 warnings** (17/17 targets
  exist). A stale "40 files" comment in `lib/data.js` now says
  what the code does. `COVERAGE.md` updated to the new counts
  and the batch-2 makes moved from roadmap to seeded.
- **Commons adoption note:** the honest-fallback pattern
  (VP-0003) is untouched this wave and remains byte-identical
  canonical — see the regression check below.
- **Rule 1762 (line endings):** CRLF audit clean across all
  tracked text files; `.gitattributes` pin and binary carve-outs
  untouched, and all binary blobs re-verified byte-identical
  (sizes + hashes) after staging — the rotation-13 lesson,
  applied as routine.
- **VP-0003 regression check:** `FB:model-essentials` markers
  (BEGIN + END) intact in `model.html` after the build re-bake
  (216 models); `fetch_deadline.js` script tags present on all
  five content pages; both canonical files re-verified
  byte-identical to Fleet Commons; `build.py` re-bakes
  idempotently. Spot checks (headless Chromium, local server):
  one cold load of the 911 rendered the full live record (Where
  to buy, Price Watch result, one `<h1>`, zero page errors); one
  hang-injected load (make-file fetch never answering) painted
  the baked snapshot inside 1.5 s and settled in the honest
  terminal state — snapshot + "didn't finish loading" + Retry —
  inside the deadline/watchdog band. New-content spot checks:
  Cord 810/812, Hudson Hornet, Triumph TR6, Jensen Interceptor,
  TVR Sagaris and Austin-Healey 3000 model pages and the Cord and
  Ferrari make pages all render live with exactly one `<h1>`;
  the Buy page shows all four new Price Watch results; homepage
  stats read 49 / 216 / 421 / 43. **17/17 regression checks pass,
  zero page errors.**
- **Validation:** `scripts/build.py` passes (schema + counts +
  price-watch source check) at 49 makes / 216 models / 421
  generations; API smoke across all 5 functions passes (health
  reports the new counts; makes/model/search/clubs serve the new
  marques; honest 400/404s intact). Screenshot harness extended
  (Cord make, 810/812, TR6, Interceptor desktop; Hornet mobile).
- **Parked decisions (unchanged):** (1) a dedicated Ferrari
  250 GTO model record — the photo and two auction results (the
  2018 250 GTO and this wave's 330 LM / 250 GTO, both
  `modelSlug: null`) sit at make level until the owner calls it;
  (2) Price Watch stage 2 (listings ingest + a cron) — needs a
  deploy target and its own free-tier audit before it is built;
  (3) a sitemap — only meaningful with a domain; lands with
  GO_LIVE step 5.

### Next waves (planned)

- Living-makes breadth from the COVERAGE list (Bentley, Bugatti,
  Genesis, MINI, Mitsubishi, Rivian, Rolls-Royce, and the rest).
- Historic batch 3 (from the COVERAGE list): Austin, Borgward,
  De Tomaso, Facel Vega, Iso, NSU, Panhard, Simca, Talbot-Lago,
  Willys.
- Generation depth for the wave-2/3 models (the wave-4 icon
  treatment, extended).
- Price Watch stage 2 design (listings ingest) — build only
  alongside a deploy decision.

## Wave 4 — Icon depth, Price Watch stage 1, placement pass, GO_LIVE (2026-10-13)

The wave-1 roadmap's two named items, plus the fleet placement pass
and ticket QA-004:

- **Icon generation depth:** the four icons go from landmark-only
  (3 generations each) to full depth — **354 → 373 generations**
  (models and makes unchanged: 180 / 40). Porsche 911: 3 → 8
  (901 original, G-Series, 964, 993, 996, 997, 991, 992). Corvette:
  3 → 8 (C1–C8 complete). Mustang: 3 → 7 (Mustang II, SN-95, S197,
  S550 join Gen 1, Fox, S650). Land Cruiser: 3 → 8 (60, 70, 100,
  200, and 250 Series join the 40, 80, and 300). Specs are the
  standard published flagship figures in house format, ranged where
  they vary; the Mustang II's 122 hp is printed as proudly as the
  GT500's 662 — the record is the record.
- **Price Watch ingest stage 1 — auction RESULTS:**
  `data/v1/price-watch.json` holds **7 certified results**, each
  with car, price, currency, price basis, house/event, sale date,
  and a linked published source, certified at ingest on 2026-10-13:
  the 1955 Mercedes-Benz 300 SLR Uhlenhaut Coupé (€135,000,000,
  RM Sotheby's, 2022-05-05, Mercedes-Benz Group announcement);
  the 1962 Ferrari 250 GTO ($48,405,000 incl. premium, RM Sotheby's
  Monterey, 2018-08-25); the 1995 McLaren F1 ($20,465,000, Gooding
  Pebble Beach, 2021-08-14); the 2022 Porsche 911 Sally Special
  ($3,600,000 hammer, RM Sotheby's Monterey, 2022-08-20, Porsche
  Newsroom); a 1963 Corvette split-window ($434,500, Mecum
  Kissimmee, 2023-01-13); a 1967 Shelby GT500 ($295,000, Bring a
  Trailer, 2022-08-05); a 1980 FJ40 ($26,750, Bring a Trailer,
  2022-12-26). Results render on the Buy page and inside the
  matching model pages' Where-to-buy section. **Skipped, recorded
  in the file itself:** private transactions, pre-sale estimates,
  unsold lots, Cars & Bids / Hemmings lots (none certified to the
  car + price + house + date standard this pass), and aggregator
  summary statistics. Nothing was estimated. Stage 1 is a static
  file — no function, no cron (see `GO_LIVE.md`).
- **Placement pass (Foundry packet, hand-placed):** `og-card.png`
  copied to `assets/og-card.png`; the OG/Twitter block is on all
  six pages with per-page titles/descriptions mirrored from each
  page. There is no live domain, so `og:image` ships in the
  packet's marked **relative** form and the absolutize sweep is a
  named deploy step in `GO_LIVE.md`. **All 49 Foundry photos are
  wired**: copied to `assets/photos/`, carried in the dataset as
  `photo` / `photoCaption` / `photoCredit` (+ `photos[]` where a
  model has several) on **40 model records and all 40 make
  records**, and rendered on make/model pages with the honest
  caption and the CC attribution line on every page that shows the
  photo. One honest exception: the Ferrari 250 GTO photograph is
  wired at make level only — the atlas has no 250 GTO model record,
  and none was invented for the photo. Still open (packet's own
  labels): no clearly-licensed GR Supra exterior hero and no
  McLaren front road-car hero exist in the library; the Supra ships
  as A80 + interior + badge, the F1 as race-car rear + engine bay,
  labeled as such. `theme-color` (`#fafaf8`, the `--paper` token
  verbatim) on all pages; the file favicon set from the Foundry's
  icon proposal (accent disc `#e8320f` — the wordmark's period as
  the mark): `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`,
  `icon-192.png`, `icon-512.png`, replacing the placeholder data-URI
  bullet. `robots.txt` added (allow-all; no Sitemap line — no
  sitemap exists). Root-relative `rel="canonical"` on all six
  pages. The 404 page gains the meta description it was missing.
- **Honest JSON-LD:** the homepage carries a `WebSite` block (name
  + description only — no domain exists to claim). Model pages emit
  a `Car` object built only from real dataset fields (name, brand,
  intro as description, body styles, photo path); make pages emit
  `Brand`. No `Product`/`Offer` anywhere: Price Watch results are
  historical auction records, not offers, and no price is emitted
  as structured data.
- **QA-004 closed:** `GO_LIVE.md` authored — two-track rule,
  Standard builds, the `vercel.json` rules, data layout, the
  free-tier audit summary, Price Watch's static posture, and the
  deploy-time absolutizing checklist (OG/canonical/JSON-LD above).
- **Commons adoption note:** the honest-fallback pattern
  (VP-0003) is untouched this wave and remains byte-identical
  canonical — see the regression check below. New data keys
  (`photo*` / `photos`) were aligned on touch through
  `scripts/build.py`'s schema, which now also validates photo
  shape and price-watch sources.
- **Rule 1762 (line endings):** audit found no CRLF in any tracked
  text file (dataset already LF throughout); `.gitattributes` added
  pinning `* text eol=lf` so it stays that way — with explicit
  `binary` carve-outs for png/webp/ico/jpg. The carve-outs are
  load-bearing, not decoration: the bare pin applied git's CRLF
  conversion to the photo blobs on the first staging pass (blobs
  landed 3–17 bytes short); caught by a byte-exactness check
  before push, re-staged clean, all 71 binary blobs verified
  byte-identical to their files.
- **VP-0003 regression check:** baked `FB:model-essentials`
  markers (START + END) and the dataset script survive the
  `model.html` head edit; `fetch_deadline.js` script tags present
  on all five content pages; both canonical files re-verified
  byte-identical to Fleet Commons; `build.py` re-bakes
  idempotently (180 models). Spot check after the build: one cold
  load of the 911 rendered the full live record (title, Where to
  buy, photo, Price Watch result, Car JSON-LD, zero page errors);
  one hang-injected load (make-file fetch never answering) painted
  the baked snapshot within half a second and settled in the
  honest terminal state — snapshot + "didn't finish loading" +
  Retry — inside the deadline/watchdog band. No eternal stall.
- **Parked decisions:** (1) a dedicated Ferrari 250 GTO model
  record — the photo and the record auction result both sit at
  make level until the owner calls it; (2) Price Watch stage 2
  (listings ingest + a cron) — needs a deploy target and its own
  free-tier audit before it is built; (3) a sitemap — only
  meaningful with a domain; lands with GO_LIVE step 5.

### Next waves (planned)

- Historic marques batch 2 (from the COVERAGE list): Cord, Hudson,
  Nash, Kaiser, Stutz, and the British defuncts (Triumph,
  Austin-Healey, Jensen, TVR).
- Price Watch stage 2 design (listings ingest) — build only
  alongside a deploy decision.


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

# BENCHMARK — Car Atlas vs the top car sites in the world

Standing duty (owner order, 2026-10-13): Car Atlas competes with the
top car sites in the world. This file names that set, scores the
atlas against each rival on features, data depth and design, files
the gaps as T-CARS items, and carries the benchmark standing line
that every rotation report repeats from rotation 20 on.

**Method, stated honestly:** this is a desk assessment from
knowledge of the field, refreshed at rotation 20 (2026-10-13). No
live read of a rival was possible for every claim in this pass, and
no fetch that would need a sharing approval was attempted — gaps are
marked, not papered over. Rival scale figures are order-of-magnitude
field knowledge, not audited counts. Car Atlas figures are exact,
re-derived from `data/v1/` by `scripts/build.py` (59 makes, 257
models, 469 generations, 46 clubs, 56 certified auction results at
rotation 20).

## The top set (named)

By the jobs the atlas itself does — encyclopedia, buying/pricing
intelligence, auction results, clubs/local:

| Rival | Job it leads | Why it is in the set |
|---|---|---|
| Classic.com | Pricing intelligence + results aggregation | Aggregates listings and auction results across houses into per-model market pages, with its own benchmark value (CMB), price history, saved/followed markets. The closest single rival to Price Watch's ambition. |
| Hagerty | Valuation + collector intelligence | Condition-tier price guide (its #1–#4 condition scale is the industry shorthand), valuation tools, deep editorial and market commentary, insurance attached. |
| Bring a Trailer | Enthusiast auctions + results archive | Live auctions whose every result is public; the results archive is the modern-classic market's memory, with per-model pages, comments and alerts. |
| Cars & Bids | Modern enthusiast auctions | The 1980s-and-newer counterpart to BaT: curated live auctions, public results, watch/alert features. |
| CarGurus | Mainstream used-car pricing intelligence | Millions of live listings, each scored against market value (its deal ratings), plus finance and dealer tooling. The scale benchmark for "what should this cost today". |
| Hemmings | Classic classifieds + hobby hub | The American classic hobby's classified bible since 1954, with editorial, events and club reach. |
| Wikipedia | Encyclopedia depth | The breadth benchmark for "every car ever made": effectively unlimited marques, models and production history, community-maintained. |

## Scorecard (rotation 20)

Verdicts are Atlas vs that rival on that axis: AHEAD / PARITY /
BEHIND. Design is assessed honestly — the atlas's gallery-minimal
register is the fleet's reference register, so design is not the
expected gap; depth and live intelligence are.

| Rival | Features | Data depth | Design | The named delta |
|---|---|---|---|---|
| Classic.com | BEHIND — no live listings, no per-model price history or chart, no follow (T-CARS-5); atlas ahead only on having encyclopedia + clubs in the same product | BEHIND by orders of magnitude — millions of aggregated listings/results vs 56 certified results; atlas ahead per-record: every result carries house, day and a linked source, nothing aggregated anonymously | AHEAD — atlas is calmer and clearer per screen; Classic.com is denser, and its density serves working buyers | T-CARS-1 (benchmark value per model), T-CARS-5 (follow) |
| Hagerty | BEHIND — no valuation tool, no condition tiers, no insurance or daily market editorial | BEHIND — decades of condition-graded price-guide data vs 56 results and source-stated condition on 11/56 | PARITY — Hagerty is polished editorial product; the atlas is quieter, Hagerty puts more product depth on a page | T-CARS-1 (a condition-graded cohort is exactly Hagerty's home ground), T-CARS-2 (condition population: 11/56) |
| Bring a Trailer | BEHIND — no live auctions, no bidding, no comments, no alerts; atlas does not sell and will not fake a marketplace | BEHIND — a six-figure public results archive vs 56 certified results; atlas links 29/56 results to model records, BaT's archive is searchable at a scale the atlas cannot yet match | AHEAD — atlas presents a result as a record in an encyclopedia; BaT's pages are built for live bidding urgency | T-CARS-3 (orphan share 27/56), results scale itself |
| Cars & Bids | BEHIND — same live-auction and alert machinery the atlas lacks | BEHIND — full modern-enthusiast results history vs 56; atlas covers eras (1930–2025) no single auction house spans in one set | AHEAD on calm, PARITY on polish | T-CARS-5, results scale |
| CarGurus | BEHIND — no live mainstream listings, no deal rating, no finance path | BEHIND for mainstream cars (atlas holds zero live listings); AHEAD for collector/encyclopedia coverage — CarGurus does not carry a Tucker 48 record with generations and clubs attached | PARITY — CarGurus is efficient marketplace design; the atlas is the better reading experience, CarGurus the better transaction funnel | Live listings ingest — parked behind the deploy decision, not a data problem alone |
| Hemmings | BEHIND — classifieds volume, events and classified search dwarf the atlas's 13 curated channels and 46 clubs | BEHIND on listings; PARITY-to-AHEAD on curated clubs: the atlas registry is structured (region + marque filters, chapter models), Hemmings' reach is far wider | AHEAD — atlas is the modern, minimal register; Hemmings carries decades of classified-site accretion | Clubs chapter depth (COVERAGE roadmap), listings scale |
| Wikipedia | MIXED — BEHIND on breadth and production-history detail; AHEAD on structure: one schema, flagship specs per generation, instant search, an API, buying routing and clubs in one product | BEHIND — 59 makes / 257 models / 469 generations against effectively everything; the atlas's honest COVERAGE ledger is the plan against it, wave by wave | AHEAD — the atlas is a designed product; Wikipedia is a document | Encyclopedia breadth — the standing wave programme (living makes, historic batches, generation depth) |

## Deltas closed in-rotation (rotation 20)

- **Price Watch stage 6 (results scale, all rivals):** 46 → **56
  certified results**, same stage-1 standard. Eight of the ten new
  records link to model pages; two sit at make level honestly
  (Jaguar XKSS, Ferrari 250 GT SWB Berlinetta — no model records
  exist for them, none invented).
- **T-CARS-2 (condition/mileage population):** condition 4/46 →
  **11/56**, mileage 1/46 → **7/56**, chassis keys 34/46 → **44/56**
  — populated only where the certifying source states the field.
- **T-CARS-3 (orphans):** linked records 21 → **29**; orphan count
  25 → 27 (two new make-level records), orphan **share 54% → 48%**.
- **T-CARS-1, first rung:** the Buy page now computes **cohort
  ranges** from certified records only — model + single currency,
  n ≥ 2, count shown, range labelled "context, not a valuation".
  Seven cohorts qualify at 56 records. This is a rung, not the
  benchmark: no median, no condition tier, no per-model value is
  claimed.

## Deltas in rotation 22 (identity pass)

- **Composition (CAR-ATLAS-STUDY §5):** home rebuilt as an
  issue (masthead + folio line, one cover car with its price as
  the display numeral, contents as department doors, four
  distinct compositions; the stat band is gone). One five-field
  listing anatomy now prints on every rail and market page, and
  the model page is a record with a ruled, dated price ledger.
  Full record: `landing-car-atlas-r22.md` in the wave-engine
  folder.
- **T-CARS-2: CLOSED on the record surface.** The record page
  prints certified condition and mileage per record, with the
  figure's source, at the honest stage-6 counts (condition
  11/56, mileage 7/56, chassis 44/56, printed on the page as the
  certification counts). Unstated fields print as "unrecorded",
  never omitted and never inferred.
- **T-CARS-5: rung 1 SHIPPED (local follow).** Models can be
  followed from their records (localStorage); followed models
  and their newest certified results surface first on the Buy
  page, labelled as browser-only and notifying nobody. Rung 2
  (true notify) remains deploy-gated, as priced below.
- **T-CARS-3: ADVANCED.** Model records carry their full result
  archives as the ledger; marque pages now carry every certified
  result for the marque, so no result is orphaned from its
  marque's page. The 27 make-level records still have no model
  record to attach to (the 250 GTO record remains the owner's
  parked call), and no-sale / "bid to" lots remain absent by the
  certification standard: 56/56 records are sold results.
- **T-CARS-1: ADVANCED, not closed.** The cohort-range machinery
  now prints on the model record itself (per currency, n shown),
  joining the Buy page rung. The benchmark value itself remains
  refused at cohort n≤2, per the priced closure below.

## Deltas in rotation 23 (the issue, art-directed)

- **Photography, completed as a census (all rivals):** the photo
  programme the rotation-22 record named as follow-on debt is
  closed on the model census: **models photographed 40 → 257 of
  257**, makes **40 → 59 of 59**, every photograph a real car from
  Wikimedia Commons under a free licence (CC BY / CC BY-SA / CC0 /
  public domain), each carrying its caption, photographer, licence
  and (for the 217 rotation-23 photos) its Commons file-page URL in
  the dataset. No generated imagery; no unclear rights. Certified
  results resolving to a photographed model **17 → 29 of 56**; the
  27 make-level records carry no model photo because no model
  record exists for their cars, and none was attached by guess.
- **Cover discipline (design vs the whole set):** the cover photo
  is now chosen and cropped to a cover standard (one car, still,
  no crowd intrusion): the 1964 Goodwood still of the 250 GTO
  replaces the paddock snapshot, cropped 4/3 in the plate rule.
- **Type (design):** the editorial two-voice system the benchmark
  set runs: the masthead grotesk (Inter) stays as the instrument;
  a self-hosted serif (Newsreader) now sets record and lot titles,
  standfirsts and prose, so entries read as lots and notes, not UI
  rows. Price Watch records take auction-catalogue furniture:
  ruled lots under a double rule, lot numbers from the certified
  set's own order (newest first), stable on every surface.
- **Data depth: unchanged by design.** This was a presentation and
  photography pass; the certified set stands at 56 (condition
  11/56, mileage 7/56, chassis 44/56, re-verified from data), and
  T-CARS-1's priced closure is unmet on the same evidence as
  rotation 22 (largest cohort still n=2).

## Deltas in rotation 25 (rung-2 advance, stage 7)

- **Price Watch stage 7 (results scale):** 56 → **66 certified
  results**, same stage-1 standard (house, day and a linked source
  per record; one candidate skipped and recorded in the file — an
  Artcurial 2020 F40 whose sources disagree on the final price).
  All ten new records link to model pages the atlas already
  carried. Condition **11/56 → 13/66**, mileage **7/56 → 12/66**,
  chassis **44/56 → 49/66**, populated only where the certifying
  source states the field.
- **T-CARS-1: the machinery rung FIRED and SHIPPED.** Six of the
  ten new records are Ferrari F40 sales in euros (Paris 2014,
  2015, 2016, 2018; Zoute 2021; Paris 2023), taking the F40/EUR
  cohort from n=2 to **n=8 in one currency — the priced trigger**.
  Cohorts are now computed in `scripts/build.py` from certified
  records only and published in `data/v1/cohorts.json` (9 cohorts
  at n≥2); the F40/EUR cohort prints its median — **€1,508,000**
  over its eight certified sales, 2014–2023 — on the Buy page and
  the F40 record, n shown, in the one listing anatomy. Every other
  cohort remains a range, as before. This is the machinery rung,
  not the full closure: the benchmark set still runs cohorts at a
  scale (and with condition tiers) this atlas does not have.
- **T-CARS-4: first genuine repeat.** Stage 7 certified the 2021
  Gooding sale of Miura P400 chassis 3378 ($1,902,500, 13 Aug
  2021) alongside its 2023 sale already in the set ($2,260,000) —
  the first chassis to appear twice; the record ledger's
  repeat-sale machinery now has a real repeat to print.
- **T-CARS-3: audited, unmoved in count, moved in share.** All 27
  orphans were re-audited against the model inventory: **zero**
  can be linked without inventing a model record — the 27 are 16
  Ferraris (250 GTO ×2 and 330 LM/250 GTO, 250 GT SWB Berlinetta,
  412P, 410 Sport Spider, 335 Sport, 290 MM, two 250 GT SWB
  California Spiders, 250 LM, 275 GTB/C Speciale, 275 GTB/4*S
  N.A.R.T. Spider, 340/375 MM, 625 TRC, 250 Testa Rossa
  Prototype), 3 Mercedes-Benz (W 196 R ×2, 300 SLR Uhlenhaut
  Coupé), 3 Jaguars (XKSS, D-Type, C-Type), 2 Aston Martins
  (DP215, DBR1), 2 Porsches (917K, 956) and 1 Alfa Romeo
  (8C 2900B) — none of which the atlas carries as a model, and
  the 250 GTO record stays the owner's parked call. Orphan count
  27 → 27; orphan **share 48% → 41%** on the larger set; linked
  records **29 → 39**.
- **Stated, not advanced:** T-CARS-5 rung 2 (true notify) stays
  deploy-gated — no live target exists and the deploy decision is
  parked with the owner; rung 1 (local follow) stands shipped.
  The Ferrari 250 GTO model record stays an owner call, not
  created. The Price Watch listings-ingest/cron question stays
  parked.

## Deltas in rotation 26 (stage 8)

- **Price Watch stage 8 (results scale):** 66 → **83 certified
  results**, same stage-1 standard (house, day and a linked source
  per record; two candidates skipped and recorded in the file — a
  GT40 whose sources disagree on the sale day, and a GT40 whose
  sources disagree on the final price, the Artcurial precedent).
  The pass re-broadened the four cohorts that stood at n=2, per
  the rotation-25 redirect: Corvette **2 → 7** in dollars, Ford GT
  **2 → 8** in dollars, Duesenberg Model J **2 → 5** in dollars,
  Aston Martin DB5 **2 → 3** in dollars with its euro cohort
  reaching **2**. All 17 new records link to model pages the atlas
  already carried. Condition **13/66 → 16/83**, mileage
  **12/66 → 17/83**, chassis **49/66 → 61/83**, populated only
  where the certifying source states the field.
- **T-CARS-1: the second benchmark cohort.** The six new Ford GT
  sales in dollars took the Ford GT/USD cohort to **n=8 — the
  priced trigger** — so the build-computed machinery now publishes
  two benchmark medians in `data/v1/cohorts.json` (10 cohorts at
  n≥2): Ferrari F40/EUR **€1,508,000** (unchanged) and Ford
  GT/USD **$7,020,000** over its eight certified sales
  (2012–2025), printed on the Buy page and the Ford GT record,
  n shown, in the one listing anatomy.
- **T-CARS-3: audited, unmoved in count, moved in share.** All 27
  orphans were re-audited against the model inventory: **zero**
  can be linked without inventing a model record or misattributing
  a car to a different model — the stage-8 audit names the traps
  by name (the 1957 250 Testa Rossa Prototype against the atlas's
  1984-on Testarossa record; the 300 SLR Uhlenhaut Coupé against
  the 300 SL road-car record; Jaguar's D-Type and C-Type against
  the E-Type/F-Type token match), each refused. Orphan count
  27 → 27; orphan **share 41% → 33%** on the larger set; linked
  records **39 → 56**.
- **Stated, not advanced:** T-CARS-5 rung 2 (true notify) stays
  deploy-gated — no live target exists and the deploy decision is
  parked with the owner; rung 1 (local follow) stands shipped.
  The Ferrari 250 GTO model record stays an owner call, not
  created. No feed or data was licensed; the licensed-feed path
  stays an owner call. The Price Watch listings-ingest/cron
  question stays parked.

## Deltas in rotation 27 (stage 9)

- **Price Watch stage 9 (results scale):** 83 → **96 certified
  results**, same stage-1 standard (house, day and a linked source
  per record; three candidates skipped and recorded in the file —
  three 1967 Corvette L88 sales whose sources disagree on the
  final price, the Artcurial F40 precedent). The pass worked the
  near-threshold cohorts named at rotation 26: Corvette **7 → 10**
  in dollars, Duesenberg Model J **5 → 9** in dollars, Aston
  Martin DB5 **3 → 5** in dollars and **2 → 3** in euros,
  Lamborghini Miura **3 → 5** in dollars and **2 → 3** in euros.
  All 13 new records link to model pages the atlas already
  carried. Condition **16/83 → 19/96**, mileage **17/83 → 21/96**,
  chassis **61/83 → 72/96**, populated only where the certifying
  source states the field.
- **T-CARS-1: the third and fourth benchmark cohorts.** The
  Corvette/USD cohort reached **n=10** and the Model J/USD cohort
  **n=9**, both past the priced n≥8 trigger, so the build-computed
  machinery now publishes four benchmark medians in
  `data/v1/cohorts.json` (10 cohorts at n≥2): Ferrari F40/EUR
  **€1,508,000** and Ford GT/USD **$7,020,000** (unchanged),
  Corvette/USD **$454,750** over ten certified sales (2013–2023)
  and Model J/USD **$1,655,000** over nine certified sales
  (2011–2023), printed on the Buy page and the model records,
  n shown, in the one listing anatomy.
- **T-CARS-3: audited, unmoved in count, moved in share.** All 27
  orphans were re-audited against the model inventory: **zero**
  can be linked without inventing a model record or misattributing
  a car to a different model — the same named traps as stage 8
  were re-checked and refused again. Orphan count 27 → 27; orphan
  **share 33% → 28%** on the larger set; linked records
  **56 → 69**.
- **Stated, not advanced:** T-CARS-5 rung 2 (true notify) stays
  deploy-gated — no live target exists and the deploy decision is
  parked with the owner; rung 1 (local follow) stands shipped.
  The Ferrari 250 GTO model record stays an owner call, not
  created. No feed or data was licensed; the licensed-feed path
  stays an owner call. The Price Watch listings-ingest/cron
  question stays parked.

## Deltas in rotation 28 (stage 10)

- **Price Watch stage 10 (results scale):** 96 → **107 certified
  results**, same stage-1 standard (house, day and a linked source
  per record; three candidates skipped and recorded in the file —
  a Miura SV whose sources disagree on the sale day, a Miura S
  whose sources disagree on the currency of the result, and a DB5
  held to the pass's own corroboration standard). The pass worked
  the cohorts that stood nearest the trigger: Aston Martin DB5
  **5 → 8** in dollars, Lamborghini Miura **5 → 8** in dollars and
  **3 → 8** in euros. All 11 new records link to model pages the
  atlas already carried. Condition **19/96 → 25/107**, mileage
  **21/96 → 27/107**, chassis **72/96 → 81/107**, populated only
  where the certifying source states the field.
- **T-CARS-1: the fifth, sixth and seventh benchmark cohorts.**
  The DB5/USD cohort reached **n=8**, the Miura/USD cohort
  **n=8** and the Miura/EUR cohort **n=8**, all past the priced
  n≥8 trigger, so the build-computed machinery now publishes
  seven benchmark medians in `data/v1/cohorts.json` (10 cohorts
  at n≥2): the four standing medians unchanged (F40/EUR
  €1,508,000, Ford GT/USD $7,020,000, Corvette/USD $454,750,
  Model J/USD $1,655,000), DB5/USD **$1,108,000** over eight
  certified sales (2013–2025), Miura/USD **$2,285,000** over
  eight certified sales (2015–2023) and Miura/EUR **€1,347,750**
  over eight certified sales (2014–2024), printed on the Buy page
  and the model records, n shown, in the one listing anatomy.
- **T-CARS-3: audited, unmoved in count, moved in share.** All 27
  orphans were re-audited against the model inventory: **zero**
  can be linked without inventing a model record or misattributing
  a car to a different model — the same named traps as stages 8
  and 9 were re-checked and refused again. Orphan count 27 → 27;
  orphan **share 28% → 25%** on the larger set; linked records
  **69 → 80**.
- **Stated, not advanced:** T-CARS-5 rung 2 (true notify) stays
  deploy-gated — no live target exists and the deploy decision is
  parked with the owner; rung 1 (local follow) stands shipped.
  The Ferrari 250 GTO model record stays an owner call, not
  created. No feed or data was licensed; the licensed-feed path
  stays an owner call. The Price Watch listings-ingest/cron
  question stays parked.

## Benchmark standing line (rotation 28)

**BENCHMARK STANDING — CLOSER on data depth, on evidence a
visitor can see: the certified-results set grew 96 → 107, every
new record linked to its model record (linked 69 → 80, orphan
share 28% → 25% with the orphan count honestly unmoved at 27),
and the atlas shipped its fifth, sixth and seventh true cohort
benchmarks — the DB5/USD, Miura/USD and Miura/EUR cohorts passed
the priced n≥8 trigger and print their build-computed medians,
$1,108,000, $2,285,000 and €1,347,750, each over eight certified
sales — while remaining BEHIND every named rival on live
listings, cohort scale and condition tiers (T-CARS-1's full
closure), off-site notify, and BEHIND Wikipedia on encyclopedia
breadth; design held at PARITY-or-AHEAD against the whole set.**

## Benchmark standing line (rotation 26)

**BENCHMARK STANDING — CLOSER on data depth, on evidence a
visitor can see: the certified-results set grew 66 → 83, every
new record linked to its model record (linked 39 → 56, orphan
share 41% → 33% with the orphan count honestly unmoved at 27),
the four thin cohorts named at rotation 25 all grew (Corvette
n=7, Model J n=5, DB5 n=3 in dollars and n=2 in euros), and the
atlas shipped its second true cohort benchmark — the Ford
GT/USD cohort reached the priced n≥8 trigger and prints its
build-computed median, $7,020,000 over eight certified sales —
while remaining BEHIND every named rival on live listings,
cohort scale and condition tiers (T-CARS-1's full closure),
off-site notify, and BEHIND Wikipedia on encyclopedia breadth;
design held at PARITY-or-AHEAD against the whole set.**

## Benchmark standing line (rotation 25)

**BENCHMARK STANDING — CLOSER on data depth, on evidence a
visitor can see: the certified-results set grew 56 → 66, every
new record linked to its model record (linked 29 → 39, orphan
share 48% → 41% with the orphan count honestly unmoved at 27),
and the atlas shipped its first true cohort benchmark — the
F40/EUR cohort reached the priced n≥8 trigger and prints its
build-computed median, €1,508,000 over eight certified sales —
while remaining BEHIND every named rival on live listings,
cohort scale and condition tiers (T-CARS-1's full closure),
off-site notify, and BEHIND Wikipedia on encyclopedia breadth;
design held at PARITY-or-AHEAD against the whole set.**

## Benchmark standing line (rotation 23)

**BENCHMARK STANDING — CLOSER on presentation and photography,
FLAT on data depth, by design: the atlas now photographs every
one of its 257 models and 59 makes from sourced, licensed real
photography with per-photo credit and source on the record, its
cover meets the cover standard of the benchmark set, and its
records and lots are set in the two-voice editorial system those
sites run, while remaining BEHIND every named rival on live
listings, true cohort benchmarks (T-CARS-1) and off-site notify,
and BEHIND Wikipedia on encyclopedia breadth; design held at
PARITY-or-AHEAD against the whole set.**

## Deferred, re-argued by name, with priced closures

### T-CARS-1 — benchmark / cohort value per model
**Verdict: Classic.com (CMB) and Hagerty (condition tiers) WIN
today, outright.** A benchmark value needs a cohort large enough
that a median means something and fresh enough to call current.
At 56 records across 29 linked models, most cohorts are n=1–3 and
the sales span 2011–2025 — a "value" computed from that would be
invented precision, which this atlas does not ship.
**Priced closure:** (a) scale — roughly 300+ certified results with
≥8 per priority model: at the demonstrated manual rate (~9–10
certified per stage) that is ~25 more stage passes, or a licensed /
partnered results feed (Classic.com or a house feed) — a paid or
partnership route that breaks the free-tier law unless a free tier
genuinely covers it, so it needs an owner call, not a builder's;
(b) machinery — cohort computation in `scripts/build.py` + Buy and
model-page rendering: one wave, cheap, and the stage-6 range rung
already proves the shape; (c) condition tiers — only once T-CARS-2
population is a majority of records. Realistic order: machinery
when any priority model reaches n≥8 certified in one currency;
today the largest is n=2–3.
**Rotation 25 update:** the (b) machinery has now FIRED and
SHIPPED exactly as priced — the F40/EUR cohort reached n=8
certified in one currency at stage 7, and `scripts/build.py`
computes the cohorts (published in `data/v1/cohorts.json`) with
Buy and model-page rendering of the median, n shown. What remains
of this closure is (a) scale — the ~300+ certified set at ≥8 per
priority model is still ~24 stage passes away at the demonstrated
rate, or the same licensed-feed owner call — and (c) condition
tiers, with condition population at 13/66, short of a majority.
**Rotation 26 update:** stage 8 fired the machinery a second
time — the Ford GT/USD cohort reached n=8 certified and
publishes its median ($7,020,000) beside the F40's; the set
stands at 83 certified, condition population 16/83, still short
of the majority (c) requires, and (a) scale is still ~22 stage
passes away at the demonstrated rate, or the same licensed-feed
owner call.
**Rotation 27 update:** stage 9 fired the machinery twice more
— the Corvette/USD cohort reached n=10 certified (median
$454,750) and the Model J/USD cohort n=9 (median $1,655,000),
joining the F40 and Ford GT medians in `data/v1/cohorts.json`;
the set stands at 96 certified, condition population 19/96,
still short of the majority (c) requires, and (a) scale is still
~21 stage passes away at the demonstrated rate, or the same
licensed-feed owner call.
**Rotation 28 update:** stage 10 fired the machinery three more
times — the DB5/USD cohort reached n=8 certified (median
$1,108,000), the Miura/USD cohort n=8 (median $2,285,000) and
the Miura/EUR cohort n=8 (median €1,347,750), joining the four
standing medians in `data/v1/cohorts.json`; seven of the ten
cohorts at n≥2 are now benchmarks. The set stands at 107
certified, condition population 25/107, still short of the
majority (c) requires, and (a) scale is still ~19 stage passes
away at the demonstrated rate, or the same licensed-feed owner
call.

### T-CARS-5 — follow / notify
**Verdict: Bring a Trailer, Cars & Bids and Classic.com WIN
today** — following a model and being told when it trades is core
machinery there and absent here.
**Priced closure, two rungs:** (1) *Local follow* — watch a model
in the browser (localStorage), Buy page surfaces watched models'
latest certified results first: client-only, free-tier safe, no
accounts, no server — **SHIPPED in rotation 22**, labelled exactly
as priced (browser-only, notifies nobody). (2) *True notify*
(email/push on a new result) — needs the deploy
decision (a live target), a cron to diff the results file, and a
mail/push sender inside free tiers, plus an accounts or
double-opt-in story: **a deploy-gated project, est. 2–3 waves after
a deploy exists**, inseparable from the parked Price Watch cron
decision below.

## Parked (unchanged, restated)

1. **Price Watch listings ingest + cron form** — a deploy decision
   (parent's / owner's): no live target exists for Car Atlas in
   this rotation's mandate; any cron gets its own `vercel.json`
   entry and free-tier audit before it ships (see GO_LIVE.md).
2. **Ferrari 250 GTO model record** — owner call. The photo and
   three make-level results (2014, 2018, 2023) stay at make level
   until the owner calls it.
3. **Sitemap** — GO_LIVE step 5: only meaningful with a domain;
   lands with a deploy, not before.

## Benchmark standing line (rotation 20)

**BENCHMARK STANDING — CLOSER, on evidence a visitor can see: the
certified-results set grew 46 → 56 (+22%), linked share rose to
29/56 and orphan share fell 54% → 48%, condition/mileage coverage
nearly tripled (4 → 11 and 1 → 7), and the atlas shipped its first
cohort rung (ranges, n shown) — while remaining BEHIND every named
rival on live listings, true cohort benchmarks (T-CARS-1) and
follow/notify (T-CARS-5), and BEHIND Wikipedia on encyclopedia
breadth; design held at PARITY-or-AHEAD against the whole set.**

## Benchmark standing line (rotation 22)

**BENCHMARK STANDING — the atlas's presentation caught up with
its record: one listing anatomy and one identity formula across
every surface, results carried as dated ledgers with a source
per figure, T-CARS-2 closed on the record surface and T-CARS-5's
local-follow rung shipped, while remaining BEHIND every named
rival on live listings, true cohort benchmarks (T-CARS-1: largest
cohort is still n=2) and off-site notify, and BEHIND Wikipedia
on encyclopedia breadth; design held at PARITY-or-AHEAD against
the whole set.**

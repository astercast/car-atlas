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

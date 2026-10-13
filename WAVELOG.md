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

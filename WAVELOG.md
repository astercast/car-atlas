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

- Wave 2: +10 living makes (Lexus, Alfa Romeo, Aston Martin, Cadillac,
  Dodge, GMC, Kia, Lotus, Maserati, McLaren); clubs chapter data begins.
- Wave 3: historic marques batch 1 (DeLorean, Duesenberg, Packard,
  Saab, Studebaker, Tucker, AMC, Pontiac, Oldsmobile, Plymouth).
- Wave 4: full generation depth for the 911, Corvette, Mustang, and
  Land Cruiser; Price Watch ingest stage 1 (auction results).

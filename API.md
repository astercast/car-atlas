# API — Car Atlas

Five serverless functions over the seeded dataset in `data/v1/`. The
frontend does not depend on them — it reads the same JSON statically —
so the site works identically with or without the API. Every response
is an envelope:

```json
{ "ok": true, "data": { }, "meta": { "source": "car-atlas-dataset", "datasetUpdatedAt": "2026-10-13" } }
```

Responses cache aggressively (`s-maxage=300, stale-while-revalidate=86400`)
because the dataset changes in waves, not minutes.

| Endpoint | Params | Returns |
|---|---|---|
| `GET /api/health` | — | status, makes/models/generations/clubs counts |
| `GET /api/makes` | — | all makes with derived model counts |
| `GET /api/model` | `make`, `model` (slugs) | one make + one full model record |
| `GET /api/search` | `q` | ranked make/model matches (server twin of the client instant search) |
| `GET /api/clubs` | `region`, `marque` (optional) | filtered club registry |

## Price Watch (stages 1–17 shipped — still not an endpoint)

The results file is real and deliberately static: `data/v1/price-watch.json`
holds 143 certified auction results (car, price, currency, basis,
house/event, sale date, linked published source, plus a chassis
key and source-stated condition/mileage where a source gives them), rendered on the
Buy page and on the matching model pages. No function serves it —
the static file is the ingest. Stage 7 (rotation 25) also ships the
T-CARS-1 cohort machinery for certified results: `scripts/build.py`
computes cohorts (model + single currency) from the certified set
and publishes `data/v1/cohorts.json` — range and count at n ≥ 2,
and the cohort median at n ≥ 8, the priced trigger; the benchmark
cohorts are Ferrari F40 / EUR (n=8, stage 7), Ford GT / USD
(n=8, stage 8), Chevrolet Corvette / USD (n=10, stage 9),
Duesenberg Model J / USD (n=9, stage 9), Aston Martin DB5 / USD
(n=9, stage 10; median re-derived at stage 11), Lamborghini
Miura / USD (n=8, stage 10), Lamborghini Miura / EUR (n=8,
stage 10), Ferrari F40 / USD (n=8, stage 11) and Aston Martin
DB5 / EUR (n=8, stage 11). The listing stages
remain design:

1. **Ingest** — one adapter per channel in `data/v1/buying.json`,
   normalizing listings to the published schema: `modelSlug, year,
   trim, mileage, location, priceUSD, source, listingUrl, firstSeen,
   lastSeen, status`. Target refresh: 6 hours per source, run as a
   Vercel cron function (explicit path in `vercel.json` when it ships).
2. **Cohorts** — listings grouped by model + year (+ trim where volume
   allows); median, quartiles, and count published per cohort, always
   with the cohort's own freshest `lastSeen` attached.
3. **Drops** — a listing is a "drop" when its price falls ≥5% from its
   own first-seen price or below its cohort's 25th percentile.
4. **Endpoints** — `GET /api/price-watch?model=<slug>` returns cohort
   stats and current drops. Nothing here returns a price the ingest
   didn't actually observe, and stale cohorts are labeled stale.

Model pages without a certified result link to the buying channels
directly and say so. That honesty is the feature.

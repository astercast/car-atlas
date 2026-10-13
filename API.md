# API — Car Atlas

Five serverless functions over the seeded dataset in `data/v1/`. The
frontend does not depend on them — it reads the same JSON statically —
so the site works identically with or without the API. Every response
is an envelope:

```json
{ "ok": true, "data": { }, "meta": { "source": "car-atlas-dataset", "datasetUpdatedAt": "2026-10-12" } }
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

## Price Watch (design — not yet an endpoint)

Price Watch becomes an API when the data behind it is real. Stages:

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

Until stage 1 ships, model pages link to the buying channels directly
and say so. That honesty is the feature.

# Car Atlas

**Every car ever made. One atlas.**

The all-in-one car site: a complete encyclopedia of makes, models, and
generations — with specs, history, and collector notes — a buying layer
that maps every model to the channels that set its price, and a clubs
registry for finding your people by region and marque.

This is a **working repo**. It is not deployed and has no `-live`
counterpart; a live release happens only on the owner's explicit order.

## What's here

- **The Encyclopedia** — `data/v1/makes.json` + `data/v1/models/<make>.json`.
  Each model carries generations with notes and flagship specs, trims,
  production status, and a buying class. Coverage is honest: see
  `COVERAGE.md` for what exists and what's planned.
- **The Buying Layer** — `data/v1/buying.json`. Curated channels (auctions
  with public results first), buying classes per era, and the Price Watch
  design — listing aggregation, cohort medians, drop alerts — specified
  in `API.md`. No fabricated prices, ever.
- **Clubs Near You** — `data/v1/clubs.json`. Real clubs and networks,
  filterable by region and marque on `clubs.html`.
- **Instant search** — the homepage loads one generated index
  (`data/v1/search-index.json`) and searches every make and model as
  you type, keyboard included.

## Pages

| Page | What it does |
|---|---|
| `index.html` | Search-first front door; browse by make, era, body style |
| `make.html?make=<slug>` | A marque's story, facts, and full model list |
| `model.html?make=<slug>&model=<slug>` | The full record: generations, specs, trims, where to buy |
| `buy.html` | Buying classes, channels, and the Price Watch design |
| `clubs.html` | Clubs filtered by region and marque |

## Build

```bash
python3 scripts/build.py   # validates the dataset, regenerates the search index
```

No dependencies, no bundler. Serve the folder with any static server;
the frontend falls back to pure static JSON if the API functions are
absent. The five serverless functions under `api/` are documented in
`API.md`.

## Rules of the house

- Static data lives in `data/v1/` only — never under `api/`.
- Facts are checked or hedged; nothing is invented to fill a cell.
- Voice is human and specific. No marketing filler.

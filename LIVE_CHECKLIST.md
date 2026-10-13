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

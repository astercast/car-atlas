/* Shared data access for Car Atlas serverless functions.
   Reads the seeded static dataset in data/v1 — the same files the
   frontend uses as its fallback. Functions never fabricate data:
   what they return is what the dataset holds, with its date on it. */
const fs = require("fs");
const path = require("path");

const cache = new Map();

function loadJSON(rel) {
  if (cache.has(rel)) return cache.get(rel);
  const file = path.join(__dirname, "..", "data", "v1", rel);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  cache.set(rel, data);
  return data;
}

function makes() {
  return loadJSON("makes.json").makes;
}

function makeFile(slug) {
  try {
    return loadJSON(path.join("models", `${slug}.json`));
  } catch {
    return null;
  }
}

let allModelsCache = null;

/* Built once per warm container and reused across requests — the
   dataset only changes when a new wave deploys, which cold-starts
   the container anyway. This is the request-coalescing layer:
   search and health never re-walk 40 files per invocation. */
function allModels() {
  if (allModelsCache) return allModelsCache;
  const out = [];
  for (const m of makes()) {
    const file = makeFile(m.slug);
    if (!file) continue;
    for (const model of file.models) out.push({ make: m, model });
  }
  allModelsCache = out;
  return out;
}

function datasetUpdatedAt() {
  return loadJSON("makes.json").updatedAt || null;
}

function send(res, status, data, extra = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
  res.end(JSON.stringify({
    ok: status < 400,
    data,
    meta: { source: "car-atlas-dataset", datasetUpdatedAt: datasetUpdatedAt(), ...extra },
  }));
}

module.exports = { loadJSON, makes, makeFile, allModels, datasetUpdatedAt, send };

const { send, allModels, makes } = require("../lib/data");

/* GET /api/search?q=911 — server twin of the client-side instant search. */
module.exports = (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  if (!q) return send(res, 400, { error: "Pass ?q= with a make, model, or segment." });

  const hits = [];
  for (const m of makes()) {
    if (m.name.toLowerCase().includes(q)) hits.push({ type: "make", slug: m.slug, name: m.name, score: 70 });
  }
  for (const { make, model } of allModels()) {
    const name = model.name.toLowerCase();
    const hay = `${model.name} ${make.name} ${model.segment} ${model.bodyStyles.join(" ")} ${model.years}`.toLowerCase();
    let score = -1;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 80;
    else if (hay.split(/\s+/).some((w) => w.startsWith(q))) score = 60;
    else if (hay.includes(q)) score = 40;
    if (score >= 0) hits.push({ type: "model", make: make.slug, makeName: make.name, slug: model.slug, name: model.name, years: model.years, segment: model.segment, score });
  }
  hits.sort((a, b) => b.score - a.score);
  send(res, 200, { query: q, results: hits.slice(0, 20) });
};

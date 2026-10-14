/* Car Atlas · client engine.
   One fetch of the search index powers the whole front door.
   Detail pages fetch only the make file they need. */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* Display normalization for record-carried text (auction event
   names, source names, club names): the stored record keeps the
   name as published; the presented line sets it with a comma.
   Stored records are never rewritten for presentation. */
const disp = (s) => String(s ?? "").replace(/ \u2014 /g, ", ");

/* Fleet Commons honest-fallback v1.0.0, Layer 2 (assets/js/
   fetch_deadline.js, copied verbatim): every load races a deadline.
   A fetch that never settles, the VP-0003 hang, now rejects into
   the normal failure chain instead of spinning forever. Canonical
   default 12000 ms applies unless a loader passes its own. */
async function fetchJSON(path, opts) {
  if (window.HonestFetch) return HonestFetch.getJSON(path, opts);
  const r = await fetch(path);
  if (!r.ok) throw new Error(`${path} → ${r.status}`);
  return r.json();
}

const makeUrl = (slug) => `make.html?make=${encodeURIComponent(slug)}`;
const modelUrl = (m, s) => `model.html?make=${encodeURIComponent(m)}&model=${encodeURIComponent(s)}`;

/* The identity formula, one order everywhere: make, model,
   trim or generation, years. */
const formula = (makeName, name, years) => `${makeName} ${name} (${years})`;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const fmtDate = (iso) => { const [y, m, d] = String(iso).split("-").map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const NUMWORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const numWord = (n) => (n < 20 ? NUMWORDS[n] : String(n));
/* Freshness in words, derived from the record's own date. */
function ageWords(iso) {
  const then = new Date(`${iso}T00:00:00Z`);
  const days = Math.floor((Date.now() - then.getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  const years = Math.floor(days / 365.25);
  if (years >= 1) return `${numWord(years)} year${years > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30.44);
  if (months >= 1) return `${numWord(months)} month${months > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks >= 1) return `${numWord(weeks)} week${weeks > 1 ? "s" : ""} ago`;
  return `${numWord(days)} days ago`;
}

/* --- Instant search --- */
function searchIndex(index, q, limit = 9) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  const scored = [];
  for (const e of index) {
    const name = e.name.toLowerCase();
    const hay = `${e.name} ${e.makeName} ${e.segment} ${(e.bodyStyles || []).join(" ")} ${e.years}`.toLowerCase();
    let score = -1;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 80;
    else if (hay.split(/\s+/).some((w) => w.startsWith(q))) score = 60;
    else if (hay.includes(q)) score = 40;
    if (score >= 0) scored.push([score, e]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map(([, e]) => e);
}

function resultRow(e) {
  const href = e.type === "make" ? makeUrl(e.make) : modelUrl(e.make, e.slug);
  const name = e.type === "make" ? e.name : formula(e.makeName, e.name, e.years);
  const meta = e.type === "make" ? `${e.modelCount} models` : `${e.segment}`;
  return `<a href="${href}" role="option"><span class="r-name">${esc(name)}</span><span class="r-meta">${esc(meta)}</span></a>`;
}

function wireSearch(input, box, index) {
  let sel = -1;
  const close = () => { box.classList.add("hidden"); box.innerHTML = ""; sel = -1; };
  input.addEventListener("input", () => {
    const hits = searchIndex(index, input.value);
    if (!input.value.trim()) return close();
    box.innerHTML = hits.length
      ? hits.map(resultRow).join("")
      : `<div class="empty">No match in the atlas yet. Coverage grows every wave; see the coverage notes in BENCHMARK and COVERAGE in the repo.</div>`;
    box.classList.remove("hidden");
    sel = -1;
  });
  input.addEventListener("keydown", (ev) => {
    const rows = $$("a", box);
    if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
      ev.preventDefault();
      sel = ev.key === "ArrowDown" ? Math.min(sel + 1, rows.length - 1) : Math.max(sel - 1, 0);
      rows.forEach((r, i) => r.classList.toggle("sel", i === sel));
    } else if (ev.key === "Enter" && sel >= 0 && rows[sel]) {
      ev.preventDefault();
      location.href = rows[sel].getAttribute("href");
    } else if (ev.key === "Escape") close();
  });
  document.addEventListener("click", (ev) => { if (!box.contains(ev.target) && ev.target !== input) close(); });
}

/* --- Photos (placement pass, wave 4) ---
   Sourced photography from the Foundry manifest, wired through the
   dataset's photo/photos fields. The caption states honestly what
   the photograph shows; the credit line is the licence attribution
   and renders on every page that shows the photo. */
const photoFigure = (p, cls = "") => `
  <figure class="photo ${cls}">
    <img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy">
    <figcaption>${esc(p.caption)} · ${esc(p.credit)}${p.source ? ` · <a href="${esc(p.source)}" target="_blank" rel="noopener">File page ↗</a>` : ""}</figcaption>
  </figure>`;
const photosHTML = (rec) => {
  const list = rec.photos && rec.photos.length ? rec.photos
    : (rec.photo ? [{ src: rec.photo, caption: rec.photoCaption, credit: rec.photoCredit, source: rec.photoSource }] : []);
  if (!list.length) return "";
  return photoFigure(list[0], "photo-main")
    + (list.length > 1 ? `<div class="photo-grid">${list.slice(1).map((p) => photoFigure(p)).join("")}</div>` : "");
};
const money2 = (amount, currency) => (currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$") + Number(amount).toLocaleString("en-US");
const money = (r) => money2(r.price, r.currency);

/* Embedded photo for index rows and listing units: the car's
   sourced photograph (dataset photo fields, Foundry manifest
   style: caption + credit with licence), placed after the text,
   never leading it. In listing units the caption is prefixed
   "Model photo" so the model's file photograph is never
   mistaken for the specific car that sold. */
const thumbFigure = (rec, modelPhoto = false, cls = "") => {
  if (!rec || !rec.photo) return "";
  const cap = `${modelPhoto ? "Model photo: " : ""}${rec.photoCaption} · ${rec.photoCredit}`;
  return `<figure class="thumb ${cls}"><img src="${esc(rec.photo)}" alt="${esc(rec.photoCaption)}" loading="lazy"><figcaption>${esc(cap)}</figcaption></figure>`;
};
/* make/modelSlug -> search-index entry (carries the photo fields) */
const photoMapFromIndex = (idx) => new Map(idx.filter((e) => e.type === "model" && e.photo).map((e) => [`${e.make}/${e.slug}`, e]));

/* Lot numbers (rotation 23, auction-catalogue furniture): a
   result's lot is its position in the full certified set, newest
   sale first, so a lot keeps its number on every surface, the
   home rail, the marque ledger, the Buy page, Following. */
const lotKey = (r) => `${r.saleDate}|${r.model}|${r.price}|${r.chassis || ""}`;
const lotMapOf = (results) => {
  const m = new Map();
  [...results].sort((a, b) => b.saleDate.localeCompare(a.saleDate)).forEach((r, i) => m.set(lotKey(r), i + 1));
  return m;
};
const lotLabel = (n) => (n ? `Lot ${String(n).padStart(2, "0")}` : "");

/* --- The listing unit ---
   Five fields in fixed order on every listing, in every rail and
   on every market page: state word; the identity formula as the
   title line; listing date and freshness in words; the price as
   the dominant numeral; sale type as the closing word. Auction
   results carry their sale line in the date position. A missing
   field prints as an honest word, never silently omitted. With
   {prov:true} the unit also carries its provenance as an apparatus
   line under the fields (the facts the record states, and its
   source), which is the market page and marque ledger form. */
function listingUnit(r, opts = {}) {
  const href = r.modelSlug ? modelUrl(r.make, r.modelSlug) : makeUrl(r.make);
  const state = r.status === "sold" ? "Sold" : (r.status || "Recorded");
  let prov = "";
  if (opts.prov) {
    const repeats = (opts.all && r.chassis) ? opts.all.filter((x) => x !== r && x.chassis === r.chassis) : [];
    const rep = repeats.map((x) => ` Same chassis also sold ${x.saleDate} for ${money(x)} at ${disp(x.event)}.`).join("");
    prov = `
    <span class="l-prov">${esc(resultFacts(r))}${esc(rep)} · Source: <a href="${esc(r.source.url)}" target="_blank" rel="noopener">${esc(disp(r.source.name))} ↗</a></span>`;
  }
  return `<div class="listing">
    <span><span class="l-state">${opts.lot ? `<span class="l-lot">${esc(lotLabel(opts.lot))}</span>` : ""}${esc(state)}</span><a class="l-title" href="${href}">${esc(formula(r.makeName, disp(r.model), r.year))}</a><span class="l-date">${esc(disp(r.event))} · ${esc(fmtDate(r.saleDate))} · sold ${esc(ageWords(r.saleDate))}</span></span>
    <span class="l-price">${esc(money(r))}<span class="l-basis">${esc(r.priceBasis)}</span></span>
    <span class="l-type">Auction</span>${prov}${opts.photo ? thumbFigure(opts.photo, true, "l-thumb") : ""}
  </div>`;
}
/* The facts line of a certified record: every field the Price
   Watch stages have certified prints, stated or as unrecorded. */
function resultFacts(r) {
  const facts = [
    r.chassis ? `Chassis ${r.chassis}` : "Chassis unrecorded",
    r.condition ? `Condition (per source): ${r.condition}` : "Condition unrecorded",
    r.mileage ? `Mileage (per source): ${r.mileage}` : "Mileage unrecorded",
  ];
  return facts.join(" · ");
}

/* --- Tiles (atlas index rows) --- */
const modelTile = (e) => `
  <a class="row${e.photo ? " has-thumb" : ""}" href="${modelUrl(e.make, e.slug)}">
    <h3>${esc(formula(e.makeName, e.name, e.years))}</h3><span class="t-sub">${esc(e.segment)}</span>
    <p>${esc(e.intro)}</p>
    <div class="t-foot">${esc((e.bodyStyles || []).join(" / "))} · ${esc(e.status)}</div>${thumbFigure(e)}
  </a>`;

/* --- Home: the issue --- */
async function initHome() {
  const idx = await fetchJSON("data/v1/search-index.json");
  const makes = idx.filter((e) => e.type === "make");
  const models = idx.filter((e) => e.type === "model");
  const genCount = models.reduce((n, m) => n + (m.generationCount || 0), 0);

  const pw = await fetchJSON("data/v1/price-watch.json").catch(() => null);
  if (pw) {
    const d = new Date(`${pw.updatedAt}T00:00:00Z`);
    const folio = $("#folio");
    if (folio) folio.innerHTML = `<span>The <b>${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}</b> issue</span><span class="sep">·</span><span>Atlas data as of <b>${esc(fmtDate(pw.updatedAt))}</b></span><span class="sep">·</span><span><b>${makes.length}</b> makes, <b>${models.length}</b> models, <b>${genCount}</b> generations</span><span class="sep">·</span><span>Price Watch: <b>${pw.results.length}</b> certified auction results</span>`;
    const doorAtlas = $("#door-atlas"); if (doorAtlas) doorAtlas.textContent = `${makes.length} makes · ${models.length} models · ${genCount} generations`;
    const doorPw = $("#door-pw"); if (doorPw) doorPw.textContent = `${pw.results.length} certified results · newest sales below, all of them on the Buy page`;
    const age = $("#cover-age"); if (age) age.textContent = ` · sold ${ageWords("2018-08-25")}`;
    const rail = $("#pw-rail");
    const photoMap = photoMapFromIndex(idx);
    const lots = lotMapOf(pw.results);
    if (rail) rail.innerHTML = [...pw.results].sort((a, b) => b.saleDate.localeCompare(a.saleDate)).slice(0, 5).map((r) => listingUnit(r, { lot: lots.get(lotKey(r)), photo: r.modelSlug ? photoMap.get(`${r.make}/${r.modelSlug}`) : null })).join("");
  }

  wireSearch($("#q"), $("#q-results"), idx);
  const q = new URLSearchParams(location.search).get("q");
  if (q) { $("#q").value = q; $("#q").dispatchEvent(new Event("input")); }

  $("#makes-grid").innerHTML = makes.map((m) => `
    <a class="row" href="${makeUrl(m.make)}">
      <h3>${esc(m.name)}</h3><span class="t-sub">${esc(m.country)} · ${m.founded}</span>
      <p>${esc(m.blurb)}</p>
      <div class="t-foot">${m.modelCount} models</div>
    </a>`).join("");

  // Editorial picks, resolved by name so the list survives slug drift.
  const picks = [["porsche", "911"], ["toyota", "2000GT"], ["ferrari", "F40"], ["lamborghini", "Countach"], ["mazda", "MX-5"], ["ford", "Mustang"]];
  const featured = picks.map(([mk, nm]) => models.find((e) => e.make === mk && e.name.includes(nm))).filter(Boolean);
  $("#featured-grid").innerHTML = featured.map(modelTile).join("");

  // Era browser
  const eras = [
    ["All eras", () => true],
    ["Pioneers · pre-1940", (y) => y < 1940],
    ["Postwar · 1945–59", (y) => y >= 1945 && y < 1960],
    ["Sixties · 1960–69", (y) => y >= 1960 && y < 1970],
    ["Seventies · 1970–79", (y) => y >= 1970 && y < 1980],
    ["Eighties · 1980–89", (y) => y >= 1980 && y < 1990],
    ["Nineties · 1990–99", (y) => y >= 1990 && y < 2000],
    ["2000s", (y) => y >= 2000 && y < 2010],
    ["2010s", (y) => y >= 2010 && y < 2020],
    ["2020s · now", (y) => y >= 2020],
  ];
  const startYear = (e) => parseInt(String(e.years).match(/\d{4}/)?.[0] || "9999", 10);
  const eraChips = $("#era-chips"), eraGrid = $("#era-grid");
  const renderEra = (i) => {
    $$(".chip", eraChips).forEach((c, j) => c.setAttribute("aria-pressed", String(i === j)));
    const list = models.filter((e) => eras[i][1](startYear(e))).slice(0, 9);
    eraGrid.innerHTML = list.length ? list.map(modelTile).join("") : `<p class="center-note">Nothing seeded from this era yet; it is on the coverage roadmap.</p>`;
  };
  eraChips.innerHTML = eras.map(([label], i) => `<button class="chip" data-era="${i}" aria-pressed="${i === 0}">${esc(label)}</button>`).join("");
  eraChips.addEventListener("click", (ev) => { const b = ev.target.closest("[data-era]"); if (b) renderEra(+b.dataset.era); });
  renderEra(0);

  // Body-style browser
  const styles = [...new Set(models.flatMap((e) => e.bodyStyles || []))].sort();
  const styleChips = $("#style-chips"), styleGrid = $("#style-grid");
  styleChips.innerHTML = styles.map((s, i) => `<button class="chip" data-style="${esc(s)}" aria-pressed="${i === 0}">${esc(s)}</button>`).join("");
  const renderStyle = (s) => {
    $$(".chip", styleChips).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.style === s)));
    styleGrid.innerHTML = models.filter((e) => (e.bodyStyles || []).includes(s)).slice(0, 9).map(modelTile).join("");
  };
  styleChips.addEventListener("click", (ev) => { const b = ev.target.closest("[data-style]"); if (b) renderStyle(b.dataset.style); });
  if (styles.length) renderStyle(styles[0]);
}

/* --- Make page --- */
async function initMake() {
  const slug = new URLSearchParams(location.search).get("make");
  const [makesData, file, priceWatch] = await Promise.all([
    fetchJSON("data/v1/makes.json"),
    fetchJSON(`data/v1/models/${slug}.json`),
    fetchJSON("data/v1/price-watch.json").catch(() => null),
  ]);
  const meta = makesData.makes.find((m) => m.slug === slug);
  if (!meta) { $("#make-root").innerHTML = `<p class="center-note">Make not found.</p>`; return; }
  document.title = `${meta.name} · Car Atlas`;
  const marqueResults = (priceWatch?.results || []).filter((r) => r.make === slug)
    .sort((a, b) => b.saleDate.localeCompare(a.saleDate));
  const marquePhotos = new Map(file.models.filter((m) => m.photo).map((m) => [m.slug, m]));
  $("#make-root").innerHTML = `
    <div class="crumb"><a href="index.html">Atlas</a> / Makes / ${esc(meta.name)}</div>
    <h1>${esc(meta.name)}</h1>
    <p class="lede">${esc(meta.blurb)}</p>
    <div class="factrow">
      <div class="fact"><span>Founded</span><b>${meta.founded}</b></div>
      <div class="fact"><span>Country</span><b>${esc(meta.country)}</b></div>
      <div class="fact"><span>Headquarters</span><b>${esc(meta.hq)}</b></div>
      <div class="fact"><span>Known for</span><b>${esc(meta.knownFor)}</b></div>
      <div class="fact"><span>Models in atlas</span><b>${file.models.length}</b></div>
    </div>
    ${photosHTML(meta)}
    <section class="block"><div class="rows">
      ${file.models.map((m) => modelTile({ ...m, make: slug, makeName: meta.name, generationCount: m.generations.length })).join("")}
    </div></section>
    <section class="block">
      <div class="block-head"><h2>Price Watch, certified results for ${esc(meta.name)}</h2><p>Every certified result recorded for this marque, linked records to their model pages and make-level records to the full set on the Buy page. A result is one car on one day, not a valuation.</p></div>
      ${marqueResults.length ? `<div class="listings">${marqueResults.map((r) => listingUnit(r, { prov: true, lot: lotMapOf(priceWatch?.results || []).get(lotKey(r)), all: priceWatch?.results || [], photo: r.modelSlug ? marquePhotos.get(r.modelSlug) : null })).join("")}</div>`
        : `<p class="center-note">No certified result for this marque yet; none is shown rather than one invented.</p>`}
    </section>
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org", "@type": "Brand",
      name: meta.name, description: meta.blurb,
      ...(meta.photo ? { image: meta.photo } : {}),
    }).replace(/</g, "\\u003c")}<\/script>`;
}

/* --- Model page: the record ---
   honest-fallback (VP-0003): Layer 1 paints the baked snapshot,
   the record's genuine essentials, baked into model.html at build
   time from the same dataset, synchronously, before any fetch.
   Layer 2 bounds the live load: 8 s per-loader deadline (the files
   are ~7 KB; a local load is milliseconds) plus the 12 s watchdog
   backstop. Terminal states: live record · labeled static snapshot
   with retry · honest error with retry. Never an eternal loader. */
const MODEL_DEADLINE_MS = 8000, MODEL_WATCHDOG_MS = 12000;

function renderBakedModel(root, mk, md) {
  const all = window.__CA_MODEL_ESSENTIALS__;
  const e = all && all[`${mk}/${md}`];
  if (!e) return false;
  document.title = `${formula(e.makeName, e.name, e.years)} · Car Atlas`;
  root.innerHTML = `
    <div class="crumb"><a href="index.html">Atlas</a> / <a href="${makeUrl(mk)}">${esc(e.makeName)}</a> / ${esc(e.name)}</div>
    <h1>${esc(formula(e.makeName, e.name, e.years))}</h1>
    <p class="lede">${esc(e.intro)}</p>
    <div class="factrow">
      <div class="fact"><span>Years</span><b>${esc(e.years)}</b></div>
      <div class="fact"><span>Status</span><b>${esc(e.status)}</b></div>
      <div class="fact"><span>Segment</span><b>${esc(e.segment)}</b></div>
      <div class="fact"><span>Body styles</span><b>${esc(e.bodyStyles.join(", "))}</b></div>
      <div class="fact"><span>Generations</span><b>${e.generationCount}</b></div>
    </div>
    <div class="note-box"><b>Static snapshot</b>
      <p>Atlas data as of ${esc(window.__CA_DATASET_UPDATED_AT__ || "")} · static snapshot; the full record (every generation, trims, the price ledger) replaces this on load.</p>
      <p id="model-load-status" aria-live="polite">Loading the full record…</p>
    </div>`;
  return true;
}

function modelStuck(root, baked, err) {
  const msg = `The full record didn't finish loading${err ? ` (${err.message})` : ""}.`;
  const wire = () => { const b = $("#model-retry", root); if (b) b.addEventListener("click", () => initModel()); };
  const st = baked && $("#model-load-status", root);
  if (st) {
    st.innerHTML = `${esc(msg)} You're reading the static snapshot above, this car's essentials, exactly as baked from the atlas data. <button class="chip" id="model-retry" type="button">Retry the full record</button>`;
  } else {
    root.innerHTML = `<p class="center-note">${esc(msg)} <button class="chip" id="model-retry" type="button">Retry</button></p>`;
  }
  wire();
}

/* Local follow (T-CARS-5, rung 1 of BENCHMARK.md's priced closure):
   followed models live in this browser's localStorage. The Buy
   page surfaces their latest certified results first. It notifies
   nobody off-site, and the surfaces say exactly that. */
const FOLLOW_KEY = "car-atlas-follows:v1";
const readFollows = () => { try { return JSON.parse(localStorage.getItem(FOLLOW_KEY)) || []; } catch { return []; } };
const writeFollows = (list) => { try { localStorage.setItem(FOLLOW_KEY, JSON.stringify(list)); } catch { /* private mode: follow simply does not persist */ } };

function decadeWord(years) {
  const y = parseInt(String(years).match(/\d{4}/)?.[0] || "", 10);
  if (!y) return "Browse by era in the atlas";
  const words = { 1930: "The thirties", 1940: "The forties", 1950: "The fifties", 1960: "The sixties", 1970: "The seventies", 1980: "The eighties", 1990: "The nineties", 2000: "The 2000s", 2010: "The 2010s", 2020: "The 2020s" };
  return words[Math.floor(y / 10) * 10] || "Browse by era in the atlas";
}

async function initModel() {
  const ps = new URLSearchParams(location.search);
  const mk = ps.get("make"), md = ps.get("model");
  const root = $("#model-root");
  const baked = renderBakedModel(root, mk, md);
  let live = false, settled = false;
  const cancelWatchdog = window.HonestFetch ? HonestFetch.armWatchdog({
    ms: MODEL_WATCHDOG_MS,
    isLive: () => live,
    onStuck: () => { if (!settled) { settled = true; modelStuck(root, baked); } },
  }) : () => {};
  let makesData, file, buying, priceWatch, cohortsDoc;
  try {
    [makesData, file, buying, priceWatch, cohortsDoc] = await Promise.all([
      fetchJSON("data/v1/makes.json", { ms: MODEL_DEADLINE_MS }),
      fetchJSON(`data/v1/models/${mk}.json`, { ms: MODEL_DEADLINE_MS }),
      fetchJSON("data/v1/buying.json", { ms: MODEL_DEADLINE_MS }),
      /* Price Watch is an enhancement, never a gate: its failure
         must not stall the record (VP-0003 discipline). */
      fetchJSON("data/v1/price-watch.json", { ms: MODEL_DEADLINE_MS }).catch(() => null),
      /* T-CARS-1 cohorts are computed in the build (scripts/build.py)
         and published as data/v1/cohorts.json; like Price Watch, the
         file enhances the record and never gates it. */
      fetchJSON("data/v1/cohorts.json", { ms: MODEL_DEADLINE_MS }).catch(() => null),
    ]);
  } catch (err) {
    if (!settled) { settled = true; cancelWatchdog(); modelStuck(root, baked, err); }
    console.error(err);
    return;
  }
  settled = true;
  const meta = makesData.makes.find((m) => m.slug === mk);
  const model = file.models.find((m) => m.slug === md);
  if (!meta || !model) { live = true; cancelWatchdog(); root.innerHTML = `<p class="center-note">Model not found in the atlas yet.</p>`; return; }
  document.title = `${formula(meta.name, model.name, model.years)} · Car Atlas`;
  const cls = buying.buyingClasses[model.buyingClass];
  const channels = (cls?.primaryChannels || [])
    .map((d) => buying.channels.find((c) => c.domain === d)).filter(Boolean);
  const genHTML = (g) => `
    <article class="gen">
      <div class="gen-head"><h3>${esc(g.name)}</h3><span class="yrs">${esc(g.years)}</span>${g.code ? `<span class="code">${esc(g.code)}</span>` : ""}</div>
      <p>${esc(g.note)}</p>
      ${g.spec ? `<div class="spec">
        <div><span>Engine</span><b>${esc(g.spec.engine)}</b></div>
        <div><span>Power</span><b>${esc(g.spec.power)}</b></div>
        <div><span>Drivetrain</span><b>${esc(g.spec.drivetrain)}</b></div>
      </div>` : ""}
    </article>`;

  /* The record's price ledger: this model's certified results as
     ruled, dated rows, each figure carrying its source; repeat
     sales of one chassis linked in the row (T-CARS-4 machinery). */
  const hits = (priceWatch?.results || []).filter((r) => r.make === mk && r.modelSlug === md)
    .sort((a, b) => b.saleDate.localeCompare(a.saleDate));
  const repeatsOf = (r) => r.chassis ? (priceWatch?.results || []).filter((x) => x !== r && x.chassis === r.chassis) : [];
  const lotsM = priceWatch ? lotMapOf(priceWatch.results) : new Map();
  const ledgerHTML = hits.length ? `<div class="pw-ledger">${hits.map((r) => `
    <div class="pw-lrow">
      <span class="d"><span class="lot">${esc(lotLabel(lotsM.get(lotKey(r))))}</span>${esc(r.saleDate)}</span>
      <span class="car">${esc(formula(r.makeName, disp(r.model), r.year))}</span>
      <span class="price">${esc(money(r))}</span>
      <span class="facts">${esc(resultFacts(r))} · ${esc(disp(r.event))}${repeatsOf(r).map((x) => ` · Same chassis also sold ${esc(x.saleDate)} for ${esc(money(x))} at ${esc(disp(x.event))}`).join("")}</span>
      <span class="basis">${esc(r.priceBasis)}</span>
      <span class="src">Source: <a href="${esc(r.source.url)}" target="_blank" rel="noopener">${esc(disp(r.source.name))} ↗</a></span>
    </div>`).join("")}</div>`
    : `<p class="center-note">Price Watch holds no certified result for this model yet, so none is shown.</p>`;
  /* Cohort lines (T-CARS-1 machinery): cohorts are computed in the
     build from certified records only, per currency, n shown. A
     cohort at the priced trigger (n >= 8) prints its build-computed
     median as the cohort benchmark; below the trigger only the
     range prints, as context. If the cohorts file did not load, the
     range is recomputed here from the same certified records and
     no median is claimed. */
  const cohortHTML = (() => {
    if (!priceWatch || hits.length < 2) return "";
    const byCur = {};
    for (const r of hits) (byCur[r.currency] ||= []).push(r);
    return Object.entries(byCur).filter(([, g]) => g.length >= 2).map(([cur, g]) => {
      const prices = g.map((r) => r.price);
      const dates = g.map((r) => r.saleDate).sort();
      const built = (cohortsDoc?.cohorts || []).find((c) => c.make === mk && c.modelSlug === md && c.currency === cur);
      const range = `<b>${esc(money2(Math.min(...prices), cur))} – ${esc(money2(Math.max(...prices), cur))}</b> · ${numWord(g.length)} certified results in ${esc(cur)}, sales from ${esc(fmtDate(dates[0]))} to ${esc(fmtDate(dates[dates.length - 1]))}.`;
      if (built?.benchmark) {
        return `<p class="cohort-line">${range} <b>Cohort median ${esc(money2(built.median, cur))}</b> over the ${numWord(built.n)} certified sales: the T-CARS-1 benchmark rung, computed in the build from certified records only. A median of past sales is context for this model, not a valuation of any other example.</p>`;
      }
      return `<p class="cohort-line">${range} A range over ${g.length} sales is context, not a valuation of any other example.</p>`;
    }).join("");
  })();
  /* The certification counts print on the record page, computed
     from the full certified set at render: stated honestly, never
     inflated (Price Watch stage 7 counts at this build: condition
     13/66, mileage 12/66, chassis 49/66, modelSlug 39/66). */
  const certHTML = (() => {
    if (!priceWatch) return "";
    const all = priceWatch.results;
    const n = (k) => all.filter((r) => r[k]).length;
    const stage = (String(priceWatch.stage || "").match(/^Stage \d+/) || ["Price Watch"])[0];
    return `<p class="cert-line">${esc(stage)} certification counts, across all ${all.length} certified results: condition is stated on ${n("condition")}, mileage on ${n("mileage")}, chassis on ${n("chassis")}. Each prints in the ledger where its source states it, and as unrecorded where none does. The full set, with filters, is on the <a href="buy.html">Buy page</a>.</p>`;
  })();
  const followKey = `${mk}/${md}`;
  const isFollowing = readFollows().includes(followKey);

  root.innerHTML = `
    <div class="crumb"><a href="index.html">Atlas</a> / <a href="${makeUrl(mk)}">${esc(meta.name)}</a> / ${esc(model.name)}</div>
    <h1>${esc(formula(meta.name, model.name, model.years))}</h1>
    <p class="lede">${esc(model.intro)}</p>
    <div class="factrow">
      <div class="fact"><span>Years</span><b>${esc(model.years)}</b></div>
      <div class="fact"><span>Status</span><b>${esc(model.status)}</b></div>
      <div class="fact"><span>Segment</span><b>${esc(model.segment)}</b></div>
      <div class="fact"><span>Body styles</span><b>${esc(model.bodyStyles.join(", "))}</b></div>
      <div class="fact"><span>Generations</span><b>${model.generations.length}</b></div>
    </div>
    ${photosHTML(model)}
    ${model.collectorNote ? `<div class="note-box"><b>Collector note</b><p>${esc(model.collectorNote)}</p></div>` : ""}
    <section class="block">
      <div class="block-head"><h2>Generations</h2><p>Every generation in the atlas, flagship specs first. Figures are the manufacturers' published ratings, as recorded by the atlas.</p></div>
      ${model.generations.map(genHTML).join("")}
    </section>
    <section class="block">
      <div class="block-head"><h2>Trims &amp; variants</h2></div>
      <div class="chips">${model.trims.map((t) => `<span class="pill">${esc(t)}</span>`).join("")}</div>
    </section>
    <section class="block" id="price-record">
      <div class="block-head"><h2>Price Watch, the record</h2><p>Certified auction results for this model, newest first, as a dated ledger. A result is one specific car on one day, not a valuation of any other example.</p></div>
      <div class="follow-row">
        <button class="follow-btn" id="follow-btn" type="button" aria-pressed="${isFollowing}">${isFollowing ? "Following this model ✓" : "Follow this model"}</button>
        <span class="follow-note">Following is stored in this browser only. It notifies nobody; followed models and their newest certified results surface first on the Buy page.</span>
      </div>
      ${ledgerHTML}
      ${cohortHTML}
      ${certHTML}
    </section>
    <section class="block" id="buy">
      <div class="block-head"><h2>Where to buy</h2><p>${esc(cls?.label || "")} · ${esc(cls?.description || "")}</p></div>
      <div class="rows">
        ${channels.map((c) => `
          <a class="row" href="https://${esc(c.domain)}" target="_blank" rel="noopener">
            <h3>${esc(c.name)}</h3><span class="t-sub">${esc(c.kind)}</span>
            <p>${esc(c.blurb)}</p>
            <div class="t-foot">${esc(c.domain)} ↗</div>
          </a>`).join("")}
      </div>
    </section>
    <nav class="dept-line" aria-label="Onward">
      <span class="dl-word">Onward</span>
      <a href="${makeUrl(mk)}">More ${esc(meta.name)} →</a>
      <a href="index.html#atlas">${esc(decadeWord(model.years))} in the atlas →</a>
      <a href="buy.html">Every certified result →</a>
    </nav>
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org", "@type": "Car",
      name: `${meta.name} ${model.name}`, brand: { "@type": "Brand", name: meta.name },
      description: model.intro, bodyType: model.bodyStyles.join(", "),
      ...(model.photo ? { image: model.photo } : {}),
    }).replace(/</g, "\\u003c")}<\/script>`;
  live = true; cancelWatchdog();
  const fb = $("#follow-btn");
  if (fb) fb.addEventListener("click", () => {
    const list = readFollows();
    const on = list.includes(followKey);
    writeFollows(on ? list.filter((k) => k !== followKey) : [...list, followKey]);
    fb.setAttribute("aria-pressed", String(!on));
    fb.textContent = on ? "Follow this model" : "Following this model ✓";
  });
}

/* --- Clubs --- */
async function initClubs() {
  const data = await fetchJSON("data/v1/clubs.json");
  const regions = [...new Set(data.clubs.map((c) => c.region))].sort();
  const marques = [...new Set(data.clubs.map((c) => c.marque))].sort();
  $("#f-region").innerHTML = `<option value="">All regions</option>` + regions.map((r) => `<option>${esc(r)}</option>`).join("");
  $("#f-marque").innerHTML = `<option value="">All marques</option>` + marques.map((m) => `<option>${esc(m)}</option>`).join("");
  const render = () => {
    const r = $("#f-region").value, m = $("#f-marque").value;
    const list = data.clubs.filter((c) => (!r || c.region === r) && (!m || c.marque === m));
    $("#club-count").textContent = `${list.length} clubs & networks`;
    $("#club-grid").innerHTML = list.length ? list.map((c) => `
      <article class="row">
        <h3>${esc(disp(c.name))}</h3><span class="t-sub">${esc(c.region)}</span>
        <p>${esc(c.description)}</p>
        <div class="t-foot">${esc(c.type)} · ${esc(c.chapterModel)} · <a href="https://${esc(c.website)}" target="_blank" rel="noopener">${esc(c.website)} ↗</a></div>
      </article>`).join("") : `<p class="center-note">No seeded club matches that filter yet; the registry grows every wave.</p>`;
  };
  $("#f-region").addEventListener("change", render);
  $("#f-marque").addEventListener("change", render);
  render();
}

/* --- Buy: the market page ---
   T-CARS-6 / DL-5: real client-side filters over the 119 certified
   Price Watch records. Facets reflect only what the records carry:
   make (16 present), stated-price band (counts computed from the
   records, in each record's own currency, labelled "stated price"),
   and record completeness (chassis 72/96, condition 19/96,
   mileage 21/96 at stage 9). No facet is offered for a field the
   data does not have. Results print as five-field listing units
   with their provenance lines. */
async function initBuy() {
  const data = await fetchJSON("data/v1/buying.json");
  $("#class-grid").innerHTML = Object.values(data.buyingClasses).map((c) => `
    <article class="row">
      <h3>${esc(c.label)}</h3>
      <p>${esc(c.description)}</p>
      <div class="t-foot">${c.primaryChannels.length} primary channels</div>
    </article>`).join("");
  $("#channel-grid").innerHTML = data.channels.map((c) => `
    <a class="row" href="https://${esc(c.domain)}" target="_blank" rel="noopener">
      <h3>${esc(c.name)}</h3><span class="t-sub">${esc(c.kind)}</span>
      <p>${esc(c.blurb)}</p>
      <div class="t-foot">${esc(c.era)} · ${esc(c.domain)} ↗</div>
    </a>`).join("");
  $("#watch-schema").innerHTML = data.priceWatch.schema.map((f) => `<li><span>${esc(f)}</span><span class="mut">field</span></li>`).join("");
  try {
    const pw = await fetchJSON("data/v1/price-watch.json");
    const cohortsDoc = await fetchJSON("data/v1/cohorts.json").catch(() => null);
    const all = [...pw.results].sort((a, b) => b.saleDate.localeCompare(a.saleDate));
    const idx = await fetchJSON("data/v1/search-index.json").catch(() => []);
    const photoMap = photoMapFromIndex(idx);
    const photoOf = (r) => (r.modelSlug ? photoMap.get(`${r.make}/${r.modelSlug}`) : null);

    /* Following (T-CARS-5 rung 1): models followed in this browser
       surface here with their newest certified result first. */
    const fbox = $("#follow-list");
    if (fbox) {
      const follows = readFollows();
      if (!follows.length) {
        fbox.innerHTML = `<p class="center-note">You are not following any model yet. Open a model's record and choose Follow this model; its newest certified result will surface here, ahead of the full set.</p>`;
      } else {
        const nameOf = (mk, slug) => {
          const e = idx.find((x) => x.type === "model" && x.make === mk && x.slug === slug);
          return e ? formula(e.makeName, e.name, e.years) : slug;
        };
        const entries = follows.map((key) => {
          const [mk, slug] = key.split("/");
          const mine = all.filter((r) => r.make === mk && r.modelSlug === slug);
          return { key, mk, slug, latest: mine[0] || null };
        }).sort((a, b) => (b.latest?.saleDate || "").localeCompare(a.latest?.saleDate || ""));
        const lotsF = lotMapOf(all);
        fbox.innerHTML = `<div class="listings">${entries.map(({ mk, slug, latest }) => latest ? listingUnit(latest, { prov: true, lot: lotsF.get(lotKey(latest)), all, photo: photoOf(latest) }) : `
          <div class="listing">
            <span><span class="l-state">Following</span><a class="l-title" href="${modelUrl(mk, slug)}">${esc(nameOf(mk, slug))}</a><span class="l-date">No certified result for this model yet</span></span>
            <span class="l-price">Unrecorded</span>
            <span class="l-type">Record</span>
          </div>`).join("")}</div>`;
      }
    }

    const bands = [
      ["", "All prices"],
      ["u1", "Under 1,000,000", (r) => r.price < 1000000],
      ["1to5", "1,000,000 – 5,000,000", (r) => r.price >= 1000000 && r.price < 5000000],
      ["5to20", "5,000,000 – 20,000,000", (r) => r.price >= 5000000 && r.price < 20000000],
      ["o20", "Over 20,000,000", (r) => r.price >= 20000000],
    ];
    const recordFacets = [
      ["", "All records"],
      ["chassis", "Chassis recorded", (r) => !!r.chassis],
      ["condition", "Condition stated", (r) => !!r.condition],
      ["mileage", "Mileage stated", (r) => !!r.mileage],
    ];
    const makeSel = $("#f-make"), bandSel = $("#f-band"), recSel = $("#f-record");
    const makeCounts = {};
    for (const r of all) makeCounts[r.make] = (makeCounts[r.make] || 0) + 1;
    makeSel.innerHTML = `<option value="">All makes (${all.length})</option>` + Object.keys(makeCounts).sort((a, b) => all.find((r) => r.make === a).makeName.localeCompare(all.find((r) => r.make === b).makeName)).map((mk) => `<option value="${esc(mk)}">${esc(all.find((r) => r.make === mk).makeName)} (${makeCounts[mk]})</option>`).join("");
    bandSel.innerHTML = bands.map(([v, label, fn]) => `<option value="${v}">${esc(label)}${fn ? ` (${all.filter(fn).length})` : ""}</option>`).join("");
    recSel.innerHTML = recordFacets.map(([v, label, fn]) => `<option value="${v}">${esc(label)}${fn ? ` (${all.filter(fn).length})` : ""}</option>`).join("");
    const lotsAll = lotMapOf(all);
    const renderResults = () => {
      const mk = makeSel.value, band = bands.find((b) => b[0] === bandSel.value), rec = recordFacets.find((f) => f[0] === recSel.value);
      const list = all.filter((r) => (!mk || r.make === mk) && (!band || !band[2] || band[2](r)) && (!rec || !rec[2] || rec[2](r)));
      $("#pw-count").textContent = `Showing ${list.length} of ${all.length} certified results`;
      $("#results-grid").innerHTML = list.length ? `<div class="listings">${list.map((r) => listingUnit(r, { prov: true, lot: lotsAll.get(lotKey(r)), all, photo: photoOf(r) })).join("")}</div>` : `<p class="center-note">No certified result matches that combination. Clear the filters to see all ${all.length}.</p>`;
    };
    [makeSel, bandSel, recSel].forEach((el) => el.addEventListener("change", renderResults));
    $("#f-clear").addEventListener("click", () => { makeSel.value = ""; bandSel.value = ""; recSel.value = ""; renderResults(); });
    renderResults();
    const cgrid = $("#cohort-grid");
    if (cgrid) {
      const groups = {};
      for (const r of pw.results) {
        if (!r.modelSlug) continue;
        const key = `${r.make}/${r.modelSlug}/${r.currency}`;
        (groups[key] ||= []).push(r);
      }
      const cohorts = Object.values(groups).filter((g) => g.length >= 2)
        .sort((a, b) => b.length - a.length || a[0].model.localeCompare(b[0].model));
      cgrid.innerHTML = cohorts.map((g) => {
        const prices = g.map((r) => r.price);
        const lo = g[prices.indexOf(Math.min(...prices))], hi = g[prices.indexOf(Math.max(...prices))];
        const years = g.map((r) => r.year);
        const photo = photoOf(g[0]);
        /* T-CARS-1: figures come from the build-computed cohorts
           file where it loaded; a cohort at the n>=8 trigger prints
           its median as the benchmark rung, the rest print ranges. */
        const built = (cohortsDoc?.cohorts || []).find((c) => c.make === g[0].make && c.modelSlug === g[0].modelSlug && c.currency === g[0].currency);
        const benchLine = built?.benchmark
          ? `<br><span class="pw-price" style="font-weight:800">Cohort median ${esc(money2(built.median, built.currency))}</span> over the ${built.n} certified sales: the T-CARS-1 benchmark rung, computed in the build from certified records only; a median of past sales, not a valuation of any other example.`
          : `<br>Range over ${g.length} certified sales in ${esc(g[0].currency)}: context, not a valuation of any other example.`;
        return `
      <article class="row${photo ? " has-thumb" : ""}">
        <h3>${esc(g[0].makeName)} ${esc(g[0].model.split(" (")[0])}</h3><span class="t-sub">n=${g.length} certified${built?.benchmark ? " · benchmark cohort" : ""}</span>
        <p><span class="pw-price" style="font-weight:800">${esc(money(lo))} – ${esc(money(hi))}</span><br>Certified results span model years ${Math.min(...years)}–${Math.max(...years)}, sales ${esc(g.map((r) => r.saleDate).sort()[0])} to ${esc(g.map((r) => r.saleDate).sort().slice(-1)[0])}.${benchLine}</p>
        <div class="t-foot"><a href="${modelUrl(g[0].make, g[0].modelSlug)}">Atlas record →</a></div>${thumbFigure(photo, true)}
      </article>`;
      }).join("");
    }
    const note = $("#results-note");
    if (note) note.textContent = pw.note;
  } catch { /* results stay unpublished rather than guessed */ }
}

const page = document.body.dataset.page;
const boot = { home: initHome, make: initMake, model: initModel, clubs: initClubs, buy: initBuy }[page];
if (boot) boot().catch((err) => {
  const el = $("#js-error");
  if (el) { el.textContent = `Something failed to load (${err.message}). The atlas data may still be syncing; reload in a moment.`; el.classList.remove("hidden"); }
  console.error(err);
});

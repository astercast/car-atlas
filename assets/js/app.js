/* Car Atlas — client engine.
   One fetch of the search index powers the whole front door.
   Detail pages fetch only the make file they need. */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* Fleet Commons honest-fallback v1.0.0, Layer 2 (assets/js/
   fetch_deadline.js, copied verbatim): every load races a deadline.
   A fetch that never settles — the VP-0003 hang — now rejects into
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

/* ——— Instant search ——— */
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
  const name = e.type === "make" ? e.name : `${e.makeName} ${e.name}`;
  const meta = e.type === "make" ? `${e.modelCount} models` : `${e.years} · ${e.segment}`;
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
      : `<div class="empty">No match in the atlas yet. Coverage grows every wave — see COVERAGE notes on the home page.</div>`;
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

/* ——— Photos (placement pass, wave 4) ———
   Sourced photography from the Foundry manifest, wired through the
   dataset's photo/photos fields. The caption states honestly what
   the photograph shows; the credit line is the licence attribution
   and renders on every page that shows the photo. */
const photoFigure = (p, cls = "") => `
  <figure class="photo ${cls}">
    <img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy">
    <figcaption>${esc(p.caption)} · ${esc(p.credit)}</figcaption>
  </figure>`;
const photosHTML = (rec) => {
  const list = rec.photos && rec.photos.length ? rec.photos
    : (rec.photo ? [{ src: rec.photo, caption: rec.photoCaption, credit: rec.photoCredit }] : []);
  if (!list.length) return "";
  return photoFigure(list[0], "photo-main")
    + (list.length > 1 ? `<div class="photo-grid">${list.slice(1).map((p) => photoFigure(p)).join("")}</div>` : "");
};
const money = (r) => (r.currency === "EUR" ? "€" : "$") + Number(r.price).toLocaleString("en-US");

/* ——— Tiles ——— */
const modelTile = (e) => `
  <a class="tile" href="${modelUrl(e.make, e.slug)}">
    <div class="t-top"><h3>${esc(e.makeName)} ${esc(e.name)}</h3><span class="t-sub">${esc(e.years)}</span></div>
    <p>${esc(e.intro)}</p>
    <div class="t-foot">${esc(e.segment)} · ${esc((e.bodyStyles || []).join(" / "))}</div>
  </a>`;

/* ——— Home ——— */
async function initHome() {
  const idx = await fetchJSON("data/v1/search-index.json");
  const makes = idx.filter((e) => e.type === "make");
  const models = idx.filter((e) => e.type === "model");

  $("#stat-makes").textContent = makes.length;
  $("#stat-models").textContent = models.length;
  $("#stat-gens").textContent = models.reduce((n, m) => n + (m.generationCount || 0), 0);
  fetchJSON("data/v1/clubs.json").then((d) => { $("#stat-clubs").textContent = d.clubs.length; }).catch(() => {});

  wireSearch($("#q"), $("#q-results"), idx);
  const q = new URLSearchParams(location.search).get("q");
  if (q) { $("#q").value = q; $("#q").dispatchEvent(new Event("input")); }

  $("#makes-grid").innerHTML = makes.map((m) => `
    <a class="tile" href="${makeUrl(m.make)}">
      <div class="t-top"><h3>${esc(m.name)}</h3><span class="t-sub">${esc(m.country)}</span></div>
      <p>${esc(m.blurb)}</p>
      <div class="t-foot">${m.modelCount} models · est. ${m.founded}</div>
    </a>`).join("");

  // Editorial picks — resolved by name so the list survives slug drift.
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
    eraGrid.innerHTML = list.length ? list.map(modelTile).join("") : `<p class="center-note">Nothing seeded from this era yet — it's on the coverage roadmap.</p>`;
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

/* ——— Make page ——— */
async function initMake() {
  const slug = new URLSearchParams(location.search).get("make");
  const [makesData, file] = await Promise.all([fetchJSON("data/v1/makes.json"), fetchJSON(`data/v1/models/${slug}.json`)]);
  const meta = makesData.makes.find((m) => m.slug === slug);
  if (!meta) { $("#make-root").innerHTML = `<p class="center-note">Make not found.</p>`; return; }
  document.title = `${meta.name} — Car Atlas`;
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
    <section class="block"><div class="grid models">
      ${file.models.map((m) => modelTile({ ...m, make: slug, makeName: meta.name, generationCount: m.generations.length })).join("")}
    </div></section>
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org", "@type": "Brand",
      name: meta.name, description: meta.blurb,
      ...(meta.photo ? { image: meta.photo } : {}),
    }).replace(/</g, "\\u003c")}<\/script>`;
}

/* ——— Model page ———
   honest-fallback (VP-0003): Layer 1 paints the baked snapshot —
   the record's genuine essentials, baked into model.html at build
   time from the same dataset — synchronously, before any fetch.
   Layer 2 bounds the live load: 8 s per-loader deadline (the files
   are ~7 KB; a local load is milliseconds) plus the 12 s watchdog
   backstop. Terminal states: live record · labeled static snapshot
   with retry · honest error with retry. Never an eternal loader. */
const MODEL_DEADLINE_MS = 8000, MODEL_WATCHDOG_MS = 12000;

function renderBakedModel(root, mk, md) {
  const all = window.__CA_MODEL_ESSENTIALS__;
  const e = all && all[`${mk}/${md}`];
  if (!e) return false;
  document.title = `${e.makeName} ${e.name} — Car Atlas`;
  root.innerHTML = `
    <div class="crumb"><a href="index.html">Atlas</a> / <a href="${makeUrl(mk)}">${esc(e.makeName)}</a> / ${esc(e.name)}</div>
    <h1>${esc(e.makeName)} ${esc(e.name)}</h1>
    <p class="lede">${esc(e.intro)}</p>
    <div class="factrow">
      <div class="fact"><span>Years</span><b>${esc(e.years)}</b></div>
      <div class="fact"><span>Status</span><b>${esc(e.status)}</b></div>
      <div class="fact"><span>Segment</span><b>${esc(e.segment)}</b></div>
      <div class="fact"><span>Body styles</span><b>${esc(e.bodyStyles.join(", "))}</b></div>
      <div class="fact"><span>Generations</span><b>${e.generationCount}</b></div>
    </div>
    <div class="note-box"><b>Static snapshot</b>
      <p>Atlas data as of ${esc(window.__CA_DATASET_UPDATED_AT__ || "")} · static snapshot — the full record (every generation, trims, where to buy) replaces this on load.</p>
      <p id="model-load-status" aria-live="polite">Loading the full record…</p>
    </div>`;
  return true;
}

function modelStuck(root, baked, err) {
  const msg = `The full record didn't finish loading${err ? ` (${err.message})` : ""}.`;
  const wire = () => { const b = $("#model-retry", root); if (b) b.addEventListener("click", () => initModel()); };
  const st = baked && $("#model-load-status", root);
  if (st) {
    st.innerHTML = `${esc(msg)} You're reading the static snapshot above — this car's essentials, exactly as baked from the atlas data. <button class="chip" id="model-retry" type="button">Retry the full record</button>`;
  } else {
    root.innerHTML = `<p class="center-note">${esc(msg)} <button class="chip" id="model-retry" type="button">Retry</button></p>`;
  }
  wire();
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
  let makesData, file, buying, priceWatch;
  try {
    [makesData, file, buying, priceWatch] = await Promise.all([
      fetchJSON("data/v1/makes.json", { ms: MODEL_DEADLINE_MS }),
      fetchJSON(`data/v1/models/${mk}.json`, { ms: MODEL_DEADLINE_MS }),
      fetchJSON("data/v1/buying.json", { ms: MODEL_DEADLINE_MS }),
      /* Price Watch is an enhancement, never a gate: its failure
         must not stall the record (VP-0003 discipline). */
      fetchJSON("data/v1/price-watch.json", { ms: MODEL_DEADLINE_MS }).catch(() => null),
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
  document.title = `${meta.name} ${model.name} — Car Atlas`;
  const cls = buying.buyingClasses[model.buyingClass];
  const channels = (cls?.primaryChannels || [])
    .map((d) => buying.channels.find((c) => c.domain === d)).filter(Boolean);
  const [firstGen, ...restGens] = model.generations;
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
  root.innerHTML = `
    <div class="crumb"><a href="index.html">Atlas</a> / <a href="${makeUrl(mk)}">${esc(meta.name)}</a> / ${esc(model.name)}</div>
    <h1>${esc(meta.name)} ${esc(model.name)}</h1>
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
      <div class="block-head"><h2>Generations</h2><p>Every generation in the atlas, flagship specs first.</p></div>
      ${genHTML(firstGen)}
      ${restGens.length ? `<div id="more-gens" class="hidden">${restGens.map(genHTML).join("")}</div>
      <button class="chip" id="toggle-gens" aria-expanded="false">Show all ${model.generations.length} generations</button>` : ""}
    </section>
    <section class="block">
      <div class="block-head"><h2>Trims &amp; variants</h2></div>
      <div class="chips">${model.trims.map((t) => `<span class="pill">${esc(t)}</span>`).join("")}</div>
    </section>
    <section class="block" id="buy">
      <div class="block-head"><h2>Where to buy</h2><p>${esc(cls?.label || "")} — ${esc(cls?.description || "")}</p></div>
      <div class="grid two">
        ${channels.map((c) => `
          <a class="tile" href="https://${esc(c.domain)}" target="_blank" rel="noopener">
            <div class="t-top"><h3>${esc(c.name)}</h3><span class="t-sub">${esc(c.kind)}</span></div>
            <p>${esc(c.blurb)}</p>
            <div class="t-foot">${esc(c.domain)} ↗</div>
          </a>`).join("")}
      </div>
      ${(() => {
        const hits = (priceWatch?.results || []).filter((r) => r.make === mk && r.modelSlug === md);
        /* T-CARS-4: repeat-sale linking by shared chassis key. */
        const repeatsOf = (r) => r.chassis ? (priceWatch?.results || []).filter((x) => x !== r && x.chassis === r.chassis) : [];
        return hits.length ? `<div class="note-box"><b>Price Watch — auction results</b>
          ${hits.map((r) => `<p>${esc(r.year)} ${esc(r.model)} — sold for <b>${esc(money(r))}</b> at ${esc(r.event)}, ${esc(r.saleDate)}.${r.chassis ? ` Chassis ${esc(r.chassis)}.` : ""}${r.condition ? ` Condition (per source): ${esc(r.condition)}.` : ""}${r.mileage ? ` Mileage (per source): ${esc(r.mileage)}.` : ""}${repeatsOf(r).map((x) => ` Same chassis also sold ${esc(x.saleDate)} for ${esc(money(x))} at ${esc(x.event)}.`).join("")} <a href="${esc(r.source.url)}" target="_blank" rel="noopener">Source: ${esc(r.source.name)} ↗</a></p>`).join("")}
          <p class="small">A result is one specific car on one day — not a valuation of any other example. The full results set is on the <a href="buy.html">Buy page</a>.</p></div>`
        : `<div class="note-box"><b>Price Watch</b><p>Price Watch tracks certified auction results (on the <a href="buy.html">Buy page</a>); no certified result for this model yet, so none is shown. Listing aggregation and price-drop alerts remain later stages.</p></div>`;
      })()}
    </section>
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org", "@type": "Car",
      name: `${meta.name} ${model.name}`, brand: { "@type": "Brand", name: meta.name },
      description: model.intro, bodyType: model.bodyStyles.join(", "),
      ...(model.photo ? { image: model.photo } : {}),
    }).replace(/</g, "\\u003c")}<\/script>`;
  live = true; cancelWatchdog();
  const btn = $("#toggle-gens");
  if (btn) btn.addEventListener("click", () => {
    const box = $("#more-gens"), open = box.classList.toggle("hidden") === false;
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "Show fewer generations" : `Show all ${model.generations.length} generations`;
  });
}

/* ——— Clubs ——— */
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
      <article class="tile">
        <div class="t-top"><h3>${esc(c.name)}</h3><span class="t-sub">${esc(c.region)}</span></div>
        <p>${esc(c.description)}</p>
        <div class="t-foot">${esc(c.type)} · ${esc(c.chapterModel)}</div>
        <p class="small" style="margin-top:8px"><a href="https://${esc(c.website)}" target="_blank" rel="noopener">${esc(c.website)} ↗</a></p>
      </article>`).join("") : `<p class="center-note">No seeded club matches that filter yet — the registry grows every wave.</p>`;
  };
  $("#f-region").addEventListener("change", render);
  $("#f-marque").addEventListener("change", render);
  render();
}

/* ——— Buy ——— */
async function initBuy() {
  const data = await fetchJSON("data/v1/buying.json");
  $("#class-grid").innerHTML = Object.values(data.buyingClasses).map((c) => `
    <article class="tile">
      <div class="t-top"><h3>${esc(c.label)}</h3></div>
      <p>${esc(c.description)}</p>
      <div class="t-foot">${c.primaryChannels.length} primary channels</div>
    </article>`).join("");
  $("#channel-grid").innerHTML = data.channels.map((c) => `
    <a class="tile" href="https://${esc(c.domain)}" target="_blank" rel="noopener">
      <div class="t-top"><h3>${esc(c.name)}</h3><span class="t-sub">${esc(c.kind)}</span></div>
      <p>${esc(c.blurb)}</p>
      <div class="t-foot">${esc(c.era)} · ${esc(c.domain)} ↗</div>
    </a>`).join("");
  $("#watch-schema").innerHTML = data.priceWatch.schema.map((f) => `<li><span>${esc(f)}</span><span class="mut">field</span></li>`).join("");
  /* Price Watch stage 1 (wave 4): certified auction results. A
     failure here leaves the designed-in-open section standing —
     results are an addition, never a gate. */
  try {
    const pw = await fetchJSON("data/v1/price-watch.json");
    const grid = $("#results-grid");
    if (grid) grid.innerHTML = [...pw.results]
      .sort((a, b) => b.saleDate.localeCompare(a.saleDate))
      .map((r) => {
        const href = r.modelSlug ? modelUrl(r.make, r.modelSlug) : makeUrl(r.make);
        /* T-CARS-4: repeat-sale linking — records sharing a chassis
           key name each other on the tile. T-CARS-2: condition and
           mileage render only where a source stated them. */
        const repeats = r.chassis ? pw.results.filter((x) => x !== r && x.chassis === r.chassis) : [];
        const facts = [r.chassis ? `Chassis ${r.chassis}` : null,
          r.condition ? `Condition (per source): ${r.condition}` : null,
          r.mileage ? `Mileage (per source): ${r.mileage}` : null].filter(Boolean).join(" · ");
        return `
      <article class="tile">
        <div class="t-top"><h3>${esc(r.year)} ${esc(r.makeName)} ${esc(r.model)}</h3></div>
        <p class="pw-price">${esc(money(r))}</p>
        <p>${esc(r.event)} · ${esc(r.saleDate)}<br><span class="small mut">${esc(r.priceBasis)}</span></p>
        ${facts ? `<p class="small">${esc(facts)}</p>` : ""}
        ${repeats.map((x) => `<p class="small">Same chassis also sold ${esc(x.saleDate)} for ${esc(money(x))} at ${esc(x.event)}.</p>`).join("")}
        <div class="t-foot"><a href="${href}">Atlas record →</a> · <a href="${esc(r.source.url)}" target="_blank" rel="noopener">Source ↗</a></div>
      </article>`;
      }).join("");
    const note = $("#results-note");
    if (note) note.textContent = pw.note;
  } catch { /* results stay unpublished rather than guessed */ }
}

const page = document.body.dataset.page;
const boot = { home: initHome, make: initMake, model: initModel, clubs: initClubs, buy: initBuy }[page];
if (boot) boot().catch((err) => {
  const el = $("#js-error");
  if (el) { el.textContent = `Something failed to load (${err.message}). The atlas data may still be syncing — reload in a moment.`; el.classList.remove("hidden"); }
  console.error(err);
});

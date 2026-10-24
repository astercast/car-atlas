#!/usr/bin/env python3
"""Car Atlas build: validate the dataset and generate the search index.

Reads data/v1/makes.json + data/v1/models/*.json, writes
data/v1/search-index.json (the single file the homepage loads).
Fails loudly on schema drift so bad data never ships quietly.
"""
import json
import sys
from pathlib import Path

# Fleet Commons honest-fallback v1.0.0, bake layer — copied verbatim
# into scripts/bake_fallback.py; the build calls it, never forks it.
from bake_fallback import bake_page

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "v1"
BUYING_CLASSES = {"new", "used", "modern-classic", "vintage"}
MODEL_KEYS = {"slug", "name", "years", "status", "bodyStyles", "segment",
              "intro", "generations", "trims", "buyingClass", "collectorNote",
              # Placement pass (wave 4): sourced photography, wired by
              # build-time data edits from the Foundry manifest. Every
              # photo carries its caption + CC attribution line.
              "photo", "photoCaption", "photoCredit", "photoSource", "photos"}
PHOTO_KEYS = {"src", "caption", "credit", "source"}
GEN_KEYS = {"code", "name", "years", "note", "spec"}
SPEC_KEYS = {"engine", "power", "drivetrain"}


def fail(msg):
    print(f"BUILD ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def main():
    makes_doc = json.loads((DATA / "makes.json").read_text())
    makes = makes_doc["makes"]
    updated_at = makes_doc.get("updatedAt")
    make_slugs = {m["slug"] for m in makes}
    index, essentials, total_models, total_gens, notes_count = [], {}, 0, 0, 0

    files = {p.stem for p in (DATA / "models").glob("*.json")}
    if files != make_slugs:
        fail(f"make/model file mismatch: files={sorted(files)} makes={sorted(make_slugs)}")

    for make in makes:
        models = json.loads((DATA / "models" / f"{make['slug']}.json").read_text())["models"]
        index.append({
            "type": "make", "make": make["slug"], "slug": make["slug"],
            "name": make["name"], "country": make["country"],
            "founded": make["founded"], "blurb": make["blurb"],
            "modelCount": len(models),
        })
        seen = set()
        for model in models:
            extra = set(model) - MODEL_KEYS
            missing = {"slug", "name", "years", "status", "bodyStyles", "segment",
                       "intro", "generations", "trims", "buyingClass"} - set(model)
            if extra:
                fail(f"{make['slug']}/{model.get('slug')}: unexpected keys {extra}")
            if missing:
                fail(f"{make['slug']}/{model.get('slug')}: missing keys {missing}")
            if model["slug"] in seen:
                fail(f"{make['slug']}: duplicate model slug {model['slug']}")
            seen.add(model["slug"])
            if model["buyingClass"] not in BUYING_CLASSES:
                fail(f"{make['slug']}/{model['slug']}: bad buyingClass {model['buyingClass']}")
            for gen in model["generations"]:
                if set(gen) - GEN_KEYS:
                    fail(f"{make['slug']}/{model['slug']}: generation keys {set(gen) - GEN_KEYS}")
                if "spec" in gen and set(gen["spec"]) != SPEC_KEYS:
                    fail(f"{make['slug']}/{model['slug']}: spec keys must be {SPEC_KEYS}")
            for ph in model.get("photos", []):
                if not {"src", "caption", "credit"} <= set(ph) <= PHOTO_KEYS:
                    fail(f"{make['slug']}/{model['slug']}: photo keys must be src/caption/credit (+source)")
            if "photos" in model and model.get("photo") != model["photos"][0]["src"]:
                fail(f"{make['slug']}/{model['slug']}: photo must mirror photos[0]")
            total_models += 1
            total_gens += len(model["generations"])
            if model.get("collectorNote"):
                notes_count += 1
            index.append({
                "type": "model", "make": make["slug"], "makeName": make["name"],
                "slug": model["slug"], "name": model["name"], "years": model["years"],
                "status": model["status"], "segment": model["segment"],
                "bodyStyles": model["bodyStyles"], "intro": model["intro"],
                "buyingClass": model["buyingClass"],
                "generationCount": len(model["generations"]),
                # Layout rework (2026-10-15): the plate's fallback
                # signal on browse surfaces, the flagship (first)
                # generation's power figure, derived here from the
                # record so no browse surface recomputes it.
                "flagshipPower": next((g["spec"]["power"] for g in model["generations"]
                                       if g.get("spec", {}).get("power")), ""),
                # Sourced photography (wave 4 placement pass fields),
                # carried so index rows and listing units can embed
                # the model's photo where one is recorded.
                **({"photo": model["photo"], "photoCaption": model["photoCaption"],
                    "photoCredit": model["photoCredit"],
                    **({"photoSource": model["photoSource"]} if model.get("photoSource") else {})} if model.get("photo") else {}),
            })
            # honest-fallback Layer 1 input: the record's static
            # essentials, baked into model.html below so a stalled
            # load still paints the car's own page (VP-0003).
            essentials[f"{make['slug']}/{model['slug']}"] = {
                "makeName": make["name"], "name": model["name"],
                "years": model["years"], "status": model["status"],
                "segment": model["segment"], "bodyStyles": model["bodyStyles"],
                "intro": model["intro"],
                "generationCount": len(model["generations"]),
            }

    for name in ("clubs.json", "buying.json", "price-watch.json"):
        json.loads((DATA / name).read_text())
    pw = json.loads((DATA / "price-watch.json").read_text())
    for r in pw["results"]:
        if r["make"] not in make_slugs:
            fail(f"price-watch: unknown make {r['make']}")
        if not r.get("source", {}).get("url", "").startswith("http"):
            fail(f"price-watch: result for {r.get('model')} lacks a source URL")
    print(f"OK: price-watch holds {len(pw['results'])} certified auction results")

    # T-CARS-1 cohort machinery (stage 7, rotation 25): cohorts are
    # computed HERE, in the build, from certified records only —
    # model + single currency. Every cohort of n >= 2 publishes its
    # range and count; a cohort of n >= 8 (the priced trigger in
    # BENCHMARK.md) additionally publishes its median as the atlas's
    # cohort benchmark. No figure is computed from anything but the
    # certified set, and no median exists below the trigger.
    import statistics
    groups = {}
    for r in pw["results"]:
        if not r.get("modelSlug"):
            continue
        key = (r["make"], r["modelSlug"], r["currency"])
        groups.setdefault(key, []).append(r)
    cohorts = []
    for (mk, slug, cur), g in sorted(groups.items()):
        if len(g) < 2:
            continue
        prices = sorted(r["price"] for r in g)
        dates = sorted(r["saleDate"] for r in g)
        cohort = {
            "make": mk, "makeName": g[0]["makeName"], "modelSlug": slug,
            "modelName": g[0]["model"].split(" (")[0], "currency": cur,
            "n": len(g), "min": prices[0], "max": prices[-1],
            "firstSale": dates[0], "lastSale": dates[-1],
            "modelYears": [min(r["year"] for r in g), max(r["year"] for r in g)],
            "benchmark": len(g) >= 8,
        }
        if cohort["benchmark"]:
            cohort["median"] = statistics.median(prices)
        cohorts.append(cohort)
    cohorts.sort(key=lambda c: (-c["n"], c["makeName"], c["modelName"], c["currency"]))
    bench = [c for c in cohorts if c["benchmark"]]
    cohorts_doc = {
        "note": ("Cohorts computed by scripts/build.py from the certified "
                 "Price Watch results only (model + single currency). "
                 "n >= 2 publishes a range with its count; n >= 8 — the "
                 "T-CARS-1 trigger priced in BENCHMARK.md — additionally "
                 "publishes the cohort median as a benchmark. A median is "
                 "a statistic of certified sales, not a valuation of any "
                 "other example."),
        "source": "data/v1/price-watch.json",
        "cohorts": cohorts,
    }
    cohorts_path = DATA / "cohorts.json"
    cohorts_path.write_text(json.dumps(cohorts_doc, indent=1, ensure_ascii=False) + "\n")
    print(f"OK: {len(cohorts)} cohorts (n>=2) → {cohorts_path.relative_to(ROOT)}; "
          f"benchmark cohorts at n>=8: "
          + (", ".join(f"{c['makeName']} {c['modelName']}/{c['currency']} n={c['n']} "
                       f"median={c['median']:,.0f}" for c in bench) if bench else "none"))

    out = DATA / "search-index.json"
    out.write_text(json.dumps(index, indent=1, ensure_ascii=False) + "\n")
    print(f"OK: {len(makes)} makes, {total_models} models, {total_gens} generations → {out.relative_to(ROOT)}")

    # The Opening Spread (rotation 140, CA2): every number the
    # homepage presents is baked HERE from the stored records, never
    # a hand-copied literal — the folio counts, the Contents counts,
    # the Price Watch button count, and the cover car's price, basis,
    # venue, date, source and spec line (from its certified result
    # and its model record). app.js re-writes the folio and the two
    # door counts from the same data at runtime; the bake is what a
    # visitor (or a crawler) gets before that, and it must agree.
    import html as _html
    MONTHS = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"]

    def fmt_date(iso):
        y, m, d = (int(x) for x in str(iso).split("-"))
        return f"{d} {MONTHS[m - 1]} {y}"

    COVER_CHASSIS = "3413 GT"  # the issue's cover car, by its record
    cover = next((r for r in pw["results"] if r.get("chassis") == COVER_CHASSIS), None)
    if cover is None:
        fail(f"cover record missing: no certified result for chassis {COVER_CHASSIS}")
    ferrari = json.loads((DATA / "models" / "ferrari.json").read_text())["models"]
    gto = next((m for m in ferrari if m["slug"] == "250-gto"), None)
    if gto is None:
        fail("cover model missing: ferrari/250-gto")
    gspec = gto["generations"][0]["spec"]
    uy, um, _ud = (int(x) for x in str(pw["updatedAt"]).split("-"))
    folio_inner = (
        f'<span>The <b>{MONTHS[um - 1]} {uy}</b> issue</span><span class="sep">·</span>'
        f'<span>Atlas data as of <b>{fmt_date(pw["updatedAt"])}</b></span><span class="sep">·</span>'
        f'<span><b>{len(makes)}</b> makes, <b>{total_models}</b> models, '
        f'<b>{total_gens}</b> generations</span><span class="sep">·</span>'
        f'<span>Price Watch: <b>{len(pw["results"])}</b> certified auction results</span>')
    band_inner = (
        f'<p class="standfirst">Thirty-six were built, and the 250 GTO became the car '
        f'the whole hobby measures itself against. This one, chassis 3413 GT, is the '
        f'cover because the market still starts here.</p>'
        f'<div class="sale"><p class="sale-price">${cover["price"]:,}</p>'
        f'<p class="sale-basis">{_html.escape(cover["priceBasis"])}.</p>'
        f'<p class="sale-where"><b>{_html.escape(cover["event"])}</b>, '
        f'{fmt_date(cover["saleDate"])}<span id="cover-age"></span></p>'
        f'<p class="sale-src">Certified result. '
        f'<a href="{_html.escape(cover["source"]["url"])}" rel="noopener">'
        f'Source: {_html.escape(cover["source"]["name"])}</a></p></div>'
        f'<dl class="spec">'
        f'<div><dt>Engine</dt><dd>{_html.escape(gspec["engine"])}</dd></div>'
        f'<div><dt>Power</dt><dd>{_html.escape(gspec["power"])}</dd></div>'
        f'<div><dt>Drive</dt><dd>{_html.escape(gspec["drivetrain"])}</dd></div>'
        # "Built" is the model record's own count, stated in its intro
        # ("built 36 cars around the Colombo V12").
        f'<div><dt>Built</dt><dd>36 cars</dd></div></dl>'
        f'<p class="opener-go"><a href="model.html?make=ferrari&amp;model=250-gto">'
        f'The 250 GTO in the atlas <span aria-hidden="true">→</span></a></p>')
    contents_inner = (
        f'<li><a href="#atlas">The Atlas<span class="c-count" id="door-atlas">'
        f'{len(makes)} makes · {total_models} models · {total_gens} generations</span></a></li>'
        f'<li><a href="#price-watch">The Price Watch<span class="c-count" id="door-pw">'
        f'{len(pw["results"])} certified results · newest sales below, all of them on the Buy page</span></a></li>'
        f'<li><a href="#journal">The Journal<span class="c-count">'
        f'Notes on {notes_count} models · the river below</span></a></li>')
    home_path = ROOT / "index.html"
    home, baked, missing = bake_page(home_path.read_text(), {
        "index-folio": folio_inner,
        "index-cover-band": band_inner,
        "index-contents": contents_inner,
        "index-pw-n": str(len(pw["results"])),
    })
    if baked:
        home_path.write_text(home)
        print(f"OK: baked homepage issue layer (folio, cover band for chassis "
              f"{COVER_CHASSIS}, contents, price-watch count) → index.html")
    if missing:
        print(f"BUILD WARN: homepage regions not baked (markers missing): {missing}")

    # honest-fallback Layer 1 (bake): genuine essentials from the same
    # stored data, wholesale between the FB markers in model.html.
    # Idempotent; a missing marker warns instead of failing the build.
    blob = json.dumps(essentials, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    inner = ("<script>window.__CA_MODEL_ESSENTIALS__=" + blob
             + ";window.__CA_DATASET_UPDATED_AT__=" + json.dumps(updated_at) + ";</script>")
    page_path = ROOT / "model.html"
    page, baked, missing = bake_page(page_path.read_text(),
                                     {"model-essentials": inner})
    if baked:
        page_path.write_text(page)
        print(f"OK: baked model-essentials snapshot ({len(essentials)} models, "
              f"data as of {updated_at}) → model.html")
    else:
        print("BUILD WARN: model-essentials region not baked (marker missing in model.html)")


if __name__ == "__main__":
    main()

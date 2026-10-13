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
              "photo", "photoCaption", "photoCredit", "photos"}
PHOTO_KEYS = {"src", "caption", "credit"}
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
    index, essentials, total_models, total_gens = [], {}, 0, 0

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
                if set(ph) != PHOTO_KEYS:
                    fail(f"{make['slug']}/{model['slug']}: photo keys must be {PHOTO_KEYS}")
            if "photos" in model and model.get("photo") != model["photos"][0]["src"]:
                fail(f"{make['slug']}/{model['slug']}: photo must mirror photos[0]")
            total_models += 1
            total_gens += len(model["generations"])
            index.append({
                "type": "model", "make": make["slug"], "makeName": make["name"],
                "slug": model["slug"], "name": model["name"], "years": model["years"],
                "status": model["status"], "segment": model["segment"],
                "bodyStyles": model["bodyStyles"], "intro": model["intro"],
                "buyingClass": model["buyingClass"],
                "generationCount": len(model["generations"]),
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

    out = DATA / "search-index.json"
    out.write_text(json.dumps(index, indent=1, ensure_ascii=False) + "\n")
    print(f"OK: {len(makes)} makes, {total_models} models, {total_gens} generations → {out.relative_to(ROOT)}")

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

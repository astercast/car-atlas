#!/usr/bin/env python3
"""Screenshot validation for Car Atlas (wave 1).
ThreadingHTTPServer (parallel-safe) + Playwright headless Chromium."""
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "screenshots"
OUT.mkdir(exist_ok=True)

PAGES = [
    ("home.png", "index.html", None),
    ("search.png", "index.html", "#q|911"),
    ("make-porsche.png", "make.html?make=porsche", None),
    ("model-911.png", "model.html?make=porsche&model=911", None),
    ("make-lexus.png", "make.html?make=lexus", None),
    ("model-lfa.png", "model.html?make=lexus&model=lfa", None),
    ("make-delorean.png", "make.html?make=delorean", None),
    ("model-dmc-12.png", "model.html?make=delorean&model=dmc-12", None),
    ("clubs.png", "clubs.html", None),
    ("buy.png", "buy.html", None),
]

MOBILE_PAGES = [
    ("home-mobile.png", "index.html", None),
    ("model-lfa-mobile.png", "model.html?make=lexus&model=lfa", None),
    ("model-dmc-12-mobile.png", "model.html?make=delorean&model=dmc-12", None),
]


def main():
    handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{port}"
    errors = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1360, "height": 950})
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        for name, rel, act in PAGES:
            page.goto(f"{base}/{rel}", wait_until="networkidle")
            page.wait_for_timeout(600)
            if act:
                sel, text = act.split("|")
                page.fill(sel, text)
                page.wait_for_timeout(500)
            page.screenshot(path=str(OUT / name), full_page=(name != "search.png"))
            print(f"shot {name}")
        mobile = browser.new_page(viewport={"width": 390, "height": 844})
        mobile.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        mobile.on("pageerror", lambda e: errors.append(str(e)))
        for name, rel, act in MOBILE_PAGES:
            mobile.goto(f"{base}/{rel}", wait_until="networkidle")
            mobile.wait_for_timeout(600)
            mobile.screenshot(path=str(OUT / name))
            print(f"shot {name}")
        browser.close()
    server.shutdown()
    real_errors = [e for e in errors if "favicon" not in e]
    print("console/page errors:", real_errors if real_errors else "none")


if __name__ == "__main__":
    main()

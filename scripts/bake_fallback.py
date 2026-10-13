"""fleet-commons · honest-fallback v1.0.0 — bake layer (build time).

Copy verbatim, do not fork. Source of truth: trend-machine
scripts/build_site.py, the VP-0001 wave-30 fallback baker
(_fb_region / write_home_fallback) at c687d5f — generalized only
in the marker prefix and the caller interface; the substitution
semantics are the source's. Fixes belong in fleet-commons; sites
re-copy, never fork quietly.

The baker replaces whatever sits between a region's markers with
caller-rendered inner HTML, wholesale, at build time. Rendering
the rows from the site's stored data — markup that mirrors the
live renderer exactly — is the caller's job (see README.md for
the honesty rules the baked content must obey).

Marker contract:  <!--FB:<name>:BEGIN--> ... <!--FB:<name>:END-->
Trend's local spelling of the prefix is TMFB; the prefix is a
parameter, the contract is the shape.
"""
import re


def bake_region(page, name, inner, prefix="FB"):
    """Replace one region's content. Returns (page, found).
    A missing marker warns and leaves the page untouched for that
    region — a renamed region must not kill a build (the source's
    semantics), but the warning surfaces in the build log."""
    pat = re.compile(r"(<!--%s:%s:BEGIN-->).*?(<!--%s:%s:END-->)"
                     % (prefix, name, prefix, name), re.S)
    if not pat.search(page):
        print("[bake] WARN fallback: marker %s missing" % name)
        return page, False
    # lambda replacement: the inner HTML is data, never a regex
    # template — $ and \ in it must survive byte-for-byte.
    return pat.sub(lambda m: m.group(1) + inner + m.group(2),
                   page, count=1), True


def bake_page(page, regions, prefix="FB"):
    """Bake every region in `regions` (name -> inner HTML).
    Returns (page, baked_names, missing_names). Idempotent:
    baking the same regions twice changes nothing the second
    time, because replacement is wholesale between the markers."""
    baked, missing = [], []
    for name, inner in regions.items():
        page, found = bake_region(page, name, inner, prefix)
        (baked if found else missing).append(name)
    return page, baked, missing

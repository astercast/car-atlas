#!/usr/bin/env python3
# Round 2 (Claude consultation extract): lists unmatched Price Watch
# results with a likely model, for a human to approve. Read-only.
import json, glob

pw = json.load(open('data/v1/price-watch.json'))['results']
atlas = {}
for f in glob.glob('data/v1/models/*.json'):
    d = json.load(open(f))
    mk = f.split('/')[-1][:-5]
    for m in (d['models'] if 'models' in d else d):
        atlas.setdefault(mk, []).append((m['slug'], m['name']))
for r in pw:
    if r.get('modelSlug'):
        continue
    for slug, name in atlas.get(r['make'], []):
        if name.lower() in r['model'].lower():
            print(r['make'], '|', r['model'][:50], '->', slug)

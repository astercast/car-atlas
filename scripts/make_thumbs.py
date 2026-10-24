#!/usr/bin/env python3
# Round 2 (Claude consultation extract): a 640 px copy of every photo.
# In the extract's test of 60 files, 15 MB became 2.4 MB (16%).
# Listings load the -640 copy (srcset in assets/js/app.js); model
# pages keep the full photograph. Deviation from the paste-ready
# code, recorded: images already 640 px wide or narrower are skipped
# instead of upscaled (no photo in the current set is that small).
from PIL import Image
import glob, os

for f in sorted(glob.glob('assets/photos/*.webp')):
    if f.endswith('-640.webp'):
        continue
    out = f.replace('.webp', '-640.webp')
    if os.path.exists(out):
        continue
    im = Image.open(f)
    if im.width <= 640:
        continue
    im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS).save(out, 'WEBP', quality=76, method=4)
    print('thumb:', out)

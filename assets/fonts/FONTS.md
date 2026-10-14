# Self-hosted fonts, provenance

All files in this directory are SIL Open Font License (OFL) webfonts,
served locally so the site makes zero remote font requests.

| file | family | style | weight | role here |
|---|---|---|---|---|
| inter-latin-normal-var.woff2 | Inter | normal | 100 to 900 variable (wght axis, one file) | the only type voice: headlines, body, UI, tabular numerals |

Source: the latin subset file served by the Google Fonts css2 request
that this site previously loaded at runtime
(family=Inter:wght@400;600;700;800). That stylesheet returns one and
the same woff2 file for every requested weight, because the file is the
Inter variable font. The four weight declarations therefore collapse
into one self-hosted variable face declaring the full range the file
contains (100 to 900), which also covers the 650 and 750 weights the
stylesheet asks for.

- Source file: the Inter v20 latin subset woff2 (file name
  UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2 on the font CDN).
  The full source URLs are recorded in the QA-013 landing record and
  the commit message, so this repo carries zero remote font references.
- Stylesheet it came from: the css2 request named above, fetched
  with a Chrome user agent; latin subset, unicode-range U+0000-00FF
  plus the punctuation ranges in that block
- License: SIL Open Font License 1.1 (Inter is an OFL family)
- SHA-256: c940764593d0fe5d596be327ca7558855e018039fb78509aa21921fd3644c3e4
- Metrics measured from this file with fontTools: units per em 2048,
  hhea ascent 1984, hhea descent -494, line gap 0, x-height 1118,
  wght axis 100 to 900. The metric-adjusted fallback face in
  assets/css/style.css is derived from these against Liberation Sans
  (the Arial proxy): x-height 1082 at 2048 units per em.

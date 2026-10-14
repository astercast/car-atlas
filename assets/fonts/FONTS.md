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

## Rotation 23 addition: the serif partner

| file | family | style | weight | role here |
|---|---|---|---|---|
| newsreader-latin-normal-var.woff2 | Newsreader | normal | 200 to 800 variable (wght + opsz axes, one file) | the objects and the notes: record and lot titles, standfirsts, prose |
| newsreader-latin-italic-var.woff2 | Newsreader | italic | 200 to 800 variable (wght + opsz axes, one file) | italic in serif contexts |

- Source: the latin subset files served by the Google Fonts css2 request
  `family=Newsreader:ital,opsz,wght@0,6..72,400..800;1,6..72,400..800`
  (file names cY9AfjOCX1hbuyalUrK4397yjIJFJpc.woff2 normal,
  cY9CfjOCX1hbuyalUrK439vCjohCBJWxZA.woff2 italic, Newsreader v26).
  The css2 response declares weight 400 800 for these files; the files'
  own fvar axes run 200 to 800, and the @font-face declarations in
  style.css declare the full range the files contain, as with Inter.
- License: SIL Open Font License 1.1 (Newsreader is an OFL family).
- SHA-256: normal 01817351be3edfc1714fe6d60ddea6a22a169a5ebd033b50c7f9495e5d9c386a;
  italic a99fb127682b9af538780d21420037452197b0d37dfd273eb108f8a3665d5501.
- Metrics measured from the shipped normal file with fontTools: units
  per em 2000, hhea ascent 1470, hhea descent -530, line gap 0,
  x-height 852, wght axis 200 to 800, opsz axis 6 to 72. The
  metric-adjusted fallback face in style.css is derived from these
  against Liberation Serif (x-height 940 at 2048 upm, normalized 918
  at 2000 upm): size-adjust 852/918 = 92.81%; ascent override
  73.50/0.9281 = 79.19%; descent override 26.50/0.9281 = 28.55%.
  Newsreader is not preloaded: Inter carries first paint.

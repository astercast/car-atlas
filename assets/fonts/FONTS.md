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

## Rotation 140 addition: The Opening Spread faces (design consult, CA1)

| file | family | style | weight | role here |
|---|---|---|---|---|
| libre-caslon-display-latin-normal.woff2 | Libre Caslon Display | normal | 400 (single weight) | the issue voice: opener titles and the price numeral on the homepage (assets/css/issue.css) |
| schibsted-grotesk-latin-normal-var.woff2 | Schibsted Grotesk | normal | 400 to 900 variable (wght axis, one file) | the instrument voice on the homepage: folio, labels, specs, captions, interface |

- Source files: the latin subset woff2 files served by the Google Fonts
  css2 request the design draft pointed at
  (family=Libre+Caslon+Display&family=Schibsted+Grotesk:wght@400..700),
  fetched once at build time (rotation 140) and self-hosted here, so the
  shipped site makes zero remote font requests. The css2 stylesheet
  returns the Schibsted file across the full wght axis the file contains
  (400 to 900); the @font-face in issue.css declares that full range.
- Libre Caslon Display file: TuGOUUFxWphYQ6YI6q9Xp61FQzxDRKmzr1lWfxk.woff2
  on the font CDN. SHA-256:
  84267e937417f10dff37df818c5ef7f1e9f2e6a703e03c2dd286d3320af53269
  Metrics (fontTools): units per em 1000, hhea ascent 970, descent -266.
- Schibsted Grotesk file: Jqz55SSPQuCQF3t8uOwiUL-taUTtap9Gayo.woff2 on
  the font CDN. SHA-256:
  4c8b93f431d462c696e12b9d6a033feb3394d36e66e781357c496b95d8a75e05
  Metrics (fontTools): units per em 2048, hhea ascent 2000,
  descent -528, wght axis 400 to 900.
- Licenses: SIL Open Font License 1.1 (both families are OFL).
- Unicode range (both, latin subset): U+0000-00FF plus the punctuation
  ranges in the css2 latin block, declared on the @font-face rules in
  assets/css/issue.css.

# COVERAGE — what the atlas holds, and what it doesn't (yet)

Car Atlas aims at *every car ever made*. That is thousands of marques
and tens of thousands of models, so coverage ships in waves and this
file is the honest ledger. If a car isn't listed here as seeded, it
isn't in the atlas — no silent gaps dressed up as completeness.

## Seeded (waves 1–6, 2026-10-12/13)

**59 makes, 257 models, 469 generations** (exact counts are printed
by `scripts/build.py` and shown in the homepage stats strip).

Wave 1 makes: Toyota, Honda, Nissan, Mazda, Subaru, Hyundai, Ford,
Chevrolet, Jeep, Tesla, BMW, Mercedes-Benz, Porsche, Volkswagen,
Audi, Ferrari, Lamborghini, Volvo, Jaguar, Land Rover.

Wave 2 makes: Lexus, Alfa Romeo, Aston Martin, Cadillac, Dodge, GMC,
Kia, Lotus, Maserati, McLaren (47 models, 70 generations).

Wave 3 makes (historic batch 1, all defunct): DeLorean, Duesenberg,
Packard, Saab, Studebaker, Tucker, AMC, Pontiac, Oldsmobile,
Plymouth (41 models, 55 generations — Model J to DMC-12, Rocket 88
to Turbo X).

For each seeded make: its most significant models, with 1–3 landmark
generations each and flagship specs. Depth first; breadth follows.

Wave 4 depth upgrade: the four icons — Porsche 911 (8 generations),
Chevrolet Corvette (8), Ford Mustang (7), Toyota Land Cruiser (8) —
now carry their full generation lists, 19 generations added.

Wave 5 makes (historic batch 2, all defunct): Cord, Hudson, Nash,
Kaiser, Stutz, Triumph, Austin-Healey, Jensen, TVR (36 models,
48 generations — the 810/812 and the Hornet, the TR line and the
Big Healeys, the Interceptor and the Bearcat).

Also seeded: 46 clubs/networks — national level for most marques,
with chapter-level entries (regional chapters with their own
calendars) beginning in wave 2, and marque clubs for the wave-3,
wave-5 and wave-6 historic makes — plus 13 buying channels and 4 buying classes.

Wave 6 makes (historic batch 3, all defunct): Austin, Borgward,
De Tomaso, Facel Vega, Iso, NSU, Panhard, Simca, Talbot-Lago, Willys
(41 models, 48 generations — the Mini and the Ro80, the teardrop
Talbot and the wartime Jeep, the Pantera and the Isabella).

Photography (wave 4): 49 real, CC-licensed photographs from Wikimedia
Commons are wired to 40 model records and all 40 make records, each
with its honest caption and attribution line on the page. One
exception, stated plainly: the Ferrari 250 GTO photograph sits on
the Ferrari make page — there is no 250 GTO model record yet.

## Not yet covered — the roadmap

**Makes, next waves (living):** Abarth, Bentley, Bugatti, Citroën,
DS, Fiat, Genesis, Infiniti, Isuzu, Koenigsegg, Lucid, MINI,
Mitsubishi, Pagani, Peugeot, Polestar, Ram, Renault, Rimac, Rivian,
Rolls-Royce, SEAT, Škoda, Smart, Spyker, Suzuki.

**Makes (historic/defunct — the "ever made" promise demands them):**
Austin, Borgward, De Tomaso, Facel Vega, Iso, Marlin, MG (pre-SAIC
lineage), Morgan (living, listed in spirit), NSU, Opel, Panhard,
Saturn, Simca, Talbot-Lago, Vauxhall, Willys. (Batch 1 — AMC,
DeLorean, Duesenberg, Oldsmobile, Packard, Plymouth, Pontiac, Saab,
Studebaker, Tucker — seeded in wave 3. Batch 2 — Austin-Healey,
Cord, Hudson, Jensen, Kaiser, Nash, Stutz, Triumph, TVR — seeded
in wave 5.)

**Depth upgrades planned per seeded make:** full generation lists
for the remaining models (the four icons were completed in wave 4),
engine-variant tables, production figures, motorsport records,
successor/predecessor links, market notes per generation.

**Clubs:** chapter-level data (city, meeting cadence, event calendars),
more regions (South America, Middle East, South & Southeast Asia,
Africa), model-specific registries (air-cooled Porsche, early Bronco,
rotary, and hundreds more).

**Buying layer:** Price Watch stage 1 shipped in wave 4 and grew
in wave 5; stage 2 (wave 7) extended the certified set to
19 auction results, stage 3 (wave 8) extended it again to
28 auction results, stage 4 (wave 9) extended it again to
37 auction results, and stage 5 (wave 10) extended it again to
46 auction results in
`data/v1/price-watch.json`, each with its published source, and
recorded further skips in the file (an Alfa Romeo 8C 2900B
whose sale day sources do not pin, the first Shelby Cobra,
which has no marque record here, and a Ferrari 250 GT SWB
California Spider whose sale day sources do not pin, a
Bentley Blower, which has no marque record here, and a Bugatti
Type 57 Atalante, which has no marque record here). Stage 5
also linked seven earlier results to model pages the atlas
already carried (DB5, F40, LaFerrari, T150, SL, and both GT40
records) and gave every result a chassis key plus
source-stated condition/mileage fields. Stage 6 (wave 11, the
world-benchmark delta pass) extended it again to 56 auction
results — eight of its ten new results link to model pages
(DB5, F40, Miura ×2, Model J, MC12, Tucker 48, Barracuda),
condition now stands at 11/56 and mileage at 7/56, and the Buy
page gained the first cohort rung: ranges computed only from
certified records sharing a model and a currency, count shown,
labelled context not a valuation. One further skip was recorded
(a Bugatti Veyron, which has no marque record here). Stage 7
(rotation 25) extended the set to 66 results — all ten new results
link to model pages (F40 ×7, Miura ×2, DB5); condition now stands
at 13/66, mileage at 12/66, chassis at 49/66 — and shipped the
T-CARS-1 cohort machinery: six new F40 sales in euros took the
F40/EUR cohort to n=8, the priced trigger, so cohorts are now
computed in `scripts/build.py` and published in
`data/v1/cohorts.json`, median printed at n≥8. Stage 7 also
certified the 2021 sale of Miura chassis 3378, the first chassis
to appear twice in the set. Stage 8 (rotation 26) extended the
set to 83 results — all 17 new results link to model pages
(Corvette ×5, Ford GT ×6, Model J ×3, DB5 ×3); condition now
stands at 16/83, mileage at 17/83, chassis at 61/83 — and took
the Ford GT dollar cohort to n=8, the second cohort at the
T-CARS-1 trigger, printing its median beside the F40's. Stage 9
(rotation 27) extended the set to 96 results — all 13 new results
link to model pages (Corvette ×3, Model J ×4, DB5 ×3, Miura ×3);
condition now stands at 19/96, mileage at 21/96, chassis at 72/96 —
and took the Corvette dollar cohort to n=10 (median $454,750) and
the Model J dollar cohort to n=9 (median $1,655,000), the third and
fourth cohorts at the T-CARS-1 trigger. Three 1967 Corvette L88
candidates were skipped and recorded: their sources disagree on
the final price. Stage 10
(rotation 28) extended the set to 107 results — all 11 new results
link to model pages (DB5 ×3 in dollars, Miura ×3 in dollars and
×5 in euros); condition now stands at 25/107, mileage at 27/107,
chassis at 81/107 — and took the DB5 dollar cohort to n=8 (median
$1,108,000), the Miura dollar cohort to n=8 (median $2,285,000)
and the Miura euro cohort to n=8 (median €1,347,750), the fifth,
sixth and seventh cohorts at the T-CARS-1 trigger. Three further
candidates were skipped and recorded: a Miura SV whose sources
disagree on the sale day, a Miura S whose sources disagree on the
currency of the result, and a DB5 held to the pass's corroboration
standard. Stage 11
(rotation 29) extended the set to 119 results — all 12 new results
link to model pages (F40 ×6 in dollars, DB5 ×5 in euros and ×1 in
dollars); condition now stands at 30/119, mileage at 33/119,
chassis at 90/119 — and took the F40 dollar cohort to n=8 (median
$3,732,500) and the DB5 euro cohort to n=8 (median €776,588), the
eighth and ninth cohorts at the T-CARS-1 trigger, re-deriving the
DB5 dollar median at $1,100,000 over nine sales. The DB5 in
dollars is chassis DB5/1990/L, certified in this pass on fresh
corroboration after its stage-10 hold. Two further candidates
were skipped and recorded: two DB5 sales in euros whose sources
date the sale only to a two-day event. Stage 12
(rotation 30) extended the set to 125 results — all 6 new results
link to the McLaren F1 model page (sales in dollars from 2006 to
2026, chassis 014, 062, 066, 073, 044 and the F1 GTR 10R);
condition now stands at 32/125, mileage at 36/125, chassis at
96/125 — and took the F1 dollar cohort to n=8 (median
$14,685,000), the tenth cohort at the T-CARS-1 trigger, so every
cohort of two or more is now a benchmark cohort. Five further
candidates were skipped and recorded: three whose sources
disagree on the figure or its basis, one sealed sale whose
result was never published, and one whose house-published
currency could not be established. Stage 13
(rotation 31) extended the set to 130 results — 5 new results
link to the Toyota 2000GT model page (certified dollar sales
2013–2020); condition now stands at 33/130, mileage at 40/130,
chassis at 100/130 — and opened the 2000GT dollar cohort at n=6,
a range-only cohort below the median trigger. Three further
candidates were skipped and recorded. Stage 14
(rotation 32) extended the set to 133 results — 3 new results,
all Toyota 2000GT dollar sales (2015–2021, one of them the second
certified sale of chassis MF1010088); condition now stands at
33/133, mileage at 41/133, chassis at 102/133 — and worked the
2000GT dollar cohort from n=6 to n=9, past the median trigger
(median $880,000), so every cohort of two or more is again a
benchmark cohort and no range-only cohort remains. Three
further candidates were skipped and recorded. Stage 15
(rotation 33) extended the set to 136 results — 3 new results,
all Mercedes-Benz 300 SL Gullwing dollar sales at RM Sotheby's
Amelia Island (2017–2022), opening the SL dollar cohort at n=4
on the standing SL record; condition now stands at 33/136,
mileage at 44/136, chassis at 105/136. The eleven benchmark
cohorts stand; the 300 SL cohort stands as the one range
cohort, below the median trigger. Two further candidates were
skipped and recorded. Stage 16 (rotation 34) extended the set
to 140 results — 4 new results, all Mercedes-Benz 300 SL
Gullwing dollar sales (Gooding & Company Amelia Island 2023;
RM Sotheby's Arizona 2022; Bonhams' Quail Auction 2022; RM
Sotheby's Monterey 2018), taking the SL dollar cohort from
n=4 to n=8, past the median trigger (median $1,723,750);
condition now stands at 33/140, mileage at 48/140, chassis
at 109/140. Twelve benchmark cohorts now stand and no
range-only cohort remains. Two further candidates were
skipped and recorded. Stage 17 (rotation 35) extended the set
to 143 results — 3 new results (a 1991 Ferrari F40 at RM
Sotheby's SHIFT/Monterey 2020; a 1969 Lamborghini Miura
P400 S and a 1955 Mercedes-Benz 300 SL Gullwing, both at RM
Sotheby's Elkhart Collection 2020), deepening the F40, Miura
and 300 SL dollar cohorts from n=8 to n=9 each; condition
now stands at 33/143, mileage at 51/143, chassis at 112/143.
Four further candidates were skipped and recorded. Stage 18
(rotation 36) extended the set to 146 results — 3 new results
(two 1955 Mercedes-Benz 300 SL Gullwings, at RM Sotheby's
Monterey 2023 and Gooding & Company Amelia Island 2024; a
1972 Lamborghini Miura P400 SV at Broad Arrow Auctions'
Monterey Jet Center sale 2024), deepening the 300 SL dollar
cohort from n=9 to n=11 and the Miura dollar cohort from
n=9 to n=10; condition now stands at 36/146, mileage at
54/146, chassis at 115/146. Six further candidates were
skipped and recorded. Stage 19 (rotation 37) extended the set
to 148 results — 2 new results (two Lamborghini Countach
LP400 Periscopo sales at Gooding & Company's Pebble Beach
auctions, 2014 and 2018), opening the Countach dollar cohort
at n=2; mileage now stands at 56/148, chassis at 117/148.
One further candidate was skipped and recorded. Stage 20
(rotation 38) extended the set to 151 results — 3 new results
(three Lamborghini Countach sales at Gooding & Company:
Amelia Island 2018 and two at Pebble Beach 2021), deepening
the Countach dollar cohort from n=2 to n=5; condition now
stands at 39/151, mileage at 57/151, chassis at 120/151.
Eight further candidates were skipped and recorded. Stage 21
(rotation 39) extended the set to 154 results — 3 new results
(two Lamborghini Countach sales at Gooding & Company, Pebble
Beach 2012 and Amelia Island 2010, and one at RM Sotheby's
Monterey 2022), deepening the Countach dollar cohort from
n=5 to n=8, which fires the median trigger; condition now
stands at 40/154, mileage at 59/154, chassis at 123/154.
Nine further candidates were skipped and recorded. The standing
benchmark against the top car sites in the world — the named set,
the scorecard, and the priced T-CARS-1 / T-CARS-5 closures — lives
in `BENCHMARK.md`. Still planned: listings ingest adapters for
the channels in `buying.json`.

## Accuracy standard

Specs are written from knowledge we're confident in, hedged with a
range or omitted when we aren't. A missing number is a gap we admit;
a wrong number is a bug. Report errors by opening an issue against
the data file in question.

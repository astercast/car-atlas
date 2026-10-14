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
the final price. The standing
benchmark against the top car sites in the world — the named set,
the scorecard, and the priced T-CARS-1 / T-CARS-5 closures — lives
in `BENCHMARK.md`. Still planned: listings ingest adapters for
the channels in `buying.json`.

## Accuracy standard

Specs are written from knowledge we're confident in, hedged with a
range or omitted when we aren't. A missing number is a gap we admit;
a wrong number is a bug. Report errors by opening an issue against
the data file in question.

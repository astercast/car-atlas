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
19 auction results in
`data/v1/price-watch.json`, each with its published source, and
recorded two further skips in the file (an Alfa Romeo 8C 2900B
whose sale day sources do not pin, and the first Shelby Cobra,
which has no marque record here). Still planned: listings ingest adapters for
the channels in `buying.json` and cohort medians computed from
certified records only.

## Accuracy standard

Specs are written from knowledge we're confident in, hedged with a
range or omitted when we aren't. A missing number is a gap we admit;
a wrong number is a bug. Report errors by opening an issue against
the data file in question.

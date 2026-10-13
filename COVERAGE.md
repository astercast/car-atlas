# COVERAGE — what the atlas holds, and what it doesn't (yet)

Car Atlas aims at *every car ever made*. That is thousands of marques
and tens of thousands of models, so coverage ships in waves and this
file is the honest ledger. If a car isn't listed here as seeded, it
isn't in the atlas — no silent gaps dressed up as completeness.

## Wave 1 — seeded (2026-10-12)

**20 makes, 92 models, 229 generations** (exact counts are printed
by `scripts/build.py` and shown in the homepage stats strip).

Makes: Toyota, Honda, Nissan, Mazda, Subaru, Hyundai, Ford, Chevrolet,
Jeep, Tesla, BMW, Mercedes-Benz, Porsche, Volkswagen, Audi, Ferrari,
Lamborghini, Volvo, Jaguar, Land Rover.

For each seeded make: its most significant models, with 1–3 landmark
generations each and flagship specs. Depth first; breadth follows.

Also seeded: 22 clubs/networks (national level), 13 buying channels,
4 buying classes.

## Not yet covered — the roadmap

**Makes, next waves (living):** Abarth, Alfa Romeo, Aston Martin,
Bentley, Bugatti, Cadillac, Citroën, Dodge, DS, Fiat, Genesis, GMC,
Infiniti, Isuzu, Kia, Koenigsegg, Lexus, Lotus, Lucid, Maserati,
McLaren, MINI, Mitsubishi, Pagani, Peugeot, Polestar, Ram, Renault,
Rimac, Rivian, Rolls-Royce, SEAT, Škoda, Smart, Spyker, Suzuki.

**Makes (historic/defunct — the "ever made" promise demands them):**
AMC, Austin, Austin-Healey, Borgward, Cord, DeLorean, De Tomaso,
Duesenberg, Facel Vega, Hudson, Iso, Jensen, Kaiser, Marlin, MG
(pre-SAIC lineage), Morgan (living, listed in spirit), Nash, NSU,
Oldsmobile, Opel, Packard, Panhard, Plymouth, Pontiac, Saab, Saturn,
Simca, Studebaker, Stutz, Talbot-Lago, Triumph, Tucker, TVR, Vauxhall,
Willys.

**Depth upgrades planned per seeded make:** full generation lists
(the 911 alone has eight), engine-variant tables, production figures,
motorsport records, successor/predecessor links, market notes per
generation.

**Clubs:** chapter-level data (city, meeting cadence, event calendars),
more regions (South America, Middle East, South & Southeast Asia,
Africa), model-specific registries (air-cooled Porsche, early Bronco,
rotary, and hundreds more).

**Buying layer:** Price Watch stage 1 — ingest adapters for the
channels in `buying.json`, cohort medians per model-year, public
results tracking for the auction houses.

## Accuracy standard

Specs are written from knowledge we're confident in, hedged with a
range or omitted when we aren't. A missing number is a gap we admit;
a wrong number is a bug. Report errors by opening an issue against
the data file in question.

# Art direction and production ledger

Style: cinematic historical fantasy illustration, premium collectible card art, atmospheric storytelling. Original work only; no borrowed game interface, frame, mascot or character designs. Shared frame/particle/icon assets are allowed, shared main illustrations across unrelated events are not.

Composition: portrait main illustration, readable subject at iPhone size, deliberate light direction, distinct silhouette. Text is rendered by the app for localization and Dynamic Type; do not bake card text into art. Every authored card has a specific scene, objects/characters, materials, light and palette in `assets/art_manifest.json`.

| Era | Materials and palette | Narrative focus | Audio direction |
|---|---|---|---|
| Paleolithic | Rock, bone, charcoal, ochre/fire | Survival, oral memory, legitimacy | Cave wind, stone, sparse percussion |
| Neolithic | Clay, reed, flax, sage | Land, water, grain ownership | Canal water, wood, working rhythms |
| Bronze | Copper/bronze, clay seals, teal | Cities, debt, trade, written law | Furnaces, market voices, strings |
| Ancient | Marble, mosaic, ivory/gold | Citizenship, expansion, logistics | Crowds and ceremonial drums |
| Medieval | Parchment, stained glass, plum/silver | Feudal obligations, plague, faith | Rain, bells, bowed strings |
| Renaissance | Oil paint, engraving, sienna/gold | Patronage, experiment, reform | Workshop acoustics, lute |
| Exploration | Maps, compass, ocean/parchment | Maritime power, exchange, exploitation | Rigging, waves, chamber ensemble |
| Industrial | Steel, soot, rust/copper | Labor, urban growth, ecology | Steam, machinery, low pulse |
| Modern | Original collage, muted green | Mass politics, diplomacy, war | Radio texture, restrained orchestra |
| Digital | Glass, graphite/cyan | Privacy, networks, automation | Data pulses, quiet electronics |
| AI/Space | Ceramic, holographic violet/white | Autonomy, rights, colony dependence | Habitat hum, synthesis |
| Interstellar | Cosmic indigo/gold | Distance, identity, posthuman futures | Spacious harmonics, stellar ambience |

## Actual assets

- `card_sacred_fire`: generated with built-in imagegen, copied into `App/Assets.xcassets/card_sacred_fire.imageset`. Inspected visually: elder/child, winter forest, fire, original painterly composition, no text. Final production/color/performance acceptance remains pending.
- `card_river_tracks`: generated with built-in imagegen and integrated in its asset-catalog image set. Paleolithic scout, wild grain, river mud and migrating herd visually checked; exact prompt in `assets/generation_prompts.json`.
- All other 46 authored illustrations: missing. SpriteKit draws an explicitly temporary original settlement silhouette; this is not counted as card art.
- `decision.wav`: original deterministic two-tone prototype, 220 ms, mono PCM16 at 44.1 kHz. Quiet envelope and app gain limit. Not a finished sound-design pack.
- Studio mascot/logo, game logo, App Store icon, 12 music sets, 12 ambience tracks, 39+ additional effects: missing.

## Presentation backlog

Fifteen animation presets are reserved by validation, but only basic SwiftUI transitions, SpriteKit fire flicker and haptic variation exist. Need selection tilt, outcome-specific light/particles, state-count animations, skippable cinematic era transformation and Reduce Motion alternatives. Profiling and screen QA must precede a 60 FPS claim.

## Image-generation prompt record

Built-in imagegen; historical-scene; original event illustration for `sacred_fire`. Paleolithic cave mouth, elder woman and child in hide clothing beside a small hearth, bare grove in winter distance. Dilemma: burn the last wood or preserve the forest. Ochre/charcoal, warm lower-left fire against cold blue night, painterly materials, restrained emotion, 2:3 portrait, readable central subjects, no text/border/logo/watermark, no existing game references. Exact submitted prompt is recorded in `assets/generation_prompts.json`.

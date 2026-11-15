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
- `card_first_granary`: original Neolithic generated candidate integrated in its asset-catalog image set; exact prompt recorded. Stylized timber-key detail and final historical/device acceptance remain pending.
- All other 73 authored illustrations: missing. SpriteKit draws an explicitly temporary original settlement silhouette; this is not counted as card art.
- `decision.wav`: original deterministic two-tone prototype, 220 ms, mono PCM16 at 44.1 kHz. Quiet envelope and app gain limit. Not a finished sound-design pack.
- Studio mascot/logo, game logo, App Store icon, 12 music sets, 12 ambience tracks, 39+ additional effects: missing.

## Presentation backlog

Fifteen animation presets are reserved by validation, but only basic SwiftUI transitions, SpriteKit fire flicker and haptic variation exist. Initial selection tilt with Reduce Motion fallback is implemented in EventCardView. Outcome-specific light/particles, state-count animations and skippable cinematic era transformation remain open. Profiling and screen QA must precede a 60 FPS claim.

## Image-generation prompt record

Built-in imagegen; historical-scene; original event illustration for `sacred_fire`. Paleolithic cave mouth, elder woman and child in hide clothing beside a small hearth, bare grove in winter distance. Dilemma: burn the last wood or preserve the forest. Ochre/charcoal, warm lower-left fire against cold blue night, painterly materials, restrained emotion, 2:3 portrait, readable central subjects, no text/border/logo/watermark, no existing game references. Exact submitted prompt is recorded in `assets/generation_prompts.json`.

## First-three-era presentation standard — 2026-11-15

EventCardView shares rounded framing, serif title/body hierarchy and wrapping minimum-48-point choice content with 14-point padding. Era accents: ochre, sage, bronze. Main illustrations retain their full aspect ratio in a 210-point art well with a dim blurred backdrop; the decorative backdrop alone may crop. At accessibility text sizes, the art well is 140 points and stats use one column. The scroll view keeps long descriptions/options reachable; fitting all information on one screen is not a goal. Selection tilts for 180ms before the actual saved transaction; controls guard double taps and re-enable after save failure. Leaving the card cancels pending motion. Reduce Motion performs the transaction immediately without tilt/entrance movement. Full preset choreography and FPS profiling remain open.

first_granary is a new original built-in imagegen candidate (grain basket, clay/reed granary, families, timber key). Prompt and provenance are recorded. The two original images are untouched. Three actual candidates exist; 73 illustrations remain missing. Historical details (including stylized wooden key), color/performance and physical-device acceptance remain review items; generation is not final historical/art approval. No new production sound/music is delivered in this group.

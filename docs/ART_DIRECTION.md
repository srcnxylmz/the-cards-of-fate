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
- Current inventory: fifteen real candidates / 105 missing illustrations across 120 cards; see the 120-card ledger below. SpriteKit draws an explicitly temporary original settlement silhouette; this is not counted as card art.
- `decision.wav`: original deterministic two-tone prototype, 220 ms, mono PCM16 at 44.1 kHz. Quiet envelope and app gain limit. Not a finished sound-design pack.
- Studio mascot/logo, game logo, App Store icon, 12 music sets, 12 ambience tracks, 39+ additional effects: missing.

## Presentation backlog

Fifteen animation presets are reserved by validation, but only basic SwiftUI transitions, SpriteKit fire flicker and haptic variation exist. Initial selection tilt with Reduce Motion fallback is implemented in EventCardView. Outcome-specific light/particles, state-count animations and skippable cinematic era transformation remain open. Profiling and screen QA must precede a 60 FPS claim.

## Image-generation prompt record

Built-in imagegen; historical-scene; original event illustration for `sacred_fire`. Paleolithic cave mouth, elder woman and child in hide clothing beside a small hearth, bare grove in winter distance. Dilemma: burn the last wood or preserve the forest. Ochre/charcoal, warm lower-left fire against cold blue night, painterly materials, restrained emotion, 2:3 portrait, readable central subjects, no text/border/logo/watermark, no existing game references. Exact submitted prompt is recorded in `assets/generation_prompts.json`.

## First-three-era presentation standard — 2026-11-15

EventCardView shares rounded framing, serif title/body hierarchy and wrapping minimum-48-point choice content with 14-point padding. Era accents: ochre, sage, bronze. Main illustrations retain their full aspect ratio in a 210-point art well with a dim blurred backdrop; the decorative backdrop alone may crop. At accessibility text sizes, the art well is 140 points and stats use one column. The scroll view keeps long descriptions/options reachable; fitting all information on one screen is not a goal. Selection tilts for 180ms before the actual saved transaction; controls guard double taps and re-enable after save failure. Leaving the card cancels pending motion. Reduce Motion performs the transaction immediately without tilt/entrance movement. Full preset choreography and FPS profiling remain open.

first_granary is a new original built-in imagegen candidate (grain basket, clay/reed granary, families, timber key). Prompt and provenance are recorded. The two original images are untouched. Three actual candidates exist; 73 illustrations remain missing. Historical details (including stylized wooden key), color/performance and physical-device acceptance remain review items; generation is not final historical/art approval. No new production sound/music is delivered in this group.

## Historical 90-card presentation and assets

Existing three images retained. Original green_stone (Neolithic copper discovery) and smoke_shift (Bronze worker health) built-in imagegen candidates integrated; five total, 85 missing. Same portrait well and era frame standard. Stat label/value now share one text run and the scroll viewport clips at its safe-area boundary; native TR/EN normal/large pixel checks passed at 0be976a; intermittent historical first-paint cause unconfirmed. card-open and choice-soft are original 240/120ms synthesized prototypes with bounded envelopes, not finished music/ambience. Actual device listening, historical/legal image approval and FPS profiling remain open.

Native asset integration verified in run 43731255529: five illustration fixtures resolve real second choices; new copper-workshop and foundry PNGs render full portrait scenes in the shared frame. Real captures inspected; entrance-frame opacity varies during the intentional animation. Safe-area clipping verified on SE 3. These are candidates, with 85 missing current illustrations and full physical/art/audio acceptance still open.


## 105-card production workflow

Ten actual portrait candidates are registered; 95 illustrations remain missing. The five new candidates are winter_porters (Paleolithic migration), fallow_strips and reed_fever (Neolithic land/care), furnace_wood and salt_ship (Bronze production/trade). Existing five image bytes are preserved. The furnace candidate was edited to replace industrial-looking stacks with low clay kilns and a later-looking axe with a plain bronze head; original and edit prompt/reference hashes are retained. These are generated candidates, not historical/legal/art-direction approval.

Every manifest row contains authored brief, modelPrompt, status and generationRecords. Missing assets have no file and no fabricated production record. For a real generation: submit its prompt through the available image tool, inspect the result, then run node tools/register-art.mjs --card CARD --source INSPECTED.png --prompt-file EXACT_PROMPT.txt (optional --reference ORIGINAL.png for an edit). Registration refuses existing catalog/image paths and records SHA-256, actual tool, source and registration time; model and generation timestamp remain unknown when not exposed. Rebuild with node tools/build-content.mjs; check with node tools/art-audit.mjs. Original output files remain untouched.

The builder emits UITests/ArtFixtures.json from actual file-backed assets. Native tests load it from their bundle and exercise all ten images, reachable second choices and a turn-1 result; the granary fixture retains large text/Reduce Motion. New candidates do not change the established card-frame, fitted portrait ratio, stat OCR or safe scroll clipping. Simulator integration passed all ten fixtures in [run 43739396488](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43739396488); all five new art captures and stable furnace/carrier choice frames were reviewed. Full portrait ratio and readable, reachable wrapped options were retained; entrance captures can show partial animation opacity. Physical-device color, memory, hearing, real accessibility settings and final production acceptance remain separate.


## 120-card production ledger

Five new actual candidates for new cards: marsh_raft, well_roster, quay_exchange, bread_bond, mine_shoring. Fifteen real images total, 105 missing. Existing ten PNG/catalogs are preserved. Mine picks and tall smoking stacks were corrected in a targeted edit before registration; initial/edit prompts, superseded source hash, reference hash and selected output hash are retained. These are candidates, not expert period/anatomical/legal approval. No new sound file or finished music was generated; three existing prototype cues and their API-start/mute test remain.

Missing-asset model prompts now regenerate from the current authored scene, while exact submitted generation/edit prompts remain unchanged. Art audit checks actual PNG/hash/catalog/card pairing. The generated art fixture inventory includes every real candidate; its native test chooses a genuinely enabled option without inventing history. Native review of five new scenes is pending.

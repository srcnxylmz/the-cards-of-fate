# Game design

## The player’s role

The player stewards a civilization and inherited leadership tradition, not an immortal ruler. A turn is a historical decision unit. Calendar years will be era-specific presentation; leaderboard scores use valid decisions, never raw calendar years.

The emotional loop: read the state → face an intelligible dilemma → choose a cost → see the result → recognize a later echo. No automatic next-card advancement before the player reads the consequence. Target session duration remains 45–90 minutes; current content and unmeasured pacing do not meet that target yet.

## Implemented rules

Six normalized stats (0–100): population, resources, authority, knowledge, stability, environment. The initial balance is JSON-configured. Resources drain every turn; a granary reduces, but never eliminates, baseline consumption. At zero resources population and stability decline. Zero population ends the run. Zero environment with very low stability gives a distinct collapse. Zero authority produces exile rather than immediate death. Authority 60 can win or regain leadership.

Rivals gain power each turn and exert pressure every four turns if stronger and insufficiently friendly. Choices alter their relationships. Every 24 turns a new generation inherits flags, discoveries, buildings and history, with an authority cost and knowledge gain. This is an initial model; individual successor traits, coalitions, distinct era factions, military/health/diplomacy/equality substats and scalable census/stock models remain pending.

Outcome weights are normalized from authored probabilities. A declared affinity stat multiplies a weight by `0.5 + stat / 100`, so knowledge can improve a risky option without introducing hidden random draws. The UI distinguishes predictable and conditional outcomes. More specific risk previews remain pending.

Probability calculation is now shared between decision resolution and simulation policy analysis, with regression coverage for normalization and unchanged RNG state. Generational succession is resolved before leadership scoring, so losing the last authority during succession immediately removes leadership. Result records include the additional historical consequences of the turn; the SwiftUI result screen renders their explanations alongside stat changes (result/save flows are now verified by Simulator smoke tests; broader consequence-layout/device QA remains open).

Delayed consequences store due turn, minimum era, effect and narrative text. They apply once when both gates hold. Flags persist across generations. Story chains are not complete simply because cards share a chain name; actual dependencies must be authored and checked.

## Progression

Era 1 → 2: cultivation, knowledge ≥55, stability ≥35, population ≥25. Era 2 → 3: smelting, knowledge ≥68, same social thresholds. Era 3’s next-era requirements are defined, but advancement stops because era 4 has no authored cards. Never present empty future-era metadata as playable content.

Each future era needs multiple discovery paths, era-specific faction motivations, settlement upgrades with visible changes, environmental pressure, historical research and a tailored crisis economy. The 12 eras are defined in bundled `eras.json`; visual and narrative intent appears in `ART_DIRECTION.md` and `CONTENT_BIBLE.md`.

## First dilemmas

- Preserve the winter forest: a short-term population cost can unlock a later village forest-law event.
- Burn the forest: immediate relief can cause a flood after agriculture begins.
- Shelter strangers: a later Bronze Age caravan repays the ancestral debt.
- Accept seed bondage: a later debt tablet forces the city to confront inherited servitude.
- Protect public water or commercial warehouses: the city wall reflects whose lives the government prioritizes.

These are manually authored situations. Repeated generic actions are not counted as unique cards.

## Remaining design work

30 authored endings with genuine preconditions and personalized retrospective narration; 100 connected chains; 50 cross-era dependencies; adaptive music; choice-specific animation choreography; meaningful adversarial AI; weekly balance; multiple run history; persistent collection and achievements; full technology trees; tutorial and onboarding. Current history export shares actual recorded events as text, not a finished illustrated share card.

## Council support revision

POLITICS.md supersedes the earlier monotonic faction-power description. Factions now follow an era-specific economic/cultural power base; friendly support and public stability contribute to council defense. Paid joint work and finite pacts give the player strategic influence, with persistent costs/cooldowns. Two hostile groups can coordinate opposition. This remains a partial political system, not the full successor/legitimacy model.

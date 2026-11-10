# Master development plan

Full requirements: `MASTER_SPEC.md`. Target: commercially polished, offline-first iPhone civilization survival game. All original scope remains active. This repository is a foundation checkpoint, not delivery approval.

| Phase | Deliverables and acceptance | Current status |
|---|---|---|
| 0 | Architecture, 12-era guide, schema, acceptance ledger, real source | Initial documents and source exist; design needs further depth |
| 1 | iPhone build; deterministic decisions; result acknowledgment; atomic save; start/end tests | Native build and 2 TR/EN UI smoke tests verified at 6bd22bc; current core has 32 passing tests |
| 2 | 180 distinct first-three-era events, rivals, settlements, legacy, artwork and transitions | 48 events; 15 explicit cross-era links; faction support/pacts and initial opposition coalition implemented; richer politics, content and production art remain |
| 3 | 300 era 4–8 events, diplomacy/trade/war/science, visual/audio integration | Planned; era metadata only |
| 4 | 240 era 9–12 events, modern/AI/space systems, endings | Planned; era metadata only |
| 5 | 80 extra events; 800 total; 100 complete chains; 50 cross-era links; 30 endings | Not met |
| 6 | Original branding/icon, unique card art, 15 animation types, 12 scores/ambiences, 40 effects | Two illustrations; one prototype cue; presentation prototypes |
| 7 | Weekly Game Center, custom rankings, retry, week isolation, production configuration | Adapter and week logic written; account/device tests pending |
| 8 | 10,000 actual engine simulations; pacing, skill balance, localization/accessibility/offline QA | 10,000 seeds × 3 strategies executed on Windows; balance/production QA incomplete |
| 9 | Signed release, privacy/licensing, App Store metadata, screenshots, TestFlight | Checklist drafted; release blocked |

## Architecture decisions

- Swift Package `FateCore` contains all game rules and content. No UIKit, wall clock, global RNG or network inside decision rules; caller injects time for weekly validation.
- SwiftUI uses transactional state publication: decide into a copy, atomically save it, then expose it. A result must be acknowledged before another event is selected.
- SplitMix64 state and currently selected card persist together. Save/reload before choosing cannot reroll an outcome.
- Sorted weighted card selection prioritizes unseen events. Story conditions and cooldowns are never relaxed; an exhausted development deck is explicitly reported.
- Story/hard use one save slot, weekly uses another. Weekly starts Monday 00:00 UTC, changes to an unranked continuation after expiry. Strong anti-cheat requires future server verification.
- XcodeGen is a build-time tool only. No external runtime dependencies or online generative story API.
- Minimum iOS 16. Device QA matrix includes SE-size screens and large Dynamic Type. 60 FPS is a target, not a measured claim.

## Stage gates

Do not mark Phase 1 complete until `swift test` and simulator `xcodebuild` actually pass. Fix critical failures before expanding content. No production release while any acceptance ledger item lacks evidence. Later metadata/scaffolding does not mean a later phase is completed.

Every checkpoint must record files, implemented behavior, commands actually executed, failures, missing assets and next steps in `PROGRESS.md`. Never substitute a JavaScript replica simulation for the Swift engine’s balance evidence.

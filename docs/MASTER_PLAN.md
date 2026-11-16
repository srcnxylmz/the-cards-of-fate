# Master development plan

Full requirements: `MASTER_SPEC.md`. Target: commercially polished, offline-first iPhone civilization survival game. All original scope remains active. This repository is a foundation checkpoint, not delivery approval.

| Phase | Deliverables and acceptance | Current status |
|---|---|---|
| 0 | Architecture, 12-era guide, schema, acceptance ledger, real source | Initial documents and source exist; design needs further depth |
| 1 | iPhone build; deterministic decisions; result acknowledgment; atomic save; start/end tests | 120-card source 0592d02 verified: 83 Swift (78 Core, five diagnostics), six UI tests; full run 43766155674, evidence in NATIVE_120_EVIDENCE.md |
| 2 | 180 distinct first-three-era events, rivals, settlements, legacy, artwork and transitions | 120 events (40/40/40); 90 static cross-era references and two self-reviewed/tested closed chains; tested debt/hospitality branches; faction support/pacts and initial opposition coalition implemented; richer politics, content and production art remain |
| 3 | 300 era 4–8 events, diplomacy/trade/war/science, visual/audio integration | Planned; era metadata only |
| 4 | 240 era 9–12 events, modern/AI/space systems, endings | Planned; era metadata only |
| 5 | 80 extra events; 800 total; 100 complete chains; 50 cross-era links; 30 endings | Not met |
| 6 | Original branding/icon, unique card art, 15 animation types, 12 scores/ambiences, 40 effects | Fifteen generated illustration candidates; three prototype cues; presentation prototypes |
| 7 | Weekly Game Center, custom rankings, retry, week isolation, production configuration | Adapter and week logic written; account/device tests pending |
| 8 | 10,000 actual engine simulations; pacing, skill balance, localization/accessibility/offline QA | Same-seed 52/64/76/90/105 studies × four policies executed on Windows; five 10,000-seed policies verified in 90-card native CI; 105-card six-policy native gate passed at 3d589af / run 43739396488 (70 Swift, 39 Node, six UI tests); balance/production QA incomplete |
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


## 120 checkpoint boundary

83 Swift / 48 Node / six UI tests passed in full native run 43766155674; six native 10,000-seed reports exactly match Windows final reports. Artifact review accepted; physical-device/production gates remain open. New food coverage/invoice, contextual work and saved bond closure are implemented without changing the five diagnostic score policies or opening Era 4. Future imperial mechanics and transition dependencies are documented in ERA4_READINESS.md; a single experimental fourth-era card must not masquerade as a complete era. Next: design the 120 → 135 group from measured exposure and unfinished city crises.

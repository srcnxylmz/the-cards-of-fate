# Master development plan

Full requirements: `MASTER_SPEC.md`. Target: commercially polished, offline-first iPhone civilization survival game. All original scope remains active. This repository is a foundation checkpoint, not delivery approval.

| Phase | Deliverables and acceptance | Current status |
|---|---|---|
| 0 | Architecture, 12-era guide, schema, acceptance ledger, real source | Initial documents and source exist; design needs further depth |
| 1 | iPhone build; deterministic decisions; result acknowledgment; atomic save; start/end tests | 135-card source80a7bf5 verified:92 Swift (84 Core,eight diagnostics),six UI tests; full run43908707917 attempt4, evidence in NATIVE_135_EVIDENCE.md |
| 2 | 180 distinct first-three-era events, rivals, settlements, legacy, artwork and transitions | 135 events (45/ 45/ 45); 102 static cross-era references, two preserved chains and one new self-reviewed/tested closed chain; tested debt/hospitality branches; faction support/pacts and initial opposition coalition implemented; richer politics, content and production art remain |
| 3 | 300 era 4–8 events, diplomacy/trade/war/science, visual/audio integration | Started (195 package, branch phase3-era4-groundwork): explicit Era content gate (disabled), 15 Era 4 events (9 recurring / 3 bridges / 3 conclusions), flag-based provincial ledger; Era 4 closed until 40/24/8/8 inventory, explicit enablement and native evidence. Swift/native verification of this package pending |
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


## 135 boundary

92 local Swift / 51 Node passed. Same-seed local/native six-policy measurement is complete. Source80a7bf5 / run43908707917 attempt4 passed92 Swift,51 Node,six UI tests and full build/install/launch. All native fields match local final reports and actual artifacts were reviewed; first three account failures remain historical. Native checkpoint accepted; balance and production/device gates remain open. Maintain Era 4 closure through the 180-card phase and sufficient later inventory. New conversion ledger covers past mold/water/pasture/toll/bond/guest histories without active fourth-era rules. After acceptance, design 135 → 150 from measured ecology, workforce, technology opportunity costs and distinct narrative conflicts; add five per era, deepen further closed chains and actual art.


## 195 boundary (Phase 3 start)

Era 4 groundwork is authored but unplayable: `EraContentGate.enabled=false` and inventory 15/40. Node 70/70 pass; Swift tests written, not executed (no toolchain in the authoring environment); no simulation or native run. First action for the next agent: run `swift test`, six 10,000-seed policies and `tools/compare-reference195.mjs`, then native CI. See HANDOFF_195_CODEX.md.

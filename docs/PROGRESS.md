# Progress checkpoint — 2026-11-10

## Current status

**Project not complete; 36-card rivalry revision and UI flows verified at `dffeea8`.** Master scope is preserved verbatim in `MASTER_SPEC.md`. Simulator automation is operational; Phase 2 content and simulation development continues.

## Support and pact investigation — 2026-11-10

Continuation requirements are preserved in CONTINUATION_REQUEST.md. Clean local/remote HEAD 2287550 confirmed before work. All nine requested project documents were reviewed.

- Instrumented actual authority changes without altering gameplay; reproduced all three 2287550 baseline policies exactly on seeds 0..<10000. Archived diagnostic reports in baselines/2287550.
- Survival: 73,240 broken_spear.hearing choices; 724,606 authority lost to council; exile final triggers 544 council, 722 succession, 587 card effects. 283,329 decision snapshots had hostile power at 100. Existing policies ignore relations, so aggregate exile is not a human skill measurement.
- Implemented JSON-configured economic/cultural faction power, friendly defense, stability-based legitimacy, common opposition, paid joint work, cooldowns, finite council pacts, betrayal/expiry and inherited support. Pressure damage remains five. See POLITICS.md for exact rules and limits.
- Added optional v1 political state and save validation; no state reset, RNG draw or score increase from political transactions. Meclis panel now exposes real actions, rules and faction values.
- 26 Swift tests and 18 content tests pass locally. Tests include cost/cooldown/score restrictions, old saves/replay, pact expiry/betrayal/succession, support/legitimacy, hostile coalition, bounded faction growth and observer neutrality. Three-policy comparisons plus a separate managed-council experiment are recorded in BALANCE_REPORT.md.
- Added a third native UI test for actual council opening, negotiation, stat cost, unchanged turn/card, save restoration and cooldown. Native execution is pending this milestone push; do not mark the council UI verified until CI and screenshots are inspected.
- Next: pass native gate, then author a batch of 10–15 distinct first-three-era cards with targeted faction effects and reachable historical branches. The 90-card intermediate and 180-card first-three-era targets remain open. Full leadership, audiovisual, accessibility and 12-era master scope remain incomplete.

## Previous rivalry milestone — 2026-11-10

- Confirmed all steps passed on the previous documentation push, run 42688637013 (f0250fd), and fast-forward synchronized origin without losing work.
- Added optional targeted effect map `rivalRelations`; old v1 effects still decode. Broken Spear now creates opposing hunter/keeper reactions instead of changing both equally. Other cards retain authored common deltas for now.
- Stable faction IDs retain power/relations through first-three-era identities (Hunters → Field Council → Bronze Guild; Memory Keepers → Ancestors → Scribes). Council UI displays era-appropriate motivations, including for existing saves.
- Every fourth turn the strongest eligible opponent challenges the player, with stable ID tie-breaking. A friendly strongest faction no longer shields a weaker opponent. Hunters affect authority; keepers affect stability. At most one challenge occurs per meeting and its explanation is included in history/results.
- Local verification: **19 Swift tests and 18 content tests passed**, zero content errors/warnings. Three-policy simulation comparison recorded in BALANCE_REPORT.md. Remote validation: [run 42838850246](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42838850246) at `dffeea8`: all steps passed, including 19 Swift tests, 18 content tests, 30,000 simulations, native build/install/launch, and 2 TR/EN UI tests (89.585 seconds, zero failures). Artifact `13776020493` contains 12 test PNGs, accessibility hierarchies, xcresult and diagnostics; downloaded locally for inspection.
- This is an initial differentiation step, not a complete rival system: coalitions, support actions, successor traits, data-driven faction profiles and broader targeted card authoring remain open. Existing weekly balance-version pinning concern remains.

## Previous session: Simulator UI automation

Fetched origin and verified a clean `main` matching `origin/main`; no user changes overwritten. GitHub connector confirmed every job step succeeded in [run 42666624049](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42666624049), including Swift/content tests, 30,000 simulations, XcodeGen and simulator build. macOS/Xcode is available through CI and is no longer a general development blocker.

Added real Turkish/English XCUITest flows, Debug-only isolated test saves, stable accessibility identifiers, installed-simulator discovery, install/launch, screenshot export and crash/log artifacts. Details in `UI_TESTING.md`. **Remote run 42668076933 passed all steps** at commit `6bd22bc`: 2 UI tests / 0 failures on iPhone 16 / Xcode 16.4. Downloaded artifact 13696279860 and visually inspected TR menu, card and result PNGs. Launch, real decisions, stat deltas and disk resume are verified. Earlier unexecuted-iOS statements below describe the previous Windows-only checkpoint and are superseded by this section.

## Current content milestone: 36 cards

- Added 12 individually authored bilingual events in `tools/content/legacy-events.mjs` (four per first-three era), bringing content to **36 cards / 72 choices**. Seven multi-card chain groups and nine explicit cross-era links; not seven fully finished master-plan chains.
- New historical follow-ups use actual required flags. Eight one-shot events close through explicit outcome flags; no reissuing the same resolved dispute. Tests prove sources unlock their follow-ups and every choice closes them.
- Event selection now exhausts eligible unseen events before considering repeats. Cooldowns and prerequisites are preserved, weighted choice remains within the selected pool. This changes future event sequences versus older builds; current saved cards/results still load. Balance/content revisions are not yet version-pinned for weekly competition, which remains a release concern.
- Added `first20TurnsRepeatRate` to real-engine simulation reports. Archived 24-card data under `docs/baselines/24-cards/` before running 10,000 seeds per policy again.
- **16 Swift tests pass; 15 content tests pass; content audit has zero errors/warnings.** Three 10,000-run simulations completed. Random-repeat rate fell 54.34% → 42.79%; survival 93.33% → 84.73%; knowledge 93.69% → 88.20%. These improve variety but do not establish final balance.
- Added original `card_river_tracks` illustration with exact prompt/provenance, integrated through the asset catalog. Two generated illustrations now exist; 34 current cards still need production art. Result-button text now uses a dark foreground for contrast. UI menu derives the content count rather than hardcoding 24.
- **Remote validation passed:** commit `ab7f0c8`, [run 42687508772](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42687508772). All steps succeeded: 16 Swift tests, 15 content tests, 30,000 simulations, native build/install/launch, 2 TR/EN smoke tests, screenshots and diagnostic upload. UI tests: 88.802 seconds / zero failures. Downloaded artifact `13705113923`; visually confirmed the river illustration renders and result-button contrast is improved. The larger art moves the second choice below the initial viewport; scrolling remains available, but broader small-screen/large-text QA remains necessary.

The initial workspace was empty. The current repository is connected to `srcnxylmz/the-cards-of-fate`. Windows/PowerShell runs Node v24.11.1 and Swift 6.4.2 core checks; GitHub macOS runs Xcode and Simulator verification. No Apple signing, App Store Connect or Game Center account configuration has been performed.

## Files and implemented behavior

- `Package.swift`, `project.yml`, `.github/workflows/ios.yml`: pure Swift library, macOS test/simulation runner and generated native iOS project configuration, simulator build workflow.
- `Sources/FateCore/Models.swift`, `SeededRandom.swift`, `GameEngine.swift`: seeded weighted selection, six bounded stats, transactional choices, normalized state-dependent outcome weights, delayed consequences gated by era/turn, history, flags, discoveries, buildings, rivals, leadership/exile recovery, generational succession, two actual collapse conditions. Empty eligible deck explicitly reports development-content exhaustion, not an authored ending.
- `Persistence.swift`: atomic JSON writes, saved RNG/current card/result, schema header check; corrupt/unsupported data reports an error. Real migration implementation awaits a prior schema to migrate.
- `App`: SwiftUI menu/play/results/history/collection/settings/weekly ranking; separate story and weekly save slots, unranked expired-week continuation remains in weekly slot; SpriteKit settlement placeholder; core haptics and AVFoundation cue; GameKit authentication, own/top scores and persistent best-score retry queue with occurrence checks.
- `tools/build-content.mjs`, `tools/content/legacy-events.mjs` and bundled JSON: 36 hand-authored TR/EN events (12 per first-three era), 72 choices, three probabilistic decisions, 12 era definitions, balance and transition technology data. Later eras are metadata only.
- `App/Assets.xcassets`: original generated `sacred_fire` and `river_tracks` illustrations integrated by asset name; exact prompts and provenance saved. 34 authored card illustrations missing.
- `App/Resources/decision.wav`: original 220 ms prototype cue. Twelve music and twelve ambience assets missing; required 40-effect library not complete.
- `tools/validate-content*`: executable validator and 18 automated tests. `Tests/FateCoreTests`: 19 passing Swift tests. `UITests/FateSmokeTests.swift`: 2 native smoke tests. `Sources/FateSimulation`: production-core simulation with random, survival and knowledge policies and atomic JSON output. `tools/swift-windows.ps1`: repeatable Windows setup/test/simulation helper.
- All six required project documents plus schema, release checklist, asset provenance and complete master specification are saved.

## Historical Windows checkpoint evidence

1. `node tools/synthesize-audio.mjs` — succeeded, generated WAV.
2. `node tools/build-content.mjs` — succeeded, generated 24 cards and 12 eras.
3. `node --test tools/validate-content.test.mjs` — **15 passed / 0 failed**.
4. `node tools/validate-content.mjs` — **zero structural errors**. Three incomplete single-card chain groups flagged. Report in `content-report.json`.
5. Generated illustration visually inspected in tool output; subject/style/no-text checked, final device rendering not verified.
6. `node tools/validate-content.mjs --release` — expected exit code **1**, release blocked with zero structural errors and unmet scope/platform requirements.
7. Saved asset integrity checked: PNG signature and catalog path, PCM WAV RIFF/data lengths, 44.1 kHz / 0.22 s; all six required documents exist; ten Swift test methods counted. Passed. These checks do not replace image rendering or audio listening on-device.

8. Swift 6.4.2 Windows Debug build and initial ten XCTest tests passed. Reviewed the simulation/leadership code and fixed succession resolving after leadership scoring: an heir with zero authority now enters exile immediately, without a phantom leadership turn.
9. Added shared normalized outcome probability analysis without RNG consumption. Added optional result consequences so delayed effects, succession and leadership changes appear in the result screen. Existing v1 result records lacking the field still decode; verified by regression test.
10. `./tools/swift-windows.ps1 -Task Test` — **13 passed / 0 failed**. Log: `swift-test-windows.log`. First cold compilation emitted SDK `wchar_t` module warnings; successful builds also emit a `.build/debug` or `.build/release` symlink warning on this host. Neither prevented tests or executable runs. No system configuration was changed to hide warnings.
11. Initial `swift run -c release FateSimulation 10000` completed; baseline saved as `simulation-results.json`. After code changes, executed **10,000 seeds each under three policies** using the Windows helper, all exit code 0: `simulation-random.json`, `simulation-survival.json`, `simulation-knowledge.json`. See `BALANCE_REPORT.md`. They represent 30,000 runs over the same 10,000 seeds, not 30,000 unique seeds.

At this initial Windows checkpoint Apple-platform checks were unexecuted. The successful native build/UI evidence at the top of this document supersedes that limitation. Physical-device QA, Game Center and audiovisual performance remain open.

## Scope ledger

| Requirement | Actual | Outstanding |
|---|---|---|
| ≥800 original cards | 36 | 764 minimum, correctly distributed |
| ≥60 per era | 12 each in eras 1–3; zero in 4–12 | 144 more for Phase 2, 540 for eras 4–12, 80 special |
| ≥100 completed chains | No fully approved chains; 7 multi-card groups | Branching, closure, reachability and editorial completion |
| ≥50 cross-era links | 9 explicit links detected | 41+ and full validation |
| ≥30 endings | 2 collapse predicates | 28+ unique designed fates and narrative summaries |
| Card illustrations | 2 generated candidates | 34 current + all future content; final visual approval |
| Audio | 1 prototype cue | 12 music, 12 ambience, 40 production effects |
| Animations | Basic transitions/flicker/haptics | 15 distinct coordinated presets, cinematic eras |
| 10,000 simulations | 10,000 seeds × 3 policies executed; reports saved | High repetition and censored long runs; expand content and rebalance with human playtests |
| Release | Scaffolding/checklist | Full acceptance, signing, console setup, TestFlight |

## Next exact actions

1. Expand targeted decisions in eras 2–3 and design bounded faction support/coalitions. Investigate survival-policy exile increase before adding further pressure. Add native council-panel screenshot assertions; current smoke tests cover the main game/save flow, not detailed faction presentation. Keep existing saves compatible; reuse Simulator automation after each milestone.
2. Use the 36-card comparison in `BALANCE_REPORT.md`. Strategic repetition remains 85–88%; 14.42% of knowledge-policy runs reach the 500-turn cap. Expand unique crises/legacy consequences and investigate sustainable loops. Do not equate heuristic results with human skill or pacing.
3. Test iPhone UI in Turkish/English at smallest size/large text/VoiceOver/Reduce Motion; ensure save failures preserve current state and double taps cannot resolve twice. Game Center tests require the owner’s account configuration.
4. Deepen the first-three-era systems and author 144 additional distinct cards to reach 180. Continue leadership/rival differentiation and successor traits. Finish initial chains; thematic grouping alone does not count.
5. Continue sequentially through master phases 3–9. Keep every blocker and unexecuted check explicit. Do not replace missing production assets with placeholders and call release ready.

## Known limitations to address

No full secondary-stat model, census/stock simulation, individualized successor traits, branching technology tree, achievements, persistent cross-run collection/history, personal-record dashboard, full error/technology-name localization, tutorial, backup recovery, all 30 endings, branding/icon, premium animations or complete audio. Most cards still share a common relation delta; Broken Spear uses targeted deltas. Faction pressure is differentiated, but support/coalitions are not implemented. Save version dispatch rejects unknown versions; it does not yet transform old schemas. Static reachability checks are approximate, not proof of every chain’s playability. Sound/music settings exist but only one prototype sound is available.

The small event pool permits repetition and may exhaust under conditions/cooldowns. This is visibly labeled development behavior and must be eliminated as a content bottleneck before release.

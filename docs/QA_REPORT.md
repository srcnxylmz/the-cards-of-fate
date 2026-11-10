# QA report — 2026-11-09

## Latest verified milestones

Native runtime: commit `6bd22bc`, [Actions run 42668076933](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42668076933), Xcode 16.4 / iPhone 16. Build, install, launch, both TR/EN UI tests, stat delta checks, terminate/relaunch persistence and screenshot export passed. 2 UI tests / 0 failures. Actual TR menu/card/result PNGs were inspected from downloaded artifact 13696279860. No overlap observed at the tested size; result-button contrast is improved in the subsequent content revision. This supersedes the historical Apple-platform limitations below; physical-device and broader visual/accessibility QA still remain.

Current 36-card revision: commit `ab7f0c8`, [run 42687508772](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42687508772), **all checks passed remotely**: 16 Swift tests, 15 content tests, zero content errors/warnings, three real 10,000-seed simulations, native build/install/launch and 2 TR/EN UI tests (88.802 seconds / zero failures). Artifact `13705113923` downloaded and inspected; the river art renders correctly and the continue button now has dark text on gold. Second choice on the illustrated card requires scrolling; no claim is made that every choice fits on one screen. Physical-device and large-text QA remain open.

## Evidence actually obtained

Node content tooling executed on Windows, Node v24.11.1. **15 tests passed**, zero failures. Positive fixture validation plus negative tests for duplicate IDs, missing translations, invalid/negative probability, invalid stat effects, impossible conditions, unavailable flag producers, future-only dependencies, duplicate choice IDs, invalid delay eras, unknown condition keys, combined contradictions, equivalent choices and unknown affinities.

The current 36-card database passes the structural contract without errors or warnings. Seven groups contain multiple cards, but this does not certify finished story chains. `content-report.json` records counts and missing assets. Structural validation is separate from native build and UI execution evidence.

Two images were inspected in generation output and copied into the asset catalog. The decision sound is generated from an original waveform. Final image performance and audio quality on a physical iPhone remain unmeasured.

Final file checks passed for the saved PNG signature/path, WAV container/data lengths and 44.1 kHz / 220 ms format, and existence of all six required project documents. The release gate was executed and correctly returned exit code 1. This is an intentional incomplete-release result, not a test infrastructure failure.

## Swift checks executed on Windows

Swift 6.4.2 successfully built the current Debug core and test runner for `x86_64-unknown-windows-msvc`. **16 XCTest tests passed, zero failures**. They cover SplitMix64 known vectors, deterministic replay through serialization, double-tap/result acknowledgment, era-gated delayed effects, exile/recovery, technology and social era gates, weekly UTC/year boundary isolation, atomic save round trip and future-schema rejection, cooldown/condition exhaustion, unavailable/terminal choices, same-turn succession/leadership loss, normalized risk, older v1 result compatibility, unseen-event priority and historical follow-up unlock/closure.

The release Swift executable ran **10,000 seeds for each of three policies** (random, survival, knowledge), all successfully, with a separate policy RNG. Reports include survival, era reach, ending distribution, unique cards, repetition, cap rate, resources, rival pressure and leadership/exile metrics. See `BALANCE_REPORT.md` and the three `simulation-{policy}.json` files. Initial random-only results are preserved in `simulation-results.json`. These tests use the real engine, not a JavaScript replica. Heuristic policies do not prove human skill balance or target session duration.

Logs: `swift-test-windows.log`, `swift-simulation-random-windows.log`, `swift-simulation-survival-windows.log`, `swift-simulation-knowledge-windows.log`. The first cold build emitted `wchar_t` SDK modularization warnings; this host also reports inability to create `.build/debug`/`.build/release` symbolic links. Builds and runs still exited successfully. The helper updates PATH/SDKROOT for its process only and restores them afterward.

## Remaining Apple-platform checks

GitHub macOS CI supplies Xcode and an iPhone Simulator; the native app and UI test bundle have been built and executed successfully. The local Windows host continues to run core verification. Physical-device testing, signing/TestFlight, actual Game Center account interaction, accessibility audits, audiovisual quality and performance are still pending. A successful simulator run is not a signed device release.

## Required stage acceptance answers

| Question | Current answer |
|---|---|
| Real files implemented? | Yes, foundational code/data/services/docs exist; full planned scope incomplete |
| Real build evidence? | Windows core Debug/Release and GitHub iPhone Simulator yes |
| Relevant tests pass? | Node 15/15; Swift XCTest 16/16; TR/EN UI 2/2 at ab7f0c8; physical device unexecuted |
| Card schemas valid? | 36 pass current validator |
| Gameplay effects correct? | Core tested and simulated; full design and UI still incomplete |
| Animations working? | Basic UI flow runs in Simulator; full preset choreography and measured FPS pending |
| Missing visuals/audio? | Yes, explicitly inventoried |
| Save system reliable? | Windows round trip/schema compatibility and simulator terminate/relaunch pass; physical interruption/disk-failure/recovery pending |
| Regressions excluded? | Core and smoke scope passes; broader platform/service cases remain untested |
| Outstanding work documented? | Yes, PROGRESS/MASTER_PLAN/release checklist |

## Release blocks

All unexecuted Apple-platform tests; missing content count and gameplay subsystems; incomplete story reachability/editorial review; missing assets/branding; high measured event repetition and unbalanced strategy loops; absent Game Center console/device validation; incomplete localization/accessibility/performance/signing/privacy review. `--release` intentionally returns failure.

No stage is certified complete solely because source files exist. Core, native build and smoke execution evidence is now real; content and production-quality acceptance remain open.

## Rivalry checkpoint — 2026-11-10

19 Swift tests and 18 content tests pass locally. Added old-effect decoding, targeted relationship outcomes/save round-trip, faction identity continuity, and friendly-strongest/opposition regression coverage. Native UI verification for this change awaits the next CI run. Physical-device and broad accessibility checks remain outstanding.

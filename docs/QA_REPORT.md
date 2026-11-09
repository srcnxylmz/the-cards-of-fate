# QA report — 2026-11-09

## Evidence actually obtained

Node content tooling executed on Windows, Node v24.11.1. **15 tests passed**, zero failures. Positive fixture validation plus negative tests for duplicate IDs, missing translations, invalid/negative probability, invalid stat effects, impossible conditions, unavailable flag producers, future-only dependencies, duplicate choice IDs, invalid delay eras, unknown condition keys, combined contradictions, equivalent choices and unknown affinities.

The 24-card database passes the structural contract. Three chain groups are flagged incomplete. `content-report.json` records counts and missing assets. This is content validation, **not** proof that the Swift application compiles or runs.

One image was inspected in the generation result and copied into the asset catalog. The decision sound is generated from an original waveform. Neither has been reviewed on an iPhone or measured for final production quality.

Final file checks passed for the saved PNG signature/path, WAV container/data lengths and 44.1 kHz / 220 ms format, and existence of all six required project documents. The release gate was executed and correctly returned exit code 1. This is an intentional incomplete-release result, not a test infrastructure failure.

## Swift checks executed on Windows

Swift 6.4.2 successfully built the Debug core and test runner for `x86_64-unknown-windows-msvc`. **13 XCTest tests passed, zero failures**. They cover SplitMix64 known vectors, deterministic replay through serialization, double-tap/result acknowledgment, era-gated delayed effects, exile/recovery, technology and social era gates, weekly UTC/year boundary isolation, atomic save round trip and future-schema rejection, cooldown/condition exhaustion, unavailable/terminal choices, same-turn succession/leadership loss, normalized risk and compatibility with older v1 result records.

The release Swift executable ran **10,000 seeds for each of three policies** (random, survival, knowledge), all successfully, with a separate policy RNG. Reports include survival, era reach, ending distribution, unique cards, repetition, cap rate, resources, rival pressure and leadership/exile metrics. See `BALANCE_REPORT.md` and the three `simulation-{policy}.json` files. Initial random-only results are preserved in `simulation-results.json`. These tests use the real engine, not a JavaScript replica. Heuristic policies do not prove human skill balance or target session duration.

Logs: `swift-test-windows.log`, `swift-simulation-random-windows.log`, `swift-simulation-survival-windows.log`, `swift-simulation-knowledge-windows.log`. The first cold build emitted `wchar_t` SDK modularization warnings; this host also reports inability to create `.build/debug`/`.build/release` symbolic links. Builds and runs still exited successfully. The helper updates PATH/SDKROOT for its process only and restores them afterward.

## Apple-platform checks not executed

macOS CI is written to run content validation, XCTest, three simulation policies and the iOS simulator build. It has not been dispatched. Xcode, the Apple SDKs, simulator and real devices are not available on this Windows host. `App/` (SwiftUI, SpriteKit, GameKit, AVFoundation and haptics) has **not** been compiled or executed. Core Windows binaries exist in `.build`; no iPhone binary is delivered.

## Required stage acceptance answers

| Question | Current answer |
|---|---|
| Real files implemented? | Yes, foundational code/data/services/docs exist; full planned scope incomplete |
| Real build evidence? | Windows core Debug/Release yes; iOS no |
| Relevant tests pass? | Node 15/15; Swift XCTest 13/13; device tests unexecuted |
| Card schemas valid? | 24 pass current validator |
| Gameplay effects correct? | Core tested and simulated; full design and UI still incomplete |
| Animations working? | Source prototypes only; no device/runtime evidence |
| Missing visuals/audio? | Yes, explicitly inventoried |
| Save system reliable? | Windows round trip, schema rejection and v1 additive compatibility pass; device interruption/disk-failure/recovery QA pending |
| Regressions excluded? | Current 13-test core suite passes; Apple UI/service regressions untested |
| Outstanding work documented? | Yes, PROGRESS/MASTER_PLAN/release checklist |

## Release blocks

All unexecuted Apple-platform tests; missing content count and gameplay subsystems; incomplete story reachability/editorial review; missing assets/branding; high measured event repetition and unbalanced strategy loops; absent Game Center console/device validation; incomplete localization/accessibility/performance/signing/privacy review. `--release` intentionally returns failure.

No stage is certified complete solely because source files exist. Core execution evidence is now real; the remaining Phase 1 platform gate is an actual iPhone simulator build and UI smoke test.

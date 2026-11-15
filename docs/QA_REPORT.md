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

19 Swift tests and 18 content tests pass locally. Added old-effect decoding, targeted relationship outcomes/save round-trip, faction identity continuity, and friendly-strongest/opposition regression coverage. Native verification: [run 42838850246](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42838850246) at `dffeea8`: all steps passed, including 19 Swift tests, 18 content tests, 30,000 simulations, native build/install/launch, and 2 TR/EN UI tests (89.585 seconds, zero failures). Artifact `13776020493` contains 12 test PNGs, accessibility hierarchies, xcresult and diagnostics; downloaded locally for inspection. Existing smoke tests do not open the council panel, so its detailed visual/accessibility QA remains pending. Physical-device and broad accessibility checks remain outstanding.

## Support/pact checkpoint

26 Swift tests / 18 content tests pass locally. Baseline observer reproduces 2287550 metrics exactly. Three new core simulations and a separately labeled managed-council experiment are recorded in BALANCE_REPORT.md. Native test count is now three in source; execution and screenshot review await the milestone CI run. No small-device, Dynamic Type, VoiceOver, physical-device or release claim.

## Support native gate and 48-card local checks

[run 42889283237](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42889283237), commit fdf2b79: all steps passed; 26 Swift tests, 18 content tests, three 10,000-seed policies plus one 10,000-seed managed-council experiment, build/install/launch and 3 UI tests (119.418 seconds, zero failures). Artifact 13798560384 downloaded. The council screenshot confirms hunter relation 20; panel content is partly below the viewport, so the next test revision explicitly scrolls for full-panel captures. New 48-card content: 32 Swift tests and 25 content tests passed locally, zero validation warnings/errors. Native verification awaits the next push.

## Verified CI baseline (recorded, not re-claimed)
- Commit `0989bb6da81af522d966b38f67de8ba90a8b5c6e`, GitHub Actions run `42898795340` — SUCCESS: iOS Simulator build, launch, UI tests and simulations passed; 48 original cards across the first three eras; 25 passing content tests and 32 passing Swift tests reported.

## 50-card local development status (this task — CI not yet run)
- Scope: exactly two original narrative cards added, 48 → 50 (Era 2 `granary_pledge` "Ortak Ambara / The Common Granary"; Era 3 `water_apportion` "Su Kotası / The Water Quota"), all 48 previous card IDs preserved.
- Local verification: `node tools/build-content.mjs` → 50 cards, 0 errors, 0 warnings; Era 1:16 / Era 2:17 / Era 3:17; TR/EN localization complete for new cards; generated `assets/art_manifest.json` lists both new events with honest `status: "missing"` (no missing artwork/audio claimed as completed).
- `node --test tools/validate-content.test.mjs` → 25/25 pass.
- `swift test` → 38/38 pass, 0 failures (was 32/32; +6 new narrative tests: decode, requirements/exclusions, both choice branches, flag-gated follow-ups, one-shot non-repetition, save round-trip, deterministic replay). Swift verification executed on Windows with the toolchain plus MSVC linker on PATH; `.\tools\swift-windows.ps1 -Task Test` requires the MSVC `link.exe` path in the environment and is not itself a passed iOS build.
- The 50-card iOS/simulator build has NOT been run through GitHub Actions and is NOT claimed as passed. Physical-device, signing/TestFlight, Game Center, accessibility and large-text QA remain open.

## 2026-11-15 local Phase 2 checkpoint

46 Swift tests and 27 Node tests passed, generation/--check and mirror equality passed, structural audit has zero errors/warnings. Runtime 64 IDs, all prior local 52 IDs preserved. New tests cover production card draws for four inheritance arcs, all branch-dependent optional choices, delayed gates, closure, v1 replay and repaired local apprentice outcomes. Era/stat fixtures isolate story predicates; they do not prove all branches are naturally drawn in one run. Same-seed 30,000 before and after simulations are documented in BALANCE_REPORT.md. iPhone CI for this group remains pending until a specific run is recorded. No new UI/device/art/audio acceptance claim.

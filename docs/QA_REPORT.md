# 105-card QA — native gate pending

Local: 70 Swift / 39 Node passed, generation/audio/art checks passed. Final 50,000-run comparison is complete; six native UI tests remain to be accepted. Previous checkpoint evidence below is historical.

# Current 90-card QA checkpoint — 2026-11-15

**Verified in components:** runtime/core ee15f32 (61 Swift, 31 Node, five 10,000-seed CI simulations); identical-runtime UI 0be976a (all five tests passed, including frozen-frame TR/EN normal/large OCR). Full source/evidence, failed OCR cases and remaining limits are recorded at the end. Do not mistake skipped simulations in the final UI-only run for new executions. Prior records below are historical.

# QA report — 2026-11-09

## Current 76-card milestone

Verified code: `b444e9f7b19c11fffb97d2a88fae1ea415378ee5`, [successful run 43709935129](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43709935129). 53 Swift, 27 Node, four UI tests and five 10,000-seed CI simulations passed. Actual compact-screen evidence and remaining visual limitations are recorded at the end of this report. Earlier sections below are historical.

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

## Verified 64-card native checkpoint — 2026-11-15

[run 43705065924](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43705065924) at `00895b38c8140213271423bb56748d2f9de4f788` passed every step: 27 Node tests, generation --check, structural validation, 46 Swift tests, 10,000 runs each for random/survival/knowledge plus the separate managed-council policy, Xcode project generation, iPhone build/install/launch and 3 UI tests (122.552 seconds, zero failures). Artifacts: iphone-ui-evidence 14158103245 and quality-reports 14158292920. Downloaded the UI artifact and inspected the new TR shared_quarry first card and EN council screenshot. No visible overlap at the tested iPhone 16 size; the placeholder illustration remains missing production art. This does not cover all 64 layouts, Dynamic Type, physical device, audio quality or Game Center. Earlier pending statements describe historical checkpoints and are superseded for this development group. Documentation-only follow-up uses [skip ci]; tested runtime source is 00895b3.

## 76-card local checkpoint — 2026-11-15

53 Swift and 27 Node tests pass; generation/check/mirror/audit pass with zero content warnings/errors. Eight baseline diagnostic runs (52 and 64 cards × four policies) and four final 10,000-seed policies completed. Old six policy results reproduced exactly before content changes. See PROGRESSION_ANALYSIS.md for conditional means, gate denominators and the remaining Bronze decline. Windows Swift frontend parsed the UI sources; native compilation is pending. UI target retains the original three tests and adds real-art/second-option reachability plus large-text/Reduce Motion fixtures. A compact SE 3 Simulator is attempted with explicit fallback. Generated granary candidate and actual device rendering have not yet passed visual QA. No physical-device, VoiceOver, OS-toggle, Game Center or performance certification.

## Verified 76-card native checkpoint — 2026-11-15

[Run 43709935129](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43709935129) at `b444e9f7b19c11fffb97d2a88fae1ea415378ee5` passed every step. Xcode 16.4 (16F6), iPhone SE (3rd generation), iOS 18.5; actual screenshots are 750×1334. Passed: 27 Node tests, generation --check, content audit (76 cards / 162 choices / zero errors or warnings), 53 macOS Swift tests, five 10,000-seed simulations (random, survival, knowledge, progression and optional managed council), XcodeGen, simulator build/install/launch, and four UI tests (165.253 seconds, zero failures). Old save/replay and new narrative/recurrence tests are included in the Swift suite.

Downloaded UI artifact 14160655066 and quality artifact 14159554347 to artifacts/run-43709935129. All four standard-policy CI reports exactly match local era reach, average turns, repeat rate, caps, technology gains, ending distribution and decision counts. The optional managed-council report is separate from the four-policy comparison.

Inspected actual PNGs: TR sacred_fire (59D8CFA3-2E78-46F5-B94E-16EF99A1D274.png), EN river_tracks (DF1EA511-1D1E-4924-9981-5BFCE8AEB26B.png), large TR first_granary text (181978C8-B67C-4034-A25D-DC546D6B415B.png) and reachable choices (70D879C5-8465-412D-8D08-0429E2DCBBC3.png). Main fire/river illustrations now preserve their full portrait ratio; the atmospheric background alone crops. Large text wraps and the second choice can be reached and resolved; the granary art is partially above the viewport after scrolling. This is not approval of every large-text layout.

Visual limitation: the immediate EN river art capture omits numeric stat text despite visible labels/bars. In the standard EN first-card screenshot (9ADC1575-BC2C-4CE9-8701-9EBE40FEFB89.png) and the same river card's result (B6A299B8-FCB2-4F3B-8CDD-DE6779A93A07.png), all six values are visible. Keep initial-render/screenshot stability open; neither claim permanent English layout correctness from passing accessibility assertions nor diagnose a root cause from one frame. Captures after scrolling also place content under the status bar; review scroll-edge treatment next.

Failures are retained: 3f8ae37 failed on a read-only accessibility environment write; a63ae44 failed only the new test's teardown screenshot after terminating the app. Both were fixed without removing assertions. Intermediate run 43709745446 at 5cb15b6 was cancelled to conserve quota after actual screenshots prompted the final layout correction. Successful evidence is for b444e9f. This documentation-only follow-up uses [skip ci] and does not claim a second source build.

Remaining: progression Bronze access regression (74.80% → 70.34%), high survival repetition, first-frame capture stability/scroll-edge treatment, full art historical approval (including stylized timber key), 73 missing illustrations, production audio, VoiceOver and actual OS toggles, physical-device performance, signing and Game Center account checks. No release or full Phase 2 completion claim.

## Verified 90-card milestone — 2026-11-15

- Runtime/core source: ee15f32710c51b8e8148ebcbd4440aba3cfaa6ef. [Full run 43729726032](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43729726032) passed 31 Node, generation/audio checks, content validation, 61 macOS Swift tests, five 10,000-seed simulations, XcodeGen, build/install/launch and four existing/art UI tests. Its overall conclusion was failure: the new OCR test missed visibly drawn 55. Do not label that full run green.
- Latest tested UI source: 0be976a4ff1bf533daaf586075af399d9e8ff1e5. [Successful native/UI run 43731255529](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43731255529) passed 31 Node/checks, the runtime-identity guard, build/install/launch and **all five UI tests, 289.474 seconds / zero failures**. Swift unit/simulation steps were explicitly skipped here; their identical-runtime evidence is the full run above. No skipped check is counted as rerun.
- Xcode 16.4, iPhone SE (3rd generation), iOS 18.5; real PNGs 750×1334. Downloaded UI artifact 14168558157 into artifacts/run-43731255529. Full-run quality artifact 14167434373 is downloaded under artifacts/run-43729726032/quality. All four standard-policy CI era, mean-turn, repeat, cap, technology, ending and decision metrics exactly match final local reports. The optional council run is separate; the user's pre-existing council JSON stays untouched.
- Actual first frames reviewed: TR normal 4A42D536-6CD8-4A6A-88F1-C2D76A8EA9F1.png; EN normal 126A0863-504D-4EBA-BDAC-553EF87649AD.png; TR large C5B069E0-AA94-47F9-9BF2-9314C04CCAD7.png; EN large 5C32EA25-F23D-453D-9D15-2EBE36A19078.png. Every production case has visible=6, missing=[] from OCR of the one frozen initial frame, plus per-row pixel checks after reachability scrolling. No fixed waiting period or expected-digit vocabulary was added. Original crops are retained.
- The paired legacy-layout controls also showed all six values this time. Thus the older intermittent missing-number frame was **not reproduced reliably**, and a specific internal SwiftUI cause is not proven. A single label/value text run removes independently laid-out numeric children and all tested frames pass, but broader cold-start/OS/device coverage remains open. The encountered TR stability OCR false negative was proven against its visible original crop and repaired by padded/enlarged, expectation-independent top-1 recognition; assertions were preserved.
- Scrolled EN large D73BF293-9D0D-4241-9289-B1E68EAAF8A3.png and TR large were reviewed: content is clipped below the status bar, with no game glyphs behind it. Large headers/leadership can wrap; this is not all-size/VoiceOver acceptance. Reduce Motion is exercised with the existing Debug override; actual OS toggles remain separate.
- The five-art UI test passed and real green_stone/smoke_shift frames were inspected (79B36E94-5944-4A47-8FFE-FA9169FABAE8.png / 66500319-F5C1-4A53-B585-B5176C985329.png). Existing three PNGs are unchanged from 56aad88. Five original generated candidates exist, 85 illustrations remain missing. Normal entrance captures can show partial opacity; no final color/performance/historical/legal approval is implied.
- card-open.wav and choice-soft.wav are original bounded deterministic PCM cues and pass format/generation/peak/duration tests. Build logs confirm their inclusion in the actual app; art fixtures launched with sound enabled. The postmortem unified log did not retain AUDIO_CUE start entries, so audible playback/start and physical mix quality are **not claimed verified**. Production music/ambience remains missing.
- Full failure history retained: rejected balance drafts 6189/6520 Bronze; short-survival pre-food draft; obsolete e9d9e95 run 43713460947 cancelled; full ee15f32 OCR false negative; fixed-frame 5621765 run 43730394211 with the same OCR failure. Final green UI source changes no runtime/core data. Subsequent report-only publication uses [skip ci] to preserve quota.

### Remaining work and next group

90 cards (30/30/30), 203 decisions, 51 statically detected cross-era links; these are not 100 editorially approved completed chains. Progression Bronze 70.34% → 95.94%; survival repeat 84.36% → 75.28%, but mean lifetime 136.0397 → 101.5947. Random/knowledge Neolithic access fell; long Bronze runs repeat more and knowledge has 1889 living caps. Prioritize purposeful recovery/ecology and long-session Bronze variety before the next distinct 120/180-card group. Keep 12-era/800-card/100-chain/30-ending scope. Physical device, actual OS accessibility, audio listening, signing, Game Center account/weekly version pinning and final assets remain open.


## 105-card validation in progress

Local Node suite: 39 tests passed; generation --check and art audit passed (105 cards, 10 actual portrait candidates, 95 missing). All 90 older event definitions retain their choice IDs/effects/text; four historical exclusions and derived direct worldFlags metadata are explicitly allowed by the preservation regression. Four instrumented 90-card baseline reports exactly match original era/lifetime/repeat/cap/decision/ending aggregates. Windows Swift: 70 tests passed, zero failures; App/UI Swift syntax parse passed. iOS-native acceptance remains pending; do not reuse old 90-card CI as evidence for the new source.

New story fixture failures were retained locally and corrected: acknowledgment was required between winter and canal decisions; supply caching required the actual earlier ice crossing; smelting had to be obtained before selecting the recasting event. Tests now traverse these decisions rather than weakening selector/choice availability. No engine rule was relaxed.

Native suite adds three-cue playback-start and mute assertions, persistent simulator-container JSON and attachments. Records expose actual AVAudioPlayer.play()/isPlaying/duration observations, missing-resource/errors and telemetry persistence failures. This remains API-start evidence, not physical listening or mix approval. Dynamic art fixtures cover every real registered image. Existing fixed-frame pixel OCR, caption recognition, large text, scroll clipping and Reduce Motion assertions are preserved.

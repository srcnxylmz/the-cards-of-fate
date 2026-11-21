# 180 kart kalite doğrulaması — 2026-11-19

# 195 kart yerel doğrulama — 2026-11-20 (kaynak `8a2924b`, dal `phase3-era4-groundwork`, PR #1)

195 benzersiz kart (60/60/60 + 15 kapalı Era 4), 486 karar. Windows 11 üzerinde çalıştırıldı:
- Node v25.2.1: `node tools/build-content.mjs --check` geçti, `node tools/validate-content.mjs` 0 hata/0 uyarı, `node --test tools/*.test.mjs` **70/70**. Eski 180 tanım derin eşit.
- Swift 6.4.2 (x86_64-unknown-windows-msvc): `swift test` **125/125** (FateCoreTests 113 + FateDiagnosticsTests 12). İlk koşuda 1 test hatası vardı; test iddiası düzeltildi (`8a2924b`, bkz. PROGRESS).
- `swift build -c release --product FateSimulation`, altı politika × 10.000 seed (random, survival, survival --manage-council, knowledge, progression, recovery): `node tools/compare-reference195.mjs` altısı için de "identical except contentCardCount 180 → 195". Raporlar: `docs/analysis/milestone195-windows/`.
- Native CI: [run 44734293652](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44734293652) (#33, workflow_dispatch, kaynak `8a2924bd541962b49fe768586dca37fabea237d9`) **başarılı**, beş işin beşi de geçti. `verify` (macos-15 arm64, Xcode 16.4): Node 70/70, içerik kontrolleri ve doğrulayıcı 0 hata/0 uyarı, Swift 125/125, iPhone SE (3. nesil)/iOS 18.5 simülatöründe derleme, kurulum, başlatma ve 6/6 UI testi (`** TEST SUCCEEDED **`: TR/EN karar ve kaldığı yerden devam, meclis müzakeresi, görünür istatistikler, illüstrasyonlu kartlar + büyük metin/Reduce Motion, ses cue/mute). Dört simülasyon işi (short, knowledge, progression, recovery; macos-15-intel) 10.000 seed ile başarıyla bitti. Artefaktlar: `iphone-ui-evidence`, `quality-reports`, `native-simulations-{short,knowledge,progression,recovery}`. macOS simülasyon raporları `compare-reference195.mjs` ile ayrıca karşılaştırılmadı (artefaktlar indirilmedi); aynı-seed kanıtı yukarıdaki Windows karşılaştırmasıdır. Ekran görüntüleri incelenmedi. 195 paketi bu kapsamda native CI kabulü aldı; fiziksel cihaz, imzalama ve ekran görüntüsü incelemesi açık. Era 4 kapısı kapalı (`enabled:false`, envanter 15/40). Yeni görsel yok: 43 aday, 152 eksik. Ayrıntı: [PHASE3_195_REPORT.md](PHASE3_195_REPORT.md).


109 Swift ve 63 Node geçti. İçerik 180 benzersiz kart, 434 karar, 43 illüstrasyon ve 137 eksikle doğrulandı. v1 kayıt, replay ve altı hikâye zincirinin regresyonları geçti. 60.000 macOS simülasyonu yerel raporla birebir eşleşti. iPhone SE 3/iOS 18.5 derleme, kurulum, başlatma ve altı UI testi geçti. Başarılı ZIP'in kaynak SHA'sı ve özeti doğrulandı. 43 görsel akışı, 13 yeni gerçek ekran, dört OCR kaydı, büyük metin/Reduce Motion ve üç cue API/mute gözlemi incelendi. Fiziksel cihaz çalışması açık. [CI 44601815107](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44601815107) · [Native kanıt ve önceki başarısız denemeler](NATIVE_180_EVIDENCE.md)

# Verified 165-card native milestone — 2026-11-18

165 unique cards/55-55-55/394 decisions,30 real illustration candidates,135 missing. Source ee0bd37d68e6c4e0204fae8f601e4993e664744f is pushed. Full CI44327962308 attempt1 passed104 macOS Swift,59 Node,60000 native simulations,iPhone SE3/iOS18.5 build/install/launch and six UI tests. Both downloaded ZIP hashes match GitHub. All six native JSONs match local verified165 in every field.210 attachments/30 illustration flows/four production OCR notes/three cue start+mute checks passed; no export error or collected app crash. Five new real game images,stable choices/result,main menu,large-text/Reduce Motion and normal/large captures were inspected. Some entry captures retain partial animation opacity; no final device color/contrast claim. Exact proof: NATIVE_165_EVIDENCE.md / analysis/milestone165-verified/native-run.json.

All150 earlier authored definitions,old25 PNG hashes,policy scores,thresholds,RNG,food rules and v1 schema are unchanged. Six enriched150 replays preserved every legacy field; passive technology/K100 observations are additive only. New paid cultivation/writing options,crew-dependent funded work,care representation and convoy advantages are content mechanics,not a new engine economy. Fifth complete care-work chain has actual opposed closures and natural random ordered counts24/26; old four chains retain regressions. Editorial self-review is not independent human historical approval.

150→165 means: random111.29→137.66; survival201.41→198.93; knowledge358.52→402.88; progression421.68→478.14; recovery477.49→484.14; council78.58→74.25. Negative survival/council lifetimes and random Bronze ecology38.15→33.70 remain open. Random Bronze reach5134→5503,knowledge7361→8116,progression9616→9702,recovery9736→9768. Random Bronze starvation38.08→28.05; first40 repeats32.95→24.97%; after100 active cards14.63→17.41 and pairs29.20→34.32. Longer whole-run repeats/caps are not victories or a pacing solution. Full metrics: MILESTONE_165_ANALYSIS.md / TECHNOLOGY_165_ANALYSIS.md.

Next165→180: investigate Paleolithic survival/council opportunity costs and random ecology,expand state-dependent late-city choices,another complete chain and actual art,and finish60/60/60 without opening Era4. Future Era4 plan specifies40 distinct events(24 recurring,eight conclusions,eight bridges),an explicit readiness switch and bounded debt/water/residency/production/security/care conversions; these are not implemented. Physical-device testing,expert art/history/legal approval,finished branding/music,signing/Game Center/online weekly leaderboard remain open. Original12 eras/800 cards/100 complete chains/30 fate endings unchanged. User README/root technologies/root council and unrelated logs/experiments remain untouched and unstaged. This group stops at165.

# 165-card local gate — 2026-11-18

165 unique cards,55/55/55,394 decisions; all native150 authored definitions and old25 PNG hashes preserved.104 Windows Swift(93 Core+11 diagnostics),59 Node,generation/content/art/feedback checks pass. Six165 reports contain10000 runs each, seeds0..<10000/cap500; processes ended between chats, so old session handles are unavailable, but all complete reports and Saved10000 logs are retained. All six enriched150 reference replays matched every old report field. Policies/thresholds/RNG/food/schema unchanged.

150→165 means: random111.29→137.66; survival201.41→198.93; knowledge358.52→402.88; progression421.68→478.14; recovery484.14 versus477.49; council78.58→74.25. Negative survival/council lifetimes remain open; these policies still never choose cultivation, not an era selector bug. Random Bronze5134→5503,knowledge7361→8116,progression9616→9702,recovery9736→9768. Random Bronze starvation38.08→28.05, ecology38.15→33.70. Do not hide the lower random ecology or infer causal benefit from different survivor mixtures. First40 random Bronze repeat32.95→24.97%; after100 active cards14.63→17.41,choice pairs29.20→34.32. Whole-run random/progression repeats increase with longer lives; not claimed solved.

New care-work chain has public/private actual fixture closures and natural random ordered completions24/26. All33 new decisions appear under random/knowledge/progression; recovery31/33; survival/council9/33 and no later-era closures. Four old chain regressions remain. Sources: civic-work-events.mjs; analysis: TECHNOLOGY_165_ANALYSIS.md / MILESTONE_165_ANALYSIS.md; editorial self-review: STORY_REVIEW_165.md.30 actual illustration candidates,135 missing; five new images prioritize existing chains, prompts/hash/catalogs recorded. Three prototype cues retained, no production music/hearing claim.

Next: explicit-path diff/commit/push then one full native checkpoint; verify macOS reports exactly and inspect real30-fixture/OCR/audio/screenshots before marking165 accepted. Era4 remains closed; readiness document specifies proposed minimum40 future events,24 recurring crises,eight conclusions and explicit future readiness switch, bounded conversions for debt/water/representation/production/security/care. Next165→180 should finish first-three-era60/60/60 without opening Era4. Original12 eras/800 cards/100 complete chains/30 endings unchanged. User README/root technologies/root council and old logs/experiments remain untouched and unstaged.

# Verified 150-card native milestone —2026-11-17

150 unique cards,50/50/50,361 choices;25 real illustration candidates and125 missing. Separate balance commit0a56635 plus source fd91dab53876cd7404ac02eab366fb8b44a1fd0d are pushed. Full CI run44163156728 attempt1 passed100 macOS Swift,56 Node,six10000-seed simulations,iPhone SE3/iOS18.5 build/install/launch and six UI tests. Both artifact ZIP hashes match GitHub; every field of six native reports matches local verified150.195 attachments/25 illustration flows/four production OCR records/three audio start+mute cues passed; no export error or collected app crash. Five new real game images, stable choices,result,main menu,normal/large and Reduce Motion captures were inspected. Exact proof and limits: NATIVE_150_EVIDENCE.md / analysis/milestone150-verified/native-run.json.

135→150 means: random82.01→111.29; survival115.05→201.41; knowledge230.62→358.52; progression270.16→421.68; recovery389.57→477.49; council63.42→78.58. Random Bronze starvation63.95→38.08 per100 decisions. Random/40-Bronze repeat40.63→32.95% versus repaired135, with differing surviving cohorts; longer whole-run repeats are not called solved. Negative access findings remain: random Bronze5210→5134, progression9618→9616,recovery9782→9736; knowledge missing-metal live caps2→3. No threshold,policy,500 cap,RNG,food rule or save-schema change. Four old events changed only in the measured balance prerequisite; all balanced135 definitions and earlier20 PNGs are preserved. Full rejected-draft/screen data and comparison: MILESTONE_150_ANALYSIS.md.

Fourth complete authored/tested chain: shared smoke signal→village flood watch→city false-alarm hearing; actual opposed branches,due era memories,writing gate and closure. Random natural shared/private completions28/24; all37 new choices observed under random,knowledge,progression,recovery. Survival/council remainPaleolithic under unchanged scores. New images: smoke_code,loom_shares,clay_lids,mine_water,alarm_inquest; exact built-in prompts/provenance/catalog paths are in assets/generation_prompts.json and assets/art_manifest.json. No new finished WAV/music.

Next150→165: investigate technology opportunity costs and late recurring-choice diversity, add distinct costed labor crises, another complete chain and actual art with save/replay/native gates. This group stops at150. Era4 remains closed through180 plus a substantial verified future inventory. Physical-device testing,expert production art/history/legal approval,finished branding/music,signing/Game Center/online weekly leaderboard remain open. Original12 eras/800 cards/100 complete chains/30 fate endings unchanged. User README/root technologies/root council and unrelated local logs/experiments remain untouched and unstaged.

# 150-card full local simulation gate

All six final10000-seed cohorts exit0; final frozen deck matches runtime150 JSON.100 Swift/56 Node checks pass. Native CI/artifact review remains pending. Exact metrics and negative access findings: MILESTONE_150_ANALYSIS.md.

# 150-card local gate —2026-11-17

100 Windows Swift(90 Core+10 diagnostics),56 Node, structural content/generation/equality, feedback and25-image hash/catalog checks pass. New37 decisions,0...100 workforce partitions, paid capital/ecology guards, both opposed warning paths, old chains, JSON save/replay and legacy queued debits are covered.20 earlier PNG bytes, native135 rules/policy/schema and three user document backups match. Seven new scenes close; eight recur. Rejected draft/screening results remain explicit; final six-policy gate is running. Native150 build/UI/artifact/audio/OCR acceptance is pending;135 evidence below remains historical.

# Verified 135-card native quality gate — 2026-11-17

92 Swift tests (84 Core + eight diagnostics), 51 Node passed; 135 unique cards / 324 choices / 45 per era, zero content errors/warnings. Generation, feedback and art audit passed:20 actual candidates / 115 missing. Every new decision is tested with actual gates, selector, save/replay; stochastic ore trial covers success/failure, paid-history follow-up cannot close before repayment, later loans remain intact, ecological inputs cannot be spent at zero. Both old complete chains retain their regressions; both new pasture paths cover real queues, era gates and closure. Fixtures are controlled tests; natural coverage is separately measured. Full native source80a7bf5 / run43908707917 attempt4 passed92 Swift,51 Node,six UI tests,60,000 simulations and iPhone build/install/launch. All six downloaded reports match local final JSONs in every field. Twenty fixture flows, four production OCR notes, three-cue API-start/mute and actual images were reviewed; no export error or collected app crash. First three account-blocked attempts remain historical. See NATIVE_135_EVIDENCE.md for acceptance; historical evidence below does not validate new code.

# Verified 120-card quality gate — 2026-11-16

Current local source: 120 cards / 288 choices / 40-40-40, 15 real candidates / 105 missing. 83 Swift tests (78 Core plus five diagnostics) and 48 Node passed. Content has zero structural errors/warnings; generation, feedback and art audits pass. Full native run 43766155674 at source 0592d02 passed: 83 Swift, 48 Node, six UI tests, six 10,000-seed runs and iOS build/install/launch. All six downloaded reports exactly match local final JSONs. Actual artifact review, IDs and remaining limits: [NATIVE_120_EVIDENCE.md](NATIVE_120_EVIDENCE.md). The 105-card evidence below is historical.

New tests cover actual food coverage versus empty reserves, partial/full/hard deficits, funding upkeep from current supplies, conditional outcome boundaries at every 0–100 value, persistent open bonds and real payment/default, both closed story chains, old optional-field decoding and save/replay. The old 105 authored definitions are deeply compared unchanged. Existing five policy functions and all ten old PNGs are retained.

Native art coverage now chooses the second option when enabled, otherwise a genuinely enabled option; an unpaid bond’s repayment is correctly unavailable in a fresh fixture. No choice requirement is bypassed. As before, Debug art fixtures select the card/era for presentation and do not prove unassisted story reachability; engine regressions and natural ordered histories provide that separate evidence. All 15 file-backed fixtures remain real menu/start/choose/result flows. Pixel OCR, safe scrolling, large text, Reduce Motion override and three-cue playback/mute tests are preserved. The CI ceiling is 45 minutes to accommodate longer living/censored runs plus six required 10,000-seed simulations and UI coverage, avoiding timeout-driven duplicate runs; it is a ceiling, not extra work.

# Verified 105-card QA checkpoint — 2026-11-15

Local: 70 Swift / 39 Node passed, generation/audio/art checks passed. Final 50,000-run comparison is complete; all six native UI tests passed at [run 43739396488](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43739396488). Previous checkpoint evidence below is historical.

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

90 cards (30/30/30), 203 decisions, 51 statically detected cross-era links; these are not 100 editorially approved completed chains. Progression Bronze 70.34% → 95.94%; survival repeat 84.36% → 75.28%, but mean lifetime 136.0397 → 101.5947. Random/knowledge Neolithic access fell; long Bronze runs repeat more and knowledge has 1889 living caps. Prioritize purposeful recovery/ecology and long-session Bronze variety before the next distinct 120/180-card group. Keep 12-era/ 800-card/100-chain/30-ending scope. Physical device, actual OS accessibility, audio listening, signing, Game Center account/weekly version pinning and final assets remain open.


## 105-card validation in progress

Local Node suite: 39 tests passed; generation --check and art audit passed (105 cards, 10 actual portrait candidates, 95 missing). All 90 older event definitions retain their choice IDs/effects/text; four historical exclusions and derived direct worldFlags metadata are explicitly allowed by the preservation regression. Four instrumented 90-card baseline reports exactly match original era/lifetime/repeat/cap/decision/ending aggregates. Windows Swift: 70 tests passed, zero failures; App/UI Swift syntax parse passed. iOS-native acceptance now passed at [run 43739396488](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43739396488); the final evidence below supersedes this in-progress entry.

New story fixture failures were retained locally and corrected: acknowledgment was required between winter and canal decisions; supply caching required the actual earlier ice crossing; smelting had to be obtained before selecting the recasting event. Tests now traverse these decisions rather than weakening selector/choice availability. No engine rule was relaxed.

Native suite adds three-cue playback-start and mute assertions, persistent simulator-container JSON and attachments. Records expose actual AVAudioPlayer.play()/isPlaying/duration observations, missing-resource/errors and telemetry persistence failures. This remains API-start evidence, not physical listening or mix approval. Dynamic art fixtures cover every real registered image. Existing fixed-frame pixel OCR, caption recognition, large text, scroll clipping and Reduce Motion assertions are preserved.


## Verified 105-card native checkpoint — 2026-11-15

[run 43739396488](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43739396488), code commit 3d589af1a02be3032f60e6560e75fabeefa2c407, passed the complete default workflow in one attempt. No failed native test was skipped. The UI-only guard is intentionally skipped in an ordinary full run; all quality/test/build steps executed. Xcode 16.4 (16F6), iPhone SE (3rd generation), iOS 18.5, real 750×1334 PNGs.

- 39 Node tests, generation --check, feedback generation --check, art audit (10 real candidates / 95 missing), structural validation (105 cards / 245 choices / 35-35-35, zero errors or warnings).
- 70 macOS XCTest tests, zero failures (33.978 seconds); local Windows suite also passed 70. Old save/replay, all new choices, era-delayed history and finite legacy closures included.
- Six actual 10,000-seed simulations: four unchanged policies, independent recovery and a separate managed-council survival experiment. Downloaded quality artifact 14172641093. Every field of all five base-policy JSON reports exactly matches the local final reports; managed council is separate (10,000 runs, 105 cards, 50,787 political actions). The user's local council file was not overwritten.
- iPhone build/install/launch and all six UI tests passed, 394.896 seconds / zero failures: TR/EN decision/save/resume, council persistence, ten real illustrations with reachable second choices/results, existing fixed-frame TR/EN normal/large stat OCR and new three-cue audio-start/mute coverage.
- Downloaded UI artifact 14172372732 (36,970,878 bytes) to artifacts/run-43739396488/ui; quality report to its quality sibling. No export-errors file or crash report was present. This records the captured diagnostics, not proof against every possible crash.

Actual persistent audio-playback.json contains 44 events: 24 started, 20 muted, zero error/missing/rejected records and no telemetry write error. All started records report playReturned=true and isPlaying=true. Durations are card-open 0.24s, choice-soft 0.12s, decision 0.22s; muted records report neither API start nor playing. This verifies actual simulator API-start observations and mute behavior, not audible quality, speaker output, a complete mix or music. Three prototype WAVs are retained; production music/ambience remains missing.

Inspected all five new actual art captures: winter_porters 06A2C9B5-2E05-4882-A605-6FBCF4F732C2.png; fallow_strips 0A4092F3-BF1A-4816-8435-F7BFB1B7E060.png; reed_fever FB764D03-57BE-4C7A-8A27-5D09B6CCF45F.png; furnace_wood F227FE09-0B04-4ED2-BA82-B3C90CB7993E.png; salt_ship C0D7873E-CAA6-4FA0-8DB8-D7F59577EEBB.png. The full portrait is fitted inside the shared frame; atmospheric sides remain separate. Some entrance frames capture intentional partial opacity. Reviewed stable reachable-choice frames for furnace (FE31F3A5-156F-4CDF-A84F-C71FAE6D8D87.png) and winter carriers (B696C1D4-AEB9-4D02-A545-29966C8C2471.png): wrapped text and both options are reachable/readable. Historical/anatomical/legal/color approval and physical performance remain open.

All four production first-frame OCR notes show visible=6, missing=[] (TR/EN × normal/large), with exact per-row pixel checks and status-bar rejection preserved. Actual EN normal 77B53A47-D00F-492C-A19E-7FEC2500C65E.png, TR large 3E216861-3401-4177-9FA4-C8610F1705AF.png and scrolled EN large 3AD32116-01ED-47E3-9985-F9327A4475B0.png were reviewed; no game text paints behind the status bar. Large leadership labels wrap and long descriptions require scrolling. This is not all-device/VoiceOver acceptance. Actual OS Reduce Motion and physical audio remain separate from the existing Debug test override.

The checkpoint is now safely published and natively verified. No 120-card content batch was started. Next group: address Bronze starvation spikes and delayed population burdens, investigate genuinely changing civic/trade conditions, profile eligibility/history lookup cost, retain healthy censored caps and repeat the same seeds when rules/content change. Random access and knowledge/progression/recovery lifetime regressions remain explicit in MILESTONE_105_ANALYSIS.md. Scope stays 12 eras / at least 800 original cards / 100 approved chains / 30 endings. Signing, Game Center account/version fairness, physical device/accessibility and 95 missing illustrations remain release blockers.

Subsequent publication changes reports only and uses [skip ci]; native evidence belongs to 3d589af1a02be3032f60e6560e75fabeefa2c407, not an invented second build.


### Measurement-only recovery correction

Five dedicated FateDiagnostics tests reject recovery after card death or a later terminal council phase, require a living complete decision, retain censored episodes, and prove local Bronze-window and distinct-choice counting. A test fixture import required @testable FateCore and was corrected before all tests passed. Both archived reference/current cohorts were replayed from prebuilt binaries in parallel. Every non-diagnostic field across all twelve files is unchanged; only corrected recovery observations differ. No game-stat improvement is attributed to this classifier change. Older provisional recovery tables are withdrawn and superseded by the regenerated analysis.

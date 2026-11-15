# iPhone simulator smoke tests

Baseline native build confirmed: commit `a2f4679`, [Actions run 42666624049](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42666624049). This supersedes earlier statements that iOS build infrastructure is unavailable. Local Windows remains suitable for core tests; GitHub macOS supplies Apple-platform verification.

**Runtime verified:** commit `6bd22bc`, [run 42668076933](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42668076933), Xcode 16.4, iPhone 16. Both UI tests passed (2 tests / 0 failures, 89.54 seconds). Twelve PNG attachments plus two accessibility hierarchies exported successfully, alongside simctl launch/final PNGs. Artifact `iphone-ui-evidence` ID `13696279860` was downloaded and inspected. Turkish menu/first-card/result screenshots were visually reviewed: readable text, working stat/result layout, no visible overlap at the tested size. The result button's light-on-gold text needed stronger contrast and is corrected in the next content milestone. This is not full accessibility or device QA.

**Latest content verification:** commit `ab7f0c8`, [run 42687508772](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42687508772). Two UI tests passed in 88.802 seconds. [Screenshot/log artifact](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42687508772/artifacts/13705113923) downloaded; river artwork and dark-on-gold result button visually confirmed. Screenshots are real Simulator captures, not mockups. Large art requires scrolling to see the second choice; test helpers scroll to interact with controls. These fixed-seed smoke flows are not all-card layout coverage.

The `FateUITests` target runs real XCUIApplication interactions, in Turkish and English. It starts from the menu, starts a seeded game, reads six statistics, chooses an actual card option, verifies the result and stat deltas, terminates/relaunches the process with an unacknowledged result, verifies disk restoration, acknowledges the result and checks menu/resume retains the next card and turn.

Only Debug accepts `--ui-testing`: it uses a separate `TheCardsOfFate-UITests` save directory and seed 42. `--reset-ui-test-save` deletes only the two named test save files. Release builds ignore both switches. Tests never skip the menu or inject a fabricated result. AppStorage language/audio settings are supplied with launch defaults. No Game Center authentication or external account is needed.

The workflow chooses an installed iPhone, boots it, builds, installs and launches the application through simctl, then runs XCUITest. `iphone-ui-evidence` includes:

- Installation launch PNG and final PNG.
- Named XCTest screenshots for menu, card, result, restored result and resumed card in both languages.
- Full `.xcresult`, exported attachments, final accessibility hierarchy, build/test/launch logs.
- Simulator inventory, Xcode version, app system log and available crash reports.

Failed assertions/launch/build make the job fail. Evidence upload runs even after failure. Attachment export failure is explicitly recorded in `export-errors.txt`; the full xcresult remains the fallback. A captured image by itself is not a successful smoke assertion or visual acceptance.

No automatic pixel-baseline comparison is currently implemented. Inspect the actual screenshots after a successful run. Physical-device performance, VoiceOver interaction, large Dynamic Type, haptics/audio quality, Game Center and signing remain separate checks.

Sources: [Apple XCTest attachments](https://developer.apple.com/documentation/xctest/adding-attachments-to-tests-activities-and-issues), [XcodeGen project specification](https://github.com/yonaskolb/XcodeGen/blob/master/Docs/ProjectSpec.md).

## Rivalry revision evidence — 2026-11-10

[run 42838850246](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42838850246) at `dffeea8`: all steps passed, including 19 Swift tests, 18 content tests, 30,000 simulations, native build/install/launch, and 2 TR/EN UI tests (89.585 seconds, zero failures). Artifact `13776020493` contains 12 test PNGs, accessibility hierarchies, xcresult and diagnostics; downloaded locally for inspection. The English result screenshot was visually reviewed; card/result rendering and contrast remain intact. Council-panel-specific screenshots and small-device/Dynamic Type coverage are still open.

## Paid council action verified

[run 42889283237](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42889283237), commit fdf2b79: all steps passed; 26 Swift tests, 18 content tests, three 10,000-seed policies plus one 10,000-seed managed-council experiment, build/install/launch and 3 UI tests (119.418 seconds, zero failures). Artifact 13798560384 downloaded. The council screenshot confirms hunter relation 20; panel content is partly below the viewport, so the next test revision explicitly scrolls for full-panel captures. The initial run 42845432807 failed because the DisclosureGroup identifier propagated to its children. Fixed by tagging only its label. No assertions were removed to hide the failure.

## 76-card presentation test revision

Original three flows remain. A fourth test displays sacred_fire, river_tracks and first_granary using Debug-only --ui-test-card with a three-ID allowlist. It still enters through the real menu, resolves an actual second choice and verifies turn/result; no result or ending is injected. first_granary uses --large-text-reduced-motion to set SwiftUI Dynamic Type and a Debug-only motion-disable override. This is not an OS Settings/VoiceOver test. Release ignores both fixtures. The compact simulator selector attempts iPhone SE 3 on the installed runtime, logs fallback, and records the actual UDID/type/runtime. Native build and all four tests passed at b444e9f in [run 43709935129](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43709935129) on real iPhone SE 3 Simulator / iOS 18.5. Artifact 14160655066 was downloaded and actual captures reviewed. See QA_REPORT.md for exact filenames and the initial-frame stat-text/scroll-edge limitations. Test success is not all-card visual acceptance.

## 90-card pixel and sound checkpoint (pending execution)

Adds a fifth UI test with TR/EN × normal/accessibility3 and Debug-only legacy/new stat layout controls. Vision OCR reads actual screenshot crops, checks the first visible numbers before scrolling and every number after reachability scrolling; a separate status-strip OCR guard rejects game text behind the status bar. Legacy observations are retained for diagnosis; all production cases must pass. No fixed wait was introduced. Five illustrated card fixtures now include green_stone/smoke_shift with sound enabled. Debug unified logs report AVAudioPlayer start/duration/errors. Existing persistence/council assertions remain. Actual A/B findings, images and audio results must be recorded after the native run.

### Same-frame OCR and economical native reruns

The first image is now captured once and reused for all six numeric crops; OCR processing cannot let later screenshots substitute for the first frame. No delay was added. A manual ui_only workflow input skips Swift unit/simulation repetitions only after a validated_source full SHA is supplied. The job fetches that SHA and rejects changes to App, Sources, Tests, package/project, assets, canonical cards or runtime content/audio/validation tooling. Ordinary pushes and default dispatches retain all checks. A UI-only success must cite the earlier core/simulation evidence separately; skipped steps are never reported as rerun.

# iPhone simulator smoke tests

Baseline native build confirmed: commit `a2f4679`, [Actions run 42666624049](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42666624049). This supersedes earlier statements that iOS build infrastructure is unavailable. Local Windows remains suitable for core tests; GitHub macOS supplies Apple-platform verification.

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

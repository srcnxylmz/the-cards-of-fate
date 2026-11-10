# The Cards of Fate

MonKeyBonKey Games · Native iPhone narrative strategy game · Development version 0.1

This repository implements the specification preserved in `docs/MASTER_SPEC.md`. It is **not a completed or release-ready game**. Current content: 36 individually authored bilingual events across the first three eras, 12 era definitions, a deterministic Swift engine, SwiftUI screens, persistence, SpriteKit settlement prototype, and an unverified Game Center adapter. iPhone Simulator build and Turkish/English runtime smoke flows now pass in GitHub Actions; see `docs/UI_TESTING.md` for evidence and screenshots.

## Run quality checks on Windows

Node 22 or later, no npm dependencies:

```powershell
node --test tools/validate-content.test.mjs
node tools/validate-content.mjs
```

`node tools/validate-content.mjs --release` intentionally fails until release requirements are fulfilled. Structural validation alone never certifies narrative quality or shipping readiness.

Swift 6.4.2 on Windows has built and tested the current core: **26 XCTest tests passed**. The production core also completed 10,000 seeds per policy (random, survival, knowledge). See `docs/BALANCE_REPORT.md` for results and limitations.

With Swift's Windows SDK and Visual Studio prerequisites installed:

```powershell
./tools/swift-windows.ps1 -Task Test
./tools/swift-windows.ps1 -Task Simulate -Runs 10000 -Policy random
./tools/swift-windows.ps1 -Task Simulate -Runs 10000 -Policy survival
./tools/swift-windows.ps1 -Task Simulate -Runs 10000 -Policy knowledge
```

The helper locates the latest installed user toolchain and its matching SDK/runtime, adjusts PATH only for the running process, and saves logs/reports. Supply `-SwiftRoot` for a custom installation. Windows validates `FateCore` and `FateSimulation`; it does **not** build the SwiftUI/GameKit iPhone app. The remaining iOS build requires macOS/Xcode.

## Build on macOS

Install Xcode with iOS simulator support and select its command-line tools. Install XcodeGen, then:

```sh
swift test
swift run -c release FateSimulation 10000 --policy random --output docs/simulation-random.json
xcodegen generate
xcodebuild -project TheCardsOfFate.xcodeproj -scheme TheCardsOfFate -sdk iphonesimulator -configuration Debug -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build
open TheCardsOfFate.xcodeproj
```

Choose an iPhone simulator and run the application. Physical devices require your own signing team and provisioning. No credentials are stored here. XcodeGen generates the project from `project.yml`; generated projects are not the source of truth.

GitHub Actions runs these checks plus iPhone Simulator install/launch, Turkish/English UI smoke tests and screenshot export. Verified run links are in `docs/UI_TESTING.md`; check the run for the specific commit rather than treating the presence of CI as proof of success.

## Content and continuation

- `Sources/FateCore`: engine, state, randomness, save contract, bundled JSON.
- `App`: SwiftUI, SpriteKit, feedback and GameKit adapters.
- `tools/build-content.mjs`: curated bilingual authoring source; writes bundled JSON and preserves artwork registry metadata.
- `tools/synthesize-audio.mjs`: original prototype decision cue.
- `tools/validate-content.mjs`: content and release audit.
- `Tests/FateCoreTests`: actual Swift engine tests, not a separate implementation.
- `docs/PROGRESS.md`: completed work, evidence, blockers, exact next steps.
- `docs/QA_REPORT.md`: verified versus unverified behavior.

Regenerate content with `node tools/build-content.mjs` after editing the authoring source. Every event must have its own dilemma, costs, outcomes and art brief. Never fill the 800-event target by reskinning duplicated templates.

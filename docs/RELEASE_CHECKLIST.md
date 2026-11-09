# Release and service preparation

Status: **DO NOT SHIP**. Current source and assets are an initial development slice. No signed binary, App Store Connect configuration, TestFlight upload or actual device test has been performed.

## Game Center

Create the application record and an App ID with Game Center capability under the owner’s Apple Developer account. Match the intended production bundle ID (currently `games.monkeybonkey.thecardsoffate`, ownership not verified). Create recurring leaderboard `fate.weekly.survival`; integer scores, descending order, best score. Start on Monday 00:00 UTC, recurrence seven days, active duration seven days. The client checks exact period alignment and uses the loaded occurrence’s instance submission to avoid rollover leakage.

Test authentication, refusal, parental restrictions, offline launch, same-week retries, UTC rollover, pending scores at rollover and a second account on real hardware. No Game Center dependency may block story mode. Verify console configuration before enabling production competition. Client-only scores do not provide strong anti-cheat; add a server verification service before treating scores as authoritative.

API references reviewed during implementation: [Apple recurring startDate](https://developer.apple.com/documentation/gamekit/gkleaderboard/startdate), [Apple leaderboard score submission](https://developer.apple.com/documentation/gamekit/gkleaderboard/submitscore(_:context:player:completionhandler:)), [Apple recurring leaderboards discussion](https://developer.apple.com/videos/play/wwdc2021/10067/).

## Required before TestFlight

- Pass macOS unit tests, actual simulator build and 10,000 production-core simulations; attach logs.
- Complete missing narrative/technology/faction systems and quality counts in master specification.
- Complete all art, original branding and app icon; inspect compression, memory and portrait crops.
- Complete music/ambience/FX, mixing, interruptions, route changes, silent mode and haptics toggles.
- Add era-specific cinematic animations with skippable/Reduce Motion alternatives.
- Validate current and migrated saves, interruption during writes, disk failure and recovery.
- Review all TR/EN interface strings, discovered technology names and error messages; raw IDs in prototype detail views still need localization.
- Device QA: smallest supported iPhone, current large iPhone, VoiceOver order, largest Dynamic Type, safe areas, gestures, one-handed touch targets and 60 FPS traces.
- Publish owner-approved privacy policy and support contact. Audit Game Center data, required-reason APIs (including UserDefaults), privacy manifest and App Store privacy declarations against actual implementation. No analytics/ads/tracking are currently added; do not infer that no declarations are needed.
- Verify branding ownership and asset licensing; record generation provenance and human review in `assets/LICENSES.md`.
- Configure signing, export compliance, age rating, availability, business model and store metadata under the owner’s account. These commercial/account decisions are not assumed complete.
- Run release archive, validation, TestFlight installation and offline resume on real hardware.

## Draft listing (not publication-ready)

TR: “Bir ateşi koru. Bir şehri kur. Bir uygarlığın kaderini değiştir. The Cards of Fate, kararların kuşaklar boyunca yankılandığı bir anlatı ve strateji oyunudur.”

EN: “Protect a fire. Build a city. Change a civilization’s fate. The Cards of Fate is a narrative strategy game where decisions echo across generations.”

Do not claim 800 cards, all twelve playable eras, production leaderboards or completed audiovisual features in published copy until verified. Screenshot plan: actual decision screen; genuine delayed consequence; leadership recovery; civilization history; finished era transition; configured weekly ranking. No mock screenshots represented as shipped gameplay.

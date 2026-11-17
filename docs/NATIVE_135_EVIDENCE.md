# Verified 135-card native checkpoint — 2026-11-17

Source: 80a7bf55253ee5b16350ca973ecdd6a0e9da8bc0. [Successful run 43908707917, attempt 4](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43908707917/attempts/4), job 133456946700. The original source was rerun after the user restored account access. No game code, workflow or card count changed. Required gates passed; the optional UI-only guard was inapplicable. No 150-card work started.

## Executed gates

- 51 Node tests passed; generation, feedback and art audits passed. Actual content report: 135 unique cards / 324 choices / 45 per era, zero errors/warnings.
- 92 macOS Swift tests passed, zero failures, 75.416 seconds: 84 Core and eight diagnostics, including saves/replay and old/new chain regressions.
- Six actual 10,000-seed engine runs passed: random, survival, knowledge, progression, recovery and separate managed council. Seeds 0..<10000, cap 500. Every field of all six downloaded JSONs matches the local final reports. Living caps remain censored, not wins.
- XcodeGen, boot, Simulator build, actual install and launch passed: Xcode 16.4 (16F6), iPhone SE third generation, iOS 18.5.
- Six UI tests passed individually, zero failures, 567.229 seconds: audio/mute; council/cooldown persistence; English decision/resume; twenty illustrated fixtures and large text/Reduce Motion; Turkish decision/resume; statistics in both languages/text sizes.

## Artifact provenance

| Artifact | ID | Downloaded ZIP SHA-256 |
|---|---|---|
| iphone-ui-evidence | 14254632513 | a99c220446ebff69922047b3d9e18f5a05d776cfe1cd9b4d7d7d81e4a5dd79d7 |
| quality-reports | 14253252942 | e3eb5622e3e676568056102f4100aae5adec7260079d65b5acc025b96180b745 |

Both hashes match GitHub's digests; both artifacts identify source 80a7bf5. Local ignored extraction: artifacts/run-43908707917-attempt4/{ui,quality}. Remote UI retention expires 2026-11-30; local copies remain. There are 180 exported attachments and three captures per illustrated fixture. No export error or collected application crash report. Machine evidence: analysis/milestone135-verified/native-attempts.json.

## Actual visual review

| New card | Standard capture |
|---|---|
| herd_truce | F9520396-A359-4A5E-B442-21EF714F3DBD.png |
| ore_wash | A08C3315-A1AE-4A3D-B15C-6D2D7042868F.png |
| pasture_pledge | 9638DB3E-70E4-4BC6-8071-0EE32CFAB984.png |
| grazing_appeal | D51F01A7-ED9E-4503-918A-0D63C5F78401.png |
| slag_basin | D7651B33-E3CF-4A40-A1E1-82F34A673607.png |

All five actual game captures were visually reviewed. Full portrait scenes fit the shared well. Entry captures have variable partial entrance-animation opacity; they are not final contrast/color measurements. Stable scrolled ore/gate/slag choices are readable and reachable; unavailable inherited choices are correctly disabled. Granary large-text/Reduce Motion and reachable choices, English normal/large scrolled frames and installed-launch main menu were also inspected. Long text needs scrolling; content clips to the safe viewport without painting through the status bar.

Fixtures force card/era for presentation while retaining real choice availability. Natural history access is separately established by engine regressions and seeded ordered histories.

All four production first-paint OCR notes (TR/EN × normal/large) report "legacy=false, visible=6, missing=[]". Exact-value/confidence/status-bar assertions remain unchanged. Legacy-layout diagnostic comparisons are not production acceptance.

## Audio and remaining limits

Actual audio JSON contains 64 events. All three cues have API start/playing success: card-open 0.24s, choice-soft 0.12s, decision 0.22s. Muted events report no playback. No missing cue, invalid/error record or write error. This verifies functional API playback/mute, not hearing, mixing or production music quality.

Twenty generated illustration candidates exist; 115 remain missing. Physical-device listening, real OS accessibility, color/memory/FPS, historical/legal review, signing and Game Center account/device acceptance remain open. CI success does not resolve the documented survival, starvation, ecology or pacing regressions. Era 4 stays closed; original product targets remain unfinished.

## Historical account failures

Attempts 1/2/3 (jobs 133444441298, 133446009124, 133447509389) failed before any runner/step because of account payment/spending limits, with no logs/artifacts. The separate arm64 capacity notice was informational. Attempt 4 queued and then ran successfully after user confirmation. The agent changed no payment setting, billing amount or repository visibility. Historical failures remain recorded rather than relabeled as passed.

# 90-card milestone checkpoint — 2026-11-15

## Current status

**90 cards / 203 choices / eras 30-30-30; 61 local Swift and 31 Node tests passed. Native OCR/art/audio gate and final comparative report assembly pending.** 12 eras / 800 cards / 100 approved chains / 30 endings remain the original targets. Phase 2 is not complete.

- Started from main 56aad88, synchronized with origin/main. Existing README, root technology, logs, council report and untracked user work preserved. Pre-edit working patch saved in artifacts/milestone90-before. No reset, clean, stash or force push.
- Measured post-smelting loss stages using actual production choose observer. Original 76-card progression reproduced 9879/7034 era reach exactly. Of 2707 metal-owning runs ending before Bronze, 2706 lacked stability, 1277 lacked population, 667 had empty stores (overlapping final-state counts). Post-metal population losses: world/starvation 98929, delayed 21622, borrowed_ox.smaller 14429. These totals are not independent causal attributions.
- Initial repair on 76 cards reached Bronze 7554/10000. Initial 90-card draft regressed to 6189; calendar/early-repayment correction alone reached 6520. These failed design trials are retained as evidence, not concealed as passing balance.
- Root production problem: cultivation granted a technology/era gate but no food when a shared granary was not built. Production now separates fields (farmProduction), storage (+1 with fields), environment-scaled irrigation, work calendar (+1 on living land) and irrigated terrace (+1). Total world production is capped at ordinary consumption; hard extra consumption remains. No era threshold, event weight, cooldown or policy score changed. Old saves need no schema migration.
- Original 76 IDs retained. New authored module milestone-events.mjs adds winter_guarantor, guest_path_watch, summer_pools, hide_rent, council_shelter; kin_repayment, guest_roofs, ditch_seed, terrace_stones, village_workdays; surety_release, harbor_residency, furnace_coop, gate_ward. Eight one-shot histories, six recurring crises. Debt and hospitality paths unlock branch-specific future decisions through real delayed queues; labels alone are not completed-chain certification.
- Five recurring old events now use the latest decision from saved history to present a different third option after the relevant repeated choice. Other two choices remain usable; normal choices reopen after another decision. No new GameState fields; optional Condition fields decode old content and derive history from v1 saves. Learned sanitation offers paid maintenance. Tests verify gates, rotation, branch draws, costs and save/replay.
- Some controlled delay tests assumed the same filler choice stayed available, and a story-draw fixture could accidentally hit cooldown after unrelated draws. Updated fixtures to use legal rotating choices and explicitly isolate target cooldown; existing narrative assertions were retained. All 61 Swift tests now pass. Negative Node tests reject invalid/contradictory decision references.
- UI: one text run for a stat label/value, same contrast and adaptive columns; clip the scroll viewport at the safe-area boundary. A new UI test compares the old Debug-only stat layout and production layout at TR/EN normal/accessibility3 sizes, inspecting rendered pixel crops with Vision OCR. No fixed screenshot sleep added. Actual root-cause/reproduction and safe-area acceptance remain pending native artifacts.
- Existing three illustrations preserved; added original green_stone and smoke_shift candidates with built-in imagegen. Exact prompts/provenance in assets/generation_prompts.json and assets/LICENSES.md. Five real candidates, 85 illustrations missing. Art test covers all five through real menu/decisions. Historical/commercial/physical-device approval remains open.
- Original synthesized card-open.wav (240ms) and choice-soft.wav (120ms) integrated with sound toggle; existing decision.wav retained. Deterministic PCM structural/peak tests pass. Simulator audio logging records actual player start/failure; hearing/mix quality requires device listening.
- Final progression 90-card result: Neolithic 9836, Bronze 9557, repeat 70.5572%, mean 114.4874 turns, 376 living caps. More successful progression also means a longer stay in the small Bronze deck; do not describe all-policy repetition as improved. Final four-policy same-seed comparison remains to be assembled after local runs finish.

### Next actions for this checkpoint

1. Finish comparative local report assembly and the single native checkpoint; inspect OCR A/B notes, whole screenshots and audio diagnostics. Fix actual failures before delivery.
2. Record the verified source SHA/run and any remaining image/render limitations; preserve experimental failures.
3. Next development group: purposeful recovery/long-session repetition, branch editorial approval and content toward 120/180 alongside art/audio. No release, physical-device, VoiceOver, signing or Game Center account acceptance yet.

## Previous 76-card record (historical)

# Progress checkpoint — 2026-11-15

## Current status

**76-card development group verified locally and in native CI at b444e9f; remaining balance and visual issues are recorded below.** Original targets remain 12 eras, 800 cards, 100 complete chains, 50 cross-era links, 30 endings. Phase 2 is not complete.

## Next development group: progression, recurrence and presentation — 2026-11-15

- Confirmed HEAD debb92e and matching origin/main. Preserved unrelated working files; initial patch/files saved in artifacts/phase2-next-before. No reset/clean/stash/force push.
- Added technology acquisition frequencies/turns, actual pre-transition stats, overlapping gate blockers, first eligible/selected observations, eligible unselected counts and first-era immediate resource costs. Snapshot decks allow reproducing the 52/64 analysis without rewriting the runtime resources. See PROGRESSION_ANALYSIS.md.
- Extracted the three old policies without changing their scores or tie-breaking; six before runs reproduce prior results exactly. Added deterministic, expected-value progression policy using only available current choices and authored effects; missing technology retains value at knowledge cap. Local tests prove no RNG/state mutation and replay across save.
- Measurement: 64-card random first river presentation 7.62 versus 6.40 at 52 cards; knowledge 8.03 versus 6.70. Missing cultivation and village stability were major repeated blockers. Progression on the unchanged 64-card deck reached eras 2/3 in 8909/7480 runs.
- Added exactly twelve TR/EN events in season-events.mjs, four per era. Count 64 → 76 (25/25/26), all old IDs retained. 162 choices, four probabilistic decisions, seven thematic groups, 35 detected cross-era flag links. Not seven approved completed chains.
- New events: calving_herd, spring_seedbed, winter_porters, hunt_challenge; fallow_strips, seed_lots, silt_turn, grazing_strip; harbor_ballast, seal_copy, smoke_shift, silt_charter. Three one-shot histories and nine recurring crises. Branches use resource/knowledge/faction conditions, old apprenticeship history and delayed seed evidence. Positive supply choices have actual adverse or delayed costs.
- Closed first fire, stranger child, first memorial, seed-debt rule and ancestral land decision on their existing flags, compatible with old saves. Empty seat excludes current rulers; adopted measures, built household stores and established canal routing stop repeating. Seasonal illness, hunting, migration, irrigation maintenance and market/production crises remain eligible. Added maintenance cost to recurring soil trials. No thresholds, weights or cooldown changes.
- Local: 53 Swift and 27 Node tests passed, content audit 0 errors/warnings, generation/--check/mirror passed. App/UI Swift syntax parsed on Windows; this is not local iOS compilation. Four final 10,000-seed simulations completed without stat-bound or deck exhaustion failures. New branch, recurrence, cost, save/replay tests pass. Natural policy tests cover 100 seeds × four policies in addition to full reports.
- Final random era2/3 reach 6992/3768; survival 0/0; knowledge 8255/3937; progression 9879/7034. Repeats: 19.88%, 84.36%, 55.97%, 46.30%. Progression Bronze decline versus 64 cards and survival repetition remain open. See BALANCE_REPORT.md for comparison, not a final balance certification.
- Presentation: full-ratio main art in a 210-point framed well (140 at accessibility sizes), blurred atmospheric backing, era accents, larger wrapping choice controls, 180ms selection tilt with duplicate-tap guard and save-failure recovery. Reduce Motion skips motion and delay. Accessibility-size stats use one column. Existing art untouched.
- Produced original first_granary candidate using built-in imagegen; exact prompt and path in assets/generation_prompts.json and LICENSES.md. 3 real candidates now exist; 73 current illustrations remain missing. No new sound/music/branding assets claimed. All three existing-art cards are included in new UI screenshot tests, with large text/Reduce Motion fixtures. Those fixtures are Debug-only and never inject outcomes.
- CI source now runs progression as well as the old three policies and optional council management. Existing three UI tests retained; one additional art/accessibility test added. Simulator selection attempts a real iPhone SE 3, falls back explicitly if unavailable. Native compilation and actual visual review remain pending until run evidence is recorded.

### Next exact actions

1. Native gate completed at b444e9f / run 43709935129. Next address initial-frame stat rendering and scroll-edge capture stability alongside the balance work.
2. Investigate the remaining post-smelting population/stability burden and survival recurrence with purposeful recovery policies. Do not tune era thresholds solely to raise rates.
3. Continue toward 90 then 180 first-three-era cards in distinct batches; extend under-covered Bronze/debt/hospitality branches and editorially approve completed chains.
4. Continue premium art/audio and UI quality alongside content. VoiceOver, actual OS accessibility toggles, device performance, Game Center signing/console setup and weekly balance pinning remain open.

## Historical 64-card checkpoint

## 2026-11-15 — source consistency and inheritance batch

- Confirmed clean remote relationship at HEAD 83170b3 and successful run 43030804344. The working tree was not clean: staged/unstaged content, tests, reports, draft flint_apprentice, bark_shelter effects and root copies existed. Original staged/working patches and affected files were saved locally under artifacts/phase2-2026-11-15-before; no reset, clean, stash or force push used.
- Runtime: package resource Sources/FateCore/Content/cards.json. Authored source: tools/build-content.mjs and imported event modules. Root cards.json was 24 cards in Git, 52 locally, with an older apprentice variant. Canonical local JSON also had 52 IDs but malformed apprentice outcomes. Normalized the latest draft helper calls and delayed arrays while preserving IDs, teach/reserve decisions, effects and flags. Retained the user's bark_shelter work. See CONTENT_SOURCES.md.
- Builder now writes root cards.json as a compatibility mirror; --check and mirror regression checks prevent drift. No runtime model or save version change. Other root JSON/editor/backup files are preserved outside this milestone.
- Added exactly twelve original bilingual one-shot events in tools/content/inheritance-events.mjs, four per first-three era. Local count 52 → 64 (21 Paleolithic, 21 Neolithic, 22 Bronze). All 52 old IDs retained. 136 choices; 32 statically detected cross-era flag requirements (previous 17). These counts are not completed-chain certification.
- New arcs: mantle privilege/rotating mandate → council cord → succession seal; shared/claimed quarry → road obligations → city arbitration; saved/eaten seed → seed guardianship → famine debt correction; old shelter → brick-drying practice → city roofs, with shared-hearth history unlocking joint maintenance. Delayed consequences gate downstream events; branch flags unlock optional recall, covenant, trial and guarantee decisions.
- All twelve new disputes close on every possible outcome. Existing unseen-first selection, sorted weights, cooldown and RNG implementation are unchanged. Repetition diagnostics now identify the cards receiving repeats. Do not change weights to conceal content scarcity.
- Local verification: 46 Swift tests and 27 Node tests passed; generation and --check passed; structural audit 0 errors / 0 warnings. Tests exercise production selection and delayed queues with controlled era/stat fixtures, branching options, closure, v1 save round-trips and the repaired apprentice. They do not prove every branch occurs in unrestricted human play.
- Same-seed 10,000 × three-policy baseline recorded after normalizing the 52-card draft, then repeated for 64 cards. See BALANCE_REPORT.md. Native CI passed: [run 43705065924](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43705065924) at `00895b38c8140213271423bb56748d2f9de4f788` passed every step: 27 Node tests, generation --check, structural validation, 46 Swift tests, 10,000 runs each for random/survival/knowledge plus the separate managed-council policy, Xcode project generation, iPhone build/install/launch and 3 UI tests (122.552 seconds, zero failures).
- Art: 2 existing generated candidates; 62 illustrations missing, including all twelve new briefs. All new cards use the existing prototype decision cue, normal/settlement animation definitions and localized risk text. No new production sound, illustration, music or settlement renderer is claimed. New buildings currently affect later flags/choices; they do not add unimplemented automatic production or visuals.

### Next development group

1. Continue from verified 00895b3 toward 90 cards in distinct 10–15-card batches; investigate lower era access and recurring-pool scarcity using the new reports.
2. Use repeat-by-card evidence to author recurring crises with finite costs and historically valid recurrence; expand remaining debt, hospitality and environmental branches. Complete editorial/branch review before counting a whole chain.
3. Add generation-aware/active-alliance narrative gates only with save-compatible tests; these new arcs currently use durable historical flags rather than checking generation count or active pact status.
4. Develop first-card artwork/audio and small-screen/large-text QA alongside content. Physical device, signing, Game Center console, weekly version pinning and full production assets remain open.

## Historical checkpoints

## 48-card authored batch — 2026-11-10

- After the native support/pact gate passed, added 12 individually authored TR/EN events (four per first-three era): winter_cairn, injured_tracker, return_from_ridge, marrow_shares, speaking_field, guest_seed, winter_reserve, borrowed_ox, seal_appeal, guest_gate, store_witness, charcoal_embargo. Totals: 48 cards, 97 choices, four probabilistic choices, 15 explicit cross-era links. Seven thematic groups are still not seven complete approved chains.
- Every new event has targeted faction effects, a distinct art brief, decision cue/animation metadata and future consequences/flags. Eleven are one-shot; only the seasonal ox loan recurs under low-resource conditions. The finite bone cache was made one-shot after a controlled simulation exposed repeatable food supply. No missing production art/audio is counted as delivered.
- Conditions add optional faction relationship and leadership gates, compatible with old JSON. Delayed tracker recovery opens a third exile-return choice. Charcoal inspection has authority-sensitive outcomes.
- Broken Spear now closes after either choice, including old saves already carrying public_hearing/protected_elite. Previously chosen saved cards remain resolvable. This prevents the same historical injury repeatedly yielding conflicting flags in new runs; it does not erase old history.
- 32 Swift tests and 25 content tests pass; zero content audit errors/warnings. Tests cover eight public-voice paths through three eras, hospitality/granary paths, delayed unlock and save compatibility. Era fixtures test conditional consistency, not unconstrained natural draw timing. Full narrative completion/editorial approval remains open.
- Four simulation reports compare against baselines/support-36-cards; native 48-card verification is pending. UI capture now scrolls the open council panel into view.
- Next: verify this batch natively, inspect full council screenshots, then continue in 10–15-card groups toward 90 and 180, with active art/audio and small-screen QA. Do not treat the phase as finished.

## 50-card development batch — 2026-11-11 (local development; CI pending)

- Added exactly two original narrative events, raising the authored pool from 48 to 50 cards (Era 1: 16, Era 2: 17, Era 3: 17):
  - `granary_pledge` (Era 2, economy) — "Ortak Ambara / The Common Granary". Gated behind the Era-1 `injured_tracker` "walk" flag (`walking_share_rule`), proving a cross-era story-chain link. Two choices: pledge the harvest to the common granary (population/stability up, resources down, `grain_credit` flag, delayed repayment reward) or protect the private store and keep the share rule (authority/resources up, stability down, `granary_closure` flag, delayed hunger cost). One-shot; closes via `resolved_granary_pledge` exclusion after either choice.
  - `water_apportion` (Era 3, legacy, chain `river_memory`) — "Su Kotası / The Water Quota". Gated behind the Era-3 `water_court` flag (`water_court_law`) in the river_memory chain. Two choices: revise the written water agreement to grant the bronze workshop a night quota (resources/authority up, environment/stability down, `workshop_quota`, delayed stream cost) or uphold the written ban and limit the workshop to day hours (stability up, resources/authority down, `water_law_held`, delayed trust recovery). One-shot; closes via `resolved_water_apportion` exclusion after either choice.
- Both events carry unique Turkish/English titles and descriptions, distinct art directions, decision animation/sound metadata, eligibility requirements, cooldown 4, and one-shot closure behavior. No existing card IDs, choice IDs, flags, or schema fields were altered; all 48 previous card IDs remain present.
- Verified locally: `node tools/build-content.mjs` → 50 cards; `node tools/validate-content.mjs` → 0 errors, 0 warnings; `node --test tools/validate-content.test.mjs` → 25/25 pass; `swift test` → 38/38 pass (was 32/32; +6 new narrative tests covering decode, requirements/exclusions, both choice branches, flag-gated follow-ups, one-shot non-repetition, save round-trip and deterministic replay).
- The 48-card CI baseline remains GitHub Actions run 42898795340 (SUCCESS). The 50-card local status has NOT been run through GitHub Actions and is not claimed as a passed iOS/simulator build.

## Support and pact investigation — 2026-11-10

Continuation requirements are preserved in CONTINUATION_REQUEST.md. Clean local/remote HEAD 2287550 confirmed before work. All nine requested project documents were reviewed.

- Instrumented actual authority changes without altering gameplay; reproduced all three 2287550 baseline policies exactly on seeds 0..<10000. Archived diagnostic reports in baselines/2287550.
- Survival: 73,240 broken_spear.hearing choices; 724,606 authority lost to council; exile final triggers 544 council, 722 succession, 587 card effects. 283,329 decision snapshots had hostile power at 100. Existing policies ignore relations, so aggregate exile is not a human skill measurement.
- Implemented JSON-configured economic/cultural faction power, friendly defense, stability-based legitimacy, common opposition, paid joint work, cooldowns, finite council pacts, betrayal/expiry and inherited support. Pressure damage remains five. See POLITICS.md for exact rules and limits.
- Added optional v1 political state and save validation; no state reset, RNG draw or score increase from political transactions. Meclis panel now exposes real actions, rules and faction values.
- 26 Swift tests and 18 content tests pass locally. Tests include cost/cooldown/score restrictions, old saves/replay, pact expiry/betrayal/succession, support/legitimacy, hostile coalition, bounded faction growth and observer neutrality. Three-policy comparisons plus a separate managed-council experiment are recorded in BALANCE_REPORT.md.
- Added a third native UI test for actual council opening, negotiation, stat cost, unchanged turn/card, save restoration and cooldown. Native execution is pending this milestone push; do not mark the council UI verified until CI and screenshots are inspected.
- Next: pass native gate, then author a batch of 10–15 distinct first-three-era cards with targeted faction effects and reachable historical branches. The 90-card intermediate and 180-card first-three-era targets remain open. Full leadership, audiovisual, accessibility and 12-era master scope remain incomplete.

## Previous rivalry milestone — 2026-11-10

- Confirmed all steps passed on the previous documentation push, run 42688637013 (f0250fd), and fast-forward synchronized origin without losing work.
- Added optional targeted effect map `rivalRelations`; old v1 effects still decode. Broken Spear now creates opposing hunter/keeper reactions instead of changing both equally. Other cards retain authored common deltas for now.
- Stable faction IDs retain power/relations through first-three-era identities (Hunters → Field Council → Bronze Guild; Memory Keepers → Ancestors → Scribes). Council UI displays era-appropriate motivations, including for existing saves.
- Every fourth turn the strongest eligible opponent challenges the player, with stable ID tie-breaking. A friendly strongest faction no longer shields a weaker opponent. Hunters affect authority; keepers affect stability. At most one challenge occurs per meeting and its explanation is included in history/results.
- Local verification: **19 Swift tests and 18 content tests passed**, zero content errors/warnings. Three-policy simulation comparison recorded in BALANCE_REPORT.md. Remote validation: [run 42838850246](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42838850246) at `dffeea8`: all steps passed, including 19 Swift tests, 18 content tests, 30,000 simulations, native build/install/launch, and 2 TR/EN UI tests (89.585 seconds, zero failures). Artifact `13776020493` contains 12 test PNGs, accessibility hierarchies, xcresult and diagnostics; downloaded locally for inspection.
- This is an initial differentiation step, not a complete rival system: coalitions, support actions, successor traits, data-driven faction profiles and broader targeted card authoring remain open. Existing weekly balance-version pinning concern remains.

## Previous session: Simulator UI automation

Fetched origin and verified a clean `main` matching `origin/main`; no user changes overwritten. GitHub connector confirmed every job step succeeded in [run 42666624049](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42666624049), including Swift/content tests, 30,000 simulations, XcodeGen and simulator build. macOS/Xcode is available through CI and is no longer a general development blocker.

Added real Turkish/English XCUITest flows, Debug-only isolated test saves, stable accessibility identifiers, installed-simulator discovery, install/launch, screenshot export and crash/log artifacts. Details in `UI_TESTING.md`. **Remote run 42668076933 passed all steps** at commit `6bd22bc`: 2 UI tests / 0 failures on iPhone 16 / Xcode 16.4. Downloaded artifact 13696279860 and visually inspected TR menu, card and result PNGs. Launch, real decisions, stat deltas and disk resume are verified. Earlier unexecuted-iOS statements below describe the previous Windows-only checkpoint and are superseded by this section.

## Current content milestone: 36 cards

- Added 12 individually authored bilingual events in `tools/content/legacy-events.mjs` (four per first-three era), bringing content to **36 cards / 72 choices**. Seven multi-card chain groups and nine explicit cross-era links; not seven fully finished master-plan chains.
- New historical follow-ups use actual required flags. Eight one-shot events close through explicit outcome flags; no reissuing the same resolved dispute. Tests prove sources unlock their follow-ups and every choice closes them.
- Event selection now exhausts eligible unseen events before considering repeats. Cooldowns and prerequisites are preserved, weighted choice remains within the selected pool. This changes future event sequences versus older builds; current saved cards/results still load. Balance/content revisions are not yet version-pinned for weekly competition, which remains a release concern.
- Added `first20TurnsRepeatRate` to real-engine simulation reports. Archived 24-card data under `docs/baselines/24-cards/` before running 10,000 seeds per policy again.
- **16 Swift tests pass; 15 content tests pass; content audit has zero errors/warnings.** Three 10,000-run simulations completed. Random-repeat rate fell 54.34% → 42.79%; survival 93.33% → 84.73%; knowledge 93.69% → 88.20%. These improve variety but do not establish final balance.
- Added original `card_river_tracks` illustration with exact prompt/provenance, integrated through the asset catalog. Two generated illustrations now exist; 34 current cards still need production art. Result-button text now uses a dark foreground for contrast. UI menu derives the content count rather than hardcoding 24.
- **Remote validation passed:** commit `ab7f0c8`, [run 42687508772](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42687508772). All steps succeeded: 16 Swift tests, 15 content tests, 30,000 simulations, native build/install/launch, 2 TR/EN smoke tests, screenshots and diagnostic upload. UI tests: 88.802 seconds / zero failures. Downloaded artifact `13705113923`; visually confirmed the river illustration renders and result-button contrast is improved. The larger art moves the second choice below the initial viewport; scrolling remains available, but broader small-screen/large-text QA remains necessary.

The initial workspace was empty. The current repository is connected to `srcnxylmz/the-cards-of-fate`. Windows/PowerShell runs Node v24.11.1 and Swift 6.4.2 core checks; GitHub macOS runs Xcode and Simulator verification. No Apple signing, App Store Connect or Game Center account configuration has been performed.

## Files and implemented behavior

- `Package.swift`, `project.yml`, `.github/workflows/ios.yml`: pure Swift library, macOS test/simulation runner and generated native iOS project configuration, simulator build workflow.
- `Sources/FateCore/Models.swift`, `SeededRandom.swift`, `GameEngine.swift`: seeded weighted selection, six bounded stats, transactional choices, normalized state-dependent outcome weights, delayed consequences gated by era/turn, history, flags, discoveries, buildings, rivals, leadership/exile recovery, generational succession, two actual collapse conditions. Empty eligible deck explicitly reports development-content exhaustion, not an authored ending.
- `Persistence.swift`: atomic JSON writes, saved RNG/current card/result, schema header check; corrupt/unsupported data reports an error. Real migration implementation awaits a prior schema to migrate.
- `App`: SwiftUI menu/play/results/history/collection/settings/weekly ranking; separate story and weekly save slots, unranked expired-week continuation remains in weekly slot; SpriteKit settlement placeholder; core haptics and AVFoundation cue; GameKit authentication, own/top scores and persistent best-score retry queue with occurrence checks.
- `tools/build-content.mjs`, `tools/content/legacy-events.mjs` and bundled JSON: 48 hand-authored TR/EN events (16 per first-three era), 72 choices, three probabilistic decisions, 12 era definitions, balance and transition technology data. Later eras are metadata only.
- `App/Assets.xcassets`: original generated `sacred_fire` and `river_tracks` illustrations integrated by asset name; exact prompts and provenance saved. 46 authored card illustrations missing.
- `App/Resources/decision.wav`: original 220 ms prototype cue. Twelve music and twelve ambience assets missing; required 40-effect library not complete.
- `tools/validate-content*`: executable validator and 25 automated tests. `Tests/FateCoreTests`: 32 passing Swift tests. `UITests/FateSmokeTests.swift`: 3 native smoke tests. `Sources/FateSimulation`: production-core simulation with random, survival and knowledge policies and atomic JSON output. `tools/swift-windows.ps1`: repeatable Windows setup/test/simulation helper.
- All six required project documents plus schema, release checklist, asset provenance and complete master specification are saved.

## Historical Windows checkpoint evidence

1. `node tools/synthesize-audio.mjs` — succeeded, generated WAV.
2. `node tools/build-content.mjs` — succeeded, generated 24 cards and 12 eras.
3. `node --test tools/validate-content.test.mjs` — **15 passed / 0 failed**.
4. `node tools/validate-content.mjs` — **zero structural errors**. Three incomplete single-card chain groups flagged. Report in `content-report.json`.
5. Generated illustration visually inspected in tool output; subject/style/no-text checked, final device rendering not verified.
6. `node tools/validate-content.mjs --release` — expected exit code **1**, release blocked with zero structural errors and unmet scope/platform requirements.
7. Saved asset integrity checked: PNG signature and catalog path, PCM WAV RIFF/data lengths, 44.1 kHz / 0.22 s; all six required documents exist; ten Swift test methods counted. Passed. These checks do not replace image rendering or audio listening on-device.

8. Swift 6.4.2 Windows Debug build and initial ten XCTest tests passed. Reviewed the simulation/leadership code and fixed succession resolving after leadership scoring: an heir with zero authority now enters exile immediately, without a phantom leadership turn.
9. Added shared normalized outcome probability analysis without RNG consumption. Added optional result consequences so delayed effects, succession and leadership changes appear in the result screen. Existing v1 result records lacking the field still decode; verified by regression test.
10. `./tools/swift-windows.ps1 -Task Test` — **13 passed / 0 failed**. Log: `swift-test-windows.log`. First cold compilation emitted SDK `wchar_t` module warnings; successful builds also emit a `.build/debug` or `.build/release` symlink warning on this host. Neither prevented tests or executable runs. No system configuration was changed to hide warnings.
11. Initial `swift run -c release FateSimulation 10000` completed; baseline saved as `simulation-results.json`. After code changes, executed **10,000 seeds each under three policies** using the Windows helper, all exit code 0: `simulation-random.json`, `simulation-survival.json`, `simulation-knowledge.json`. See `BALANCE_REPORT.md`. They represent 30,000 runs over the same 10,000 seeds, not 30,000 unique seeds.

At this initial Windows checkpoint Apple-platform checks were unexecuted. The successful native build/UI evidence at the top of this document supersedes that limitation. Physical-device QA, Game Center and audiovisual performance remain open.

## Current scope ledger — 2026-11-15

| Requirement | Actual | Outstanding |
|---|---|---|
| ≥800 original cards | 76 | 724 minimum, correctly distributed |
| ≥60 per era | 25 / 25 / 26 in eras 1–3; zero in 4–12 | 104 more for Phase 2, 540 for eras 4–12, 80 special |
| ≥100 completed chains | No fully approved chains; 7 multi-card groups | Branching, closure, reachability and editorial completion |
| ≥50 cross-era links | 35 detected flag links | 15+ and full branch/editorial validation |
| ≥30 endings | 2 collapse predicates | 28+ unique designed fates and narrative summaries |
| Card illustrations | 3 generated candidates | 73 current + all future content; final visual approval |
| Audio | 1 prototype cue | 12 music, 12 ambience, 40 production effects |
| Animations | Basic transitions/flicker/haptics | 15 distinct coordinated presets, cinematic eras |
| 10,000 simulations | 10,000 seeds × 3 policies executed; reports saved | High repetition and censored long runs; expand content and rebalance with human playtests |
| Release | Scaffolding/checklist | Full acceptance, signing, console setup, TestFlight |

## Historical next actions (superseded by the current group above)

1. Expand targeted decisions in eras 2–3 and design bounded faction support/coalitions. Investigate survival-policy exile increase before adding further pressure. Add native council-panel screenshot assertions; current smoke tests cover the main game/save flow, not detailed faction presentation. Keep existing saves compatible; reuse Simulator automation after each milestone.
2. Use the 36-card comparison in `BALANCE_REPORT.md`. Strategic repetition remains 85–88%; 14.42% of knowledge-policy runs reach the 500-turn cap. Expand unique crises/legacy consequences and investigate sustainable loops. Do not equate heuristic results with human skill or pacing.
3. Test iPhone UI in Turkish/English at smallest size/large text/VoiceOver/Reduce Motion; ensure save failures preserve current state and double taps cannot resolve twice. Game Center tests require the owner’s account configuration.
4. Deepen the first-three-era systems and author 132 additional distinct cards to reach 180. Continue leadership/rival differentiation and successor traits. Finish initial chains; thematic grouping alone does not count.
5. Continue sequentially through master phases 3–9. Keep every blocker and unexecuted check explicit. Do not replace missing production assets with placeholders and call release ready.

## Known limitations to address

No full secondary-stat model, census/stock simulation, individualized successor traits, branching technology tree, achievements, persistent cross-run collection/history, personal-record dashboard, full error/technology-name localization, tutorial, backup recovery, all 30 endings, branding/icon, premium animations or complete audio. Most cards still share a common relation delta; Broken Spear uses targeted deltas. Faction support, finite pacts and initial common opposition are implemented; richer inter-faction relationships and successors remain pending. Save version dispatch rejects unknown versions; it does not yet transform old schemas. Static reachability checks are approximate, not proof of every chain’s playability. Sound/music settings exist but only one prototype sound is available.

The small event pool permits repetition and may exhaust under conditions/cooldowns. This is visibly labeled development behavior and must be eliminated as a content bottleneck before release.

### Native gate failure and correction

Run 42845432807 at ed6090b passed core/content tests, four simulation policies, build/install/launch, and the two existing UI flows. The new council test failed at faction.hunters existence. Downloaded artifact 13778407627; the screenshot proves the panel opened. The accessibility hierarchy shows every child inherited council.panel, overwriting the faction/action IDs. Moved the identifier from DisclosureGroup to its label and enlarged council button hit areas. Corrected native gate passed: [run 42889283237](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42889283237), commit fdf2b79: all steps passed; 26 Swift tests, 18 content tests, three 10,000-seed policies plus one 10,000-seed managed-council experiment, build/install/launch and 3 UI tests (119.418 seconds, zero failures). Artifact 13798560384 downloaded. The council screenshot confirms hunter relation 20; panel content is partly below the viewport, so the next test revision explicitly scrolls for full-panel captures.

### Completed-world event recurrence correction

The 48-card candidate still reused completed smelting/writing discoveries and built city walls. Added optional technology/building predicates and world-state exclusions for river_tracks after observation, green_stone/kiln_crack after smelting, clay_archive after writing, and city_walls after construction. No weights or pressure-damage constants changed. Old saves already holding technologies/buildings are recognized; an already displayed card can finish normally. Pre-correction reports preserved in experiments/48-completed-events-repeat. 32 Swift tests / 25 content tests pass. Final same-seed comparison below BALANCE_REPORT.md supersedes the intermediate 48-card numbers.

### Native evidence reviewed — 2026-11-15

[run 43705065924](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43705065924) at `00895b38c8140213271423bb56748d2f9de4f788` passed every step: 27 Node tests, generation --check, structural validation, 46 Swift tests, 10,000 runs each for random/survival/knowledge plus the separate managed-council policy, Xcode project generation, iPhone build/install/launch and 3 UI tests (122.552 seconds, zero failures). UI artifact `14158103245` downloaded to artifacts/run-43705065924; quality artifact `14158292920` is available remotely. Inspected TR first-card and EN council PNGs: the new shared_quarry text and both options render, and the council relation is 20 after joint work. Card art is visibly a placeholder; this is not production art approval or small-device/accessibility coverage. CI evidence is for the source commit 00895b3. This follow-up changes documentation only and uses [skip ci] to avoid rerunning identical builds.

### Native compilation correction

Run 43708295663 at 3f8ae37 passed content/check, 53 Swift tests and all five simulation runs, then failed iOS compilation: accessibilityReduceMotion is a read-only EnvironmentValues key in Xcode. Removed environment writes; production still reads the real system setting, while Debug-only test flags can additionally disable motion. Dynamic Type uses its supported view modifier. No game rules/content or simulation scores changed, so full local simulations were not repeated. Corrected native run is pending.

### UI evidence lifecycle correction

Run 43708816346 at a63ae44 passed content/check, 53 Swift tests, five simulations, iPhone SE (3rd generation) iOS 18.5 build/install/launch and all three existing UI tests. The new illustrated-card test completed its assertions but failed during teardown: the last fixture terminated the app before final screenshot capture. Moved fixture termination before each launch, leaving the final app running for teardown evidence. This is a test lifecycle correction, not a gameplay change. The report formatter also removes an invalid all-zero terminal-blocker column: its snapshot precedes terminal predicates. The four gate counters and actual ending distributions remain usable; no simulation rerun is needed for this report-only clarification. Corrected native run remains pending.

### Actual compact-screen visual correction

Downloaded artifact 14160365084 from the failed teardown run. Its real SE 3 screenshots exposed two layout issues despite passing interaction assertions: an unconstrained decorative image caused the supposedly fitted main image to crop; three stat columns hid English values on the narrow screen. Bounded both image layers using GeometryReader, keeping only the backdrop cropped, and switched normal stats to adaptive minimum-150-point columns (two on SE, three when wide). The large-text fixture now scrolls once before art capture. This visual evidence supersedes the unverified full-ratio claim above; corrected screenshots remain pending. No simulation data or gameplay changed.

## Verified 76-card native checkpoint — 2026-11-15

[Run 43709935129](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43709935129) at `b444e9f7b19c11fffb97d2a88fae1ea415378ee5` passed every step. Xcode 16.4 (16F6), iPhone SE (3rd generation), iOS 18.5; actual screenshots are 750×1334. Passed: 27 Node tests, generation --check, content audit (76 cards / 162 choices / zero errors or warnings), 53 macOS Swift tests, five 10,000-seed simulations (random, survival, knowledge, progression and optional managed council), XcodeGen, simulator build/install/launch, and four UI tests (165.253 seconds, zero failures). Old save/replay and new narrative/recurrence tests are included in the Swift suite.

Downloaded UI artifact 14160655066 and quality artifact 14159554347 to artifacts/run-43709935129. All four standard-policy CI reports exactly match local era reach, average turns, repeat rate, caps, technology gains, ending distribution and decision counts. The optional managed-council report is separate from the four-policy comparison.

Inspected actual PNGs: TR sacred_fire (59D8CFA3-2E78-46F5-B94E-16EF99A1D274.png), EN river_tracks (DF1EA511-1D1E-4924-9981-5BFCE8AEB26B.png), large TR first_granary text (181978C8-B67C-4034-A25D-DC546D6B415B.png) and reachable choices (70D879C5-8465-412D-8D08-0429E2DCBBC3.png). Main fire/river illustrations now preserve their full portrait ratio; the atmospheric background alone crops. Large text wraps and the second choice can be reached and resolved; the granary art is partially above the viewport after scrolling. This is not approval of every large-text layout.

Visual limitation: the immediate EN river art capture omits numeric stat text despite visible labels/bars. In the standard EN first-card screenshot (9ADC1575-BC2C-4CE9-8701-9EBE40FEFB89.png) and the same river card's result (B6A299B8-FCB2-4F3B-8CDD-DE6779A93A07.png), all six values are visible. Keep initial-render/screenshot stability open; neither claim permanent English layout correctness from passing accessibility assertions nor diagnose a root cause from one frame. Captures after scrolling also place content under the status bar; review scroll-edge treatment next.

Failures are retained: 3f8ae37 failed on a read-only accessibility environment write; a63ae44 failed only the new test's teardown screenshot after terminating the app. Both were fixed without removing assertions. Intermediate run 43709745446 at 5cb15b6 was cancelled to conserve quota after actual screenshots prompted the final layout correction. Successful evidence is for b444e9f. This documentation-only follow-up uses [skip ci] and does not claim a second source build.

Remaining: progression Bronze access regression (74.80% → 70.34%), high survival repetition, first-frame capture stability/scroll-edge treatment, full art historical approval (including stylized timber key), 73 missing illustrations, production audio, VoiceOver and actual OS toggles, physical-device performance, signing and Game Center account checks. No release or full Phase 2 completion claim.

### Survival lifetime correction before native acceptance

The pre-food 90 draft reduced survival repetition to 63.39% largely alongside a shorter mean lifetime (68.641 vs 136.0397). A same-seed 10,000-run isolated food study raised the new dry/cache alternatives to 12 immediate supplies while preserving ecological costs and delayed spoilage. Their return stays below the risky feast/cross alternatives (17/18). Survival then reached mean 101.5947, repeat 75.2792%, 51 living caps, still era 1. Adopted this measured tradeoff; no claim that duration is fully balanced. Pre-food reports/deck retained separately. Native run e9d9e95 is obsolete and will be cancelled before publishing the corrected source.

### Fixed-frame OCR verification

Review found that the initial OCR helper could take a new screenshot for each stat. It now reuses one first-frame image for all visible values. Only the UI test and workflow change; runtime identity is guarded against ee15f32710c51b8e8148ebcbd4440aba3cfaa6ef before any UI-only rerun. Ordinary pushes/default dispatch still run full validation. Native acceptance is pending.

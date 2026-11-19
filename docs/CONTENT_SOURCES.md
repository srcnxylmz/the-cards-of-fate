# Content ownership and generation — 2026-11-16

The app reads ContentDatabase.bundled() in Sources/FateCore/ContentDatabase.swift. Package.swift processes Sources/FateCore/Content into Bundle.module. The executable and tests use that same database. Root-level JSON files are not runtime inputs.

Authoring sources: tools/build-content.mjs plus tools/content/legacy-events.mjs, council-events.mjs, inheritance-events.mjs, season-events.mjs, adapt-events.mjs, milestone-events.mjs, recovery-events.mjs city-events.mjs stewardship-events.mjs and continuity-events.mjs. The builder writes the canonical Sources/FateCore/Content/cards.json and derived era/balance/technology metadata. politics.json inside the package is maintained separately. Edit authoring modules, then run node tools/build-content.mjs.

Root cards.json was a stale 24-card copy in Git HEAD 83170b3. At session start the user's working root and package files both had 52 IDs but different flint_apprentice revisions. The package had two delayed consequences mistakenly stored as probabilistic outcomes; the source also called choice/card helpers with incompatible argument shapes. The root copy had older silent/investigate choices. Pre-edit working and staged versions are preserved locally under artifacts/phase2-2026-11-15-before (ignored). No unique root card IDs were removed.

The latest local teach/reserve decisions are retained, with knowledge +6/stability -2 versus authority +5/resources -3. Their delayed knowledge +4 and authority +3 effects and completion flags are preserved in the proper delayedEffects arrays. The source's 0.6/0.4 arguments were misplaced between separate player choices, not valid outcome weights. Each chosen option now has a deterministic outcome. Text/brief were corrected to a Bronze-era flint workshop. No engine or save schema change was required. The user's bark_shelter damp_danger branch and delayed consequence are retained.

Root cards.json is now a generated compatibility mirror, with all150 IDs. The builder updates it and the package resource together. node tools/content-sync.mjs checks byte equality. node tools/build-content.mjs --check additionally checks all generated outputs against their authoring sources without writing. Both are enforced by CI, with a stale-mirror regression test. Generation is idempotent.

Root technologies.json and the untracked root politics.json are also outside the runtime path. They were not modified or published by this milestone; the user's local versions remain intact. Other pre-existing README/log/simulation/experiment/editor files were backed up or left untouched and were not indiscriminately staged.

Starting points must be distinguished: GitHub 51 cards; user's local draft 52 cards; normalized/tested local baseline 52 cards (17/17/18); final batch 64 cards (21/21/22). Exactly twelve new IDs were authored, four per era. Every original local ID remains present.

The progression study stores explicitly frozen 52/64 decks under docs/analysis/progression-*-before/cards.json. These are diagnostic inputs only, never app resources or authoring sources. FateSimulation --cards reads them without modifying the package. Analysis reports define time sampling and overlapping blockers in PROGRESSION_ANALYSIS.md. The current canonical resource/mirror holds 90 IDs.

The 90-card source group is milestone-events.mjs, with recurrence revisions in adapt-events.mjs. Frozen inputs/reports in analysis/milestone90-* are diagnostic only. First-draft and pre-food data retain failed designs; milestone90-76-repair uses the frozen repaired 76 deck with final production rules. Current canonical/mirror count is 90 (30/30/30), 203 choices.


## 105-card source extension

tools/content/recovery-events.mjs adds fifteen original events to the existing authoring composition. The package resource and root generated mirror now contain 105 IDs, 35 per authored era, 245 choices. Runtime technology metadata gains potter_lease as a smelting source; root technologies.json remains the user's unrelated local document. Existing ninety event texts, choices and effects are checked against the frozen 90-card baseline by tools/recovery-content.test.mjs. Only the four documented historical exclusions and recomputed direct worldFlags metadata differ on older events. Art generation records and actual files are checked by tools/art-assets.test.mjs and tools/art-audit.mjs. No source-module replacement, save-schema change or baseline-policy tuning.


## 120-card source extension

tools/content/city-events.mjs composes fifteen events onto the existing authoring modules. Canonical runtime cards and the root compatibility mirror contain the same 120 IDs. All 105 earlier authored objects are deeply compared against analysis/milestone120-105-before/cards.json. No user root technologies/council/README or experimental file is adopted as a new runtime input. New optional model fields (completedCard, outcome requirements, effect removeFlags) decode older content and saved scheduled effects. The GameState schema stays v1.

Frozen diagnostic reference: Git core 3d589af was archived with Package.swift/Sources/Tests under ignored artifacts/milestone120-before/baseline-package; only the current simulation instrumentation files were copied into that reference build. It uses old 105-card content and food rules. The existing Windows script runs its own package root and writes into analysis/milestone120-105-before. All original five-policy fields were verified identical before comparing new diagnostics. The current package remains intact; no reset/stash/cleanup or production legacy-rules switch was used.


## 135-card source extension

Stewardship events add exactly 15, five per era; the package and root generated mirror agree at135. All 120 old definitions are deep-compared against analysis/milestone135-120-before/cards.json, including the frozen105 comparison. Rules/models/scores are unchanged. DevelopmentDiagnostics and two new ordered chain counters are observational only; enriched random/knowledge 120 reference replays match all existing fields. New output and rejected drafts are separate; original user root files remain outside runtime. Final source/report hashes are in the new reference manifests; natural-versus-fixture coverage remains explicit.


## 150-card source extension —2026-11-17

continuity-events.mjs composes15 original scenes onto the repaired135 source, maintaining50/50/50 and361 choices. All balanced135 objects are deep-compared, while balance-content.test.mjs separately whitelists the four measured changes from native135. Canonical package and generated root mirror remain byte-identical. User root technology, README and council report remain untouched. Frozen decks/reports in milestone150-135-before, milestone150-balance-135, milestone150-draft-unrestored, milestone150-screening and milestone150-verified are diagnostic inputs only. Rejected draft and reduced-catch candidates are not accepted content. No score, runtime rule or save-schema replacement.


## 165-card source extension —2026-11-18

civic-work-events.mjs adds15 original events with55/55/55 and394 decisions. Canonical bundled cards and root generated mirror remain identical. All150 native definitions are deeply compared unchanged by civic-work-content.test.mjs. New technology metadata only adds paid cultivation/writing sources; root user technologies.json remains untouched. Passive technology offers/investments/K100 observers preserve every old150 field over six full reference replays; no RNG/score/threshold/save change. Current separate council report is analysis/milestone165-verified/simulation-survival-council.json, not the user-owned root council file.


## 180 kart kaynak grubu

Son 15 olay tools/content/watershed-events.mjs içinde. Ayrı üretim filtresi dört eski kartın girdi kapısını ekler. Paket ve kök kart JSON’u birlikte üretilir. Dondurulmuş 165 ve 180 kaynakları analysis altında. Kullanıcıya ait kök technologies.json ve meclis raporu sürüm çıktısı olarak kullanılmıyor.

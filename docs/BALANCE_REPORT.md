# Measured balance baseline — 2026-11-09

## 76-card progression and recurrence group — 2026-11-15

Full diagnostic tables and definitions are in PROGRESSION_ANALYSIS.md, regenerated with node tools/report-progression.mjs. Frozen decks and reports: analysis/progression-52-before, progression-64-before and progression-76-after. Same seeds 0..<10000, four policies, cap 500. Six old-policy runs reproduce the 52/64 historical aggregate metrics exactly. Current root simulation-{policy}.json reports describe 76 cards. Native verification passed at b444e9f: [run 43709935129](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43709935129), including 53 Swift / 27 Node / four UI tests and five 10,000-seed simulation runs. Downloaded quality artifact 14159554347: the four baseline-policy reports match local era reach, mean turns, repeat, caps, technology, endings and decisions exactly. UI-specific limitations are recorded in QA_REPORT.md.

| Policy | Neolithic /10000 before → after | Bronze /10000 before → after | Repeat before → after | Caps before → after |
|---|---:|---:|---:|---:|
| random | 5203 → 6992 | 3322 → 3768 | 27.42% → 19.88% | 0 → 0 |
| survival | 0 → 0 | 0 → 0 | 85.27% → 84.36% | 91 → 94 |
| knowledge | 5504 → 8255 | 2959 → 3937 | 84.51% → 55.97% | 1138 → 0 |
| progression | 8909 → 9879 | 7480 → 7034 | 71.54% → 46.30% | 4 → 0 |

A saturated knowledge stat made the old knowledge policy undervalue missing technologies; a regression test demonstrates follow-herd preference at knowledge 100. The unchanged old policies remain baselines. Progression rewards missing required technology and remaining gate deficits, and considers discounted authored delayed effects. It neither consumes game RNG nor chooses unavailable options. Thresholds/weights/cooldowns remain unchanged.

An alternative one-shot seedbed discovery diversifies cultivation access. Historical decisions now close on old durable flags; the empty seat no longer appears while already ruling. Nine new recurring crises replenish the eligible seasonal/economic pool, three new one-shot stories deepen history. Trial gardens now require delayed maintenance rather than yielding repeated unpriced grain. No original card ID is removed; old presented cards can still finish. These data changes and the twelve-card expansion are a combined intervention, not an isolated causal experiment.

Progression reaches Neolithic more often, but Bronze falls 74.80% → 70.34%. The post-technology population/stability burden remains material; do not hide it behind improved cultivation. Survival remains in era 1 and repeats 84.36% of decisions. No final balance or 45–90-minute pacing claim. All four final 10,000-seed runs completed without stat-bound or eligible-deck exhaustion failures. 500-turn caps are censored living civilizations; costs are tested, but absence of every possible optimal infinite strategy is not proven.

## 2026-11-15 — normalized 52-card baseline versus 64-card inheritance batch

Native verification: [run 43705065924](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/43705065924) at `00895b38c8140213271423bb56748d2f9de4f788` passed every step: 27 Node tests, generation --check, structural validation, 46 Swift tests, 10,000 runs each for random/survival/knowledge plus the separate managed-council policy, Xcode project generation, iPhone build/install/launch and 3 UI tests (122.552 seconds, zero failures). CI artifacts retain its simulation outputs. The numerical before/after comparison below is from the executed local Windows runs.

Both versions ran seeds 0..<10000 under each of the unchanged random/survival/knowledge policies, production Swift release engine, 500-decision cap. Baseline files: baselines/phase2-52. Final files: simulation-{policy}.json. The baseline includes the user's local bark_shelter consequence and repaired flint_apprentice helper/delayed-effect contract. It is a normalized local 52-card baseline, not the remote 51-card release. No selector, cooldown, weights, RNG, political rules or economy constants changed in this comparison.

| Policy | Mean observed turns before → after | Repeat before → after | First-20 repeat before → after | Exile runs before → after | Capped runs before → after |
|---|---:|---:|---:|---:|---:|
| random | 30.9645 → 30.4845 | 33.25% → 27.42% | 13.56% → 6.59% | 0 → 2 | 0 → 0 |
| survival | 123.47 → 124.2805 | 87.53% → 85.27% | 24.51% → 10.41% | 84 → 38 | 95 → 91 |
| knowledge | 144.434 → 135.4482 | 86.43% → 84.51% | 13.87% → 7.64% | 159 → 111 | 1307 → 1138 |

| Policy | Era 2 reach before → after | Era 3 reach before → after | Distinct cards observed across seeds before → after |
|---|---:|---:|---:|
| random | 5844 → 5203 | 4220 → 3322 | 51 → 63 |
| survival | 0 → 0 | 0 → 0 | 17 → 20 |
| knowledge | 6504 → 5504 | 3852 → 2959 | 48 → 61 |

All 30,000 final runs passed stat bounds and completed without a runner failure. Era progression declined in random and knowledge policies (see table); new one-shot choices consume turns/resources and these local heuristics do not value long-term paths. Lower repetition must not hide this regression. Next work must examine the extra early-era opportunity costs and intentionally pursue progression before adjusting thresholds. Random and knowledge each resolved all twelve new events across seeds; survival resolved winter_mantle/shared_quarry/ember_watch but did not pursue cultivation, and therefore did not observe the later branches. This is separate from the targeted regression fixtures, which prove branch predicates, delayed gating and production selection. No claim of every branch being reached by these heuristics.

### Progression concern

Random river_tracks.observe resolutions fell from 7,444 to 6,962; knowledge fell from 6,535 to 5,540, while its follow-herd decisions rose from 31,292 to 37,899. Mean resources: random 14.4567 → 14.4820, knowledge 43.2500 → 41.6054. This supports an opportunity-cost/choice-path concern, not a demonstrated selector bug or proof of a single causal explanation. The pool has more early one-shot decisions before cultivation, while local policies value immediate resources. Delayed/cross-era value is not scored. Test a deliberate progression policy and examine actual timing in the next batch; do not silently lower era thresholds to restore a percentage.

### Repetition diagnosis

The selector prioritizes eligible unseen events, keeps prerequisites/exclusions and cooldowns, sorts IDs, then uses authored weights within the chosen pool. Single-use inheritance history leaves the pool permanently after resolution. Once its limited first-era stories are exhausted, survival repeatedly chooses recurring food/stat events; a larger all-era count cannot expand a first-era policy's eligible pool. Knowledge similarly repeats familiar village events while neglecting some progression costs. No cooldown relaxation or arbitrary weight change was used.

New repeatDecisionsByCard telemetry records actual repeat resolutions, without state changes or RNG consumption. Leading repeats in the 64-card run:
- random: empty_seat 4202, sacred_fire 4193, stranger_child 4185, leaking_skin 4128, red_mushrooms 4106
- survival: red_mushrooms 118381, cave_marks 117988, ochre_border 117867, ice_crossing 117841, leaking_skin 117742
- knowledge: reed_fever 83721, seed_debt 83414, ancestor_field 83333, market_measures 83298, ash_garden 83254

These are targets for the next editorial recurrence review and new resource-state crises, not a justification to close every recurring event and exhaust the deck. Existing one-shot gates remain enforced. These diagnostics do not constitute pacing or human difficulty testing. Caps are censored living civilizations, not successful endings. Survival/knowledge repetition remains too high; 64 cards does not meet either the 90-card intermediate or 180-card first-three-era target.

The existing simulation-survival-council.json in the working tree predates this task and was deliberately not overwritten or included as final local evidence. CI separately runs that optional policy on the committed content. Normalizing the local draft and adding twelve narratives changes future seeded sequences versus older versions; same-version save/replay remains deterministic. Competitive balance version pinning remains open.

## Historical 48-card narrative revision — 2026-11-10

Same seeds 0..<10000, same three baseline policies, unchanged support/pact rules. The change combines twelve new events and one-shot closure of Broken Spear; comparison cannot isolate these two changes. 36-card support reports are archived in baselines/support-36-cards. The current reports at this directory level describe 48 cards.

| Policy | Mean turns before → after | Exile runs before → after | Era 2 / 3 reach now | Repeat before → after | First-20 repeat before → after | Caps before → after |
|---|---:|---:|---:|---:|---:|---:|
| random | 32.5173 → 33.7944 | 3 → 2 | 6464 / 4922 | 42.79% → 38.88% | 21.57% → 16.06% | 0 → 0 |
| survival | 78.8368 → 128.3012 | 1 → 98 | 0 / 0 | 84.78% → 88.76% | 40.00% → 29.85% | 0 → 97 |
| knowledge | 120.2965 → 178.2993 | 12 → 143 | 7069 / 4498 | 85.65% → 89.24% | 21.90% → 16.00% | 474 → 1643 |

All four runs completed without invariant failures. Random play encountered all 48 cards across seeds, not every branch. Survival still remains in era 1 by its own investment policy. Early variety and long-run repetition must be read separately: the small pool of recurring older events dominates long games after one-shot history is exhausted. Higher survival duration increases overall repetition; adding one-shot history does not solve late-game loops. No final balance or completed 90/180-card milestone claim.

Managed-council survival: 66.0739 mean turns, 2 exile runs, 0 caps; 44928 paid political actions. This is an optional additional 10,000-run experiment, not one of the unchanged baseline policies.

### Rejected finite-stock loop

The initial 48-card candidate let marrow_shares recur. Its full four-policy results are preserved under experiments/48-repeating-marrow. Survival chose crack 71,298 times, had 165 capped runs, averaged 144.4622 turns and repeated 90.02% of decisions. The only gameplay change in the next experiment made this finite bone cache one-shot after either choice. Crack fell to 9,770 choices, caps to 97, mean to 128.3012 and repeats to 88.76%. This both respects the story and removes repeated use of the same stock. It does not eliminate other sustainable loops; do not conceal the remaining 97 censored survival runs.

## Previous support/pact revision — 2026-11-10

Before changing rules, reran the original three policies on seeds 0..<10000 with observational telemetry. Average turns, exile, repetition and cap counts reproduced 2287550 exactly. Raw before reports: baselines/2287550. Current reports use the same seed set and unchanged choice policies; no council actions in these three runs.

| Policy | Runs with exile before → after | Mean turns before → after | Era 2 / 3 reach now (of 10000) | Repetition before → after | 500-turn caps before → after |
|---|---:|---:|---:|---:|---:|
| random | 120 → 3 | 32.5157 → 32.5173 | 6747 / 5306 | 42.79% → 42.79% | 0 → 0 |
| survival | 1853 → 1 | 76.3418 → 78.8368 | 0 / 0 | 84.28% → 84.78% | 0 → 0 |
| knowledge | 1055 → 12 | 146.098 → 120.2965 | 7267 / 4896 | 88.19% → 85.65% | 1446 → 474 |

All runs passed state bounds; each retains its observed-card counts in raw JSON. Pressure damage remains five. The large drop in exile is consistent with bounded faction power and real defense from relationships/stability. It does NOT prove final balance: political difficulty may now be too low for these policies. Meaningful adverse choices, leadership recovery and human testing remain needed. Repeat rates and censored knowledge loops are unresolved. No new content was added during this isolated rules comparison.

### Measured diagnosis

In the survival baseline, broken_spear.hearing was chosen 73,240 times versus protect 1,620 times. Hearing gives hunters -10 and keepers +8; the policy scores only immediate stats and ignores this political split. Council caused 724,606 authority loss, succession 212,333; card losses were 317,655 (empty_seat.council), 125,481 (red_mushrooms.feast), 53,312 (leaking_skin.boil). 283,329 decision snapshots had a hostile faction at power 100. Monotonic +1/+2 growth made old pressure persistent even without an economic base.

Final zero-authority triggers: council 544, succession 722, empty_seat.council 273, red_mushrooms.feast 225, leaking_skin.boil 89. These sum to 1,853 transitions here. Final-trigger attribution is not an isolated causal experiment: earlier losses matter. Regression tests independently show that friendly support/legitimacy can block pressure, opposition can still win, and succession can still remove a leader in the same turn.

### Optional political management experiment

A separate survival run uses --manage-council, without modifying the baseline policy. It spends only when resources >=35, forming an eligible pact or funding the least-friendly faction below support threshold. 10,000 runs: 37912 political actions, 49.3196 mean turns, 0 exile runs, 0 capped runs. Raw report: simulation-survival-council.json. Resource costs change survival decisions; this is a deliberately simple policy, not an optimal-player or pure one-variable comparison. All actions pass the production eligibility and persistence-compatible state logic.

## Previous rivalry revision — 2026-11-10

Executed 10,000 seeds per policy again using the production Swift release engine. Previous 36-card reports are archived in `baselines/36-cards/`; current raw reports remain at this document's level. Changes combine targeted Broken Spear relations and corrected/differentiated faction pressure. These comparisons do not isolate either cause.

| Policy | Mean turns, before → after | Runs with exile, before → after | Repeat rate now | Capped runs now |
|---|---:|---:|---:|---:|
| random | 32.5176 → 32.5157 | 99 → 120 | 42.79% | 0 |
| survival | 78.556 → 76.3418 | 164 → 1853 | 84.28% | 0 |
| knowledge | 146.1875 → 146.098 | 633 → 1055 | 88.19% | 1446 |

All three runs completed without invariant failures. Survival-policy exile rose from 1.64% to 18.53%, a material change requiring further balance work and human playtesting. It is recorded as an unresolved concern, not a balance improvement. Repetition and long knowledge-policy loops remain unresolved; this milestone does not establish final balance. The policies do not explicitly optimize faction relationships. Native CI repeats these simulations separately.

## Previous 36-card milestone

The historical table below superseded the 24-card measurements before the rivalry revision. Same 10,000 seeds and policies, real Swift release core. This revision combines 12 new events with unseen-eligible-first selection, so differences cannot be attributed to either change alone. Old raw reports are preserved in `baselines/24-cards/`.

| Metric | Random | Survival | Knowledge |
|---|---:|---:|---:|
| Mean observed turns | 32.5176 | 78.5560 | 146.1875 |
| Reached Neolithic | 67.47% | 0% | 72.62% |
| Reached Bronze | 53.06% | 0% | 48.98% |
| Capped at 500 turns | 0 | 0 | 1,442 |
| Repeated-card decisions | 42.79% | 84.73% | 88.20% |
| Repetition within first 20 decisions | 21.57% | 40.00% | 21.89% |
| Unique cards seen across runs | 36 | 12 | 36 |

Random-repeat rate improved by 11.55 percentage points; strategic repeats remain too high. Random Bronze reach improved despite lower Neolithic reach, consistent with the additional smelting discovery route. The survival policy still avoids cultivation; it is not a progression strategy. One-shot follow-ups and broader choice costs reduce the previously measured long-lived loops, but 1,442 knowledge runs remain unfinished at the cap. No eligible-deck exhaustion appeared. All stat invariants held. No final pacing or fairness claim is made.

Raw reports for this previous milestone: `baselines/36-cards/simulation-random.json`, `baselines/36-cards/simulation-survival.json`, `baselines/36-cards/simulation-knowledge.json` (each records `contentCardCount: 36`). The historical section below retains the earlier baseline for comparison.

## Historical 24-card baseline

Executed with Swift 6.4.2, `x86_64-unknown-windows-msvc`, release configuration. Every simulation uses the production `FateCore` engine and bundled 24-card database. Each policy covers seeds 0 through 9,999, at most 500 decisions per run. Policy randomness is separate from game randomness. Heuristics inspect current state and authored event effects, never peek at the next random draw or future cards.

| Metric | Random | Survival heuristic | Knowledge heuristic |
|---|---:|---:|---:|
| Runs | 10,000 | 10,000 | 10,000 |
| Mean observed turns | 32.7746 | 119.8541 | 210.2978 |
| Reached Neolithic | 74.02% | 0% | 78.97% |
| Reached Bronze | 47.92% | 0% | 35.26% |
| Reached 500-turn cap | 0 | 96 | 2,114 |
| Repeated-card decisions | 54.34% | 93.33% | 93.69% |
| Unique cards across all runs | 24 | 8 | 24 |
| Mean resources at decision end | 14.81 | 42.66 | 32.49 |
| Mean strongest rival power | 46.08 | 85.83 | 87.73 |
| Runs experiencing exile | 43 | 294 | 139 |

Random endings: 9,868 famine/population collapses, 132 ecological collapses. Survival endings: 9,904 population collapses and 96 unfinished runs. Knowledge endings: 3,206 population collapses, 4,680 ecological collapses and 2,114 unfinished runs. The engine currently labels every zero-population end as famine even if earlier losses came from hazards; more precise cause attribution belongs in the ending-system work.

## What the measurements support

Resource conservation materially changes observed survival compared with random play. The survival heuristic avoids investment in cultivation, so it stays in the first era; its zero progression is not proof that progression is unreachable. The knowledge heuristic reaches Neolithic more often, but prioritizes knowledge when it is not always strategically useful and reaches Bronze less often than random play. These are simple local heuristics, not optimal players.

The 500-turn cap censors living civilizations. Means are observed durations capped at 500, not estimates of their eventual lifetimes. Do not infer infinite survival from the cap or report capped runs as completed endings.

All 24 events were encountered by random/knowledge runs, but that is not proof that every branch or delayed chain was reached. No eligible-deck exhaustion occurred in these runs. All stat-bound invariants held and the runner completed without errors.

## Problems exposed and next experiments

1. Repetition dominates beyond the short initial experience. Add meaningful new crises, closure conditions and historical consequences before reducing the cooldown to manufacture variety.
2. Sustainable strategies can remain in a familiar era for long periods. Examine which resource-positive event cycles support this, and connect economic capacity to ecology and faction pressure; do not punish stagnation with unexplained random deaths.
3. Population and ecological collapse are the only real endings. Add distinct causes and recoverable crises before tuning mortality percentages.
4. Test purposeful progression, ecological stewardship and rival-management policies; current heuristics consider only immediate effects and cannot value multi-era legacies well.
5. Verify 45–90 minute pacing with real players and completed content. Turns are not elapsed playtime.

Raw reports: `simulation-random.json`, `simulation-survival.json`, `simulation-knowledge.json`. `simulation-results.json` is the earlier random-only baseline. Re-run after relevant rules/content changes; preserve baseline evidence when comparing revisions.

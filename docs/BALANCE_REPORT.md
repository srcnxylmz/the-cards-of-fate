# Measured balance baseline — 2026-11-09

## Support/pact revision — 2026-11-10

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

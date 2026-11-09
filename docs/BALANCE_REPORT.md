# Measured balance baseline — 2026-11-09

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

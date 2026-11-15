# Progression diagnostics — 2026-11-15

Same seeds 0..<10000; cap 500; production FateCore. Frozen 52/64 input decks are committed alongside reports. Their six old-policy runs reproduce previous mean turns, repeat, exile and cap metrics exactly after policy extraction and instrumentation. No thresholds, authored weights, cooldowns or RNG were changed. The 76-card group combines an alternate cultivation story, historical closure, recurring maintenance cost and twelve new events; its changes are not isolated causal experiments.

## Era reach and repetition

| Deck | Policy | Era 2 /10000 | Era 3 /10000 | Mean turns | Repeat | First 20 repeat | Caps |
|---|---|---:|---:|---:|---:|---:|---:|
| 52 | random | 5844 | 4220 | 30.96 | 33.25% | 13.56% | 0 |
| 52 | survival | 0 | 0 | 123.47 | 87.53% | 24.51% | 95 |
| 52 | knowledge | 6504 | 3852 | 144.43 | 86.43% | 13.87% | 1307 |
| 52 | progression | 9116 | 8527 | 93.85 | 73.44% | 12.43% | 3 |
| 64 | random | 5203 | 3322 | 30.48 | 27.42% | 6.59% | 0 |
| 64 | survival | 0 | 0 | 124.28 | 85.27% | 10.41% | 91 |
| 64 | knowledge | 5504 | 2959 | 135.45 | 84.51% | 7.64% | 1138 |
| 64 | progression | 8909 | 7480 | 99.77 | 71.54% | 7.30% | 4 |
| 76 | random | 6992 | 3768 | 32.12 | 19.88% | 0.52% | 0 |
| 76 | survival | 0 | 0 | 136.04 | 84.36% | 1.21% | 94 |
| 76 | knowledge | 8255 | 3937 | 58.08 | 55.97% | 1.47% | 0 |
| 76 | progression | 9879 | 7034 | 49.10 | 46.30% | 2.37% | 0 |

## Technology acquisition

Means are conditional on acquiring the technology. Resolution turns are one-based. A zero acquisition count has no mean.

| Deck | Policy | Cultivation count | Mean turn | Smelting count | Mean turn |
|---|---|---:|---:|---:|---:|
| 52 | random | 7444 | 12.33 | 5597 | 20.06 |
| 52 | survival | 0 | — | 0 | — |
| 52 | knowledge | 6535 | 8.96 | 4228 | 14.86 |
| 52 | progression | 9687 | 12.69 | 9108 | 21.07 |
| 64 | random | 6962 | 13.11 | 4761 | 20.85 |
| 64 | survival | 0 | — | 0 | — |
| 64 | knowledge | 5540 | 10.65 | 3339 | 15.87 |
| 64 | progression | 9588 | 15.15 | 8864 | 25.18 |
| 76 | random | 8603 | 12.70 | 6234 | 22.23 |
| 76 | survival | 0 | — | 0 | — |
| 76 | knowledge | 8393 | 10.01 | 5007 | 13.97 |
| 76 | progression | 9996 | 8.19 | 9741 | 18.34 |

## Successful transition state

Sampled after world/council/succession effects, immediately before the real transition. Resources are measured, not an additional gate.

| Deck | Policy | Transition | Count | Resources | Knowledge | Population | Stability |
|---|---|---|---:|---:|---:|---:|---:|
| 52 | random | 1→2 | 5844 | 8.72 | 70.30 | 49.15 | 67.86 |
| 52 | random | 2→3 | 4220 | 3.18 | 87.81 | 45.50 | 59.48 |
| 52 | survival | 1→2 | 0 | — | — | — | — |
| 52 | survival | 2→3 | 0 | — | — | — | — |
| 52 | knowledge | 1→2 | 6504 | 22.99 | 70.10 | 53.12 | 67.69 |
| 52 | knowledge | 2→3 | 3852 | 14.67 | 84.42 | 61.29 | 54.26 |
| 52 | progression | 1→2 | 9116 | 20.42 | 76.43 | 52.48 | 71.08 |
| 52 | progression | 2→3 | 8527 | 13.47 | 89.94 | 61.01 | 56.22 |
| 64 | random | 1→2 | 5203 | 8.78 | 71.24 | 48.54 | 65.81 |
| 64 | random | 2→3 | 3322 | 3.38 | 88.58 | 45.41 | 58.17 |
| 64 | survival | 1→2 | 0 | — | — | — | — |
| 64 | survival | 2→3 | 0 | — | — | — | — |
| 64 | knowledge | 1→2 | 5504 | 22.08 | 70.51 | 52.56 | 68.98 |
| 64 | knowledge | 2→3 | 2959 | 14.31 | 84.48 | 60.62 | 54.57 |
| 64 | progression | 1→2 | 8909 | 19.05 | 78.97 | 51.48 | 70.27 |
| 64 | progression | 2→3 | 7480 | 13.33 | 90.87 | 59.94 | 52.54 |
| 76 | random | 1→2 | 6992 | 10.23 | 67.95 | 48.08 | 62.40 |
| 76 | random | 2→3 | 3768 | 4.04 | 87.46 | 43.83 | 56.54 |
| 76 | survival | 1→2 | 0 | — | — | — | — |
| 76 | survival | 2→3 | 0 | — | — | — | — |
| 76 | knowledge | 1→2 | 8255 | 23.70 | 69.36 | 49.75 | 65.33 |
| 76 | knowledge | 2→3 | 3937 | 15.87 | 83.45 | 53.43 | 53.07 |
| 76 | progression | 1→2 | 9879 | 18.64 | 69.31 | 51.32 | 63.87 |
| 76 | progression | 2→3 | 7034 | 15.04 | 85.49 | 53.51 | 52.56 |

## Blocked transition observations

Counts are per decision, not per run. Conditions overlap; a single decision may be blocked by several gates. Terminal status is not reported here: the snapshot precedes terminal predicates, so its ending field is not a valid end-state measurement. Actual endings are counted in the JSON endings distribution; terminal conditions also fail population or stability gates. Era 3→4 is excluded because era 4 has no authored playable deck.

| Deck | Policy | Era | Checks | Missing technology | Low knowledge | Low population | Low stability |
|---|---|---|---:|---:|---:|---:|---:|
| 52 | random | 1 | 164262 | 145945 | 79773 | 25926 | 135 |
| 52 | random | 2 | 70998 | 48805 | 12346 | 22235 | 12044 |
| 52 | survival | 1 | 1234700 | 1234700 | 107456 | 225836 | 1 |
| 52 | survival | 2 | 0 | 0 | 0 | 0 | 0 |
| 52 | knowledge | 1 | 351254 | 339499 | 39454 | 73132 | 0 |
| 52 | knowledge | 2 | 841097 | 822969 | 12516 | 706 | 745096 |
| 52 | progression | 1 | 142654 | 124477 | 39459 | 10383 | 4 |
| 52 | progression | 2 | 139190 | 73035 | 10528 | 5810 | 63974 |
| 64 | random | 1 | 177034 | 159062 | 81261 | 31036 | 682 |
| 64 | random | 2 | 70807 | 48077 | 9666 | 23815 | 16969 |
| 64 | survival | 1 | 1242805 | 1242805 | 118305 | 220945 | 362 |
| 64 | survival | 2 | 0 | 0 | 0 | 0 | 0 |
| 64 | knowledge | 1 | 428342 | 418076 | 41818 | 93484 | 12 |
| 64 | knowledge | 2 | 745006 | 727392 | 10527 | 1154 | 665633 |
| 64 | progression | 1 | 171773 | 150962 | 42779 | 16008 | 133 |
| 64 | progression | 2 | 227843 | 87121 | 8577 | 14761 | 155244 |
| 76 | random | 1 | 160108 | 136224 | 86099 | 23759 | 2526 |
| 76 | random | 2 | 102973 | 73777 | 15904 | 35658 | 28138 |
| 76 | survival | 1 | 1360397 | 1360397 | 160253 | 711801 | 33994 |
| 76 | survival | 2 | 0 | 0 | 0 | 0 | 0 |
| 76 | knowledge | 1 | 217988 | 200049 | 47124 | 72099 | 3709 |
| 76 | knowledge | 2 | 235491 | 216337 | 18214 | 3603 | 155579 |
| 76 | progression | 1 | 90812 | 71964 | 44371 | 2482 | 681 |
| 76 | progression | 2 | 152965 | 87857 | 15579 | 18227 | 85178 |

## Eligible but unselected discovery events

Eligibility is observed at decision time, including prerequisites, two available choices, exclusions and cooldown. The selected event is included despite lastSeen already being updated by selection. Counts include repeated waiting observations. First eligibility and first selection have different conditional populations and must not be subtracted as a paired waiting-time estimate. Their turn indices are zero-based presentation turns. All-event counts are retained in JSON.

| Deck | Policy | Event | Eligible runs | Mean first eligible | Selected runs | Mean first selected | Eligible unselected observations |
|---|---|---|---:|---:|---:|---:|---:|
| 52 | random | river_tracks | 10000 | 0.00 | 9961 | 6.40 | 115795 |
| 52 | random | green_stone | 5844 | 11.07 | 4263 | 15.70 | 40980 |
| 52 | random | kiln_crack | 5844 | 11.07 | 4275 | 15.61 | 41244 |
| 52 | survival | river_tracks | 10000 | 0.00 | 10000 | 6.42 | 718714 |
| 52 | survival | green_stone | 0 | — | 0 | — | 0 |
| 52 | survival | kiln_crack | 0 | — | 0 | — | 0 |
| 52 | knowledge | river_tracks | 10000 | 0.00 | 9999 | 6.70 | 215142 |
| 52 | knowledge | green_stone | 6504 | 9.54 | 5418 | 15.60 | 442436 |
| 52 | knowledge | kiln_crack | 6504 | 9.54 | 5448 | 15.63 | 442405 |
| 52 | progression | river_tracks | 10000 | 0.00 | 10000 | 6.66 | 102244 |
| 52 | progression | green_stone | 9116 | 12.09 | 6499 | 17.26 | 62483 |
| 52 | progression | kiln_crack | 9116 | 12.09 | 6671 | 17.14 | 62186 |
| 64 | random | river_tracks | 10000 | 0.00 | 9898 | 7.62 | 131315 |
| 64 | random | green_stone | 5203 | 11.35 | 3690 | 16.32 | 40906 |
| 64 | random | kiln_crack | 5203 | 11.35 | 3740 | 16.35 | 41195 |
| 64 | survival | river_tracks | 10000 | 0.00 | 10000 | 7.72 | 736494 |
| 64 | survival | green_stone | 0 | — | 0 | — | 0 |
| 64 | survival | kiln_crack | 0 | — | 0 | — | 0 |
| 64 | knowledge | river_tracks | 10000 | 0.00 | 9999 | 8.03 | 267564 |
| 64 | knowledge | green_stone | 5504 | 11.22 | 4587 | 18.01 | 393907 |
| 64 | knowledge | kiln_crack | 5504 | 11.22 | 4708 | 17.87 | 393866 |
| 64 | progression | river_tracks | 10000 | 0.00 | 9998 | 7.99 | 125550 |
| 64 | progression | green_stone | 8909 | 14.54 | 6411 | 20.74 | 74716 |
| 64 | progression | kiln_crack | 8909 | 14.54 | 6648 | 20.62 | 74430 |
| 76 | random | river_tracks | 10000 | 0.00 | 8059 | 7.86 | 123055 |
| 76 | random | green_stone | 6992 | 11.67 | 5022 | 17.58 | 64146 |
| 76 | random | kiln_crack | 6992 | 11.67 | 4924 | 17.76 | 64748 |
| 76 | survival | river_tracks | 10000 | 0.00 | 9998 | 8.95 | 510729 |
| 76 | survival | green_stone | 0 | — | 0 | — | 0 |
| 76 | survival | kiln_crack | 0 | — | 0 | — | 0 |
| 76 | knowledge | river_tracks | 10000 | 0.00 | 7222 | 8.02 | 138623 |
| 76 | knowledge | green_stone | 8255 | 10.54 | 6639 | 18.64 | 147871 |
| 76 | knowledge | kiln_crack | 8255 | 10.54 | 6708 | 18.63 | 148387 |
| 76 | progression | river_tracks | 10000 | 0.00 | 5702 | 5.96 | 75972 |
| 76 | progression | green_stone | 9879 | 8.81 | 6692 | 15.14 | 79754 |
| 76 | progression | kiln_crack | 9879 | 8.81 | 6871 | 15.31 | 79841 |

## Opportunity cost of the twelve 64-card inheritance events

First-era events only: net immediate resource cost (positive = spent, negative = gained), excluding delayed and world effects. Each extra decision also incurs ordinary food consumption. These totals are exposed observations, not a counterfactual attribution of every failed transition.

| Policy | Event | Decisions | Net immediate resource cost |
|---|---|---:|---:|
| random | winter_mantle | 7873 | 1702 |
| random | shared_quarry | 7913 | -9364 |
| random | reed_seed_cache | 1788 | -6377 |
| random | ember_watch | 6432 | -5503 |
| survival | winter_mantle | 10000 | -30000 |
| survival | shared_quarry | 10000 | -80000 |
| survival | reed_seed_cache | 0 | 0 |
| survival | ember_watch | 10000 | -50000 |
| knowledge | winter_mantle | 6589 | 10135 |
| knowledge | shared_quarry | 6702 | 8334 |
| knowledge | reed_seed_cache | 366 | 351 |
| knowledge | ember_watch | 5435 | -27175 |
| progression | winter_mantle | 6382 | 1038 |
| progression | shared_quarry | 6500 | -13435 |
| progression | reed_seed_cache | 1136 | -8604 |
| progression | ember_watch | 4795 | -20615 |

## Interpretation and limits

52→64: discovery opportunity is diluted by additional eligible early history. Random first river presentation rises from 6.40 to 7.62; knowledge from 6.70 to 8.03. Knowledge policy also prefers immediate food after knowledge saturates: the fixed technology bonus loses to following the herd. A regression test demonstrates this at knowledge 100. Progression values a missing required technology even at the cap, rewards remaining gate deficits and discounts authored delayed effects at 0.35. It only receives available current choices, uses normalized expected outcomes and never resolves a future RNG draw. The old policies are unchanged and remain useful baselines. Survival deliberately does not invest in cultivation.

76: a distinct one-shot tended seedbed offers an alternative cultivation route with food/population costs, without relaxing era gates or forcing a draw. Historical first decisions close using existing flags; seasonal events keep a viable recurring pool. The 100-seed policy regression suite and all full final reports found no eligible-deck exhaustion. Every positive resource decision in the new set has an immediate adverse effect or a delayed cost. This does not prove absence of every optimal infinite strategy.

Progression improves era-2 access to 98.79%, but era-3 access declines from 74.80% (64 cards) to 70.34% (76 cards). Once metal is acquired, population and stability still block transitions. Random and knowledge era access improve. Repetition falls substantially for knowledge, but remains high for survival. Do not call this final balance or convert censored caps into endings. Human session timing, deliberate recovery strategies and additional recurring-crisis tests remain open.

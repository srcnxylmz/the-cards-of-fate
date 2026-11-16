# 120-card economics and crisis analysis — 2026-11-16

105 → 120 unique cards, 35 → 40 per authored era, 245 → 288 choices. Five old diagnostic policies are unchanged. Managed council is a separate sixth experiment. Each comparison uses seeds 0..<10000 and a 500-decision cap in the production Swift core. A living cap is censored, not a successful ending. The terminal playable era remains Bronze.

Frozen reference core: 3d589af. New telemetry was compiled against its archived package/core and the old 105-card content, separately from the current build; no production legacy-mode switch was added. Every old field of all five reference reports exactly matches the verified 105 report. Snapshot, old reports and enriched baselines: analysis/milestone120-105-before. Reproduce the tables with node tools/report-milestone120.mjs; structured data: [milestone120-metrics.json](milestone120-metrics.json).

## Economy correction and actual costs

Previously a zero final reserve caused the full eight-point population penalty, even when that turn's production and last reserve share had covered demand. World production itself is unchanged: cultivation/storage, environment-dependent irrigation and existing calendar/terrace investment, capped at ordinary four-share demand. Hard demand remains six. Starvation now follows unmet food and scales with its fraction, rounded up, retaining the full eight-point penalty for a complete shortage. Tests exercise zero reserve with covered demand, using the final reserve share, one-share deficit, full shortage, hard demand and the unchanged ecology 49/50 irrigation boundary. This is a rule correction with balance consequences, not a claim that all economic tuning is finished.

An empty-reserve maintenance decision must not become free healing. Resource outlays that cannot be paid from stored reserves are accumulated within the decision, including due consequences, and taken from that turn's subsequent income/food. They do not disappear just because a negative stat was clamped. New paid work has actual capital/workforce/ecology conditions and delayed returns. A bread bond remains open across other choices and save/reload; a second loan is blocked until an actual ten-share payment. Default is a permanent record and ends future access. There is no general interest-rate/currency/debt-ledger system; old non-loan shortfalls beyond that turn's available supplies are not carried as arbitrary perpetual debt.

## Five unchanged policies

| Policy | Neolithic reach | Bronze reach | Mean turns | Whole-run repeat % | Living caps |
|---|---:|---:|---:|---:|---:|
| random | 5947 → 6235 | 4866 → 5308 | 50.88 → 99.83 | 36.15 → 62.25 | 0 → 445 |
| survival | 0 → 0 | 0 → 0 | 122.31 → 172.01 | 76.36 → 80.72 | 82 → 456 |
| knowledge | 7719 → 8167 | 6380 → 6738 | 122.95 → 294.06 | 71.86 → 86.12 | 734 → 3671 |
| progression | 9879 → 9939 | 9643 → 9697 | 97.22 → 340.07 | 62.98 → 88.00 | 98 → 4029 |
| recovery | 9861 → 9920 | 9763 → 9766 | 159.75 → 450.22 | 78.94 → 91.62 | 1251 → 8324 |

| Policy | Living caps in era 1 | Era 2 | Era 3 |
|---|---:|---:|---:|
| random | 0 → 0 | 0 → 0 | 0 → 445 |
| survival | 82 → 456 | 0 → 0 | 0 → 0 |
| knowledge | 8 → 2 | 448 → 595 | 278 → 3074 |
| progression | 0 → 0 | 0 → 0 | 98 → 4029 |
| recovery | 0 → 0 | 0 → 0 | 1251 → 8324 |

Longer lives can raise whole-run repetition and cap counts. Neither shortening runs nor lowering censoring is treated as balance success. Endings, ecology/workforce/political exposure and capped-tail ranges remain in the structured report.

## Bronze food and recovery

| Policy | Empty world turns % | Starvation population /100 decisions | Hunger episodes recovered / started | Mean hunger recovery turns, recovered only | Ended unrecovered | Censored hungry |
|---|---:|---:|---:|---:|---:|---:|
| random | 18.03 → 7.95 | 138.61 → 50.25 | 17367/21407 → 20782/24479 | 1.76 → 1.89 | 4040 → 3674 | 0 → 23 |
| survival | — → — | 0.00 → 0.00 | 0/0 → 0/0 | — → — | 0 → 0 | 0 → 0 |
| knowledge | 2.25 → 0.53 | 16.25 → 2.97 | 4917/7411 → 5096/6705 | 1.38 → 1.33 | 2493 → 1600 | 1 → 9 |
| progression | 5.68 → 1.03 | 41.80 → 6.31 | 14343/22456 → 12053/16943 | 1.55 → 1.51 | 8113 → 4868 | 0 → 22 |
| recovery | 3.32 → 0.40 | 25.19 → 2.41 | 24188/29657 → 8639/9425 | 1.51 → 1.47 | 5465 → 771 | 4 → 15 |

| Policy | Reserve episodes recovered / started | Mean reserve recovery turns, recovered only | Ended without live reserve recovery | Censored |
|---|---:|---:|---:|---:|
| random | 17367/21482 → 21745/25513 | 1.76 → 1.96 | 4115 → 3744 | 0 → 24 |
| survival | 0/0 → 0/0 | — → — | 0 → 0 | 0 → 0 |
| knowledge | 4917/7579 → 5764/7479 | 1.38 → 1.36 | 2661 → 1705 | 1 → 10 |
| progression | 14343/22708 → 13185/18201 | 1.55 → 1.54 | 8365 → 4993 | 0 → 23 |
| recovery | 24188/29852 → 9438/10270 | 1.51 → 1.51 | 5660 → 813 | 4 → 19 |

A starvation observation is actual population loss during the world-food stage; a state already at population zero cannot lose additional population. Empty reserves are tracked separately and need not mean unmet food. Reserve episodes end only with a positive world reserve after a completed living decision; hunger episodes end only after a completed living decision without world starvation. Card deaths and late council endings cannot count as recovery. Means exclude unrecovered episodes, whose counts are retained. Absolute counts depend on exposure; use normalized losses and the changing era cohorts.

## Bronze windows, from entry into the era

For each horizon, the following repeat rate and mean card/choice counts use only runs reaching the whole window. The accompanying counts expose survivorship. Structured prefix rates also include truncated runs.

| Policy / window | Complete runs | Repeat % | Mean distinct cards | Mean distinct card+choice pairs |
|---|---:|---:|---:|---:|
| random / 20 | 3989 → 4857 | 11.07 → 2.07 | 17.79 → 19.59 | 18.92 → 19.81 |
| random / 40 | 2226 → 3944 | 51.67 → 44.53 | 19.33 → 22.19 | 26.34 → 29.74 |
| random / 80 | 628 → 2412 | 74.42 → 71.07 | 20.46 → 23.15 | 30.35 → 36.17 |
| survival / 20 | 0 → 0 | — → — | — → — | — → — |
| survival / 40 | 0 → 0 | — → — | — → — | — → — |
| survival / 80 | 0 → 0 | — → — | — → — | — → — |
| knowledge / 20 | 6318 → 6699 | 13.99 → 4.28 | 17.20 → 19.14 | 18.09 → 19.42 |
| knowledge / 40 | 5846 → 6660 | 54.96 → 48.20 | 18.02 → 20.72 | 22.92 → 25.62 |
| knowledge / 80 | 2000 → 6339 | 75.68 → 73.71 | 19.46 → 21.03 | 26.57 → 28.85 |
| progression / 20 | 9612 → 9679 | 14.07 → 4.35 | 17.19 → 19.13 | 18.26 → 19.45 |
| progression / 40 | 9142 → 9664 | 55.21 → 48.76 | 17.91 → 20.49 | 23.54 → 26.22 |
| progression / 80 | 2867 → 9286 | 76.37 → 73.99 | 18.90 → 20.81 | 26.61 → 29.56 |
| recovery / 20 | 9620 → 9718 | 13.59 → 2.26 | 17.28 → 19.55 | 18.42 → 19.73 |
| recovery / 40 | 8881 → 9676 | 56.02 → 48.26 | 17.59 → 20.69 | 23.08 → 26.27 |
| recovery / 80 | 5173 → 9511 | 77.39 → 74.06 | 18.09 → 20.75 | 25.49 → 29.80 |

| Policy, after 100 Bronze decisions | Runs | Repeat % | Mean distinct cards | Mean distinct decisions |
|---|---:|---:|---:|---:|
| random | 341 → 2030 | 99.97 → 99.95 | 7.44 → 10.72 | 13.37 → 22.32 |
| survival | 0 → 0 | — → — | — → — | — → — |
| knowledge | 1140 → 5992 | 99.88 → 99.82 | 7.56 → 11.45 | 11.94 → 20.41 |
| progression | 1488 → 8867 | 99.93 → 99.82 | 7.34 → 11.33 | 12.09 → 21.50 |
| recovery | 3940 → 9403 | 99.99 → 99.99 | 8.24 → 10.71 | 14.84 → 21.87 |

The last table has varying late exposure and different survivor cohorts. It describes observed repertoire, not a causal pacing estimate. One-shot conclusions remain closed; recurring work changes with population, ecology, open bond state and actual earlier practices. Five context partitions have exactly one active outcome across their stat/flag boundaries; they do not invent random risk. True stochastic choices remain separately counted. Natural outcome frequencies are in resolvedOutcomeCounts.

## Closed chains, natural ordered histories

Completion definitions and TR/EN editorial self-review: [STORY_REVIEW_120.md](STORY_REVIEW_120.md). Tests execute both opposed branches, delayed era gates, selector, saves and closure; the counts below additionally require the ordered real decisions in unassisted seeded runs, not merely a final flag.

| Policy | Shared repair | Private repair | Preserved water | Built bank |
|---|---:|---:|---:|---:|
| random | 29 | 381 | 12 | 24 |
| survival | 0 | 0 | 0 | 0 |
| knowledge | 8 | 266 | 34 | 19 |
| progression | 54 | 865 | 1 | 5 |
| recovery | 42 | 1195 | 0 | 1 |

## Natural state-dependent outcomes

Each pair below is observed through the actual resolved outcome, after real availability/context gates. A zero in one policy is retained; it is not replaced with a fabricated reachable fixture.

| Policy / decision | Observed outcome counts |
|---|---|
| random / well_roster.shifts | sound: 1742, worn: 633 |
| random / quay_exchange.contract | crewed: 22157, thin: 3500 |
| random / bread_bond.borrow | bounded: 907, private: 4914 |
| random / cistern_account.current | sound: 29, worn: 24 |
| random / mine_shoring.shore | crewed: 13928, thin: 2537 |
| survival / well_roster.shifts |  |
| survival / quay_exchange.contract |  |
| survival / bread_bond.borrow |  |
| survival / cistern_account.current |  |
| survival / mine_shoring.shore |  |
| knowledge / well_roster.shifts | sound: 29, worn: 22172 |
| knowledge / quay_exchange.contract | crewed: 164692, thin: 239 |
| knowledge / bread_bond.borrow | bounded: 135, private: 7905 |
| knowledge / cistern_account.current | worn: 70 |
| knowledge / mine_shoring.shore | crewed: 81352, thin: 13 |
| progression / well_roster.shifts | sound: 25, worn: 839 |
| progression / quay_exchange.contract | crewed: 233858, thin: 70 |
| progression / bread_bond.borrow | bounded: 657, private: 11004 |
| progression / cistern_account.current | worn: 9 |
| progression / mine_shoring.shore | crewed: 126163 |
| recovery / well_roster.shifts | sound: 514, worn: 47 |
| recovery / quay_exchange.contract | crewed: 419773, thin: 896 |
| recovery / bread_bond.borrow | bounded: 273, private: 9124 |
| recovery / cistern_account.current | sound: 3 |
| recovery / mine_shoring.shore | crewed: 149317 |

## Ecology, workforce and faction exposure

| Policy | Mean Bronze environment | Mean Bronze population | Hostile-power exposure % | Low-workforce exposure % |
|---|---:|---:|---:|---:|
| random | 57.17 → 51.21 | 37.83 → 54.02 | 16.54 → 42.32 | 30.74 → 14.78 |
| survival | — → — | — → — | — → — | — → — |
| knowledge | 18.72 → 19.00 | 38.46 → 57.02 | 51.36 → 87.43 | 19.35 → 4.02 |
| progression | 19.87 → 20.72 | 39.45 → 56.65 | 50.11 → 87.87 | 18.05 → 3.67 |
| recovery | 70.31 → 86.71 | 48.78 → 80.92 | 60.93 → 47.78 | 11.51 → 1.11 |

The faction exposure proxy is relation <20 with power >60, not an actual council challenge count or causal loss attribution. Low workforce means population <25. Mean ecology and late cohorts must be reported even if food outcomes improve. Shared food production still uses the pre-existing environment-dependent irrigation and calendar/terrace conditions; no new world farm-output bonus was introduced.

## Separate managed council

Same seeds, survival choice policy plus the existing optional council manager. Mean turns 60.39 → 75.38, repeat % 54.14 → 58.01, living caps 1 → 10. This is not folded into the five-policy baseline. The user's local root council JSON remains untouched; the actual new report is analysis/milestone120-final/simulation-survival-council.json and CI regenerates its own report.

## Content and presentation scope

Fifteen distinct events are in tools/content/city-events.mjs. All 105 older authored definitions are deep-compared against their frozen JSON; IDs and old choices/effects are preserved. New optional condition/outcome/effect fields decode older content and scheduled save effects. Population constrains actual work-card results; world food production is not claimed to continuously scale with the population rating. Ninety static cross-era references are not ninety approved complete chains.

Five new actual portrait candidates (marsh_raft, well_roster, quay_exchange, bread_bond, mine_shoring) join the preserved ten; 105 illustrations remain missing. The mine candidate was edited to replace modern-looking picks/tall stacks; exact generation/edit prompts, reference hashes and final file hashes are recorded. Three existing prototype WAVs and their API-start/mute test are retained; no new music or listening approval is claimed.

Native acceptance passed at source 0592d02 / full run 43766155674. All six native 10,000-seed reports match local final JSONs in every field. Build/install/launch, 83 Swift, 48 Node and six UI tests passed; actual image/audio/OCR artifacts were inspected. See [NATIVE_120_EVIDENCE.md](NATIVE_120_EVIDENCE.md). This acceptance note follows the generated measurements; retain the separate evidence ledger when regenerating. Physical device, actual OS accessibility, audio mix, historical/legal approval, signing and Game Center version/account work remain open. Fourth-era requirements are documented in [ERA4_READINESS.md](ERA4_READINESS.md); no Era 4 content or transition gate was opened.


## Findings, regressions and next group

All five mean lifetimes rise; no lower repeat rate is bought with shorter runs. Progression Bronze starvation loss falls 41.80 → 6.31 population per 100 exposed decisions; recovery 25.19 → 2.41. Mean progression/recovery lifetimes rise 97.22 → 340.07 and 159.75 → 450.22. These are coupled food-rule and content changes, not isolated causal estimates or human-playtime measurements.

Complete Bronze-window repeat rates improve across the observed 20/40/80 horizons, while different numbers of runs survive each horizon. Progression first-20 repeat falls 14.07% → 4.35%; after 100 Bronze decisions its mean observed card/decision repertoire grows (see tables). Whole-run repetition rises in every policy and long terminal-era loops remain. Living recovery caps 1,251 → 8,324 are censored observations, not 8,324 wins or a reason to force deaths.

Negative/tradeoff observations remain: random mean Bronze ecology falls 57.17 → 51.21; its recovered-only hunger duration rises 1.76 → 1.89 turns and live reserve recovery 1.76 → 1.96. Knowledge Neolithic living caps increase 448 → 595, even though Bronze access improves; the unchanged knowledge heuristic can still postpone a technology investment. Survival remains in Paleolithic in both cohorts. Different exposure/survivor mixes prevent interpreting these means as isolated treatment effects. The two chain endings are naturally observed across seeded random runs; a zero for one fixed policy is not replaced with a fixture count.

The observer's provisional recovery classification was audited before CI. A card death or a later council ending can no longer count as recovery merely because world population cannot fall further. Five tests exercise the actual FateDiagnostics module, live/censored/ended outcomes and Bronze residence counters. All twelve replay cohorts preserve every non-diagnostic result from before this measurement-only correction. The rejected gift-cost and implicit-history drafts are retained as partial, explicitly non-final studies; no native CI was spent on them.

Next 120 → 135: deepen seasonal city trade/workforce states and Neolithic technology opportunity costs; examine low-ecology random survival and longer reserve recovery without punishing healthy censored cities. Add five per era only after defining distinct conflicts and explicit earlier-decision dependencies; retain the two closed chains and introduce an editorial acceptance ledger for further chains. Continue the art backlog and the unchanged audio/OCR/device checks. Keep Era 4 closed until ERA4_READINESS dependencies and a substantial verified content inventory are met.

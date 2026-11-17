# Controlled 135-card balance repair before the 150 milestone

No new events were added in this checkpoint. Five scores, 500 cap, era thresholds, RNG, food rules and save schema are unchanged. Only four measured events change; the native135 evidence at80a7bf5 is preserved as history. Final150 expansion must be compared separately.

## Isolated screening

The27 comparisons in balance150-screening.json use exactly0..<1000 seeds and the same compiled production core with --cards overrides. Reproduce decks/analysis with tools/study-balance150.mjs. These are exploratory, not the full gate. Removing a card also changes opportunity costs/RNG selection paths, so effects are not additive. Survival120 and no-new-Paleolithic135 match every field except total content count, proving later-era cards cannot explain its decline.

| 1000-seed intervention | Mean decisions | Random Bronze starvation /100 |
|---|---:|---:|
| base120/survival | 174.06 | — |
| base120/random | 106.79 | 46.59 |
| base135/survival | 112.80 | — |
| base135/random | 82.84 | 63.51 |
| base135/knowledge | 235.54 | 4.92 |
| base135/progression | 272.34 | 9.07 |
| base135/recovery | 393.91 | 5.76 |
| without-coppice_boundary/survival | 143.91 | — |
| without-spring_pool/survival | 137.47 | — |
| without-tide_camp/survival | 100.87 | — |
| noBronze/random | 94.86 | 53.54 |
| noNeo/random | 91.85 | 54.90 |
| candidate-closure/survival | 183.39 | — |
| candidate-closure/random | 82.73 | 63.57 |
| candidate-production/random | 102.74 | 45.00 |
| candidate-production/knowledge | 306.01 | 2.23 |
| candidate-production/progression | 373.80 | 4.31 |
| candidate-production/recovery | 462.58 | 1.61 |
| candidate-combined/survival | 183.39 | — |
| candidate-combined/random | 102.67 | 44.92 |
| candidate-combined/knowledge | 315.27 | 2.26 |
| candidate-combined/progression | 374.21 | 4.34 |
| candidate-combined/recovery | 462.58 | 1.61 |

## Measured causes and narrow corrections

1. Survival deaths are predominantly the existing ecology+low-stability terminal condition, not simply food. In the1000-seed control:894 ecological deaths at135 versus864 at120. New coppice cuts contribute26,790 actual ecology loss; spring staying contributes10,885. Repeated founding disputes displace other decisions. Their first boundary/watch decisions now close via actual completed history, including existing v1 saves. Seasonal tide gathering remains recurring: removing it made survival worse100.87 versus112.80. No death threshold or score was changed.
2. Slag lining cost7 now plus3 later; fuel rotation cost8 versus5 later returned. These recurring repairs reopen production but originally had no net production delivery, suppressing the deck’s income density. Without new Bronze events random mean rises82.84→94.86 and starvation falls63.51→53.54 per100 exposed decisions. Removing new Neolithic or Paleolithic groups gives different partial improvements; the whole intervention is not just one bad event.
3. Paid containment/rotation now delivers a modest commissioned output after five decisions, net of upkeep. Full crews(population≥25) return9/7/10/8 shares for lining/runoff/rotation/inherited rotation; depleted crews return4/2/5/4. Upfront costs7/5/8/5 and existing capital/ecology gates remain. Thin-crew returns are below cost; no population healing was added and zero reserves cannot finance the work. Earlier protected runoff/coppice knowledge retains its lower-work-cost advantage. Delivery is a committed initial-crew contract, not future-RNG knowledge.
4. A generic hunger ending can follow direct card losses or due consequences. Added passive actual population-loss and final-zero-stage observations, tested for delayed revival followed by world death. Existing scheduled v1 debits are loaded unchanged; only newly chosen work schedules use the new returns.

## Full same-seed comparison

Each row is120 →135 →repaired135,10000 seeds per policy. The first two are verified archived cohorts under identical core rules; final cohorts run that same core with the repaired JSON. Managed council remains separate.

| Policy | Mean decisions | Neolithic / Bronze reached | Bronze starvation population /100 | Whole-run repeat % | Living caps |
|---|---|---|---|---|---|
| random | 99.83 → 82.01 → 98.67 | 6235/5308 → 6057/5210 → 6063/5222 | 50.25 → 63.95 → 46.64 | 62.25 → 52.35 → 60.33 | 445 → 168 → 420 |
| survival | 172.01 → 115.05 → 190.32 | 0/0 → 0/0 → 0/0 | — → — → — | 80.72 → 67.11 → 80.01 | 456 → 20 → 898 |
| knowledge | 294.06 → 230.62 → 309.57 | 8167/6738 → 8019/6840 → 8301/7072 | 2.97 → 4.87 → 2.28 | 86.12 → 81.25 → 85.62 | 3671 → 2301 → 4166 |
| progression | 340.07 → 270.16 → 378.19 | 9939/9697 → 9925/9618 → 9942/9632 | 6.31 → 9.51 → 4.37 | 88.00 → 83.86 → 88.48 | 4029 → 2653 → 5228 |
| recovery | 450.22 → 389.57 → 464.68 | 9920/9766 → 9920/9782 → 9919/9784 | 2.41 → 6.04 → 1.63 | 91.62 → 89.70 → 91.39 | 8324 → 6009 → 8984 |
| survival-council | 75.38 → 63.42 → 76.50 | 0/0 → 0/0 → 0/0 | — → — → — | 58.01 → 42.89 → 52.54 | 10 → 1 → 28 |

Caps are live censored observations, not victories. Longer lives can raise global repeats; no shorter-run repetition success is claimed. Random’s repaired mean must be compared honestly with99.8261 at120, even if close. Knowledge metal routes were not modified; actual reach/missing-metal observations are retained above/in JSON. Population-loss rates use era-exposed decisions and do not equate survivors across cohorts. The permanent exclusions, all workforce0..100 partitions, no-free-capital guards, v1 queued debits and replay are covered by BalanceRepairTests plus content invariance tests.

## Gate and next work

97 Windows Swift tests(87 Core,10 diagnostics) and53 Node passed. Full six-policy local gate is complete; native verification will run once at the150 content/art checkpoint, preserving the prior135 successful artifacts. A separate local balance commit is required before authoring15 new events. No150 event or image is produced by this report.

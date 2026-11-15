# 105-card quality and long-session analysis — 2026-11-15

## Cohort and limits

Seeds 0..<10000, cap 500 decisions, production Swift core. Four original policy scores and GameEngine rules are unchanged; new recovery is independent, deterministic and uses only the current state/available choices and authored outcome probabilities. Its targets are population 55, resources 40, stability/environment 55, authority 30, knowledge 60; delayed utility is discounted and future RNG is never sampled. All four instrumented 90-card reports reproduce their original era/lifetime/repeat/cap/decision/ending metrics exactly.

A living cap is censored survival, not an ending or a win. Whole-run card-ID repetition depends on duration and does not measure branch diversity. Do not present a smaller cap count or shorter lifetime as success. Full era, late-turn, stage-flow and capped-tail diagnostics: [milestone105-metrics.json](milestone105-metrics.json). Reproduce with node tools/analyze-long-runs.mjs --before docs/analysis/milestone105-90-before --after docs/analysis/milestone105-final --output docs/milestone105-metrics.json.

| Policy | Neolithic 90 → 105 | Bronze 90 → 105 | Mean turns | Whole-run repeat | Living caps |
|---|---:|---:|---:|---:|---:|
| random | 6212 → 5947 | 5024 → 4866 | 44.78 → 50.88 | 32.31% → 36.15% | 0 → 0 |
| survival | 0 → 0 | 0 → 0 | 101.59 → 122.31 | 75.28% → 76.36% | 51 → 82 |
| knowledge | 7745 → 7719 | 5849 → 6380 | 168.35 → 122.95 | 81.64% → 71.86% | 1889 → 734 |
| progression | 9872 → 9879 | 9594 → 9643 | 115.00 → 97.22 | 70.59% → 62.98% | 378 → 98 |
| recovery | 9889 → 9861 | 9778 → 9763 | 196.89 → 159.75 | 83.96% → 78.94% | 2474 → 1251 |

## What was cycling

Knowledge spent 951,853 decisions in Neolithic on the 90-card deck, with 89.86% repeated card IDs and 1,137 Neolithic living caps. At saturated knowledge its unchanged utility can favor pots/repair income over the cost of metal discovery. The new potter_lease trial offers another real smelting investment, with cheaper repair-crew/common-access routes from actual history. This is not a threshold reduction. In the final deck Neolithic exposure is 441,902 decisions, 80.10% repeats and 448 caps; Bronze exposure increases 485,795 → 514,024 decisions. Thus part of the shorter knowledge mean is less village stalling, but increased mortality is also retained in the ending distribution; no universal lifetime improvement is claimed.

Four specific histories were being treated as generic income/control seasons: council_seal (a particular seal delegation), hostage_prince (a particular hostage), salt_ship (the remaining sound sailcloth) and flint_apprentice (a particular first teaching). Old flags and saved last decisions now close them after resolution, including old saves. Their repeated decisions are zero across all five final 10,000-seed reports. Already displayed legacy cards still resolve and delayed apprenticeship still opens the old furnace option. No old choice ID/text/effect changed.

At authority zero, the repeated seal's -7 authority cost was clamped away while resources/stability/knowledge were still granted. Delegation plus salt trade could offset other upkeep without meaningfully renewing those historical conflicts. It is specifically that reusable history that was removed, not all recurring crises.

## Resource, ecology and political pressure

World food remains bounded by ordinary consumption. Cultivation or a granary supplies base production; owning both improves storage. Irrigation scales with the current environment using integer arithmetic, and calendar/terrace investments retain their existing conditions. Environmental depletion removes irrigation yield; net-zero food production cannot rebuild an empty reserve, and a zero reserve still invokes starvation. Hard-mode extra consumption is unchanged. Therefore recurring profitable work/trade decisions are needed alongside maintenance, not just more ecological repairs.

The first 105 draft closed historical income but supplied too little productive replacement: progression mean 69.07 and recovery mean 70.93, with zero living caps. Rejected; reports/deck retained under analysis/milestone105-rejected-scarce. Cargo/recasting with actual ecological input gates improved the intermediate means to 82.47/111.59 (analysis/milestone105-production-study). Paid dredging and tool repair then received delayed returns from completed shipping/orders; common molds carry a larger return only after the old shared-stock investment (final draft). These are liquidity/delay/production tradeoffs, not free awards: dredging needs 6 supplies, repair needs 4, common molds need 5, rushed recasting needs capital and living fuel, outer-bank hauling needs a workforce and remaining bank ecology. Maintenance and shipment costs remain scheduled. No world-production constant, death rule, event weight, cooldown or baseline policy was tuned to obtain a higher access number.

Net actual resource changes per exposed Bronze decision, after clamping, by stage (not independent causal estimates):

| Policy | Card 90 → 105 | Delayed 90 → 105 | World 90 → 105 | Council 90 → 105 |
|---|---:|---:|---:|---:|
| random | 1.21 → 1.64 | -0.80 → -1.04 | -0.68 → -0.76 | 0.00 → 0.00 |
| knowledge | 3.51 → 4.37 | -2.69 → -3.30 | -0.91 → -1.25 | 0.00 → 0.00 |
| progression | 3.27 → 4.12 | -2.46 → -3.03 | -1.01 → -1.36 | 0.00 → 0.00 |
| recovery | 1.76 → 2.30 | -1.41 → -1.61 | -0.38 → -0.72 | 0.00 → 0.00 |

The report also separates population/environment/stability/authority flows, succession and council pressure. Hostile faction pressure can still erode authority/stability after a card choice, so flags alone do not make a political recovery safe. Shared-stock and river/labor history change available recovery choices rather than bypassing that pressure.

## Duration-aware repetition and remaining regressions

| Policy | Neolithic repeat 90 → 105 | Bronze repeat 90 → 105 | Bronze repeat after turn 100 | Mean distinct cards in capped last 80 |
|---|---:|---:|---:|---:|
| random | 32.69% → 28.96% | 56.27% → 62.53% | 94.22% → 94.95% | — → — |
| survival | — → — | — → — | — → — | 8.76 → 10.87 |
| knowledge | 89.86% → 80.10% | 82.77% → 77.59% | 91.01% → 90.82% | 10.76 → 11.40 |
| progression | 24.59% → 18.31% | 84.73% → 77.24% | 99.55% → 98.44% | 8.93 → 8.49 |
| recovery | 8.56% → 0.80% | 92.23% → 88.08% | 99.99% → 99.97% | 9.00 → 8.71 |

Survival lives longer (101.59 → 122.31) and its capped tail sees more distinct Paleolithic cards (8.76 → 10.87), even though pooled repetition rises. Random also lives longer and repeats more; its Neolithic/Bronze access falls 62.12%/50.24% → 59.47%/48.66%. Knowledge mean falls 168.35 → 122.95, progression 115.00 → 97.22 and recovery 196.89 → 159.75. These are material regressions and are not concealed by lower pooled repetition or slightly higher progression Bronze reach.

Long Bronze tails still repeat nearly all card IDs, and capped progression/recovery card diversity is slightly lower after closing four histories. New branch-dependent costs/history improve decision content, but this does not solve long-session pacing. Next group must add recurring civic/trade problems with genuinely changing conditions and examine starvation exposure after paid maintenance, rather than merely shrinking lifetimes or manufacturing new titles. Existing 1,251 recovery caps remain living censored runs: final/population/resource/ecology ranges are retained in the JSON, not labeled successful endings. Keep the card cap and all failures visible.

## Narrative and asset evidence

105 unique events, 35/35/35, 245 choices. All fifteen new events and all 42 new choices occur naturally in the final random 10,000-seed report (including rare witness/credit/reed branches); regression fixtures additionally traverse the actual selector, delayed era gates, contrary outcomes, old saves and replay. Seven new events are one-shot histories; eight are recurring crises. 69 static cross-era links are not 100 completed editorially approved chains.

Ten actual illustration candidates, five new, 95 missing. Exact submitted prompts, edit reference hashes, current file hashes and catalog entries are audited; every missing card has its own brief/prompt and an empty production record. Native ten-art/six-test evidence and audio-start persistence are pending until the new CI gate. Physical listening, production music/ambience, OS accessibility/device performance, release signing and Game Center/account/version fairness remain open.

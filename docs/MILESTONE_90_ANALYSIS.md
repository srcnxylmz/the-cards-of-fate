# 90-card balance study — 2026-11-15

Same seeds 0..<10000, unchanged random/survival/knowledge/progression scores, 500-decision cap, real FateCore Swift engine. Original source: 56aad88. Repaired 76 uses a frozen card file with final production rules; final 90 adds fourteen authored events. These are combined interventions, not independent attribution of every change. Caps are living censored runs, never successful endings.

## Era reach, exposure and repetition

| Deck/rules | Policy | Era 2 | Era 3 | Mean turns | Repeat decisions | First 20 repeat | Caps |
|---|---|---:|---:|---:|---:|---:|---:|
| 76 original | random | 6992 | 3768 | 32.1233 | 19.88% | 0.5193% | 0 |
| 76 original | survival | 0 | 0 | 136.0397 | 84.36% | 1.2120% | 94 |
| 76 original | knowledge | 8255 | 3937 | 58.0847 | 55.97% | 1.4727% | 0 |
| 76 original | progression | 9879 | 7034 | 49.1030 | 46.30% | 2.3710% | 0 |
| 76 repaired | random | 7085 | 5705 | 44.8050 | 35.23% | 0.5795% | 0 |
| 76 repaired | survival | 0 | 0 | 151.9951 | 85.42% | 1.2150% | 14 |
| 76 repaired | knowledge | 7966 | 5505 | 164.9118 | 84.56% | 1.9434% | 1478 |
| 76 repaired | progression | 9941 | 9681 | 112.5846 | 74.46% | 2.4390% | 22 |
| 90 final | random | 6212 | 5024 | 44.7758 | 32.31% | 0.0898% | 0 |
| 90 final | survival | 0 | 0 | 101.5947 | 75.28% | 0.0030% | 51 |
| 90 final | knowledge | 7745 | 5849 | 168.3494 | 81.64% | 0.4446% | 1889 |
| 90 final | progression | 9872 | 9594 | 114.9993 | 70.59% | 0.6181% | 378 |

Repeat is measured by card ID, not changed option or story state. The shorter survival lifetime must be considered alongside its lower repeat rate. These policies do not prove human pacing or optimal survival. Longer progression play exposes the still-small recurring Bronze pool more often.

## Metal-owning civilizations that never reached Bronze

Final-state blockers overlap. Acquisition means are conditional on learning smelting; stage-loss totals cover later era-2 decisions after smelting, not the acquisition decision. World population loss here is starvation; world stability loss is starvation. Council/succession are separate observer stages.

| Group | Metal acquired | Final era-2 with metal | Low stability | Low population | Empty stores | Mean resource at acquisition | Mean population | Mean stability |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 76 original | 9741 | 2707 | 2706 | 1277 | 667 | 14.35 | 52.97 | 43.96 |
| 76 repaired | 9941 | 260 | 260 | 102 | 33 | 26.32 | 54.99 | 49.54 |
| 90 final | 9868 | 274 | 271 | 162 | 89 | 24.07 | 54.98 | 44.62 |

## Exposure-normalized post-metal starvation

| Group | Post-metal era-2 decisions | World population loss /100 decisions | World stability loss /100 decisions |
|---|---:|---:|---:|
| 76 original | 55367 | 178.68 | 85.08 |
| 76 repaired | 25466 | 35.93 | 18.14 |
| 90 final | 42451 | 41.87 | 21.19 |

## Post-metal losses by source (progression)

### 76 original

| Stat | Source | Loss total |
|---|---|---:|
| population | world.population | 98929 |
| population | delayed.population | 21622 |
| population | borrowed_ox.smaller.population | 14429 |
| population | grazing_strip.enclose.population | 4769 |
| population | ancestor_field.owners.population | 340 |
| stability | world.stability | 47104 |
| stability | delayed.stability | 25780 |
| stability | seed_lots.sow.stability | 18861 |
| stability | fallow_strips.slope.stability | 14736 |
| stability | silt_turn.advance.stability | 8218 |
| resources | world.resources | 130795 |
| resources | delayed.resources | 96494 |
| resources | silt_turn.crew.resources | 34188 |
| resources | reed_fever.drain.resources | 31345 |
| resources | reed_fever.move.resources | 20111 |

### 76 repaired

| Stat | Source | Loss total |
|---|---|---:|
| population | delayed.population | 11925 |
| population | world.population | 9149 |
| population | borrowed_ox.smaller.population | 7339 |
| population | grazing_strip.enclose.population | 2374 |
| population | ancestor_field.owners.population | 225 |
| stability | delayed.stability | 12423 |
| stability | seed_lots.sow.stability | 9562 |
| stability | silt_turn.advance.stability | 6783 |
| stability | fallow_strips.slope.stability | 6330 |
| stability | world.stability | 4620 |
| resources | delayed.resources | 55547 |
| resources | world.resources | 37158 |
| resources | silt_turn.crew.resources | 18293 |
| resources | grazing_strip.rotate.resources | 9894 |
| resources | reed_fever.maintain.resources | 8832 |

### 90 final

| Stat | Source | Loss total |
|---|---|---:|
| population | delayed.population | 19666 |
| population | world.population | 17773 |
| population | borrowed_ox.smaller.population | 9576 |
| population | grazing_strip.enclose.population | 3666 |
| population | village_workdays.levy.population | 3664 |
| stability | delayed.stability | 17601 |
| stability | seed_lots.sow.stability | 12212 |
| stability | silt_turn.advance.stability | 10521 |
| stability | fallow_strips.slope.stability | 9310 |
| stability | world.stability | 8996 |
| resources | delayed.resources | 91827 |
| resources | world.resources | 49434 |
| resources | silt_turn.crew.resources | 21864 |
| resources | ditch_seed.repair.resources | 16814 |
| resources | grazing_strip.rotate.resources | 11184 |

## Survival recurring exposure

| Deck | Card | Repeated decisions |
|---|---|---:|
| 76 original | ochre_border | 207857 |
| 76 original | leaking_skin | 207574 |
| 76 original | red_mushrooms | 207040 |
| 76 original | ice_crossing | 206765 |
| 76 original | river_tracks | 203780 |
| 76 original | calving_herd | 76891 |
| 76 original | winter_porters | 25751 |
| 76 original | hunt_challenge | 11692 |
| 76 original | empty_seat | 213 |
| 90 final | leaking_skin | 90286 |
| 90 final | ochre_border | 89925 |
| 90 final | summer_pools | 89323 |
| 90 final | ice_crossing | 89038 |
| 90 final | council_shelter | 88859 |
| 90 final | red_mushrooms | 88780 |
| 90 final | river_tracks | 88585 |
| 90 final | calving_herd | 55576 |
| 90 final | hide_rent | 50376 |
| 90 final | winter_porters | 34047 |

## Design interpretation and limits

Cultivation previously changed era eligibility but produced no food without a granary. Fields now produce the configured farm amount; shared storage preserves an additional unit. Irrigation scales with environment; village work calendars and irrigated terraces can recover further losses. Total world production cannot exceed ordinary food consumption; hard extra consumption remains. Unit tests cover households without granary, degraded land, stacked investments, hard mode and paid sanitation. There is no era-gate, event-weight, cooldown or policy-score adjustment.

Five old recurring crises derive their next available branch from the last saved decision on that card. Two options remain available, seasonal choices reopen after a different decision, and history survives v1 serialization. This improves state variation but does not magically turn a repeat into a unique card.

The first 90-card draft reached Bronze in only 6189 progression runs; calendar/early repayment alone reached 6520. These were rejected design trials. The original first-draft JSON/deck is retained separately. The provisional intermediate 76 result (7554 Bronze) precedes separating field production from storage and is not the final repaired comparison.

Future work: review survival duration and deliberate recovery play, recurring Bronze variety and environmental terminal risk; editorially approve full chains; retain save/replay and add physical-device/audio/accessibility evidence. Statistical improvement is not a release or final balance certification.

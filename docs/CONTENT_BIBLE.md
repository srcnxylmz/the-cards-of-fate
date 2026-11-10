# Content bible

Editorial principle: each card needs a specific human conflict, an observable cost, competing reasonable values, and consequences that fit the era. Neither option should simply be the same reward in different wording. Turkish is authored naturally, with a complete English counterpart for the current 48-card set.

## Current inventory

16 Paleolithic events, 16 Neolithic events, 16 Bronze events. 97 choices; 4 choices have weighted alternatives. Seven chain groups now all have multiple authored cards. These counts are **not** claims of seven finished chains. Fifteen explicit cross-era links are detected. Eight new historical follow-ups are one-shot, closed by every possible outcome.

The second authored batch is in `tools/content/legacy-events.mjs`: witness stones, guest hunting routes, a damaged waterskin, shared boundary signs, flood-marker memory, missing granary shares, an apprentice's cracked kiln, ash farming, descendants' trading rights, competing historical records, water law and harvest guarantees. New flags connect these disputes to actual earlier decisions. Source→follow-up eligibility and branch closure are covered by executed Swift tests.

Current chain intent:

| Chain | Existing behavior | Still required |
|---|---|---|
| Embers | Fire, delayed flood, forest oath, smelting, furnace ecology | More state-specific branches; industrial/planetary continuation |
| River memory | Grain observation grants cultivation | Later irrigation/water-law branches |
| Public voice | Hunter hearing and seal delegation themes | Mechanical dependency between events and later institutions |
| Hospitality | Refugees schedule Bronze caravan relief | Dedicated caravan event and rival-state payoff |
| Memory | Cave marks and public archive themes | Flag-gated text/choice variants and future record ethics |
| Stored power | Granary and ownership choice | Famine rationing, theft, civic oversight follow-ups |
| Debt | Seed bondage unlocks debt tablet emancipation dilemma | Medieval/industrial/AI inherited-obligation branches |

## Remaining era briefs

Ancient: road taxes vs provincial autonomy; citizenship vs extraction; siege water; law accessible to subjects. Medieval: feudal grain obligations, quarantine vs pilgrimage, monastery medicine, guild exclusion. Renaissance: patronage and censorship, translated science, civic debt, workshop secrecy. Exploration: navigation, diplomacy, colonial coercion and resistance, resource exchange, sovereignty. Industrial: labor injuries, public sanitation, grid investment, ecological debt, labor organization. Modern: civilian protection, public trust, strategic restraint, independent institutions. Digital: data ownership, algorithmic discrimination, networks under pressure, misinformation. AI/Space: autonomy consent, habitat life support, colony representation, machine personhood. Interstellar: time-delayed government, diverging identities, common resources across planets, continuity of consciousness.

Historical settings are alternative-history fiction. Do not conflate technological eras with moral hierarchies or portray real cultures as monolithic. Slavery, war and colonialism need human consequences without glorification. Historical and translation review remains required.

## Workflow

1. Author a distinct dilemma and two to four meaningful choices in `tools/build-content.mjs`.
2. Specify effects, state-dependent outcomes, future flags, closure/exclusion conditions, bilingual outcome narration and unique art brief.
3. Regenerate JSON and run validator/tests. Diagnose similarity warnings; never silence them just to reach a count.
4. Review reachability with real engine tests and simulations; static producer checks cannot prove complete story reachability.
5. Editorially review voice, theme, strategic difference, historical context and translations.
6. Create/import original art and licensed/original sound. Update manifest status honestly.

The initial events are authored but not independently editorially approved. No claim of hundreds of conditional variants or 800 completed events is made.

## Council narrative batch

Twelve specific conflicts in tools/content/council-events.mjs expand the pool to 48. New first-three-era public-voice branches reach an appeal against a sealed city decision. Hospitality runs from shared hunting days to planting rights and city residence. Granary oversight runs from sickness allowance to keys and wage/account reconciliation. Conditional fixture tests verify these branches, not all possible natural draws or full editorial completion of all seven chains.

Eleven new events are one-shot. Only borrowed_ox is a repeatable seasonal resource crisis with a resource gate. marrow_shares now depletes its finite stock after either decision; its initial repeatable version is archived as a failed balance experiment. Other older repeatable events still require an editorial recurrence audit. Broken Spear is now historical and one-shot, including exclusion by old saved outcome flags.

All new choices distinguish faction interests and costs. The injured tracker’s delayed recovery unlocks a third exile choice. Charcoal inspection uses normalized authority-sensitive probabilities. Existing generic decision audio and simple animation implementations are still prototypes. Twelve art briefs are saved; all twelve illustrations remain missing.

Completed-world closures: river observation, smelting discovery (both paths), writing archive, and wall construction stop recurring once their world fact is present. Deferred discovery choices remain eligible until the discovery actually occurs. Current saved cards may finish normally even if an updated exclusion would now prevent selecting them again.

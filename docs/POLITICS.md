# Council support and pact rules

Runtime parameters are in Sources/FateCore/Content/politics.json and validated at bundle load. Politics.swift owns action eligibility and power/defense calculations; GameEngine applies meetings and succession. No new RNG draws.

- Each faction's power moves one point per decision toward basePower + its era-specific economic/cultural stat / powerStatDivisor, plus hostilePowerBonus for relation <= hostileRelation. Old saves with power 100 converge gradually; they are not reset. First-three-era power bases: resources/knowledge, population/stability, resources/knowledge.
- Meetings remain every four decisions. The damage remains five. Defense is authority + ten for stability >=50 + one quarter of each friendly (relation >=35) faction's power, capped at 25 faction support. At most one opponent challenges. Stable ID breaks ties.
- If both factions are hostile (relation <=-20), they gain ten challenge strength. Winning over either faction dissolves this common opposition. There is not yet a separately simulated faction-to-faction relationship graph.
- Joint work costs eight resources, improves one relation by twenty, stops at fifty, and shares a four-decision cooldown with pact formation. It cannot advance time, score, event selection or RNG. It cannot leave the current card without an available choice. The operation uses the same save-before-publish transaction as decisions.
- A pact costs twelve resources, needs both relations >=20 and stability >=50, and expires at turn +12. Falling below either relationship threshold dissolves it. No stacking or early renewal. Before each expiry turn's meeting it is no longer active.
- An active pact gives two authority at meetings, only up to authority sixty. At succession it reduces the eight-point cost to four. The alliance deadline, relations, history and paid-action cooldown persist across generations and saves.
- Authority zero still removes leadership; authority sixty still wins it back. A pact is not immunity to card losses. Public legitimacy currently uses stability as a proxy, not a new independently modeled popularity stat.

Schema v1 adds optional PoliticalState. Old saves decode with nil; their prior history and RNG remain intact. New rule balance applies on subsequent choices; this is not cross-version replay or weekly version pinning. Persistence validates political timestamps. Unknown future schema versions remain rejected.

Simulation diagnostics observe actual authority after card, delayed effects, world/support, council and succession phases. They do not alter state. Exile trigger attribution records the final transition to zero, not a causal attribution of all earlier losses. Core tests compare observed and unobserved results.

The three original policies remain unchanged and do not invoke council actions. --manage-council is a separately labeled experiment: only at resources >=35, form an eligible pact or fund the least-friendly faction below support threshold. It is a simple heuristic, not an optimal strategy or evidence of human balance.

Open work: individualized successors, an independent legitimacy model, richer faction disagreements/support benefits, targeted era 2–3 narratives, tuning political difficulty, long-session content variety, physical device/accessibility tests, and same-week balance version pinning.

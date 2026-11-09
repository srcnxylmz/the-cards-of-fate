# Card data contract, version 1

The authoritative runtime schema is the Codable model in `Sources/FateCore/Models.swift`. `tools/validate-content.mjs` enforces the authoring contract independently before Swift decoding. Bundled JSON is generated from the curated authoring source, not from random templates.

Card fields: `id`, `era`, `category`, bilingual `title` and `description`, `artAsset`, `artDirection`, `rarity`, positive `weight`, `requirements`, `exclusionConditions`, `choices`, `worldFlags`, nullable `storyChainId`, `animationPreset`, `soundCue`, positive `cooldown`, `localizationKeys`.

Effect ownership is deliberately normalized: immediate effects belong to each choice; outcomes, their probabilities and delayed effects belong to that choice’s outcome array. There are no ambiguous duplicate card-level effects to apply twice. This is a recorded schema refinement of the master brief.

Conditions are conjunctive within requirements. Each condition can compare a stat with inclusive `minimum`/`maximum`, require a `flag`, or require `absentFlag`. Exclusion list items are disjunctive. A flag is durable world history; it is not automatically removed. One-shot branches close through exclusion conditions. Explicit flag removal is not implemented yet.

Choice: unique local ID, bilingual text/risk, conditions, immediate effect, one or more outcomes. Outcome: unique local ID, probability in (0,1], optional valid affinity stat, bilingual text, effect, delayed effects, animation preset. Authored probabilities total 1 before runtime affinity normalization.

Effect: six permitted integer stat deltas, flags, technologies, buildings, integer rival relationship change. Unknown stats and out-of-range deltas are errors. Delayed effects include positive turn delay, valid minimum era, bilingual text and effect. Duplicate IDs, empty translations, identical choice effects, contradictory bounds and required flags without an earlier producer are errors.

Save schema v1 persists RNG, chosen card, outcome acknowledgment, all simulation state, delayed queue, history and weekly identity. Future versions are explicitly rejected before state decoding. A migration dispatch point exists in `PersistenceService.load`; no older schema exists to migrate yet. Introduce tested migrations before incrementing schema version, never silently discard a save.

The current v1 `Resolution` adds optional `consequences: [LocalizedText]`. Older v1 saves without this field load as nil and still select the same next card. This additive compatibility is covered by an executed Swift regression test. It is not a general schema migration implementation.

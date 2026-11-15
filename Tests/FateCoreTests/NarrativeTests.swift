import XCTest
@testable import FateCore

final class NarrativeTests: XCTestCase {
    func testCompletedDiscoveriesAndWallsLeaveTheDeckIncludingLegacySaves() throws {
        let engine = GameEngine(content: try .bundled())
        var state = engine.start(seed: 42)
        state.technologies = ["smelting", "writing"]
        state.buildings = ["walls"]
        state.flags.insert("river_observers")
        let restored = try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(state))
        for id in ["river_tracks", "green_stone", "kiln_crack", "clay_archive", "city_walls"] {
            let card = try XCTUnwrap(engine.content.card(id))
            XCTAssertTrue(card.exclusionConditions.contains { $0.matches(restored) }, id)
        }
        // An already presented card from an old save can still finish its transaction.
        state.currentCardID = "river_tracks"
        XCTAssertNoThrow(try engine.choose("follow", in: state))
    }

    func testFactionAndLeadershipConditionsIncludingLegacyDecode() throws {
        let engine = GameEngine(content: try .bundled())
        var state = engine.start(seed: 42)
        let tracker = try XCTUnwrap(engine.content.card("injured_tracker"))
        XCTAssertTrue(tracker.requirements.allSatisfy { $0.matches(state) })
        state.rivals[0].relation = 1
        XCTAssertFalse(tracker.requirements.allSatisfy { $0.matches(state) })
        let exile = try XCTUnwrap(engine.content.card("return_from_ridge"))
        XCTAssertFalse(exile.requirements.allSatisfy { $0.matches(state) })
        state.leadership = .exile
        XCTAssertTrue(exile.requirements.allSatisfy { $0.matches(state) })
        let old = try JSONDecoder().decode(Condition.self, from: Data(#"{"stat":"resources","maximum":40}"#.utf8))
        XCTAssertNil(old.faction); XCTAssertNil(old.leadership)
        XCTAssertFalse(old.matches(state))
        state.stats["resources"] = 40
        XCTAssertTrue(old.matches(state))
    }

    func testThreeEraPublicVoiceBranchesReachAndClose() throws {
        let engine = GameEngine(content: try .bundled())
        // Explicit era fixtures prove conditional branch consistency, not natural seeded draw timing.
        for witness in ["record", "delegate"] {
            for field in ["assembly", "holders"] {
                for seal in ["appeal", "enforce"] {
                    var state = engine.start(seed: 7)
                    for (id, decision, era) in [("broken_spear", "hearing", 1), ("witness_stones", witness, 1), ("speaking_field", field, 2), ("seal_appeal", seal, 3)] {
                        state.era = era
                        state.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 75) })
                        let card = try XCTUnwrap(engine.content.card(id))
                        XCTAssertTrue(card.requirements.allSatisfy { $0.matches(state) }, id)
                        XCTAssertFalse(card.exclusionConditions.contains { $0.matches(state) }, id)
                        state.currentCardID = id
                        state = try engine.choose(decision, in: state)
                        XCTAssertTrue(card.exclusionConditions.contains { $0.matches(state) }, id)
                        state = engine.acknowledge(state)
                    }
                    XCTAssertTrue(state.flags.contains(seal == "appeal" ? "civic_appeal" : "sealed_precedence"))
                    XCTAssertEqual(state.history.compactMap(\.cardID).filter { $0 == "seal_appeal" }.count, 1)
                }
            }
        }
    }

    func testHospitalityAndGranaryBranchesUnlockTheirBronzeConsequences() throws {
        let engine = GameEngine(content: try .bundled())
        let paths: [[(String, String, Int)]] = [
            [("stranger_child", "shelter", 1), ("guest_paths", "joint", 1), ("guest_seed", "rights", 2), ("guest_gate", "residents", 3)],
            [("stranger_child", "shelter", 1), ("guest_paths", "joint", 1), ("guest_seed", "license", 2), ("guest_gate", "outside", 3)],
            [("first_granary", "shared", 2), ("missing_grain", "audit", 2), ("winter_reserve", "ledger", 2), ("store_witness", "recount", 3)],
            [("first_granary", "shared", 2), ("missing_grain", "audit", 2), ("winter_reserve", "farmers", 2), ("store_witness", "advance", 3)]
        ]
        for path in paths {
            var state = engine.start(seed: 3)
            for (id, decision, era) in path {
                state.era = era
                state.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 75) })
                let card = try XCTUnwrap(engine.content.card(id))
                XCTAssertTrue(card.requirements.allSatisfy { $0.matches(state) }, id)
                state.currentCardID = id
                state = try engine.choose(decision, in: state)
                if !card.exclusionConditions.isEmpty {
                    XCTAssertTrue(card.exclusionConditions.contains { $0.matches(state) }, id)
                }
                state = engine.acknowledge(state)
            }
        }
    }

    func testDelayedRecoveryUnlocksExileWitnessAndSavedHearingDoesNotRepeat() throws {
        let engine = GameEngine(content: try .bundled())
        var state = engine.start(seed: 13)
        state.currentCardID = "injured_tracker"
        state = try engine.choose("rest", in: state)
        let exile = try XCTUnwrap(engine.content.card("return_from_ridge"))
        let witness = try XCTUnwrap(exile.choices.first { $0.id == "witness" })
        XCTAssertFalse(witness.available(in: state))
        for _ in 0..<3 {
            state = engine.acknowledge(state)
            state.currentCardID = "river_tracks"
            state = try engine.choose("follow", in: state)
        }
        XCTAssertTrue(witness.available(in: state))
        let restored = try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(state))
        XCTAssertTrue(witness.available(in: restored))
        var returning = engine.acknowledge(restored)
        returning.leadership = .exile
        returning.stats["authority"] = 45
        returning.currentCardID = "return_from_ridge"
        XCTAssertTrue(exile.requirements.allSatisfy { $0.matches(returning) })
        let regained = try engine.choose("witness", in: returning)
        XCTAssertEqual(regained.leadership, .ruler)
        XCTAssertTrue(regained.flags.contains("earned_return"))
        XCTAssertTrue(exile.exclusionConditions.contains { $0.matches(regained) })
        let hearing = try XCTUnwrap(engine.content.card("broken_spear"))
        var legacy = engine.start(seed: 9)
        legacy.flags.insert("public_hearing") // Old save lacks the new resolved flag.
        XCTAssertTrue(hearing.exclusionConditions.contains { $0.matches(legacy) })
    }

    func testEveryNewOneShotOutcomeClosesAndPoliticalChoicesAreAuthored() throws {
        let engine = GameEngine(content: try .bundled())
        let ids = ["marrow_shares", "winter_cairn", "injured_tracker", "return_from_ridge", "speaking_field", "guest_seed", "winter_reserve", "seal_appeal", "guest_gate", "store_witness", "charcoal_embargo"]
        for id in ids {
            let card = try XCTUnwrap(engine.content.card(id))
            for choice in card.choices {
                for outcome in choice.outcomes {
                    XCTAssertTrue(outcome.effect.flags.contains("resolved_\(id)"), id)
                    XCTAssertFalse(outcome.effect.rivalRelations?.isEmpty ?? true, id)
                }
            }
        }
        var state = engine.start(seed: 5)
        let crisis = try XCTUnwrap(engine.content.card("marrow_shares"))
        XCTAssertFalse(crisis.requirements.allSatisfy { $0.matches(state) })
        state.stats["resources"] = 35
        XCTAssertTrue(crisis.requirements.allSatisfy { $0.matches(state) })
    }

    func testNewCardsDecodeAndAreReachableByFlag() throws {
        let engine = try GameEngine(content: .bundled())
        XCTAssertEqual(engine.content.cards.count,120, "All 105 previous events plus fifteen city-economy events")
        for id in ["granary_pledge", "water_apportion", "bark_shelter", "flint_apprentice"] {
            let card = try XCTUnwrap(engine.content.card(id), id)
            XCTAssertFalse(card.title.tr.isEmpty, "\(id) Turkish title missing")
            XCTAssertFalse(card.title.en.isEmpty, "\(id) English title missing")
            XCTAssertFalse(card.description.tr.isEmpty, "\(id) Turkish description missing")
            XCTAssertFalse(card.description.en.isEmpty, "\(id) English description missing")
            XCTAssertEqual(card.choices.count, 2, "\(id) must offer two strategic choices")
            XCTAssertFalse(card.artDirection.isEmpty, "\(id) needs an art direction")
        }
    }

    func testGranaryPledgeRequiresTrackerFlagAndClosesAfterChoice() throws {
        let engine = try GameEngine(content: .bundled())
        var state = engine.start(seed: 41)
        state.era = 2
        state.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 75) })
        let card = try XCTUnwrap(engine.content.card("granary_pledge"))
        XCTAssertFalse(card.requirements.allSatisfy { $0.matches(state) })
        state.flags.insert("walking_share_rule")
        XCTAssertTrue(card.requirements.allSatisfy { $0.matches(state) })
        XCTAssertFalse(card.exclusionConditions.contains { $0.matches(state) })

        let before = state.stats
        state.currentCardID = "granary_pledge"
        state = try engine.choose("pledge", in: state)
        XCTAssertTrue(card.exclusionConditions.contains { $0.matches(state) }, "one-shot must close")
        XCTAssertTrue(state.flags.contains("grain_credit"))
        XCTAssertTrue(state.stats["population", default: 0] > before["population", default: 0])
        XCTAssertTrue(state.stats["stability", default: 0] > before["stability", default: 0])
        XCTAssertTrue(state.stats["resources", default: 0] < before["resources", default: 0])

        let restored = try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(state))
        XCTAssertTrue(card.exclusionConditions.contains { $0.matches(restored) })
    }

    func testGranaryPledgeReserveBranch() throws {
        let engine = try GameEngine(content: .bundled())
        var state = engine.start(seed: 41)
        state.era = 2
        state.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 75) })
        state.flags.insert("walking_share_rule")
        let card = try XCTUnwrap(engine.content.card("granary_pledge"))
        let before = state.stats
        state.currentCardID = "granary_pledge"
        state = try engine.choose("reserve", in: state)
        XCTAssertTrue(card.exclusionConditions.contains { $0.matches(state) })
        XCTAssertTrue(state.flags.contains("granary_closure"))
        XCTAssertTrue(state.stats["authority", default: 0] > before["authority", default: 0])
        XCTAssertTrue(state.stats["resources", default: 0] > before["resources", default: 0])
        XCTAssertTrue(state.stats["stability", default: 0] < before["stability", default: 0])
    }

    func testWaterApportionRequiresWaterCourtLawAndClosesAfterChoice() throws {
        let engine = try GameEngine(content: .bundled())
        var state = engine.start(seed: 43)
        state.era = 3
        state.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 75) })
        let card = try XCTUnwrap(engine.content.card("water_apportion"))
        XCTAssertFalse(card.requirements.allSatisfy { $0.matches(state) })
        state.flags.insert("water_court_law")
        XCTAssertTrue(card.requirements.allSatisfy { $0.matches(state) })
        XCTAssertFalse(card.exclusionConditions.contains { $0.matches(state) })

        let before = state.stats
        state.currentCardID = "water_apportion"
        state = try engine.choose("revise", in: state)
        XCTAssertTrue(card.exclusionConditions.contains { $0.matches(state) }, "one-shot must close")
        XCTAssertTrue(state.flags.contains("workshop_quota"))
        XCTAssertTrue(state.stats["resources", default: 0] > before["resources", default: 0])
        XCTAssertTrue(state.stats["authority", default: 0] > before["authority", default: 0])
        XCTAssertTrue(state.stats["environment", default: 0] < before["environment", default: 0])

        let restored = try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(state))
        XCTAssertTrue(card.exclusionConditions.contains { $0.matches(restored) })
    }

    func testWaterApportionHoldBranch() throws {
        let engine = try GameEngine(content: .bundled())
        var state = engine.start(seed: 43)
        state.era = 3
        state.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 75) })
        state.flags.insert("water_court_law")
        let card = try XCTUnwrap(engine.content.card("water_apportion"))
        let before = state.stats
        state.currentCardID = "water_apportion"
        state = try engine.choose("hold", in: state)
        XCTAssertTrue(card.exclusionConditions.contains { $0.matches(state) })
        XCTAssertTrue(state.flags.contains("water_law_held"))
        XCTAssertTrue(state.stats["stability", default: 0] > before["stability", default: 0])
        XCTAssertTrue(state.stats["resources", default: 0] < before["resources", default: 0])
        XCTAssertTrue(state.stats["authority", default: 0] < before["authority", default: 0])
    }

    func testNewEventsSaveCompatibilityAndDeterminism() throws {
        let engine = try GameEngine(content: .bundled())
        var stateA = engine.start(seed: 7)
        stateA.era = 2
        stateA.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 75) })
        stateA.flags.insert("walking_share_rule")
        stateA.currentCardID = "granary_pledge"
        stateA = try engine.choose("pledge", in: stateA)

        let encoded = try JSONEncoder().encode(stateA)
        let restored = try JSONDecoder().decode(GameState.self, from: encoded)
        XCTAssertEqual(restored.flags, stateA.flags)
        XCTAssertEqual(restored.stats, stateA.stats)
        XCTAssertEqual(restored.currentCardID, stateA.currentCardID)

        var stateB = engine.start(seed: 7)
        stateB.era = 2
        stateB.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 75) })
        stateB.flags.insert("walking_share_rule")
        stateB.currentCardID = "granary_pledge"
        stateB = try engine.choose("pledge", in: stateB)
        XCTAssertEqual(stateB, stateA, "same seed and choices must be deterministic")
    }

    func testGranaryPledgeReachabilityThroughLegitimateDecisions() throws {
        let engine = try GameEngine(content: .bundled())
        // Era-1 injured_tracker is available at start (hunters relation 0 <= 0).
        var state = engine.start(seed: 11)
        state.era = 1
        state.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 75) })
        let tracker = try XCTUnwrap(engine.content.card("injured_tracker"))
        XCTAssertTrue(tracker.requirements.allSatisfy { $0.matches(state) })

        // Choose "walk" to set walking_share_rule.
        state.currentCardID = "injured_tracker"
        state = try engine.choose("walk", in: state)
        state = engine.acknowledge(state)
        XCTAssertTrue(state.flags.contains("walking_share_rule"))

        // Era-2 granary_pledge must now be eligible.
        state.era = 2
        let granary = try XCTUnwrap(engine.content.card("granary_pledge"))
        XCTAssertTrue(granary.requirements.allSatisfy { $0.matches(state) })
        XCTAssertFalse(granary.exclusionConditions.contains { $0.matches(state) })

        // Choosing either branch closes the one-shot card.
        state.currentCardID = "granary_pledge"
        state = try engine.choose("pledge", in: state)
        XCTAssertTrue(granary.exclusionConditions.contains { $0.matches(state) })
    }

    func testWaterApportionReachabilityThroughLegitimateDecisions() throws {
        let engine = try GameEngine(content: .bundled())
        // Era-2 canal_boundary has no requirements and sets water_compact.
        var state = engine.start(seed: 13)
        state.era = 2
        state.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 75) })
        let canal = try XCTUnwrap(engine.content.card("canal_boundary"))
        XCTAssertTrue(canal.requirements.allSatisfy { $0.matches(state) })
        state.currentCardID = "canal_boundary"
        state = try engine.choose("ration", in: state)
        state = engine.acknowledge(state)
        XCTAssertTrue(state.flags.contains("water_compact"))

        // Era-3 water_court requires water_compact.
        state.era = 3
        let court = try XCTUnwrap(engine.content.card("water_court"))
        XCTAssertTrue(court.requirements.allSatisfy { $0.matches(state) })
        state.currentCardID = "water_court"
        state = try engine.choose("revise", in: state)
        state = engine.acknowledge(state)
        XCTAssertTrue(state.flags.contains("water_court_law"))

        // Era-3 water_apportion must now be eligible.
        let apportion = try XCTUnwrap(engine.content.card("water_apportion"))
        XCTAssertTrue(apportion.requirements.allSatisfy { $0.matches(state) })
        XCTAssertFalse(apportion.exclusionConditions.contains { $0.matches(state) })

        state.currentCardID = "water_apportion"
        state = try engine.choose("hold", in: state)
        XCTAssertTrue(apportion.exclusionConditions.contains { $0.matches(state) })
    }
}

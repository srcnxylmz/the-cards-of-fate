import XCTest
@testable import FateCore

final class InheritanceTests: XCTestCase {
    private let ids = ["winter_mantle", "shared_quarry", "reed_seed_cache", "ember_watch", "mandate_knots", "quarry_dues", "seed_witness", "kiln_shelter", "succession_tablet", "quarry_arbitration", "famine_receipts", "roof_beams"]
    private func engine() throws -> GameEngine { GameEngine(content: try .bundled()) }

    /// Controlled era fixtures isolate story gates. Selection itself uses production acknowledge().
    private func draw(_ id: String, from original: GameState, engine: GameEngine) throws -> GameState {
        var state = original
        let card = try XCTUnwrap(engine.content.card(id))
        state.era = card.era
        state.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 70) })
        state.discovered = Set(engine.content.cards.map(\.id).filter { $0 != id })
        XCTAssertNotNil(state.resolution, "Draw follows a real decision")
        XCTAssertTrue(card.requirements.allSatisfy { $0.matches(state) }, id)
        XCTAssertFalse(card.exclusionConditions.contains { $0.matches(state) }, id)
        state = engine.acknowledge(state)
        XCTAssertEqual(state.currentCardID, id, "Production selection must draw newly unlocked history")
        return state
    }

    private func begin(_ id: String, engine: GameEngine) throws -> GameState {
        var state = engine.start(seed: 71)
        let card = try XCTUnwrap(engine.content.card(id))
        state.era = card.era
        state.currentCardID = id
        XCTAssertTrue(card.requirements.allSatisfy { $0.matches(state) })
        return state
    }

    private func waitFor(_ flag: String, in original: GameState, engine: GameEngine) throws -> GameState {
        var state = original
        for _ in 0..<10 {
            if state.flags.contains(flag) { return state }
            state = engine.acknowledge(state)
            state.currentCardID = "ochre_border" // recurring maintenance decision, no progression technology
            state.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 70) })
            state = try engine.choose("symbols", in: state)
        }
        XCTFail("Delayed history never fired: \(flag)")
        return state
    }

    func testMantleBranchesSelectDistinctOptionsAndCloseAcrossThreeEras() throws {
        let engine = try engine()
        for first in ["entrust", "rotate"] {
            let source = try engine.choose(first, in: begin("winter_mantle", engine: engine))
            let village = try draw("mandate_knots", from: source, engine: engine)
            let recall = try XCTUnwrap(engine.content.card("mandate_knots")?.choices.first { $0.id == "recall" })
            XCTAssertEqual(recall.available(in: village), first == "rotate")
            for choice in engine.content.card("mandate_knots")!.choices.filter({ $0.available(in: village) }) {
                let resolved = try engine.choose(choice.id, in: village)
                XCTAssertFalse(resolved.flags.contains("mandate_handover"))
                let passed = try waitFor("mandate_handover", in: resolved, engine: engine)
                let city = try draw("succession_tablet", from: passed, engine: engine)
                let cityRecall = try XCTUnwrap(engine.content.card("succession_tablet")?.choices.first { $0.id == "recall" })
                XCTAssertEqual(cityRecall.available(in: city), choice.id == "recall")
                for end in engine.content.card("succession_tablet")!.choices.filter({ $0.available(in: city) }) {
                    let final = try engine.choose(end.id, in: city)
                    XCTAssertTrue(final.flags.contains("resolved_succession_tablet"))
                    XCTAssertEqual(final.flags.contains("recallable_seal"), end.id == "recall")
                    XCTAssertEqual(final.history.compactMap(\.cardID).filter { $0 == "succession_tablet" }.count, 1)
                }
            }
        }
    }

    func testQuarryDelayedRoadAndOptionalCovenantAreReachable() throws {
        let engine = try engine()
        for first in ["commons", "claim"] {
            var source = try engine.choose(first, in: begin("shared_quarry", engine: engine))
            let road = try XCTUnwrap(engine.content.card("quarry_dues"))
            XCTAssertFalse(road.requirements.allSatisfy { $0.matches(source) })
            source = try waitFor("quarry_working", in: source, engine: engine)
            let village = try draw("quarry_dues", from: source, engine: engine)
            XCTAssertEqual(road.choices.first { $0.id == "shares" }!.available(in: village), first == "commons")
            for decision in road.choices.filter({ $0.available(in: village) }) {
                let resolved = try engine.choose(decision.id, in: village)
                let passed = try waitFor("stone_road_account", in: resolved, engine: engine)
                let city = try draw("quarry_arbitration", from: passed, engine: engine)
                let card = engine.content.card("quarry_arbitration")!
                XCTAssertEqual(card.choices.first { $0.id == "covenant" }!.available(in: city), decision.id == "shares")
                for final in card.choices.filter({ $0.available(in: city) }) {
                    XCTAssertTrue(try engine.choose(final.id, in: city).flags.contains("resolved_quarry_arbitration"))
                }
            }
        }
    }

    func testSeedChoicesSurviveSaveAndChangeFutureGuaranteeAccess() throws {
        let engine = try engine()
        let observed = try engine.choose("observe", in: begin("river_tracks", engine: engine))
        let camp = try draw("reed_seed_cache", from: observed, engine: engine)
        for first in ["save", "eat"] {
            let source = try engine.choose(first, in: camp)
            let ready = try waitFor("seed_trial_record", in: source, engine: engine)
            let restored = try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(ready))
            XCTAssertEqual(restored, ready)
            let village = try draw("seed_witness", from: restored, engine: engine)
            let card = engine.content.card("seed_witness")!
            XCTAssertEqual(card.choices.first { $0.id == "trial" }!.available(in: village), first == "save")
            for decision in card.choices.filter({ $0.available(in: village) }) {
                let result = try engine.choose(decision.id, in: village)
                let passed = try waitFor("seed_trust_proven", in: result, engine: engine)
                let city = try draw("famine_receipts", from: passed, engine: engine)
                let end = engine.content.card("famine_receipts")!
                XCTAssertEqual(end.choices.first { $0.id == "fund" }!.available(in: city), decision.id != "houses")
                for final in end.choices.filter({ $0.available(in: city) }) {
                    XCTAssertTrue(try engine.choose(final.id, in: city).flags.contains("resolved_famine_receipts"))
                }
            }
        }
    }

    func testShelterAndEmberChoicesReachDistinctCityRoofPolicies() throws {
        let engine = try engine()
        for fire in ["shared", "separate"] {
            let lit = try engine.choose("conserve", in: begin("sacred_fire", engine: engine))
            let camp = try draw("ember_watch", from: lit, engine: engine)
            let watched = try engine.choose(fire, in: camp)
            let shelter = try draw("bark_shelter", from: watched, engine: engine)
            for earlier in ["build", "wait"] {
                let source = try engine.choose(earlier, in: shelter)
                let village = try draw("kiln_shelter", from: source, engine: engine)
                for decision in ["shed", "households"] {
                    let result = try engine.choose(decision, in: village)
                    XCTAssertEqual(result.buildings.contains("drying_shed"), decision == "shed")
                    let passed = try waitFor("roof_craft_tested", in: result, engine: engine)
                    let city = try draw("roof_beams", from: passed, engine: engine)
                    let card = engine.content.card("roof_beams")!
                    XCTAssertEqual(card.choices.first { $0.id == "roster" }!.available(in: city), fire == "shared")
                    for end in card.choices.filter({ $0.available(in: city) }) {
                        let final = try engine.choose(end.id, in: city)
                        XCTAssertTrue(final.flags.contains("resolved_roof_beams"))
                        XCTAssertEqual(final.buildings.contains("distributed_storehouses"), end.id != "timber")
                    }
                }
            }
        }
    }

    func testEveryNewOutcomeClosesAndOldSaveStillLoadsWithoutNewFlags() throws {
        let engine = try engine()
        for id in ids {
            let card = try XCTUnwrap(engine.content.card(id))
            XCTAssertTrue(card.exclusionConditions.contains { $0.flag == "resolved_\(id)" })
            for choice in card.choices {
                for outcome in choice.outcomes {
                    XCTAssertTrue(outcome.effect.flags.contains("resolved_\(id)"))
                    XCTAssertFalse(outcome.delayedEffects.isEmpty)
                    XCTAssertFalse(outcome.effect.rivalRelations?.isEmpty ?? true)
                    var closed = engine.start(seed: 3)
                    closed.flags.formUnion(outcome.effect.flags)
                    XCTAssertTrue(card.exclusionConditions.contains { $0.matches(closed) })
                }
            }
        }
        var old = engine.start(seed: 19)
        old.currentCardID = "bark_shelter"
        let restored = try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(old))
        XCTAssertEqual(try engine.choose("build", in: old), try engine.choose("build", in: restored))
        XCTAssertEqual(try engine.choose("wait", in: old), try engine.choose("wait", in: restored))
        XCTAssertEqual(old.schemaVersion, 1)
    }

    func testLocalFlintDraftDelaysAreOutcomesNotSeparateRandomAlternatives() throws {
        let engine = try engine()
        let source = try begin("flint_apprentice", engine: engine)
        for (choice, flag) in [("teach", "flint_apprentice_completed"), ("reserve", "flint_apprentice_reserved")] {
            let card = engine.content.card("flint_apprentice")!
            let option = try XCTUnwrap(card.choices.first { $0.id == choice })
            XCTAssertEqual(option.outcomes.count, 1)
            XCTAssertEqual(option.outcomes.first?.probability, 1)
            let result = try engine.choose(choice, in: source)
            XCTAssertFalse(result.flags.contains(flag))
            XCTAssertTrue(try waitFor(flag, in: result, engine: engine).flags.contains(flag))
        }
    }
}

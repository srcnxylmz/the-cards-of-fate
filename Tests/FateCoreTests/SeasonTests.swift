import XCTest
@testable import FateCore

final class SeasonTests: XCTestCase {
    private func engine() throws -> GameEngine { GameEngine(content: try .bundled()) }
    private func fixture(_ id: String, _ engine: GameEngine) throws -> GameState {
        var state = engine.start(seed: 71)
        let card = try XCTUnwrap(engine.content.card(id))
        state.era = card.era; state.currentCardID = id
        state.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 60) })
        return state
    }
    private func draw(_ id: String, after original: GameState, _ engine: GameEngine) throws -> GameState {
        var state = original
        state.era = try XCTUnwrap(engine.content.card(id)).era
        state.discovered = Set(engine.content.cards.map(\.id).filter { $0 != id })
        state.lastSeen[id] = -10000 // Isolate story predicates from incidental fixture draws.
        let drawn = engine.acknowledge(state)
        XCTAssertEqual(drawn.currentCardID, id)
        return drawn
    }
    private func wait(_ turns: Int, after original: GameState, _ engine: GameEngine) throws -> GameState {
        var state = original
        for _ in 0..<turns {
            state = engine.acknowledge(state)
            state.currentCardID = "ochre_border" // controlled turn fixture, no injected delayed flag
            state.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 60) })
            let filler = engine.content.card("ochre_border")!.choices.first { $0.id == "symbols" }!.available(in: state) ? "symbols" : "renew"
            state = try engine.choose(filler, in: state)
        }
        return state
    }

    func testAlternativeCultivationHasRealCostAndDelayedSeedHistory() throws {
        let engine = try engine()
        let state = try fixture("spring_seedbed", engine)
        let card = engine.content.card("spring_seedbed")!
        XCTAssertTrue(card.requirements.allSatisfy { $0.matches(state) })
        let tended = try engine.choose("tend", in: state)
        let abandoned = try engine.choose("gather", in: state)
        XCTAssertTrue(tended.technologies.contains("cultivation"))
        XCTAssertFalse(abandoned.technologies.contains("cultivation"))
        XCTAssertLessThan(tended.stats["resources"]!, abandoned.stats["resources"]!)
        XCTAssertTrue(tended.flags.contains("resolved_spring_seedbed"))
        XCTAssertFalse(tended.flags.contains("seedbed_proven"))
        let passed = try wait(6, after: tended, engine)
        let restored = try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(passed))
        XCTAssertTrue(restored.flags.contains("seedbed_proven"))
        let village = try draw("seed_lots", after: restored, engine)
        let extra = engine.content.card("seed_lots")!.choices.first { $0.id == "beds" }!
        XCTAssertTrue(extra.available(in: village))
        let without = try draw("seed_lots", after: abandoned, engine)
        XCTAssertFalse(extra.available(in: without))
        XCTAssertEqual(try engine.choose("test", in: village), try engine.choose("test", in: JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(village))))
    }

    func testSiltLaborAndApprenticeshipUnlockDifferentFutureOptions() throws {
        let engine = try engine()
        var village = try fixture("silt_turn", engine)
        village.technologies.insert("irrigation")
        XCTAssertTrue(engine.content.card("silt_turn")!.requirements.allSatisfy { $0.matches(village) })
        let crew = try engine.choose("crew", in: village)
        let debt = try engine.choose("advance", in: village)
        let charter = engine.content.card("silt_charter")!
        XCTAssertTrue(charter.requirements.allSatisfy { $0.matches(crew) })
        XCTAssertFalse(charter.requirements.allSatisfy { $0.matches(debt) })
        let city = try draw("silt_charter", after: crew, engine)
        for choice in charter.choices {
            let result = try engine.choose(choice.id, in: city)
            XCTAssertTrue(charter.exclusionConditions.contains { $0.matches(result) })
        }
        let apprentice = try engine.choose("teach", in: fixture("flint_apprentice", engine))
        let availableLater = engine.content.card("smoke_shift")!.choices.first { $0.id == "apprentices" }!
        XCTAssertFalse(availableLater.available(in: apprentice))
        let taught = try wait(3, after: apprentice, engine)
        let smoke = try draw("smoke_shift", after: taught, engine)
        XCTAssertTrue(availableLater.available(in: smoke))
        XCTAssertTrue(try engine.choose("apprentices", in: smoke).flags.contains("trained_furnace_rota"))
    }

    func testExistingHistoricalOutcomesCloseForOldSaveFlags() throws {
        let engine = try engine()
        for id in ["sacred_fire", "stranger_child", "cave_marks", "seed_debt", "ancestor_field"] {
            let card = try XCTUnwrap(engine.content.card(id))
            for choice in card.choices {
                let before = try fixture(id, engine)
                let result = try engine.choose(choice.id, in: before)
                let oldSave = try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(result))
                XCTAssertTrue(card.exclusionConditions.contains { $0.matches(oldSave) }, id)
                XCTAssertNoThrow(try engine.choose(choice.id, in: before), "Already-presented v1 cards still resolve")
            }
        }
        var ruler = try fixture("empty_seat", engine); ruler.leadership = .ruler
        XCTAssertTrue(engine.content.card("empty_seat")!.exclusionConditions.contains { $0.matches(ruler) })
        ruler.leadership = .exile
        XCTAssertFalse(engine.content.card("empty_seat")!.exclusionConditions.contains { $0.matches(ruler) })
        let ash = engine.content.card("ash_garden")!.choices.first { $0.id == "plots" }!.outcomes[0]
        XCTAssertTrue(ash.delayedEffects.contains { $0.effect.stats["resources", default: 0] < 0 })
    }

    func testNewEventsHaveCostsHistoryAndFiniteHistoricalClosure() throws {
        let engine = try engine()
        let ids = ["calving_herd", "spring_seedbed", "winter_porters", "hunt_challenge", "fallow_strips", "seed_lots", "silt_turn", "grazing_strip", "harbor_ballast", "seal_copy", "smoke_shift", "silt_charter"]
        for id in ids {
            let card = try XCTUnwrap(engine.content.card(id))
            for choice in card.choices {
                for outcome in choice.outcomes {
                    XCTAssertFalse(outcome.delayedEffects.isEmpty, id)
                    XCTAssertFalse(outcome.effect.rivalRelations?.isEmpty ?? true, id)
                    if outcome.effect.stats["resources", default: 0] > 0 {
                        XCTAssertTrue(outcome.effect.stats.values.contains { $0 < 0 } || outcome.delayedEffects.contains { $0.effect.stats.values.contains { $0 < 0 } }, id)
                    }
                    if ["spring_seedbed", "seal_copy", "silt_charter"].contains(id) {
                        XCTAssertTrue(outcome.effect.flags.contains("resolved_\(id)"))
                    }
                }
            }
        }
    }

    func testRecurringPoolDoesNotExhaustInNaturalSeededRuns() throws {
        let engine = try engine()
        for name in ["random", "survival", "knowledge", "progression"] {
            for seed in 0..<100 {
                var state = engine.start(seed: UInt64(seed))
                var random = SeededRandom(state: UInt64(seed) ^ 0xD00D)
                for _ in 0..<150 {
                    guard state.ending == nil, let card = engine.content.card(state.currentCardID) else { break }
                    let choices = card.choices.filter { $0.available(in: state) }
                    let choice = engine.select(choices, state: state, policyName: name, random: &random)
                    state = engine.acknowledge(try engine.choose(choice.id, in: state))
                    XCTAssertFalse(state.ending?.en.contains("no eligible events") ?? false, "\(name) seed \(seed)")
                }
            }
        }
    }
}

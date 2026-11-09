import XCTest
@testable import FateCore

final class GameEngineTests: XCTestCase {
    private func engine() throws -> GameEngine { GameEngine(content: try .bundled()) }

    func testSuccessionCanRemoveLeadershipInTheSameTurn() throws {
        let engine = try engine()
        var state = engine.start(seed: 15)
        state.turn = engine.content.balance.successionTurns - 1
        state.leadership = .ruler
        state.leaderTurns = 10
        state.consecutiveLeaderTurns = 10
        state.stats["authority"] = 8
        state.currentCardID = "river_tracks"
        for i in state.rivals.indices { state.rivals[i].relation = 100 }
        let result = try engine.choose("follow", in: state)
        XCTAssertEqual(result.stats["authority"], 0)
        XCTAssertEqual(result.leadership, .exile)
        XCTAssertEqual(result.leaderTurns, 10)
        XCTAssertEqual(result.consecutiveLeaderTurns, 0)
        XCTAssertEqual(result.generation, 2)
        XCTAssertEqual(result.resolution?.consequences?.count, 2)
    }

    func testProbabilitiesAreNormalizedAndKnowledgeImprovesRisk() throws {
        let engine = try engine()
        var state = engine.start(seed: 9)
        let choice = try XCTUnwrap(engine.content.card("red_mushrooms")?.choices.first { $0.id == "feast" })
        state.stats["knowledge"] = 0
        let low = engine.outcomeProbabilities(for: choice, in: state)
        state.stats["knowledge"] = 100
        let high = engine.outcomeProbabilities(for: choice, in: state)
        XCTAssertEqual(low.reduce(0,+), 1, accuracy: 1e-12)
        XCTAssertEqual(high.reduce(0,+), 1, accuracy: 1e-12)
        XCTAssertGreaterThan(high[0], low[0])
        let rng = state.random
        for _ in 0..<5 { _ = engine.outcomeProbabilities(for: choice, in: state) }
        XCTAssertEqual(state.random, rng)
    }

    func testLegacyV1ResolutionLoadsWithoutConsequenceField() throws {
        let engine = try engine()
        let initial = engine.start(seed: 33)
        let card = try XCTUnwrap(engine.content.card(initial.currentCardID))
        let state = try engine.choose(card.choices[0].id, in: initial)
        var json = try XCTUnwrap(JSONSerialization.jsonObject(with: JSONEncoder().encode(state)) as? [String: Any])
        var result = try XCTUnwrap(json["resolution"] as? [String: Any])
        result.removeValue(forKey: "consequences")
        json["resolution"] = result
        let loaded = try JSONDecoder().decode(GameState.self, from: JSONSerialization.data(withJSONObject: json))
        XCTAssertNil(loaded.resolution?.consequences)
        XCTAssertEqual(loaded.random, state.random)
        XCTAssertEqual(engine.acknowledge(loaded).currentCardID, engine.acknowledge(state).currentCardID)
    }

    func testSplitMixKnownVector() {
        var random = SeededRandom(state: 0)
        XCTAssertEqual(random.next(), 0xE220A8397B1DCDAF)
        XCTAssertEqual(random.next(), 0x6E789E6AA1B965F4)
    }

    func testDeterministicReplayAcrossSaveBoundary() throws {
        let engine = try engine()
        var live = engine.start(seed: 719)
        var restored = live
        for _ in 0..<100 {
            guard let card = engine.content.card(live.currentCardID), live.ending == nil else { break }
            let choice = try XCTUnwrap(card.choices.first { $0.available(in: live) })
            live = try engine.choose(choice.id, in: live)
            restored = try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(restored))
            restored = try engine.choose(choice.id, in: restored)
            XCTAssertEqual(live, restored)
            live = engine.acknowledge(live); restored = engine.acknowledge(restored)
        }
        XCTAssertGreaterThan(live.turn, 0)
    }

    func testDoubleTapCannotSpendTwoTurns() throws {
        let engine = try engine()
        let state = engine.start(seed: 42)
        let card = try XCTUnwrap(engine.content.card(state.currentCardID))
        let result = try engine.choose(card.choices[0].id, in: state)
        XCTAssertEqual(result.turn, 1)
        XCTAssertNil(result.currentCardID)
        XCTAssertThrowsError(try engine.choose(card.choices[0].id, in: result))
        let next = engine.acknowledge(result)
        XCTAssertEqual(next.turn, 1)
        XCTAssertNil(next.resolution)
    }

    func testHistoricalConsequenceWaitsForEraAndTurn() throws {
        let engine = try engine()
        var state = engine.start(seed: 7)
        state.currentCardID = "sacred_fire"
        state = try engine.choose("burn", in: state)
        XCTAssertEqual(state.delayed.count, 1)
        state = engine.acknowledge(state)
        state.turn = 9
        state.currentCardID = "cave_marks"
        state = try engine.choose("lamps", in: state)
        XCTAssertEqual(state.delayed.count, 1, "Era gate must hold even after due turn")
        state = engine.acknowledge(state)
        state.era = 2
        state.currentCardID = "market_measures"
        state = try engine.choose("standard", in: state)
        XCTAssertTrue(state.delayed.isEmpty)
        XCTAssertTrue(state.history.contains { $0.text.en.contains("bare hillside") })
        XCTAssertTrue(state.resolution?.consequences?.contains { $0.en.contains("bare hillside") } ?? false)
    }

    func testAuthorityLossIsRecoverable() throws {
        let engine = try engine()
        var state = engine.start(seed: 1)
        state.stats["authority"] = 0
        state.currentCardID = "river_tracks"
        state = try engine.choose("follow", in: state)
        XCTAssertEqual(state.leadership, .exile)
        XCTAssertNil(state.ending)
        state = engine.acknowledge(state)
        state.stats["authority"] = 55
        state.currentCardID = "empty_seat"
        state = try engine.choose("lead", in: state)
        XCTAssertEqual(state.leadership, .ruler)
    }

    func testEraRequiresTechnologyAndSocialThresholds() throws {
        let engine = try engine()
        var state = engine.start(seed: 2)
        state.stats["knowledge"] = 90
        state.currentCardID = "cave_marks"
        state = try engine.choose("record", in: state)
        XCTAssertEqual(state.era, 1)
        state = engine.acknowledge(state)
        state.currentCardID = "river_tracks"
        state = try engine.choose("observe", in: state)
        XCTAssertEqual(state.era, 2)
    }

    func testWeeklyMondayUTCAndYearBoundary() throws {
        let parser = ISO8601DateFormatter()
        let sunday = try XCTUnwrap(parser.date(from: "2027-01-03T23:59:59Z"))
        let monday = try XCTUnwrap(parser.date(from: "2027-01-04T00:00:00Z"))
        XCTAssertEqual(WeeklyChallenge.id(at: sunday), "2026-12-28")
        XCTAssertEqual(WeeklyChallenge.id(at: monday), "2027-01-04")
        let engine = try engine()
        let first = engine.start(seed: 1, mode: .weekly, now: sunday)
        let second = engine.start(seed: 999, mode: .weekly, now: sunday)
        XCTAssertEqual(first, second)
        let card = try XCTUnwrap(engine.content.card(first.currentCardID))
        XCTAssertThrowsError(try engine.choose(card.choices[0].id, in: first, now: monday))
    }

    func testAtomicSaveRoundTripAndFutureSchemaRejection() throws {
        let directory = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        defer { try? FileManager.default.removeItem(at: directory) }
        let service = PersistenceService(url: directory.appendingPathComponent("save.json"))
        let state = try engine().start(seed: 9)
        try service.save(state)
        XCTAssertEqual(try service.load(), state)
        let future = Data("{\"schemaVersion\":999}".utf8)
        try future.write(to: service.url)
        XCTAssertThrowsError(try service.load()) { error in
            guard case SaveError.unsupportedVersion(999) = error else { return XCTFail("Expected schema rejection") }
        }
    }

    func testConditionsAndCooldownNeverBypassed() throws {
        let engine = try engine()
        var state = engine.start(seed: 11)
        state.era = 2
        state.resolution = Resolution(title: .init(tr: "x", en: "x"), text: .init(tr: "x", en: "x"), animation: "normal", changes: [:], previousEra: 2)
        state.currentCardID = nil
        for card in engine.content.cards { state.lastSeen[card.id] = state.turn }
        state = engine.acknowledge(state)
        XCTAssertNotNil(state.ending)
        XCTAssertNil(state.currentCardID)
    }

    func testChoiceRequirementsAndTerminalState() throws {
        var content = try ContentDatabase.bundled()
        content.cards[0].choices[0].requirements = [.init(stat: .resources, minimum: 100)]
        let engine = GameEngine(content: content)
        var state = engine.start(seed: 0)
        state.currentCardID = content.cards[0].id
        XCTAssertThrowsError(try engine.choose(content.cards[0].choices[0].id, in: state))
        state.ending = .init(tr: "Bitti", en: "Finished")
        XCTAssertThrowsError(try engine.choose(content.cards[0].choices[1].id, in: state))
    }
}

import XCTest
@testable import FateCore

final class GameEngineTests: XCTestCase {
    private func engine() throws -> GameEngine { GameEngine(content: try .bundled()) }

    func testLegacyEffectAndTargetedRelations() throws {
        let old = Data(#"{"stats":{},"flags":[],"technologies":[],"buildings":[],"rivalRelation":3}"#.utf8)
        XCTAssertNil(try JSONDecoder().decode(Effect.self, from: old).rivalRelations)
        let engine = try engine()
        var state = engine.start(seed: 42)
        state.currentCardID = "broken_spear"
        let hearing = try engine.choose("hearing", in: state)
        XCTAssertEqual(hearing.rivals.map(\.relation), [-10, 18])
        let protect = try engine.choose("protect", in: state)
        XCTAssertEqual(protect.rivals.map(\.relation), [12, 2])
        XCTAssertEqual(try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(hearing)), hearing)
    }

    func testFactionIdentityPreservesLegacyRelationshipsAcrossEras() throws {
        let state = try engine().start(seed: 42)
        for era in 2...3 {
            for rival in state.rivals {
                let transformed = rival.identity(in: era)
                XCTAssertEqual(transformed.id, rival.id)
                XCTAssertEqual(transformed.power, rival.power)
                XCTAssertEqual(transformed.relation, rival.relation)
                XCTAssertNotEqual(transformed.name, rival.name)
                XCTAssertNotEqual(transformed.motivation, rival.motivation)
            }
        }
    }

    func testFriendlyStrongestFactionDoesNotHideOpposition() throws {
        let engine = try engine()
        var state = engine.start(seed: 1)
        state.turn = 3
        state.currentCardID = "river_tracks"
        state.stats["authority"] = 30
        state.rivals[0].power = 95
        state.rivals[0].relation = 50
        state.rivals[1].power = 80
        state.rivals[1].relation = -10
        let challenged = try engine.choose("follow", in: state)
        var friendly = state
        friendly.rivals[1].relation = 50
        let peaceful = try engine.choose("follow", in: friendly)
        XCTAssertEqual(challenged.stats["authority"], peaceful.stats["authority"])
        XCTAssertEqual(challenged.stats["stability"], peaceful.stats["stability"]! - engine.content.balance.rivalPressure)
        XCTAssertTrue(challenged.resolution!.consequences!.contains { $0.en.contains("stability fell") })
        state.rivals[0].relation = -10
        let hunterChallenge = try engine.choose("follow", in: state)
        XCTAssertEqual(hunterChallenge.stats["authority"], peaceful.stats["authority"]! - engine.content.balance.rivalPressure)
        XCTAssertEqual(hunterChallenge.stats["stability"], peaceful.stats["stability"])
    }

    func testUnseenEligibleEventsAlwaysPrecedeRepeats() throws {
        let engine = try engine()
        for seed in 0..<100 {
            var state = engine.start(seed: UInt64(seed))
            for _ in 0..<30 {
                guard state.ending == nil, let card = engine.content.card(state.currentCardID) else { break }
                state = try engine.choose(card.choices.first { $0.available(in: state) }!.id, in: state)
                let seen = state.discovered
                let unseenEligible = engine.content.cards.filter { candidate in
                    candidate.era == state.era && !seen.contains(candidate.id)
                    && candidate.requirements.allSatisfy { $0.matches(state) }
                    && !candidate.exclusionConditions.contains { $0.matches(state) }
                    && candidate.choices.filter { $0.available(in: state) }.count >= 2
                    && state.turn - state.lastSeen[candidate.id, default: -10000] >= candidate.cooldown
                }
                state = engine.acknowledge(state)
                if state.ending == nil && !unseenEligible.isEmpty {
                    XCTAssertFalse(seen.contains(try XCTUnwrap(state.currentCardID)))
                }
            }
        }
    }

    func testHistoricalChoicesUnlockAndCloseTheirFollowups() throws {
        let engine = try engine()
        for (source, choice, target, era) in [
            ("river_tracks", "observe", "river_markers", 2),
            ("stranger_child", "shelter", "caravan_charter", 3),
            ("seed_debt", "commons", "debt_insurance", 3)
        ] {
            var state = engine.start(seed: 12)
            let followup = try XCTUnwrap(engine.content.card(target))
            XCTAssertFalse(followup.requirements.allSatisfy { $0.matches(state) })
            state.era = try XCTUnwrap(engine.content.card(source)).era
            state.currentCardID = source
            state = try engine.choose(choice, in: state)
            state.era = era
            state.discovered = Set(engine.content.cards.map(\.id).filter { $0 != target })
            state = engine.acknowledge(state)
            XCTAssertEqual(state.currentCardID, target)
            for decision in followup.choices {
                let resolved = try engine.choose(decision.id, in: state)
                XCTAssertTrue(followup.exclusionConditions.contains { $0.matches(resolved) }, "Every branch must close \(target)")
            }
        }
    }

    func testNewlyUnlockedFollowupCannotBeStarvedBySeenEvents() throws {
        let engine = try engine()
        var state = engine.start(seed: 22)
        state.currentCardID = "first_granary"
        state.era = 2
        state = try engine.choose("shared", in: state)
        state.discovered = Set(engine.content.cards.map(\.id).filter { $0 != "missing_grain" })
        let next = engine.acknowledge(state)
        XCTAssertEqual(next.currentCardID, "missing_grain")
    }

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

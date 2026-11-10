import XCTest
@testable import FateCore

final class PoliticsTests: XCTestCase {
    private func engine() throws -> GameEngine { GameEngine(content: try .bundled()) }

    func testPaidNegotiationIsBoundedAndCannotFarmTurnsOrRandomness() throws {
        let engine = try engine()
        let initial = engine.start(seed: 42)
        let state = try engine.council(.negotiate("hunters"), in: initial)
        XCTAssertEqual(state.rivals[0].relation, 20)
        XCTAssertEqual(state.rivals[1].relation, initial.rivals[1].relation)
        XCTAssertEqual(state.stats["resources"], initial.stats["resources"]! - 8)
        XCTAssertEqual(state.turn, initial.turn)
        XCTAssertEqual(state.random, initial.random)
        XCTAssertEqual(state.currentCardID, initial.currentCardID)
        XCTAssertEqual(state.leaderTurns, initial.leaderTurns)
        XCTAssertThrowsError(try engine.council(.negotiate("keepers"), in: state))
        XCTAssertThrowsError(try engine.council(.negotiate("unknown"), in: initial))
        var poor = initial; poor.stats["resources"] = 7
        XCTAssertThrowsError(try engine.council(.negotiate("hunters"), in: poor))
        var later = state; later.turn += engine.content.politics.actionCooldown
        later.rivals[0].relation = 49
        later = try engine.council(.negotiate("hunters"), in: later)
        XCTAssertEqual(later.rivals[0].relation, 50)
        later.turn += engine.content.politics.actionCooldown
        XCTAssertFalse(engine.councilActionAvailable(.negotiate("hunters"), in: later))
    }

    func testPoliticsSaveCompatibilityAndReplay() throws {
        let engine = try engine()
        let old = engine.start(seed: 42)
        var json = try XCTUnwrap(JSONSerialization.jsonObject(with: JSONEncoder().encode(old)) as? [String: Any])
        json.removeValue(forKey: "politics")
        let restoredOld = try JSONDecoder().decode(GameState.self, from: JSONSerialization.data(withJSONObject: json))
        XCTAssertNil(restoredOld.politics)
        let paid = try engine.council(.negotiate("hunters"), in: restoredOld)
        let restored = try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(paid))
        XCTAssertEqual(paid, restored)
        let choice = try XCTUnwrap(engine.content.card(paid.currentCardID)?.choices.first).id
        XCTAssertEqual(try engine.choose(choice, in: paid), try engine.choose(choice, in: restored))
        let resolved = try engine.choose(choice, in: paid)
        XCTAssertFalse(engine.councilActionAvailable(.alliance, in: resolved))
    }

    func testPactSupportsSuccessionButExpiresAndBreaksOnBetrayal() throws {
        let engine = try engine()
        var state = engine.start(seed: 1)
        state.turn = 23
        state.currentCardID = "river_tracks"
        state.stats["authority"] = 10
        for i in state.rivals.indices { state.rivals[i].relation = 25 }
        let pact = try engine.council(.alliance, in: state)
        let supported = try engine.choose("follow", in: pact)
        let unsupported = try engine.choose("follow", in: state)
        XCTAssertEqual(supported.stats["authority"], 8) // +2 support, -4 inheritance cost
        XCTAssertEqual(unsupported.stats["authority"], 2)
        XCTAssertEqual(supported.generation, 2)
        XCTAssertTrue(engine.hasAlliance(supported))
        XCTAssertEqual(supported.rivals.map(\.relation), [25, 25])
        var expired = pact; expired.turn = 34
        let end = try engine.choose("follow", in: expired)
        XCTAssertFalse(engine.hasAlliance(end))
        XCTAssertNil(end.politics?.allianceUntilTurn)
        var betrayed = pact; betrayed.currentCardID = "broken_spear"
        let broken = try engine.choose("hearing", in: betrayed)
        XCTAssertNil(broken.politics?.allianceUntilTurn)
        XCTAssertTrue(broken.history.contains { $0.text.en.contains("dissolved") })
    }

    func testSupportAndLegitimacyCanDefeatPressureWithoutLoweringDamage() throws {
        let engine = try engine()
        var state = engine.start(seed: 2)
        state.turn = 3; state.currentCardID = "river_tracks"
        state.stats["authority"] = 40; state.stats["stability"] = 55
        state.rivals[0].power = 60; state.rivals[0].relation = -30
        state.rivals[1].power = 60; state.rivals[1].relation = 0
        let alone = try engine.choose("follow", in: state)
        state.rivals[1].relation = 40
        let defended = try engine.choose("follow", in: state)
        XCTAssertEqual(alone.stats["authority"], 35)
        XCTAssertEqual(defended.stats["authority"], 40)
        XCTAssertEqual(engine.content.balance.rivalPressure, 5)
        state.stats["stability"] = 30
        let illegitimate = try engine.choose("follow", in: state)
        XCTAssertEqual(illegitimate.stats["authority"], 35)
    }

    func testHostileCoalitionNeedsBothFactionsAndPowerHasEconomicBase() throws {
        let engine = try engine()
        var state = engine.start(seed: 2)
        state.turn = 3; state.currentCardID = "river_tracks"
        state.stats["authority"] = 55; state.stats["stability"] = 55
        for i in state.rivals.indices { state.rivals[i].power = 60; state.rivals[i].relation = -25 }
        let united = try engine.choose("follow", in: state)
        state.rivals[1].relation = 0
        let divided = try engine.choose("follow", in: state)
        XCTAssertEqual(united.stats["authority"], 50)
        XCTAssertEqual(divided.stats["authority"], 55)
        state.stats["resources"] = 0; state.stats["knowledge"] = 0
        for _ in 0..<200 { engine.updateFactionPower(&state) }
        XCTAssertEqual(state.rivals.map(\.power), [45, 30])
        XCTAssertLessThan(state.rivals[0].power, 100)
    }

    func testObserverDoesNotChangeOutcomeAndRecordsActualAuthorityStages() throws {
        let engine = try engine()
        var state = engine.start(seed: 42)
        state.turn = 23; state.stats["authority"] = 8; state.currentCardID = "river_tracks"
        for i in state.rivals.indices { state.rivals[i].relation = 100 }
        var snapshots: [String: Int] = [:]
        let observed = try engine.choose("follow", in: state) { stage, value in snapshots[stage] = value.stats["authority"] }
        XCTAssertEqual(observed, try engine.choose("follow", in: state))
        XCTAssertEqual(snapshots["card"], 8)
        XCTAssertEqual(snapshots["council"], 8)
        XCTAssertEqual(snapshots["succession"], 0)
        XCTAssertEqual(observed.leadership, .exile)
    }

    func testInvalidRulesAndExpiredWeeklyActionRejected() throws {
        var rules = try ContentDatabase.bundled().politics
        rules.supportDivisor = 0
        XCTAssertThrowsError(try rules.validate())
        let engine = try engine()
        var state = engine.start(seed: 3, mode: .weekly)
        state.weekID = "expired"
        XCTAssertFalse(engine.councilActionAvailable(.negotiate("hunters"), in: state))
        XCTAssertThrowsError(try engine.council(.negotiate("hunters"), in: state))
    }
}

import XCTest
@testable import FateCore

final class SimulationPolicyTests: XCTestCase {
    func testProgressionInvestsInMissingTechnologyAtKnowledgeCapWithoutPeeking() throws {
        let engine = GameEngine(content: try .bundled())
        var state = engine.start(seed: 4)
        state.stats["knowledge"] = 100
        state.stats["resources"] = 65
        let before = state
        var random = SeededRandom(state: 900)
        let choices = try XCTUnwrap(engine.content.card("river_tracks")).choices
        XCTAssertEqual(engine.select(choices, state: state, policyName: "knowledge", random: &random).id, "follow")
        XCTAssertEqual(engine.select(choices, state: state, policyName: "progression", random: &random).id, "observe")
        XCTAssertEqual(state, before)
        XCTAssertEqual(random.state, 900)
        state.era = 2
        let smelting = try XCTUnwrap(engine.content.card("green_stone")).choices
        XCTAssertEqual(engine.select(smelting, state: state, policyName: "progression", random: &random).id, "kiln")
    }

    func testProgressionUsesAvailableChoicesAndSurvivesSaveBoundary() throws {
        let engine = GameEngine(content: try .bundled())
        var a = engine.start(seed: 31)
        var b = try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(a))
        var ra = SeededRandom(state: 44), rb = ra
        for _ in 0..<80 {
            guard a.ending == nil, let card = engine.content.card(a.currentCardID) else { break }
            let choices = card.choices.filter { $0.available(in: a) }
            let ca = engine.select(choices, state: a, policyName: "progression", random: &ra)
            let cb = engine.select(choices, state: b, policyName: "progression", random: &rb)
            XCTAssertEqual(ca.id, cb.id)
            a = engine.acknowledge(try engine.choose(ca.id, in: a))
            b = engine.acknowledge(try engine.choose(cb.id, in: b))
            XCTAssertEqual(a, b)
        }
    }
}

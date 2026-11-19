import XCTest
@testable import FateCore

/// Era 4 must stay closed until an explicit gate is enabled *and* its inventory is complete.
final class EraReadinessTests: XCTestCase {
    private func readyBronze(_ e: GameEngine, seed: UInt64 = 404) -> GameState {
        var s = e.start(seed: seed)
        s.era = 3
        s.technologies.formUnion(["hearth", "cultivation", "smelting", "writing"])
        s.stats = ["population": 60, "resources": 60, "authority": 60, "knowledge": 90, "stability": 70, "environment": 60]
        s.flags.formUnion(["guest_citizenship", "public_care_settlement", "bread_bond_repaid"])
        s.currentCardID = "tin_caravan"
        return s
    }
    private func gated(_ edit: (inout EraContentGate) -> Void) throws -> ContentDatabase {
        var content = try ContentDatabase.bundled()
        let index = try XCTUnwrap(content.eras.firstIndex { $0.id == 4 })
        var gate = try XCTUnwrap(content.eras[index].contentGate)
        edit(&gate)
        content.eras[index].contentGate = gate
        return content
    }

    func testBundledEraFourGateIsDisabledAndInventoryIsShort() throws {
        let content = try ContentDatabase.bundled()
        let gate = try XCTUnwrap(content.eras.first { $0.id == 4 }?.contentGate)
        XCTAssertFalse(gate.enabled)
        XCTAssertEqual([gate.minimumCards, gate.minimumRecurring, gate.minimumConclusions, gate.minimumBridges], [40, 24, 8, 8])
        let inventory = content.inventory(era: 4)
        XCTAssertEqual([inventory.total, inventory.recurring, inventory.conclusions, inventory.bridges], [15, 9, 3, 3])
        XCTAssertTrue(inventory.missingCategories(for: gate).isEmpty)
        XCTAssertFalse(inventory.satisfies(gate))
        XCTAssertTrue(content.eraContentReady(2))
        XCTAssertTrue(content.eraContentReady(3))
        XCTAssertFalse(content.eraContentReady(4))
        XCTAssertFalse(content.eraContentReady(5))
        XCTAssertEqual(content.playableCards.count, 180)
        XCTAssertEqual(content.cards.count, 195)
        for era in 1...3 { XCTAssertNil(content.eras.first { $0.id == era }?.contentGate) }
        for era in 5...12 { XCTAssertEqual(content.eras.first { $0.id == era }?.contentGate?.enabled, false) }
        let bronze = try XCTUnwrap(content.eras.first { $0.id == 3 })
        XCTAssertEqual(bronze.requiredTechnology, "writing")
        XCTAssertEqual([bronze.knowledgeThreshold, bronze.stabilityThreshold, bronze.populationThreshold], [78, 35, 25])
    }

    func testAuthoredEraFourCardsDoNotOpenTheEraWhenEveryThresholdIsMet() throws {
        let e = GameEngine(content: try .bundled())
        let before = readyBronze(e)
        let after = try e.choose("toll", in: before)
        XCTAssertGreaterThanOrEqual(after.stats["knowledge", default: 0], 78)
        XCTAssertGreaterThanOrEqual(after.stats["stability", default: 0], 35)
        XCTAssertGreaterThanOrEqual(after.stats["population", default: 0], 25)
        XCTAssertNil(after.ending)
        XCTAssertEqual(after.era, 3, "Fifteen authored Era 4 cards must not open the era")
        XCTAssertEqual(e.acknowledge(after).era, 3)
        XCTAssertEqual(e.content.card(e.acknowledge(after).currentCardID)?.era, 3)
    }

    func testEnablingTheSwitchAloneCannotOpenAShortInventory() throws {
        let content = try gated { $0.enabled = true }
        XCTAssertFalse(content.eraContentReady(4))
        let e = GameEngine(content: content)
        XCTAssertEqual(try e.choose("toll", in: readyBronze(e)).era, 3)
    }

    func testCompleteInventoryAloneCannotOpenWithoutApproval() throws {
        let content = try gated { gate in
            gate.minimumCards = 15; gate.minimumRecurring = 9; gate.minimumConclusions = 3; gate.minimumBridges = 3
        }
        XCTAssertTrue(content.inventory(era: 4).satisfies(content.eras[3].contentGate!))
        XCTAssertFalse(content.eraContentReady(4))
        let e = GameEngine(content: content)
        XCTAssertEqual(try e.choose("toll", in: readyBronze(e)).era, 3)
    }

    func testControlledFixtureOpensOnlyWithApprovalInventoryAndThresholds() throws {
        let content = try gated { gate in
            gate.enabled = true
            gate.minimumCards = 15; gate.minimumRecurring = 9; gate.minimumConclusions = 3; gate.minimumBridges = 3
        }
        XCTAssertTrue(content.eraContentReady(4))
        XCTAssertEqual(content.playableCards.count, 195)
        let e = GameEngine(content: content)
        let start = readyBronze(e)
        let entered = try e.choose("toll", in: start)
        XCTAssertEqual(entered.era, 4)
        XCTAssertEqual(entered.resolution?.previousEra, 3)
        // Political rights and old records survive the transition unchanged.
        XCTAssertTrue(start.flags.isSubset(of: entered.flags))
        XCTAssertTrue(entered.flags.contains("bread_bond_repaid"))
        XCTAssertFalse(entered.flags.contains("bread_bond_open"))
        XCTAssertEqual(entered.leadership, start.leadership)
        XCTAssertEqual(e.content.card(e.acknowledge(entered).currentCardID)?.era, 4)
        // Existing social thresholds still apply once the gate is open.
        var lowKnowledge = readyBronze(e); lowKnowledge.stats["knowledge"] = 60
        XCTAssertEqual(try e.choose("toll", in: lowKnowledge).era, 3)
        var unwritten = readyBronze(e); unwritten.technologies.remove("writing")
        XCTAssertEqual(try e.choose("toll", in: unwritten).era, 3)
    }

    func testInventoryIsDisjointAndSelfClosingRecurringEventsDoNotCount() throws {
        var content = try ContentDatabase.bundled()
        let index = try XCTUnwrap(content.cards.firstIndex { $0.id == "road_wear" })
        content.cards[index].exclusionConditions.append(.init(flag: "resolved_road_wear"))
        let inventory = content.inventory(era: 4)
        XCTAssertEqual(inventory.recurring, 8)
        XCTAssertFalse(inventory.recurringCategories.contains("roads"))
        XCTAssertEqual(inventory.recurring + inventory.conclusions + inventory.bridges, 14)
    }

    func testOlderContentWithoutGateOrRoleStillDecodes() throws {
        let era = Data(#"{"id":4,"name":{"tr":"A","en":"A"},"settlement":{"tr":"B","en":"B"},"government":{"tr":"C","en":"C"},"requiredTechnology":"civil_law","knowledgeThreshold":82,"stabilityThreshold":35,"populationThreshold":25,"palette":"ivory","artDirection":"x"}"#.utf8)
        XCTAssertNil(try JSONDecoder().decode(EraDefinition.self, from: era).contentGate)
        let content = try ContentDatabase.bundled()
        XCTAssertTrue(content.cards.filter { $0.era <= 3 }.allSatisfy { $0.eraRole == nil })
        XCTAssertTrue(content.cards.filter { $0.era == 4 }.allSatisfy { $0.eraRole != nil })
        // A legacy deck without any Era 4 cards keeps the earlier "unauthored era" rule.
        var legacy = content; legacy.cards = content.cards.filter { $0.era <= 3 }
        XCTAssertFalse(legacy.eraContentReady(4))
    }

    func testSaveSchemaStaysVersionOneWithoutNewStateKeys() throws {
        let e = GameEngine(content: try .bundled())
        let state = readyBronze(e)
        let object = try XCTUnwrap(JSONSerialization.jsonObject(with: JSONEncoder().encode(state)) as? [String: Any])
        XCTAssertEqual(object["schemaVersion"] as? Int, 1)
        let known: Set<String> = ["schemaVersion", "seed", "random", "mode", "weekID", "turn", "era", "stats", "flags", "technologies", "buildings", "history", "delayed", "lastSeen", "discovered", "currentCardID", "resolution", "leadership", "generation", "leaderTurns", "consecutiveLeaderTurns", "longestLeadership", "ending", "rivals", "politics"]
        XCTAssertTrue(Set(object.keys).isSubset(of: known), "Era 4 groundwork adds no persistent state")
    }
}

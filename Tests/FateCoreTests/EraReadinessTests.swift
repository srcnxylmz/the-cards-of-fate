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

    func testBundledEraFourGateIsDisabledAlthoughTheInventoryIsMet() throws {
        let content = try ContentDatabase.bundled()
        let gate = try XCTUnwrap(content.eras.first { $0.id == 4 }?.contentGate)
        XCTAssertFalse(gate.enabled)
        XCTAssertEqual([gate.minimumCards, gate.minimumRecurring, gate.minimumConclusions, gate.minimumBridges], [40, 24, 8, 8])
        let inventory = content.inventory(era: 4)
        XCTAssertEqual([inventory.total, inventory.recurring, inventory.conclusions, inventory.bridges], [45, 28, 8, 8])
        XCTAssertTrue(inventory.missingCategories(for: gate).isEmpty)
        // 45 authored cards meet the minimums; the switch (and, in the validator, balance evidence) keeps it shut.
        XCTAssertTrue(inventory.satisfies(gate))
        XCTAssertTrue(content.eraContentReady(2))
        XCTAssertTrue(content.eraContentReady(3))
        XCTAssertFalse(content.eraContentReady(4))
        XCTAssertFalse(content.eraContentReady(5))
        XCTAssertEqual(content.playableCards.count, 180)
        XCTAssertEqual(content.cards.count, 225)
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
        XCTAssertEqual(after.era, 3, "Forty-five authored Era 4 cards must not open the era")
        XCTAssertEqual(e.acknowledge(after).era, 3)
        XCTAssertEqual(e.content.card(e.acknowledge(after).currentCardID)?.era, 3)
    }

    func testEnablingTheSwitchAloneCannotOpenAShortInventory() throws {
        // The 210-card deck (thirty Era 4 cards) is short; the switch alone cannot open it.
        var content = try gated { $0.enabled = true }
        content.cards = Array(content.cards.prefix(210))
        XCTAssertFalse(content.eraContentReady(4))
        let e = GameEngine(content: content)
        XCTAssertEqual(try e.choose("toll", in: readyBronze(e)).era, 3)
    }

    func testCompleteInventoryAloneCannotOpenWithoutApproval() throws {
        let content = try ContentDatabase.bundled()
        XCTAssertTrue(content.inventory(era: 4).satisfies(content.eras[3].contentGate!))
        XCTAssertFalse(content.eraContentReady(4))
        let e = GameEngine(content: content)
        XCTAssertEqual(try e.choose("toll", in: readyBronze(e)).era, 3)
    }

    func testControlledFixtureOpensOnlyWithApprovalInventoryAndThresholds() throws {
        let content = try gated { $0.enabled = true }
        XCTAssertTrue(content.eraContentReady(4))
        XCTAssertEqual(content.playableCards.count, 225)
        let e = GameEngine(content: content)
        let start = readyBronze(e)
        let entered = try e.choose("toll", in: start)
        // Same turn with the bundled (closed) gate: the only difference may be the era itself.
        let closed = try GameEngine(content: try .bundled()).choose("toll", in: start)
        XCTAssertEqual(closed.era, 3)
        XCTAssertEqual(entered.era, 4)
        XCTAssertEqual(entered.resolution?.previousEra, 3)
        // Political rights and old records survive the transition unchanged.
        XCTAssertTrue(start.flags.isSubset(of: entered.flags))
        XCTAssertTrue(entered.flags.contains("bread_bond_repaid"))
        XCTAssertFalse(entered.flags.contains("bread_bond_open"))
        // Turn resolution may promote a contender at authority ≥ 60; the era change itself must not
        // alter leadership, flags or technologies relative to the closed-gate outcome of the same turn.
        XCTAssertEqual(entered.leadership, closed.leadership)
        XCTAssertEqual(entered.flags, closed.flags)
        XCTAssertEqual(entered.technologies, closed.technologies)
        XCTAssertEqual(entered.generation, closed.generation)
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
        XCTAssertEqual(inventory.recurring, 27)
        // Another recurring roads crisis (caravan_bandits) still covers the category.
        XCTAssertTrue(inventory.recurringCategories.contains("roads"))
        XCTAssertEqual(inventory.recurring + inventory.conclusions + inventory.bridges, 43)
        // The closed crisis and the one legal reform count only toward the total.
        XCTAssertEqual(inventory.total, 45)
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

    func testDiagnosticOpeningIsACopyAndNeverChangesBundledContent() throws {
        let bundled = try ContentDatabase.bundled()
        let opened = bundled.diagnosticallyOpened(era: 4)
        XCTAssertFalse(bundled.eraContentReady(4))
        XCTAssertEqual(bundled.eras.first { $0.id == 4 }?.contentGate?.enabled, false)
        XCTAssertTrue(opened.eraContentReady(4))
        XCTAssertFalse(opened.eraContentReady(5), "Era 5 has no authored cards")
        XCTAssertEqual(bundled.playableCards.count, 180)
        XCTAssertEqual(opened.playableCards.count, 225)
        // Eras without a gate are returned unchanged.
        XCTAssertEqual(bundled.diagnosticallyOpened(era: 2).eras.map { $0.contentGate }, bundled.eras.map { $0.contentGate })
        let e = GameEngine(content: opened)
        XCTAssertEqual(try e.choose("toll", in: readyBronze(e)).era, 4)
        XCTAssertEqual(try GameEngine(content: bundled).choose("toll", in: readyBronze(e)).era, 3)
    }

    func testCivilLawReformIsConditionalCostlyAndCannotOpenEraFive() throws {
        let e = GameEngine(content: try ContentDatabase.bundled().diagnosticallyOpened(era: 4))
        var s = e.start(seed: 210)
        s.era = 4
        s.stats = ["population": 60, "resources": 60, "authority": 60, "knowledge": 85, "stability": 70, "environment": 60]
        s.technologies.formUnion(["hearth", "cultivation", "smelting", "writing"])
        s.flags.insert("lawful_review_precedent")
        s.currentCardID = "civil_code_draft"
        let card = try XCTUnwrap(e.content.card("civil_code_draft"))
        XCTAssertTrue(card.requirements.allSatisfy { $0.matches(s) })
        var unprecedented = s; unprecedented.flags.remove("lawful_review_precedent")
        XCTAssertFalse(card.requirements.allSatisfy { $0.matches(unprecedented) }, "No written precedent, no reform")
        var poor = s; poor.stats["resources"] = 8
        XCTAssertFalse(card.choices.first { $0.id == "codify" }!.available(in: poor))
        XCTAssertFalse(card.choices.first { $0.id == "privileged" }!.available(in: poor))
        let deferred = try e.choose("defer", in: s)
        XCTAssertFalse(deferred.technologies.contains("civil_law"))
        XCTAssertFalse(card.exclusionConditions.contains { $0.matches(deferred) }, "Deferring keeps the reform available")
        let adopted = try e.choose("codify", in: s)
        XCTAssertTrue(adopted.technologies.contains("civil_law"))
        XCTAssertLessThan(adopted.stats["resources", default: 0], 60, "Drafting the code is paid for")
        XCTAssertEqual(adopted.era, 4, "Era 5 has no content, so civil_law alone cannot open it")
        XCTAssertTrue(card.exclusionConditions.contains { $0.matches(adopted) })
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

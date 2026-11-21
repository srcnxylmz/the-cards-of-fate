import XCTest
@testable import FateCore

/// The 225 → 240 package on the real engine: bounded storage, slow demographic recovery, institutional
/// legitimacy, the measured rebalance and the new governance events. Era 4 is reached only by fixture.
final class EmpireGovernanceTests: XCTestCase {
    private func engine() throws -> GameEngine { GameEngine(content: try .bundled()) }
    private func fixture(_ id: String, _ e: GameEngine, era: Int = 4) -> GameState {
        var s = e.start(seed: 240)
        s.era = era
        s.stats = ["population": 50, "resources": 30, "authority": 50, "knowledge": 60, "stability": 50, "environment": 50]
        s.technologies = ["hearth", "cultivation", "smelting", "writing"]
        s.buildings = ["granary", "work_calendar"]
        s.currentCardID = id
        return s
    }

    func testSurplusIsStoredOnlyWithARecordOnePerTurnBelowTheCeilingAndOnlyInEraFour() throws {
        let e = try engine()
        var s = fixture("tax_deferral", e)
        s.flags = ["estate_fields_worked", "canal_fields_open", "harbor_fishery_licensed"]
        XCTAssertEqual(e.foodBudget(in: s).production, e.content.balance.resourceConsumption)
        XCTAssertEqual(e.foodBudget(in: s).stored, 0, "Surplus without a storage record rots")
        s.flags.insert("granary_register_kept")
        XCTAssertEqual(e.foodBudget(in: s).stored, 1, "At most one share per turn")
        s.stats["resources"] = 40
        XCTAssertEqual(e.foodBudget(in: s).stored, 0, "Never past the reserve ceiling")
        s.stats["resources"] = 30
        XCTAssertEqual(e.foodBudget(in: s, unfundedResources: 3).stored, 0, "Unpaid outlays eat the surplus first")
        var bronze = s; bronze.era = 3
        XCTAssertEqual(e.foodBudget(in: bronze).stored, 0, "No accumulation rule before Era 4")
        var thin = s; thin.flags = ["granary_register_kept"]; thin.buildings = []
        XCTAssertEqual(e.foodBudget(in: thin).stored, 0, "Nothing to store without real surplus capacity")
    }

    func testFedStableProvincesRegainHouseholdsSlowlyAndOnlyInEraFour() throws {
        let e = try engine()
        let rule = try XCTUnwrap(e.content.balance.provincialGrowth)
        var s = fixture("tax_deferral", e)
        s.flags = ["estate_fields_worked", "harbor_fishery_licensed"]
        s.turn = rule.interval - 1
        let grown = try e.choose("collect", in: s)
        XCTAssertEqual(grown.stats["population"], 51, "One household on the interval turn")
        XCTAssertTrue(grown.history.contains { $0.text.en.contains("New households settled") })
        var offBeat = s; offBeat.turn = rule.interval
        XCTAssertEqual(try e.choose("collect", in: offBeat).stats["population"], 50, "Only on interval turns")
        var unrest = s; unrest.stats["stability"] = rule.minimumStability + 3
        XCTAssertEqual(try e.choose("collect", in: unrest).stats["population"], 50, "Unrest blocks growth (collect costs stability)")
        var hungry = s; hungry.flags = []; hungry.buildings = []
        XCTAssertEqual(try e.choose("collect", in: hungry).stats["population"], 50, "A province living off reserves does not grow")
        var full = s; full.stats["population"] = rule.populationCeiling
        XCTAssertEqual(try e.choose("collect", in: full).stats["population"], rule.populationCeiling, "Never past the ceiling")
        var bronze = s; bronze.era = 3; bronze.currentCardID = e.content.cards.first { $0.era == 3 && $0.requirements.isEmpty && $0.choices.allSatisfy { $0.requirements.isEmpty } }?.id
        let card = try XCTUnwrap(e.content.card(bronze.currentCardID))
        let after = try e.choose(card.choices[0].id, in: bronze)
        XCTAssertFalse(after.history.contains { $0.text.en.contains("New households settled") }, "No growth rule before Era 4")
    }

    func testSharedInstitutionsLendBoundedLegitimacyOnlyInEraFour() throws {
        let e = try engine()
        let rule = try XCTUnwrap(e.content.politics.institutionDefense)
        var s = fixture("assembly_power_share", e)
        let base = e.councilDefense(s)
        s.flags.insert("provincial_assembly_seats")
        XCTAssertEqual(e.councilDefense(s), base + rule.defensePerFlag)
        s.flags.formUnion(rule.flags)
        XCTAssertEqual(e.councilDefense(s), base + rule.maximumDefense, "Bounded")
        var bronze = s; bronze.era = 3
        XCTAssertEqual(e.councilDefense(bronze), e.councilDefense({ var b = bronze; b.flags.subtract(rule.flags); return b }()), "No institutional defense before Era 4")
        // Sharing power is paid for in authority.
        let shared = try e.choose("seats", in: fixture("assembly_power_share", e))
        XCTAssertLessThan(shared.stats["authority", default: 0], 50)
        XCTAssertTrue(shared.flags.contains("provincial_assembly_seats"))
    }

    func testRebalancedDecisionsKeepTheirIdentitiesAndStillCost() throws {
        let e = try engine()
        var s = fixture("quarry_collapse", e)
        let pushed = try e.choose("push", in: s)
        XCTAssertTrue(pushed.flags.contains("recorded_provincial_dissent"))
        XCTAssertTrue(pushed.delayed.contains { $0.effect.stats["resources", default: 0] < 0 }, "The cracked face costs later output")
        s = fixture("garrison_supply", e)
        let seized = try e.choose("requisition", in: s)
        XCTAssertTrue(seized.flags.contains("recorded_provincial_dissent"))
        XCTAssertTrue(seized.delayed.contains { $0.effect.stats["resources", default: 0] < 0 }, "Requisitioned seed costs the next harvest")
        XCTAssertEqual(try e.choose("requisition", in: s), try e.choose("requisition", in: JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(s))), "Replay after reload")
    }

    func testTaxDeferralFallsDueOnceAndCannotStack() throws {
        let e = try engine()
        let s = fixture("tax_deferral", e)
        let deferred = try e.choose("defer", in: s)
        XCTAssertTrue(deferred.flags.contains("provincial_tax_deferred"))
        XCTAssertFalse(e.content.card("tax_deferral")!.choices.first { $0.id == "defer" }!.available(in: deferred))
        let due = try XCTUnwrap(deferred.delayed.first { $0.effect.removeFlags?.contains("provincial_tax_deferred") == true })
        XCTAssertEqual(due.effect.stats["resources"], -5)
        var later = deferred; later.resolution = nil; later.turn = due.dueTurn - 1; later.currentCardID = "tax_deferral"; later.stats["resources"] = 30
        later.flags.remove("provincial_tax_deferred"); later.flags.insert("provincial_tax_deferred")
        let paid = try e.choose("collect", in: later)
        XCTAssertFalse(paid.flags.contains("provincial_tax_deferred"), "The deferral closes when it falls due")
    }

    func testEveryNewRecurringEventStaysDrawableAtZeroReserve() throws {
        let e = try engine()
        let recurring = e.content.cards[225..<240].filter { $0.eraRole == "recurring" }
        XCTAssertEqual(recurring.count, 9)
        for event in recurring {
            for flags: Set<String> in [[], ["estate_fields_worked", "harbor_fishery_licensed", "recorded_provincial_dissent", "guest_citizenship", "public_care_settlement"], ["garrison_pay_arrears", "debased_coinage", "provincial_tax_deferred", "river_customs_farmed"]] {
                var s = fixture(event.id, e)
                s.stats["resources"] = 0; s.stats["stability"] = 8; s.stats["authority"] = 5
                s.flags = flags
                guard event.requirements.allSatisfy({ $0.matches(s) }) else { continue }
                let open = event.choices.filter { $0.available(in: s) }
                XCTAssertGreaterThanOrEqual(open.count, 2, "\(event.id) locks at zero reserve with \(flags.sorted())")
                for choice in open { _ = try e.choose(choice.id, in: s) }
            }
        }
    }

    func testNormalPlayIsUnchangedByThe240Package() throws {
        // The 225 deck without any 240 rule or rebalance must replay the first three eras identically.
        let current = try ContentDatabase.bundled()
        var previous = current
        previous.cards = Array(current.cards.prefix(225))
        previous.balance.provincialStorage = nil
        previous.balance.provincialGrowth = nil
        previous.politics.institutionDefense = nil
        previous.balance.provincialFamineRelief = nil
        let now = GameEngine(content: current), then = GameEngine(content: previous)
        for seed in UInt64(40)..<52 {
            var a = now.start(seed: seed), b = then.start(seed: seed)
            for _ in 0..<160 {
                XCTAssertEqual(a, b, "seed \(seed) turn \(a.turn)")
                guard a.ending == nil, let card = current.card(a.currentCardID) else { break }
                XCTAssertLessThanOrEqual(card.era, 3)
                let choice = card.choices.filter { $0.available(in: a) }.min { $0.id < $1.id }!
                a = now.acknowledge(try now.choose(choice.id, in: a))
                b = then.acknowledge(try then.choose(choice.id, in: b))
            }
        }
        XCTAssertFalse(current.eraContentReady(4))
        XCTAssertFalse(current.eraContentReady(5))
    }
}

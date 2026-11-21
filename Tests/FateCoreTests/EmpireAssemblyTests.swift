import XCTest
@testable import FateCore

/// The 240 → 255 package on the real engine: one-time famine relief from a sealed store, slow faction
/// reconciliation through institutions (never past neutrality) and the new assembly events.
/// Era 4 is reached only by fixture; normal play cannot enter it while the gate is closed.
final class EmpireAssemblyTests: XCTestCase {
    private func engine() throws -> GameEngine { GameEngine(content: try .bundled()) }
    private func fixture(_ id: String, _ e: GameEngine, era: Int = 4) -> GameState {
        var s = e.start(seed: 255)
        s.era = era
        s.stats = ["population": 50, "resources": 30, "authority": 50, "knowledge": 60, "stability": 50, "environment": 50]
        s.technologies = ["hearth", "cultivation", "smelting", "writing"]
        s.buildings = []
        s.currentCardID = id
        return s
    }

    func testSealedStoreRelievesOneFamineThenIsEmptyAndOnlyInEraFour() throws {
        let e = try engine()
        var s = fixture("legitimacy_oath", e)
        s.stats["resources"] = 0
        s.flags = ["grain_famine_store"]
        let hungry = e.foodBudget(in: s)
        XCTAssertGreaterThan(hungry.relieved, 0, "Cultivation alone leaves a gap the store covers")
        XCTAssertEqual(hungry.shortfall, 0)
        let after = try e.choose("law", in: s)
        XCTAssertFalse(after.flags.contains("grain_famine_store"), "The store is empty after one relief")
        XCTAssertEqual(after.stats["population"], 50, "No starvation loss on the relieved turn")
        XCTAssertTrue(after.history.contains { $0.text.en.contains("public store was opened") })
        var again = after; again.resolution = nil; again.currentCardID = "legitimacy_oath"
        let second = try e.choose("law", in: again)
        XCTAssertLessThan(second.stats["population", default: 0], 50, "Without a store, hunger strikes")
        var bronze = s; bronze.era = 3
        XCTAssertEqual(e.foodBudget(in: bronze).relieved, 0, "No relief rule before Era 4")
        var fed = s; fed.stats["resources"] = 30
        XCTAssertEqual(e.foodBudget(in: fed).relieved, 0, "Reserves are eaten first; the store stays sealed")
    }

    func testInstitutionsReconcileHostileFactionsSlowlyAndNeverPastNeutrality() throws {
        let e = try engine()
        let rule = try XCTUnwrap(e.content.politics.institutionDefense)
        let ceiling = try XCTUnwrap(rule.reconciliationCeiling)
        XCTAssertLessThan(ceiling, e.content.politics.neutralRelation)
        var s = fixture("legitimacy_oath", e)
        s.flags = ["provincial_assembly_seats", "garrison_civil_oversight"]
        s.turn = e.content.politics.meetingInterval - 1
        for i in s.rivals.indices { s.rivals[i].relation = -40 }
        s.rivals[0].relation = ceiling + 10
        let met = try e.choose("law", in: s)
        XCTAssertEqual(met.rivals[1].relation, -40 + 2 * (rule.reconciliationPerFlag ?? 0), "One step per institution at a meeting")
        XCTAssertEqual(met.rivals[0].relation, ceiling + 10, "Friendlier factions are not pushed down or up")
        var offBeat = s; offBeat.turn = e.content.politics.meetingInterval
        XCTAssertEqual(try e.choose("law", in: offBeat).rivals[1].relation, -40, "Only at council meetings")
        var none = s; none.flags = []
        XCTAssertEqual(try e.choose("law", in: none).rivals[1].relation, -40, "No institutions, no reconciliation")
        var near = s; near.rivals[1].relation = ceiling - 1
        XCTAssertEqual(try e.choose("law", in: near).rivals[1].relation, ceiling, "Capped below neutrality")
        var bronze = s; bronze.era = 3; bronze.currentCardID = e.content.cards.first { $0.era == 3 && $0.requirements.isEmpty && $0.choices.allSatisfy { $0.requirements.isEmpty } }?.id
        let card = try XCTUnwrap(e.content.card(bronze.currentCardID))
        var control = bronze; control.flags = []
        XCTAssertEqual(try e.choose(card.choices[0].id, in: bronze).rivals.map(\.relation),
                       try e.choose(card.choices[0].id, in: control).rivals.map(\.relation), "No reconciliation before Era 4")
    }

    func testPactLoanFallsDueOnceAndCannotStack() throws {
        let e = try engine()
        var s = fixture("grain_pact", e); s.stats["resources"] = 0
        let borrowed = try e.choose("borrow", in: s)
        XCTAssertTrue(borrowed.flags.contains("regional_grain_loan"))
        XCTAssertFalse(e.content.card("grain_pact")!.choices.first { $0.id == "borrow" }!.available(in: borrowed))
        let due = try XCTUnwrap(borrowed.delayed.first { $0.effect.removeFlags?.contains("regional_grain_loan") == true })
        XCTAssertEqual(due.effect.stats["resources"], -4)
        var later = borrowed; later.resolution = nil; later.turn = due.dueTurn - 1; later.currentCardID = "legitimacy_oath"
        XCTAssertFalse(try e.choose("law", in: later).flags.contains("regional_grain_loan"), "The pact loan closes when it falls due")
    }

    func testEveryNewRecurringEventStaysDrawableAtZeroReserveAndReplays() throws {
        let e = try engine()
        let recurring = e.content.cards[240..<255].filter { $0.eraRole == "recurring" }
        XCTAssertEqual(recurring.count, 9)
        for event in recurring {
            for flags: Set<String> in [[], ["estate_fields_worked", "grain_famine_store", "provincial_assembly_seats", "watch_guild_public", "public_archive", "provincial_residency_hearing"], ["regional_grain_loan", "recorded_provincial_dissent", "garrison_pay_arrears"]] {
                var s = fixture(event.id, e)
                s.stats["resources"] = 0; s.stats["stability"] = 8; s.stats["authority"] = 5; s.stats["population"] = 22
                s.flags = flags
                guard event.requirements.allSatisfy({ $0.matches(s) }) else { continue }
                let open = event.choices.filter { $0.available(in: s) }
                XCTAssertGreaterThanOrEqual(open.count, 2, "\(event.id) locks with \(flags.sorted())")
                for choice in open {
                    XCTAssertEqual(try e.choose(choice.id, in: s), try e.choose(choice.id, in: JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(s))), "\(event.id).\(choice.id) replays after reload")
                }
            }
        }
    }

    func testNeglectedTerracesWashEstateCapacityAway() throws {
        let e = try engine()
        var s = fixture("terrace_upkeep", e); s.flags = ["estate_fields_worked"]
        let deferred = try e.choose("defer", in: s)
        XCTAssertTrue(deferred.flags.contains("estate_fields_worked"), "Neglect is not immediate")
        let flood = try XCTUnwrap(deferred.delayed.first { $0.effect.removeFlags?.contains("estate_fields_worked") == true })
        var later = deferred; later.resolution = nil; later.turn = flood.dueTurn - 1; later.currentCardID = "legitimacy_oath"
        XCTAssertFalse(try e.choose("law", in: later).flags.contains("estate_fields_worked"), "Unmaintained terraces lose the estate fields")
    }

    func testNormalPlayIsUnchangedByThe255Package() throws {
        let current = try ContentDatabase.bundled()
        var previous = current
        previous.cards = Array(current.cards.prefix(240))
        previous.balance.provincialFamineRelief = nil
        previous.politics.institutionDefense?.reconciliationPerFlag = nil
        previous.politics.institutionDefense?.reconciliationCeiling = nil
        let now = GameEngine(content: current), then = GameEngine(content: previous)
        for seed in UInt64(55)..<67 {
            var a = now.start(seed: seed), b = then.start(seed: seed)
            for _ in 0..<160 {
                XCTAssertEqual(a, b, "seed \(seed) turn \(a.turn)")
                guard a.ending == nil, let card = current.card(a.currentCardID) else { break }
                XCTAssertLessThanOrEqual(card.era, 3)
                let choice = card.choices.filter { $0.available(in: a) }.max { $0.id < $1.id }!
                a = now.acknowledge(try now.choose(choice.id, in: a))
                b = then.acknowledge(try then.choose(choice.id, in: b))
            }
        }
        XCTAssertFalse(current.eraContentReady(4))
        XCTAssertFalse(current.eraContentReady(5))
    }
}

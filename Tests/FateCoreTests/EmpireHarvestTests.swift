import XCTest
@testable import FateCore

/// The 210 → 225 Ancient Empires food and production loop, measured on the real engine.
/// Era 4 fixtures are constructed directly: normal play cannot reach Era 4 while the gate is closed.
final class EmpireHarvestTests: XCTestCase {
    private func engine() throws -> GameEngine { GameEngine(content: try .bundled()) }
    private func fixture(_ id: String, _ e: GameEngine, era: Int = 4) -> GameState {
        var s = e.start(seed: 225)
        s.era = era
        s.stats = ["population": 50, "resources": 60, "authority": 50, "knowledge": 60, "stability": 50, "environment": 50]
        s.technologies = ["hearth", "cultivation", "smelting", "writing"]
        s.buildings = []
        s.currentCardID = id
        return s
    }
    /// Plays a filler decision so scheduled consequences come due, without touching the flags under test.
    private func advance(_ s: GameState, to turn: Int, _ e: GameEngine) throws -> GameState {
        var state = s
        state.resolution = nil
        state.turn = turn - 1
        state.currentCardID = "plague_quarantine"
        state.stats["resources"] = 60
        return try e.choose("quarantine", in: state)
    }
    private func card(_ id: String, _ e: GameEngine) throws -> CardEvent { try XCTUnwrap(e.content.card(id)) }

    func testProvincialCapacityFeedsOnlyInEraFourWithHandsAndALivingLand() throws {
        let e = try engine()
        var s = fixture("provincial_estates", e)
        s.stats["environment"] = 20
        XCTAssertEqual(e.foodBudget(in: s).production, 2, "Cultivation alone: two shares of four")
        s.flags.insert("estate_fields_worked")
        XCTAssertEqual(e.foodBudget(in: s).production, 3)
        s.stats["population"] = 15
        XCTAssertEqual(e.foodBudget(in: s).production, 2, "Abandoned estates need hands")
        s.stats["population"] = 50
        s.flags.insert("canal_fields_open")
        XCTAssertEqual(e.foodBudget(in: s).production, 3, "A canal on ruined land waters nothing")
        s.stats["environment"] = 40
        XCTAssertEqual(e.foodBudget(in: s).production, 4)
        s.flags.formUnion(["harbor_fishery_licensed", "granary_register_kept"]); s.buildings = ["granary", "work_calendar"]
        XCTAssertEqual(e.foodBudget(in: s).production, e.content.balance.resourceConsumption, "Capacity ends hunger but never prints reserves")
        var bronze = fixture("provincial_estates", e, era: 3)
        bronze.stats["environment"] = 20
        bronze.flags = ["estate_fields_worked", "canal_fields_open", "harbor_fishery_licensed", "granary_register_kept"]
        XCTAssertEqual(e.foodBudget(in: bronze).production, 2, "Provincial capacities never feed an earlier era")
    }

    func testPaidEstateInvestmentCostsLabourAndReserveAndReturnsLaterAndLess() throws {
        let e = try engine()
        let s = fixture("provincial_estates", e)
        var afterCard: GameState?
        let result = try e.choose("clear", in: s) { stage, snapshot in if stage == "card" { afterCard = snapshot } }
        let paid = try XCTUnwrap(afterCard)
        XCTAssertEqual(paid.stats["resources"], 50, "Ten paid up front")
        XCTAssertEqual(paid.stats["population"], 48, "Families leave the town for the estates")
        XCTAssertTrue(result.flags.contains("estate_fields_worked"))
        let harvest = try XCTUnwrap(result.delayed.first { $0.effect.stats["resources", default: 0] > 0 })
        XCTAssertEqual(harvest.dueTurn, s.turn + 1 + 5)
        XCTAssertLessThan(harvest.effect.stats["resources", default: 0], 10)
        var poor = s; poor.stats["resources"] = 9
        XCTAssertFalse(try card("provincial_estates", e).choices.first { $0.id == "clear" }!.available(in: poor))
        var few = s; few.stats["population"] = 25
        XCTAssertFalse(try card("provincial_estates", e).choices.first { $0.id == "clear" }!.available(in: few), "No settlers, no estate")
    }

    func testZeroReserveLeavesEveryNewRecurringEventDrawableWithRealChoices() throws {
        let e = try engine()
        let recurring = e.content.cards.suffix(15).filter { $0.eraRole == "recurring" }
        XCTAssertEqual(recurring.count, 11)
        for event in recurring {
            for flags: Set<String> in [[], ["estate_fields_worked", "canal_fields_open", "harbor_fishery_licensed", "granary_register_kept", "grain_famine_store"], ["garrison_pay_arrears", "debased_coinage", "temple_grain_loan", "grain_price_ceiling", "river_customs_farmed"]] {
                var s = fixture(event.id, e)
                s.stats["resources"] = 0; s.stats["stability"] = 8; s.stats["population"] = 22
                s.flags = flags
                guard event.requirements.allSatisfy({ $0.matches(s) }) else { continue }
                let open = event.choices.filter { $0.available(in: s) }
                XCTAssertGreaterThanOrEqual(open.count, 2, "\(event.id) locks at zero reserve with \(flags.sorted())")
                for choice in open {
                    let result = try e.choose(choice.id, in: s)
                    XCTAssertEqual(result, try e.choose(choice.id, in: JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(s))), "\(event.id).\(choice.id) replays after reload")
                }
            }
        }
    }

    func testTempleLoanCannotStackAndRepaysMeasureForMeasure() throws {
        let e = try engine()
        var s = fixture("famine_store_release", e)
        s.stats["resources"] = 0
        let borrowed = try e.choose("temple", in: s)
        XCTAssertTrue(borrowed.flags.contains("temple_grain_loan"))
        let temple = try card("famine_store_release", e).choices.first { $0.id == "temple" }!
        XCTAssertFalse(temple.available(in: borrowed), "One loan at a time")
        let due = try XCTUnwrap(borrowed.delayed.first { $0.effect.removeFlags?.contains("temple_grain_loan") == true })
        XCTAssertEqual(due.effect.stats["resources"], -4)
        let repaid = try advance(borrowed, to: due.dueTurn, e)
        XCTAssertFalse(repaid.flags.contains("temple_grain_loan"), "Repaid loans close")
        XCTAssertTrue(repaid.history.contains { $0.text == due.text })
    }

    func testDeferredDredgingSiltsTheCanalAndADroughtDiversionLastsOneSeason() throws {
        let e = try engine()
        var s = fixture("canal_extension", e)
        s.flags.insert("canal_fields_open")
        let deferred = try e.choose("spare", in: s)
        XCTAssertTrue(deferred.flags.contains("canal_fields_open"), "Neglect is not immediate")
        let silt = try XCTUnwrap(deferred.delayed.first { $0.effect.removeFlags?.contains("canal_fields_open") == true })
        XCTAssertFalse(try advance(deferred, to: silt.dueTurn, e).flags.contains("canal_fields_open"), "Unmaintained capacity declines")

        var dry = fixture("drought_year", e)
        dry.flags.insert("canal_fields_open")
        let diverted = try e.choose("city_first", in: dry)
        XCTAssertFalse(diverted.flags.contains("canal_fields_open"))
        let rain = try XCTUnwrap(diverted.delayed.first { $0.effect.flags.contains("canal_fields_open") })
        XCTAssertTrue(try advance(diverted, to: rain.dueTurn, e).flags.contains("canal_fields_open"), "The canal returns after one dry season")
        var noCanal = fixture("canal_extension", e)
        noCanal.stats["resources"] = 0
        let shared = try e.choose("spare", in: noCanal)
        XCTAssertTrue(shared.flags.isSuperset(of: ["canal_fields_open", "canal_shared_with_villages"]), "A negotiated ditch builds capacity at a political price")
        XCTAssertLessThan(shared.stats["authority", default: 0], 50)
    }

    func testWageArrearsCloseOnlyByPaymentAndPaidArrearsStayClosed() throws {
        let e = try engine()
        var s = fixture("grain_convoy", e)
        s.flags.insert("garrison_pay_arrears")
        let soldiers = try card("grain_convoy", e).choices.first { $0.id == "soldiers" }!
        var poor = s; poor.stats["resources"] = 4
        XCTAssertFalse(soldiers.available(in: poor))
        var afterCard: GameState?
        let paid = try e.choose("soldiers", in: s) { stage, snapshot in if stage == "card" { afterCard = snapshot } }
        XCTAssertFalse(paid.flags.contains("garrison_pay_arrears"))
        XCTAssertEqual(afterCard?.stats["resources"], 55)
        // Without arrears the same choice never opens a debt.
        var clean = paid; clean.resolution = nil; clean.currentCardID = "grain_convoy"; clean.stats["resources"] = 60
        XCTAssertFalse(try e.choose("soldiers", in: clean).flags.contains("garrison_pay_arrears"))
        // The famine store and the price ceiling stay mutually exclusive.
        var ceiling = fixture("famine_store_release", e); ceiling.flags.insert("grain_price_ceiling")
        let restocked = try e.choose("restock", in: ceiling)
        XCTAssertTrue(restocked.flags.contains("grain_famine_store"))
        XCTAssertFalse(restocked.flags.contains("grain_price_ceiling"))
    }

    func testNewConclusionsNeedTheBronzeRecordAndTheImperialCrisis() throws {
        let e = try engine()
        for (id, bronze, imperial) in [("quarry_stone_granary", "quarry_arbitration", "quarry_collapse"), ("furnace_fire_law", "furnace_coop", "insula_fire")] {
            let event = try card(id, e)
            var s = fixture(id, e)
            func complete(_ card: String) {
                s.history.append(.init(id: s.history.count, turn: s.turn, era: e.content.card(card)!.era, cardID: card, choiceID: e.content.card(card)!.choices[0].id, text: .init(tr: "Kayıt", en: "Record")))
            }
            complete(bronze)
            XCTAssertFalse(event.requirements.allSatisfy { $0.matches(s) }, "\(id) needs the imperial crisis too")
            complete(imperial)
            XCTAssertTrue(event.requirements.allSatisfy { $0.matches(s) })
        }
    }

    func testNormalPlayIsUnchangedByTheClosedEraFourPackage() throws {
        // The 210-card deck without production capacities must replay the first three eras identically.
        let current = try ContentDatabase.bundled()
        var previous = current
        previous.cards = Array(current.cards.prefix(210))
        previous.balance.provincialProduction = nil
        let now = GameEngine(content: current), then = GameEngine(content: previous)
        for seed in UInt64(0)..<12 {
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
    }
}

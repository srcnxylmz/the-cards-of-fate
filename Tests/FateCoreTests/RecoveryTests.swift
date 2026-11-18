import XCTest
@testable import FateCore

final class RecoveryTests: XCTestCase {
    private let ids = ["salmon_weir", "windbreak_camp", "flint_fragments", "winter_speaker", "ash_return", "seed_escrow", "reed_bank", "canal_widows", "potter_lease", "field_recovery", "harbor_dredge", "copper_recast", "ration_council", "levy_hearing", "roof_cistern"]
    private func engine() throws -> GameEngine { GameEngine(content: try .bundled()) }
    private func fixture(_ id: String, _ e: GameEngine, seed: UInt64 = 71) -> GameState {
        var s = e.start(seed: seed)
        s.currentCardID = id; s.era = e.content.card(id)!.era
        s.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 60) })
        return s
    }
    private func roundtrip(_ s: GameState) throws -> GameState { try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(s)) }
    private func advance(_ turns: Int, _ original: GameState, _ e: GameEngine, era: Int) throws -> GameState {
        var s = original; s.era = era
        for _ in 0..<turns {
            s = e.acknowledge(s); s.currentCardID = "ochre_border"
            s.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 60) })
            let choice = e.content.card("ochre_border")!.choices.first { $0.available(in: s) }!
            s = try e.choose(choice.id, in: s)
        }
        return s
    }
    private func draw(_ id: String, _ original: GameState, _ e: GameEngine) -> GameState {
        var s = original; s.era = e.content.card(id)!.era
        s.discovered = Set(e.content.cards.map(\.id).filter { $0 != id }); s.lastSeen[id] = -10000
        let drawn = e.acknowledge(s)
        XCTAssertEqual(drawn.currentCardID, id, "Story conditions must be respected by the real selector")
        return drawn
    }
    // Predicate fixtures isolate each optional choice. Separate tests below create the
    // corresponding history and scheduled flags through actual earlier decisions.
    private func satisfy(_ conditions: [Condition], _ s: inout GameState) {
        for c in conditions {
            if let stat = c.stat {
                if let min = c.minimum { s.stats[stat.rawValue] = max(s.stats[stat.rawValue]!, min) }
                if let max = c.maximum { s.stats[stat.rawValue] = min(s.stats[stat.rawValue]!, max) }
            }
            if let flag = c.flag { s.flags.insert(flag) }
            if let tech = c.technology { s.technologies.insert(tech) }
            if let reference = c.lastDecision {
                let parts = reference.split(separator: ".").map(String.init)
                s.history.append(.init(id: s.history.count, turn: s.turn, era: s.era, cardID: parts[0], choiceID: parts[1], text: .init(tr: "Test", en: "Test")))
            }
        }
    }
    func testAllFifteenEventsAndEveryChoiceAreSelectableAndReplayable() throws {
        let e = try engine()
        XCTAssertEqual(e.content.cards.count,165)
        XCTAssertEqual(Set(e.content.cards.map(\.id)).count, 165)
        for era in 1...3 { XCTAssertEqual(e.content.cards.filter { $0.era == era }.count,55) }
        for id in ids {
            let card = e.content.card(id)!
            for choice in card.choices {
                var s = fixture(id, e); satisfy(card.requirements + choice.requirements, &s)
                XCTAssertFalse(card.exclusionConditions.contains { $0.matches(s) }, id)
                XCTAssertTrue(choice.available(in: s), id + "." + choice.id)
                s = draw(id, s, e)
                XCTAssertTrue(choice.available(in: s))
                let result = try e.choose(choice.id, in: s)
                XCTAssertEqual(result, try e.choose(choice.id, in: roundtrip(s)))
                XCTAssertGreaterThan(result.delayed.count, s.delayed.count, id)
                XCTAssertTrue(result.stats.values.allSatisfy { (0...100).contains($0) })
                if card.exclusionConditions.contains(where: { $0.flag == "resolved_" + id }) {
                    XCTAssertTrue(card.exclusionConditions.contains { $0.matches(result) })
                }
            }
        }
    }
    func testRepairStockSurvivesEraDelayAndUnlocksOnlySharedBranch() throws {
        let e = try engine()
        let common = e.content.card("potter_lease")!.choices.first { $0.id == "commons" }!
        for choice in ["stock", "barter"] {
            let result = try e.choose(choice, in: fixture("flint_fragments", e))
            XCTAssertFalse(result.flags.contains("repair_right"))
            let early = try advance(5, result, e, era: 1)
            XCTAssertFalse(early.flags.contains("repair_right"), "A due consequence must still wait for its era")
            let later = try roundtrip(advance(1, early, e, era: 2))
            XCTAssertTrue(later.flags.contains("repair_right"))
            let kiln = draw("potter_lease", later, e)
            XCTAssertEqual(common.available(in: kiln), choice == "stock")
            let metal = try e.choose(choice == "stock" ? "commons" : "trial", in: kiln)
            XCTAssertTrue(metal.technologies.contains("smelting"))
        }
        let repaired = try e.choose("repair", in: fixture("kiln_crack", e))
        let leased = draw("potter_lease", repaired, e)
        XCTAssertTrue(e.content.card("potter_lease")!.choices.first { $0.id == "repairers" }!.available(in: leased))
        XCTAssertTrue(try e.choose("repairers", in: leased).technologies.contains("smelting"))
    }
    func testFishPassageBecomesDifferentCityWaterPractices() throws {
        let e = try engine()
        let opened = try e.choose("open", in: fixture("salmon_weir", e))
        let closed = try e.choose("close", in: fixture("salmon_weir", e))
        let bank = e.content.card("reed_bank")!
        XCTAssertFalse(bank.requirements.allSatisfy { $0.matches(closed) })
        let village = draw("reed_bank", opened, e)
        for choice in ["buffer", "build"] {
            let result = try e.choose(choice, in: village)
            let later = try advance(5, result, e, era: 3)
            XCTAssertTrue(later.flags.contains("reed_water_memory"))
            var cistern = later; cistern.stats["environment"] = 60
            cistern = draw("roof_cistern", try roundtrip(cistern), e)
            let inherited = e.content.card("roof_cistern")!.choices.first { $0.id == "reeds" }!
            XCTAssertEqual(inherited.available(in: cistern), choice == "buffer")
            if inherited.available(in: cistern) { XCTAssertTrue(try e.choose("reeds", in: cistern).flags.contains("inherited_cistern_practice")) }
        }
    }
    func testLaborDebtAndWinterWitnessesCreateDistinctCityPrecedents() throws {
        let e = try engine()
        let council = try e.choose("hear", in: fixture("council_shelter", e))
        let winter = draw("winter_speaker", council, e)
        let witnesses = try e.choose("witness", in: winter)
        let elders = try e.choose("elder", in: winter)
        let hearing = e.content.card("canal_widows")!
        for choice in ["pay", "assign", "witness"] {
            var canal = e.acknowledge(witnesses); canal.currentCardID = "silt_turn"; canal.era = 2; canal.technologies.insert("irrigation")
            canal = try e.choose("advance", in: canal)
            let village = draw("canal_widows", canal, e)
            let result = try e.choose(choice, in: village)
            let later = try roundtrip(advance(6, result, e, era: 3))
            XCTAssertTrue(later.flags.contains("canal_labor_memory"))
            let city = draw("levy_hearing", later, e)
            let precedent = e.content.card("levy_hearing")!.choices.first { $0.id == "precedent" }!
            XCTAssertEqual(precedent.available(in: city), choice != "assign")
            if precedent.available(in: city) { XCTAssertTrue(try e.choose("precedent", in: city).flags.contains("nonhereditary_city_service")) }
        }
        XCTAssertFalse(hearing.choices.first { $0.id == "witness" }!.available(in: elders))
    }
    func testEarlierSupplyStopsCharterAndSuretyUnlockRealRecoveryOptions() throws {
        let e = try engine()
        let crossed = try e.choose("cross", in: fixture("ice_crossing", e))
        let nextCrossing = draw("ice_crossing", try advance(4, crossed, e, era: 1), e)
        var cached = try e.choose("cache", in: nextCrossing); cached.stats["resources"] = 60
        let camp = draw("windbreak_camp", cached, e)
        XCTAssertTrue(try e.choose("stops", in: camp).flags.contains("shared_bank_shelter"))
        var silt = fixture("silt_turn", e); silt.technologies.insert("irrigation")
        let crew = try e.choose("crew", in: silt)
        let charter = try e.choose("joint", in: draw("silt_charter", crew, e))
        let port = draw("harbor_dredge", charter, e)
        XCTAssertTrue(try e.choose("charter", in: port).flags.contains("renewed_dredging_charter"))
        let stock = try e.choose("stock", in: fixture("flint_fragments", e))
        let village = draw("potter_lease", try advance(5, stock, e, era: 2), e)
        let metal = try e.choose("commons", in: village)
        let city = draw("copper_recast", metal, e)
        XCTAssertTrue(try e.choose("common", in: city).flags.contains("shared_recasting_tools"))
        // Older authored chain predicates are isolated here; the new credit choice must
        // receive the resulting old decision flag, rather than an invented new flag.
        var surety = fixture("surety_release", e)
        satisfy(e.content.card("surety_release")!.requirements + e.content.card("surety_release")!.choices.first { $0.id == "limit" }!.requirements, &surety)
        let limited = try e.choose("limit", in: surety)
        var shortage = limited; shortage.stats["resources"] = 30
        shortage = draw("ration_council", shortage, e)
        XCTAssertTrue(try e.choose("credit", in: shortage).flags.contains("bounded_famine_credit"))
    }
    func testBurnedGroveBranchAndReservedSeedCannotBeFreeRepeatedRelief() throws {
        let e = try engine()
        for choice in ["guard", "cut"] {
            var ash = fixture("ash_return", e); ash.flags.insert("fire_industry")
            let result = try e.choose(choice, in: ash)
            var village = try advance(5, result, e, era: 2)
            XCTAssertTrue(village.flags.contains("ash_boundary_memory"))
            village.stats["environment"] = 40; village.technologies.insert("cultivation")
            let field = draw("field_recovery", village, e)
            XCTAssertEqual(e.content.card("field_recovery")!.choices.first { $0.id == "grove" }!.available(in: field), choice == "guard")
        }
        var seed = fixture("seed_escrow", e); seed.stats["resources"] = 20
        let released = try e.choose("release", in: seed)
        let restored = try roundtrip(released)
        XCTAssertFalse(e.content.card("seed_escrow")!.choices.first { $0.id == "release" }!.available(in: restored))
        XCTAssertEqual(e.content.card("seed_escrow")!.choices.filter { $0.available(in: restored) }.count, 2)
        XCTAssertTrue(restored.delayed.contains { $0.effect.stats["resources", default: 0] < 0 })
    }
    func testFiniteHistoricalEventsRecognizeOldHistoryAndExistingFlags() throws {
        let e = try engine()
        for id in ["council_seal", "hostage_prince", "salt_ship", "flint_apprentice"] {
            let card = e.content.card(id)!
            for choice in card.choices {
                let before = fixture(id, e)
                let result = try roundtrip(e.choose(choice.id, in: before))
                XCTAssertTrue(card.exclusionConditions.contains { $0.matches(result) })
                var legacyHistory = result; legacyHistory.flags = []
                XCTAssertTrue(card.exclusionConditions.contains { $0.matches(legacyHistory) })
                XCTAssertNoThrow(try e.choose(choice.id, in: before), "An already displayed legacy card can still resolve")
                for flag in choice.outcomes.flatMap({ $0.effect.flags }) {
                    var old = before; old.flags = [flag]
                    XCTAssertTrue(card.exclusionConditions.contains { $0.matches(old) })
                }
            }
        }
    }
    func testRecastingRiskHasBothReachableOutcomesAndRequiresRealFuelAndCapital() throws {
        let e = try engine(); let card = e.content.card("copper_recast")!
        let trial = card.choices.first { $0.id == "trial" }!
        var seen: Set<String> = []
        for seed in 0..<200 {
            var s = fixture(card.id, e, seed: UInt64(seed)); s.technologies.insert("smelting")
            let result = try e.choose("trial", in: s)
            seen.formUnion(result.flags.intersection(["sound_recast", "brittle_recast"]))
        }
        XCTAssertEqual(seen, ["sound_recast", "brittle_recast"])
        var empty = fixture(card.id, e); empty.stats["resources"] = 0
        XCTAssertFalse(trial.available(in: empty))
        empty.stats["resources"] = 60; empty.stats["environment"] = 0
        XCTAssertFalse(trial.available(in: empty))
        XCTAssertFalse(e.content.card("harbor_dredge")!.choices.first { $0.id == "outer" }!.available(in: empty))
    }
    func testRecoveryUsesOnlyCurrentChoicesWithoutAdvancingRandomOrChangingSave() throws {
        let e = try engine()
        for seed in 0..<100 {
            var s = e.start(seed: UInt64(seed))
            for _ in 0..<200 {
                guard s.ending == nil, let card = e.content.card(s.currentCardID) else { break }
                let choices = card.choices.filter { $0.available(in: s) }; XCTAssertFalse(choices.isEmpty)
                let before = s, chosen = e.selectRecovery(choices, state: s)
                XCTAssertEqual(s, before)
                XCTAssertTrue(choices.contains(chosen))
                let restored = try roundtrip(s)
                XCTAssertEqual(chosen, e.selectRecovery(choices, state: restored))
                let next = try e.choose(chosen.id, in: s)
                XCTAssertEqual(next, try e.choose(chosen.id, in: restored))
                s = e.acknowledge(next)
                XCTAssertFalse(s.ending?.en.contains("no eligible events") ?? false)
            }
        }
    }
}

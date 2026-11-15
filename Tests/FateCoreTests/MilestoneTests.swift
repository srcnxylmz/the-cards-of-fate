import XCTest
@testable import FateCore

final class MilestoneTests: XCTestCase {
    private func fixture(_ id: String, _ engine: GameEngine) -> GameState {
        var s = engine.start(seed: 90)
        s.currentCardID = id; s.era = engine.content.card(id)!.era
        s.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 60) })
        return s
    }
    func testIrrigatedStoredHarvestRepaysInvestmentWithoutFreeWorldSurplus() throws {
        let e = GameEngine(content: try .bundled())
        var s = fixture("ochre_border", e)
        s.buildings.insert("granary"); s.stats["environment"] = 100
        let dry = try e.choose("symbols", in: s)
        s.technologies.insert("irrigation")
        let irrigated = try e.choose("symbols", in: s)
        XCTAssertEqual(irrigated.stats["resources"]!, dry.stats["resources"]! + 2)
        XCTAssertEqual(irrigated.stats["resources"]!, s.stats["resources"]! - 4, "Harvest may offset consumption, never yield a world surplus")
        s.stats["environment"] = 0
        let exhausted = try e.choose("symbols", in: s)
        XCTAssertEqual(exhausted.stats["resources"], dry.stats["resources"])
        s.buildings.remove("granary")
        XCTAssertLessThan(try e.choose("symbols", in: s).stats["resources"]!, exhausted.stats["resources"]!)
    }
    func testCultivationFeedsHouseholdsWithoutMakingAStorehouseMandatory() throws {
        let e=GameEngine(content:try .bundled())
        var s=fixture("ochre_border",e)
        let foragers=try e.choose("symbols",in:s)
        s.technologies.insert("cultivation")
        let households=try e.choose("symbols",in:s)
        XCTAssertEqual(households.stats["resources"]!,foragers.stats["resources"]!+e.content.balance.farmProduction)
        s.buildings.insert("granary")
        XCTAssertEqual(try e.choose("symbols",in:s).stats["resources"]!,households.stats["resources"]!+1)
        s.technologies.insert("irrigation");s.buildings.formUnion(["terrace","work_calendar"])
        XCTAssertEqual(try e.choose("symbols",in:s).stats["resources"]!,s.stats["resources"]!-4,"Stacked investment may cover food consumption, never print surplus")
        s.mode = .hard
        XCTAssertEqual(try e.choose("symbols",in:s).stats["resources"]!,s.stats["resources"]!-4-e.content.balance.hardExtraConsumption)
    }
    func testPaidSanitationUsesActualEarlierPractice() throws {
        let e = GameEngine(content: try .bundled())
        var s = fixture("reed_fever", e)
        let maintain = e.content.card("reed_fever")!.choices.first { $0.id == "maintain" }!
        XCTAssertFalse(maintain.available(in: s))
        s = try e.choose("move", in: s)
        s = e.acknowledge(s); s.currentCardID = "reed_fever"
        XCTAssertTrue(maintain.available(in: s))
        let result = try e.choose("maintain", in: s)
        XCTAssertLessThan(result.stats["resources"]!, s.stats["resources"]!)
        XCTAssertGreaterThan(result.stats["stability"]!, s.stats["stability"]!)
        XCTAssertFalse(result.delayed.isEmpty)
    }
    func testLatestDecisionRotatesRecurringChoicesAndSurvivesV1Save() throws {
        let e = GameEngine(content: try .bundled())
        for (id,old,new) in [("calving_herd","take","range"),("red_mushrooms","feast","dry"),("ice_crossing","cross","cache"),("leaking_skin","repair","relay"),("ochre_border","symbols","renew")] {
            var s = fixture(id,e)
            let c = e.content.card(id)!
            XCTAssertFalse(c.choices.first { $0.id == new }!.available(in:s))
            s = try e.choose(old,in:s)
            s = try JSONDecoder().decode(GameState.self,from:JSONEncoder().encode(s))
            s = e.acknowledge(s); s.currentCardID = id
            XCTAssertFalse(c.choices.first { $0.id == old }!.available(in:s))
            XCTAssertTrue(c.choices.first { $0.id == new }!.available(in:s))
            XCTAssertGreaterThanOrEqual(c.choices.filter { $0.available(in:s) }.count,2)
            if ["dry","cache"].contains(new) {
                let safe=c.choices.first { $0.id == new }!.outcomes[0]
                let risky=c.choices.first { $0.id == old }!.outcomes[0]
                XCTAssertLessThan(safe.effect.stats["resources",default:0],risky.effect.stats["resources",default:0])
                XCTAssertLessThan(safe.effect.stats["environment",default:0],0)
                XCTAssertTrue(safe.delayedEffects.contains { $0.effect.stats["resources",default:0]<0 })
            }
            let a = try e.choose(new,in:s)
            let b = try e.choose(new,in:JSONDecoder().decode(GameState.self,from:JSONEncoder().encode(s)))
            XCTAssertEqual(a,b)
            s = e.acknowledge(a); s.currentCardID = id
            XCTAssertTrue(c.choices.first { $0.id == old }!.available(in:s), "Seasonal options reopen after a different decision")
        }
    }

    private let newIDs = ["winter_guarantor","guest_path_watch","summer_pools","hide_rent","council_shelter","kin_repayment","guest_roofs","ditch_seed","terrace_stones","village_workdays","surety_release","harbor_residency","furnace_coop","gate_ward"]
    private func pass(_ turns: Int, era: Int, after original: GameState, _ e: GameEngine) throws -> GameState {
        var s=original
        for _ in 0..<turns {
            s=e.acknowledge(s); s.era=era; s.currentCardID="leaking_skin"
            s.stats=Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue,60) })
            s=try e.choose("boil",in:s)
        }
        return s
    }
    private func draw(_ id: String, after original: GameState, _ e: GameEngine) throws -> GameState {
        var s=original
        s.era=e.content.card(id)!.era
        s.stats=Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue,60) })
        s.discovered=Set(e.content.cards.map(\.id).filter { $0 != id })
        s.lastSeen[id] = -10000
        let drawn=e.acknowledge(s)
        XCTAssertEqual(drawn.currentCardID,id,"Actual production selector must admit the story")
        return drawn
    }
    func testOriginalMilestoneCardsRemainInExpandedDeck() throws {
        let e=GameEngine(content:try .bundled())
        XCTAssertEqual(e.content.cards.count,120)
        for era in 1...3 { XCTAssertEqual(e.content.cards.filter { $0.era == era }.count,40) }
        for id in newIDs {
            let c=try XCTUnwrap(e.content.card(id))
            XCTAssertFalse(c.artDirection.isEmpty)
            XCTAssertNotEqual(c.description.tr,c.description.en)
            for choice in c.choices {
                for o in choice.outcomes {
                    XCTAssertFalse(o.delayedEffects.isEmpty,id)
                    XCTAssertFalse(o.effect.flags.isEmpty,id)
                    if o.effect.stats["resources",default:0]>0 {
                        XCTAssertTrue(o.effect.stats.values.contains { $0<0 } || o.delayedEffects.contains { $0.effect.stats.values.contains { $0<0 } },id)
                    }
                }
                var s=fixture(id,e)
                for requirement in choice.requirements { if let flag=requirement.flag { s.flags.insert(flag) } }
                for i in s.rivals.indices { s.rivals[i].relation=60 }
                let result=try e.choose(choice.id,in:s)
                if c.exclusionConditions.contains(where: { $0.flag == "resolved_"+id }) {
                    XCTAssertTrue(c.exclusionConditions.contains { $0.matches(result) },id)
                }
                let restored=try JSONDecoder().decode(GameState.self,from:JSONEncoder().encode(s))
                XCTAssertEqual(try e.choose(choice.id,in:s),try e.choose(choice.id,in:restored))
            }
        }
    }
    func testWinterSuretyTravelsThroughActualDelayedQueuesAndBranches() throws {
        let e=GameEngine(content:try .bundled())
        for winter in ["limit","bind"] {
            let load=try e.choose("share",in:fixture("winter_porters",e))
            let original=try draw("winter_guarantor",after:load,e)
            let promised=try e.choose(winter,in:original)
            XCTAssertFalse(promised.flags.contains("kin_grain_credit"))
            let remembered=try pass(6,era:2,after:promised,e)
            XCTAssertTrue(remembered.flags.contains("kin_grain_credit"))
            for villageChoice in ["limit","collect"] {
                let village=try draw("kin_repayment",after:remembered,e)
                XCTAssertEqual(e.content.card("kin_repayment")!.choices.first { $0.id == "witness_limit" }!.available(in:village), winter == "limit")
                let resolved=try e.choose(villageChoice,in:village)
                XCTAssertFalse(resolved.flags.contains("surety_witness_record"))
                let inherited=try pass(5,era:3,after:resolved,e)
                let city=try draw("surety_release",after:inherited,e)
                let bounded=e.content.card("surety_release")!.choices.first { $0.id == "limit" }!
                XCTAssertEqual(bounded.available(in:city),villageChoice == "limit")
                XCTAssertTrue(try e.choose("review",in:city).flags.contains("resolved_surety_release"))
            }
        }
    }
    func testGuestWatchBecomesVillageRoofAndHarborSettlement() throws {
        let e=GameEngine(content:try .bundled())
        let sheltered=try e.choose("shelter",in:fixture("stranger_child",e))
        for watch in ["joint","service"] {
            let first=try draw("guest_path_watch",after:sheltered,e)
            let agreed=try e.choose(watch,in:first)
            let memory=try pass(5,era:2,after:agreed,e)
            for roof in ["rights","lease"] {
                let village=try draw("guest_roofs",after:memory,e)
                XCTAssertEqual(e.content.card("guest_roofs")!.choices.first { $0.id == "watch_right" }!.available(in:village), watch == "joint")
                let resolved=try e.choose(roof,in:village)
                XCTAssertEqual(resolved.flags.contains("guest_work_right"),roof == "rights")
                let record=try pass(6,era:3,after:resolved,e)
                let harbor=try draw("harbor_residency",after:record,e)
                XCTAssertEqual(e.content.card("harbor_residency")!.choices.first { $0.id == "honor" }!.available(in:harbor), roof == "rights")
                let result=try e.choose("settle",in:harbor)
                XCTAssertTrue(result.flags.contains("harbor_resident_ward"))
                XCTAssertTrue(result.flags.contains("resolved_harbor_residency"))
            }
        }
    }
    func testPoliticalAndEcologicalChoicesNeedTheirRealHistoryAndRelations() throws {
        let e=GameEngine(content:try .bundled())
        var s=fixture("village_workdays",e)
        let recall=e.content.card("village_workdays")!.choices.first { $0.id == "recall" }!
        XCTAssertFalse(recall.available(in:s))
        s.flags.insert("recall_mandate"); XCTAssertTrue(recall.available(in:s))
        let joint=e.content.card("gate_ward")!.choices.first { $0.id == "pact" }!
        XCTAssertFalse(joint.available(in:s))
        for i in s.rivals.indices { s.rivals[i].relation=35 }; XCTAssertTrue(joint.available(in:s))
        s.rivals[0].relation=34; XCTAssertFalse(joint.available(in:s))
        let fallow=try e.choose("rest",in:fixture("fallow_strips",e))
        let terrace=try draw("terrace_stones",after:fallow,e)
        XCTAssertTrue(try e.choose("common",in:terrace).buildings.contains("terrace"))
    }
}

import XCTest
@testable import FateCore

final class CityEconomyTests: XCTestCase {
    private let ids = ["marsh_raft","antler_moot","thaw_stones","hide_smoke","guest_scouts","reed_ferry","well_roster","ox_rest","field_inquest","winter_bond","quay_exchange","bread_bond","mold_audit","cistern_account","mine_shoring"]
    private func engine() throws -> GameEngine { GameEngine(content: try .bundled()) }
    private func fixture(_ id: String, _ e: GameEngine) -> GameState {
        var s = e.start(seed: 120); s.currentCardID = id; s.era = e.content.card(id)!.era
        s.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue,60) })
        return s
    }
    private func roundtrip(_ s: GameState) throws -> GameState { try JSONDecoder().decode(GameState.self,from:JSONEncoder().encode(s)) }
    private func conditions(_ requirements: [Condition], _ s: inout GameState, _ e: GameEngine) {
        for c in requirements {
            if let stat = c.stat {
                if let lower = c.minimum { s.stats[stat.rawValue] = max(lower,s.stats[stat.rawValue]!) }
                if let upper = c.maximum { s.stats[stat.rawValue] = min(upper,s.stats[stat.rawValue]!) }
            }
            if let flag = c.flag { s.flags.insert(flag) }
            if let flag = c.absentFlag { s.flags.remove(flag) }
            if let tech = c.technology { s.technologies.insert(tech) }
            if let id = c.completedCard {
                s.history.append(.init(id:s.history.count,turn:s.turn,era:s.era,cardID:id,choiceID:e.content.card(id)!.choices[0].id,text:.init(tr:"Fixture",en:"Fixture")))
            }
        }
    }
    private func draw(_ id: String, _ original: GameState, _ e: GameEngine) -> GameState {
        var s = original; s.era = e.content.card(id)!.era
        s.discovered = Set(e.content.cards.map(\.id).filter { $0 != id }); s.lastSeen[id] = -10000
        let next = e.acknowledge(s)
        XCTAssertEqual(next.currentCardID,id,"The actual selector must honor the history gates")
        return next
    }
    private func wait(_ n: Int, _ original: GameState, _ e: GameEngine, era: Int) throws -> GameState {
        var s = original; s.era = era
        for _ in 0..<n {
            s = e.acknowledge(s); s.currentCardID = "ochre_border"
            s.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue,60) })
            s = try e.choose(e.content.card("ochre_border")!.choices.first { $0.available(in:s) }!.id,in:s)
        }
        return s
    }
    func testFoodCoverageEmptyReservePartialShortageAndHardDemand() throws {
        let e = try engine(); var s = fixture("ochre_border",e)
        s.technologies = ["cultivation","irrigation"]; s.buildings = ["granary","work_calendar","terrace"]
        s.stats["resources"] = 4 // symbols pays the actual four-share card cost first.
        let covered = try e.choose("symbols",in:s)
        XCTAssertEqual(covered.stats["resources"],0)
        XCTAssertEqual(covered.stats["population"],60,"An empty reserve does not mean food was unmet")
        s.mode = .hard
        let hard = try e.choose("symbols",in:s)
        XCTAssertEqual(hard.stats["population"],57,"Two unmet shares of six cause a proportional, rounded-up loss")
        s.mode = .story; s.buildings = ["granary"]; s.stats["environment"] = 0
        XCTAssertEqual(try e.choose("symbols",in:s).stats["population"],58)
        s.stats["resources"] = 5
        XCTAssertEqual(try e.choose("symbols",in:s).stats["population"],60,"The last reserve share may cover the remaining demand")
        s.technologies = []; s.buildings = []; s.stats["resources"] = 4
        XCTAssertEqual(try e.choose("symbols",in:s).stats["population"],52,"Complete shortage retains the original maximum loss")
        s.technologies = ["cultivation","irrigation"]; s.buildings = ["granary"]; s.stats["resources"] = 0
        s.stats["environment"] = 49; XCTAssertEqual(e.foodBudget(in:s).production,3)
        s.stats["environment"] = 50; XCTAssertEqual(e.foodBudget(in:s).production,4)
        for environment in 0...100 {
            s.stats["environment"] = environment; s.buildings.formUnion(["terrace","work_calendar"])
            XCTAssertLessThanOrEqual(e.foodBudget(in:s).production,4,"Food investments never print world surplus")
        }
    }
    func testEveryNewChoiceAndContextOutcomeHasARealSelectableStateAndReplay() throws {
        let e = try engine()
        XCTAssertEqual(e.content.cards.count,165)
        for era in 1...3 { XCTAssertEqual(e.content.cards.filter { $0.era == era }.count,55) }
        for id in ids {
            let card = e.content.card(id)!
            for choice in card.choices {
                for outcome in choice.outcomes {
                    var s = fixture(id,e)
                    conditions(card.requirements+choice.requirements+(outcome.requirements ?? []),&s,e)
                    XCTAssertFalse(card.exclusionConditions.contains { $0.matches(s) },id)
                    // acknowledge selects only when there is a prior resolution.
                    s.resolution = .init(title:card.title,text:card.description,animation:"normal",changes:[:],previousEra:s.era)
                    s = draw(id,s,e)
                    XCTAssertTrue(choice.available(in:s),id+"."+choice.id)
                    let probabilities = e.outcomeProbabilities(for:choice,in:s)
                    XCTAssertEqual(probabilities.filter { $0 > 0 }.count,1)
                    let result = try e.choose(choice.id,in:s)
                    XCTAssertEqual(result.resolution?.text,outcome.text)
                    XCTAssertEqual(result,try e.choose(choice.id,in:roundtrip(s)))
                    XCTAssertFalse(result.delayed.isEmpty)
                    XCTAssertTrue(result.stats.values.allSatisfy { (0...100).contains($0) })
                    if card.exclusionConditions.contains(where: { $0.flag == "resolved_"+id }) {
                        XCTAssertTrue(card.exclusionConditions.contains { $0.matches(result) })
                    }
                }
            }
        }
    }
    func testUnfundedUpkeepConsumesCurrentFoodInsteadOfGrantingFreeHealing() throws {
        let e = try engine(); var s = fixture("smoke_shift",e)
        s.stats["resources"] = 0; s.technologies = ["cultivation","irrigation"]
        s.buildings = ["granary","work_calendar","terrace"]
        XCTAssertEqual(e.foodBudget(in:s).shortfall,0)
        let result = try e.choose("split",in:s)
        XCTAssertEqual(result.stats["resources"],0)
        XCTAssertLessThan(result.stats["population"]!,s.stats["population"]!,"Unfunded nine-share workshop care must not yield free population")
        XCTAssertEqual(result,try e.choose("split",in:roundtrip(s)))
        s.stats["resources"] = 20
        XCTAssertGreaterThan(try e.choose("split",in:s).stats["population"]!,s.stats["population"]!,"Actually funded care retains its payoff")
    }
    func testAllContextPartitionsHaveExactlyOneOutcomeAtEveryBoundary() throws {
        let e = try engine()
        for (id,choiceID,stat) in [("well_roster","shifts","environment"),("quay_exchange","contract","population"),("bread_bond","borrow","flag"),("cistern_account","current","environment"),("mine_shoring","shore","population")] {
            let choice = e.content.card(id)!.choices.first { $0.id == choiceID }!
            for value in 0...100 {
                var s = fixture(id,e)
                if stat == "flag" { if value % 2 == 0 { s.flags.insert("bounded_seed_bond") } }
                else { s.stats[stat] = value }
                let before = s
                let p = e.outcomeProbabilities(for:choice,in:s)
                XCTAssertEqual(p.reduce(0,+),1,accuracy:1e-12)
                XCTAssertEqual(p.filter { $0 > 0 }.count,1,id)
                XCTAssertEqual(s,before,"Context probability evaluation must not consume RNG or mutate state")
            }
        }
    }
    func testOpenBondSurvivesAnotherDecisionSaveAndInsufficientRepayment() throws {
        let e = try engine(); var s = fixture("bread_bond",e); s.stats["resources"] = 20
        let borrow = e.content.card("bread_bond")!.choices.first { $0.id == "borrow" }!
        s = try e.choose("borrow",in:s)
        XCTAssertTrue(s.flags.contains("bread_bond_open")); XCTAssertFalse(borrow.available(in:s))
        s = draw("bread_bond",s,e)
        s = try e.choose("relief",in:s)
        s = try roundtrip(s)
        XCTAssertTrue(s.flags.contains("bread_bond_open")); XCTAssertFalse(borrow.available(in:s))
        s.stats["resources"] = 9
        XCTAssertFalse(e.content.card("bread_bond")!.choices.first { $0.id == "repay" }!.available(in:s))
        var payable = s; payable.stats["resources"] = 20
        payable = draw("bread_bond",payable,e)
        let repaid = try e.choose("repay",in:payable)
        XCTAssertFalse(repaid.flags.contains("bread_bond_open")); XCTAssertTrue(repaid.flags.contains("bread_bond_repaid"))
        XCTAssertTrue(borrow.available(in:repaid))
        let defaulted = try e.choose("default",in:draw("bread_bond",s,e))
        XCTAssertFalse(defaulted.flags.contains("bread_bond_open")); XCTAssertTrue(defaulted.flags.contains("bread_bond_default"))
        XCTAssertTrue(e.content.card("bread_bond")!.exclusionConditions.contains { $0.matches(defaulted) })
        XCTAssertFalse(borrow.available(in:try roundtrip(defaulted)))
    }
    func testRepairChainBothBranchesReachDifferentClosedCitySettlements() throws {
        let e = try engine()
        for shared in [true,false] {
            let fragments = try e.choose(shared ? "stock" : "barter",in:fixture("flint_fragments",e))
            let village = try roundtrip(wait(5,fragments,e,era:2))
            XCTAssertTrue(village.flags.contains("repair_right"))
            let kiln = try e.choose(shared ? "commons" : "trial",in:draw("potter_lease",village,e))
            XCTAssertTrue(kiln.technologies.contains("smelting"))
            let tools = try e.choose(shared ? "common" : "repair",in:draw("copper_recast",kiln,e))
            let audit = draw("mold_audit",try roundtrip(tools),e)
            XCTAssertEqual(e.content.card("mold_audit")!.choices.first { $0.id == "partners" }!.available(in:audit),shared)
            let closed = try e.choose(shared ? "partners" : "lease",in:audit)
            XCTAssertTrue(closed.flags.contains(shared ? "mold_charter_closed" : "mold_private_closed"))
            XCTAssertTrue(e.content.card("mold_audit")!.exclusionConditions.contains { $0.matches(closed) })
            XCTAssertEqual(closed,try e.choose(shared ? "partners" : "lease",in:roundtrip(audit)))
        }
    }
    func testWaterChainBothBranchesReachClosedAccountsAndRejectedOriginCannotSkip() throws {
        let e = try engine()
        let blocked = try e.choose("close",in:fixture("salmon_weir",e))
        XCTAssertFalse(e.content.card("reed_bank")!.requirements.allSatisfy { $0.matches(blocked) })
        for preserved in [true,false] {
            let passage = try e.choose("open",in:fixture("salmon_weir",e))
            let margin = try e.choose(preserved ? "buffer" : "build",in:draw("reed_bank",passage,e))
            var city = try wait(5,margin,e,era:3); city.stats["environment"] = 60
            XCTAssertTrue(city.flags.contains("reed_water_memory"))
            XCTAssertFalse(e.content.card("cistern_account")!.requirements.allSatisfy { $0.matches(city) })
            let cistern = try e.choose(preserved ? "reeds" : "filter",in:draw("roof_cistern",city,e))
            let account = draw("cistern_account",try roundtrip(cistern),e)
            XCTAssertEqual(e.content.card("cistern_account")!.choices.first { $0.id == "inherited" }!.available(in:account),preserved)
            let closed = try e.choose(preserved ? "inherited" : "current",in:account)
            XCTAssertTrue(closed.flags.contains(preserved ? "cistern_public_closed" : "cistern_private_closed"))
            XCTAssertTrue(e.content.card("cistern_account")!.exclusionConditions.contains { $0.matches(closed) })
        }
    }
    func testOptionalModelFieldsDecodeOldContentAndSavedConsequences() throws {
        let old = Data(#"{"stats":{},"flags":[],"technologies":[],"buildings":[],"rivalRelation":0}"#.utf8)
        XCTAssertNil(try JSONDecoder().decode(Effect.self,from:old).removeFlags)
        XCTAssertNil(try JSONDecoder().decode(Condition.self,from:Data(#"{"flag":"old_rule"}"#.utf8)).completedCard)
        let e = try engine(), s = fixture("ochre_border",try engine())
        var choice = e.content.card("ochre_border")!.choices[0]
        choice.outcomes[0].requirements = [.init(flag:"absent_test_flag")]
        XCTAssertFalse(choice.available(in:s)); XCTAssertEqual(e.outcomeProbabilities(for:choice,in:s),[])
    }
}

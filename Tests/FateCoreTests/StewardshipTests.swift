import XCTest
@testable import FateCore

final class StewardshipTests: XCTestCase {
    let ids = ["herd_truce","coppice_boundary","tide_camp","elder_route","spring_pool","ore_wash","bellows_exchange","pasture_pledge","sluice_silt","sowing_crews","grazing_appeal","quay_levy","slag_basin","charcoal_lots","bond_workwatch"]
    func copy(_ s:GameState) throws -> GameState { try JSONDecoder().decode(GameState.self,from:JSONEncoder().encode(s)) }
    func setup(_ id:String,_ e:GameEngine) -> GameState {
        var s=e.start(seed:135);s.era=e.content.card(id)!.era;s.currentCardID=id
        s.stats=Dictionary(uniqueKeysWithValues:Stat.allCases.map{($0.rawValue,70)})
        return s
    }
    func satisfy(_ conditions:[Condition],_ s:inout GameState,_ e:GameEngine) {
        for c in conditions {
            if let f=c.flag {s.flags.insert(f)};if let f=c.absentFlag{s.flags.remove(f)}
            if let t=c.technology{s.technologies.insert(t)}
            if let key=c.stat {if let v=c.minimum{s.stats[key.rawValue]=max(v,s.stats[key.rawValue]!)};if let v=c.maximum{s.stats[key.rawValue]=min(v,s.stats[key.rawValue]!)}}
            if let id=c.completedCard{s.history.append(.init(id:s.history.count,turn:s.turn,era:s.era,cardID:id,choiceID:e.content.card(id)!.choices[0].id,text:.init(tr:"Fixture",en:"Fixture")))}
        }
    }
    func draw(_ id:String,_ original:GameState,_ e:GameEngine)->GameState {
        var s=original;s.currentCardID=nil;s.resolution = .init(title:.init(tr:"Fixture",en:"Fixture"),text:.init(tr:"Fixture",en:"Fixture"),animation:"normal",changes:[:],previousEra:s.era);s.ending=nil;s.era=e.content.card(id)!.era
        s.discovered=Set(e.content.cards.map(\.id).filter{$0 != id});s.lastSeen[id] = -10000
        let next=e.acknowledge(s);XCTAssertEqual(next.currentCardID,id,"Actual selector, isolated eligibility fixture")
        return next
    }
    func wait(_ n:Int,_ state:GameState,_ era:Int,_ e:GameEngine)throws->GameState {
        var s=state;s.era=era
        for _ in 0..<n {s=e.acknowledge(s);s.currentCardID="ochre_border";s.stats=Dictionary(uniqueKeysWithValues:Stat.allCases.map{($0.rawValue,70)});s=try e.choose(e.content.card("ochre_border")!.choices.first{$0.available(in:s)}!.id,in:s)}
        return try copy(s)
    }
    func testEveryNewDecisionResolvesThroughRealAvailabilityAndSurvivesSave()throws {
        let e=GameEngine(content:try .bundled())
        for id in ids {let c=e.content.card(id)!
            for ch in c.choices {var s=setup(id,e);satisfy(c.requirements+ch.requirements,&s,e)
                XCTAssertTrue(ch.available(in:s),id+"."+ch.id)
                s=draw(id,try copy(s),e);let a=try e.choose(ch.id,in:s),b=try e.choose(ch.id,in:copy(s))
                XCTAssertEqual(a,b,"Deterministic replay "+id+"."+ch.id);XCTAssertNotNil(a.resolution)
                XCTAssertEqual(try copy(a),a)
                if c.exclusionConditions.contains(where:{$0.flag=="resolved_"+id}){XCTAssertTrue(a.flags.contains("resolved_"+id));XCTAssertTrue(c.exclusionConditions.contains{$0.matches(a)})}
            }
        }
    }
    func testMetalInvestmentHasActualCostsFailuresAndExistingDiscoveryExclusion()throws {
        let e=GameEngine(content:try .bundled());let c=e.content.card("ore_wash")!;let ch=c.choices[0]
        var s=setup(c.id,e);s.stats["resources"]=5;XCTAssertFalse(ch.available(in:s));s.stats["resources"]=6;XCTAssertTrue(ch.available(in:s))
        var observed=Set<Bool>()
        for seed in 0..<40 {s.random=SeededRandom(state:UInt64(seed));let r=try e.choose("test",in:s);observed.insert(r.technologies.contains("smelting"));XCTAssertEqual(r.stats["resources"],0);XCTAssertEqual(r.stats["environment"],68);XCTAssertTrue(r.flags.contains("ore_sorting_practice"))}
        XCTAssertEqual(observed,[true,false]);s.technologies.insert("smelting");XCTAssertTrue(c.exclusionConditions.contains{$0.matches(s)})
    }
    func testProtectiveHistoryReducesNewWorkCostWithoutRemovingUpkeep()throws {
        let e=GameEngine(content:try .bundled());var s=setup("charcoal_lots",e)
        let c=e.content.card("charcoal_lots")!;let inherited=c.choices.first{$0.id=="inherit"}!
        XCTAssertFalse(inherited.available(in:s));s.flags.insert("coppice_memory");XCTAssertTrue(inherited.available(in:s))
        let paid=try e.choose("inherit",in:s);XCTAssertLessThan(paid.stats["resources"]!,70);XCTAssertTrue(paid.delayed.contains{$0.effect.stats["environment"] == -2})
        s.stats["resources"]=8;XCTAssertFalse(inherited.available(in:s),"Reserve also covers ordinary food")
    }
    func testPaidBondFollowupCannotCloseBeforeRepaymentAndDoesNotEraseANewLoan()throws {
        let e=GameEngine(content:try .bundled());var s=setup("bond_workwatch",e)
        let c=e.content.card("bond_workwatch")!
        XCTAssertFalse(c.requirements.allSatisfy{$0.matches(s)})
        s.currentCardID="bread_bond";s=try e.choose("borrow",in:s);s=e.acknowledge(s)
        XCTAssertFalse(c.requirements.allSatisfy{$0.matches(s)})
        s.currentCardID="bread_bond";s.stats["resources"]=30;s=try e.choose("repay",in:s)
        XCTAssertTrue(c.requirements.allSatisfy{$0.matches(s)})
        s=e.acknowledge(s);s.currentCardID="bread_bond";s=try e.choose("borrow",in:s)
        s=e.acknowledge(s);s.currentCardID="bond_workwatch";s.stats["resources"]=70
        s.flags.insert("bounded_seed_bond");s=try e.choose("receipt",in:s)
        XCTAssertTrue(s.flags.contains("bread_bond_open"),"Review of earlier payment never erases a different current loan")
        XCTAssertTrue(s.flags.contains("resolved_bond_workwatch"))
    }
    func testNewExtractionCannotRepeatedlySpendAnAlreadyExhaustedEcologyRating()throws {
        let e=GameEngine(content:try .bundled())
        for (id,chID,minimum) in [("coppice_boundary","cut",10),("sluice_silt","upper",7),("slag_basin","shift",8),("charcoal_lots","overcut",13)] {
            var s=setup(id,e);let ch=e.content.card(id)!.choices.first{$0.id==chID}!
            s.stats["environment"]=minimum-1;XCTAssertFalse(ch.available(in:s),id)
            s.stats["environment"]=minimum;XCTAssertTrue(ch.available(in:s),id)
            s.stats["environment"]=0;XCTAssertFalse(ch.available(in:s),id)
        }
    }
    func testHerdToGateChainBothBranchesDelaySaveAndClosure()throws {
        let e=GameEngine(content:try .bundled())
        for shared in [true,false] {var s=setup("herd_truce",e);s.technologies=["hearth"]
            s=try e.choose(shared ? "share":"guard",in:s);s=try wait(7,s,1,e)
            XCTAssertFalse(s.flags.contains("herd_treaty_memory"),"Village memory cannot arrive in era 1")
            s=try wait(1,s,2,e);XCTAssertTrue(s.flags.contains("herd_treaty_memory"))
            s=draw("pasture_pledge",try copy(s),e)
            let honor=e.content.card("pasture_pledge")!.choices.first{$0.id=="honor"}!
            XCTAssertEqual(honor.available(in:s),shared)
            s=try e.choose(shared ? "honor":"enclose",in:s);s=try wait(7,s,2,e)
            XCTAssertFalse(s.flags.contains("pasture_city_memory"));s=try wait(1,s,3,e)
            s=draw("grazing_appeal",try copy(s),e)
            let rotation=e.content.card("grazing_appeal")!.choices.first{$0.id=="rotation"}!
            XCTAssertEqual(rotation.available(in:s),shared)
            s=try e.choose(shared ? "rotation":"lease",in:s);s=try copy(s)
            XCTAssertTrue(s.flags.contains(shared ? "pasture_public_settlement":"pasture_private_settlement"))
            XCTAssertTrue(s.flags.contains("resolved_grazing_appeal"));XCTAssertTrue(e.content.card("grazing_appeal")!.exclusionConditions.contains{$0.matches(s)})
            XCTAssertTrue(s.delayed.contains{$0.minimumEra==3});XCTAssertEqual(s.history.filter{$0.cardID=="herd_truce"}.first?.choiceID,shared ? "share":"guard")
        }
    }
}

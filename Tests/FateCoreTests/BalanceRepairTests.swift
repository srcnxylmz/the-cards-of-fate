import XCTest
@testable import FateCore

final class BalanceRepairTests:XCTestCase {
    func state(_ id:String,_ e:GameEngine)->GameState {
        var s=e.start(seed:150);s.currentCardID=id;s.era=e.content.card(id)!.era
        s.stats=Dictionary(uniqueKeysWithValues:Stat.allCases.map{($0.rawValue,60)})
        s.flags=["forest_stewards","coppice_memory","shared_runoff_rule"]
        return s
    }
    func copy(_ s:GameState)throws->GameState {try JSONDecoder().decode(GameState.self,from:JSONEncoder().encode(s))}
    func testLegacyHistoryClosesFoundingDisputesButAnAlreadyDisplayedCardStillResolves()throws {
        let e=GameEngine(content:try .bundled())
        for(id,choice)in[("coppice_boundary","mark"),("spring_pool","separate")] {
            var s=state(id,e);s=try e.choose(choice,in:s);s=try copy(s)
            XCTAssertTrue(e.content.card(id)!.exclusionConditions.contains{$0.matches(s)},id)
            s=e.acknowledge(s);XCTAssertNotEqual(s.currentCardID,id)
            s.currentCardID=id;s.resolution=nil
            let displayed=try e.choose(choice,in:s)
            XCTAssertNotNil(displayed.resolution,"Previously displayed v1 cards remain resolvable")
        }
    }
    func testProductionPartitionsCoverEveryWorkforceValueAndKeepPaidCapital()throws {
        let e=GameEngine(content:try .bundled())
        for(id,chID,cost,full,thin)in[("slag_basin","line",7,9,4),("slag_basin","runoff",5,7,2),("charcoal_lots","rotate",8,10,5),("charcoal_lots","inherit",5,8,4)] {
            let ch=e.content.card(id)!.choices.first{$0.id==chID}!
            for p in 0...100 {var s=state(id,e);s.stats["population"]=p
                let weights=e.outcomeProbabilities(for:ch,in:s)
                XCTAssertEqual(weights.filter{$0>0}.count,1)
                let o=ch.outcomes[weights.firstIndex(of:1)!]
                XCTAssertEqual(o.id,p>=25 ? "crewed":"thin")
                XCTAssertEqual(o.effect.stats["resources"],-cost)
                XCTAssertEqual(o.delayedEffects[0].effect.stats["resources"],p>=25 ? full:thin)
                XCTAssertNil(o.effect.stats["population"],"No free healing added")
            }
            var empty=state(id,e);empty.stats["resources"]=0;XCTAssertFalse(ch.available(in:empty))
            XCTAssertLessThan(thin,cost,"A depleted crew cannot farm profitable restoration")
            let s=state(id,e),a=try e.choose(chID,in:s),b=try e.choose(chID,in:copy(s))
            XCTAssertEqual(a,b);XCTAssertEqual(a.delayed.last?.effect.stats["resources"],full)
        }
    }
    func testOldScheduledDebitsAreNotRepricedAsNewProductionReturns()throws {
        let e=GameEngine(content:try .bundled());var s=state("ochre_border",e);s.era=3
        s.delayed=[.init(dueTurn:s.turn+1,minimumEra:3,text:.init(tr:"Eski bakım",en:"Old upkeep"),effect:.init(stats:["resources":-3],flags:[],technologies:[],buildings:[],rivalRelation:0))]
        s=try copy(s);var cardResources=0,delayedResources=0
        _=try e.choose("symbols",in:s){stage,snapshot in
            if stage=="card"{cardResources=snapshot.stats["resources"]!}
            if stage=="delayed"{delayedResources=snapshot.stats["resources"]!}
        }
        XCTAssertEqual(cardResources-delayedResources,3)
    }
}

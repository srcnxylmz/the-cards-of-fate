import XCTest
@testable import FateCore

final class ContinuityTests:XCTestCase {
    let ids=["smoke_code","pack_exchange","burial_path","guest_tongue","net_menders","bank_alarm","loom_shares","threshing_floor","clay_lids","millstones","alarm_inquest","quay_schedule","grain_rotation","mine_water","night_patrol"]
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
    func testAllDecisionsUseRealSelectorAvailabilitySaveAndReplay()throws {
        let e=GameEngine(content:try .bundled()),h=self
        for id in ids {let c=e.content.card(id)!
            for ch in c.choices {var s=h.setup(id,e);h.satisfy(c.requirements+ch.requirements,&s,e)
                // A wall is a real requirement for the night patrol, not a flag.
                for condition in c.requirements+ch.requirements {if let b=condition.building{s.buildings.insert(b)}}
                XCTAssertTrue(c.requirements.allSatisfy{$0.matches(s)},id)
                s=h.draw(id,try h.copy(s),e);XCTAssertTrue(ch.available(in:s),id+"."+ch.id)
                let a=try e.choose(ch.id,in:s),b=try e.choose(ch.id,in:h.copy(s))
                XCTAssertEqual(a,b);XCTAssertEqual(try h.copy(a),a);XCTAssertNotNil(a.resolution)
                if c.exclusionConditions.contains(where:{$0.flag=="resolved_"+id}) {XCTAssertTrue(c.exclusionConditions.contains{$0.matches(a)})}
            }
        }
    }
    func testWorkforcePartitionsPaidReservesAndEcologicalInputs()throws {
        let e=GameEngine(content:try .bundled()),h=self
        for id in ids {let c=e.content.card(id)!
            for ch in c.choices {var s=h.setup(id,e);h.satisfy(c.requirements+ch.requirements,&s,e)
                for r in ch.requirements where r.stat == .environment {s.stats["environment"]=0;XCTAssertFalse(ch.available(in:s),id);s.stats["environment"]=70}
                guard ch.outcomes.contains(where:{$0.id=="crewed"}) else {continue}
                s.stats["resources"]=0;XCTAssertFalse(ch.available(in:s),id);s.stats["resources"]=70
                for p in 0...100 {s.stats["population"]=p;let weights=e.outcomeProbabilities(for:ch,in:s)
                    XCTAssertEqual(weights.filter{$0>0}.count,1);let o=ch.outcomes[weights.firstIndex(of:1)!]
                    XCTAssertEqual(o.id,p>=25 ? "crewed":"thin");XCTAssertLessThan(o.effect.stats["resources"]!,0)
                    XCTAssertNil(o.effect.stats["population"]);XCTAssertTrue(o.delayedEffects[0].afterTurns>0)
                }
            }
        }
    }
    func testSharedAndPrivateWarningChainsHaveDelayedMemoriesAndActualClosure()throws {
        let e=GameEngine(content:try .bundled()),h=self
        for shared in [true,false] {var s=h.setup("smoke_code",e);s.technologies=["hearth"]
            s=try e.choose(shared ? "common":"household",in:s);s=try h.wait(6,s,1,e)
            XCTAssertFalse(s.flags.contains("alarm_memory"));s=try h.wait(1,s,2,e)
            XCTAssertTrue(s.flags.contains("alarm_memory"));s=h.draw("bank_alarm",try h.copy(s),e)
            XCTAssertEqual(e.content.card("bank_alarm")!.choices.first{$0.id=="code"}!.available(in:s),shared)
            s=try e.choose(shared ? "code":"lease",in:s);s=try h.wait(7,s,2,e)
            XCTAssertFalse(s.flags.contains("watch_city_memory"));s=try h.wait(1,s,3,e)
            let final=e.content.card("alarm_inquest")!
            XCTAssertFalse(final.requirements.allSatisfy{$0.matches(s)},"Writing remains a real technology gate")
            s.technologies.insert("writing");s=h.draw(final.id,try h.copy(s),e)
            XCTAssertEqual(final.choices.first{$0.id=="code"}!.available(in:s),shared)
            s=try e.choose(shared ? "code":"charge",in:s);s=try h.copy(s)
            XCTAssertTrue(s.flags.contains(shared ? "public_alarm_settlement":"private_alarm_settlement"))
            XCTAssertTrue(final.exclusionConditions.contains{$0.matches(s)});XCTAssertTrue(s.delayed.contains{$0.minimumEra==3})
            XCTAssertEqual(s.history.first{$0.cardID=="smoke_code"}?.choiceID,shared ? "common":"household")
        }
    }
}

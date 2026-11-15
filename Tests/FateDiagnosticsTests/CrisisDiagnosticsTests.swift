import XCTest
@testable import FateCore
@testable import FateDiagnostics

final class CrisisDiagnosticsTests: XCTestCase {
    private func context() throws -> (GameEngine,GameState,CardEvent,Choice) {
        let e = GameEngine(content:try .bundled())
        var s = e.start(seed:120); s.era = 3; s.turn = 0
        s.stats = ["population":60,"resources":20,"stability":60,"environment":60,"authority":60,"knowledge":60]
        let c = e.content.card("ochre_border")!
        return (e,s,c,c.choices.first { $0.id == "move" }!)
    }
    private func hungry(_ initial:GameState,_ card:CardEvent,_ choice:Choice,_ d:inout CrisisDiagnostics)->GameState {
        d.begin(initial,card:card,choice:choice)
        var s = initial; s.turn += 1; s.stats["resources"] = 0; s.stats["population"] = 52
        d.observe("world",state:s,era:3); d.endDecision(s)
        return s
    }
    func testDeathBeforeWorldCannotCountAsHungerOrReserveRecovery() throws {
        let (_,initial,card,choice) = try context(); var d = CrisisDiagnostics()
        var s = hungry(initial,card,choice,&d)
        d.begin(s,card:card,choice:choice)
        s.turn += 1; s.stats["population"] = 0; s.stats["resources"] = 10
        d.observe("card",state:s,era:3); d.observe("world",state:s,era:3)
        s.ending = .init(tr:"Bitti",en:"Ended")
        d.endDecision(s); d.finish(s)
        XCTAssertEqual(d.counts["hungerEpisodes.3.recovered",default:0],0)
        XCTAssertEqual(d.counts["reserveEpisodes.3.recovered",default:0],0)
        XCTAssertEqual(d.counts["hungerEpisodes.3.endedUnrecovered"],1)
        XCTAssertEqual(d.counts["reserveEpisodes.3.endedUnrecovered"],1)
    }
    func testLivingRecoveryCountsOnceAndPreservesObservedDuration() throws {
        let (_,initial,card,choice) = try context(); var d = CrisisDiagnostics()
        var s = hungry(initial,card,choice,&d)
        d.begin(s,card:card,choice:choice)
        s.turn += 1; s.stats["resources"] = 5
        d.observe("world",state:s,era:3)
        d.endDecision(s); d.endDecision(s); d.finish(s)
        XCTAssertEqual(d.counts["hungerEpisodes.3.recovered"],1)
        XCTAssertEqual(d.counts["hungerEpisodes.3.recoveryTurnSum"],1)
        XCTAssertEqual(d.counts["reserveEpisodes.3.recovered"],1)
        XCTAssertEqual(d.counts["reserveEpisodes.3.recoveryTurnSum"],1)
        XCTAssertEqual(d.counts["hungerEpisodes.3.endedUnrecovered",default:0],0)
    }
    func testCouncilEndingAfterWorldDoesNotLookLikeRecovery() throws {
        let (_,initial,card,choice) = try context(); var d = CrisisDiagnostics()
        var s = hungry(initial,card,choice,&d)
        d.begin(s,card:card,choice:choice)
        s.turn += 1; s.stats["resources"] = 5
        d.observe("world",state:s,era:3)
        s.stats["environment"] = 0; s.stats["stability"] = 0
        s.ending = .init(tr:"Toprak sustu",en:"The land fell silent")
        d.endDecision(s); d.finish(s)
        XCTAssertEqual(d.counts["hungerEpisodes.3.recovered",default:0],0)
        XCTAssertEqual(d.counts["hungerEpisodes.3.endedUnrecovered"],1)
    }
    func testLivingCapRetainsAnUnrecoveredEpisodeAsCensored() throws {
        let (_,initial,card,choice) = try context(); var d = CrisisDiagnostics()
        var s = hungry(initial,card,choice,&d); s.turn = 500
        d.finish(s)
        XCTAssertEqual(d.counts["hungerEpisodes.3.censored"],1)
        XCTAssertEqual(d.counts["reserveEpisodes.3.censored"],1)
        XCTAssertEqual(d.counts["hungerEpisodes.3.endedUnrecovered",default:0],0)
    }
    func testBronzeWindowUsesResidenceNotGlobalAgeAndCountsChoiceVariety() throws {
        let (e,initial,card,_) = try context(); var d = CrisisDiagnostics(); var s = initial
        s.turn = 200
        for index in 0..<20 {
            s = e.acknowledge(s); s.currentCardID = card.id
            for stat in Stat.allCases { s.stats[stat.rawValue] = 60 }
            let choice = card.choices.first { $0.id == (index % 2 == 0 ? "symbols" : "renew") }!
            d.begin(s,card:card,choice:choice)
            s = try e.choose(choice.id,in:s) { stage,snapshot in d.observe(stage,state:snapshot,era:3) }
            d.endDecision(s)
        }
        d.finish(s)
        XCTAssertEqual(d.counts["bronze.first20.complete.decisions"],20)
        XCTAssertEqual(d.counts["bronze.first20.complete.repeats"],19)
        XCTAssertEqual(d.counts["bronze.first20.complete.distinctCardSum"],1)
        XCTAssertEqual(d.counts["bronze.first20.complete.distinctChoiceSum"],2)
        XCTAssertEqual(d.counts["bronze.after100.decisions",default:0],0)
    }
}

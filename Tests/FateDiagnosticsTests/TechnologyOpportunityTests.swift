import XCTest
@testable import FateCore
@testable import FateDiagnostics

final class TechnologyOpportunityTests: XCTestCase {
    func testSaturatedKnowledgeStillObservesRealPolicyInvestmentWithoutMutatingState() throws {
        let e=GameEngine(content:try .bundled()),c=e.content.card("river_tracks")!
        var s=e.start(seed:165);s.currentCardID=c.id;s.turn=7
        s.stats=Dictionary(uniqueKeysWithValues:Stat.allCases.map{($0.rawValue,70)})
        s.stats["knowledge"]=100;s.technologies=[]
        let original=s;var rng=s.random
        let chosen=e.select(c.choices.filter{$0.available(in:s)},state:s,policyName:"progression",random:&rng)
        XCTAssertEqual(chosen.id,"observe")
        var d=DevelopmentDiagnostics();d.begin(s,card:c,choice:chosen);d.begin(s,card:c,choice:chosen)
        XCTAssertEqual(s,original)
        XCTAssertEqual(d.counts["technologyFirstOffer.cultivation.runs"],1)
        XCTAssertEqual(d.counts["technologyFirstInvestment.cultivation.turnSum"],7)
        XCTAssertEqual(d.counts["technologyOffer.cultivation.river_tracks.observe.chosenAtKnowledge100"],2)
        s.technologies.insert("cultivation");d.begin(s,card:c,choice:chosen)
        XCTAssertEqual(d.counts["technologyFirstOffer.cultivation.runs"],1)
    }
}

import XCTest
@testable import FateCore
@testable import FateDiagnostics

final class DevelopmentDiagnosticsTests:XCTestCase {
    func testOfferedInvestmentDistinguishesUnavailableAndDeclinedWithoutChangingState()throws {
        let e=GameEngine(content:try .bundled());let c=e.content.card("ore_wash")!
        var s=e.start(seed:135);s.era=2;s.stats["resources"]=5;s.stats["knowledge"]=100
        let original=s;var d=DevelopmentDiagnostics();d.begin(s,card:c,choice:c.choices[1])
        XCTAssertEqual(d.counts["metalOffer.ore_wash.test.presented"],1)
        XCTAssertNil(d.counts["metalOffer.ore_wash.test.available"]);XCTAssertEqual(s,original)
        s.stats["resources"]=6;d.begin(s,card:c,choice:c.choices[1])
        XCTAssertEqual(d.counts["metalOffer.ore_wash.test.declined"],1)
        XCTAssertEqual(d.counts["metalOffer.ore_wash.test.knowledgeSaturated"],1)
        s.technologies.insert("smelting");d.begin(s,card:c,choice:c.choices[1]);XCTAssertEqual(d.counts["metalOffer.ore_wash.test.presented"],2)
    }
    func testObservedLossIsActualClampedDifferenceAndResidenceStartsAtEntry()throws {
        let e=GameEngine(content:try .bundled());var s=e.start(seed:135);s.turn=200;s.era=3;s.stats["environment"]=3
        let c=e.content.card("furnace_wood")!;let ch=c.choices.first{$0.id=="expand"}!;var d=DevelopmentDiagnostics()
        d.begin(s,card:c,choice:ch);s.stats["environment"]=0;d.observe("card",state:s,era:3)
        XCTAssertEqual(d.counts["3.card.furnace_wood.expand.environment.loss"],3)
        XCTAssertEqual(d.counts["bronze.prefix20.decisions"],1);XCTAssertEqual(d.counts["bronze.prefix20.environmentSum"],3)
        d.observe("delayed",state:s,era:3);XCTAssertNil(d.counts["3.delayed.all.environment.loss"])
    }
    func testLivingNeolithicCapSeparatesTechnologyAndSocialConditions()throws {
        let e=GameEngine(content:try .bundled());var s=e.start(seed:135);s.era=2;s.turn=500;s.stats["stability"]=34
        var d=DevelopmentDiagnostics();d.finish(s);XCTAssertEqual(d.counts["neo.caps.withoutMetal"],1);XCTAssertEqual(d.counts["neo.caps.block.stability"],1)
        s.technologies.insert("smelting");var other=DevelopmentDiagnostics();other.finish(s);XCTAssertEqual(other.counts["neo.caps.withMetal"],1)
        s.ending = .init(tr:"Son",en:"End");var ended=DevelopmentDiagnostics();ended.finish(s);XCTAssertNil(ended.counts["neo.caps"])
    }
}

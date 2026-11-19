import XCTest
@testable import FateCore
@testable import FateDiagnostics

final class ExposureWindowTests:XCTestCase {
    func testActualClampedPrefixLossAndLateOutcomesStayPassiveAndEraBounded()throws {
        let e=GameEngine(content:try .bundled()),c=e.content.card("furnace_wood")!,ch=c.choices[0]
        var s=e.start(seed:180);s.era=3;s.turn=300;s.stats["environment"]=3
        let original=s;var d=DevelopmentDiagnostics();d.begin(s,card:c,choice:ch)
        XCTAssertEqual(s,original);s.stats["environment"]=0;d.observe("card",state:s,era:3)
        XCTAssertEqual(d.counts["bronze.actual.first20.card.furnace_wood."+ch.id+".environment.loss"],3)
        var crisis=CrisisDiagnostics();crisis.bronzeTurn=99
        crisis.begin(s,card:c,choice:ch);crisis.recordOutcome(key:"test.a");XCTAssertNil(crisis.counts["bronze.after100.outcome.test.a"])
        crisis.begin(s,card:c,choice:ch);crisis.recordOutcome(key:"test.a");XCTAssertEqual(crisis.counts["bronze.after100.outcome.test.a"],1)
        s.era=4;crisis.begin(s,card:c,choice:ch);crisis.recordOutcome(key:"test.a")
        XCTAssertEqual(crisis.counts["bronze.after100.outcome.test.a"],1)
    }
}

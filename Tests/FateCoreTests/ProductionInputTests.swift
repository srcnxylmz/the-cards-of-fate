import XCTest
@testable import FateCore

final class ProductionInputTests:XCTestCase {
    func testDepletedEcologyCannotFundOldExtractionAndAnOldDisplayedCardStillHasALegalAlternative()throws {
        let e=GameEngine(content:try .bundled())
        for(id,chID,cost)in[("furnace_wood","expand",15),("roof_beams","timber",12),("smoke_shift","push",6),("roof_cistern","workshops",5)] {
            var s=e.start(seed:180);s.era=3;s.currentCardID=id
            s.stats=Dictionary(uniqueKeysWithValues:Stat.allCases.map{($0.rawValue,70)})
            let c=e.content.card(id)!,ch=c.choices.first{$0.id==chID}!
            for ecology in 0...100 {s.stats["environment"]=ecology;XCTAssertEqual(ch.available(in:s),ecology>=cost,id)}
            s.stats["environment"]=0
            let loaded=try JSONDecoder().decode(GameState.self,from:JSONEncoder().encode(s))
            XCTAssertThrowsError(try e.choose(chID,in:loaded))
            XCTAssertGreaterThanOrEqual(c.choices.filter{$0.available(in:loaded)}.count,2,"No new selector deadlock at depleted ecology")
            let legal=try XCTUnwrap(c.choices.first{$0.available(in:loaded)})
            let a=try e.choose(legal.id,in:loaded),b=try e.choose(legal.id,in:loaded)
            XCTAssertEqual(a,b);XCTAssertNotNil(a.resolution)
        }
    }
}

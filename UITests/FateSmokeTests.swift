import XCTest
import Vision
import UIKit

final class FateSmokeTests: XCTestCase {
    private var app: XCUIApplication!
    private let stats = ["population", "resources", "authority", "knowledge", "stability", "environment"]

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
    }

    override func tearDownWithError() throws {
        if app != nil {
            capture("final-state")
            let hierarchy = XCTAttachment(string: app.debugDescription)
            hierarchy.name = "accessibility-hierarchy"
            hierarchy.lifetime = .keepAlways
            add(hierarchy)
            app.terminate()
        }
    }

    func testTurkishDecisionAndPersistentResume() throws { try exercise(language: "tr") }
    func testEnglishDecisionAndPersistentResume() throws { try exercise(language: "en") }

    func testIllustratedCardsAndLargeTextReducedMotion() throws {
        for (id, language, large) in [("sacred_fire", "tr", false), ("river_tracks", "en", false), ("first_granary", "tr", true), ("green_stone", "en", false), ("smoke_shift", "tr", false)] {
            app.terminate()
            launch(language: language, reset: true, extra: ["--ui-test-card", id, "--audio-smoke"] + (large ? ["--large-text-reduced-motion"] : []))
            tap(element("menu.newGame"))
            XCTAssertEqual(element("card.title").value as? String, id)
            XCTAssertEqual(element("card.art").value as? String, "card_\(id)")
            if large { app.swipeUp() }
            capture("\(language)-art-\(id)-\(large ? "large-reduced-motion" : "standard")")
            let second = app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH %@", "choice.")).element(boundBy: 1)
            reveal(second)
            capture("\(language)-art-\(id)-reachable-options")
            tap(second)
            XCTAssertTrue(element("result.title").waitForExistence(timeout: 10))
            XCTAssertEqual(element("game.turn").value as? String, "1")
            capture("\(language)-art-\(id)-result")
        }
    }


    // Pixel evidence, independent of accessibilityValue. The legacy layout is a diagnostic
    // control, never an accepted alternative to the assertions on the production layout.
    func testVisibleStatisticsInBothLanguagesAndTextSizes() throws {
        for (language,large) in [("tr",false),("en",false),("tr",true),("en",true)] {
            for legacy in [true,false] {
                app.terminate()
                let options = ["--ui-test-card","river_tracks"] + (large ? ["--large-text-reduced-motion"] : []) + (legacy ? ["--legacy-stat-layout"] : [])
                launch(language:language,reset:true,extra:options)
                tap(element("menu.newGame"))
                XCTAssertTrue(element("card.title").waitForExistence(timeout:10))
                let firstFrame = capture("stats-first-\(language)-\(large)-legacy-\(legacy)")
                var visible=0, missing:[String]=[]
                for stat in stats {
                    let row=element("stat."+stat)
                    let frame=row.frame
                    if frame.minY >= 24 && frame.maxY <= app.frame.maxY-4 {
                        visible += 1
                        let expected=String(stat == "authority" ? 40 : stat == "knowledge" ? 28 : stat == "environment" ? 70 : 55)
                        let text=try pixels(row,name:"first-\(language)-\(large)-\(legacy)-\(stat)", screenshot:firstFrame)
                        if !numbers(text).contains(expected) { missing.append(stat+":"+text) }
                    }
                }
                XCTAssertGreaterThan(visible,0)
                let note=XCTAttachment(string:"legacy=\(legacy), visible=\(visible), missing=\(missing)")
                note.name="stat-first-paint-comparison-\(language)-\(large)-\(legacy)"; note.lifetime = .keepAlways; add(note)
                if !legacy {
                    XCTAssertTrue(missing.isEmpty,"Visible first-frame values missing: \(missing)")
                    if !large { XCTAssertEqual(visible,6) }
                    for stat in stats {
                        let row=element("stat."+stat)
                        for _ in 0..<8 {
                            if row.frame.minY >= 24 && row.frame.maxY < app.frame.maxY-4 { break }
                            app.swipeUp()
                        }
                        XCTAssertTrue(row.isHittable)
                        let expected=try XCTUnwrap(row.value as? String)
                        XCTAssertTrue(numbers(try pixels(row,name:"visible-\(language)-\(large)-\(stat)")).contains(expected),"Pixels must contain the actual stat value: \(stat)")
                    }
                    app.swipeUp()
                    capture("stats-scrolled-\(language)-\(large)")
                    let bar=app.screenshot().image
                    let cg=try XCTUnwrap(bar.cgImage)
                    let strip=try XCTUnwrap(cg.cropping(to:CGRect(x:0,y:0,width:CGFloat(cg.width),height:40)))
                    let text=try recognize(strip).lowercased()
                    for forbidden in ["nüfus","population","kaynak","resources","istikrar","stability","tracks","nehirdeki"] {
                        XCTAssertFalse(text.contains(forbidden),"Game text must not paint behind the status bar")
                    }
                }
            }
        }
    }
    private func numbers(_ text:String) -> [String] {
        text.components(separatedBy:CharacterSet.decimalDigits.inverted).filter { !$0.isEmpty }
    }
    private func recognize(_ image:CGImage) throws -> String {
        let request=VNRecognizeTextRequest()
        request.recognitionLevel = .accurate; request.usesLanguageCorrection = false
        request.recognitionLanguages=["en-US"]
        // Native caption crops can be only ~24 pixels tall. Preserve the same glyphs
        // while giving Vision sufficient raster resolution; no expected words/digits are supplied.
        let enlarged=CIImage(cgImage:image).transformed(by:CGAffineTransform(scaleX:3,y:3))
        try VNImageRequestHandler(ciImage:enlarged,options:[:]).perform([request])
        return (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }.joined(separator:" ")
    }
    private func pixels(_ element:XCUIElement,name:String, screenshot:UIImage? = nil) throws -> String {
        let shot=screenshot ?? app.screenshot().image
        let cg=try XCTUnwrap(shot.cgImage)
        let scale=CGFloat(cg.width)/app.frame.width
        let rect=element.frame.offsetBy(dx:-app.frame.minX,dy:-app.frame.minY)
        let crop=try XCTUnwrap(cg.cropping(to:CGRect(x:rect.minX*scale,y:rect.minY*scale,width:rect.width*scale,height:rect.height*scale)))
        let attachment=XCTAttachment(image:UIImage(cgImage:crop))
        attachment.name=name; attachment.lifetime = .keepAlways; add(attachment)
        return try recognize(crop)
    }

    func testCouncilNegotiationAndPersistentCooldown() throws {
        launch(language: "en", reset: true)
        tap(element("menu.newGame"))
        let before = try values()
        let card = element("card.title").value as? String
        tap(element("council.panel"))
        XCTAssertTrue(element("faction.hunters").waitForExistence(timeout: 5))
        XCTAssertTrue(element("faction.hunters").label.contains("Council of Hunters"))
        XCTAssertEqual(element("faction.hunters").value as? String, "0")
        tap(element("council.negotiate.hunters"))
        XCTAssertEqual(element("faction.hunters").value as? String, "20")
        XCTAssertFalse(element("council.negotiate.keepers").isEnabled)
        app.swipeUp(); app.swipeUp()
        capture("en-06-council-negotiation")
        XCTAssertEqual(try values()["resources"], before["resources"]! - 8)
        XCTAssertEqual(element("game.turn").value as? String, "0")
        XCTAssertEqual(element("card.title").value as? String, card)
        app.terminate()
        launch(language: "en", reset: false)
        tap(element("menu.continue"))
        tap(element("council.panel"))
        XCTAssertEqual(element("faction.hunters").value as? String, "20")
        XCTAssertFalse(element("council.negotiate.hunters").isEnabled)
        app.swipeUp(); app.swipeUp()
        capture("en-07-restored-council")
        XCTAssertEqual(app.alerts.count, 0)
    }

    private func element(_ id: String) -> XCUIElement {
        app.descendants(matching: .any).matching(identifier: id).firstMatch
    }
    @discardableResult private func capture(_ name: String) -> UIImage {
        let snapshot = app.screenshot().image
        let attachment = XCTAttachment(image: snapshot)
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
        return snapshot
    }
    private func top() {
        for _ in 0..<5 { app.swipeDown() }
    }
    private func reveal(_ target: XCUIElement, file: StaticString = #filePath, line: UInt = #line) {
        XCTAssertTrue(target.waitForExistence(timeout: 10), "Missing control", file: file, line: line)
        for _ in 0..<6 {
            if target.isHittable { break }
            app.swipeUp()
        }
        XCTAssertTrue(target.isHittable, "Control cannot be reached", file: file, line: line)
    }
    private func tap(_ target: XCUIElement, file: StaticString = #filePath, line: UInt = #line) {
        reveal(target, file: file, line: line)
        target.tap()
    }
    private func values() throws -> [String: Int] {
        top()
        return try Dictionary(uniqueKeysWithValues: stats.map { stat in
            let value = try XCTUnwrap(element("stat.\(stat)").value as? String)
            return (stat, try XCTUnwrap(Int(value)))
        })
    }
    private func launch(language: String, reset: Bool, extra: [String] = []) {
        app.launchArguments = ["--ui-testing", "-language", language, "-sound", extra.contains("--audio-smoke") ? "YES" : "NO", "-haptics", "NO"] + extra
        if reset { app.launchArguments.append("--reset-ui-test-save") }
        app.launch()
        XCTAssertTrue(app.wait(for: .runningForeground, timeout: 15))
        XCTAssertTrue(element("menu.newGame").waitForExistence(timeout: 15))
    }
    private func exercise(language: String) throws {
        launch(language: language, reset: true)
        XCTAssertFalse(element("menu.continue").exists)
        XCTAssertEqual(element("menu.newGame").label, language == "tr" ? "Yeni uygarlık" : "New civilization")
        capture("\(language)-01-main-menu")
        tap(element("menu.newGame"))
        XCTAssertTrue(element("card.title").waitForExistence(timeout: 10))
        XCTAssertEqual(element("game.turn").value as? String, "0")
        let cardTitle = element("card.title").label
        let before = try values()
        capture("\(language)-02-first-card")
        let choice = app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH %@", "choice.")).firstMatch
        tap(choice)
        XCTAssertTrue(element("result.title").waitForExistence(timeout: 10))
        XCTAssertEqual(element("result.title").label, cardTitle)
        let after = try values()
        XCTAssertEqual(element("game.turn").value as? String, "1")
        XCTAssertNotEqual(before, after, "A decision must update at least one displayed stat")
        for stat in stats where before[stat] != after[stat] {
            let delta = element("delta.\(stat)")
            // ScrollViews expose off-screen accessibility elements, so check the actual delta value.
            XCTAssertEqual(delta.value as? String, String(after[stat]! - before[stat]!))
        }
        capture("\(language)-03-result")

        // Kill with an unacknowledged result; the result and turn must survive a real relaunch.
        app.terminate()
        launch(language: language, reset: false)
        tap(element("menu.continue"))
        XCTAssertTrue(element("result.title").waitForExistence(timeout: 10))
        XCTAssertEqual(element("result.title").label, cardTitle)
        XCTAssertEqual(try values(), after)
        XCTAssertEqual(element("game.turn").value as? String, "1")
        capture("\(language)-04-restored-result")
        tap(element("result.continue"))
        XCTAssertTrue(element("card.title").waitForExistence(timeout: 10))
        let nextCard = element("card.title").value as? String
        XCTAssertNotNil(nextCard)
        top()
        tap(element("game.menu"))
        tap(element("menu.continue"))
        XCTAssertEqual(element("card.title").value as? String, nextCard)
        XCTAssertEqual(element("game.turn").value as? String, "1")
        capture("\(language)-05-resumed-card")
        XCTAssertEqual(app.alerts.count, 0, "Unexpected application error alert")
    }
}

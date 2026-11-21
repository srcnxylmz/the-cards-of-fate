import XCTest
@testable import FateCore

/// The 255 → 270 package on the real engine: late-game crises with visible causes and prepared answers,
/// and the first recorded historical milestone of Era 4 (a turning point, never an ending).
/// Era 4 is reached only by fixture; normal play cannot enter it while the gate is closed.
final class EmpireStrainTests: XCTestCase {
    private func engine() throws -> GameEngine { GameEngine(content: try .bundled()) }

    /// A province that meets every milestone condition except the record itself.
    private func enduring(_ e: GameEngine) throws -> (GameState, EraMilestone) {
        let milestone = try XCTUnwrap(e.content.balance.eraMilestones?.first)
        var s = e.start(seed: 270)
        s.era = 4; s.turn = 130
        s.stats = ["population": 50, "resources": 30, "authority": 10, "knowledge": 60, "stability": 60, "environment": 50]
        s.technologies = ["hearth", "cultivation", "smelting", "writing"]
        s.buildings = ["granary", "work_calendar"]
        s.flags = ["estate_fields_worked", "canal_fields_open", "harbor_fishery_licensed", "granary_register_kept",
                   "provincial_assembly_seats", "garrison_civil_oversight", "household_representation", "land_rights_registry"]
        for i in s.rivals.indices { s.rivals[i].relation = 30 }
        s.history = (0..<milestone.minimumEraDecisions).map {
            HistoryEntry(id: $0, turn: $0, era: 4, cardID: $0 == 0 ? milestone.completedAnyOf[0] : "legitimacy_oath", choiceID: "law", text: .init(tr: "Kayıt", en: "Record"))
        }
        s.currentCardID = "legitimacy_oath"
        return (s, milestone)
    }

    func testMilestoneIsRecordedOnceWhenEveryIndependentConditionHoldsAndTheRunContinues() throws {
        let e = try engine()
        let (s, milestone) = try enduring(e)
        XCTAssertEqual(e.milestoneConditions(milestone, in: s).filter { !$0.value }.map(\.key), [])
        let after = try e.choose("law", in: s)
        XCTAssertTrue(after.flags.contains(milestone.flag))
        XCTAssertNil(after.ending, "A historical milestone is not a victory and never ends the run")
        XCTAssertEqual(after.history.filter { $0.text == milestone.text }.count, 1)
        var again = e.acknowledge(after); again.currentCardID = "legitimacy_oath"; again.resolution = nil
        let twice = try e.choose("law", in: again)
        XCTAssertEqual(twice.history.filter { $0.text == milestone.text }.count, 1, "Recorded only once")
        XCTAssertEqual(try e.choose("law", in: s), try e.choose("law", in: JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(s))), "Replays after reload")
    }

    func testEveryConditionIsNecessaryAndNoSingleStatisticTriggersTheMilestone() throws {
        let e = try engine()
        let (base, milestone) = try enduring(e)
        let breaks: [(String, (inout GameState) -> Void)] = [
            ("residence", { $0.history.removeLast(2) }),
            ("economy", { $0.flags.subtract(["estate_fields_worked", "canal_fields_open", "harbor_fishery_licensed"]); $0.buildings = [] }),
            ("economy", { $0.stats["resources"] = milestone.minimumResources - 5 }),
            ("legitimacy", { $0.stats["stability"] = milestone.minimumStability - 10 }),
            ("legitimacy", { $0.flags.subtract(["provincial_assembly_seats", "garrison_civil_oversight"]) }),
            ("accord", { $0.rivals[0].relation = -60 }),
            ("rights", { $0.flags.remove("land_rights_registry") }),
            ("obligations", { $0.flags.insert("debased_coinage") }),
            ("history", { $0.history[0].cardID = "legitimacy_oath" })
        ]
        for (condition, apply) in breaks {
            var s = base; apply(&s)
            XCTAssertEqual(e.milestoneConditions(milestone, in: s)[condition], false, condition)
            XCTAssertFalse(try e.choose("law", in: s).flags.contains(milestone.flag), "\(condition) blocks the record")
        }
        // Legitimacy has two paths: personal authority can stand in for shared institutions.
        var personal = base
        personal.flags.subtract(["provincial_assembly_seats", "garrison_civil_oversight"])
        personal.stats["authority"] = milestone.minimumAuthority + 5
        XCTAssertEqual(e.milestoneConditions(milestone, in: personal)["legitimacy"], true)
        // Maximal statistics alone record nothing.
        var rich = e.start(seed: 270); rich.era = 4; rich.turn = 130; rich.currentCardID = "legitimacy_oath"
        for stat in Stat.allCases { rich.stats[stat.rawValue] = 100 }
        XCTAssertFalse(try e.choose("law", in: rich).flags.contains(milestone.flag))
    }

    func testMilestoneBelongsToEraFourOnly() throws {
        let e = try engine()
        var (s, milestone) = try enduring(e)
        s.era = 3
        s.currentCardID = e.content.cards.first { $0.era == 3 && $0.requirements.isEmpty && $0.choices.allSatisfy { $0.requirements.isEmpty } }?.id
        let card = try XCTUnwrap(e.content.card(s.currentCardID))
        XCTAssertFalse(try e.choose(card.choices[0].id, in: s).flags.contains(milestone.flag))
    }

    func testCrisesNeedTheirCauseAndStayDrawableWithRealChoicesThatReplay() throws {
        let e = try engine()
        let crises = e.content.cards[255..<270].filter { $0.eraRole == "recurring" }
        XCTAssertEqual(crises.count, 9)
        for crisis in crises {
            var calm = e.start(seed: 270); calm.era = 4
            calm.stats = ["population": 20, "resources": 0, "authority": 60, "knowledge": 40, "stability": 20, "environment": 50]
            XCTAssertFalse(crisis.requirements.allSatisfy { $0.matches(calm) }, "\(crisis.id) needs a cause")
            // The weakest state the cause allows: its minimum reserve, low order, no preparations.
            var s = calm
            s.flags = Set(crisis.requirements.compactMap(\.flag))
            for r in crisis.requirements { if let stat = r.stat { s.stats[stat.rawValue] = r.minimum ?? min(s.stats[stat.rawValue, default: 0], r.maximum ?? 100) } }
            s.currentCardID = crisis.id
            XCTAssertTrue(crisis.requirements.allSatisfy { $0.matches(s) }, crisis.id)
            let open = crisis.choices.filter { $0.available(in: s) }
            XCTAssertGreaterThanOrEqual(open.count, 2, "\(crisis.id) locks without preparations")
            for choice in open {
                XCTAssertEqual(try e.choose(choice.id, in: s), try e.choose(choice.id, in: JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(s))), "\(crisis.id).\(choice.id) replays after reload")
            }
        }
    }

    func testPreparationOpensACheaperAnswer() throws {
        let e = try engine()
        var s = e.start(seed: 270); s.era = 4; s.currentCardID = "border_campaign"
        s.stats = ["population": 60, "resources": 30, "authority": 30, "knowledge": 40, "stability": 40, "environment": 50]
        s.flags = ["granary_register_kept"]
        let border = try XCTUnwrap(e.content.card("border_campaign"))
        XCTAssertFalse(border.choices.first { $0.id == "garrison" }!.available(in: s), "No overseen garrison, no cheap defence")
        s.flags.insert("garrison_civil_oversight")
        let prepared = try e.choose("garrison", in: s), supplied = try e.choose("granary", in: s)
        XCTAssertGreaterThan(prepared.stats["resources", default: 0], supplied.stats["resources", default: 0], "The prepared garrison costs less than supplying from the granary")
        XCTAssertEqual(prepared.stats["population"], s.stats["population"], "and spends no villagers")
    }

    func testNewDebtsFallDueOnceAndCannotStack() throws {
        let e = try engine()
        var s = e.start(seed: 270); s.era = 4; s.currentCardID = "tax_farm_privilege"
        s.stats = ["population": 50, "resources": 40, "authority": 30, "knowledge": 40, "stability": 50, "environment": 50]
        let farmed = try e.choose("farm", in: s)
        XCTAssertTrue(farmed.flags.contains("tax_farm_contract"))
        XCTAssertFalse(e.content.card("tax_farm_privilege")!.choices.first { $0.id == "farm" }!.available(in: farmed), "One contract at a time")
        let due = try XCTUnwrap(farmed.delayed.first { $0.effect.removeFlags?.contains("tax_farm_contract") == true })
        XCTAssertEqual(due.effect.stats["resources"], -8)
        var later = farmed; later.resolution = nil; later.turn = due.dueTurn - 1; later.currentCardID = "legitimacy_oath"
        XCTAssertFalse(try e.choose("law", in: later).flags.contains("tax_farm_contract"))
    }

    func testFamineReliefHistoryReportsTheSharesCovered() throws {
        let e = try engine()
        var s = e.start(seed: 270); s.era = 4; s.currentCardID = "legitimacy_oath"
        s.stats = ["population": 50, "resources": 0, "authority": 50, "knowledge": 60, "stability": 50, "environment": 50]
        s.technologies = ["hearth", "cultivation", "smelting", "writing"]; s.buildings = []
        s.flags = ["grain_famine_store"]
        let after = try e.choose("law", in: s)
        let entry = try XCTUnwrap(after.history.first { $0.text.en.contains("public store was opened") })
        XCTAssertFalse(entry.text.en.contains("(food.relieved)"))
        XCTAssertFalse(entry.text.tr.contains("(food.relieved)"))
        XCTAssertTrue(entry.text.en.contains("covered \(e.foodBudget(in: s).relieved) shares"))
    }

    func testNormalPlayIsUnchangedByThe270Package() throws {
        let current = try ContentDatabase.bundled()
        var previous = current
        previous.cards = Array(current.cards.prefix(255))
        previous.balance.eraMilestones = nil
        let now = GameEngine(content: current), then = GameEngine(content: previous)
        for seed in UInt64(70)..<82 {
            var a = now.start(seed: seed), b = then.start(seed: seed)
            for _ in 0..<160 {
                XCTAssertEqual(a, b, "seed \(seed) turn \(a.turn)")
                guard a.ending == nil, let card = current.card(a.currentCardID) else { break }
                XCTAssertLessThanOrEqual(card.era, 3)
                let choice = card.choices.filter { $0.available(in: a) }.max { $0.id < $1.id }!
                a = now.acknowledge(try now.choose(choice.id, in: a))
                b = then.acknowledge(try then.choose(choice.id, in: b))
            }
        }
        XCTAssertFalse(current.eraContentReady(4))
        XCTAssertFalse(current.eraContentReady(5))
    }
}

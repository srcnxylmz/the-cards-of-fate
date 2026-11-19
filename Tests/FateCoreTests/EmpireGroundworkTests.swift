import XCTest
@testable import FateCore

/// Controlled Era 4 fixtures. These states are constructed directly: normal play cannot reach Era 4
/// while the readiness gate is closed (see EraReadinessTests).
final class EmpireGroundworkTests: XCTestCase {
    private func engine() throws -> GameEngine { GameEngine(content: try .bundled()) }
    private var empireIDs: [String] { (try? ContentDatabase.bundled().cards.filter { $0.era == 4 }.map(\.id)) ?? [] }

    private func fixture(_ id: String, _ e: GameEngine, seed: UInt64 = 195) -> GameState {
        var s = e.start(seed: seed)
        s.era = 4
        s.stats = Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, 60) })
        s.technologies.formUnion(["hearth", "cultivation", "smelting", "writing"])
        s.currentCardID = id
        return s
    }
    private func remember(_ cardID: String, _ e: GameEngine, _ s: inout GameState) {
        guard let source = e.content.card(cardID), let decision = source.choices.first else { return }
        s.history.append(.init(id: s.history.count, turn: s.turn, era: source.era, cardID: cardID, choiceID: decision.id, text: .init(tr: "Kayıt", en: "Record")))
        // A completed decision leaves its actual flags behind (first authored outcome).
        s.flags.formUnion(decision.outcomes[0].effect.flags)
    }
    private func satisfy(_ conditions: [Condition], _ e: GameEngine, _ s: inout GameState) {
        for c in conditions {
            if let card = c.completedCard { remember(card, e, &s) }
            if let stat = c.stat {
                if let min = c.minimum { s.stats[stat.rawValue] = max(s.stats[stat.rawValue]!, min) }
                if let max = c.maximum { s.stats[stat.rawValue] = min(s.stats[stat.rawValue]!, max) }
            }
            if let flag = c.flag { s.flags.insert(flag) }
            if let flag = c.absentFlag { s.flags.remove(flag) }
            if let tech = c.technology { s.technologies.insert(tech) }
        }
    }
    private func draw(_ id: String, _ original: GameState, _ e: GameEngine) -> GameState {
        var s = original
        s.currentCardID = nil
        s.resolution = Resolution(title: .init(tr: "x", en: "x"), text: .init(tr: "x", en: "x"), animation: "normal", changes: [:], previousEra: 4)
        s.discovered = Set(e.content.cards.map(\.id).filter { $0 != id }); s.lastSeen[id] = -10000
        let drawn = e.acknowledge(s)
        XCTAssertEqual(drawn.currentCardID, id, "Story conditions must be respected by the real selector")
        return drawn
    }
    private func roundtrip(_ s: GameState) throws -> GameState { try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(s)) }
    private func play(_ id: String, _ choice: String, _ s: GameState, _ e: GameEngine) throws -> GameState {
        var state = s; state.currentCardID = id; state.resolution = nil
        return e.acknowledge(try e.choose(choice, in: state))
    }

    func testEveryEraFourChoiceAndContextOutcomeIsSelectableAndReplayable() throws {
        let e = try engine()
        XCTAssertEqual(empireIDs.count, 15)
        for id in empireIDs {
            let card = try XCTUnwrap(e.content.card(id))
            for choice in card.choices {
                for outcome in choice.outcomes {
                    var s = fixture(id, e)
                    let required = card.requirements + choice.requirements + (outcome.requirements ?? [])
                    satisfy(required, e, &s)
                    // Isolate this context outcome: clear flags that only sibling outcomes require.
                    let keep = Set(required.compactMap(\.flag))
                    for sibling in choice.outcomes where sibling.id != outcome.id {
                        for flag in (sibling.requirements ?? []).compactMap(\.flag) where !keep.contains(flag) { s.flags.remove(flag) }
                    }
                    XCTAssertFalse(card.exclusionConditions.contains { $0.matches(s) }, id)
                    XCTAssertTrue(choice.available(in: s), "\(id).\(choice.id).\(outcome.id)")
                    s = draw(id, s, e)
                    let result = try e.choose(choice.id, in: s)
                    XCTAssertEqual(result, try e.choose(choice.id, in: roundtrip(s)), "\(id).\(choice.id) replay")
                    XCTAssertTrue(result.history.contains { $0.text == outcome.text }, "\(id).\(choice.id).\(outcome.id) resolved")
                    XCTAssertTrue(result.stats.values.allSatisfy { (0...100).contains($0) })
                    XCTAssertEqual(result.era, 4)
                    if card.exclusionConditions.contains(where: { $0.flag == "resolved_" + id }) {
                        XCTAssertTrue(card.exclusionConditions.contains { $0.matches(result) }, "\(id) closes after one use")
                    }
                }
            }
        }
    }

    func testPayingDecisionsAreUnavailableWithEmptyReserves() throws {
        let e = try engine()
        for id in empireIDs {
            let card = try XCTUnwrap(e.content.card(id))
            for choice in card.choices where choice.outcomes.contains(where: { $0.effect.stats["resources", default: 0] < 0 }) {
                var s = fixture(id, e)
                satisfy(card.requirements + choice.requirements, e, &s)
                s.stats["resources"] = 0
                XCTAssertFalse(choice.available(in: s), "\(id).\(choice.id) must not run without the reserve it pays")
            }
        }
    }

    func testPaidBondStaysClosedAndOpenBondSurvivesTheProvincialTransfer() throws {
        let e = try engine()
        var paid = fixture("bond_ledger_transfer", e)
        remember("bread_bond", e, &paid); paid.flags.remove("bread_bond_open"); paid.flags.insert("bread_bond_repaid")
        paid = draw("bond_ledger_transfer", paid, e)
        let carriedPaid = try e.choose("carry", in: paid)
        XCTAssertTrue(carriedPaid.flags.contains("bread_bond_repaid"))
        XCTAssertFalse(carriedPaid.flags.contains("bread_bond_open"), "A paid bond is never reopened")
        XCTAssertFalse(e.content.card("bond_ledger_transfer")!.choices.first { $0.id == "sell" }!.available(in: paid))

        var open = fixture("bond_ledger_transfer", e)
        remember("bread_bond", e, &open)
        XCTAssertTrue(open.flags.contains("bread_bond_open"))
        open = draw("bond_ledger_transfer", open, e)
        let carriedOpen = e.acknowledge(try e.choose("carry", in: open))
        XCTAssertTrue(carriedOpen.flags.contains("bread_bond_open"), "An open bond is neither forgiven nor enlarged")
        XCTAssertFalse(carriedOpen.flags.contains("tribute_arrears"))
        // Repaying it later closes it once and records the separate tribute note.
        var repaying = carriedOpen; repaying.stats["resources"] = 40
        let repaid = try play("tribute_assessment", "bread_first", repaying, e)
        XCTAssertTrue(repaid.flags.isSuperset(of: ["bread_bond_repaid", "tribute_arrears"]))
        XCTAssertFalse(repaid.flags.contains("bread_bond_open"))
        var settling = repaid; settling.stats["resources"] = 40
        let settled = try play("arrears_reckoning", "settle", settling, e)
        XCTAssertFalse(settled.flags.contains("tribute_arrears"))
        XCTAssertTrue(settled.flags.contains("bread_bond_repaid"))
        XCTAssertFalse(settled.flags.contains("bread_bond_open"))
        XCTAssertLessThan(settled.stats["resources", default: 0], settling.stats["resources", default: 0], "Settlement is paid from reserves")
    }

    func testTributeArrearsAreBoundedAtTwoTiersAndPartialPaymentKeepsTheFirstNote() throws {
        let e = try engine()
        let assessment = try XCTUnwrap(e.content.card("tribute_assessment"))
        var s = fixture("tribute_assessment", e)
        s = try play("tribute_assessment", "note", s, e)
        XCTAssertTrue(s.flags.contains("tribute_arrears")); XCTAssertFalse(s.flags.contains("tribute_arrears_deep"))
        s = try play("tribute_assessment", "note", s, e)
        XCTAssertTrue(s.flags.isSuperset(of: ["tribute_arrears", "tribute_arrears_deep"]))
        XCTAssertFalse(assessment.requirements.allSatisfy { $0.matches(s) }, "No third note can be stacked")
        XCTAssertFalse(e.content.card("governor_seat")!.choices.first { $0.id == "steward" }!.available(in: s), "Deep arrears block local autonomy")
        s.stats["resources"] = 30
        let partial = try play("arrears_reckoning", "partial", s, e)
        XCTAssertTrue(partial.flags.contains("tribute_arrears")); XCTAssertFalse(partial.flags.contains("tribute_arrears_deep"))
        let defaulted = try play("arrears_reckoning", "default", partial, e)
        XCTAssertFalse(defaulted.flags.contains("tribute_arrears"))
        XCTAssertTrue(defaulted.flags.contains("provincial_default_record"))
        XCTAssertLessThan(defaulted.stats["stability", default: 0], partial.stats["stability", default: 0])
    }

    func testLedgerStatesSwapWhileEarlierRightsSurvive() throws {
        let e = try engine()
        var s = fixture("governor_seat", e)
        s.flags.formUnion(["province_local_steward", "guest_citizenship", "public_care_settlement", "pasture_public_settlement"])
        s = try play("governor_seat", "receiver", s, e)
        XCTAssertTrue(s.flags.contains("province_central_receiver")); XCTAssertFalse(s.flags.contains("province_local_steward"))
        s = try play("residency_hearing", "restrict", s, e)
        XCTAssertTrue(s.flags.contains("restricted_provincial_residency"))
        XCTAssertTrue(s.flags.contains("recorded_provincial_dissent"), "Restricting old citizens is recorded as contested")
        XCTAssertTrue(s.flags.isSuperset(of: ["guest_citizenship", "public_care_settlement", "pasture_public_settlement"]), "Officials cannot silently revoke Bronze rights")
        s.stats["resources"] = 40
        s = try play("residency_hearing", "testimony", s, e)
        XCTAssertTrue(s.flags.contains("provincial_residency_hearing")); XCTAssertFalse(s.flags.contains("restricted_provincial_residency"))
        s.stats["resources"] = 40
        s = try play("road_wear", "stonework", s, e)
        XCTAssertTrue(s.flags.contains("imperial_road_maintained"))
        s = try play("road_wear", "wear", s, e)
        XCTAssertTrue(s.flags.contains("imperial_road_worn")); XCTAssertFalse(s.flags.contains("imperial_road_maintained"))
        XCTAssertFalse(e.content.card("garrison_supply")!.choices.first { $0.id == "road" }!.available(in: s), "A worn road gives no cheap convoy")
    }

    func testOldRecordsGiveHearingAdvantagesNotFreeResources() throws {
        let e = try engine()
        var s = fixture("aqueduct_quota", e)
        s.flags.insert("cistern_public_closed"); s.stats["environment"] = 50; s.stats["resources"] = 30
        let credited = try play("aqueduct_quota", "cistern", s, e)
        XCTAssertLessThan(credited.stats["resources", default: 0] , 30 + 1, "Credit reduces, never reverses, the levy")
        XCTAssertFalse(e.content.card("aqueduct_quota")!.choices.first { $0.id == "cistern" }!.available(in: credited), "The cistern credit is used once")
        var workshop = fixture("workshop_tender", e)
        workshop.flags.insert("mold_charter_closed"); workshop.stats["resources"] = 40
        for _ in 0..<3 {
            let before = workshop.stats["resources", default: 0]
            workshop = try play("workshop_tender", "charter", workshop, e)
            workshop.lastSeen = [:]
            XCTAssertLessThanOrEqual(workshop.stats["resources", default: 0], before + 0, "Charter bids pay up front each time")
        }
    }

    func testEraFourStateSurvivesSchemaOneSaveAndDeterministicReplay() throws {
        let e = try engine()
        var s = fixture("garrison_supply", e)
        s.stats["resources"] = 30
        s = try play("garrison_supply", "contract", s, e)
        XCTAssertFalse(s.delayed.isEmpty, "The supply installment is queued")
        let directory = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        defer { try? FileManager.default.removeItem(at: directory) }
        let service = PersistenceService(url: directory.appendingPathComponent("save.json"))
        try service.save(s)
        let loaded = try service.load()
        XCTAssertEqual(loaded, s)
        XCTAssertEqual(loaded.schemaVersion, 1)
        let card = try XCTUnwrap(e.content.card(loaded.currentCardID))
        let choice = try XCTUnwrap(card.choices.first { $0.available(in: loaded) })
        XCTAssertEqual(try e.choose(choice.id, in: loaded), try e.choose(choice.id, in: s))
    }

    func testFirstThreeErasPlayIdenticallyWithAndWithoutEraFourCards() throws {
        let full = try ContentDatabase.bundled()
        var legacy = full; legacy.cards = full.cards.filter { $0.era <= 3 }
        let a = GameEngine(content: full), b = GameEngine(content: legacy)
        var reachedBronze = 0
        for policy in ["progression", "random"] {
            for seed in UInt64(0)..<30 {
                var sa = a.start(seed: seed), sb = b.start(seed: seed)
                var ra = SeededRandom(state: seed &+ 0x9E37), rb = SeededRandom(state: seed &+ 0x9E37)
                for _ in 0..<300 {
                    XCTAssertEqual(sa, sb, "seed \(seed) \(policy)")
                    guard sa == sb, sa.ending == nil, let card = a.content.card(sa.currentCardID) else { break }
                    let ca = a.select(card.choices.filter { $0.available(in: sa) }, state: sa, policyName: policy, random: &ra)
                    let cb = b.select(card.choices.filter { $0.available(in: sb) }, state: sb, policyName: policy, random: &rb)
                    XCTAssertEqual(ca.id, cb.id)
                    sa = a.acknowledge(try a.choose(ca.id, in: sa))
                    sb = b.acknowledge(try b.choose(cb.id, in: sb))
                    XCTAssertLessThanOrEqual(sa.era, 3)
                }
                if sa.era == 3 { reachedBronze += 1 }
            }
        }
        XCTAssertGreaterThan(reachedBronze, 0, "The comparison must include Bronze runs at the Era 4 boundary")
    }
}

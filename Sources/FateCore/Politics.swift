import Foundation

public struct PoliticsRules: Codable {
    public var meetingInterval: Int
    public var actionCooldown: Int
    public var negotiationCost: Int
    public var negotiationGain: Int
    public var negotiationCeiling: Int
    public var allianceCost: Int
    public var allianceDuration: Int
    public var allianceRelation: Int
    public var supportRelation: Int
    public var hostileRelation: Int
    public var neutralRelation: Int
    public var legitimacyThreshold: Int
    public var legitimacyDefense: Int
    public var basePower: Int
    public var hostilePowerBonus: Int
    public var powerStatDivisor: Int
    public var supportDivisor: Int
    public var maximumSupport: Int
    public var coalitionBonus: Int
    public var successionCost: Int
    public var allianceSuccessionRelief: Int
    public var supportAuthority: Int
    public var supportAuthorityCeiling: Int
    public var powerStats: [String: [String: String]]

    public func validate() throws {
        let positive = [meetingInterval, actionCooldown, negotiationCost, negotiationGain, allianceCost,
                        allianceDuration, powerStatDivisor, supportDivisor, successionCost]
        let bounded = [negotiationCeiling, allianceRelation, supportRelation, neutralRelation, legitimacyThreshold,
                       legitimacyDefense, basePower, hostilePowerBonus, maximumSupport, coalitionBonus,
                       allianceSuccessionRelief, supportAuthority, supportAuthorityCeiling]
        guard positive.allSatisfy({ (1...100).contains($0) }), bounded.allSatisfy({ (0...100).contains($0) }),
              (-100...0).contains(hostileRelation), allianceSuccessionRelief < successionCost,
              allianceRelation <= supportRelation, supportRelation <= negotiationCeiling,
              (1...3).allSatisfy({ era in
                  let map = powerStats[String(era)] ?? [:]
                  return Set(map.keys) == Set(["hunters", "keepers"]) && map.values.allSatisfy { Stat(rawValue: $0) != nil }
              }) else { throw ContentError.invalidPolitics }
    }
}

public struct PoliticalState: Codable, Equatable {
    public var lastActionTurn: Int?
    public var allianceUntilTurn: Int?
}

public enum CouncilAction: Equatable {
    case negotiate(String)
    case alliance
}

extension GameEngine {
    public func hasAlliance(_ state: GameState) -> Bool {
        (state.politics?.allianceUntilTurn ?? -1) > state.turn
            && state.rivals.count >= 2
            && state.rivals.allSatisfy { $0.relation >= content.politics.allianceRelation }
    }

    public func councilActionAvailable(_ action: CouncilAction, in state: GameState, now: Date = Date()) -> Bool {
        let rules = content.politics
        guard state.ending == nil, state.resolution == nil, state.currentCardID != nil,
              state.mode != .weekly || state.weekID == WeeklyChallenge.id(at: now),
              state.turn - (state.politics?.lastActionTurn ?? -rules.actionCooldown) >= rules.actionCooldown else { return false }
        switch action {
        case .negotiate(let id):
            return state.stats["resources", default: 0] >= rules.negotiationCost
                && state.rivals.contains { $0.id == id && $0.relation < rules.negotiationCeiling }
        case .alliance:
            return !hasAlliance(state) && state.rivals.count >= 2
                && state.stats["resources", default: 0] >= rules.allianceCost
                && state.stats["stability", default: 0] >= rules.legitimacyThreshold
                && state.rivals.allSatisfy { $0.relation >= rules.allianceRelation }
        }
    }

    /// A paid, cooldown-limited political transaction; never advances score, time or RNG.
    public func council(_ action: CouncilAction, in original: GameState, now: Date = Date()) throws -> GameState {
        guard councilActionAvailable(action, in: original, now: now) else { throw ContentError.unavailableChoice }
        var state = original
        let rules = content.politics
        var politics = state.politics ?? PoliticalState()
        politics.lastActionTurn = state.turn
        let text: LocalizedText
        switch action {
        case .negotiate(let id):
            guard let index = state.rivals.firstIndex(where: { $0.id == id }) else { throw ContentError.unavailableChoice }
            state.stats["resources", default: 0] -= rules.negotiationCost
            state.rivals[index].relation = min(rules.negotiationCeiling, state.rivals[index].relation + rules.negotiationGain)
            let name = state.rivals[index].identity(in: state.era).name
            text = .init(tr: "\(name.tr) ile ortak çalışma için kaynak ayırdın; güven arttı.", en: "You funded joint work with \(name.en); trust improved.")
        case .alliance:
            state.stats["resources", default: 0] -= rules.allianceCost
            politics.allianceUntilTurn = state.turn + rules.allianceDuration
            text = .init(tr: "Meclis uzlaşısı kuruldu. İlişkiler korunursa \(rules.allianceDuration) tur sürecek.", en: "A council pact was agreed. It lasts \(rules.allianceDuration) turns while relations hold.")
        }
        guard let card = content.card(state.currentCardID), card.choices.contains(where: { $0.available(in: state) }) else {
            throw ContentError.unavailableChoice
        }
        state.politics = politics
        state.history.append(.init(id: state.history.count, turn: state.turn, era: state.era, cardID: nil, choiceID: nil, text: text))
        return state
    }

    public func councilDefense(_ state: GameState) -> Int {
        let rules = content.politics
        let support = state.rivals.filter { $0.relation >= rules.supportRelation }.reduce(0) { $0 + $1.power / rules.supportDivisor }
        let legitimacy = state.stats["stability", default: 0] >= rules.legitimacyThreshold ? rules.legitimacyDefense : 0
        return state.stats["authority", default: 0] + min(rules.maximumSupport, support) + legitimacy
    }

    func updateFactionPower(_ state: inout GameState) {
        let rules = content.politics
        for i in state.rivals.indices {
            let rival = state.rivals[i]
            let stat = rules.powerStats[String(state.era)]?[rival.id] ?? "stability"
            let target = min(100, max(0, rules.basePower + state.stats[stat, default: 0] / rules.powerStatDivisor
                + (rival.relation <= rules.hostileRelation ? rules.hostilePowerBonus : 0)))
            state.rivals[i].power += target == rival.power ? 0 : (target > rival.power ? 1 : -1)
        }
    }
}

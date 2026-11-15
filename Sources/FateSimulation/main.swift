import Foundation
import FateCore

let content = try ContentDatabase.bundled()
let engine = GameEngine(content: content)
let arguments = Array(CommandLine.arguments.dropFirst())
func option(_ name: String) -> String? {
    guard let index = arguments.firstIndex(of: name), index + 1 < arguments.count else { return nil }
    return arguments[index + 1]
}
enum UsageError: Error { case invalidArguments }
guard let count = Int(arguments.first ?? "10000"), (1...1_000_000).contains(count) else { throw UsageError.invalidArguments }
let policyName = option("--policy") ?? "random"
let manageCouncil = arguments.contains("--manage-council")
guard ["random", "survival", "knowledge"].contains(policyName) else { throw UsageError.invalidArguments }
// Heuristics inspect only the current event's authored effects; never peek at RNG or future cards.
func utility(_ effect: Effect, state: GameState) -> Double {
    var score = 0.0
    for stat in Stat.allCases {
        let current = state.stats[stat.rawValue, default: 0]
        let delta = min(100, max(0, current + effect.stats[stat.rawValue, default: 0])) - current
        let weight: Double
        switch stat {
        case .population: weight = current < 25 ? 5 : 0.8
        case .resources: weight = current < 25 ? 4 : 1.4
        case .stability: weight = current < 20 ? 2.5 : 0.4
        case .environment: weight = current < 20 ? 2.5 : 0.4
        case .authority: weight = current < 15 ? 1 : 0.25
        case .knowledge: weight = policyName == "knowledge" ? 3 : 0.3
        }
        score += Double(delta) * weight
    }
    if !state.buildings.contains("granary") && effect.buildings.contains("granary") { score += 25 }
    if policyName == "knowledge" {
        score += Double(effect.technologies.filter { !state.technologies.contains($0) }.count) * 12
    }
    return score
}
func select(_ choices: [Choice], state: GameState, random: inout SeededRandom) -> Choice {
    if policyName == "random" { return choices[Int(random.next() % UInt64(choices.count))] }
    return choices.enumerated().max { lhs, rhs in
        func score(_ choice: Choice) -> Double {
            utility(choice.immediateEffects, state: state) + zip(choice.outcomes, engine.outcomeProbabilities(for: choice, in: state)).reduce(0) { partial, pair in
                partial + pair.1 * utility(pair.0.effect, state: state)
            }
        }
        let a = score(lhs.element), b = score(rhs.element)
        return a == b ? lhs.offset > rhs.offset : a < b
    }!.element
}
var turns: [Int] = []
var reached: [String: Int] = [:]
var endings: [String: Int] = [:]
var seen: Set<String> = []
var repeated = 0
var repeatedByCard: [String: Int] = [:]
var earlyRepeated = 0
var earlyDecisions = 0
var decisions = 0
var capped = 0
var totalResources = 0
var totalRivalPower = 0
var totalLeaderTurns = 0
var exileRuns = 0
var authorityLoss: [String: Int] = [:]
var authorityGain: [String: Int] = [:]
var exileTriggers: [String: Int] = [:]
var decisionCounts: [String: Int] = [:]
var hostileAtCap = 0
var politicalActions = 0
for seed in 0..<count {
    var state = engine.start(seed: UInt64(seed))
    var policy = SeededRandom(state: UInt64(seed) ^ 0xD00D)
    var hadExile = false
    for _ in 0..<500 {
        guard state.ending == nil, let card = content.card(state.currentCardID) else { break }
        let isRepeat = state.history.contains(where: { $0.cardID == card.id })
        if isRepeat { repeated += 1; repeatedByCard[card.id, default: 0] += 1 }
        if state.turn < 20 {
            earlyDecisions += 1
            if isRepeat { earlyRepeated += 1 }
        }
        // Optional experiment, kept separate from unchanged baseline policies.
        if manageCouncil && state.stats["resources", default: 0] >= 35 {
            if engine.councilActionAvailable(.alliance, in: state) {
                state = try engine.council(.alliance, in: state); politicalActions += 1
            } else if let rival = state.rivals.sorted(by: { $0.relation == $1.relation ? $0.id < $1.id : $0.relation < $1.relation }).first,
                      rival.relation < content.politics.supportRelation,
                      engine.councilActionAvailable(.negotiate(rival.id), in: state) {
                state = try engine.council(.negotiate(rival.id), in: state); politicalActions += 1
            }
        }
        let choices = card.choices.filter { $0.available(in: state) }
        let choice = select(choices, state: state, random: &policy)
        let decisionKey = "\(card.id).\(choice.id)"
        decisionCounts[decisionKey, default: 0] += 1
        var lastAuthority = state.stats["authority", default: 0]
        var zeroStage = "already_zero"
        let previousLeadership = state.leadership
        state = try engine.choose(choice.id, in: state) { stage, snapshot in
            let current = snapshot.stats["authority", default: 0]
            let key = stage == "card" ? "card:\(decisionKey)" : stage
            let delta = current - lastAuthority
            if delta < 0 { authorityLoss[key, default: 0] -= delta }
            if delta > 0 { authorityGain[key, default: 0] += delta }
            if current == 0 && lastAuthority > 0 { zeroStage = key }
            lastAuthority = current
        }
        if state.leadership == .exile && previousLeadership != .exile { exileTriggers[zeroStage, default: 0] += 1 }
        if state.rivals.contains(where: { $0.power == 100 && $0.relation < 20 }) { hostileAtCap += 1 }
        hadExile = hadExile || state.leadership == .exile
        decisions += 1
        totalResources += state.stats["resources", default: 0]
        totalRivalPower += state.rivals.map(\.power).max() ?? 0
        precondition(Stat.allCases.allSatisfy { (0...100).contains(state.stats[$0.rawValue, default: -1]) })
        state = engine.acknowledge(state)
    }
    if state.ending == nil { capped += 1 }
    turns.append(state.turn)
    totalLeaderTurns += state.leaderTurns
    if hadExile { exileRuns += 1 }
    for era in 1...state.era { reached[String(era), default: 0] += 1 }
    endings[state.ending?.en ?? "simulation_cap", default: 0] += 1
    seen.formUnion(state.discovered)
}
let report: [String: Any] = [
    "runs": count, "policy": policyName, "engine": "FateCore Swift (production core)",
    "managesCouncil": manageCouncil, "politicalActions": politicalActions,
    "seedRange": "0..<\(count)", "turnCap": 500, "contentCardCount": content.cards.count,
    "averageTurns": Double(turns.reduce(0,+))/Double(count), "minTurns": turns.min()!, "maxTurns": turns.max()!,
    "eraReachCounts": reached, "endings": endings, "uniqueCardsSeen": seen.count,
    "repeatRate": Double(repeated)/Double(max(1,decisions)), "cappedRuns": capped,
    "repeatDecisionsByCard": repeatedByCard,
    "first20TurnsRepeatRate": Double(earlyRepeated)/Double(max(1,earlyDecisions)),
    "meanResources": Double(totalResources)/Double(max(1,decisions)),
    "meanStrongestRival": Double(totalRivalPower)/Double(max(1,decisions)),
    "meanLeaderTurns": Double(totalLeaderTurns)/Double(count), "runsWithExile": exileRuns,
    "authorityLossBySource": authorityLoss, "authorityGainBySource": authorityGain,
    "exileTransitionsByTrigger": exileTriggers, "decisionCounts": decisionCounts,
    "decisionsWithHostilePowerAtCap": hostileAtCap,
    "limitation": "Small development deck; capped runs are censored observations, not confirmed endings. Heuristic policies do not establish human skill balance or session duration."
]
let data = try JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys])
if let output = option("--output") {
    try data.write(to: URL(fileURLWithPath: output), options: .atomic)
    print("Saved \(count) \(policyName) simulations to \(output)")
} else { print(String(decoding: data, as: UTF8.self)) }

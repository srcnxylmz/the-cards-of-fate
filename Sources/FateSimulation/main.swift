import Foundation
import FateCore

let arguments = Array(CommandLine.arguments.dropFirst())
func option(_ name: String) -> String? {
    guard let index = arguments.firstIndex(of: name), index + 1 < arguments.count else { return nil }
    return arguments[index + 1]
}
enum UsageError: Error { case invalidArguments }
guard let count = Int(arguments.first ?? "10000"), (1...1_000_000).contains(count) else { throw UsageError.invalidArguments }
let policyName = option("--policy") ?? "random"
let manageCouncil = arguments.contains("--manage-council")
guard ["random", "survival", "knowledge", "progression"].contains(policyName) else { throw UsageError.invalidArguments }
var content = try ContentDatabase.bundled()
if let path = option("--cards") {
    content.cards = try JSONDecoder().decode([CardEvent].self, from: Data(contentsOf: URL(fileURLWithPath: path)))
    guard !content.cards.isEmpty, Set(content.cards.map(\.id)).count == content.cards.count else { throw UsageError.invalidArguments }
}
let engine = GameEngine(content: content)
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
var technologyGains: [String: Int] = [:]
var technologyTurnSums: [String: Int] = [:]
var transitionBlocks: [String: Int] = [:]
var transitionAttempts: [String: Int] = [:]
var transitionStatSums: [String: Int] = [:]
var transitionCounts: [String: Int] = [:]
var eligibleUnselected: [String: Int] = [:]
var firstEligibleTurnSums: [String: Int] = [:]
var firstEligibleCounts: [String: Int] = [:]
var firstSelectedTurnSums: [String: Int] = [:]
var firstSelectedCounts: [String: Int] = [:]
var firstEraDecisionCosts: [String: Int] = [:]
for seed in 0..<count {
    var state = engine.start(seed: UInt64(seed))
    var policy = SeededRandom(state: UInt64(seed) ^ 0xD00D)
    var hadExile = false
    var eligibilitySeen: Set<String> = []
    var selectionSeen: Set<String> = []
    for _ in 0..<500 {
        guard state.ending == nil, let card = content.card(state.currentCardID) else { break }
        for event in content.cards where event.era == state.era {
            let eligible = event.requirements.allSatisfy { $0.matches(state) }
                && !event.exclusionConditions.contains { $0.matches(state) }
                && event.choices.filter { $0.available(in: state) }.count >= 2
                && (event.id == card.id || state.turn - state.lastSeen[event.id, default: -10000] >= event.cooldown)
            if eligible {
                if event.id != card.id { eligibleUnselected[event.id, default: 0] += 1 }
                if eligibilitySeen.insert(event.id).inserted {
                    firstEligibleTurnSums[event.id, default: 0] += state.turn
                    firstEligibleCounts[event.id, default: 0] += 1
                }
            }
        }
        if selectionSeen.insert(card.id).inserted {
            firstSelectedTurnSums[card.id, default: 0] += state.turn
            firstSelectedCounts[card.id, default: 0] += 1
        }
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
        let choice = engine.select(choices, state: state, policyName: policyName, random: &policy)
        let decisionKey = "\(card.id).\(choice.id)"
        decisionCounts[decisionKey, default: 0] += 1
        var lastAuthority = state.stats["authority", default: 0]
        var zeroStage = "already_zero"
        let previousLeadership = state.leadership
        let previousTechnologies = state.technologies
        let previousEra = state.era
        let resourcesBefore = state.stats["resources", default: 0]
        var preTransition = state
        state = try engine.choose(choice.id, in: state) { stage, snapshot in
            if stage == "card" && previousEra == 1 {
                firstEraDecisionCosts[card.id, default: 0] += resourcesBefore - snapshot.stats["resources", default: 0]
            }
            if stage == "succession" { preTransition = snapshot }
            let current = snapshot.stats["authority", default: 0]
            let key = stage == "card" ? "card:\(decisionKey)" : stage
            let delta = current - lastAuthority
            if delta < 0 { authorityLoss[key, default: 0] -= delta }
            if delta > 0 { authorityGain[key, default: 0] += delta }
            if current == 0 && lastAuthority > 0 { zeroStage = key }
            lastAuthority = current
        }
        for technology in state.technologies.subtracting(previousTechnologies) {
            technologyGains[technology, default: 0] += 1
            technologyTurnSums[technology, default: 0] += state.turn
        }
        if previousEra < 3, let era = content.eras.first(where: { $0.id == previousEra }) {
            let key = String(previousEra)
            transitionAttempts[key, default: 0] += 1
            if !preTransition.technologies.contains(era.requiredTechnology) { transitionBlocks[key + ".technology", default: 0] += 1 }
            if preTransition.stats["knowledge", default: 0] < era.knowledgeThreshold { transitionBlocks[key + ".knowledge", default: 0] += 1 }
            if preTransition.stats["stability", default: 0] < era.stabilityThreshold { transitionBlocks[key + ".stability", default: 0] += 1 }
            if preTransition.stats["population", default: 0] < era.populationThreshold { transitionBlocks[key + ".population", default: 0] += 1 }
            if preTransition.ending != nil { transitionBlocks[key + ".ended", default: 0] += 1 }
            if state.era > previousEra {
                transitionCounts[key, default: 0] += 1
                for stat in ["resources", "knowledge", "stability", "population"] {
                    transitionStatSums[key + "." + stat, default: 0] += preTransition.stats[stat, default: 0]
                }
            }
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
    "technologyGains": technologyGains, "technologyAcquisitionTurnSums": technologyTurnSums,
    "transitionAttempts": transitionAttempts, "transitionBlockObservations": transitionBlocks,
    "successfulTransitionCounts": transitionCounts, "preTransitionStatSums": transitionStatSums,
    "eligibleButUnselectedDecisions": eligibleUnselected,
    "firstEligibleCounts": firstEligibleCounts, "firstEligibleTurnSums": firstEligibleTurnSums,
    "firstSelectedCounts": firstSelectedCounts, "firstSelectedTurnSums": firstSelectedTurnSums,
    "era1NetImmediateResourceCostsByCard": firstEraDecisionCosts,
    "limitation": "Small development deck; capped runs are censored observations, not confirmed endings. Heuristic policies do not establish human skill balance or session duration."
]
let data = try JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys])
if let output = option("--output") {
    try data.write(to: URL(fileURLWithPath: output), options: .atomic)
    print("Saved \(count) \(policyName) simulations to \(output)")
} else { print(String(decoding: data, as: UTF8.self)) }

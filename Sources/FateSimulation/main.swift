import Foundation
import FateCore
import FateDiagnostics

let arguments = Array(CommandLine.arguments.dropFirst())
func option(_ name: String) -> String? {
    guard let index = arguments.firstIndex(of: name), index + 1 < arguments.count else { return nil }
    return arguments[index + 1]
}
enum UsageError: Error { case invalidArguments }
guard let count = Int(arguments.first ?? "10000"), (1...1_000_000).contains(count) else { throw UsageError.invalidArguments }
let policyName = option("--policy") ?? "random"
let manageCouncil = arguments.contains("--manage-council")
let collectSeeds = arguments.contains("--seed-observations")
var seedObservations:[[String:Any]]=[]
var managedCouncilChanges:[String:Int]=[:]
guard ["random", "survival", "knowledge", "progression", "recovery"].contains(policyName) else { throw UsageError.invalidArguments }
var content = try ContentDatabase.bundled()
if let path = option("--cards") {
    content.cards = try JSONDecoder().decode([CardEvent].self, from: Data(contentsOf: URL(fileURLWithPath: path)))
    guard !content.cards.isEmpty, Set(content.cards.map(\.id)).count == content.cards.count else { throw UsageError.invalidArguments }
}
let engine = GameEngine(content: content)
var developmentTotals: [String:Int] = [:]
var crisisTotals: [String:Int] = [:]
var resolvedOutcomes: [String:Int] = [:]
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
var metalLoss: [String: Int] = [:]
var metalDecisionCounts: [String: Int] = [:]
var metalAcquisitionStats: [String: Int] = [:]
var metalBlockedRuns: [String: Int] = [:]
var eraDecisions: [String:Int] = [:], eraRepeats: [String:Int] = [:]
var lateDecisions: [String:Int] = [:], lateRepeats: [String:Int] = [:]
var eraStatSums: [String:Int] = [:], stageGains: [String:Int] = [:], stageLosses: [String:Int] = [:]
var capEras: [String:Int] = [:], capChoices: [String:Int] = [:], capStatRanges: [String:Int] = [:]
var capDistinctCards = 0, capPendingConsequences = 0, reaches100 = 0

for seed in 0..<count {
    var crisis = CrisisDiagnostics()
    var development = DevelopmentDiagnostics()
    var state = engine.start(seed: UInt64(seed))
    var policy = SeededRandom(state: UInt64(seed) ^ 0xD00D)
    var hadExile = false
    var eligibilitySeen: Set<String> = []
    var selectionSeen: Set<String> = []
    var tailStates:[[String:Int]] = []
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
        let eraKey=String(state.era)
        eraDecisions[eraKey,default:0] += 1
        let isRepeat = state.history.contains(where: { $0.cardID == card.id })
        if isRepeat { eraRepeats[eraKey,default:0] += 1 }
        if state.turn>=100 {
            lateDecisions[eraKey,default:0] += 1
            if isRepeat { lateRepeats[eraKey,default:0] += 1 }
        }
        for stat in Stat.allCases { eraStatSums[eraKey+"."+stat.rawValue,default:0] += state.stats[stat.rawValue,default:0] }
        if isRepeat { repeated += 1; repeatedByCard[card.id, default: 0] += 1 }
        if state.turn < 20 {
            earlyDecisions += 1
            if isRepeat { earlyRepeated += 1 }
        }
        // Optional experiment, kept separate from unchanged baseline policies.
        let councilStatsBefore=state.stats
        var actionKind:String?
        if manageCouncil && state.stats["resources", default: 0] >= 35 {
            if engine.councilActionAvailable(.alliance, in: state) {
                state = try engine.council(.alliance, in: state); politicalActions += 1; actionKind="alliance"
            } else if let rival = state.rivals.sorted(by: { $0.relation == $1.relation ? $0.id < $1.id : $0.relation < $1.relation }).first,
                      rival.relation < content.politics.supportRelation,
                      engine.councilActionAvailable(.negotiate(rival.id), in: state) {
                state = try engine.council(.negotiate(rival.id), in: state); politicalActions += 1; actionKind="negotiate"
            }
        }
        if let action=actionKind { for stat in Stat.allCases { let change=state.stats[stat.rawValue,default:0]-councilStatsBefore[stat.rawValue,default:0]; if change != 0 { managedCouncilChanges[eraKey+"."+action+"."+stat.rawValue+"."+(change<0 ? "loss":"gain"),default:0] += abs(change) } } }
        let choices = card.choices.filter { $0.available(in: state) }
        let choice = policyName == "recovery" ? engine.selectRecovery(choices,state:state) : engine.select(choices, state: state, policyName: policyName, random: &policy)
        crisis.begin(state,card:card,choice:choice)
        development.begin(state,card:card,choice:choice)
        let decisionKey = "\(card.id).\(choice.id)"
        decisionCounts[decisionKey, default: 0] += 1
        var lastAuthority = state.stats["authority", default: 0]
        var zeroStage = "already_zero"
        let previousLeadership = state.leadership
        let previousTechnologies = state.technologies
        let previousEra = state.era
        let resourcesBefore = state.stats["resources", default: 0]
        var preTransition = state
        var stageStats = state.stats
        let trackingMetal = previousEra == 2 && previousTechnologies.contains("smelting")
        if trackingMetal { metalDecisionCounts[decisionKey, default: 0] += 1 }
        state = try engine.choose(choice.id, in: state) { stage, snapshot in
            crisis.observe(stage,state:snapshot,era:previousEra)
            development.observe(stage,state:snapshot,era:previousEra)
            if trackingMetal {
                for stat in ["population", "stability", "resources"] {
                    let loss = stageStats[stat, default: 0] - snapshot.stats[stat, default: 0]
                    if loss > 0 { metalLoss["\(stage == "card" ? decisionKey : stage).\(stat)", default: 0] += loss }
                }
            }
            for stat in Stat.allCases {
                let delta=snapshot.stats[stat.rawValue,default:0]-stageStats[stat.rawValue,default:0]
                let key=eraKey+"."+stage+"."+stat.rawValue
                if delta<0 { stageLosses[key,default:0] -= delta }
                if delta>0 { stageGains[key,default:0] += delta }
            }
            stageStats = snapshot.stats
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
        crisis.endDecision(state)
        if let text = state.resolution?.text, let outcome = choice.outcomes.first(where: { $0.text == text }) { resolvedOutcomes[decisionKey+"."+outcome.id,default:0] += 1; crisis.recordOutcome(key:decisionKey+"."+outcome.id) }
        for technology in state.technologies.subtracting(previousTechnologies) {
            technologyGains[technology, default: 0] += 1
            technologyTurnSums[technology, default: 0] += state.turn
            if technology == "smelting" {
                for stat in ["resources", "population", "stability", "knowledge"] {
                    metalAcquisitionStats[stat, default: 0] += state.stats[stat, default: 0]
                }
            }
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
        tailStates.append(state.stats)
        if tailStates.count>80 { tailStates.removeFirst() }
        state = engine.acknowledge(state)
    }
    if state.turn>=100 { reaches100 += 1 }
    if state.ending == nil {
        capped += 1; capEras[String(state.era),default:0] += 1
        let tail=state.history.filter { $0.cardID != nil }.suffix(80)
        capDistinctCards += Set(tail.compactMap(\.cardID)).count
        capPendingConsequences += state.delayed.count
        for entry in tail { capChoices[(entry.cardID ?? "")+"."+(entry.choiceID ?? ""),default:0] += 1 }
        for stat in Stat.allCases {
            let values=tailStates.map{$0[stat.rawValue,default:0]}
            capStatRanges[stat.rawValue+".minimum",default:0] += values.min() ?? 0
            capStatRanges[stat.rawValue+".maximum",default:0] += values.max() ?? 0
            capStatRanges[stat.rawValue+".final",default:0] += state.stats[stat.rawValue,default:0]
        }
    }
    if state.era == 2 && state.technologies.contains("smelting"), let era = content.eras.first(where: { $0.id == 2 }) {
        metalBlockedRuns["total", default: 0] += 1
        for (stat, threshold) in [("knowledge", era.knowledgeThreshold), ("population", era.populationThreshold), ("stability", era.stabilityThreshold)] {
            if state.stats[stat, default: 0] < threshold { metalBlockedRuns[stat, default: 0] += 1 }
        }
        if state.stats["resources"] == 0 { metalBlockedRuns["emptyStores", default: 0] += 1 }
    }
    crisis.finish(state)
    development.finish(state)
    if collectSeeds { seedObservations.append(["seed":seed,"decisions":state.turn,"era":state.era,"capped":state.ending == nil,"stats":state.stats,"mechanism":development.counts.keys.sorted().first{$0.contains(".terminal")} ?? (state.ending == nil ? "cap":"other")]) }
    for (key,value) in development.counts { developmentTotals[key,default:0] += value }
    for (key,value) in crisis.counts { crisisTotals[key,default:0] += value }
    turns.append(state.turn)
    totalLeaderTurns += state.leaderTurns
    if hadExile { exileRuns += 1 }
    for era in 1...state.era { reached[String(era), default: 0] += 1 }
    endings[state.ending?.en ?? "simulation_cap", default: 0] += 1
    seen.formUnion(state.discovered)
}
let sortedTurns=turns.sorted()
let report: [String: Any] = [
    "developmentDiagnostics":developmentTotals,
    "crisisDiagnostics":crisisTotals,"resolvedOutcomeCounts":resolvedOutcomes,
    "eraDecisionCounts":eraDecisions,"eraRepeatCounts":eraRepeats,"lateEraDecisions":lateDecisions,"lateEraRepeats":lateRepeats,
    "eraStatSums":eraStatSums,"stageStatGains":stageGains,"stageStatLosses":stageLosses,
    "capsByEra":capEras,"cappedLast80ChoiceCounts":capChoices,"cappedLast80StatRangeSums":capStatRanges,
    "cappedLast80DistinctCardSum":capDistinctCards,"cappedPendingConsequences":capPendingConsequences,
    "runsReaching100":reaches100,"turnQuantiles":["p50":sortedTurns[count/2],"p90":sortedTurns[min(count-1,count*9/10)],"p99":sortedTurns[min(count-1,count*99/100)]],
    "runs": count, "policy": policyName, "engine": "FateCore Swift (production core)",
    "managedCouncilChanges":managedCouncilChanges,"seedObservations":seedObservations,
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
    "postSmeltingLossBySource": metalLoss, "postSmeltingDecisionCounts": metalDecisionCounts,
    "smeltingAcquisitionStatSums": metalAcquisitionStats, "smeltingWithoutBronzeFinalBlockers": metalBlockedRuns,
    "limitation": "Small development deck; capped runs are censored observations, not confirmed endings. Heuristic policies do not establish human skill balance or session duration."
]
let data = try JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys])
if let output = option("--output") {
    try data.write(to: URL(fileURLWithPath: output), options: .atomic)
    print("Saved \(count) \(policyName) simulations to \(output)")
} else { print(String(decoding: data, as: UTF8.self)) }

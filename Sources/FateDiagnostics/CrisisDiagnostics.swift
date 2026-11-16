import Foundation
import FateCore

// Observations only: never mutates a run, its RNG or any policy.
public struct CrisisDiagnostics {
    public init() {}
    public var counts: [String: Int] = [:]
    var bronzeTurn = 0
    var windowCards: [Int: Set<String>] = [:]
    var windowChoices: [Int: Set<String>] = [:]
    var windowRepeats: [Int: Int] = [:]
    var lateCards: Set<String> = [], lateChoices: Set<String> = []
    var episodeStart: Int?
    var episodeEra = 0
    var episodes: [String: Int] = [:]
    var priorStats: [String: Int] = [:]
    var reserveStart: Int?
    var reserveEra = 0
    var reserveEpisodes: [String: Int] = [:]
    var hungerRecoveryTurn: Int?
    var reserveRecoveryTurn: Int?

    public mutating func begin(_ s: GameState, card: CardEvent, choice: Choice) {
        priorStats = s.stats
        hungerRecoveryTurn = nil; reserveRecoveryTurn = nil
        let era = String(s.era)
        if s.stats["resources"] == 0 { counts[era+".emptyAtDecision", default: 0] += 1 }
        let due = s.delayed.filter { $0.dueTurn <= s.turn+1 && $0.minimumEra <= s.era }
        let owed = due.reduce(0) { $0 + max(0, -$1.effect.stats["resources", default: 0]) }
        counts[era+".dueResourceDebits", default: 0] += owed
        if owed > s.stats["resources", default: 0] { counts[era+".dueDebitsExceedReserve", default: 0] += 1 }
        if s.era == 3 {
            bronzeTurn += 1
            let repeated = s.history.contains { $0.cardID == card.id }
            for limit in [20,40,80] where bronzeTurn <= limit {
                let key = "bronze.first\(limit)"
                counts[key+".decisions", default: 0] += 1
                if repeated { counts[key+".repeats", default: 0] += 1 }
                if repeated { windowRepeats[limit, default: 0] += 1 }
                windowCards[limit, default: []].insert(card.id)
                windowChoices[limit, default: []].insert(card.id+"."+choice.id)
            }
            if bronzeTurn > 100 {
                counts["bronze.after100.decisions", default: 0] += 1
                if repeated { counts["bronze.after100.repeats", default: 0] += 1 }
                lateCards.insert(card.id); lateChoices.insert(card.id+"."+choice.id)
            }
            let band = s.stats["environment", default: 0] / 25
            counts["bronze.ecologyBand\(band).decisions", default: 0] += 1
            counts["bronze.ecologyBand\(band).resources", default: 0] += s.stats["resources", default: 0]
            if s.stats["population", default: 0] < 25 { counts["bronze.lowWorkforceDecisions", default: 0] += 1 }
            if s.rivals.contains(where: { $0.relation < 20 && $0.power > 60 }) { counts["bronze.hostilePowerDecisions", default: 0] += 1 }
        }
    }
    public mutating func observe(_ stage: String, state s: GameState, era: Int) {
        let key = String(era)
        let old = priorStats["resources", default: 0], current = s.stats["resources", default: 0]
        if old > 0 && current == 0 { counts[key+".reserveEmptiedBy."+stage, default: 0] += 1 }
        if stage == "world" {
            let loss = max(0, priorStats["population", default: 0]-s.stats["population", default: 0])
            if current == 0 { counts[key+".emptyWorldTurns", default: 0] += 1 }
            if current == 0 && reserveStart == nil {
                reserveStart = s.turn; reserveEra = era; reserveEpisodes[key+".started", default: 0] += 1
            } else if current > 0 && reserveStart != nil {
                reserveRecoveryTurn = s.turn
            }
            if loss > 0 {
                counts[key+".starvationTurns", default: 0] += 1
                counts[key+".starvationPopulationLoss", default: 0] += loss
                if episodeStart == nil { episodeStart = s.turn; episodeEra = era; episodes[key+".started", default: 0] += 1 }
            } else if episodeStart != nil {
                hungerRecoveryTurn = s.turn
            }
        }
        priorStats = s.stats
    }
    // World-stage silence alone is not recovery: a card or the council may end the run.
    public mutating func endDecision(_ s: GameState) {
        guard s.ending == nil, s.stats["population",default:0] > 0 else { return }
        if let turn = hungerRecoveryTurn, let start = episodeStart {
            let key = String(episodeEra)
            episodes[key+".recovered",default:0] += 1
            episodes[key+".recoveryTurnSum",default:0] += turn-start
            episodes[key+".recoveredWithin\(turn-start <= 3 ? "3" : "Later")",default:0] += 1
            episodeStart = nil
        }
        if let turn = reserveRecoveryTurn, let start = reserveStart {
            let key = String(reserveEra)
            reserveEpisodes[key+".recovered",default:0] += 1
            reserveEpisodes[key+".recoveryTurnSum",default:0] += turn-start
            reserveStart = nil
        }
        hungerRecoveryTurn = nil; reserveRecoveryTurn = nil
    }
    public mutating func finish(_ s: GameState) {
        if let start = reserveStart {
            let key = String(reserveEra)
            reserveEpisodes[key+(s.ending == nil ? ".censored" : ".endedUnrecovered"), default: 0] += 1
            reserveEpisodes[key+".unrecoveredObservedTurns", default: 0] += s.turn-start+1
        }
        if let start = episodeStart {
            let key = String(episodeEra)
            episodes[key+(s.ending == nil ? ".censored" : ".endedUnrecovered"), default: 0] += 1
            episodes[key+".unrecoveredObservedTurns", default: 0] += s.turn-start+1
        }
        if bronzeTurn > 0 { counts["bronze.runs", default: 0] += 1 }
        for limit in [20,40,80] where bronzeTurn > 0 {
            let key = "bronze.first\(limit)"
            counts[key+".runs", default: 0] += 1
            if bronzeTurn >= limit {
                counts[key+".reachedWindow", default: 0] += 1
                counts[key+".complete.decisions", default: 0] += limit
                counts[key+".complete.repeats", default: 0] += windowRepeats[limit, default: 0]
                counts[key+".complete.distinctCardSum", default: 0] += windowCards[limit, default: []].count
                counts[key+".complete.distinctChoiceSum", default: 0] += windowChoices[limit, default: []].count
            }
            counts[key+".distinctCardSum", default: 0] += windowCards[limit, default: []].count
            counts[key+".distinctChoiceSum", default: 0] += windowChoices[limit, default: []].count
        }
        if bronzeTurn > 100 {
            counts["bronze.after100.runs", default: 0] += 1
            counts["bronze.after100.distinctCardSum", default: 0] += lateCards.count
            counts["bronze.after100.distinctChoiceSum", default: 0] += lateChoices.count
        }
        for (key, value) in episodes { counts["hungerEpisodes."+key, default: 0] += value }
        for (key, value) in reserveEpisodes { counts["reserveEpisodes."+key, default: 0] += value }
        func ordered(_ steps: [(String, Set<String>)]) -> Bool {
            var index = 0
            for entry in s.history where index < steps.count {
                if entry.cardID == steps[index].0, let choice = entry.choiceID, steps[index].1.contains(choice) { index += 1 }
            }
            return index == steps.count
        }
        let paths: [String: [(String, Set<String>)]] = [
            "pasture.shared": [("herd_truce",["share"]),("pasture_pledge",["honor","rotate"]),("grazing_appeal",["rotation","credit"])],
            "pasture.private": [("herd_truce",["guard"]),("pasture_pledge",["enclose"]),("grazing_appeal",["lease"])],
            "repair.shared": [("flint_fragments",["stock"]),("potter_lease",["commons"]),("copper_recast",["common"]),("mold_audit",["partners","charter"])],
            "repair.private": [("flint_fragments",["barter"]),("potter_lease",["trial","repairers"]),("copper_recast",["repair","trial"]),("mold_audit",["lease","charter"])],
            "water.preserved": [("salmon_weir",["open"]),("reed_bank",["buffer"]),("roof_cistern",["reeds"]),("cistern_account",["inherited","audit"])],
            "water.built": [("salmon_weir",["open"]),("reed_bank",["build"]),("roof_cistern",["filter"]),("cistern_account",["current","audit"])]
        ]
        for (name, steps) in paths where ordered(steps) { counts["completedChains."+name, default: 0] += 1 }
    }
}

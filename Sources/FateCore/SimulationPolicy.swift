import Foundation

// Diagnostic policies use current authored choices and expected weights, never future RNG draws.
extension GameEngine {
    private func utility(_ effect: Effect, state: GameState, policyName: String) -> Double {
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
        if policyName == "progression", let era = content.eras.first(where: { $0.id == state.era }) {
            let goal = era.requiredTechnology
            if !state.technologies.contains(goal) && effect.technologies.contains(goal) { score += 65 }
            for (stat, target) in [("knowledge", era.knowledgeThreshold), ("stability", era.stabilityThreshold), ("population", era.populationThreshold)] {
                let current = state.stats[stat, default: 0]
                let delta = effect.stats[stat, default: 0]
                // Value only the remaining deficit, not accumulating knowledge forever.
                if current < target { score += Double(min(target-current, max(0, delta))) * 3 }
            }
        }
        return score
    }
    public func select(_ choices: [Choice], state: GameState, policyName: String, random: inout SeededRandom) -> Choice {
        precondition(!choices.isEmpty)
        if policyName == "random" { return choices[Int(random.next() % UInt64(choices.count))] }
        return choices.enumerated().max { lhs, rhs in
            func score(_ choice: Choice) -> Double {
                utility(choice.immediateEffects, state: state, policyName: policyName) + zip(choice.outcomes, outcomeProbabilities(for: choice, in: state)).reduce(0) { partial, pair in
                    partial + pair.1 * (utility(pair.0.effect, state: state, policyName: policyName) + (policyName == "progression" ? pair.0.delayedEffects.reduce(0) { $0 + 0.35 * utility($1.effect, state: state, policyName: policyName) } : 0))
                }
            }
            let a = score(lhs.element), b = score(rhs.element)
            return a == b ? lhs.offset > rhs.offset : a < b
        }!.element
    }
}

import Foundation

public struct FoodBudget: Equatable {
    public let production: Int
    public let consumption: Int
    public let shortfall: Int
    public var populationLoss: Int { shortfall == 0 ? 0 : (maximumLoss * shortfall + consumption - 1) / consumption }
    public var stabilityLoss: Int { shortfall == 0 ? 0 : (4 * shortfall + consumption - 1) / consumption }
    let maximumLoss: Int
}

extension GameEngine {
    /// One source of truth for the food actually available this turn, before reserve consumption.
    public func foodBudget(in state: GameState, unfundedResources: Int = 0) -> FoodBudget {
        let balance = content.balance
        let granary = state.buildings.contains("granary")
        let fields = state.technologies.contains("cultivation")
        let base = granary || fields ? balance.farmProduction : 0
        let storage = granary && fields ? 1 : 0
        let irrigation = base > 0 && state.technologies.contains("irrigation")
            ? balance.farmProduction * state.stats["environment", default: 0] / 100 : 0
        let calendar = base > 0 && state.stats["environment", default: 0] > 0 && state.buildings.contains("work_calendar") ? 1 : 0
        let terrace = irrigation > 0 && state.buildings.contains("terrace") ? 1 : 0
        // Provincial capacities only work while their flag stands, enough hands remain and the land still bears.
        let provincial = base == 0 ? 0 : (balance.provincialProduction ?? []).filter {
            state.era >= $0.minimumEra && state.flags.contains($0.flag)
            && state.stats["population", default: 0] >= $0.minimumPopulation
            && state.stats["environment", default: 0] >= $0.minimumEnvironment
        }.reduce(0) { $0 + $1.yield }
        // Total production never exceeds ordinary consumption: capacity can end hunger, never print reserves.
        let production = min(balance.resourceConsumption, base + storage + irrigation + calendar + terrace + provincial)
        let consumption = balance.resourceConsumption + (state.mode == .hard ? balance.hardExtraConsumption : 0)
        // Outlays that could not be paid from reserves use this turn's supplies first.
        // This prevents clamped maintenance costs becoming free healing at zero reserves.
        let shortfall = min(consumption, max(0, consumption + max(0,unfundedResources) - production - state.stats["resources", default: 0]))
        return FoodBudget(production: production, consumption: consumption, shortfall: shortfall, maximumLoss: balance.starvationLoss)
    }
}

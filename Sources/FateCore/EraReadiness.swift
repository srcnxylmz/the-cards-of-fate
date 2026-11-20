import Foundation

/// Explicit content-readiness gate for an era. Authored cards alone never open an era:
/// the gate must be enabled *and* the authored inventory must meet every minimum.
/// Optional on `EraDefinition`, so eras without a gate keep their earlier behavior.
public struct EraContentGate: Codable, Equatable {
    /// Separate approval switch. Default content ships with `false`.
    public var enabled: Bool
    public var minimumCards: Int
    public var minimumRecurring: Int
    public var minimumConclusions: Int
    public var minimumBridges: Int
    /// Conflict domains (card categories) that the recurring pool must cover.
    public var requiredRecurringCategories: [String]
}

/// Disjoint inventory of an era's authored events. A card is counted in at most one group.
public struct EraInventory: Equatable {
    public var total: Int
    public var recurring: Int
    public var conclusions: Int
    public var bridges: Int
    public var recurringCategories: Set<String>

    public func missingCategories(for gate: EraContentGate) -> [String] {
        gate.requiredRecurringCategories.filter { !recurringCategories.contains($0) }
    }
    public func satisfies(_ gate: EraContentGate) -> Bool {
        total >= gate.minimumCards && recurring >= gate.minimumRecurring
            && conclusions >= gate.minimumConclusions && bridges >= gate.minimumBridges
            && missingCategories(for: gate).isEmpty
    }
}

extension ContentDatabase {
    public func inventory(era: Int) -> EraInventory {
        var inventory = EraInventory(total: 0, recurring: 0, conclusions: 0, bridges: 0, recurringCategories: [])
        for card in cards where card.era == era {
            inventory.total += 1
            switch card.eraRole {
            // A recurring crisis must not close itself after one use.
            case "recurring"? where !card.exclusionConditions.contains(where: { $0.flag == "resolved_\(card.id)" }):
                inventory.recurring += 1
                inventory.recurringCategories.insert(card.category)
            case "conclusion"? where card.storyChainId != nil:
                inventory.conclusions += 1
            case "bridge"? where !card.requirements.isEmpty:
                inventory.bridges += 1
            default:
                break
            }
        }
        return inventory
    }

    /// True when normal play may enter `era`. Unauthored eras are always closed;
    /// gated eras additionally require explicit enablement and a complete inventory.
    public func eraContentReady(_ era: Int) -> Bool {
        guard cards.contains(where: { $0.era == era }) else { return false }
        guard let gate = eras.first(where: { $0.id == era })?.contentGate else { return true }
        return gate.enabled && inventory(era: era).satisfies(gate)
    }

    /// Diagnostic only (FateSimulation `--diagnostic-open-era`). Returns a copy whose gate for `era`
    /// is forced open regardless of approval and inventory, so an unfinished era can be measured
    /// without shipping it. The receiver is unchanged; the app and saved games never call this.
    public func diagnosticallyOpened(era: Int) -> ContentDatabase {
        var copy = self
        guard let index = copy.eras.firstIndex(where: { $0.id == era }),
              var gate = copy.eras[index].contentGate else { return copy }
        gate.enabled = true
        gate.minimumCards = 0; gate.minimumRecurring = 0; gate.minimumConclusions = 0; gate.minimumBridges = 0
        gate.requiredRecurringCategories = []
        copy.eras[index].contentGate = gate
        return copy
    }

    /// Events a player can currently reach through normal era progression.
    public var playableCards: [CardEvent] {
        var open: Set<Int> = [1]
        var era = 2
        while era <= 12, eraContentReady(era) { open.insert(era); era += 1 }
        return cards.filter { open.contains($0.era) }
    }
}

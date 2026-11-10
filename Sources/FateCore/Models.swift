import Foundation

public struct LocalizedText: Codable, Equatable {
    public var tr: String
    public var en: String
    public func value(_ language: String) -> String { language == "en" ? en : tr }
}

public enum Stat: String, Codable, CaseIterable {
    case population, resources, authority, knowledge, stability, environment
}

public struct Condition: Codable, Equatable {
    public var stat: Stat?
    public var minimum: Int?
    public var maximum: Int?
    public var flag: String?
    public var absentFlag: String?
    public var faction: String? = nil
    public var relationMinimum: Int? = nil
    public var relationMaximum: Int? = nil
    public var leadership: Leadership? = nil
    public var technology: String? = nil
    public var building: String? = nil
    public func matches(_ state: GameState) -> Bool {
        if let technology, !state.technologies.contains(technology) { return false }
        if let building, !state.buildings.contains(building) { return false }
        if let faction {
            guard let rival = state.rivals.first(where: { $0.id == faction }) else { return false }
            if let relationMinimum, rival.relation < relationMinimum { return false }
            if let relationMaximum, rival.relation > relationMaximum { return false }
        }
        if let leadership, state.leadership != leadership { return false }
        if let stat {
            let value = state.stats[stat.rawValue, default: 0]
            if let minimum, value < minimum { return false }
            if let maximum, value > maximum { return false }
        }
        if let flag, !state.flags.contains(flag) { return false }
        if let absentFlag, state.flags.contains(absentFlag) { return false }
        return true
    }
}

public struct Effect: Codable, Equatable {
    public var stats: [String: Int]
    public var flags: [String]
    public var technologies: [String]
    public var buildings: [String]
    public var rivalRelation: Int
    /// Optional so existing v1 saved consequences remain decodable.
    public var rivalRelations: [String: Int]? = nil
    public static let empty = Effect(stats: [:], flags: [], technologies: [], buildings: [], rivalRelation: 0)
}

public struct DelayedEffect: Codable, Equatable {
    public var afterTurns: Int
    public var minimumEra: Int
    public var text: LocalizedText
    public var effect: Effect
}

public struct Outcome: Codable, Equatable, Identifiable {
    public var id: String
    public var probability: Double
    public var affinity: Stat?
    public var text: LocalizedText
    public var effect: Effect
    public var delayedEffects: [DelayedEffect]
    public var animationPreset: String
}

public struct Choice: Codable, Equatable, Identifiable {
    public var id: String
    public var text: LocalizedText
    public var risk: LocalizedText
    public var requirements: [Condition]
    public var immediateEffects: Effect
    public var outcomes: [Outcome]
    public func available(in state: GameState) -> Bool { requirements.allSatisfy { $0.matches(state) } }
}

public struct CardEvent: Codable, Equatable, Identifiable {
    public var id: String
    public var era: Int
    public var category: String
    public var title: LocalizedText
    public var description: LocalizedText
    public var artAsset: String
    public var artDirection: String
    public var rarity: String
    public var weight: Int
    public var requirements: [Condition]
    public var exclusionConditions: [Condition]
    public var choices: [Choice]
    public var worldFlags: [String]
    public var storyChainId: String?
    public var animationPreset: String
    public var soundCue: String
    public var cooldown: Int
    public var localizationKeys: [String]
}

public struct EraDefinition: Codable, Identifiable {
    public var id: Int
    public var name: LocalizedText
    public var settlement: LocalizedText
    public var government: LocalizedText
    public var requiredTechnology: String
    public var knowledgeThreshold: Int
    public var stabilityThreshold: Int
    public var populationThreshold: Int
    public var palette: String
    public var artDirection: String
}

public struct Balance: Codable {
    public var startingStats: [String: Int]
    public var resourceConsumption: Int
    public var hardExtraConsumption: Int
    public var farmProduction: Int
    public var starvationLoss: Int
    public var successionTurns: Int
    public var rivalPressure: Int
}

public struct HistoryEntry: Codable, Equatable, Identifiable {
    public var id: Int
    public var turn: Int
    public var era: Int
    public var cardID: String?
    public var choiceID: String?
    public var text: LocalizedText
}

public struct ScheduledConsequence: Codable, Equatable {
    public var dueTurn: Int
    public var minimumEra: Int
    public var text: LocalizedText
    public var effect: Effect
}

public struct Rival: Codable, Equatable, Identifiable {
    public var id: String
    public var name: LocalizedText
    public var motivation: LocalizedText
    public var power: Int
    public var relation: Int
}

public enum RunMode: String, Codable { case story, hard, weekly, unrankedWeekly }
public enum Leadership: String, Codable { case contender, ruler, exile }

public struct Resolution: Codable, Equatable {
    public var title: LocalizedText
    public var text: LocalizedText
    public var animation: String
    public var changes: [String: Int]
    public var previousEra: Int
    /// Optional for compatibility with existing v1 saves.
    public var consequences: [LocalizedText]?
}

public struct GameState: Codable, Equatable {
    public var schemaVersion = 1
    public var seed: UInt64
    public var random: SeededRandom
    public var mode: RunMode
    public var weekID: String?
    public var turn = 0
    public var era = 1
    public var stats: [String: Int]
    public var flags: Set<String> = []
    public var technologies: Set<String> = []
    public var buildings: Set<String> = []
    public var history: [HistoryEntry] = []
    public var delayed: [ScheduledConsequence] = []
    public var lastSeen: [String: Int] = [:]
    public var discovered: Set<String> = []
    public var currentCardID: String?
    public var resolution: Resolution?
    public var leadership: Leadership = .contender
    public var generation = 1
    public var leaderTurns = 0
    public var consecutiveLeaderTurns = 0
    public var longestLeadership = 0
    public var ending: LocalizedText?
    public var rivals: [Rival]
    /// Nil in existing schema-v1 saves; introduced only when a political action is taken.
    public var politics: PoliticalState? = nil

    public init(seed: UInt64, mode: RunMode, weekID: String?, balance: Balance) {
        self.seed = seed
        self.random = SeededRandom(state: seed)
        self.mode = mode
        self.weekID = weekID
        self.stats = balance.startingStats
        self.rivals = [
            Rival(id: "hunters", name: .init(tr: "Avcılar Meclisi", en: "Council of Hunters"), motivation: .init(tr: "Güvenli av yolları", en: "Safe hunting grounds"), power: 35, relation: 0),
            Rival(id: "keepers", name: .init(tr: "Hafıza Koruyucuları", en: "Keepers of Memory"), motivation: .init(tr: "Geleneği yaşatmak", en: "Preserve tradition"), power: 25, relation: 10)
        ]
    }
}

import Foundation

public struct ContentDatabase {
    public var cards: [CardEvent]
    public var eras: [EraDefinition]
    public var balance: Balance
    public var politics: PoliticsRules
    public init(cards: [CardEvent], eras: [EraDefinition], balance: Balance, politics: PoliticsRules) {
        self.cards = cards; self.eras = eras; self.balance = balance; self.politics = politics
    }
    public static func bundled() throws -> ContentDatabase {
        func read<T: Decodable>(_ name: String, as: T.Type) throws -> T {
            guard let url = Bundle.module.url(forResource: name, withExtension: "json") else {
                throw ContentError.missing(name)
            }
            return try JSONDecoder().decode(T.self, from: Data(contentsOf: url))
        }
        let politics = try read("politics", as: PoliticsRules.self)
        try politics.validate()
        return try .init(cards: read("cards", as: [CardEvent].self), eras: read("eras", as: [EraDefinition].self), balance: read("balance", as: Balance.self), politics: politics)
    }
    public func card(_ id: String?) -> CardEvent? { cards.first { $0.id == id } }
}
public enum ContentError: Error { case missing(String), unavailableChoice, awaitingAcknowledgment, noCurrentCard, finished, weeklyExpired, invalidPolitics }

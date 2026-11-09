import Foundation

public enum SaveError: Error { case unsupportedVersion(Int), invalidState }

public struct PersistenceService {
    public let url: URL
    public init(url: URL) { self.url = url }
    public func save(_ state: GameState) throws {
        try validate(state)
        try FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
        let data = try JSONEncoder().encode(state)
        try data.write(to: url, options: .atomic)
    }
    public func load() throws -> GameState {
        let data = try Data(contentsOf: url)
        // Inspect version before decoding, so future schemas never silently reset a run.
        struct Header: Decodable { var schemaVersion: Int }
        let version = try JSONDecoder().decode(Header.self, from: data).schemaVersion
        guard version == 1 else { throw SaveError.unsupportedVersion(version) }
        let state = try JSONDecoder().decode(GameState.self, from: data)
        try validate(state)
        return state
    }
    private func validate(_ state: GameState) throws {
        guard state.schemaVersion == 1 else { throw SaveError.unsupportedVersion(state.schemaVersion) }
        guard (1...12).contains(state.era), state.turn >= 0,
              Stat.allCases.allSatisfy({ (0...100).contains(state.stats[$0.rawValue, default: -1]) }),
              !(state.currentCardID != nil && state.resolution != nil) else { throw SaveError.invalidState }
    }
}

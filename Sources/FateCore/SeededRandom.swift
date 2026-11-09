import Foundation

/// SplitMix64. Wrapping arithmetic and explicit state make replays portable.
public struct SeededRandom: Codable, Equatable {
    public var state: UInt64
    public init(state: UInt64) { self.state = state }
    public mutating func next() -> UInt64 {
        state &+= 0x9E3779B97F4A7C15
        var z = state
        z = (z ^ (z >> 30)) &* 0xBF58476D1CE4E5B9
        z = (z ^ (z >> 27)) &* 0x94D049BB133111EB
        return z ^ (z >> 31)
    }
    public mutating func unit() -> Double { Double(next() >> 11) / 9_007_199_254_740_992 }
}

public enum WeeklyChallenge {
    public static func start(containing date: Date) -> Date {
        var calendar = Calendar(identifier: .iso8601)
        calendar.timeZone = TimeZone(secondsFromGMT: 0)!
        return calendar.dateInterval(of: .weekOfYear, for: date)!.start
    }
    public static func id(at date: Date) -> String {
        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .iso8601)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: start(containing: date))
    }
    public static func seed(at date: Date) -> UInt64 {
        id(at: date).utf8.reduce(UInt64(14695981039346656037)) { ($0 ^ UInt64($1)) &* 1099511628211 }
    }
}

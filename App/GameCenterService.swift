import GameKit
import SwiftUI
import FateCore

/// Client scores are best-effort. This interface is the seam for a future verified backend.
@MainActor
final class GameCenterService: ObservableObject {
    struct Pending: Codable { var week: String; var turns: Int }
    @Published var entries: [GKLeaderboard.Entry] = []
    @Published var ownEntry: GKLeaderboard.Entry?
    @Published var status = ""
    @Published var authenticationController: UIViewController?
    private let leaderboardID = "fate.weekly.survival"
    private let pendingKey = "gamecenter.pending.v1"
    private var sending = false

    func authenticate() {
        GKLocalPlayer.local.authenticateHandler = { [weak self] controller, error in
            Task { @MainActor in
                guard let self else { return }
                self.authenticationController = controller
                self.status = error?.localizedDescription ?? ""
                if GKLocalPlayer.local.isAuthenticated { await self.refresh(); await self.flush() }
            }
        }
    }
    func queueScore(turns: Int, week: String) {
        guard week == WeeklyChallenge.id(at: Date()) else { return }
        let old = pending()
        let value = Pending(week: week, turns: old?.week == week ? max(turns, old?.turns ?? 0) : turns)
        if let data = try? JSONEncoder().encode(value) { UserDefaults.standard.set(data, forKey: pendingKey) }
        Task { await flush() }
    }
    private func pending() -> Pending? {
        guard let data = UserDefaults.standard.data(forKey: pendingKey) else { return nil }
        return try? JSONDecoder().decode(Pending.self, from: data)
    }
    private func flush() async {
        guard !sending, GKLocalPlayer.local.isAuthenticated, let score = pending() else { return }
        guard score.week == WeeklyChallenge.id(at: Date()) else {
            UserDefaults.standard.removeObject(forKey: pendingKey); return
        }
        sending = true
        defer { sending = false }
        do {
            // Load the currently active occurrence immediately before submission.
            let boards = try await GKLeaderboard.loadLeaderboards(IDs: [leaderboardID])
            guard let board = boards.first, let start = board.startDate,
                  start == WeeklyChallenge.start(containing: Date()), board.duration == 604800,
                  start <= Date(), start.addingTimeInterval(board.duration) > Date(),
                  WeeklyChallenge.id(at: start) == score.week else { return }
            try await board.submitScore(score.turns, context: 0, player: GKLocalPlayer.local)
            if let current = pending(), current.week == score.week, current.turns <= score.turns {
                UserDefaults.standard.removeObject(forKey: pendingKey)
            }
        } catch { status = error.localizedDescription }
    }
    func refresh() async {
        guard GKLocalPlayer.local.isAuthenticated else { return }
        do {
            guard let board = try await GKLeaderboard.loadLeaderboards(IDs: [leaderboardID]).first else { return }
            let result = try await board.loadEntries(for: .global, timeScope: .allTime, range: NSRange(location: 1, length: 25))
            ownEntry = result.0; entries = result.1
        } catch { status = error.localizedDescription }
    }
}

private struct AuthenticationView: UIViewControllerRepresentable {
    let controller: UIViewController
    func makeUIViewController(context: Context) -> UIViewController { controller }
    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}

struct LeaderboardView: View {
    @ObservedObject var service: GameCenterService
    var language: String
    var body: some View {
        List {
            Text(language == "en" ? "Week of \(WeeklyChallenge.id(at: Date())) · UTC" : "Hafta: \(WeeklyChallenge.id(at: Date())) · UTC")
            Button(language == "en" ? "Connect Game Center" : "Game Center’a bağlan") { service.authenticate() }
            if let own = service.ownEntry { Text("\(language == "en" ? "Your rank" : "Sıran"): \(own.rank) · \(own.score)") }
            ForEach(service.entries, id: \.rank) { entry in
                HStack {
                    Text("\(entry.rank)").foregroundStyle(entry.rank == 1 ? .yellow : entry.rank == 2 ? .gray : entry.rank == 3 ? .orange : .primary)
                    Text(entry.player.displayName); Spacer(); Text("\(entry.score)")
                }
            }
            if service.entries.isEmpty { Text(language == "en" ? "No scores loaded. Offline play remains available. App Store Connect setup is required." : "Skor yüklenmedi. Çevrimdışı oyun kullanılabilir. App Store Connect kurulumu gereklidir.") }
            if !service.status.isEmpty { Text(service.status).font(.caption) }
        }
        .navigationTitle(language == "en" ? "Weekly standings" : "Haftalık sıralama")
        .refreshable { await service.refresh() }
        .sheet(isPresented: Binding(get: { service.authenticationController != nil }, set: { if !$0 { service.authenticationController = nil } })) {
            if let controller = service.authenticationController { AuthenticationView(controller: controller) }
        }
    }
}

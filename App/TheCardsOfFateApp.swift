import SwiftUI
import FateCore

@main
struct TheCardsOfFateApp: App {
    var body: some Scene {
        WindowGroup { RootView().modifier(UITestAccessibility()) }
    }
}

@MainActor
final class GameStore: ObservableObject {
    @Published var state: GameState?
    @Published var error: String?
    @Published var inGame = false
    @Published var content: ContentDatabase?
    private let saveDirectory: URL
    let feedback = FeedbackService()
    let gameCenter = GameCenterService()
    private var engine: GameEngine?

    init() {
        let directory = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        #if DEBUG
        let testing = ProcessInfo.processInfo.arguments.contains("--ui-testing")
        saveDirectory = directory.appendingPathComponent(testing ? "TheCardsOfFate-UITests" : "TheCardsOfFate")
        #else
        saveDirectory = directory.appendingPathComponent("TheCardsOfFate")
        #endif
        do {
            #if DEBUG
            if testing && ProcessInfo.processInfo.arguments.contains("--reset-ui-test-save") {
                for name in ["story-v1.json", "weekly-v1.json"] {
                    let file = saveDirectory.appendingPathComponent(name)
                    if FileManager.default.fileExists(atPath: file.path) { try FileManager.default.removeItem(at: file) }
                }
            }
            #endif
            let database = try ContentDatabase.bundled()
            content = database; engine = GameEngine(content: database)
            let lastMode = UserDefaults.standard.string(forKey: "lastRunMode")
            let slot: RunMode = (lastMode == "weekly" || lastMode == "unrankedWeekly") ? .weekly : .story
            let service = persistence(for: slot)
            if FileManager.default.fileExists(atPath: service.url.path) {
                let loaded = try service.load()
                if let id = loaded.currentCardID, database.card(id) == nil {
                    throw ContentError.noCurrentCard
                }
                state = loaded
            }
        } catch { self.error = String(describing: error) }
    }

    private func persistence(for mode: RunMode) -> PersistenceService {
        PersistenceService(url: saveDirectory.appendingPathComponent(mode == .weekly || mode == .unrankedWeekly ? "weekly-v1.json" : "story-v1.json"))
    }
    func hasSave(_ mode: RunMode) -> Bool { FileManager.default.fileExists(atPath: persistence(for: mode).url.path) }
    func resume(_ mode: RunMode) {
        do {
            let loaded = try persistence(for: mode).load()
            if let id = loaded.currentCardID, content?.card(id) == nil { throw ContentError.noCurrentCard }
            state = loaded; inGame = true
            UserDefaults.standard.set(mode.rawValue, forKey: "lastRunMode")
        } catch { self.error = String(describing: error) }
    }

    func start(_ mode: RunMode) {
        guard let engine else { return }
        var seed = UInt64.random(in: 0...UInt64.max) // Only new story creation uses system entropy.
        #if DEBUG
        if ProcessInfo.processInfo.arguments.contains("--ui-testing") { seed = 42 }
        #endif
        var initial = engine.start(seed: seed, mode: mode)
        #if DEBUG
        let arguments = ProcessInfo.processInfo.arguments
        if arguments.contains("--ui-testing"), let index = arguments.firstIndex(of: "--ui-test-card"), index + 1 < arguments.count,
           ["sacred_fire", "river_tracks", "first_granary"].contains(arguments[index + 1]),
           let card = content?.card(arguments[index + 1]) {
            initial.era = card.era; initial.currentCardID = card.id
            initial.discovered.insert(card.id); initial.lastSeen[card.id] = initial.turn
        }
        #endif
        commit(initial)
        if error == nil { inGame = true }
    }

    @discardableResult func choose(_ choice: Choice, sound: Bool, haptics: Bool) -> Bool {
        guard let state, let engine else { return false }
        do {
            let next = try engine.choose(choice.id, in: state)
            guard commit(next) else { return false }
            feedback.play(preset: next.resolution?.animation ?? "normal", sound: sound, haptics: haptics)
            if next.mode == .weekly, let week = next.weekID {
                gameCenter.queueScore(turns: next.turn, week: week)
            }
            return true
        } catch { self.error = String(describing: error); return false }
    }

    func acknowledge() {
        guard let state, let engine else { return }
        commit(engine.acknowledge(state))
    }

    func council(_ action: CouncilAction) {
        guard let state, let engine else { return }
        do { commit(try engine.council(action, in: state)) }
        catch { self.error = String(describing: error) }
    }

    func canCouncil(_ action: CouncilAction) -> Bool {
        guard let state, let engine else { return false }
        return engine.councilActionAvailable(action, in: state)
    }

    func convertExpiredChallenge() {
        guard var next = state, next.mode == .weekly else { return }
        next.mode = .unrankedWeekly
        next.weekID = nil
        commit(next)
    }

    @discardableResult private func commit(_ next: GameState) -> Bool {
        do {
            try persistence(for: next.mode).save(next)
            UserDefaults.standard.set(next.mode.rawValue, forKey: "lastRunMode")
            error = nil
            state = next
            return true
        } catch { self.error = String(describing: error); return false }
    }
}

struct RootView: View {
    @StateObject private var store = GameStore()
    @AppStorage("language") private var language = "tr"
    @AppStorage("sound") private var sound = true
    @AppStorage("haptics") private var haptics = true
    @AppStorage("music") private var music = true
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.dynamicTypeSize) private var typeSize
    @State private var panel: Panel?
    @State private var newMode: RunMode?
    enum Panel: String, Identifiable { case history, collection, settings, leaderboard; var id: String { rawValue } }

    private let gold = Color(red: 0.82, green: 0.68, blue: 0.43)
    private func t(_ tr: String, _ en: String) -> String { language == "en" ? en : tr }
    var body: some View {
        ZStack {
            Color(red: 0.055, green: 0.075, blue: 0.085).ignoresSafeArea()
            if store.inGame, let state = store.state { game(state) } else { menu }
        }
        .foregroundStyle(Color(red: 0.94, green: 0.90, blue: 0.81))
        .tint(gold)
        .preferredColorScheme(.dark)
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.3), value: store.state?.resolution != nil)
        .sheet(item: $panel) { item in panelView(item) }
        .alert(t("İşlem tamamlanamadı", "Could not complete action"), isPresented: Binding(get: { store.error != nil }, set: { if !$0 { store.error = nil } })) {
            Button(t("Tamam", "OK")) { store.error = nil }
        } message: { Text(store.error ?? "") }
        .confirmationDialog(t("Yeni oyun seçilen modun kaydının yerini alacak.", "A new game will replace the selected mode’s save."), isPresented: Binding(get: { newMode != nil }, set: { if !$0 { newMode = nil } }), titleVisibility: .visible) {
            Button(t("Yeni oyunu başlat", "Start new game"), role: .destructive) {
                if let mode = newMode { store.start(mode) }
                newMode = nil
            }
        }
    }

    private var menu: some View {
        ScrollView {
            VStack(spacing: 22) {
                Text("MonKeyBonKey Games").font(.caption).tracking(3).foregroundStyle(gold).padding(.top, 35)
                Image(systemName: "sparkles.rectangle.stack").font(.system(size: 60, weight: .ultraLight)).foregroundStyle(gold).padding(.top, 25).accessibilityHidden(true)
                Text("THE CARDS\nOF FATE").font(.system(.largeTitle, design: .serif, weight: .medium)).tracking(5).multilineTextAlignment(.center)
                Text(t("Bir karar. Bin kuşağın yankısı.", "One decision. A thousand generations of echoes.")).font(.subheadline).foregroundStyle(.secondary)
                VStack(spacing: 12) {
                    if store.hasSave(.story) {
                        menuButton(t("Mirasına devam et", "Continue your legacy"), icon: "arrow.right") { store.resume(.story) }
                            .accessibilityIdentifier("menu.continue")
                    }
                    if store.hasSave(.weekly) {
                        menuButton(t("Mücadeleye devam et", "Resume challenge"), icon: "globe") { store.resume(.weekly) }
                    }
                    menuButton(t("Yeni uygarlık", "New civilization"), icon: "flame") { begin(.story) }
                        .accessibilityIdentifier("menu.newGame")
                    menuButton(t("Zor başlangıç", "Hard beginning"), icon: "mountain.2") { begin(.hard) }
                    menuButton(t("Haftalık mücadele", "Weekly challenge"), icon: "globe") { begin(.weekly) }
                    HStack {
                        Button(t("Tarih", "History")) { panel = .history }
                        Spacer()
                        Button(t("Koleksiyon", "Collection")) { panel = .collection }
                        Spacer()
                        Button { panel = .settings } label: { Image(systemName: "gearshape") }.accessibilityLabel(t("Ayarlar", "Settings"))
                    }.frame(minHeight: 44)
                    Button(t("Haftalık sıralama", "Weekly standings")) { panel = .leaderboard }.frame(minHeight: 44)
                }.padding(.top, 20)
                Text(t("Geliştirme sürümü · \(store.content?.cards.count ?? 0) olay · İlk üç çağ\nGörseller ve müzik henüz tamamlanmadı.", "Development build · \(store.content?.cards.count ?? 0) events · First three eras\nIllustrations and music are not complete."))
                    .font(.caption).foregroundStyle(.secondary).multilineTextAlignment(.center)
            }.padding(26).frame(maxWidth: 550)
        }
    }

    private func begin(_ mode: RunMode) {
        if store.hasSave(mode) { newMode = mode } else { store.start(mode) }
    }
    private func menuButton(_ title: String, icon: String, action: @escaping () -> Void) -> some View {
        Button(action: action) { HStack { Image(systemName: icon); Text(title); Spacer(); Image(systemName: "chevron.right") }.padding(16).frame(minHeight: 52) }
            .accessibilityLabel(title)
            .background(gold.opacity(0.08), in: RoundedRectangle(cornerRadius: 12))
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(gold.opacity(0.28)))
    }

    private func game(_ state: GameState) -> some View {
        ScrollView {
            VStack(spacing: 18) {
                HStack {
                    Button { store.inGame = false } label: { Image(systemName: "chevron.left").frame(width: 44, height: 44) }.accessibilityLabel(t("Ana menü", "Main menu"))
                        .accessibilityIdentifier("game.menu")
                    Spacer()
                    VStack {
                        Text(store.content?.eras.first(where: { $0.id == state.era })?.name.value(language) ?? "").font(.system(.headline, design: .serif))
                        Text(t("Tur \(state.turn) · Kuşak \(state.generation)", "Turn \(state.turn) · Generation \(state.generation)")).font(.caption).foregroundStyle(.secondary)
                            .accessibilityIdentifier("game.turn").accessibilityValue(String(state.turn))
                    }
                    Spacer()
                    Button { panel = .history } label: { Image(systemName: "book.closed").frame(width: 44, height: 44) }.accessibilityLabel(t("Uygarlık tarihim", "My civilization history"))
                }
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: typeSize.isAccessibilitySize ? 1 : 3), spacing: 12) {
                    ForEach(Stat.allCases, id: \.self) { stat in
                        VStack(alignment: .leading, spacing: 5) {
                            HStack { Text(statName(stat)).font(.caption); Spacer(); Text("\(state.stats[stat.rawValue, default: 0])").font(.caption.monospacedDigit()) }
                            ProgressView(value: Double(state.stats[stat.rawValue, default: 0]), total: 100).tint(state.stats[stat.rawValue, default: 0] < 20 ? .orange : gold)
                        }.accessibilityElement(children: .ignore).accessibilityLabel("\(statName(stat)), \(state.stats[stat.rawValue, default: 0]) / 100")
                            .accessibilityIdentifier("stat.\(stat.rawValue)").accessibilityValue(String(state.stats[stat.rawValue, default: 0]))
                    }
                }
                HStack {
                    Label(leadership(state.leadership), systemImage: "crown")
                    Spacer()
                    Text(store.content?.eras.first(where: { $0.id == state.era })?.settlement.value(language) ?? "")
                }.font(.caption).foregroundStyle(gold)
                if state.mode == .weekly, state.weekID != WeeklyChallenge.id(at: Date()) {
                    Text(t("Bu haftanın mücadelesi sona erdi. Kaydını derecesiz sürdürebilirsin.", "This challenge week has ended. You can continue unranked."))
                    Button(t("Hikâye olarak devam et", "Continue as story")) { store.convertExpiredChallenge() }.buttonStyle(.borderedProminent)
                } else if let result = state.resolution {
                    resultView(result, state: state)
                } else if let ending = state.ending {
                    VStack(spacing: 18) {
                        Image(systemName: "sparkle").font(.largeTitle).foregroundStyle(gold)
                        Text(t("Mirasın", "Your Legacy")).font(.system(.title, design: .serif))
                        Text(ending.value(language))
                        Text(t("\(state.turn) tur · \(state.leaderTurns) tur liderlik", "\(state.turn) turns · \(state.leaderTurns) turns as leader"))
                        ShareLink(item: summary(state)) { Label(t("Tarihini paylaş", "Share your history"), systemImage: "square.and.arrow.up") }
                        Button(t("Yeni uygarlık", "New civilization")) { begin(.story) }.buttonStyle(.borderedProminent)
                    }.padding(24)
                } else if let card = store.content?.card(state.currentCardID) {
                    EventCardView(card: card, era: state.era, buildings: state.buildings, language: language, reduceMotion: reduceMotion, available: { $0.available(in: state) }) { choice in
                        store.choose(choice, sound: sound, haptics: haptics)
                    }.id(card.id)
                }
                councilView(state)
            }.padding(.horizontal, 18).padding(.bottom, 28).frame(maxWidth: 550)
        }
    }

    private func councilView(_ state: GameState) -> some View {
                DisclosureGroup {
                    VStack(alignment: .leading, spacing: 10) {
                        ForEach(state.rivals) { rival in
                            let identity = rival.identity(in: state.era)
                            Text("\(identity.name.value(language)) · \(t("Güç", "Power")) \(rival.power) · \(t("İlişki", "Relation")) \(rival.relation)")
                                .accessibilityIdentifier("faction.\(rival.id)")
                                .accessibilityValue(String(rival.relation))
                            Text(identity.motivation.value(language)).foregroundStyle(.secondary)
                            if let rules = store.content?.politics {
                                Button {
                                    store.council(.negotiate(rival.id))
                                } label: {
                                    Text(t("Ortak çalışma", "Joint work") + " (−\(rules.negotiationCost) / +\(rules.negotiationGain))").frame(minHeight: 44)
                                }.buttonStyle(.bordered).disabled(!store.canCouncil(.negotiate(rival.id)))
                                    .accessibilityIdentifier("council.negotiate.\(rival.id)")
                            }
                        }
                        if let rules = store.content?.politics {
                            Text(t("Meclis savunması: ", "Council defense: ") + String(GameEngine(content: store.content!).councilDefense(state)))
                            Text(t("Savunma; otorite, istikrar ve dost gruplardan gelir. İki düşman grup birleşirse baskı gücü artar. Başarılı meydan okuma \(store.content!.balance.rivalPressure) puan kaybettirir.", "Defense comes from authority, stability and friendly factions. Two hostile factions combine their strength. A successful challenge costs \(store.content!.balance.rivalPressure) points."))
                            Text(t("Ortak çalışma kaynak harcar, ilişkiyi artırır. Her \(rules.actionCooldown) turda bir siyasi eylem yapabilirsin. İlişki \(rules.supportRelation) olduğunda grup mecliste seni savunur.", "Joint work spends resources to improve relations. One political action every \(rules.actionCooldown) turns. At relation \(rules.supportRelation), a faction defends you in council."))
                            Button { store.council(.alliance) } label: {
                                Text(t("Meclis uzlaşısı kur", "Form council pact") + " (−\(rules.allianceCost))").frame(minHeight: 44)
                            }.buttonStyle(.bordered)
                                .disabled(!store.canCouncil(.alliance)).accessibilityIdentifier("council.alliance")
                            Text(t("Uzlaşı: her iki ilişki ≥\(rules.allianceRelation), istikrar ≥\(rules.legitimacyThreshold). Süre: \(rules.allianceDuration) tur; güven bozulursa dağılır. Otorite desteği ve nesil değişiminde koruma sağlar.", "Pact: both relations ≥\(rules.allianceRelation), stability ≥\(rules.legitimacyThreshold). Lasts \(rules.allianceDuration) turns; breaks if trust falls. Grants authority support and succession protection."))
                            if let until = state.politics?.allianceUntilTurn, until > state.turn {
                                Text(t("Uzlaşının bitiş turu: ", "Pact expires on turn: ") + String(until)).accessibilityIdentifier("council.pactStatus")
                            }
                        }
                        Text(t("Keşifler: ", "Discoveries: ") + state.technologies.sorted().joined(separator: ", "))
                    }.font(.caption).frame(maxWidth: .infinity, alignment: .leading).padding(.vertical, 8)
                } label: {
                    Text(t("Meclis ve keşifler", "Council and discoveries")).accessibilityIdentifier("council.panel")
                }
    }

    private func resultView(_ result: Resolution, state: GameState) -> some View {
        VStack(spacing: 20) {
            Text(result.title.value(language)).font(.system(.title2, design: .serif))
                .accessibilityIdentifier("result.title")
            Text(result.text.value(language)).lineSpacing(5)
            ForEach(Array((result.consequences ?? []).enumerated()), id: \.offset) { _, text in
                Text(text.value(language)).font(.callout).foregroundStyle(.secondary).lineSpacing(4)
            }
            ForEach(Stat.allCases.filter { result.changes[$0.rawValue, default: 0] != 0 }, id: \.self) { stat in
                let delta = result.changes[stat.rawValue, default: 0]
                HStack { Text(statName(stat)); Spacer(); Text(delta > 0 ? "+\(delta)" : "\(delta)").foregroundStyle(delta > 0 ? .green : .orange) }
                    .accessibilityElement(children: .ignore).accessibilityLabel(statName(stat))
                    .accessibilityIdentifier("delta.\(stat.rawValue)").accessibilityValue(String(delta))
            }
            if result.previousEra != state.era {
                Text(t("Yeni bir çağ başladı", "A new era begins")).font(.system(.title, design: .serif)).foregroundStyle(gold)
            }
            Button(t("Sonucu kabul et", "Continue")) { store.acknowledge() }.buttonStyle(.borderedProminent).frame(minHeight: 48)
                .foregroundStyle(Color(red: 0.08, green: 0.10, blue: 0.11))
                .accessibilityIdentifier("result.continue")
        }.padding(24).frame(maxWidth: .infinity).background(gold.opacity(0.07), in: RoundedRectangle(cornerRadius: 18))
    }

    private func panelView(_ panel: Panel) -> some View {
        NavigationStack {
            Group {
                switch panel {
                case .settings:
                    Form {
                        Picker(t("Dil", "Language"), selection: $language) { Text("Türkçe").tag("tr"); Text("English").tag("en") }
                        Toggle(t("Ses efektleri", "Sound effects"), isOn: $sound)
                        Toggle(t("Müzik", "Music"), isOn: $music)
                        Toggle(t("Titreşim", "Haptics"), isOn: $haptics)
                        Text(t("Hareketi Azalt sistem ayarı desteklenir. Müzik varlıkları bu sürümde henüz yok.", "The system Reduce Motion setting is supported. Music assets are not yet included."))
                    }
                case .history:
                    List(store.state?.history ?? []) { entry in
                        VStack(alignment: .leading, spacing: 6) {
                            Text(t("Tur \(entry.turn) · Çağ \(entry.era)", "Turn \(entry.turn) · Era \(entry.era)")).font(.caption).foregroundStyle(.secondary)
                            Text(entry.text.value(language))
                        }
                    }.navigationTitle(t("Uygarlık Tarihim", "My Civilization"))
                case .collection:
                    List(store.content?.cards ?? []) { card in
                        let found = store.state?.discovered.contains(card.id) ?? false
                        Label(found ? card.title.value(language) : t("Keşfedilmemiş olay", "Undiscovered event"), systemImage: found ? "rectangle.stack" : "lock")
                    }.navigationTitle(t("Koleksiyon", "Collection"))
                case .leaderboard:
                    LeaderboardView(service: store.gameCenter, language: language)
                }
            }.toolbar { ToolbarItem(placement: .confirmationAction) { Button(t("Kapat", "Done")) { self.panel = nil } } }
        }
    }

    private func statName(_ stat: Stat) -> String {
        switch stat {
        case .population: return t("Nüfus", "Population")
        case .resources: return t("Kaynak", "Resources")
        case .authority: return t("Otorite", "Authority")
        case .knowledge: return t("Bilgi", "Knowledge")
        case .stability: return t("İstikrar", "Stability")
        case .environment: return t("Çevre", "Environment")
        }
    }
    private func leadership(_ value: Leadership) -> String {
        switch value { case .contender: return t("Lider adayı", "Contender"); case .ruler: return t("Önder", "Ruler"); case .exile: return t("Sürgünde", "In exile") }
    }
    private func summary(_ state: GameState) -> String {
        (["THE CARDS OF FATE · MonKeyBonKey Games", "\(state.turn) \(t("tur", "turns"))"] + state.history.suffix(8).map { $0.text.value(language) } + [state.ending?.value(language) ?? ""]).joined(separator: "\n\n")
    }
}

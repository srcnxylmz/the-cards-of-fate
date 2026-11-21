import Foundation

public struct GameEngine {
    public let content: ContentDatabase
    public init(content: ContentDatabase) { self.content = content }

    /// Shared by resolution and risk analysis; does not consume randomness.
    public func outcomeProbabilities(for choice: Choice, in state: GameState) -> [Double] {
        guard choice.outcomes.allSatisfy({ $0.probability.isFinite && $0.probability > 0 }) else { return [] }
        let weights = choice.outcomes.map { outcome -> Double in
            guard (outcome.requirements ?? []).allSatisfy({ $0.matches(state) }) else { return 0 }
            guard let affinity = outcome.affinity else { return outcome.probability }
            return outcome.probability * (0.5 + Double(state.stats[affinity.rawValue, default: 50]) / 100)
        }
        let total = weights.reduce(0, +)
        guard total > 0, total.isFinite, weights.allSatisfy({ $0.isFinite && $0 >= 0 }) else { return [] }
        return weights.map { $0 / total }
    }

    public func start(seed: UInt64, mode: RunMode = .story, now: Date = Date()) -> GameState {
        var state = GameState(seed: mode == .weekly ? WeeklyChallenge.seed(at: now) : seed,
                              mode: mode, weekID: mode == .weekly ? WeeklyChallenge.id(at: now) : nil,
                              balance: content.balance)
        selectCard(&state)
        return state
    }

    /// A decision and its result are one transaction; callers persist before publishing the new state.
    public func choose(_ choiceID: String, in original: GameState, now: Date = Date(), observe: ((String, GameState) -> Void)? = nil) throws -> GameState {
        guard original.ending == nil else { throw ContentError.finished }
        guard original.resolution == nil else { throw ContentError.awaitingAcknowledgment }
        if original.mode == .weekly, original.weekID != WeeklyChallenge.id(at: now) { throw ContentError.weeklyExpired }
        guard let card = content.card(original.currentCardID) else { throw ContentError.noCurrentCard }
        guard let choice = card.choices.first(where: { $0.id == choiceID }), choice.available(in: original) else {
            throw ContentError.unavailableChoice
        }
        var state = original
        state.rivals = state.rivals.map { $0.identity(in: state.era) }
        let before = state.stats
        let previousEra = state.era
        // Knowledge/authority/etc. bias outcome weights without introducing extra random draws.
        let weights = outcomeProbabilities(for: choice, in: state)
        guard !weights.isEmpty else { throw ContentError.unavailableChoice }
        var roll = state.random.unit()
        var outcome = choice.outcomes[weights.lastIndex(where: { $0 > 0 })!]
        for (candidate, weight) in zip(choice.outcomes, weights) {
            roll -= weight
            if roll < 0 { outcome = candidate; break }
        }
        state.turn += 1
        var unfundedResources = apply(choice.immediateEffects, to: &state)
        unfundedResources += apply(outcome.effect, to: &state)
        observe?("card", state)
        state.delayed += outcome.delayedEffects.map {
            ScheduledConsequence(dueTurn: state.turn + $0.afterTurns, minimumEra: $0.minimumEra, text: $0.text, effect: $0.effect)
        }
        append(outcome.text, card: card.id, choice: choiceID, to: &state)
        let due = state.delayed.filter { $0.dueTurn <= state.turn && $0.minimumEra <= state.era }
        state.delayed.removeAll { $0.dueTurn <= state.turn && $0.minimumEra <= state.era }
        for event in due { unfundedResources += apply(event.effect, to: &state); append(event.text, to: &state) }
        observe?("delayed", state)
        simulate(&state, unfundedResources: unfundedResources, observe: observe)
        advanceEra(&state)
        state.currentCardID = nil
        state.resolution = Resolution(title: card.title, text: outcome.text, animation: outcome.animationPreset,
                                      changes: Dictionary(uniqueKeysWithValues: Stat.allCases.map { ($0.rawValue, state.stats[$0.rawValue, default: 0] - before[$0.rawValue, default: 0]) }), previousEra: previousEra,
                                      consequences: state.history.dropFirst(original.history.count + 1).map(\.text))
        return state
    }

    public func acknowledge(_ original: GameState) -> GameState {
        guard original.resolution != nil else { return original }
        var state = original
        state.resolution = nil
        if state.ending == nil { selectCard(&state) }
        return state
    }

    @discardableResult private func apply(_ effect: Effect, to state: inout GameState) -> Int {
        let unpaid = max(0, -effect.stats["resources", default: 0] - state.stats["resources", default: 0])
        for stat in Stat.allCases {
            state.stats[stat.rawValue] = min(100, max(0, state.stats[stat.rawValue, default: 0] + effect.stats[stat.rawValue, default: 0]))
        }
        state.flags.subtract(effect.removeFlags ?? [])
        state.flags.formUnion(effect.flags)
        state.technologies.formUnion(effect.technologies)
        state.buildings.formUnion(effect.buildings)
        for i in state.rivals.indices {
            let delta = effect.rivalRelation + (effect.rivalRelations?[state.rivals[i].id] ?? 0)
            state.rivals[i].relation = min(100, max(-100, state.rivals[i].relation + delta))
        }
        return unpaid
    }

    private func append(_ text: LocalizedText, card: String? = nil, choice: String? = nil, to state: inout GameState) {
        state.history.append(HistoryEntry(id: state.history.count, turn: state.turn, era: state.era, cardID: card, choiceID: choice, text: text))
    }

    private func selectCard(_ state: inout GameState) {
        let eligible = content.cards.filter { card in
            card.era == state.era && card.requirements.allSatisfy { $0.matches(state) }
            && !card.exclusionConditions.contains { $0.matches(state) }
            && card.choices.filter { $0.available(in: state) }.count >= 2
        }
        // Never bypass story conditions or cooldowns to fill an empty deck.
        let cooled = eligible.filter { state.turn - state.lastSeen[$0.id, default: -10000] >= $0.cooldown }
            .sorted { $0.id < $1.id }
        // Newly unlocked history gets its turn before another familiar event.
        let unseen = cooled.filter { !state.discovered.contains($0.id) }
        let candidates = unseen.isEmpty ? cooled : unseen
        guard !candidates.isEmpty else {
            state.ending = .init(tr: "Bu geliştirme sürümündeki olaylar tükendi. Uygarlığın kaydı korunuyor.", en: "This development build has no eligible events left. Your civilization record is preserved.")
            return
        }
        let weighted = candidates.map(\.weight)
        var roll = state.random.unit() * Double(weighted.reduce(0, +))
        var selected = candidates[candidates.count - 1]
        for (card, weight) in zip(candidates, weighted) {
            roll -= Double(weight)
            if roll < 0 { selected = card; break }
        }
        state.currentCardID = selected.id
        state.lastSeen[selected.id] = state.turn
        state.discovered.insert(selected.id)
    }

    private func simulate(_ state: inout GameState, unfundedResources: Int, observe: ((String, GameState) -> Void)?) {
        let balance = content.balance
        let food = foodBudget(in: state, unfundedResources: unfundedResources)
        apply(.init(stats: ["resources": food.production-food.consumption-unfundedResources+food.stored], flags: [], technologies: [], buildings: [], rivalRelation: 0), to: &state)
        if food.shortfall > 0 {
            apply(.init(stats: ["population": -food.populationLoss, "stability": -food.stabilityLoss], flags: [], technologies: [], buildings: [], rivalRelation: 0), to: &state)
            append(.init(tr: "Bu tur yiyecek ihtiyacının \(food.shortfall)/\(food.consumption) payı karşılanamadı; nüfus azaldı.", en: "Food fell short by \(food.shortfall) of \(food.consumption) shares this turn; population declined."), to: &state)
        }
        // Era 4 only: a fed, stable province regains a household at intervals, never past the ceiling.
        if let rule = balance.provincialGrowth, state.era >= rule.minimumEra, food.shortfall == 0, unfundedResources <= 0,
           food.production >= food.consumption, state.turn % rule.interval == 0, state.stats["stability", default: 0] >= rule.minimumStability,
           (1..<rule.populationCeiling).contains(state.stats["population", default: 0]) {
            apply(.init(stats: ["population": 1], flags: [], technologies: [], buildings: [], rivalRelation: 0), to: &state)
            append(.init(tr: "Doyan ve huzurlu eyalete yeni haneler yerleşti.", en: "New households settled in the fed and orderly province."), to: &state)
        }
        let politics = content.politics
        updateFactionPower(&state)
        if let until = state.politics?.allianceUntilTurn, !hasAlliance(state) {
            state.politics?.allianceUntilTurn = nil
            append(until <= state.turn
                ? .init(tr: "Meclis uzlaşısının süresi doldu.", en: "The council pact expired.")
                : .init(tr: "Bozulan ilişkiler meclis uzlaşısını dağıttı.", en: "Damaged relations dissolved the council pact."), to: &state)
        }
        if state.turn % politics.meetingInterval == 0 && hasAlliance(state), state.stats["authority", default: 0] < politics.supportAuthorityCeiling {
            let gain = min(politics.supportAuthority, politics.supportAuthorityCeiling - state.stats["authority", default: 0])
            apply(.init(stats: ["authority": gain], flags: [], technologies: [], buildings: [], rivalRelation: 0), to: &state)
            append(.init(tr: "Meclis uzlaşısı yönetimine destek verdi.", en: "The council pact backed your leadership."), to: &state)
        }
        observe?("world", state)
        // A friendly powerful faction must not hide another faction's opposition.
        // Resolve at most one challenge per council meeting, with stable ID tie-breaking.
        let coalition = state.rivals.filter { $0.relation <= politics.hostileRelation }.count >= 2 ? politics.coalitionBonus : 0
        if state.turn % politics.meetingInterval == 0, let opponent = state.rivals.filter({
            $0.power + coalition > councilDefense(state) && $0.relation < politics.neutralRelation
        }).sorted(by: { $0.power == $1.power ? $0.id < $1.id : $0.power > $1.power }).first {
            let stat = opponent.id == "keepers" ? "stability" : "authority"
            apply(.init(stats: [stat: -balance.rivalPressure], flags: [], technologies: [], buildings: [], rivalRelation: 0), to: &state)
            let action = stat == "stability"
                ? LocalizedText(tr: "Ortak kurallara itiraz etti; istikrar azaldı.", en: "Contested the common rules; stability fell.")
                : LocalizedText(tr: "Önderliğine meydan okudu; otorite azaldı.", en: "Challenged your leadership; authority fell.")
            append(.init(tr: "\(opponent.name.tr): \(action.tr)", en: "\(opponent.name.en): \(action.en)"), to: &state)
        }
        observe?("council", state)
        // Succession can itself remove the last authority: resolve it before leadership and scoring.
        if state.turn % balance.successionTurns == 0 {
            state.generation += 1
            let cost = politics.successionCost - (hasAlliance(state) ? politics.allianceSuccessionRelief : 0)
            apply(.init(stats: ["authority": -cost, "knowledge": 2], flags: [], technologies: [], buildings: [], rivalRelation: 0), to: &state)
            append(.init(tr: "Yeni kuşak, önceki liderin sözlerini ve borçlarını devraldı.", en: "A new generation inherited the last leader's promises and debts."), to: &state)
        }
        observe?("succession", state)
        let authority = state.stats["authority", default: 0]
        if authority == 0, state.leadership != .exile {
            state.leadership = .exile
            append(.init(tr: "Meclis seni görevden aldı. Mirasını sürgünde yaşatıyorsun.", en: "The council removed you. Your legacy survives in exile."), to: &state)
        } else if authority >= 60, state.leadership != .ruler {
            state.leadership = .ruler
            append(.init(tr: "Topluluk önderliğini kabul etti.", en: "Your community accepted your leadership."), to: &state)
        }
        if state.leadership == .ruler {
            state.leaderTurns += 1; state.consecutiveLeaderTurns += 1
            state.longestLeadership = max(state.longestLeadership, state.consecutiveLeaderTurns)
        } else { state.consecutiveLeaderTurns = 0 }
        if state.stats["population"] == 0 {
            state.ending = .init(tr: "Son ocak söndü. Açlık, uygarlığın yaşayan hafızasını tüketti.", en: "The last hearth went dark. Hunger consumed your civilization's living memory.")
        } else if state.stats["environment"] == 0 && state.stats["stability", default: 0] < 15 {
            state.ending = .init(tr: "Toprak sustu. Dağılan halkın ardından yalnızca yollar kaldı.", en: "The land fell silent. Only roads remain after your people scattered.")
        }
    }

    private func advanceEra(_ state: inout GameState) {
        guard state.ending == nil, let era = content.eras.first(where: { $0.id == state.era }), state.era < 12,
              state.technologies.contains(era.requiredTechnology),
              state.stats["knowledge", default: 0] >= era.knowledgeThreshold,
              state.stats["stability", default: 0] >= era.stabilityThreshold,
              state.stats["population", default: 0] >= era.populationThreshold else { return }
        // Unauthored or not-yet-approved eras cannot masquerade as complete playable content.
        // Authored cards alone never open a gated era; see EraContentGate.
        guard content.eraContentReady(state.era + 1) else { return }
        state.era += 1
        if let next = content.eras.first(where: { $0.id == state.era }) {
            append(next.name, to: &state)
            for i in state.rivals.indices { state.rivals[i].power = max(20, state.rivals[i].power - 15) }
            state.rivals = state.rivals.map { $0.identity(in: state.era) }
        }
    }
}

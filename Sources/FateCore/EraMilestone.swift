import Foundation

/// A recorded historical milestone of one era (Phase 3, 270). It is not a victory and never ends the run:
/// it is written once into the saved history (a v1 flag plus a history entry) when several independent
/// conditions hold at the end of a turn. Each condition comes from earlier decisions, so no single high
/// statistic can trigger it, and more than one political path satisfies it.
public struct EraMilestone: Codable, Equatable {
    public var id: String
    public var era: Int
    /// Schema-v1 flag that records the milestone; its presence also prevents a second record.
    public var flag: String
    /// Residence: decisions taken in this era (from the saved history).
    public var minimumEraDecisions: Int
    /// Economy: own production meets consumption and a reserve is held.
    public var minimumResources: Int
    /// Legitimacy: order at home, and either personal authority or shared institutions.
    public var minimumStability: Int
    public var minimumAuthority: Int
    public var institutionFlags: [String]
    public var minimumInstitutions: Int
    /// Rights: recognized rights of different communities.
    public var rightsFlags: [String]
    public var minimumRights: Int
    /// Obligations: no open debt or unpaid promise.
    public var obligationFlags: [String]
    /// History: at least one of these conclusions has been decided.
    public var completedAnyOf: [String]
    public var text: LocalizedText
}

public extension GameEngine {
    /// Every condition by name, for tests, diagnostics and an eventual progress view.
    func milestoneConditions(_ milestone: EraMilestone, in state: GameState) -> [String: Bool] {
        let stat = { (name: String) in state.stats[name, default: 0] }
        let food = foodBudget(in: state)
        let decided = state.history.filter { $0.era == milestone.era && $0.choiceID != nil }
        return [
            "residence": decided.count >= milestone.minimumEraDecisions,
            "economy": food.production >= food.consumption && stat("resources") >= milestone.minimumResources,
            "legitimacy": stat("stability") >= milestone.minimumStability
                && (stat("authority") >= milestone.minimumAuthority
                    || milestone.institutionFlags.filter(state.flags.contains).count >= milestone.minimumInstitutions),
            "accord": !state.rivals.contains { $0.relation <= content.politics.hostileRelation },
            "rights": milestone.rightsFlags.filter(state.flags.contains).count >= milestone.minimumRights,
            "obligations": !milestone.obligationFlags.contains(where: state.flags.contains),
            "history": decided.contains { entry in milestone.completedAnyOf.contains(entry.cardID ?? "") }
        ]
    }

    internal func recordEraMilestones(_ state: inout GameState) {
        for milestone in content.balance.eraMilestones ?? [] where state.era == milestone.era
            && !state.flags.contains(milestone.flag) && state.stats["population", default: 0] > 0
            && milestoneConditions(milestone, in: state).values.allSatisfy({ $0 }) {
            state.flags.insert(milestone.flag)
            state.history.append(HistoryEntry(id: state.history.count, turn: state.turn, era: state.era, cardID: nil, choiceID: nil, text: milestone.text))
        }
    }
}

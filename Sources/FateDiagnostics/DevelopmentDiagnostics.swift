import FateCore

/// Passive, additive observations. No RNG, rule changes or look-ahead.
public struct DevelopmentDiagnostics {
    public init() {}
    public var counts: [String:Int] = [:]
    private var prior: [String:Int] = [:]
    private var decision = ""
    private var bronzeAge = 0
    public mutating func begin(_ s: GameState, card: CardEvent, choice: Choice) {
        prior = s.stats; decision = card.id+"."+choice.id
        if s.era == 3 { bronzeAge += 1 }
        if s.era == 2 && !s.technologies.contains("smelting") {
            counts["neo.beforeMetal.decisions",default:0] += 1
            let investments = card.choices.filter { c in c.outcomes.contains { $0.effect.technologies.contains("smelting") } }
            for c in investments {
                let key = "metalOffer."+card.id+"."+c.id
                counts[key+".presented",default:0] += 1
                if c.available(in:s) {
                    counts[key+".available",default:0] += 1
                    counts[key+(choice.id == c.id ? ".chosen" : ".declined"),default:0] += 1
                    if choice.id != c.id { counts["metalDeclinedFor."+decision,default:0] += 1 }
                    for stat in ["resources","knowledge","stability","environment"] { counts[key+".sum."+stat,default:0] += s.stats[stat,default:0] }
                    if s.stats["resources",default:0] < 25 { counts[key+".lowReserve",default:0] += 1 }
                    if s.stats["knowledge",default:0] == 100 { counts[key+".knowledgeSaturated",default:0] += 1 }
                }
            }
        }
        if s.era == 3 {
            for limit in [20,40,80] where bronzeAge <= limit {
                let key = "bronze.prefix\(limit)"
                counts[key+".decisions",default:0] += 1
                counts[key+".environmentSum",default:0] += s.stats["environment",default:0]
                counts[key+".resourcesSum",default:0] += s.stats["resources",default:0]
            }
        }
    }
    public mutating func observe(_ stage:String, state s:GameState, era:Int) {
        for stat in ["environment","stability","resources"] {
            let delta = s.stats[stat,default:0]-prior[stat,default:0]
            if delta != 0 {
                let key = "\(era).\(stage).\(stage == "card" ? decision : "all").\(stat).\(delta < 0 ? "loss" : "gain")"
                counts[key,default:0] += abs(delta)
            }
        }
        prior = s.stats
    }
    public mutating func finish(_ s:GameState) {
        if s.ending == nil && s.era == 2 {
            counts["neo.caps",default:0] += 1
            counts[s.technologies.contains("smelting") ? "neo.caps.withMetal" : "neo.caps.withoutMetal",default:0] += 1
            for (stat,target) in [("knowledge",68),("population",25),("stability",35)] where s.stats[stat,default:0] < target { counts["neo.caps.block."+stat,default:0] += 1 }
        }
    }
}

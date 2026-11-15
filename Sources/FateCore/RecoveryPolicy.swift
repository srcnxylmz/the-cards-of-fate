import Foundation

// Independent diagnostic policy. The four baseline score functions are intentionally untouched.
extension GameEngine {
    public func selectRecovery(_ choices: [Choice], state: GameState) -> Choice {
        precondition(!choices.isEmpty)
        func utility(_ effect: Effect) -> Double {
            var result=0.0
            let targets:[String:Int] = ["population":55,"resources":40,"stability":55,"environment":55,"authority":30,"knowledge":60]
            for stat in Stat.allCases {
                let key=stat.rawValue, old=state.stats[key,default:0]
                let next=min(100,max(0,old+effect.stats[key,default:0]))
                let target=targets[key]!
                // Value both fixing and worsening a deficit; saturated gains have no utility.
                let deficitChange=max(0,target-old)-max(0,target-next)
                let weight:Double = key == "knowledge" ? 0.35 : key == "authority" ? 0.6 : 2.0
                result += Double(deficitChange)*weight + Double(next-old)*0.25
            }
            if let era=content.eras.first(where:{$0.id==state.era}), !state.technologies.contains(era.requiredTechnology), effect.technologies.contains(era.requiredTechnology) { result += 45 }
            result += Double(effect.buildings.filter { !state.buildings.contains($0) }.count)*14
            if let relations=effect.rivalRelations {
                for rival in state.rivals where rival.relation<20 { result += Double(relations[rival.id,default:0])*0.3 }
            }
            return result
        }
        func score(_ choice:Choice)->Double {
            utility(choice.immediateEffects)+zip(choice.outcomes,outcomeProbabilities(for:choice,in:state)).reduce(0) { total,pair in
                total+pair.1*(utility(pair.0.effect)+pair.0.delayedEffects.reduce(0) { $0+($1.minimumEra<=state.era ? 0.6 : 0.25)*utility($1.effect) })
            }
        }
        return choices.enumerated().max { a,b in
            let x=score(a.element),y=score(b.element)
            return x==y ? a.offset>b.offset : x<y
        }!.element
    }
}

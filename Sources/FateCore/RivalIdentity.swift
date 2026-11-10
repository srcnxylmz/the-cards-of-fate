import Foundation

extension Rival {
    /// Stable IDs carry relationships across eras and older saves.
    public func identity(in era: Int) -> Rival {
        var rival = self
        switch (id, era) {
        case ("hunters", 2):
            rival.name = .init(tr: "Tarla Birliği", en: "Field Council")
            rival.motivation = .init(tr: "Hasadı ve sulama payını korumak", en: "Protect harvests and irrigation shares")
        case ("keepers", 2):
            rival.name = .init(tr: "Atalar Meclisi", en: "Council of Ancestors")
            rival.motivation = .init(tr: "Ortak toprağı ve ataların sözünü korumak", en: "Protect common land and ancestral promises")
        case ("hunters", 3):
            rival.name = .init(tr: "Tunç Ustaları", en: "Bronze Guild")
            rival.motivation = .init(tr: "Maden yollarını ve ustaların payını korumak", en: "Protect ore routes and craftspeople's shares")
        case ("keepers", 3):
            rival.name = .init(tr: "Tablet Meclisi", en: "Council of Scribes")
            rival.motivation = .init(tr: "Borçları ve yasaları ortak kayda geçirmek", en: "Keep public records of debts and laws")
        default: break
        }
        return rival
    }
}

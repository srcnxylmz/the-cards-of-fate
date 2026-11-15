import SwiftUI
import FateCore

@MainActor
struct EventCardView: View {
    let card: CardEvent
    let era: Int
    let buildings: Set<String>
    let language: String
    let reduceMotion: Bool
    let available: (Choice) -> Bool
    let onChoose: (Choice) -> Bool
    @Environment(\.dynamicTypeSize) private var typeSize
    @State private var entered = false
    @State private var selected: String?
    @State private var pending: Task<Void, Never>?

    private var accent: Color {
        switch era {
        case 1: return Color(red: 0.76, green: 0.51, blue: 0.30)
        case 2: return Color(red: 0.64, green: 0.72, blue: 0.46)
        default: return Color(red: 0.82, green: 0.68, blue: 0.43)
        }
    }

    private func choose(_ choice: Choice) {
        guard selected == nil, available(choice) else { return }
        selected = choice.id
        if reduceMotion {
            if !onChoose(choice) { selected = nil }
            return
        }
        pending = Task { @MainActor in
            do { try await Task.sleep(nanoseconds: 180_000_000) }
            catch { return }
            guard !Task.isCancelled else { return }
            if !onChoose(choice) { selected = nil }
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if UIImage(named: card.artAsset) != nil {
                ZStack {
                    accent.opacity(0.08)
                    Image(card.artAsset).resizable().scaledToFill().blur(radius: 20).opacity(0.18)
                    Image(card.artAsset).resizable().scaledToFit()
                }
                .frame(height: typeSize.isAccessibilitySize ? 140 : 210).clipped()
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(accent.opacity(0.5)))
                .accessibilityElement(children: .ignore)
                .accessibilityLabel(card.title.value(language))
                .accessibilityIdentifier("card.art").accessibilityValue(card.artAsset)
            } else {
                SettlementView(era: era, buildings: buildings, reduceMotion: reduceMotion)
                    .frame(height: typeSize.isAccessibilitySize ? 100 : 140)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                    .accessibilityLabel(language == "tr" ? "Uygarlık taslak görünümü" : "Civilization prototype view")
            }
            Text(card.title.value(language)).font(.system(.title2, design: .serif, weight: .semibold))
                .accessibilityIdentifier("card.title").accessibilityValue(card.id)
            Text(card.description.value(language)).font(.body).lineSpacing(4)
                .fixedSize(horizontal: false, vertical: true)
            ForEach(card.choices) { choice in
                Button { choose(choice) } label: {
                    HStack(alignment: .top, spacing: 10) {
                        Image(systemName: "diamond.fill").font(.system(size: 7)).padding(.top, 7).foregroundStyle(accent)
                        VStack(alignment: .leading, spacing: 6) {
                            Text(choice.text.value(language)).font(.body.weight(.medium))
                            Text(choice.risk.value(language)).font(.caption).foregroundStyle(.secondary)
                        }.fixedSize(horizontal: false, vertical: true)
                    }.frame(maxWidth: .infinity, minHeight: 48, alignment: .leading).padding(14)
                        .contentShape(RoundedRectangle(cornerRadius: 12))
                }.buttonStyle(.plain)
                    .background(accent.opacity(selected == choice.id ? 0.23 : 0.09), in: RoundedRectangle(cornerRadius: 12))
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(accent.opacity(available(choice) ? 0.55 : 0.2)))
                    .disabled(selected != nil || !available(choice))
                    .opacity(available(choice) ? 1 : 0.45)
                    .accessibilityIdentifier("choice.\(choice.id)")
            }
        }.padding(16)
            .background(.white.opacity(0.035), in: RoundedRectangle(cornerRadius: 20))
            .overlay(RoundedRectangle(cornerRadius: 20).stroke(accent.opacity(0.35)))
            .opacity(entered ? 1 : 0)
            .offset(x: reduceMotion || selected == nil ? 0 : (card.choices.first?.id == selected ? -7 : 7), y: reduceMotion || entered ? 0 : 12)
            .rotation3DEffect(.degrees(reduceMotion || selected == nil ? 0 : (card.choices.first?.id == selected ? -3 : 3)), axis: (x: 0, y: 1, z: 0))
            .animation(reduceMotion ? nil : .easeInOut(duration: 0.18), value: selected)
            .animation(reduceMotion ? nil : .easeOut(duration: 0.22), value: entered)
            .onAppear { entered = true }
            .onDisappear { pending?.cancel() }
    }
}

struct UITestAccessibility: ViewModifier {
    static var usesLargeReduced: Bool {
        #if DEBUG
        return ProcessInfo.processInfo.arguments.contains("--ui-testing") && ProcessInfo.processInfo.arguments.contains("--large-text-reduced-motion")
        #else
        return false
        #endif
    }
    @ViewBuilder func body(content: Content) -> some View {
        if Self.usesLargeReduced {
            content.dynamicTypeSize(.accessibility3)
        } else { content }
    }
}

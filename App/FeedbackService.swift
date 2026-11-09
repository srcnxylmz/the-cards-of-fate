import AVFoundation
import CoreHaptics

@MainActor
final class FeedbackService {
    private var engine: CHHapticEngine?
    private var player: AVAudioPlayer?
    func play(preset: String, sound: Bool, haptics: Bool) {
        if sound, let url = Bundle.main.url(forResource: "decision", withExtension: "wav") {
            do {
                try AVAudioSession.sharedInstance().setCategory(.ambient, mode: .default)
                player = try AVAudioPlayer(contentsOf: url)
                player?.volume = 0.35; player?.play()
            } catch { /* Missing or unavailable sound never blocks a decision. */ }
        }
        guard haptics, CHHapticEngine.capabilitiesForHardware().supportsHaptics else { return }
        do {
            if engine == nil { engine = try CHHapticEngine() }
            try engine?.start()
            let event = CHHapticEvent(eventType: .hapticTransient, parameters: [
                .init(parameterID: .hapticIntensity, value: preset == "failure" ? 0.65 : 0.35),
                .init(parameterID: .hapticSharpness, value: 0.45)
            ], relativeTime: 0)
            let pattern = try CHHapticPattern(events: [event], parameters: [])
            try engine?.makePlayer(with: pattern).start(atTime: 0)
        } catch { engine = nil }
    }
}

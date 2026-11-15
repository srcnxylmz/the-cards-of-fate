import AVFoundation
import CoreHaptics
import OSLog

@MainActor
final class FeedbackService {
    private var engine: CHHapticEngine?
    private var player: AVAudioPlayer?
    func play(preset: String, sound: Bool, haptics: Bool) {
        playSound(preset == "normal" ? "choice-soft" : "decision", enabled: sound, volume: 0.35)
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

    func openCard(sound: Bool) { playSound("card-open",enabled:sound,volume:0.25) }
    private func playSound(_ name: String, enabled: Bool, volume: Float) {
        guard enabled, let url=Bundle.main.url(forResource:name,withExtension:"wav") else { return }
        do {
            try AVAudioSession.sharedInstance().setCategory(.ambient,mode:.default)
            player=try AVAudioPlayer(contentsOf:url); player?.volume=volume
            let started=player?.play() ?? false
            #if DEBUG
            Logger(subsystem:"games.monkeybonkey.thecardsoffate",category:"Audio").info("AUDIO_CUE \(name, privacy: .public) started=\(started) duration=\(self.player?.duration ?? 0)")
            #endif
        } catch {
            #if DEBUG
            Logger(subsystem:"games.monkeybonkey.thecardsoffate",category:"Audio").error("AUDIO_ERROR \(name, privacy: .public): \(String(describing:error), privacy: .public)")
            #endif
        }
    }
}

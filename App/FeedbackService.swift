import AVFoundation
import CoreHaptics
import OSLog
import Combine

@MainActor
final class FeedbackService: ObservableObject {
    private var engine: CHHapticEngine?
    private var player: AVAudioPlayer?
    #if DEBUG
    struct AudioEvent: Codable {
        var sequence: Int
        var cue: String
        var cardID: String?
        var status: String
        var playReturned: Bool
        var isPlaying: Bool
        var duration: Double
    }
    struct Evidence: Codable {
        var events: [AudioEvent] = []
        var writeError: String?
    }
    @Published private(set) var audioEvidence = "{}"
    private var evidence = Evidence()
    private let testing = ProcessInfo.processInfo.arguments.contains("--ui-testing")
    private var evidenceURL: URL { FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("ui-audio-evidence.json") }
    #endif
    init() {
        #if DEBUG
        if testing {
            if !ProcessInfo.processInfo.arguments.contains("--reset-audio-telemetry"),
               let data = try? Data(contentsOf: evidenceURL), let saved = try? JSONDecoder().decode(Evidence.self, from: data) { evidence = saved }
            publishEvidence()
        }
        #endif
    }
    func play(preset: String, sound: Bool, haptics: Bool, cardID: String? = nil) {
        playSound(preset == "normal" ? "choice-soft" : "decision", enabled: sound, volume: 0.35, cardID: cardID)
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

    func openCard(sound: Bool, cardID: String? = nil) { playSound("card-open",enabled:sound,volume:0.25,cardID:cardID) }
    private func playSound(_ name: String, enabled: Bool, volume: Float, cardID: String?) {
        guard enabled else { record(name,cardID:cardID,status:"muted"); return }
        guard let url=Bundle.main.url(forResource:name,withExtension:"wav") else { record(name,cardID:cardID,status:"missing_resource"); return }
        do {
            try AVAudioSession.sharedInstance().setCategory(.ambient,mode:.default)
            try AVAudioSession.sharedInstance().setActive(true)
            player=try AVAudioPlayer(contentsOf:url); player?.volume=volume
            let started=player?.play() ?? false
            record(name,cardID:cardID,status:started ? "started" : "rejected",started:started,playing:player?.isPlaying ?? false,duration:player?.duration ?? 0)
            #if DEBUG
            Logger(subsystem:"games.monkeybonkey.thecardsoffate",category:"Audio").info("AUDIO_CUE \(name, privacy: .public) started=\(started) duration=\(self.player?.duration ?? 0)")
            #endif
        } catch {
            record(name,cardID:cardID,status:"error: \(error)")
            #if DEBUG
            Logger(subsystem:"games.monkeybonkey.thecardsoffate",category:"Audio").error("AUDIO_ERROR \(name, privacy: .public): \(String(describing:error), privacy: .public)")
            #endif
        }
    }
    private func record(_ cue:String,cardID:String?,status:String,started:Bool=false,playing:Bool=false,duration:Double=0) {
        #if DEBUG
        guard testing else { return }
        evidence.events.append(AudioEvent(sequence:(evidence.events.last?.sequence ?? 0)+1,cue:cue,cardID:cardID,status:status,playReturned:started,isPlaying:playing,duration:duration))
        evidence.events=Array(evidence.events.suffix(256))
        publishEvidence()
        #endif
    }
    #if DEBUG
    private func publishEvidence() {
        evidence.writeError=nil
        do {
            try FileManager.default.createDirectory(at:evidenceURL.deletingLastPathComponent(),withIntermediateDirectories:true)
            try JSONEncoder().encode(evidence).write(to:evidenceURL,options:.atomic)
        } catch { evidence.writeError=String(describing:error) }
        if let data=try? JSONEncoder().encode(evidence), let text=String(data:data,encoding:.utf8) { audioEvidence=text }
    }
    #endif
}

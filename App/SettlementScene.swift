import SwiftUI
import SpriteKit

struct SettlementView: View {
    var era: Int
    var buildings: Set<String>
    var reduceMotion: Bool
    var body: some View {
        SpriteView(scene: SettlementScene.make(era: era, buildings: buildings, reduceMotion: reduceMotion), options: [.allowsTransparency])
            .allowsHitTesting(false)
    }
}

final class SettlementScene: SKScene {
    static func make(era: Int, buildings: Set<String>, reduceMotion: Bool) -> SettlementScene {
        let scene = SettlementScene(size: CGSize(width: 360, height: 150))
        scene.scaleMode = .aspectFill
        scene.backgroundColor = .clear
        let sky = SKSpriteNode(color: UIColor(red: 0.08, green: 0.13, blue: 0.16, alpha: 1), size: scene.size)
        sky.position = CGPoint(x: 180, y: 75); scene.addChild(sky)
        let moon = SKShapeNode(circleOfRadius: 17)
        moon.fillColor = UIColor(red: 0.84, green: 0.77, blue: 0.58, alpha: 1); moon.strokeColor = .clear
        moon.position = CGPoint(x: 285, y: 114); scene.addChild(moon)
        for i in 0..<3 {
            let path = CGMutablePath()
            path.move(to: CGPoint(x: CGFloat(-20 + i * 130), y: 0))
            path.addLine(to: CGPoint(x: CGFloat(60 + i * 130), y: CGFloat(65 + i * 14)))
            path.addLine(to: CGPoint(x: CGFloat(180 + i * 130), y: 0))
            path.closeSubpath()
            let hill = SKShapeNode(path: path)
            hill.fillColor = UIColor(red: 0.10, green: 0.18, blue: 0.19, alpha: 1); hill.strokeColor = .clear
            scene.addChild(hill)
        }
        for i in 0..<min(era + 1, 8) {
            let house = SKShapeNode(rectOf: CGSize(width: 28, height: CGFloat(20 + era * 5)), cornerRadius: 3)
            house.fillColor = UIColor(red: 0.38, green: 0.31, blue: 0.23, alpha: 1); house.strokeColor = .clear
            house.position = CGPoint(x: CGFloat(70 + i * 40), y: 25); scene.addChild(house)
        }
        if buildings.contains("granary") {
            let granary = SKShapeNode(rectOf: CGSize(width: 36, height: 34), cornerRadius: 5)
            granary.fillColor = .brown; granary.position = CGPoint(x: 265, y: 32); scene.addChild(granary)
        }
        if buildings.contains("walls") {
            let wall = SKSpriteNode(color: .darkGray, size: CGSize(width: 290, height: 10))
            wall.position = CGPoint(x: 180, y: 10); scene.addChild(wall)
        }
        let fire = SKShapeNode(circleOfRadius: 5)
        fire.position = CGPoint(x: 180, y: 18); fire.fillColor = .orange; fire.strokeColor = .clear
        scene.addChild(fire)
        if !reduceMotion {
            fire.run(.repeatForever(.sequence([.fadeAlpha(to: 0.5, duration: 0.6), .fadeAlpha(to: 1, duration: 0.4)])))
        }
        return scene
    }
}

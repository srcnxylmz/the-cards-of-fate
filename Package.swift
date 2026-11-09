// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "FateCore",
    platforms: [.iOS(.v16), .macOS(.v13)],
    products: [.library(name: "FateCore", targets: ["FateCore"]), .executable(name: "FateSimulation", targets: ["FateSimulation"])],
    targets: [
        .target(name: "FateCore", resources: [.process("Content")]),
        .testTarget(name: "FateCoreTests", dependencies: ["FateCore"]),
        .executableTarget(name: "FateSimulation", dependencies: ["FateCore"])
    ]
)

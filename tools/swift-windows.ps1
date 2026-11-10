param(
    [ValidateSet('Test', 'Simulate')][string]$Task = 'Test',
    [ValidateRange(1, 1000000)][int]$Runs = 10000,
    [ValidateSet('random', 'survival', 'knowledge')][string]$Policy = 'random',
    [switch]$ManageCouncil,
    [string]$SwiftRoot = (Join-Path $env:LOCALAPPDATA 'Programs\Swift')
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$previousPath = $env:Path
$previousSDK = $env:SDKROOT
# Only this process is changed; never overwrite the user's persistent PATH.
try {
    $toolchain = Get-ChildItem -LiteralPath (Join-Path $SwiftRoot 'Toolchains') -Directory |
        Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'usr\bin\swift.exe') } |
        Sort-Object { [version](($_.Name -split '\+')[0]) } -Descending | Select-Object -First 1
    if (-not $toolchain) { throw "Swift toolchain not found under $SwiftRoot" }
    $version = ($toolchain.Name -split '\+')[0]
    $runtime = Join-Path $SwiftRoot "Runtimes\$version\usr\bin"
    $sdk = Join-Path $SwiftRoot "Platforms\$version\Windows.platform\Developer\SDKs\Windows.sdk"
    if (-not (Test-Path -LiteralPath $sdk)) { throw "Matching Windows SDK not found: $sdk" }
    $bin = Join-Path $toolchain.FullName 'usr\bin'
    $env:Path = "$bin;$runtime;$previousPath"
    $env:SDKROOT = $sdk
    Push-Location $projectRoot
    try {
        & (Join-Path $bin 'swift.exe') --version
        if ($Task -eq 'Test') {
            & (Join-Path $bin 'swift.exe') test 2>&1 | Tee-Object -FilePath 'docs/swift-test-windows.log'
        } else {
            $councilArgs = @()
            $reportName = $Policy
            if ($ManageCouncil) { $councilArgs = @('--manage-council'); $reportName = "$Policy-council" }
            & (Join-Path $bin 'swift.exe') run -c release FateSimulation $Runs --policy $Policy @councilArgs --output "docs/simulation-$reportName.json" 2>&1 |
                Tee-Object -FilePath "docs/swift-simulation-$reportName-windows.log"
        }
        if ($LASTEXITCODE -ne 0) { throw "Swift $Task failed with exit code $LASTEXITCODE" }
    } finally { Pop-Location }
} finally {
    $env:Path = $previousPath
    $env:SDKROOT = $previousSDK
}

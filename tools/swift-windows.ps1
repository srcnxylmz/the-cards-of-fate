param(
    [ValidateSet('Test', 'Simulate')][string]$Task = 'Test',
    [ValidateRange(1, 1000000)][int]$Runs = 10000,
    [ValidateSet('random', 'survival', 'knowledge', 'progression', 'recovery')][string]$Policy = 'random',
    [switch]$ManageCouncil,
    [string]$CardsPath,
    [string]$OutputDirectory = 'docs',
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
    # Swift on Windows needs a C linker (link.exe). Locate MSVC from the locally
    # installed Visual Studio build tools without touching machine-wide PATH.
    $msvcRootCandidates = @(
        (Join-Path $env:ProgramFiles 'Microsoft Visual Studio\2022\Community\VC\Tools\MSVC'),
        (Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\2022\Community\VC\Tools\MSVC'),
        (Join-Path $env:ProgramFiles 'Microsoft Visual Studio\2022\Professional\VC\Tools\MSVC'),
        (Join-Path $env:ProgramFiles 'Microsoft Visual Studio\2022\Enterprise\VC\Tools\MSVC'),
        (Join-Path $env:ProgramFiles 'Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC')
    )
    $msvcDir = $null
    foreach ($candidate in $msvcRootCandidates) {
        if (Test-Path -LiteralPath $candidate) {
            $latest = Get-ChildItem -LiteralPath $candidate -Directory |
                Sort-Object { [version]$_.Name } -Descending | Select-Object -First 1
            if ($latest) {
                $msvcDir = Join-Path $latest.FullName 'bin\Hostx64\x64'
                break
            }
        }
    }
    if (-not $msvcDir -or -not (Test-Path -LiteralPath (Join-Path $msvcDir 'link.exe'))) {
        throw "MSVC link.exe not found. Install Visual Studio Build Tools or set $env:Path to include link.exe."
    }
    $env:Path = "$bin;$runtime;$msvcDir;$previousPath"
    $env:SDKROOT = $sdk
    Push-Location $projectRoot
    try {
        New-Item -ItemType Directory -Force $OutputDirectory | Out-Null
        & (Join-Path $bin 'swift.exe') --version
        if ($Task -eq 'Test') {
            & (Join-Path $bin 'swift.exe') test 2>&1 | Tee-Object -FilePath (Join-Path $OutputDirectory 'swift-test-windows.log')
        } else {
            $councilArgs = @()
            $reportName = $Policy
            if ($ManageCouncil) { $councilArgs = @('--manage-council'); $reportName = "$Policy-council" }
            if ($CardsPath) { $councilArgs += @('--cards', $CardsPath) }
            & (Join-Path $bin 'swift.exe') run -c release FateSimulation $Runs --policy $Policy @councilArgs --output (Join-Path $OutputDirectory "simulation-$reportName.json") 2>&1 |
                Tee-Object -FilePath (Join-Path $OutputDirectory "swift-simulation-$reportName-windows.log")
        }
        if ($LASTEXITCODE -ne 0) { throw "Swift $Task failed with exit code $LASTEXITCODE" }
    } finally { Pop-Location }
} finally {
    $env:Path = $previousPath
    $env:SDKROOT = $previousSDK
}

param()

$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'assert-safe-files.ps1')

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$manifestPath = Join-Path $projectRoot 'manifest.json'
$manifest = Get-Content -Raw -Path $manifestPath | ConvertFrom-Json
$version = $manifest.version

$distPath = Join-Path $projectRoot 'dist'
$stagePath = Join-Path $distPath "cursor-auto-hide-$version"
$zipPath = Join-Path $distPath "cursor-auto-hide-$version.zip"

if (Test-Path $stagePath) {
    Remove-Item -Path $stagePath -Recurse -Force
}

if (Test-Path $zipPath) {
    Remove-Item -Path $zipPath -Force
}

Assert-NoSensitiveProjectFiles -RootPath $projectRoot -Operation 'package the extension'

New-Item -ItemType Directory -Path $stagePath -Force | Out-Null

$pathsToPackage = @(
    'manifest.json',
    'content.js',
    'popup.html',
    'popup.css',
    'popup.js',
    'docs/assets/brand.svg',
    'icons'
)

foreach ($relativePath in $pathsToPackage) {
    $sourcePath = Join-Path $projectRoot $relativePath
    $destinationPath = Join-Path $stagePath $relativePath

    if (Test-Path $sourcePath -PathType Container) {
        Copy-Item -Path $sourcePath -Destination $destinationPath -Recurse -Force
        continue
    }

    New-Item -ItemType Directory -Path (Split-Path -Path $destinationPath -Parent) -Force | Out-Null
    Copy-Item -Path $sourcePath -Destination $destinationPath -Force
}

Assert-NoSensitiveProjectFiles -RootPath $stagePath -Operation 'create the extension archive'

Compress-Archive -Path (Join-Path $stagePath '*') -DestinationPath $zipPath -Force

Remove-Item -Path $stagePath -Recurse -Force

Write-Host "Created package: $zipPath"

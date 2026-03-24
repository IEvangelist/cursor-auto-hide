param()

$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'assert-safe-files.ps1')

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$manifestPath = Join-Path $projectRoot 'manifest.json'

Get-Content -Raw -Path $manifestPath | ConvertFrom-Json | Out-Null
Assert-NoSensitiveProjectFiles -RootPath $projectRoot -Operation 'validate the extension'

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw 'Node.js is required to validate JavaScript files.'
}

Push-Location $projectRoot

try {
    node --check content.js
    node --check popup.js
    & (Join-Path $PSScriptRoot 'package.ps1')
}
finally {
    Pop-Location
}

Write-Host 'Validation succeeded.'

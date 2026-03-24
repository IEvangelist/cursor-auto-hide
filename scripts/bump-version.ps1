param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^\d+\.\d+\.\d+$')]
    [string]$Version
)

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$manifestPath = Join-Path $projectRoot 'manifest.json'
$manifest = Get-Content -Raw -Path $manifestPath | ConvertFrom-Json

$manifest.version = $Version

$json = $manifest | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($manifestPath, "$json`n")

Write-Host "Updated manifest version to $Version"

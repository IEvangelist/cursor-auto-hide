$script:SensitiveFilePatterns = @(
    '*.pem',
    '*.key',
    '*.p12',
    '*.pfx',
    '*.pvk',
    '*.snk',
    '*private-key*',
    'id_rsa*',
    'id_dsa*',
    'id_ecdsa*',
    'id_ed25519*'
)

function Get-SensitiveProjectFiles {
    param(
        [Parameter(Mandatory = $true)]
        [string]$RootPath
    )

    $resolvedRoot = (Resolve-Path $RootPath).Path.TrimEnd('\')
    $excludedRelativePrefixes = @(
        '.git\',
        'dist\'
    )

    Get-ChildItem -Path $resolvedRoot -Recurse -Force -File | Where-Object {
        $relativePath = $_.FullName.Substring($resolvedRoot.Length).TrimStart('\')

        foreach ($prefix in $excludedRelativePrefixes) {
            if ($relativePath.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
                return $false
            }
        }

        foreach ($pattern in $script:SensitiveFilePatterns) {
            if ($_.Name -like $pattern) {
                return $true
            }
        }

        return $false
    }
}

function Assert-NoSensitiveProjectFiles {
    param(
        [Parameter(Mandatory = $true)]
        [string]$RootPath,

        [Parameter(Mandatory = $true)]
        [string]$Operation
    )

    $matches = @(Get-SensitiveProjectFiles -RootPath $RootPath)

    if ($matches.Count -eq 0) {
        return
    }

    $message = @(
        "Refusing to $Operation because sensitive key-like files were found under $RootPath.",
        'Load unpacked and packaged extension folders should only contain extension assets.',
        'Remove these files from the project folder before continuing:'
    )

    $message += $matches | ForEach-Object { " - $($_.FullName)" }

    throw ($message -join [Environment]::NewLine)
}

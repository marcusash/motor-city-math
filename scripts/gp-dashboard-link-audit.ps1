param(
    [string]$DashboardPath = "index.html",
    [string]$DataDir = "data"
)

if (-not (Test-Path $DashboardPath)) {
    Write-Error "Dashboard file not found: $DashboardPath"
    exit 1
}

$content = Get-Content $DashboardPath -Raw
$matches = [regex]::Matches($content, "exam\.html\?file=([a-zA-Z0-9\-_]+)")
$files = $matches | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

$missing = @()
foreach ($f in $files) {
    $path = Join-Path $DataDir "$f.json"
    if (-not (Test-Path $path)) {
        $missing += $path
    }
}

Write-Output "dashboard_link_audit total_links=$($files.Count) missing=$($missing.Count)"
if ($missing.Count -gt 0) {
    $missing | ForEach-Object { Write-Output "MISSING $_" }
    exit 2
}

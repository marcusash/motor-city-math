<#
.SYNOPSIS
    Watchdog wrapper for Copilot CLI agents. Auto-restarts on crash.
.DESCRIPTION
    Runs `agency copilot` with a session name. If the process exits non-zero
    (server error, timeout, etc.), waits and auto-resumes. Logs all crashes.
.EXAMPLE
    .\forge-watch.ps1 -Session "mcm-app-agent" -Cwd "C:\Github\kai-algebra2-tests"
    .\forge-watch.ps1 -Session "f-app-agent" -Cwd "C:\Github\journal"
#>

param(
    [Parameter(Mandatory)][string]$Session,
    [Parameter(Mandatory)][string]$Cwd,
    [int]$MaxRetries = 10,
    [int]$BaseWaitSeconds = 30,
    [int]$MaxWaitSeconds = 300
)

$logFile = Join-Path $env:USERPROFILE ".forge-watch.log"
$attempt = 0
$consecutiveFailures = 0

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] [$Session] $Message"
    Write-Host $line
    Add-Content -Path $logFile -Value $line
}

Write-Host ""
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Forge Watchdog — $Session" -ForegroundColor Cyan
Write-Host "║   Cwd: $Cwd" -ForegroundColor Cyan
Write-Host "║   Max retries: $MaxRetries" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Log "Watchdog started. Max retries: $MaxRetries"

while ($consecutiveFailures -lt $MaxRetries) {
    $attempt++
    
    if ($attempt -eq 1) {
        Write-Log "Starting fresh session (attempt $attempt)"
        Set-Location $Cwd
        & agency copilot --name $Session
    } else {
        Write-Log "Resuming session after crash (attempt $attempt, failure #$consecutiveFailures)"
        Set-Location $Cwd
        # Use /resume to pick up where we left off
        & agency copilot --resume $Session
    }
    
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        # Clean exit (user typed /exit or Ctrl+C) — don't retry
        Write-Log "Clean exit (code 0). Watchdog stopping."
        break
    }
    
    # Crash detected
    $consecutiveFailures++
    
    # Exponential backoff: 30s, 60s, 120s, 240s, 300s (capped)
    $waitSeconds = [Math]::Min($BaseWaitSeconds * [Math]::Pow(2, $consecutiveFailures - 1), $MaxWaitSeconds)
    
    Write-Log "CRASH detected (exit code $exitCode). Failure $consecutiveFailures/$MaxRetries."
    Write-Log "Waiting $waitSeconds seconds before retry..."
    
    # Countdown display
    for ($i = $waitSeconds; $i -gt 0; $i--) {
        Write-Host "`r  Retrying in $i seconds... " -NoNewline -ForegroundColor Yellow
        Start-Sleep -Seconds 1
    }
    Write-Host "`r  Retrying now...              " -ForegroundColor Green
    
    # Quick health check — can we reach the service?
    Write-Log "Testing service availability..."
    $testResult = agency --version 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Service still unavailable. Will retry anyway."
    } else {
        Write-Log "Service responding. Resuming session."
        # Reset consecutive failures on successful service check
        # (the service is back, previous failures were transient)
    }
}

if ($consecutiveFailures -ge $MaxRetries) {
    Write-Log "MAX RETRIES REACHED ($MaxRetries). Watchdog giving up."
    Write-Log "The AI service may be down for an extended period."
    Write-Log "Restart manually: .\forge-watch.ps1 -Session '$Session' -Cwd '$Cwd'"
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "  ║  WATCHDOG: Max retries exhausted     ║" -ForegroundColor Red
    Write-Host "  ║  Service may be down. Try later.     ║" -ForegroundColor Red
    Write-Host "  ╚══════════════════════════════════════╝" -ForegroundColor Red
}

Write-Log "Watchdog stopped."

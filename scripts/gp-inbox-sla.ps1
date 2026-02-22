param(
    [string]$InboxPath = ".agent-comms\grind\inbox-GP",
    [int]$StaleHours = 24
)

$now = Get-Date
$items = @()

Get-ChildItem -Path $InboxPath -Filter "*.json" -ErrorAction SilentlyContinue | ForEach-Object {
    try {
        $msg = Get-Content $_.FullName -Raw | ConvertFrom-Json
        $createdRaw = if ($msg.created) { $msg.created } elseif ($msg.date) { $msg.date } else { $null }
        $created = $null
        if ($createdRaw) {
            [void][DateTime]::TryParse($createdRaw.ToString(), [ref]$created)
        }
        $ageHours = if ($created) { [math]::Round((($now - $created).TotalHours), 1) } else { $null }
        $items += [PSCustomObject]@{
            File     = $_.Name
            Priority = ($msg.priority ?? "normal")
            Status   = ($msg.status ?? "unread")
            AgeHours = $ageHours
        }
    } catch {}
}

$unread = $items | Where-Object { $_.Status -eq "unread" }
$criticalUnread = $unread | Where-Object { $_.Priority -eq "critical" }
$highUnread = $unread | Where-Object { $_.Priority -eq "high" }
$stale = $unread | Where-Object { $_.AgeHours -ne $null -and $_.AgeHours -ge $StaleHours }

Write-Output "inbox_sla unread=$($unread.Count) critical=$($criticalUnread.Count) high=$($highUnread.Count) stale_${StaleHours}h=$($stale.Count)"
if ($stale.Count -gt 0) {
    $stale | Sort-Object AgeHours -Descending | Select-Object File, Priority, AgeHours | Format-Table -AutoSize
}

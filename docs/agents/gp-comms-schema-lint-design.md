# GP Comms Schema Lint Design

**Owner:** GP (grind-platform)  
**Date:** 2026-02-23

---

## Problem

Inbox messages across `.agent-comms/` have inconsistent schemas. Required fields (`from`, `to`, `subject`, `body`, `created`, `status`) are present in new GP messages but absent in old FA-format messages. No automated check exists.

## Proposed Validation Approach

### Lightweight PowerShell Linter (no new dependencies)

```powershell
# Run from repo root
$required = @("from","to","subject","body","created","status")
$dirs = Get-ChildItem ".agent-comms" -Recurse -Filter "*.json"
$fail = 0
foreach ($f in $dirs) {
    try {
        $obj = Get-Content $f.FullName -Raw | ConvertFrom-Json
        $missing = $required | Where-Object { -not ($obj.PSObject.Properties.Name -contains $_) }
        if ($missing) { Write-Output "FAIL: $($f.Name) missing: $($missing -join ', ')"; $fail++ }
    } catch { Write-Output "FAIL: $($f.Name) invalid JSON"; $fail++ }
}
Write-Output "Schema lint: $($dirs.Count - $fail)/$($dirs.Count) OK"
```

Save as: `scripts/gp-inbox-schema-lint.ps1`

### Integration Points

- Run manually as part of GP Morning Readiness Gate 2
- Do NOT add to pre-commit hook (old messages will always fail; noise outweighs signal)
- Document known failures (old FA-format messages) as accepted drift in `gp-inbox-triage-sop.md`

### Pass Criteria

New messages (created after 2026-02-20) must all pass. Old messages exempt.

## Status

Design complete. Script not yet created (out of scope for this task — pending Marcus approval before adding new scripts to `scripts/`).

# GP Incident Runbook — Data Issues

Quick-reference for resolving data integrity incidents.

## Exam Verification Baseline Drop

**Symptoms:** `node tests/verify-practice-exams.js` reports fewer than 3337 checks.

**Steps:**
1. Run `node scripts/gp-morning-check.js` to identify which check failed
2. Check recent commits: `git --no-pager log --oneline -10`
3. Identify which RP file changed: `git --no-pager show --name-only HEAD`
4. Restore from backup: `Copy-Item data/_backups/<timestamp>-<file> data/<file>`
5. Verify: `node tests/verify-practice-exams.js` — confirm 3337/3337
6. File incident to GR if content issue, GP if infra issue

## Health Gate Failure

**Symptoms:** `node scripts/gp-exam-health.js` shows fewer than 11/11.

**Steps:**
1. Note which check failed
2. Run that individual test: `node tests/<failed-test>.test.js`
3. If data issue: restore from `data/_backups/`
4. If structural issue: check recent commits and revert if needed
5. Re-run health gate after fix

## JSON Parse Error

**Symptoms:** `node tests/gp-all-json-valid.test.js` fails.

**Steps:**
1. Identify which file has bad JSON
2. Run: `node -e "JSON.parse(require('fs').readFileSync('data/FILE','utf8'))"` — get exact error
3. Fix the JSON (use a JSON validator if needed)
4. Or restore from backup if easier
5. Verify: `node tests/gp-all-json-valid.test.js`

## Git Index Lock

**Symptoms:** `git` commands fail with "Another git process seems to be running".

**Fix:** `Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue`

## Push Conflict

**Symptoms:** `git push` fails with non-fast-forward error.

**Fix:**
```powershell
git stash
git pull --rebase origin master
git stash pop
git push
```

## Em Dash Found in Production

**Symptoms:** `gp-hint-no-emdash.test.js` or `gp-no-emdash-solution-steps.test.js` fails.

**Steps:**
1. This is GR content territory — file report to GR inbox
2. GP does NOT directly fix content — that's GR responsibility
3. Update `docs/agents/gp-bug-tracker.md` with new violation

## Critical Answer Missing (Orphan Input)

**Symptoms:** `gp-no-orphan-inputs.test.js` shows new orphan inputs.

**Steps:**
1. File to GR inbox immediately (CRITICAL — affects auto-grading)
2. Include: file, question ID, input ID, expected answer type
3. GR must add `answer` field and `tolerance` if numeric

## Manifest Drift

**Symptoms:** `node scripts/gp-exam-manifest-check.js` shows mismatches.

**Steps:**
1. Check what's on disk: `Get-ChildItem data/*.json | Sort-Object Name`
2. Check manifest: `node -e "console.log(JSON.stringify(require('./data/manifest.json').exams.map(e=>e.id)))"`
3. Route to GI — manifest.json is GI responsibility
4. File to GI inbox with specific mismatch list

## Backup Missing

**Symptoms:** `node scripts/gp-backup-audit.js` shows missing backup.

**Fix:**
```powershell
$ts = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH-mm-ss-fffZ")
Copy-Item "data/retake-practice-N.json" "data/_backups/${ts}-retake-practice-N.json"
```

## Stale Inbox Messages

**Symptoms:** `node scripts/gp-stale-inbox-check.js` shows >5 stale messages.

**Fix:**
1. Read the stale messages
2. Take action or ping the agent to check their inbox
3. Mark handled messages as `"status": "read"` if appropriate

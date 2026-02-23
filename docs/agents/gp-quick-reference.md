# GP Quick Reference

Fastest path to the answer for the most common GP tasks.

## Daily Ritual

```powershell
node scripts/gp-morning-check.js
```
All 4 checks pass = system healthy. Any fail = fix before starting work.

## Verify Baseline

```powershell
node tests/verify-practice-exams.js   # must be 3337/3337
```

## Health Gate

```powershell
node scripts/gp-exam-health.js        # must be 11/11
```

## Run All GP Tests

```powershell
npm run test:gp:all
```

## Check Em Dash Violations

```powershell
node scripts/gp-feedback-tone-check.js
node tests/gp-hint-no-emdash.test.js
node tests/gp-feedback-no-emdash.test.js
```

## Cross-Exam Dedup

```powershell
node tests/cross-exam-verify.js       # must be 0 hard failures
```

## Lint All Data Files

```powershell
npm run lint:json
```

## Commit Pattern

```
GP: <short summary>

<detail lines>

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

## Key File Owners

| File type | Owner |
|-----------|-------|
| data/retake-practice-*.json | GR (content), GI (schema) |
| data/schemas/ | GI |
| tests/gp-*.test.js | GP |
| scripts/gp-*.js | GP |
| docs/agents/gp-*.md | GP |
| .agent-comms/ | All (own inbox) |
| shared/styles.css | GD |
| shared/scripts.js | GA |

## Inbox Check

```powershell
Get-ChildItem .agent-comms\grind\inbox-GP\ | Sort-Object Name | Select-Object -Last 5
```

## Emergency

See `docs/agents/gp-emergency-playbook.md`.

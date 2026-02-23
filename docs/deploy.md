# Deploy — Motor City Math Deployment Process

## Target Environment

Motor City Math is a static HTML project. No server required. Deployment = copying files to a web-accessible location or sharing a folder.

## Primary Deployment: GitHub Pages

```
https://[username].github.io/kai-algebra2-tests/
```

Triggered by: push to `master` branch that passes CI.

### CI Pipeline

1. Push to `master`
2. `validate-data.yml` runs: JSON parse + schema check on all RP files
3. `validate-inbox.yml` runs: agent comms JSON schema check
4. GitHub Pages deploy action (if configured): copies `public/` or root to Pages

### Pre-Deploy Gate

Run locally before pushing:

```
node scripts/gp-exam-health.js        # 11/11 must pass
node tests/verify-practice-exams.js   # 3008/3008 baseline
```

If either fails: DO NOT push.

## Secondary Deployment: Local File System

For Kai's offline use:

1. Download/clone repo to local folder
2. Open any `.html` file directly in browser
3. Works from `file://` URL, no server needed
4. localStorage saves progress locally

## Environment Variables / Secrets

None required for basic use. GitHub Pages deployment may need:
- `MOTOR_CITY_MATH_TOKEN` — PAT for deploy action (stored in repo secrets, managed by Marcus)

GP monitors token expiry via CI run status.

## What NOT to Deploy

Files that should never be in production HTML:
- `tests/` directory (test scripts, not student-facing)
- `scripts/` directory (internal tooling)
- `.agent-comms/` (internal team messages)
- `data/_backups/` (backup files, not needed by browser)
- `*.ps1` scripts (Windows-only tooling)

## Rollback Procedure

If a broken file reaches production:

1. `git revert HEAD` (if last commit)
2. Restore from `data/_backups/` (if exam data broken)
3. `git push origin master` (triggers redeploy)
4. Verify: open exam.html in browser, spot-check Q1

## Publish Checklist

See `docs/publish-runbook.md` for full publish drill.

---

*Owner: GP | Last updated: 2026-02-23*

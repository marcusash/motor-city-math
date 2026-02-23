# GP Tools Index

**Owner:** GP (grind-platform)  
**Last updated:** 2026-02-23

All scripts and test files owned or created by GP.

---

## Scripts (`scripts/`)

| Script | Purpose | Run Command |
|--------|---------|-------------|
| `gp-rp-field-audit.js` | Scan all 10 RP JSON files for missing required fields | `node scripts/gp-rp-field-audit.js` |
| `gp-field-fixer.js` | Auto-fill missing feedback_correct, feedback_wrong, version, solution_steps | `node scripts/gp-field-fixer.js` |
| `gp-feedback-trimmer.js` | Trim feedback strings to 12 words (ADHD rule) | `node scripts/gp-feedback-trimmer.js` |
| `gp-exam-health.js` | 8-check single-command health gate for all exams | `node scripts/gp-exam-health.js` |
| `gp-missing-fields.js` | List every question missing any required field | `node scripts/gp-missing-fields.js` |
| `gp-word-count.js` | ADHD compliance word count report for all feedback/hints | `node scripts/gp-word-count.js` |
| `gp-retake-smoke.ps1` | PowerShell smoke test for all retake exams | `pwsh scripts/gp-retake-smoke.ps1` |
| `gp-inbox-sla.ps1` | Check inbox message response times | `pwsh scripts/gp-inbox-sla.ps1` |
| `gp-dashboard-link-audit.ps1` | Audit dashboard links for broken references | `pwsh scripts/gp-dashboard-link-audit.ps1` |
| `publish.cjs` | Publish private repo to public motor-city-math repo | Manual trigger via GitHub Actions |

## Tests (`tests/`)

| Test | Purpose | Pass Criteria |
|------|---------|---------------|
| `gp-field-completeness.test.js` | All RP JSON questions have all required fields | 900/900 |
| `gp-answer-uniqueness.test.js` | Single-input questions have unique answers per exam | 66/66 |
| `gp-solution-steps.test.js` | All questions have >= 3 solution steps | 150/150 |
| `gp-feedback-length.test.js` | All feedback strings under 12 words (ADHD rule) | 300/300 |
| `gp-manifest-integrity.test.js` | Manifest entries match actual data/ files | 10/10 |

## npm Shortcuts

```bash
npm run verify          # Run verify-practice-exams.js
npm run verify:cross    # Run cross-exam-verify.js
npm run audit:fields    # Run gp-rp-field-audit.js
npm run audit:feedback  # Run gp-feedback-length.test.js
npm run audit:all       # Full suite (verify + cross + all audits)
npm run test:gp         # Run all 5 GP tests
```

## Pre-Commit Hook (`.git/hooks/pre-commit`)

Runs automatically on every `git commit`. Checks:
1. polyfill.io ban in HTML files
2. Multiple `<html>` tags (corruption detector)
3. JSON parse validation for `data/*.json`
4. `feedback_correct` required in staged RP files
5. Duplicate answer warning for single-input questions

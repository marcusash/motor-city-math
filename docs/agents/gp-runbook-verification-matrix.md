# GP Runbook Verification Matrix

**Owner:** GP (grind-platform)  
**Last verified:** 2026-02-23

---

| Runbook | File | Verification Command | Owner | Last Run | Status |
|---------|------|---------------------|-------|----------|--------|
| Exam verify | `tests/verify-practice-exams.js` | `node tests/verify-practice-exams.js` | GP | 2026-02-23 | 3008/3008 |
| Cross-exam verify | `tests/cross-exam-verify.js` | `node tests/cross-exam-verify.js` | GP | 2026-02-23 | 0 hard failures |
| Pre-commit hook | `.git/hooks/pre-commit` | `git diff --cached \| bash .git/hooks/pre-commit` | GP | 2026-02-22 | Pass |
| Retake smoke | `scripts/gp-retake-smoke.ps1` | `pwsh scripts/gp-retake-smoke.ps1` | GP | 2026-02-23 | RP6 still failing (GR blocked) |
| localStorage schema guard | `tests/f-validation/localstorage-schema-guard.test.js` | `node tests/f-validation/localstorage-schema-guard.test.js` | GF | 2026-02-22 | 50/50 |
| Design compliance | `tests/f-validation/design-compliance.spec.js` | `npx playwright test tests/f-validation/design-compliance.spec.js` | GF | 2026-02-22 | 218/223 |
| Publish workflow | `.github/workflows/publish-to-motor-city-math.yml` | Manual trigger via GitHub Actions UI | GP/Marcus | 2026-02-23 | Pending trigger |
| Inbox schema lint | (ad hoc, see gp-autq-31 procedure) | PowerShell sample check | GP | 2026-02-23 | 8/12 schema OK (4 old-format) |

## Notes

- RP6 smoke failure is blocked on GR delivering a patch (gp-autq-10c blocked).
- Design compliance 218/223: 5 known failures are pre-existing, not GP regressions.
- Publish workflow requires `MOTOR_CITY_MATH_TOKEN` secret in private repo settings.

# GP Metrics Baseline — 2026-02-23

Snapshot of all key project metrics after the 1-hour autonomous sprint.

---

## Exam Health

| Metric | Value |
|--------|-------|
| Total verify checks | 3008/3008 PASS |
| Total exams | 10 retake practice |
| Questions per exam | 15 |
| Total questions | 150 |
| Graph questions | 20 (2 per exam) |
| Multi-input questions | 84 |
| Single-input questions | 66 |
| Hint coverage | 150/150 (100%) |
| Graph key_points verified | 100/100 |
| ADHD violations (feedback > 12 words) | 0 (trimmed 34 this sprint) |

## GP Test Suite

| Test | Result |
|------|--------|
| gp-field-completeness | 900/900 |
| gp-answer-uniqueness | 66/66 |
| gp-solution-steps | 150/150 |
| gp-feedback-length | 300/300 |
| gp-manifest-integrity | 10/10 |
| gp-graph-keypoints | 100/100 |
| gp-exam-id-consistency | 170/170 |
| Health gate total | 9/9 |

## Codebase Stats

| Metric | Value |
|--------|-------|
| HTML files | 5 (index, exam, nonlinear, final, final_mini) |
| RP JSON files | 10 |
| Total test files | 61+ |
| GP-owned test files | 7 |
| Scripts | 15+ |
| Docs | 20+ markdown files |
| CI workflows | 2 (publish, validate-data) |
| Pre-commit checks | 8 |

## Sprint Stats (2026-02-23)

| Metric | Value |
|--------|-------|
| Commits this sprint | 18+ |
| Fields fixed in RP JSON | 93 |
| ADHD violations trimmed | 34 |
| New tests added | 7 |
| New scripts added | 9 |
| New docs added | 12+ |
| Agent comms sent | 4 |

## Baseline Command

To re-verify this baseline at any time:
```bash
node scripts/gp-exam-health.js
# Expected: 9 checks: 9 pass, 0 fail — SYSTEM HEALTHY
```

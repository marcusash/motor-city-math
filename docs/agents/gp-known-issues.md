# GP Known Issues

Active issues as of 2026-02-23. Bugs filed to respective owner inboxes.

## Open Bugs (GA)

| ID | File | Severity | Description | Filed |
|----|------|----------|-------------|-------|
| B-ARIA-1 | final_exam_251123.html | Medium | 4 canvas elements missing aria-label | 2026-02-23 |
| B-ARIA-2 | nonlinear_exam_mvp.html | Medium | 2 canvas elements missing aria-label | 2026-02-23 |
| B-PRINT-1 | exam.html | Low | Missing @media print CSS | 2026-02-23 |
| B-PRINT-2 | final_exam_251123.html | Low | Missing @media print CSS | 2026-02-23 |
| B-GRADE-1 | exam.html grading | Low | Dollar signs in numeric input break parseFloat | Pre-existing |
| B-GRADE-2 | exam.html grading | Low | 4-char prefix match causes false positives | Pre-existing |

## Open Bugs (GR)

| ID | File | Severity | Description | Filed |
|----|------|----------|-------------|-------|
| B-RP11-1 | retake-practice-11.json | High | 10 uniqueness failures (values 2, 3, 7 repeat) | 2026-02-23 |
| B-TOL-1 | retake-practice-8.json Q11 | Low | tolerance=0.05 on answer=125 — recommend 0.5+ | 2026-02-23 |
| B-W3E-1 | RP1-7 questions | Low | standard "W3.e" not in official list — verify valid | 2026-02-23 |
| B-EMDASH-1 | retake-practice-4.json Q9 | Low | em dash in feedback_correct violates voice guide | 2026-02-23 |
| B-EMDASH-2 | retake-practice-7.json Q3 | Low | em dash in feedback_correct violates voice guide | 2026-02-23 |

## Pending Decisions (Marcus)

| ID | Topic | Status |
|----|-------|--------|
| D-1 | p-impl-2: move 26 dotfiles to docs/ | Pending Marcus go/no-go |
| D-2 | p-impl-3: agent onboarding doc restructure | Blocked on D-1 |
| D-3 | p-impl-8: GitHub Actions coordinator agent | Low priority, awaiting direction |

## Resolved This Sprint

| ID | Description | Resolution |
|----|-------------|-----------|
| B-RP5-1 | RP5 Q4 wrong answer | Fixed: x=9 |
| B-RP5-2 | RP5 Q13 wrong key_point | Fixed: (-2, -1.75) |
| B-RP5-3 | RP5 schema_version was '2' | Fixed: '2.0' |
| B-FIELD | 93 missing required fields | Patched across all 10 RP files |
| B-ADHD-34 | 34 feedback ADHD violations | Fixed across all exams |
| B-ADHD-9 | 9 hint ADHD violations | Fixed across all exams |

---

*Owner: GP | Updated every sprint | Filed issues use agent inbox system*

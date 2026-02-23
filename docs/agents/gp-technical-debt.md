# GP Technical Debt

Known technical debt items in the Motor City Math platform.

## High Priority

| ID | Area | Description | Impact | Owner |
|----|------|-------------|--------|-------|
| TD-01 | localStorage | 4 HTML files share key 'algebra2TestResults' — data overwrites between tests | Medium | GA |
| TD-02 | Grading | Dollar signs break parseFloat in numeric grading | Low-Medium | GA |
| TD-03 | Grading | 4-char prefix match causes false positives on short-answer | Low | GA |

## Medium Priority

| ID | Area | Description | Impact | Owner |
|----|------|-------------|--------|-------|
| TD-04 | Accessibility | 6 canvas elements missing aria-label | Medium | GA |
| TD-05 | Print | 2 HTML files missing @media print CSS | Low | GA |
| TD-06 | Answer Bank | standard: "W3.e" not in official standard list — possible mis-tag | Low | GR |
| TD-07 | RP11 | uniqueness violations (values 2,3,7 repeat) — not yet resolved | High | GR |

## Low Priority / Won't Fix Soon

| ID | Area | Description | Rationale |
|----|------|-------------|-----------|
| TD-08 | File naming | 4 HTML test files use legacy naming (nonlinear_exam_mvp.html) | Name change breaks bookmarks |
| TD-09 | Tolerance | RP8 Q11 tolerance=0.05 on answer=125 — advisory only | Non-breaking |
| TD-10 | Shared scripts | shared/scripts.js has some exam-specific code | Would need careful refactor |

## Infrastructure Debt

| ID | Area | Description |
|----|------|-------------|
| TD-I-01 | Session dependency | GP only runs when Marcus opens session — no autonomous trigger |
| TD-I-02 | Doc reorg | 26 dotfiles in root, not in docs/ — pending Marcus p-impl-2 decision |
| TD-I-03 | CI coverage | validate-data.yml doesn't cover all RP files (filters < 20 questions) |

---

*Owner: GP | Last updated: 2026-02-23 | Review quarterly*

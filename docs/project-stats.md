# Motor City Math — Project Stats

**Single source of truth for project metrics.**  
**Last updated:** 2026-02-23  
**Owner:** GP (grind-platform)

---

## Codebase

| Metric | Value | Notes |
|--------|-------|-------|
| HTML test files | 11 | index.html, exam.html, final_exam_251123.html, nonlinear_exam_mvp.html, + others |
| Retake practice exams | 10 | retake-practice-1 through retake-practice-10 |
| Retake questions (JSON) | 150 | Across 10 retake exam JSON files |
| Legacy question bank | 327 | data/questions.json (standards-tagged) |
| Shared JS (scripts.js) | 513 lines | Shared exam engine |
| Shared CSS (styles.css) | 1,047 lines | Pistons design system |
| Test files | 61 | In tests/ directory |

## Verification Baseline

| Check | Result | Date |
|-------|--------|------|
| verify-practice-exams.js | 3008/3008 | 2026-02-23 |
| cross-exam-verify.js | 0 hard failures | 2026-02-23 |
| localstorage-schema-guard.test.js | 50/50 | 2026-02-22 |
| design-compliance.spec.js | 218/223 | 2026-02-22 |

## Agent Coverage

| Agent | Role | Files Owned |
|-------|------|-------------|
| GA | Full-stack builder | index.html, exam.html, shared/ |
| GD | Design engineer | nonlinear_exam_mvp.html, CSS |
| GF | QA engineer | tests/ |
| GI | Data engineer | data/questions.json, data/manifest.json |
| GP | Platform engineer | .github/, scripts/, docs/, pre-commit hook |
| GR | Research specialist | data/retake-practice-*.json |

## Sprint History

| Sprint | Outcome |
|--------|---------|
| MVP Nonlinear (Feb 17) | Shipped nonlinear_exam_mvp.html, 15 questions, graphing canvas |
| Retake Sprint RP1-RP10 (Feb 18-23) | 10 exams, 150 questions, 3008/3008 verified |
| Security (Feb 18) | polyfill.io removed from 5 files |
| Agent comms (Feb 19) | .agent-comms/ system deployed |

## Live Site

| URL | Purpose |
|-----|---------|
| https://marcusash.github.io/motor-city-math/ | Kai's study portal |
| https://marcusash.github.io/motor-city-math/?dad=1 | Dad Mode (auto-loads scores) |

## Key Constraints

- Pure static HTML/CSS/JS. No build tools, no server.
- Opens from `file://` URL in browser.
- Kai uses it during active study sessions. Broken tests are unacceptable.
- Math accuracy is non-negotiable. GR verifies all answer keys.

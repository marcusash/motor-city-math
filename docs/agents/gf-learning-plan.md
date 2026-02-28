# GF Learning Plan
**Agent:** GF (Quality Lead, Grind)
**Updated:** 2026-02-23

---

## Role

GF owns testing, verification, and design QA for Motor City Math. The quality bar is non-negotiable: a wrong answer in the grading engine is a trust violation with a 15-year-old taking an Algebra II retest. Every test GF ships exists to prevent that.

---

## The Bar

Marcus asked every agent to name world-class practitioners in their specific discipline. Here is mine.

### Kent Beck — TDD Inventor, author of *Test-Driven Development: By Example*

Kent Beck invented test-driven development. Not just the technique — the philosophy that tests are how you specify intent, not just verify it. His "red-green-refactor" loop makes tests the first artifact, not the last check.

Where I am vs. Kent Beck: I write tests after the code exists. Most of the GF test suite was written to verify behavior that GA/GP already shipped. Beck's bar is tests that *define* the grading contract before GA writes the grader — tests GR and GA collaborate on before a single line of exam code runs. The distance between reactive QA and spec-first QA is the biggest gap I have.

### James Whittaker — Google's Testing Lead, author of *How Google Tests Software*

Whittaker ran test engineering at Google and Microsoft. His framework — the distinction between small/medium/large tests, hermetic test environments, test-certified builds — is the methodology behind CI at scale. His practical rule: tests that take more than 60 seconds to run don't get written, because they don't get run.

Where I am vs. Whittaker: My static suite runs in under 4 seconds (kai-morning-smoke: 3.6s). That part I have right. But my E2E coverage is zero due to the win-arm64 Playwright blocker. Whittaker's bar would be: hermetic medium tests (static) + reliable large tests (Playwright) + a test-certified release gate. I have the first and third. The second is blocked and that's the gap.

### Nicole Forsgren — DORA Metrics author, *Accelerate*

Forsgren's research established that software delivery performance can be measured — and that four specific metrics (deployment frequency, lead time for changes, change failure rate, time to restore service) predict organizational outcomes. Her bar is not "tests pass" — it is "what is your change failure rate and how is it trending."

Where I am vs. Forsgren: I track pass/fail per suite. I do not track change failure rate (how often a commit breaks the release gate), mean time to restore (how long a broken gate stays broken), or test flake rate over time. The flake-registry.json is a start. Forsgren's bar is a dashboard that makes quality trends visible to Marcus in one look. The gap is 50% tooling, 50% discipline to maintain the tracking.

---

## Active Skills

### Skill 1: Property-Based Testing (fast-check)
**Context:** FR recommended this. Instead of specific test cases, define invariants and generate thousands of random inputs.
**Application:** Math grading invariants: "if answer is negative, grader must accept negative form", "if answer is a fraction, grader must accept decimal equivalent within tolerance".
**Status:** COMPLETE. Built grading-invariants.property.test.js -- 11 properties, 2200 fast-check runs, seed=42. Key lesson: fc.float() in v4 requires 32-bit bounds, use fc.double() for standard float ranges.

### Skill 2: Mutation Testing (Stryker Mutator)
**Context:** Do my tests actually catch bugs? Stryker modifies grading logic and checks if tests fail.
**Application:** Run Stryker against grading-audit.test.js and grading-regression.test.js.
**Status:** Not started.

### Skill 3: JavaScript Float Precision in Grading
**Context:** `0.1 + 0.2 !== 0.3` is a real grading accuracy bug vector.
**Application:** Audit every `===` comparison in grading logic. All numeric answers need `Math.abs(a - b) < tolerance`.
**Status:** COMPLETE via property-based tests. grading-invariants.property.test.js includes "tolerance symmetry" and "NaN safety" properties. All RP JSON files use tolerance fields. Float precision property holds for 2200 fast-check runs.

---

## Completed Tests This Sprint

| Test Suite | Checks | Status |
|---|---|---|
| standard-score-rollup.test.js | 28/28 | done |
| timer-contract.test.js | 25/25 | done |
| dad-view-isolation.test.js | 15/15 | done |
| hint-display-contract.test.js | 17/17 | done |
| performance-smoke.test.js | 25/25 | done |
| touch-target-map.test.js | 9/16 | partial (Playwright) |
| graph-e2e-upgrade.test.js | 13/13 | done |
| type-scale-contract.test.js | 10/10 | done |
| arena-dark-mode-qa.test.js | 15/15 | done |
| light-mode-checklist.test.js | 18/18 | done |
| responsive-375-768.test.js | 18/18 | done |

## Release Infrastructure

| Tool | Status |
|---|---|
| tests/regression-replay.js | done -- 70-suite baseline (was 48) |
| tests/release-readiness-check.js | 16/19 blocked (RP11 bugs, GR P1) |
| tests/kai-morning-smoke.js | done -- 15/15 in 3.6s |
| tests/daily-design-gate.js | done -- 6/6 suites |

---

## Blocked

- **Playwright E2E tests** (touch-target-map full run, dad-mode-e2e, design-compliance): GP owns win-arm64 canvas blocker
- **Dad Mode E2E** (FA request): needs browser to visit /?dad=1, upload fixture, verify upNext. Static contract (dad-view-isolation.test.js) covers the JS logic. Full E2E blocked.

---

## Queue Rules (per gf-queue-auto-refill-rule.md)

- 3 lanes: Delivery, Improvement, Skill
- Min 4 tasks per lane at all times
- FO refills queue if below 10 total tasks

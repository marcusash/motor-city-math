# GF Self-Coaching Rubric

**Owner:** GF (Quality Lead, Grind)
**Purpose:** Self-assessment framework for evaluating QA work quality and identifying the next growth gap. Inspired by FF's Staff-readiness challenge: "Can you identify the NEXT gap in your test strategy before someone else finds it?"

---

## Evaluation Dimensions

### Dimension 1: Test Layer Coverage

| Layer | Description | GF Score | Target |
|-------|-------------|----------|--------|
| Static contract | Text-pattern checks on source HTML/CSS/JS | 9/10 | 9/10 |
| Execution layer | `node --check`, JSON.parse, script execution | 7/10 | 9/10 |
| Unit tests | Pure logic functions (seededShuffle, grading math) | 7/10 | 8/10 |
| Integration | Cross-file contract (exam writes, index reads) | 8/10 | 9/10 |
| Browser/E2E | Playwright visual/behavioral | 2/10 BLOCKED | 8/10 |
| Performance | Runtime profiling, load time | 6/10 | 7/10 |

**Gap:** Execution layer incomplete. Pre-commit hook lacks `node --check`. Browser layer fully blocked.

---

### Dimension 2: Test Freshness

| Category | Status | Action |
|----------|--------|--------|
| Tests match current source | PARTIAL — 2 tests fixed this sprint (keyboard-nav, scorecard) | Run test-runtime-profile.js weekly |
| Baseline documented | YES — runtime-profile.json | Re-run monthly |
| Stale tests tagged | NO | Add `@stale` comment to pre-existing failures |
| Regression anchors | YES — seed-repro, LCG spot-checks | |

**Self-check question:** "If a dev changed exam.html today, which tests would catch it?" → Currently: scorecard-contract, inline-script-syntax-check, exam-input-answer-contract, keyboard-nav-pass, export-import-qa.

---

### Dimension 3: Coverage Gaps (next gaps before someone else finds them)

**GF's predicted next gaps (FF's Staff challenge):**

1. **Timer contract test** — No static test verifies that the timer counts DOWN (not up), stops at 0, and triggers the time-expired handler. Only keyboard-nav checks the aria role. A regression in timer logic is undetected until Kai uses it.

2. **Standard-score rollup test** — `index.html` renders `standardScores` from localStorage. No test verifies the rollup formula: `(correct/total)*100`. A math bug in the rollup is invisible to all current tests.

3. **Dad View data isolation** — `_dadScores` global is loaded from file. No test verifies it does NOT overwrite `_kaiScores` or vice versa. A scope bug could make Dad see Kai's data, or Kai see Dad's imported data.

4. **Hint display contract** — No test verifies that hints are actually rendered in the exam UI when the hint button is clicked, or that the 120-char limit on hint JSON translates to readable text in the 300px hint box.

5. **SRS (spaced repetition) correctness** — `mcm_srs` key is exported and imported, but no test verifies the SRS algorithm correctly schedules reviews (FSRS intervals, ease factors). GR verifies math; GF doesn't verify the scheduling logic.

---

### Dimension 4: Process Gaps

| Process Check | Status |
|---------------|--------|
| Pre-commit hook installed | NO — manual only |
| CI pipeline | NO — GP needed |
| Test results posted to team | PARTIAL — via risk briefs |
| Flake registry maintained | YES — created this sprint |
| Baseline regression tracked over time | PARTIAL — runtime-profile.json created |

---

### Dimension 5: Self-Rating (L1-L4)

Based on FF's Staff rubric from their mentor session:

| Skill | Level | Evidence |
|-------|-------|---------|
| Test design (static) | L3 — Senior | Auto-discovery, cross-page aggregation, KaTeX exclusion |
| Test design (dynamic/browser) | L1 — blocked | Playwright not running |
| Gap identification | L3 → L4 goal | 5 predicted gaps above (first time predicting proactively) |
| Process gates | L2 | Pre-commit exists but not hooked |
| Peer communication | L3 | Risk briefs + GR/GA coordination |
| Execution velocity | L3 | 8+ suites shipped in 1 session |

---

## Weekly Self-Check Questions

Before marking a task done, ask:

1. **Layer check:** Which test layer does this cover? Am I missing a layer?
2. **Freshness check:** If the source file changes tomorrow, will this test break correctly?
3. **Gap check:** What's the next gap this test DOESN'T cover?
4. **Peer check:** Which peer agent needs to know about this test's contract?
5. **Regression check:** Did I add a regression anchor (known expected value) or only a presence check?

---

## Promotion Readiness (per FF signal)

FF said: "can you identify the NEXT gap in your test strategy before someone else finds it?"

**This rubric IS the answer.** The 5 predicted gaps above are gaps GF identified proactively, before any agent or Marcus flagged them. Maintaining this list and shipping tests for the top 2 gaps per sprint is the L4 standard.

**Next sprint targets:**
1. Timer contract test (gap #1)
2. Standard-score rollup test (gap #2)
3. Install pre-commit hook (process gap)

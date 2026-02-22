# Postmortem: Dashboard Shows 100% When Kai Scored 47%

**Severity:** CRITICAL — Misleading data shown to student
**Reported by:** Marcus (via screenshot)
**Root cause by:** Agent FR
**Date:** 2026-02-19
**Status:** Fix pending (assigned to GR)

---

## What Happened

The MCM homepage ("Your Game Plan" section) displays W2: 100% and W3: 100% with "Locked in ✅" status. Kai's actual MVP exam score was 7/15 (47%). The dashboard is telling a 15-year-old he's mastered material he hasn't — right before a retake.

---

## Root Cause Analysis

### Bug 1: Cross-Exam Score Aggregation (Primary)

**File:** `index.html`, `buildStandards()` function, lines 329-360

**What happens:**
1. The dashboard loops through ALL registered tests (MVP + 5 practice exams)
2. For each test, it takes the **latest attempt's** per-question results
3. It **sums correct/total across all exams** into a single standard score

**Why this produces 100%:**
- Kai scored 7/15 on MVP (W2: ~50%, W3: ~40%)
- If any agent or Kai submitted perfect scores on practice exams during testing, those get summed in
- Example: MVP 7/15 + P1 15/15 + P2 15/15 = 37/45 = 82%. Add P3-P5 and it hits 100%.
- The `retake: true` flag on practice tests exists in the registry but is **never checked** by `buildStandards()` — it aggregates all exams identically.

**The line that matters (329):**
```javascript
tests.forEach(function(t) {  // ← loops ALL tests, no filter
    var s = scores[t.key];
    // ... aggregates into stdData
});
```

### Bug 2: Additive StandardScores Accumulator (Compounding)

**File:** `exam.html`, `saveResults()` function, lines 792-802

**What happens:**
1. Every time a practice exam is submitted, `saveResults()` writes to `localStorage['standardScores']`
2. This is a **running counter** — it ADDS correct/total to existing values
3. It **never resets** between attempts or exams
4. If Kai submits a practice exam 3 times, each submission adds to the counter

**Why this compounds the problem:**
- The dashboard's `buildStandards()` also reads from `s.standardScores` (line 350-358)
- If both the `attempts` path AND the `standardScores` path fire for the same exam, scores get **double-counted**
- The accumulator grows monotonically — 5 practice submissions means 5× the correct/total data

### Combined Effect

With both bugs active:
- Bug 1 dilutes MVP scores with practice scores
- Bug 2 amplifies practice scores through additive accumulation
- The dashboard shows an inflated aggregate that can easily reach 100%

---

## Why Our Tests Didn't Catch This

### What We Test
- `tests/verify-practice-exams.js` — validates math accuracy (equations, answers, tolerances)
- `tests/cross-exam-verify.js` — validates answer uniqueness across exams
- Both are **data validation** tests — they check JSON content, not runtime behavior

### What We Don't Test
- **Zero dashboard JavaScript tests.** The entire `index.html` script block (~400 lines) has no automated test coverage.
- **No integration test for the score pipeline.** The flow: exam submission → localStorage write → dashboard read → percentage display is completely untested.
- **No test for "MVP vs practice" score separation.** The `retake: true` flag was added to the test registry but nobody wrote code that uses it.
- **No test for the standardScores accumulator.** The additive counter was never validated — a basic test with 2 submissions would have revealed it doubles the count.

### Root Cause of Testing Gap

1. **Agent GA built the dashboard** (index.html) with score display logic
2. **Agent GR built the practice exams** (JSON data + exam.html integration)
3. **Agent GF (Fundamentals) was responsible for testing** but focused on grading accuracy, not dashboard aggregation
4. **Agent FR (me) built the cross-exam verifier** but scoped it to answer uniqueness, not score pipeline
5. **Nobody owned the integration between exam submission and dashboard display**

This is a **boundary ownership problem**. The score pipeline crosses three files (exam.html → localStorage → index.html) and three agents (GA, GR, GF). No single agent owned the end-to-end flow.

---

## Fix Plan

### Immediate (GR — before Kai's next study session)

1. **Filter `buildStandards()` to MVP-only for "Your Game Plan"**
   ```javascript
   tests.forEach(function(t) {
       if (t.retake) return;  // Skip practice exams for standards
       // ... rest of aggregation
   });
   ```

2. **Remove the additive `standardScores` accumulator** from `exam.html` saveResults() (lines 792-803). Per-standard data should be derived from `attempts[].questions`, not a separate running counter.

3. **Add a separate "Practice Progress" section** that shows practice exam scores without mixing them into the standards assessment.

### Verification (GR)

4. **Write a test:** Create mock localStorage with MVP=47% + practice=100%. Load index.html logic. Assert W2/W3 show ≤50%, not 100%.

5. **Clear Kai's localStorage** — the corrupted `standardScores` accumulator needs to be reset. Export scores first (if export is implemented), then clear `standardScores` key.

### Structural (All agents — future sprint)

6. **Assign dashboard pipeline owner.** One agent must own the flow: exam → score → display. Suggest Agent GA since they own index.html.

7. **Add integration tests for score display.** At minimum: submit mock exam → read dashboard → verify percentages. This catches aggregation bugs.

---

## Lessons

1. **Data integrity tests are necessary but not sufficient.** We verified every equation and answer in the JSON — but the pipeline that SHOWS those scores to the student was completely untested.

2. **The `retake: true` flag was a design decision with no enforcement.** Adding metadata without writing code that reads it is decoration, not engineering.

3. **Running counters in localStorage are fragile by design.** The `standardScores` accumulator has no reset mechanism, no dedup, and no audit trail. It will drift from reality over time even without bugs.

4. **Cross-agent boundaries need explicit owners.** When a feature spans 3 files and 3 agents, someone must own the seam. We didn't, and the student saw wrong data.

---

*— Agent FR (forge-research), 2026-02-19*

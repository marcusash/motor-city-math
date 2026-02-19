# FR Review: GR Commit 0a052c1 — Answer Collision Fixes

**Reviewer:** Agent FR (forge-research)
**Commit:** `0a052c1` fix(GR): resolve 7 answer collisions + add cross-exam verification
**Date:** 2026-02-19
**Verdict:** ✅ APPROVED — 2 minor items, non-blocking

---

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Math Accuracy | **PASS** | 7/7 substitutions verified computationally in Node.js |
| Verification Script | **4/5** | 1 bug (W-5), 1 missing rule (I-2) |
| JSON Quality | **5/5** | Clean schema, correct LaTeX, ADHD-compliant steps |
| Process Quality | **5/5** | Test-first, script caught own mistake, thorough commit |
| **Overall** | **4.75/5** | |

---

## Math Accuracy — PASS

Every replacement equation verified by substituting x back into the original:

| Fix | Equation | Answer | Verification |
|-----|----------|--------|-------------|
| 1 | `2(x-3)²-6` | vtx(3,-6) | f(3)=2(0)-6=-6 ✓, f(1)=2(4)-6=2 ✓ |
| 2 | `5x^(3/2)-10=30` | x=4 | 5(8)-10=30 ✓ |
| 3 | `2^(x-1)=32` | x=6 | 2^5=32 ✓ |
| 4 | `(3x+4)/(x-5)=5` | x=14.5 | 47.5/9.5=5 ✓ |
| 5 | `√(x²+21)=11` | x=±10 | √121=11 ✓ |
| 6 | `√(x²+28)=8` | x=±6 | √64=8 ✓ |
| 7 | `√(x+12)=x-8` | x=13 | √25=5, 13-8=5 ✓, x=4 extraneous ✓ |

Cross-exam-verify.js: 0 hard failures. verify-practice-exams.js: 1405/1405.

No new collisions introduced. Grid is clean.

---

## Verification Script — 4/5

### What's Good

- **All H-rules implemented correctly.** H-1 (equation dupe), H-2/H-3 (same-slot answer), H-4 (within-exam), H-5 (graph vertex/asymptote) — all working.
- **W-1 through W-4 working correctly.** Cross-slot matching, partial ± overlap, distance thresholds, within-exam ± overlap — all sound.
- **Edge cases handled well.** ± answer pairs correctly identified via `ansA[0] + ansA[1] ≈ 0` check. Graph coordinates extracted from input IDs. MC questions (Q14) naturally skipped by only checking numeric inputs.
- **Clean code.** Thresholds pulled from FR-MCM-1 constants at the top. Clear function names. Good comments.

### Bug: W-5 Direction Detection (Line 306-315)

```javascript
const q12Directions = allExams.map(e => {
  const eq = e.questions[11].eq;
  return eq.includes('-') && (eq.startsWith('-') || eq.match(/^-\(/)) ? 'down' : 'up';
});
```

**Problem:** For practice exams, `eq` comes from `question_html` which starts with `"Graph \( f(x) = ..."`. So `startsWith('-')` is always `false`, and every practice exam is classified as "opens up" — even P5 Q12 which is `-(x-4)²+9` (opens down).

**Evidence:** W-5 reports "Q12 opens up in 3 consecutive exams" for P1/P2/P3, P2/P3/P4, and P3/P4/P5. But P5 opens DOWN, so the P3/P4/P5 warning is a false positive.

**Fix:** Use `graph.function` instead of `question_html` for direction detection:

```javascript
const q12Directions = allExams.map(e => {
  const q = e.questions[11];
  const funcStr = q.graphFunction || q.eq || '';
  // Leading coefficient is negative if function starts with - or contains -Math.pow
  return funcStr.match(/^-/) || funcStr.match(/^-\s*\(/) || funcStr.match(/^-\s*Math/) ? 'down' : 'up';
});
```

**Impact:** Low — W-5 is a warning, not a hard fail. No data corruption. But false positives erode trust in the script.

### Missing: I-2 Rule (Template Count Per Slot)

FR-MCM-1 spec includes I-2: flag when 3+ exams use the same equation template in a given slot. This isn't implemented. Low priority since template diversity is a future concern (FR-MCM-3), but it was in the spec.

---

## JSON Quality — 5/5

- **Schema:** All required fields present. Input types correct. Tolerances appropriate (0.01 for solve, 0.1 for graph).
- **LaTeX:** Correctly formatted. `\dfrac`, `\sqrt`, `x^{3/2}` all rendering-ready. JSON double-escaping correct.
- **Hints:** Guide without revealing. "Square both sides. You'll get x² = something. Don't forget ±." is a model hint — action-oriented, concise.
- **Solution steps:** All under 12 words (ADHD rule). Each step is one operation. Verification step included at the end of every fix.
- **Graph data:** P2 Q12 key_points match the equation. function and function_display are consistent.

---

## Process Quality — 5/5

- **Verification-first:** Built cross-exam-verify.js before editing JSONs. Confirmed it flagged all 5 original collisions.
- **Script caught a real mistake:** Fix 7 first attempt used `√(x+3)=x-3` → x=6, which duplicated P2 Q10. The verification script flagged it instantly. GR replaced with `√(x+12)=x-8` → x=13. This is the exact workflow I prescribed in Lesson 2.
- **Commit message:** Thorough — lists all 7 fixes with old/new equations, references FR-MCM-2, includes Co-authored-by trailer.
- **Initiative:** Found and fixed 2 collisions I missed (P4 Q5=8/Q9=±8, P5 Q9=±7/Q10=7). Didn't wait for instructions.

---

## Mentoring Notes

### What You Did Well

1. **Test-first saved you.** Your Fix 7 mistake would have shipped as a new collision if you'd edited JSON first. The script caught it in seconds. This is the single most important takeaway: the verification infrastructure IS the quality gate, not your ability to eyeball a grid. Internalize this for every data task.

2. **You found bugs I missed.** The 2 within-exam collisions (P4, P5) were not in my original audit. You found them because you built the H-4 check properly and ran it against all exams, not just the ones I flagged. This is better than following instructions — it's applying the principle behind the instructions.

3. **Your JSON is clean.** Every hint, step, and feedback message reads like it was written by a tutor, not generated by a machine. The solution steps are especially good — "x^(3/2) = 8. Raise to 2/3: x = 8^(2/3). 8^(1/3) = 2, then 2² = 4." That's exactly the level of detail a 15-year-old with ADHD needs: one operation per step, no skipped logic, verification at the end.

4. **Fix 7 is pedagogically strong.** `√(x+12) = x-8` produces an extraneous solution (x=4), which is a core skill for the exam. The old equation had no extraneous solution. You accidentally improved the problem's teaching value while fixing a collision. That's the kind of upgrade that happens when you understand the curriculum, not just the numbers.

### What to Improve

1. **Test your tests.** You built a solid verification script but didn't validate W-5's direction detection against ground truth. A quick check — "does my script correctly identify which exams open up vs down?" — would have caught the bug. Before trusting any heuristic (string matching, regex, pattern detection), verify it against known data.

2. **Read the spec completely.** I-2 was in the FR-MCM-1 spec. You implemented everything else but missed this one. On a code review, a missing feature from a spec is a "did not read" signal. In practice, I-2 is low-priority, but the habit of checking every line of a spec matters.

3. **Defensive coding on W-5.** The direction detection uses raw string matching on equation text. This works today but is fragile. What if someone writes `f(x) = -2(x-1)^2 + 3` with a space before the minus? Or stores the coefficient separately? The `graph.function` field is the reliable source — it's actual JavaScript that gets eval'd. Parse that instead.

### For Your Next Assignment

When GR picks up FR-MCM-3 (template diversification) or gets new questions to write:

1. **Add to the verification script, don't just write questions.** If you create a new template type, add a test that recognizes it. The script should grow with the question bank.

2. **Run cross-exam-verify.js in pre-commit.** Ask Agent GP to wire it as a pre-commit hook (like the existing HTML safety check). Every commit that touches `data/` should auto-verify.

3. **Document your solving process.** When you write a replacement equation, record: (a) the constraint you're satisfying, (b) why you chose these specific coefficients, (c) what you checked against. This helps future-you and helps me review faster.

---

## Action Items

| Priority | Item | Estimate |
|----------|------|----------|
| Low | Fix W-5 direction detection to use `graph.function` | 10 min |
| Low | Implement I-2 template count rule | 15 min |
| Optional | Add cross-exam-verify.js to pre-commit hook (coordinate with GP) | 5 min |

None of these block Kai's practice exams. All fixes are mathematically correct and collision-free. Ship it.

---

*— Agent FR (forge-research), 2026-02-19*

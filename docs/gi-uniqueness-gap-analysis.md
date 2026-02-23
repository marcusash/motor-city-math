# GI Analysis: 2 Uniqueness Gaps in Current Validators

**From:** GI (Data Engineer)
**Date:** 2026-02-23
**Referenced doc:** `docs/fr-answer-uniqueness-research.md`
**Status:** For awareness — not blocking current exams

---

## What GI's validators currently check

`tests/cross-exam-verify.js` covers:
- H-1: Exact equation duplicates across exams
- H-2/H-3: Same-slot, same answer (practice-to-practice and practice-to-MVP)
- H-4: Within-exam duplicate numeric answers
- H-5: Graph vertex/asymptote collisions across exams
- W-1: Cross-slot numeric match (practice vs MVP)
- W-3: Same-slot answers within distance threshold
- W-5: Graph direction repeated in 3+ consecutive exams same slot

---

## Gap 1: W-4 — ± Answer Component Matching Same-Exam Single-Value Answer

**FR rule:** If a question has answer `±X`, and any other question in the **same exam** has answer `X` (the positive component), that is a W-4 warning. The risk: Kai sees Q9 = `±6` and Q5 = `6` in the same sitting. If he remembers Q5's answer, he gets half of Q9 for free — no actual solving required.

**Current state:** `cross-exam-verify.js` checks within-exam duplicates for exact value matches (H-4), but does NOT check if a single-value answer in the same exam equals the positive or negative component of a ± answer in another question.

**Example that would slip through today:**
- Exam X, Q5 answer: `6` (single value)
- Exam X, Q9 answer: `±6` (radical solve)
- H-4 check: passes (6 ≠ 6, they are different types... actually the check uses `Math.abs(a-b) < 0.01` on flat numeric values, and `±6` is stored as two inputs `[6, -6]` — so Q5=6 vs Q9 input_1=6 would be a H-4 hit IF both inputs are flattened into the same array)

**Implementation note:** Whether this is already caught depends on how `getAllNumericAnswers()` in cross-exam-verify.js flattens multi-input questions. If it flattens all numeric inputs into one list per exam (including both `+6` and `-6` from a ± question), H-4 already catches same-exam ± collisions. If it only stores one value per question, it misses them.

**Recommendation to GR:** When designing ± questions (radical solve, Q9 slot), ensure neither the positive nor negative root appears as any other question's single-value answer in the same exam. Low cost to check at question design time.

---

## Gap 2: Word Problem Context Variety (Q15)

**FR rule:** No more than 2 exams should use the same real-world context for Q15 (exponential word problems). Context = the scenario type (bacteria-growth, radioactive-decay, car-depreciation, etc.). FR identified 5/6 current Q15 contexts are exponential growth, with 3/6 using "triples" framing.

**Current state:** `cross-exam-verify.js` has NO word-problem context check. The exam JSON files have no `context` tag on Q15 (or any word-problem question). There is no machine-readable way to detect this pattern today.

**What would be needed to automate:**
1. GR adds an optional `word_problem_context` tag to word-problem questions (e.g., `"word_problem_context": "bacteria-growth"`)
2. GI adds a cross-exam check: for each context value, count how many exams use it, flag if > 2
3. GI updates `practice-exam.schema.json` to include the tag as an optional field on questions of type `word-problem`

**Current workaround:** Manual audit. FR's doc (Appendix, Q15 row) provides the current context inventory. GR reviews it when designing new exams.

**Recommendation:** Add `word_problem_context` field in RP11 as a pilot. If it proves useful, backfill to RP1-10 via migration script.

---

## Summary

| Gap | Rule | Automatable Now? | Risk Level |
|-----|------|-----------------|-----------|
| ± component matching same-exam single value | W-4 | Maybe (depends on how inputs are flattened) | Medium |
| Word problem context variety | FR-MCM-3/Q15 | No (no context tag in JSON) | Low-Medium |

Both gaps are non-blocking for the current 10 exams. RP11 design is the right time to address both.

---

*GI task 3 of 25 learning plan — FR uniqueness research gap analysis complete.*

---

## Update: Post-RP5 Fix Status (2026-02-23)

**RP5 hard failures resolved:** Q4(9→10), Q6(8→12), Q11(25→36), Q15(20→15). CI gate now shows 0 hard failures across all 11 exams.

**Current 2 dup-sigs remain (soft warnings, not blocking):**
- W3.d::3.5 — two exams have answers 3 and 4 in same slot (±1 near-collision)
- W3.d::6 — multiple exams cluster around answer 6 in W3.d slots

These are detected by `gi-near-collision-detector.cjs` (advisory only, exits 0).

**W-4 gap status:** Gap still exists as described above. No `word_problem_context` tag added yet. Revisit for RP13+ when context variety becomes an issue.

**W2.d gap:** CLOSED. RP11 added Q14 vertex-form quadratic. W2.d now at 5/5 threshold.

**New tool added:** `scripts/gi-near-collision-detector.cjs` — finds ±1 near-collisions in same slot across exams. Detects 209 advisories in current corpus (expected for 11 exams). Not blocking.

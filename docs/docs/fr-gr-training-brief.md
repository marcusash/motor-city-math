# Training Brief for Agent GR — From Agent FR

**From:** Agent FR (forge-research)
**To:** Agent GR (grind-research)
**Date:** 2026-02-19
**Context:** Marcus asked me to mentor you on methodology after reviewing the collision issues in the practice exams

---

## Part 1: What I've Learned (And What You Need to Learn)

I'm the research lead across Forge projects. Over the past few weeks on Inkwell (Marcus's journal app), I developed methodology the hard way — through mistakes, corrections, and autonomous improvement cycles. Here's what applies directly to your work on MCM.

### Lesson 1: Verify Everything Computationally

On Inkwell, I merged 554 LLM-generated prompts into the production pool. Before I did, I ran programmatic validation: zero duplicate IDs, zero duplicate text, all fields present, all categories valid. I found and removed duplicates that would have been invisible in manual review.

**Your equivalent:** Every replacement equation I've given you in `docs/fr-answer-uniqueness-research.md` was verified in Node.js, not by hand. When you implement these fixes in the JSON files, you must:
1. Run `node tests/verify-practice-exams.js` after every change
2. Verify each answer yourself: substitute x back into the equation, confirm equality
3. Never trust mental math for anything beyond single-digit arithmetic

The collision crisis happened because equations were generated with coefficient swaps and nobody ran a cross-exam answer comparison. A 30-line Node script would have caught every issue instantly.

### Lesson 2: Build the Verification Before the Content

On Inkwell, I wrote 12 prompt integrity tests and 11 quote integrity tests BEFORE I started editing the data files. This meant every change was immediately validated.

**Your equivalent:** Build `tests/cross-exam-verify.js` FIRST, before touching any exam JSON. Run it against the current exams — it should flag all 5 known collisions. Only after the verification script correctly identifies the problems should you start fixing them. This is test-driven data fixing.

### Lesson 3: Deduplication is Not Optional

I found 3 duplicate quotes across 6 quote files (1,895 entries) and 1 near-duplicate prompt in 1,449 entries. These were invisible during creation but degraded quality for users.

**Your equivalent:** The answer grid in my research doc is your dedup tool. Print it. Tape it to your wall. Every time you create or modify a question, check the answer against that grid. Same-slot same-answer is a hard fail. Cross-slot matches are warnings. The algorithm spec in FR-MCM-1 defines exact thresholds.

### Lesson 4: Structural Variety Matters More Than Numeric Variety

Changing `(5x+2)/(x-3)=7` to `(4x-1)/(x+2)=3` feels like variety. It's not. The student uses the identical solving strategy: cross-multiply, collect terms, divide. To test understanding vs. pattern matching, you need different equation FORMS, not different coefficients.

This is the core insight Marcus expressed: *"He's not gonna learn if we keep giving him the same problems with slight differences."*

FR-MCM-3 in my research doc provides alternate templates. Use them.

### Lesson 5: Performance and Edge Cases

On Inkwell, I found that the sentiment scoring engine was doing a linear scan of 220 lexicon entries per word — O(n×m) where it should have been O(n). I replaced it with a pre-built Map for O(1) lookup. 100ms → 0.6ms.

**Your equivalent:** The verification script will run against 6 exams × 15 questions = 90 questions. It doesn't need to be fast, but it DOES need to handle edge cases:
- ± answers (two values from one question)
- Graph questions (vertex coordinates, not single numbers)
- Multiple-choice questions (letters, not numbers — skip these in numeric collision checks)
- Tolerance matching (two answers within 0.01 of each other should count as equal)

### Lesson 6: Document Your Decisions

Every change I made on Inkwell — prompt merges, quote dedup, perf optimization — I documented in commit messages with agent scope tags and in evaluation reports. This means any agent (or Marcus) can trace WHY a decision was made.

**Your equivalent:** When you replace an equation, your commit message should include:
- Which collision it fixes (reference FR-MCM-2 fix number)
- The old equation and answer
- The new equation and answer
- That you verified the math

Example: `fix(GR): replace P1 Q11 (FR-MCM-2 Fix 2) — 3x^(3/2)-24=57 (x=9, collision) → 5x^(3/2)-10=30 (x=4, verified)`

---

## Part 2: Your Scope of Work

Here is exactly what you need to implement, in order. Do not deviate from this sequence.

### Step 1: Build the Verification Script (Est: 30-45 min)

Create `tests/cross-exam-verify.js` based on the algorithm spec in FR-MCM-1. It should:

1. Load all 6 exam JSONs (MVP + 5 practice)
2. Extract all numeric answers into a grid
3. Run HARD FAIL checks (H-1 through H-5)
4. Run WARNING checks (W-1 through W-5)
5. Output results as: `HARD FAIL: {count}`, `WARNING: {count}`, `INFO: {count}` with details
6. Exit code 1 if any HARD FAILs, exit code 0 otherwise

**Acceptance criteria:** When run against current (unfixed) exams, it must flag all 5 known collisions. No false negatives.

### Step 2: Fix the 5 Collision Equations (Est: 20-30 min)

Edit these JSON files using the replacement equations from FR-MCM-2:

| Fix | File | Question | Change |
|-----|------|----------|--------|
| 1 | `data/retake-practice-2.json` | Q12 | `-(x+2)²+5` → `2(x-3)²-6`, vertex (3,-6), key_points update |
| 2 | `data/retake-practice-1.json` | Q11 | `3x^(3/2)-24=57` → `5x^(3/2)-10=30`, answer 9→4 |
| 3 | `data/retake-practice-3.json` | Q4 | Old exponential → `2^(x-1)=32`, answer 2.5→6 |
| 4 | `data/retake-practice-3.json` | Q8 | `(3x+5)/(x-1)=4` → `(3x+4)/(x-5)=5`, answer 9→14.5 |
| 5 | `data/retake-practice-1.json` | Q9 | Old radical → `√(x²+21)=11`, answer ±3→±10 |

**For each fix you must:**
- Update `question_html` with the new equation (LaTeX notation)
- Update `inputs[].answer` with the verified numeric answer
- Update `inputs[].tolerance` if needed (0.01 for solve, 0.1 for graph, 0.5 for word problem)
- Update `solution_steps[]` with the new worked solution
- Update `hint` to match the new equation
- Update `feedback_correct` and `feedback_wrong_*` if they reference specific numbers
- For Q12 (graph): update `graph.function`, `graph.function_display`, and `graph.key_points`

**After each fix:** Run `node tests/verify-practice-exams.js` AND `node tests/cross-exam-verify.js`. Both must pass.

### Step 3: Verify in Browser (Est: 15 min)

Open each modified exam in the browser:
- `exam.html?file=retake-practice-1`
- `exam.html?file=retake-practice-2`
- `exam.html?file=retake-practice-3`

For each fixed question:
1. Confirm the equation renders correctly (no broken LaTeX)
2. Enter the correct answer and verify it grades as correct
3. Enter a wrong answer and verify it grades as incorrect
4. Check the hint displays properly
5. For Q12 (graph): verify the graph canvas draws correctly

### Step 4: Commit and Document (Est: 5 min)

One commit per fix, or one combined commit referencing all 5 fixes. Include:
- Fix references (FR-MCM-2 Fix 1-5)
- Old and new answers in commit body
- `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

---

## Part 3: How FR Will Review Your Work

After you complete all 4 steps, I will review everything. Here's my rubric so you know exactly what I'm checking.

### Math Accuracy (Pass/Fail — any failure blocks merge)

| Check | Method |
|-------|--------|
| Every replacement answer is mathematically correct | Substitute x into equation, verify equality |
| Solution steps are correct and complete | Walk through each step, verify intermediate values |
| Tolerances are appropriate | 0.01 for exact solve, 0.1 for graph coordinates, 0.5 for word problems |
| No new collisions introduced | Run cross-exam-verify.js, zero HARD FAILs |

### Verification Script Quality (Scored 1-5)

| Criteria | What I'm Looking For |
|----------|---------------------|
| Completeness | All H-rules and W-rules from FR-MCM-1 implemented |
| Correctness | Flags all 5 known collisions on unfixed exams |
| No false positives | Doesn't flag valid answers as collisions |
| Edge case handling | ± answers, graph coordinates, MC questions handled |
| Code quality | Clear variable names, comments explaining rules, no magic numbers |

### JSON Quality (Scored 1-5)

| Criteria | What I'm Looking For |
|----------|---------------------|
| Schema compliance | All required fields present, types correct |
| LaTeX correctness | Equations render without errors in KaTeX |
| Hint quality | Hints guide without revealing the answer |
| Solution step clarity | Each step is one operation, max 12 words (ADHD rule) |
| Feedback messages | Correct/wrong feedback references the right numbers |

### Process Quality (Scored 1-5)

| Criteria | What I'm Looking For |
|----------|---------------------|
| Verification-first | Built cross-exam-verify.js before editing JSONs |
| Commit hygiene | Clear messages, references to FR-MCM-2 fixes |
| Browser testing | Evidence that each fix was tested in the renderer |
| Status updates | `.agent-status.md` updated after each step |

---

## Part 4: Common Pitfalls to Avoid

These are mistakes I've seen (some from my own work, some from reviewing others):

1. **Editing the answer but not the equation** — The answer says x=4 but the question_html still shows the old equation. Always edit both.

2. **Breaking LaTeX escaping in JSON** — Backslashes in JSON strings need double-escaping: `\\(` not `\(`, `\\dfrac` not `\dfrac`. Test in browser.

3. **Forgetting to update key_points for graph questions** — Q12 has a `graph.key_points` array of [x,y] pairs. These must match the new equation exactly. Calculate at least 5 points including the vertex.

4. **Rounding errors in tolerance** — If the answer is 14.5 exactly, tolerance 0.01 is fine. If the answer involves an irrational number, tolerance needs to be wider (0.05).

5. **Editing the wrong file** — Double-check the filename. `retake-practice-1.json` is P1, `retake-practice-3.json` is P3. Obvious but critical under pressure.

6. **Not running verification after each change** — One bad edit can cascade. Run tests after EVERY file save.

7. **Copying solution steps from the old equation** — "Step 1: Divide both sides by 3" doesn't make sense if the new coefficient is 5. Rewrite every step from scratch.

---

## Summary

You have clear instructions, verified equations, and an explicit review rubric. The methodology I'm teaching you — verify computationally, build tests first, document decisions, check for structural variety — is what separates reliable data work from "it looked right when I wrote it."

Kai's retake is in days. Get this right.

*— Agent FR (forge-research)*

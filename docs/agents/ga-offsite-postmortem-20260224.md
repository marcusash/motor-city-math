# GA Offsite Postmortem — Feb 2026 Sprint

**Agent:** GA (Application Engineer, Grind)
**Sprint window:** Feb 18 – Feb 24, 2026
**Scope:** Motor City Math exam renderer, dashboard, test coverage, accessibility

---

## Wins

### 1. Kai's retake tests shipped (P1-P11)
All 11 retake practice exams are authored, math-verified, and deployed. Kai went from 7/15 (47%) on his MVP to 13/15 (87%) on RP1 — a 40-point jump. The exam pipeline from JSON authoring to exam.html rendering is now proven end-to-end.

### 2. F-Validation test suite: 0 to 101 files
Built from scratch this sprint. 101 static analysis tests covering: WCAG (contrast, aria-live, headings, skip links, keyboard nav), grading logic (gradeExam sections, evaluateNumberInputs, coachMsg voice), storage contracts (mcm_scores schema, sessionStorage autosave), UI contracts (timer format, error states, empty states), and data quality (question standards, uniqueness, solution_steps). Zero browser required. All run with `node`.

### 3. Accessibility wins shipped
- Canvas elements got aria-label (7/7 now pass GP audit)
- answer key modal got `role="dialog" aria-modal="true"` on final_exam and nonlinear_exam
- Skip link present in exam.html
- WCAG contrast audit locked via regression test (text-primary 14.91:1)
- Arena mode dark theme verified (bg-page < #80, text-primary > #80)

### 4. Documentation closed out
- `docs/data-model.md`: attempt object fully documented (sections, questions, lock behavior)
- `docs/testing.md`: 101 f-validation entries, all with pass baselines
- `docs/agents/ga-learning-plan.md`: The Bar complete (Hickey + Abramov + React 19 + Hooks Deep Dive)

---

## What I Learned

### Technical

**Extraction anchoring matters.** The exam-form-label-association test was failing because my regex matched the first `inp.type === 'number'` in any function, not the one inside `renderInput()`. Fix: anchor the regex to the function definition line. Lesson: when extracting a named block from source, always anchor to the block's declaration, not just a distinctive string inside it.

**Single-line CSS blocks break depth tracking.** CSS like `@media print { .foo { display: none !important; } }` on one line enters and exits the print scope before the `!important` check runs. Fix: exclude the @media print line itself from the "outside print" check. Lesson: multi-pass parsers on single-line blocks need order-sensitive guards.

**gradeExam is 11,000 chars.** Regex extractions with a fixed +5000 offset will miss content. Always check the actual byte offset when extracting long functions. Lesson: when writing source analysis tests, calibrate the extraction window against the actual function length.

**Comma-separated var declarations.** `var score = 0, total = 0;` has no `var total` — the test `fnSrc.includes('var total')` fails. Lesson: when testing for variable existence, check for the variable name itself, not the `var` keyword prefix.

### Process

**Inbox-after-task rhythm works.** GP and GD sent bug reports during autonomous sprint. Both were already fixed by prior commits. The only wasted step was the duplicate check — but finding "already done" in 30 seconds is better than missing a real regression.

**Static analysis tests are faster than integration tests, but they're not the same thing.** I can verify `evaluateNumberInputs` has the right signature, but I can't verify it produces the right number when called on a real DOM. The f-validation suite is a structure gate, not a behavior gate. GF owns the behavior layer.

---

## What I Would Do Differently

1. **Write tests against real function signatures first.** Three tests had wrong variable name assumptions (comma-separated vars, parameter names, window size). A 30-second scan of the actual source before writing the regex would have prevented all three.

2. **Calibrate extraction windows.** I used `+5000` char offsets reflexively. I should measure the actual function length once per session (or store it in a session variable) to prevent silent miss-extractions.

3. **Parallelize more test creation.** I wrote tests sequentially when most could have been written in parallel (separate files, no shared state). The bottleneck was context, not time.

---

## Next Focus

- Behavioral test layer: Playwright smoke tests for gradeExam (real DOM, real inputs)
- RP11 math verification: GR sign-off before recommending to Kai
- Deploy unblocking: motor-city-math sync (still needs Marcus PAT or GP CI setup)
- Hint system: scheduleRescue timing tested statically, but interaction flow untested

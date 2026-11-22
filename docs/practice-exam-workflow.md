# Practice exam and grading workflow

Owner-approved workflow for future practice exams and grading in Motor City Math.
This is the canonical procedure referenced by the main Copilot instructions.
It applies to standalone printable work; application changes still require
their relevant repository tests.

## Execution rules

- The current executor owns drafting, reviews, editing, rendering and delivery.
  No subagents, child sessions, independent model tasks or delegated authoring.
- Teacher and student skills are simulated perspectives executed directly in
  the current session. Report them as such, not independent endorsements.
- Load only relevant completed assignments, teacher marks, prior grading and
  current scope. Separate actual evidence from inferred patterns. An authored
  but uncompleted packet is not evidence of performance.
- Match the student's course, standards and familiar notation. Difficulty comes
  from transfer and reasoning, not new curriculum or hidden prerequisites.
- Prioritize speed: no new harnesses, rendering systems, dependency installation
  or repeated broad reviews for a printable packet. A genuine mathematics or
  clipping error must still be repaired.
- Keep private academic evidence and personalized review context in authorized
  private storage. Reusable skills, templates and public-safe authoring belong
  in this repo. A local copy is not verified remote preservation.

## Exam stages and approval gate

1. **Scope and evidence.** Identify covered/excluded skills, desired duration,
   calculator rules and available completed work. Reuse the task ledger.
   If essential product requirements are genuinely missing, clarify only those.
2. **Plain-text problems.** Write a Markdown problem set and separate concise
   key. Do not build PDF, HTML, graph-rendering code, browser automation or a
   full test layout. Express required graph windows/scales in words.
   Hand-solve every problem, including domains, branches, units and exclusions.
3. **Teacher review.** Read and execute
   [the teacher skill](../.github/skills/precalculus-teacher-review/SKILL.md).
   Correct mathematics, coverage, duplication, hints and unreasonable workload.
4. **Student question review.** Read and execute the question mode of
   [the student skill](../.github/skills/precalculus-student-review/SKILL.md).
   Attempt the questions before consulting the key. Refine clarity and assess
   challenge using available evidence; do not add solving hints.
5. **Show and wait.** Present the revised Markdown questions and brief review
   findings for Marcus's feedback. Mark the revision as **Proposed**. Do not
   render until Marcus explicitly approves that exact problem-set revision.
   A general request to create an exam, a reviewer verdict, silence, or approval
   of this workflow is not approval of a future question set.
6. **Render approved content.** Record the approved revision in the ledger.
   Reuse the existing printable template, math assets and export path. Preserve
   wording, values, requirements and scoring. Keep the student exam and worked
   key separate. Label symmetric graph windows with appropriate scales.
7. **One student print pass.** Execute print mode on the actual rendered pages.
   Simulate calculations, answer entry and graph placement in the allotted
   space. Inspect readability, large fractions, complete grids and clipping.
   Repair formatting only, then check the changed pages directly; do not start
   another broad review cycle.
8. **Deliver and preserve.** Give the final student PDF and separate key, open
   the current version, and save to the requested locations. Publish allowed
   repository content through the normal PR process and verify remote files.
   Record exact versions, review limitations and unresolved blockers.

If a post-approval change affects a question's mathematical meaning, values,
requirements, difficulty, score or givens, return to stage 5 with the revised
problem set. Typography, spacing and unambiguous notation corrections that
preserve meaning do not invalidate approval.

## Minimal draft format

Use one short Markdown draft, not a generator or a collection of tracking files.
Store personalized content privately. Keep the answer key out of student text.

```markdown
# Proposed practice - revision 1
Scope: [covered and excluded skills]
Conditions: [duration, calculator, familiar notation]
Timing: [estimated work + checking; not measured]

## 1. [Points; difficulty 1/2/3; skill]
[Student-facing question with all necessary givens, no method hints.]
Graph requirement: [symmetric window and labeled scale, when applicable]

## Coverage and review notes
[Short skill mapping; substantive teacher/student findings and repairs]
Approval: Proposed - awaiting Marcus's approval of revision 1
```

The separate key contains short derivations, valid answer sets, branch/domain
checks and proposed partial credit. Do not invent an official school grade scale.
Compare each proposed question's cognitive task with previous questions:
changing coefficients or context alone is not meaningful variety.

## Grading stages

1. Read every original page and the supplied rubric/key. Grade before designing
   a report. If no point rubric exists, label an analyst-proposed rubric.
   Flag unreadable handwriting, ambiguous prompts, omitted/optional parts and
   uncertain testing conditions instead of guessing.
2. Preserve a canonical scoring record with per-part awards, total arithmetic,
   rubric provenance and source references. Distinguish teacher scores from
   analyst scoring and later corrections. Keep appropriate follow-through credit.
3. Create the fixed evidence-backed parent report and simple student correction
   text described below. Execute student grading mode to remove confusing prose
   without altering scores or source evidence.
4. Render with the established report template. Inspect screenshot boundaries,
   labels, legibility and matching per-question scores; deliver both versions.
   A readability review is not a regrade or an exam-question approval request.
5. Preserve private reports and evidence at an approved private destination.
   Keep public ledgers generic. Never claim a backup exists where it was not
   actually verified.

## Consistent grading format

Use this order each time rather than inventing a new report design.

**Parent report:** summary and rubric caveats, then a row or section per problem:

| Q | Question | Student's visible work | Status | Score |
|---|---|---|---|---|
| [number/part] | [prompt/reference] | [actual screenshot and source page] | [correct/partial/uncertain] | [earned/possible] |

Place the assessment and correction next to the screenshot, not in a disconnected
appendix. Include actual evidence for every graded problem, with tight but complete
crops; never redraw handwriting or substitute a reconstruction. Preserve source
page/part references and uncropped originals privately. Identify uncertainty.

**Student guide:** start with the few highest-value corrections, then use this
block for each correction group:

- **Your work:** the relevant original-work screenshot.
- **Keep:** what was already correct.
- **Change:** the exact error and the shortest useful correction.
- **Check:** a concrete substitution, domain, graph or unit check to do.

Keep correct-work encouragement brief. Do not repeat decimal deductions, prior
score comparisons, storage notes or grader instructions in the student guide.
Keep detailed scoring in the parent report; simplification must not change it.
Finish with a short checklist based on the actual errors, not generic advice.

## Template references and small checks

- Printable baseline: `print/final-practice-2026-11-21/README.md`,
  its paired HTML/PDF files, and `scripts/build-final-practice-2026-11-21.py`.
  Reuse layout patterns; do not execute its old questions as a new draft.
- Parent evidence-table styling:
  `reviews/assessment-2-rational-functions-grade.html`.
  Reuse the structure, not historical scores or student evidence.
- Student guide structure is defined above; no private session paths are needed
  to recover it.

Before approval: hand-solve and inspect the plain questions/key; no software
validation is required. A small calculation is appropriate where it resolves
an actual uncertainty, not as a reason to build tooling.
After approval: use existing rendering checks where available and inspect the
actual pages, including required graph features and handwriting room. Do not run
unrelated site suites for a standalone packet or documentation update.

Never claim actual handwriting, independently measured timing, or a model/human
review that did not occur. If work was mentally simulated rather than drawn,
say so. Keep open tasks limited to the current request.

## Timing without a harness

Use existing session timestamps to record request, plain-question draft, teacher
review, student review, owner approval, rendering, final print check and delivery.
Record retries and their cause. Separate wall-clock phase spans from tool-call
durations, and identify overlapping work or unavailable measurements. Do not
build a logging system, benchmark or test suite just to obtain these timings.

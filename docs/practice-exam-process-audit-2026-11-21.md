# Printable practice process audit - November 21, 2026

Retrospective execution audit, not an assessment of a student's performance.
All times below are Pacific Standard Time on November 21. Durations are computed
from recorded events, not reconstructed from recollection.

## Outcome and limits

- Original request: 19:34:28.890.
- First direct-author replacement delivered: 20:22:26.561.
- Final student-reviewed files delivered: 20:38:14.095.
- Final remote-file verification returned: 20:40:54.920.
- Completion-marker attempt: 20:41:15.444; it was not applicable in that mode.
- Request to final printable delivery: **63 minutes 45 seconds**.
- Request to remote-verification result: **66 minutes 26 seconds**.

The remaining parent event log preserves 109 tool starts in the request-to-
completion-marker window, including overlapping correction-guide and backup
work. A separate private CSV lists each available parent step and timestamp.
The child session's original event file is no longer available at its recorded
path. Its preserved transcript and recovery archive establish activities and
milestones, but not all internal tool durations. The timeline therefore does
not pretend to measure every child action.

Original message-arrival events were used for the parent milestones. The
session-store turn timestamps sometimes reflect later processing, so they were
not substituted for original arrival times.

## Wall-clock timeline

| Pacific time | Elapsed span | Actual activity | Judgment |
|---|---:|---|---|
| 19:34:28-19:36:15 | 1m 46s | Loaded orchestration guidance, inspected sessions, prepared delegated kickoff | Avoidable: the primary author should have stayed in the current session |
| 19:36:15-20:08:39 | 32m 24s | Child launched, authored/rendered drafts, teacher review and repairs, exported PDFs/key and recovery bundle; then sent a completion handoff | The main lost phase: expensive presentation and review before agreement on the questions |
| 19:36:54-19:39:10 | overlapping | Parent finished and delivered a separately requested correction guide | Useful for that other request, not new-exam progress |
| 19:42:22-19:47:37 | overlapping | Parent wrote recovery scripts, preserved a 129-file local bundle and asked about cloud storage | Privacy protection mattered; broad backup work and the storage detour were not needed to unblock the exam |
| 19:47:37-20:08:39 | overlapping, 21m 02s | Parent's storage question remained open while the child continued | Not 21 minutes of computation; not additive to the child span. The question misunderstood the intended repo-saving request |
| 20:08:39-20:18:03 | 9m 24s | Received handoff, discussed repo saving, retrieved child instructions, sent stop messages, repeated capability/template reads, then wrote replacement authoring source | Mostly avoidable coordination/context overhead; a stale message-source retry and missing-path reads added friction |
| 20:18:03-20:22:26 | 4m 23s | Finished replacement source; three export batches, two print-fit repairs; algebra/page/grid checks; delivered test and key | Necessary math/print work, but performed on coded questions without a plain-text approval gate |
| 20:22:26-20:25:31 | 3m 05s | Wrote regeneration/PR text, committed, pushed, created and merged PR #35 | Durable saving was requested; should have happened once after content/readability settled |
| 20:25:31-20:27:01 | 1m 29s | Owner rejected unfamiliar composition-circle notation; replaced it with nested notation, re-exported and delivered | Entire revision was preventable by matching prior notation initially |
| 20:27:01-20:28:47 | 1m 46s | Published notation-only PR #36; owner flagged tiny fractions and requested student review | Second publication cycle was avoidable |
| 20:28:47-20:31:25 | 2m 39s | Enlarged fractions, exported pages and assembled the student-review prompt | Useful formatting preparation, but late; question usability should have been reviewed earlier |
| 20:31:25-20:32:48 | 1m 23s | One requested A-student review attempted all twelve questions and inspected four printed pages | Useful, bounded review; not the dominant delay |
| 20:32:48-20:38:14 | 5m 26s | Applied five usability fixes, recorded review, retried one clipped export, rearranged response areas, exported and delivered final files | Necessary repairs; avoidable downstream rework from insufficient initial layout/content review |
| 20:38:14-20:40:54 | 2m 41s | Inspected changed pages, published PR #37, checked remote PDFs/review; repaired a verification mismatch caused by Git text line endings | One final remote check was useful; repeated publication and the naive text-byte assertion were avoidable |

These spans include model response generation, message handling, tool execution
and other uninstrumented intervals. They are not CPU time or pure writing time.
Overlapping rows must not be added to the overall elapsed duration.

## Preserved child activities

The available child record shows this sequence, without enough telemetry to
assign a defensible duration to each item:

1. Boot, evidence/history reads, authoring-ledger discovery and private-storage coordination.
2. Draft question/key authoring plus printable HTML and PDF work.
3. First teacher review: mathematically correct answers, but estimated workload
   of 71 working minutes plus eight checking minutes.
4. Timing/scaffolding and rubric repairs, then another review by the same teacher.
5. Similarity review against all sixteen original prompts: two near-clone tasks
   identified; second workload estimate was 53.5 working minutes plus eight checking.
6. Question repairs, PDF export and 37 recorded mathematics/structure checks.
7. Recovery ZIP creation containing 67 entries, including source/review material.
8. Subsequent owner feedback about asymmetric windows, supplied rational-function
   form, repeated question types and insufficient question-first review.
9. Symmetric-window export and a partial additional student pass; the final
   stop/handoff explicitly warned that delivered PDFs were unapproved drafts and
   some newer source changes were not reflected in them.

The handoff initially called the files complete, but later labeled them unapproved
and out of date. That delivery-state mismatch was itself a process failure.

## Tool time versus elapsed time

- Recorded parent tool-return spans, excluding the storage question, sum to
  approximately **3m 57s**. This includes the 1m 23s student review and unrelated
  overlapping guide/backup calls. Parallel calls may overlap; this sum is not
  an exclusive breakdown of the 66-minute wall clock.
- Seven exam export batches in the direct-author phase took approximately
  **56.4 seconds total in their recorded tool-return spans**. Three batches
  encountered print-overlap failures. Four exported both copies successfully;
  one of those then encountered an overly broad notation assertion.
- The separate overlapping correction-guide export batch adds another 7.5 seconds.
- The last student review took **82.666 seconds** start to return.
- Some shell calls returned early when moved to the background. Their start-to-
  return durations are not necessarily the command's full lifetime. Completion
  was verified through later output reads.
- There is no basis to attribute the remaining wall-clock gaps wholly to model
  computation, waiting or user interaction. No causal percentage is claimed.

Thus the PDF export commands themselves did not consume most of the elapsed
time. The dominant observed costs were the delegated 32-minute draft phase,
handoffs/context recovery, premature presentation and repeated corrective edits.
The child's 37-check artifact documents checks, but its missing raw event log
prevents a precise validation-time claim. No full site test suite was run in the
direct-author replacement phase.

## What to retain and remove

**Retain:** reading relevant completed work, solving proposed problems, verifying
covered skills and unfamiliar notation, the short teacher/student perspectives,
one actual print inspection, and one final durable save.

**Remove:** delegated authoring; PDF/code before question approval; full recovery
packaging on the critical drafting path; unnecessary cloud-storage discussion;
repeated skill/template discovery; review prompts that reproduce excessive context;
publishing every small correction; broad text-library assertions; and repeatedly
claiming completion while owner feedback is still unresolved.

The replacement workflow in `practice-exam-workflow.md` fixes the sequence:
plain Markdown problems and key, direct teacher/student checks, explicit approval
of the problem revision, established PDF template, one final student print pass,
and one publication. It uses existing timestamps for future phase tracking rather
than creating another instrumentation or validation harness.

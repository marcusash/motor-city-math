# GI Data Ops Runbook

## Purpose
Keep practice exam data accurate, consistent, and safe to ship. This runbook covers validation steps, failure triage, and communication rules.

## When to run
- Before shipping a new retake-practice-*.json file
- After edits to data/questions.json or data/standards.json
- After regenerating exams or importing new content

## Core validations
Run from repo root:
- `node tests/verify-practice-exams.js`
- `node tests/cross-exam-verify.js`
- `node scripts/validate-standards-map.cjs`
- `node scripts/validate-exam-contract.cjs`

## Interpreting failures
### verify-practice-exams.js
- Missing fields: check required question fields and inputs.
- Graph key_points: function values must be within tolerance.
- Unique answers: single-value numeric answers within one exam must be unique.

### cross-exam-verify.js
- H-2 and H-3: same slot answer duplicates across exams, must change.
- H-4: within-exam duplicate answers for Q4 to Q11 in practice exams.
- H-5: graph asymptote duplicates for Q13 across exams.

## Triage workflow
1. Identify the failing exam and question number from the test output.
2. Open the JSON and locate the question by number.
3. For numeric duplicates, adjust the equation or constants so the numeric answer changes.
4. For graph key_points mismatches, recompute points from the function and update key_points.
5. Re-run the validations and confirm all checks pass.

## Communication rules
- Math or answer edits: notify GR with a message and include file paths.
- Renderer or schema changes: notify GA and GF.
- Always update .agent-status.md with results and any blockers.

## Release checklist
- All core validations pass.
- New data entries include hints, solution_steps, and feedback fields.
- Graph questions include min_points and tolerance.
- Standards align with data/standards.json.

# GP Exam Review Checklist

Full checklist run before any exam is declared Kai-ready.

## Phase 1: Content (GR responsibility)

- [ ] All questions math-verified by GR
- [ ] Standard codes confirmed against Winter Tri standards list
- [ ] `solution_steps` reviewed for accuracy
- [ ] Multiple-choice wrong answers reviewed (plausible but wrong)

## Phase 2: Schema (GP responsibility)

- [ ] `schema_version: "2.0"` present
- [ ] All required fields present per `docs/agents/gp-field-glossary.md`
- [ ] No extra fields that could confuse parser
- [ ] `id` values sequential: Q1, Q2, Q3...
- [ ] `type` is one of: numeric, multiple-choice, short-answer, graphing

## Phase 3: Verify (GP responsibility)

```bash
node tests/verify-practice-exams.js retake-practice-N.json
```
Expected: 315/315 for a 15-question exam. Zero failures.

## Phase 4: Cross-Exam Dedup (GP responsibility)

```bash
node tests/cross-exam-verify.js
```
Expected: 0 hard failures.

## Phase 5: ADHD Compliance (GP responsibility)

```bash
node tests/gp-hint-presence.test.js
```
Expected: all hints present.

Manual check:
- [ ] All feedback ≤ 12 words
- [ ] All hints ≤ 20 words
- [ ] No em dashes in any string

## Phase 6: Health Gate (GP responsibility)

```bash
node scripts/gp-exam-health.js
```
Expected: 11/11.

## Phase 7: Backup (GP responsibility)

```bash
copy data\retake-practice-N.json data\_backups\retake-practice-N-backup-YYYYMMDD.json
```

## Phase 8: Integration (GA responsibility)

- [ ] GA adds to exam.html selector
- [ ] GA verifies exam loads in Chromium
- [ ] GA verifies score is calculated correctly

## Phase 9: Marcus Approval

- [ ] Marcus smoke-tests in Kai's browser
- [ ] Marcus confirms exam is ready for Kai

## Phase 10: Announce to Kai

Only after Phase 9 complete.

---

*Owner: GP | Gate keeper for Phases 2-7*

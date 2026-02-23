# GP Exam Lifecycle — From Spec to Kai-Ready

How a new retake practice exam goes from idea to a test Kai opens in the browser.

## Stage 1: Spec (GR + Marcus)

1. Marcus identifies standard gaps (e.g. "Kai bombed W2.a three times")
2. GR drafts an exam spec: which standards, how many questions per standard, difficulty curve
3. Spec lives in `docs/agents/gp-rp-schema-v2-spec.md` or similar

**Gate:** Marcus approves question distribution before GR writes questions.

## Stage 2: Question Authoring (GR)

1. GR writes questions in `data/retake-practice-N.json`
2. Follows schema v2.0 (all required fields present)
3. Math verified by GR before handing off

**Gate:** `node tests/verify-practice-exams.js retake-practice-N.json` — must pass 100%.

## Stage 3: Uniqueness + Cross-Exam Verify (GP)

1. GP runs `node tests/cross-exam-verify.js` — 0 hard failures required
2. GP runs `node tests/gp-answer-distribution.js` — checks for answer frequency outliers
3. Any collision: GR fixes before merge

**Gate:** 0 cross-exam hard failures. Answer distribution advisory reviewed.

## Stage 4: ADHD Compliance (GP or GD)

1. GP runs `node tests/gp-hint-presence.test.js` — all 150+ hints checked
2. GP checks feedback word counts — max 12 words
3. Any violations: GR fixes

**Gate:** 0 ADHD violations in new exam.

## Stage 5: Integration Test (GP)

1. Run full baseline: `node tests/verify-practice-exams.js` — must stay ≥ current count
2. Run health gate: `node scripts/gp-exam-health.js` — must stay 11/11
3. Backup created: `cp data/retake-practice-N.json data/_backups/`

**Gate:** Baseline maintained. Health gate 11/11.

## Stage 6: Commit (GP)

```
GP: add retake-practice-N.json (GR-authored, N questions, standards X/Y/Z)
```

Commit pushed to master. Post-push checklist run.

## Stage 7: HTML Integration (GA)

1. GA adds exam to `exam.html` selector
2. GA verifies exam loads in browser
3. Marcus smoke-tests in Kai's browser

**Gate:** Marcus approves before telling Kai the exam exists.

## Stage 8: Kai Studies

Kai opens exam.html, selects new exam, studies.

---

*Owner: GP | Last updated: 2026-02-23*

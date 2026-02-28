# GP Release Checklist

Use this checklist before releasing any new exam to Kai.

## Pre-Release (5 minutes)

### Data Integrity
- [ ] `npm run ci-gate` — all 16 gates pass
- [ ] `npm run health` — 11/11 health checks
- [ ] `npm run verify` — baseline maintained (3337/3337)
- [ ] `node scripts/gp-backup-audit.js` — all backups present

### New Exam Validation
- [ ] `node tests/gp-rp-question-count.test.js` — 15 questions
- [ ] `node tests/gp-all-json-valid.test.js` — valid JSON
- [ ] `node tests/gp-no-duplicate-question-ids.test.js` — unique IDs
- [ ] `node tests/gp-answer-in-options.test.js` — MC answers valid
- [ ] `node tests/gp-numeric-answer-is-finite.test.js` — no NaN/Infinity
- [ ] `node tests/gp-feedback-present.test.js` — feedback fields present
- [ ] `node tests/gp-hint-count-check.test.js` — hints present

### Agent Coordination
- [ ] GR verified math accuracy
- [ ] GF ran regression suite
- [ ] GI updated manifest.json
- [ ] GA integrated into exam.html

### Content Review
- [ ] No em dashes in hints/feedback/solution_steps
- [ ] All answers are verified correct (GR sign-off)
- [ ] Feedback_correct has celebratory tone
- [ ] Solution steps are digestible (under 300 chars each)
- [ ] Hints are guiding, not spoiling

## Release
- [ ] `git add && git commit -m "GI: add retake-practice-N.json to manifest"`
- [ ] `git push origin master`
- [ ] Notify Marcus in .marcus-queue.md

## Post-Release Verification
- [ ] Open exam.html in browser
- [ ] Confirm new exam appears in dropdown
- [ ] Complete 1-2 questions manually to verify rendering
- [ ] Check answer grading works (correct + incorrect feedback)

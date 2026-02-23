# GP Incident Response Runbook

**Owner:** GP (grind-platform)  
**Last updated:** 2026-02-23

---

## P0 — Exam Broken in Active Kai Session

**Symptoms:** Kai opens exam.html, questions don't load, or grading doesn't work.

**Response (< 5 minutes):**
1. Open the specific exam file in browser dev tools console
2. Check for JS errors — most common: malformed JSON in data/*.json
3. Run: `node tests/verify-practice-exams.js` — identify which exam fails
4. Find the last clean commit: `git log --oneline data/ -5`
5. Revert: `git checkout <clean-sha> -- data/<file>.json`
6. Push hotfix immediately with `git push origin master`
7. Notify Marcus: add to `.marcus-queue.md`

**Root causes to check:**
- JSON syntax error in retake-practice file
- Missing `questions` array
- Exam not in manifest.json

---

## P1 — Verify Baseline Drop

**Symptoms:** `node tests/verify-practice-exams.js` shows failures that weren't there before.

**Response:**
1. Run: `node scripts/gp-rp-field-audit.js` — get full field report
2. Check `data/gp-field-audit-report.json` for which exam/question
3. Run for specific exam: `node tests/verify-practice-exams.js <exam>.json`
4. Compare against last passing commit: `git diff HEAD~1 data/<exam>.json`
5. If field issue: run `node scripts/gp-field-fixer.js` then re-verify
6. If math issue: escalate to GR via `.agent-comms/grind/inbox-GR/`

---

## P1 — ADHD Compliance Violation

**Symptoms:** `node tests/gp-feedback-length.test.js` reports > 12 word feedback.

**Response:**
1. Run: `node scripts/gp-word-count.js` — identify which fields
2. Run: `node scripts/gp-feedback-trimmer.js` — auto-trim to 12 words
3. Spot-check trimmed strings end naturally (not mid-sentence)
4. Re-run: `node tests/gp-feedback-length.test.js` — confirm 300/300
5. Commit and push

---

## P2 — Publish Failure

**Symptoms:** GitHub Actions publish workflow fails.

**Response:**
1. Check Actions tab for error details
2. Most common cause: expired `MOTOR_CITY_MATH_TOKEN`
3. If token expired: create new PAT, update in repo secrets, re-trigger
4. If file sync error: check workflow logs for which file failed
5. If motor-city-math repo has conflicts: force-push from local

---

## P2 — Pre-Commit Hook Failure on Clean Code

**Symptoms:** Hook fails on code you believe is correct.

**Response:**
1. Run hook directly: `node scripts/gp-pre-commit-hook.js`
2. Read exact error message — check which check failed
3. If false positive on localStorage collision (check 6): add a comment explaining intent
4. If JSON parse false positive: validate JSON manually at jsonlint.com
5. To bypass in extreme emergency: `git commit --no-verify -m "..."`
6. File a bug if false positive confirmed — improve the check

---

## Health Check (Run After Any Incident)

```bash
node scripts/gp-exam-health.js
```

Must return: `8 checks: 8 pass, 0 fail — SYSTEM HEALTHY`

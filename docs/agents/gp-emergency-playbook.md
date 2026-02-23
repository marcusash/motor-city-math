# GP Emergency Playbook

When something breaks, stop and diagnose before touching any data file.

## Verify Baseline Failure

Run: `node tests/verify-practice-exams.js`

If count drops below 3337:
1. Check recent commits: `git log --oneline -10`
2. Identify changed data files: `git diff HEAD~1 --name-only`
3. Restore: `git checkout HEAD~1 -- data/<file>.json`
4. Re-run verify. If 3337/3337 restores, the commit was bad.
5. File bug to GR with exact count and failed exam name.

## Health Gate Failure

Run: `node scripts/gp-exam-health.js`

If any check fails, output shows which check number. Remediation by check:
- Check 1 (RP files exist): verify all 11 RP files are in `data/`
- Check 2 (JSON valid): run `npm run lint:json` to identify bad JSON
- Check 3 (questions array): run `node tests/gp-rp-file-has-questions-key.test.js`
- Check 4 (question count): run `node tests/gp-question-count.test.js`
- Check 5 (metadata): run `node tests/gp-metadata-complete.test.js`
- Check 6-11: run `node scripts/gp-exam-health.js` for specific error message

## Pre-commit Hook Failure

The hook at `tests/f-validation/pre-commit-check.js` runs before every commit.

If it fails with "polyfill.io detected": a staged file contains the banned CDN. Find it with:
```
git diff --cached --name-only | ForEach-Object { Select-String -Path $_ -Pattern 'polyfill.io' }
```
Remove the polyfill.io reference and stage again.

If it fails with "eval() detected": find the eval in staged files.

## Bad JSON in Data File

If `JSON.parse` fails on any RP file:
1. Run `npm run lint:json` to identify which file
2. Open the file and look for: trailing commas, unquoted keys, mismatched brackets
3. Never edit manually if you can restore from backup
4. Restore: `Copy-Item data\_backups\retake-practice-N.json data\retake-practice-N.json`
5. Re-run verify to confirm restore worked

## Exam Shows Wrong Answers to Kai

Do NOT touch the data file. File a bug immediately:
1. Write to GR inbox with: exam name, question number, what Kai saw, expected answer
2. GR verifies math and provides corrected value
3. GP implements the fix after GR confirms in writing

## Git Index Lock

If git commit fails with "index.lock exists":
```powershell
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
```
Then retry the commit.

## Push Rejected

If `git push` fails with "cannot lock ref" or "non-fast-forward":
```powershell
git pull --rebase origin master
git push
```

## Inbox Pile-up (>10 unread messages)

Process by priority:
1. Messages from Marcus: immediate
2. Messages with type "urgent" or "bug-report": within 1 hour
3. Messages with type "ack" or "fyi": batch process at end of session
4. Messages older than 7 days: archive to `.agent-comms/grind/archive-GP/`

## Session Starts With Unknown State

Run this sequence to establish ground truth:
```powershell
node scripts/gp-exam-health.js      # health gate
node tests/verify-practice-exams.js # baseline check
node tests/cross-exam-verify.js     # cross-exam dedup
```

If all three pass, state is clean. Begin work.
If any fail, diagnose before starting new tasks.

# GP Post-Push Checklist

After every `git push origin master`, run through this checklist.

---

## Immediate (< 2 minutes after push)

- [ ] Check GitHub Actions tab — confirm CI green (or no workflow triggered)
- [ ] Run `node scripts/gp-exam-health.js` — confirm 9/9 pass
- [ ] Check for uncommitted changes: `git status --short`
- [ ] Verify push landed: `git log --oneline -3`

## After Exam JSON Changes

- [ ] `node tests/verify-practice-exams.js` — confirm baseline maintained
- [ ] `node tests/cross-exam-verify.js` — confirm 0 hard failures
- [ ] `npm run test:gp` — all 5 GP tests pass
- [ ] Note new verify count in commit message or sprint log

## After Script Changes

- [ ] Run the script manually — confirm it exits 0
- [ ] Run health check — confirm no regression

## After Agent Comms

- [ ] Confirm JSON is valid: `node -e "JSON.parse(require('fs').readFileSync('.agent-comms/...'))"` 
- [ ] Check recipient inbox exists before sending
- [ ] Note sent message in sprint log

## After Docs Changes

- [ ] Preview the markdown renders correctly (headers, tables, code blocks)
- [ ] Check any links to other files still resolve

## End of Sprint

- [ ] `node scripts/gp-exam-health.js` — final health gate
- [ ] Update `.agent-status.md` GP section with sprint summary
- [ ] Post to `.marcus-queue.md` with commit count and baseline
- [ ] Check inbox for new messages: `Get-ChildItem .agent-comms/grind/inbox-GP/`

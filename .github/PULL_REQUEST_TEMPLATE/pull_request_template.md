## Summary
What this PR does in one sentence.

## Exam Impact
- Which exams are affected (if any): 
- Verify result before: __/__
- Verify result after: __/__

## Quality Checks

Run these before requesting review:

```bash
node tests/verify-practice-exams.js
node scripts/gp-exam-health.js
```

- [ ] `verify-practice-exams.js` passes (baseline maintained)
- [ ] `gp-exam-health.js` passes 8/8
- [ ] Math changes verified by GR (if applicable)
- [ ] ADHD rule checked (feedback <= 12 words)
- [ ] File ownership respected (.agents.md)

## Files Changed
List the files modified and why.

## Agent Sign-Off
- [ ] GR verified math (if exam content changed)
- [ ] GF verified tests (if test files changed)
- [ ] GP verified data integrity (if JSON changed)

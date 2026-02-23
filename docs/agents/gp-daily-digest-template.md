# GP Daily Digest Template

> Template for daily briefings to Marcus. Fill in and post to `.marcus-queue.md`.

---

## GP Daily Digest — {DATE}

**From:** GP  
**System status:** {HEALTHY / DEGRADED / INCIDENT}

### Exam Health
```
node scripts/gp-exam-health.js → {N}/9 pass
verify-practice-exams.js       → {N}/{TOTAL}
```

### Since Last Session
- Commits: {N}
- Tests added: {N}
- Issues found: {N}
- Issues resolved: {N}

### Active Items
- [ ] {Task 1}
- [ ] {Task 2}

### Blocked Items
- {Item} — blocked on {who/what}

### For Marcus
- {Decision needed if any}
- {FYI item if any}

---

## How to Use

1. Copy this template
2. Fill in the blanks
3. Append to `.marcus-queue.md` under a new `## 🟢 GP Daily Digest` heading
4. Commit and push: `git add .marcus-queue.md && git commit -m "GP: daily digest {DATE}"`

# GP Release Notes Template

Use this template when shipping a new retake practice exam or significant exam update.

---

## Release: {Exam Title} — {Date}

**Type:** {New Exam / Exam Update / Bug Fix}  
**Author:** {GR}  
**Verified by:** GP  
**Approved by:** Marcus  

### What's New

{One paragraph describing what this exam covers and why Kai needs it.}

### Standards Covered

| Standard | Topic | Questions |
|----------|-------|-----------|
| {W2.a} | {Quadratic factoring} | {3} |
| {W2.d} | {Write equation} | {2} |

### Verification Results

| Check | Result |
|-------|--------|
| Exam verify | X/315 |
| Cross-exam dedup | 0 hard failures |
| Health gate | 11/11 |
| ADHD compliance | 15/15 hints, all feedback ≤ 12 words |

### Files Changed

- `data/retake-practice-N.json` — {added / updated}
- `data/_backups/retake-practice-N-backup-{DATE}.json` — backup created

### Known Issues

{None / List any advisory items here}

### Integration Required

- [ ] GA: Add to exam.html selector
- [ ] Marcus: Smoke-test before telling Kai

---

*Template owner: GP | Use for every exam ship*

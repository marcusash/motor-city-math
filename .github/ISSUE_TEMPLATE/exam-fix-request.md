---
name: Exam Fix Request
about: An answer key is wrong, a question is unclear, or math is incorrect
title: "[EXAM FIX] RP? Q? — "
labels: exam-content, math-accuracy
assignees: ''
---

## Which exam and question?
<!-- e.g., Retake Practice 5, Question 7 -->

**File:** `data/retake-practice-?.json`  
**Question ID:** `rp?-q?`

## What is wrong?

<!-- Check all that apply -->
- [ ] Answer key is incorrect
- [ ] Question statement is unclear or has typo
- [ ] Solution steps are wrong or missing
- [ ] Hint is misleading
- [ ] Feedback text is wrong

## Current (incorrect) value
```
Answer: X
```

## Correct value (with math verification)
```
Answer: Y
Because: [show the math]
```

## Agent routing
- Math content fixes: **GR** verifies, **GP** applies to JSON
- HTML display fixes: **GA**
- Design issues: **GD**

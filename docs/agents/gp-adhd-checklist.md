# GP ADHD Compliance Checklist

Run this on every question before exam ships. Each question must pass all checks.

## Per-Question Checks

### feedback_correct

- [ ] ≤ 12 words
- [ ] Celebratory but brief: "Got it. That's the vertex." not "Great job, you really did a great job solving that!"
- [ ] No em dashes
- [ ] No period unless it reads naturally
- [ ] One idea only

### feedback_incorrect

- [ ] ≤ 12 words
- [ ] Points forward, not backward: "Check the slope formula." not "You got the slope wrong."
- [ ] No em dashes
- [ ] One idea only

### hint

- [ ] ≤ 20 words
- [ ] Concrete step, not vague encouragement: "Factor out the GCF first." not "Think about factoring."
- [ ] No em dashes
- [ ] One action only

### prompt

- [ ] Clear and complete in one read
- [ ] No walls of text (> 3 sentences = consider splitting)
- [ ] If there's a graph, the prompt references it directly

### answer

- [ ] Numeric answers verified by GR
- [ ] Tolerance set appropriately (≥ 0.5 for answers > 10)
- [ ] No answer repeated within same exam

## Exam-Level Checks

- [ ] ≤ 20 questions total (scroll concern)
- [ ] Maximum one graphing question per 5 questions
- [ ] Question order: easy → medium → hard (Kai builds confidence)
- [ ] All standards represented per `docs/retake-exam-spec.md`

## Quick Automated Checks

```
node tests/gp-hint-presence.test.js
node tests/gp-feedback-length.test.js
node tests/verify-practice-exams.js
```

---

*Owner: GP | Reference: .voice-guide.md §ADHD, .design-system.md §Feedback*

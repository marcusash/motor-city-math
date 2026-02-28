# Hints — Hint System Design and Content Guidelines

## Three-Layer System

Motor City Math uses a progressive 3-layer hint system. Kai unlocks layers by attempting and getting wrong answers.

### Layer 1: Nudge (`hint`)

- Shown after first wrong answer
- ≤ 20 words (ADHD rule, enforced by test)
- One concrete action, not vague encouragement
- Examples:
  - "Factor out the GCF first." (good)
  - "Think about what you know about factoring." (bad — too vague)

### Layer 2: Worked Step (`hint_2`)

- Optional field
- Shown after second wrong answer
- More specific than Layer 1
- May reference a formula or show a partial calculation

### Layer 3: Full Solution (`solution_steps`)

- Array of step-by-step strings
- Shown after third wrong answer or on request
- Math-verified by GR
- Must be complete enough to understand without a teacher

## ADHD Design Rules for Hints

1. **One action at a time.** Never "do X and then Y" in a single hint.
2. **No walls of text.** Layer 1 and 2 are single sentences.
3. **Point forward.** "Check the discriminant." not "The discriminant was wrong."
4. **No em dashes.** Use colons or periods.

## Content Ownership

| Role | Responsibility |
|------|---------------|
| GR | Write hint content, verify math accuracy |
| GD | Style hint display UI |
| GP | Verify hints present and within word limits |
| GA | Implement hint show/hide logic in exam.html |

## Automated Checks

```
node tests/gp-hint-presence.test.js   → verifies all 150+ hints exist
node tests/gp-feedback-length.test.js → verifies ≤ 12 words for feedback
```

Word count check for hints (≤ 20): included in `gp-adhd-checklist.md` manual review.

---

*Owner: GR (content) + GP (verification) | Reference: .voice-guide.md §Hints*

# FR Math Anxiety Brief

**Author:** FR (Research Lead, Forge)
**Date:** 2026-02-22
**For:** GA (practice renderer), GR (question generation), Marcus
**Status:** Stable — review annually or when Kai's exam context changes

---

## Why This Exists

Kai is 15, has ADHD, and is retaking Algebra II Unit 2 on February 24-26. Math anxiety compounds ADHD in a specific way: working memory deficit under anxiety is additive with ADHD working memory deficit. A student who would normally have a 3-step working memory buffer under ADHD may drop to 1-step under combined ADHD + anxiety. This brief documents what FR knows about math anxiety in the MCM context and what it means for exam design.

---

## The Core Mechanism

Math anxiety is not a knowledge deficit. It is a state-dependent access failure. Ashcraft & Kirk (2001) showed that working memory capacity under math anxiety drops by 2 working memory units compared to baseline. Combined with ADHD's baseline 1-2 unit deficit, a high-anxiety ADHD session can mean near-zero working memory buffer.

**What this looks like on Kai's exams:**
- Correct procedure, arithmetic error on step 3 of a 4-step problem
- Knows the concept, skips the check step (verification requires extra working memory)
- Question 15 hardest not because of content difficulty but because it comes last (fatigue + anxiety)

---

## Prediction from FR: Anxiety Signature in Scores

When Kai is in a low-anxiety session, his score pattern will be:
- Correct on Q1-Q10 (routine)
- 1-2 errors on Q11-Q15 (novel + fatigue)
- All errors are arithmetic, not conceptual

When Kai is in a high-anxiety session:
- 2-3 more errors than baseline
- Errors shift earlier (Q8-Q10 range)
- More "knows it, wrote wrong thing" type errors

The Feb 18 MVP exam (53%) was likely a high-anxiety session: Kai had never seen the format, stakes were real, ADHD was unmedicated context. RP3 (100%) was low-anxiety: familiar format, no real stakes, pattern solidified.

**Retake prediction adjustment:** Base FR prediction is 91-96%. If retake conditions are high-anxiety (different room, proctor watching, extra time pressure), floor drops to 80-87%.

---

## Design Implications for MCM

### GR: Question Ordering

Anxiety spike is highest at Q1 (cold start) and Q15 (end-of-test accumulation). Design mitigation:

- Q1-Q3: Start with highest-confidence skill type for Kai (AV identification). This is a "warmup" — correct these and confidence rises.
- Q4-Q8: Escalate to computation. Now Kai is in flow.
- Q9-Q12: Peak difficulty. Novel variants live here.
- Q13-Q15: Deliberately one "easier" question in Q13 or Q14 as a reset before the final word problem.

GR should NOT put the word problem at Q15 every exam. Rotating it to Q13 or Q14 occasionally is a structural anxiety mitigation.

### GA: Renderer Design

The renderer must not show total question count unless asked. "Q1 of 15" tells Kai there are 14 more and activates anticipatory anxiety. "Q1" alone or an unobtrusive progress bar with no number is better.

Per-question timer display should be opt-in, not shown by default.

### Marcus: Session Timing

If Kai is doing RP4-RP8 practice, the highest-yield session is 60-90 minutes after a meal, not right before bed or immediately after school. Cortisol peak (which amplifies anxiety) is late afternoon. If Kai's pattern is afternoon school, an evening study session is likely better.

---

## What FR Does Not Know (confidence gap)

- Whether Kai has a formal math anxiety diagnosis or just ADHD. Both produce similar surface patterns but different interventions.
- Whether medication timing affects his exam scores. If he takes Adderall, morning exams after morning dose are different from afternoon exams.
- Whether test-taking strategy training has been attempted (Kai reading all questions first, flagging hard ones to skip).

FR would update this brief if Marcus shares that Kai is doing any of the above.

---

## One-Line Summary for Deck

"ADHD + math anxiety = 2-4 working memory units below baseline. MCM design accounts for this through question ordering, difficulty gradients, and no time pressure display."

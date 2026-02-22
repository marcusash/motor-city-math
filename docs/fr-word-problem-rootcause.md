# FR Root Cause: MVP Exam Word Problem (Q15) Miss

**Author:** FR (Research Lead, Forge)
**Date:** 2026-02-22
**Confidence:** MEASURED for question content; ESTIMATED for root cause inference

---

## The Question Kai Missed

**MVP Q15:** "A bacteria colony starts with 200 bacteria and triples every 4 hours.
(a) Write an exponential model for the population P after t hours.
(b) How many hours until the population reaches 48,600?"

**Correct answer:** P(t) = 200 · 3^(t/4). t = 20 hours.

**Kai's result:** Wrong.

---

## Is the Question Fair?

**Yes, with one caveat.**

The math is correct and the question is at the right level. The two-step structure (write model, then solve) is appropriate for W3.a. The solution path is clean:
1. Recognize: start 200, factor 3 (triples), period 4 → P = 200 · 3^(t/4)
2. 48600 / 200 = 243
3. 243 = 3^5 → t/4 = 5 → t = 20

**The one caveat:** 243 = 3^5 is a less-common power recognition than 81 = 3^4. A student who has drilled "3^1=3, 3^2=9, 3^3=27, 3^4=81" may not extend to 3^5=243 automatically under exam pressure. This is a harder recognition than the RP1-Q15 equivalent (3^4=81, t=24).

**Assessment: Fair difficulty. Not unfair.**

---

## Root Cause

Two independent evidence paths converge:

**Path 1: Model-writing was never trained (L3 gap)**

Every retake practice Q15 (RP1-RP7) gives the model pre-built. RP1-Q15: "The population is modeled by P(t) = 500·3^(t/6). How many hours until 40,500?" The model is handed to Kai. He just solves.

The MVP exam asked him to write the model from a verbal description. That is an L3 (construct) task. He had only ever done L2 (compute from given model) on word problems.

Evidence: all 7 retake practices give the model in the question. MVP gives a verbal description. This is a structural variation Kai had zero exposure to.

**Path 2: 243 = 3^5 recognition failure under time pressure**

Even if Kai correctly wrote P = 200·3^(t/4), he then needs:
- 48600 / 200 = 243 (arithmetic under pressure)
- 243 = 3^5 (power recognition)

RP1-Q15 required 40500/500 = 81 = 3^4. Kai got that right in practice. 3^4 is more commonly drilled. 3^5 = 243 is less automatic. Under a real exam with time pressure, this step is the likely failure point if the model was written correctly.

FR cannot determine from the score data which path failed — whether Kai couldn't write the model, or wrote it but couldn't solve it. Both are plausible. The score data only shows "wrong."

---

## What the Retake Practices Now Do (RP3-RP7)

RP3-Q15 onward have been updated to two-part format: "(a) Write a model. (b) Solve it." The model is no longer pre-built. This directly addresses Path 1.

For Path 2: RP5-Q15 uses 3^4 = 81 (t=32). RP4-Q15 uses 1.5^3 = 3.375 (t=30, different base). RP7-Q15 should include a 3^5 recognition if it hasn't already.

---

## Learning Prescription for Kai

Before the retake:

1. **Model-writing drill (5 minutes):** Give Kai three verbal descriptions, ask him to write the model only (not solve). "Starts at X, multiplies by Y every Z hours." He writes the function. Check he gets P₀, base, period correct.

2. **Powers of 3 table (2 minutes):** Write out 3^1 through 3^6 from memory. 3, 9, 27, 81, 243, 729. This is not memorization — it is counting up by multiplication. He should be able to reconstruct it in under a minute.

3. **Connected practice:** RP5-Q15 (radioactive decay) practices the model-write step. Make sure he does it without looking at the model template.

**Total time needed:** 10 minutes. This is the highest ROI pre-retake fix available.

---

## Confidence

ESTIMATED. The root cause (L3 gap: model-writing) is strongly supported by structural evidence (no retake practice required model-writing before RP3). The 3^5 recognition failure is plausible but not confirmed. FR cannot distinguish between the two from score data alone. The prescription addresses both.

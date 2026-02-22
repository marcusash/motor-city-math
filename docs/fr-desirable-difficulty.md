# Desirable Difficulty: Research Brief and MCM Application

**Author:** FR (Research Lead, Forge)
**Date:** 2026-02-22
**Task:** FA backlog item b8-desirable-difficulty
**Confidence:** MEASURED for the research base; ESTIMATED for MCM application claims

---

## The Concept

Robert Bjork coined "desirable difficulties" in 1994. The core insight: conditions that make learning feel harder in the moment often produce better long-term retention. Conversely, conditions that feel efficient and comfortable in the moment often produce worse retention.

The counterintuitive implication: a student who is struggling and performing worse in practice may be learning more than a student who is performing well. This is not a defense of arbitrary difficulty — it is a specific claim about which types of difficulty improve the encoding and retrieval of knowledge.

---

## The Four Canonical Desirable Difficulties

### 1. Interleaving (mixed practice)

**What it is:** Mixing problem types within a practice session rather than blocking (doing all quadratics, then all exponentials).

**Why it is desirable:** Blocked practice trains the motor routine. Interleaved practice forces the learner to first identify which method applies, then apply it. The identification step is where transfer learning lives.

**Evidence:** Rohrer & Taylor (2007): interleaved practice produced 43% better performance on a delayed test than blocked practice, despite lower accuracy during the practice session. Kornell & Bjork (2008): the same holds for inductive category learning.

**MCM application:** QDS metric. A practice exam with QDS < 0.45 means the same method applies too many consecutive questions. The interleaving is built into the exam structure, not left to GR's judgment.

### 2. Spacing (distributed practice)

**What it is:** Spreading practice over time rather than massing it (cramming).

**Why it is desirable:** Memory consolidation requires time. A concept reviewed 3 days after initial encoding is better retained than a concept reviewed 1 hour later, even if immediate performance after 1 hour looks better.

**Evidence:** Cepeda et al. (2006) meta-analysis: distributed practice consistently outperforms massed practice across ages, subject matters, and retention intervals. Effect size approximately d = 0.46 for academic learning.

**MCM application:** Kai has 9 retake practice exams across approximately 6 days (Feb 19-25). This is not massed cramming — it is distributed practice designed to match his exam timing. RP1-RP3 are warm-up spacing. RP4-RP6 are consolidation. RP7-RP9 are spaced retrieval under exam conditions.

### 3. Testing Effect (retrieval practice)

**What it is:** Practicing retrieval of information (answering questions) produces better retention than re-studying the same material.

**Why it is desirable:** The act of retrieving a memory strengthens the retrieval pathway, not just the storage. Re-studying passively does not activate retrieval pathways.

**Evidence:** Roediger & Karpicke (2006): students who took practice tests retained 50% more material on a 1-week delayed test than students who restudied the same material for the same amount of time.

**MCM application:** MCM is exclusively retrieval practice. Kai is not reading explanations — he is answering questions and receiving feedback on answers. Every session is a testing session. The hint system is designed so Kai can recover and answer correctly (not just be told the answer) — this preserves the retrieval act.

### 4. Generation Effect (effortful encoding)

**What it is:** Information that the learner generates themselves (constructs an answer) is better retained than information that is presented (read or recognized).

**Why it is desirable:** Generation requires deeper processing. The effort of constructing an answer forces semantic encoding rather than surface encoding.

**Evidence:** Slamecka & Graf (1978): generated words are better recalled than read words, even with less exposure time. Applies to math: Kapur (2010) "productive failure" — students who attempt a novel problem before instruction outperform students who receive instruction first, even when their initial attempts are wrong.

**MCM application:** QA dimension (question-ask type). L3 (construct) and L4 (transfer) questions are generation tasks — Kai must produce the equation or model, not recognize it. The "productive failure" framing is directly relevant to the desirable difficulty of these variants: Kai will fail some of them. This is the point.

---

## The Undesirable Difficulties (for contrast)

Not all difficulty is desirable. The distinction matters:

| Desirable | Undesirable |
|-----------|------------|
| Interleaved problem types | Ambiguous question wording |
| Spaced practice sessions | Insufficient prior instruction on skill |
| Retrieval (answering) vs. restudying | Arbitrary errors (typos in equations, wrong answers) |
| Generation tasks (construct, transfer) | Complexity beyond the current mastery ladder level |
| No-real-solution variants | Questions that require knowledge not taught |

MCM's quality bar is built around eliminating undesirable difficulties (mathematical errors, wording ambiguity, wrong answers) while systematically introducing desirable ones (interleaving, generation, AV variation).

---

## Kai-Specific Application

Kai has ADHD. One ADHD-specific consideration: desirable difficulties can backfire when the starting frustration threshold is exceeded. A student who experiences too much struggle before any success will disengage, not persist.

The MCM solution: **momentum sequencing**. Each section starts with a question at Kai's demonstrated mastery level (he scored 8/15 — he has real skills). The desirable difficulties appear mid-section and late-section, not at question 1. The exam is hard enough to build retrieval pathways, sequenced enough to maintain engagement.

Spacing recommendation specific to Kai: do not do more than 2 retake practices in one day. The spacing effect requires time between sessions for consolidation. Cramming RP1-RP9 in 48 hours eliminates the spacing benefit and risks ADHD burnout.

---

## Implications for GR

1. When GR generates questions, the goal is not "harder" — it is "differently difficult." A question that requires Kai to select the algorithm before applying it is more valuable than a question that requires more algebraic steps using the same algorithm.

2. The "productive failure" principle applies: Kai will miss some L3 questions. This is correct behavior. Do not remove L3 questions from the bank because Kai is failing them. Failing a generation task is a learning event if the feedback is immediate and specific.

3. No-real-solution variants (SC dimension: "complex or no real solution") are a desirable difficulty because they break the template expectation. Kai currently expects every quadratic to have two real solutions. Adding one no-real-solution variant per practice forces him to check rather than assume.

---

## Summary: The MCM Desirable Difficulty Stack

| Difficulty Type | MCM Implementation | Expected Effect |
|----------------|-------------------|----------------|
| Interleaving | QDS >= 0.45 requirement | Method selection before execution |
| Spacing | 9 practices over 6 days | Consolidation between sessions |
| Retrieval | All questions are answer production | Retrieval pathway strengthening |
| Generation | L3 (construct) and L4 (transfer) questions | Deeper encoding, transfer |
| AV variation | Dimension 7: at least 2 verification methods per concept | Graph/spatial skill alongside arithmetic |
| No-real-solution | SC variants in quadratic and radical banks | Break template expectation |

---

## The Testing Effect: Standalone AV Practice vs. Embedded AV Practice

**Updated:** 2026-02-22

Rohrer & Karpicke (2006) established that retrieval practice (testing yourself) produces better long-term retention than restudying the same material, even when restudy time is longer. This is the testing effect.

**Applied to Kai's AV gap:**

Kai has a documented Answer Verification dimension lock — he can solve correctly but uses the wrong verification strategy when visual inspection is required. Two approaches to address this:

**Option A: Embedded AV practice** — Q3 in each RP is a composite question (identify parent, find x-intercepts, verify using graph inspection). Kai practices AV inside a larger problem.

**Option B: Standalone AV practice** — A single dedicated question: "Given f(x) = 2|x-3|-4, what is the most efficient way to verify your x-intercept answers: (a) substitute back into the equation, (b) graph and read intercepts visually, (c) set y=0 and solve again?" This is a retrieval practice question: Kai must recall and select the strategy, not just execute it.

**FR recommendation:** The testing effect predicts Option B produces stronger retention of AV strategy selection than Option A. Here is why: in Option A, the AV task is the final step of a multi-step problem. Kai is already fatigued from the identify and solve steps. Cognitive load theory predicts the verification step receives the least attention when it comes last. In Option B, AV strategy selection is the entire cognitive task. Kai must recall and reason about strategy choice, not just execute one.

**GR implementation:** Add one standalone AV selection question per exam, positioned at Q4 (before the main solve block). Format: multiple-choice with 3 verification strategies, one for the parent function just identified in Q3. This takes 30 seconds to answer but trains the strategy-selection pathway directly.

**Expected effect:** If Kai answers the Q4 AV selection question correctly across RP5-RP8, FR predicts W2.b visual-inspection variants will show improvement in RP6+ scores. If Kai misses Q4 AV selection, that is the diagnostic finding — strategy knowledge is not yet consolidated even before execution is required.

---

*Decision this changes for Marcus: if GR is generating questions that are simply "harder" (more algebraic steps, larger numbers, longer word problems), the difficulty is not desirable — it is just more work. Redirect GR to structural variation as the design target.*

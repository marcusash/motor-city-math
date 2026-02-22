# MCM Pedagogy: Why Motor City Math Works

**Author:** FR (Research Lead, Forge)
**Date:** 2026-02-22
**Audience:** Forge team, Marcus, future design director (Dave Dame candidate), investor context

---

## The Problem We Are Solving

Kai scored 8/15 on his Algebra II Unit 2 exam. He is not bad at math. He is good at memorizing templates. His practice tests were identical in structure — different numbers, same algorithm. He learned the template. When the real exam changed the surface, his score dropped.

This is not a Kai failure. It is a pedagogy failure. The standard practice model (blocked repetition — repeat the same problem type until it feels familiar) creates fluency with templates, not fluency with concepts. The research on this goes back to Robert Bjork (1994) and was confirmed in math specifically by Rohrer and Taylor (2007, 2019): interleaved practice (varied problem types) produced 43% better performance on delayed tests than blocked practice.

Motor City Math applies this research. The pedagogy decisions below are not preferences — they are the implementation of a specific learning science.

---

## The Core Principle: Structural Variation

Surface variation (different numbers, same algorithm) trains template recognition. Structural variation (different form, different algorithm required) trains concept mastery.

The test for structural variation: if Kai can answer the question correctly by doing exactly the same steps he did on the previous question, the question is surface-varied, not structurally varied.

MCM enforces structural variation through the QDS (Question Diversity Score) metric. A QDS below 0.45 means the practice bank has too much template repetition. Current baseline before FR intervention: QDS 0.13. Estimated post-intervention: QDS 0.42.

---

## The Seven QDS Dimensions

Every question in MCM is evaluated on 7 dimensions:

| # | Dimension | What it asks |
|---|-----------|-------------|
| 1 | Presentation Form (PF) | How is the function expressed? (vertex, standard, graph, table, verbal) |
| 2 | Orientation (OR) | Which direction does it open or move? |
| 3 | Solution Character (SC) | What does the answer look like? (integer, fraction, irrational, no solution) |
| 4 | Question-Ask Type (QA) | What is Kai asked to DO? (identify, compute, construct, transfer, diagnose) |
| 5 | Context (CX) | Pure algebra or real-world? |
| 6 | Step Count (ST) | How many steps minimum? |
| 7 | Answer Verification Method (AV) | How does Kai confirm the answer? (substitute-back, graph inspection, sign-check, interval-test) |

A question that differs from the previous occurrence on at least 4 of 7 dimensions requires a different cognitive strategy. That is the target.

---

## The Concept Bundle Principle

Single-skill isolation (one question tests one skill) is efficient to grade but inefficient to learn. MCM questions test concept bundles: 2-3 related ideas that must be used together.

Example: "Solve `3|x - 4| - 12 = 0`" tests:
- W2.b identify (is this AV?)
- W3.b solve (find x-intercepts algebraically)
- W3.b verify (both solutions, plus-minus)

One question, three skills. This is intentional. The skill connections are where understanding lives. Isolated drill hides those connections.

---

## The Mastery Ladder

Every concept has five levels. Practice exams live almost entirely at L1-L2 in most curricula. MCM targets L2-L3 with pathways to L4 for students who master the baseline.

| Level | Name | What Kai must do |
|-------|------|-----------------|
| L1 | Identify | Name the parent function from an equation |
| L2 | Compute | Solve the equation, find key features |
| L3 | Construct | Given features, write the equation |
| L4 | Transfer | Given a real-world scenario, build, solve, interpret |
| L5 | Diagnose | Given wrong work, find and fix the error |

MCM sequence: most questions are L2. Every practice exam has at least 2 L3 questions. One L4 word problem per exam. L5 questions are reserved for skills Kai has already demonstrated at L3.

---

## ADHD-Specific Design

Kai has ADHD. The following design decisions are grounded in that:

**Momentum structure:** Section A (identification) → Section B (algebraic solving) → Section C (graphing) → Section D (application). Each section starts with a winnable question. A student who starts failing early will disengage. Momentum is sequenced, not random.

**Immediate feedback:** Every question provides feedback on submit, not at the end. For ADHD learners, delayed feedback severs the learning loop. The feedback is specific (not "wrong — try again") and points at the exact step that broke.

**Hint architecture:** Two levels. Level 1 hint: procedural ("isolate the squared term"). Level 2 hint: conceptual ("what does the ± mean here?"). ADHD learners frequently know the concept but get lost in the procedure. The two-level hint lets them recover without being handed the answer.

**Visual graph rendering:** For graphing questions, Kai draws on a canvas and MCM checks key point coordinates with tolerance. This is not multiple-choice graph identification — it requires construction. Motor activation is a real component of spatial learning.

**No time pressure in practice:** The exam timer is for the real exam simulation only (RP7). All other retake practices are untimed. ADHD performance under time pressure is not a measure of understanding. It is a measure of ADHD.

---

## The Engagement Model

MCM is built for a 15-year-old who did not ask for extra math practice. It has to be fast enough that it does not feel like punishment and hard enough that it is not felt as condescending.

Specific choices:
- Questions render in LaTeX with live formula display. This respects Kai's intelligence — he can read real math notation.
- Score is shown as percentage and letter grade simultaneously. Kai can see where he sits against the real exam threshold (70% = C = passing).
- Streak tracking and question-level feedback use emoji. Not kiddie — concise. The feedback reads at high school register, not elementary.
- The retake practice exams are numbered RP1-RP9. Progress is visible as a number, not a progress bar. That is a preference of this student.

---

## What MCM Is Not

- Not a substitute for a teacher. MCM does not explain new concepts — it gives Kai a way to practice the ones he has been taught.
- Not a quiz platform. The structural variation requirement means these are not the same questions with different answers. They require different thinking each time.
- Not gamification. There are no badges for streaks (in MCM — Inkwell has badges). The reward is a passing grade and Kai knowing he earned it.

---

## Research Foundation

| Study | Finding | MCM Application |
|-------|---------|----------------|
| Rohrer & Taylor (2007) | Interleaved practice: 43% better on delayed test than blocked | QDS metric forces interleaving by design |
| Rohrer & Taylor (2019 RCT) | Effect holds at scale with real math curricula | Confidence that QDS approach will generalize |
| Bjork (1994) — Desirable Difficulties | Optimal learning involves struggle that feels unproductive | Step count variation, no-real-solution variants |
| Marton & Booth (1997) — Variation Theory | Understanding emerges from experiencing a concept across its dimensions of variation | 7 QDS dimensions — each is a dimension of variation |
| Kornell & Bjork (2008) | Interleaving leads to better category induction even when it reduces per-session performance | MCM score on RP1-RP6 may be lower than blocked practice; this is expected and correct |

---

*This document is the pedagogical foundation for MCM. It should be read by any new agent (GR, GI, GD) before generating or modifying practice exam content.*

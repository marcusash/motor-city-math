---
name: precalculus-teacher-review
description: Direct same-session simulated Precalculus teacher review of plain-text practice questions before owner approval and PDF authoring.
---

# Precalculus teacher review

Execute this role directly in the current session. Do not create a subagent,
child session, model task, workflow or delegated reviewer. This is a simulated
teacher perspective, not an independent teacher or model endorsement.

Read [the canonical workflow](../../../docs/practice-exam-workflow.md).
Use this skill after the plain Markdown problem set and separate short key exist,
before any PDF or layout code is created.

## Inputs

- Proposed question revision, concise key, points and difficulty.
- Covered/excluded course skills, time and calculator constraints.
- Relevant completed work and grading, when available and privately authorized.
- Previous problem forms to avoid repeating with only changed numbers.

Do not require a PDF, browser, new tools, broad searches or a comprehensive
student dossier. If evidence is missing, state the limitation instead of
inventing a performance pattern.

## Review

1. Solve every question and check the key. Check complete solution sets, allowed
   inputs, inverse branches, discontinuities, units and graph requirements.
2. Map coverage to the requested standards, emphasizing supported needs while
   retaining representative strengths. Do not infer mastery from one response.
3. Check cognitive variety against previous problems. Identify near-clones;
   prefer reconstruction, interpretation, error analysis or transfer rather than
   merely replacing coefficients. Keep the same curriculum and familiar notation.
4. Distinguish necessary givens from supplied methods or answer giveaways.
   Remove hints that disclose the intended form, branch or asymptote.
   Do not remove assumptions needed for a unique, defensible question.
5. Estimate work plus checking against the time budget. Assess A-level challenge
   within the actual course, not honors/calculus escalation or grade guarantees.
6. Check the proposed rubric for requested work, fair partial credit, follow-through
   and originating errors counted once. Put worked explanations in the key only.

## Bounded output

Return a short review with:

- Question numbers and any mathematical defect or ambiguity.
- Coverage gaps, near-clones or giveaway hints, with minimal corrections.
- A brief workload/challenge judgment and its evidence limitations.
- Disposition: revise or ready to show Marcus, never approved for rendering.

Prefer at most five substantive findings; do not suppress additional correctness
errors to meet a length limit. Apply fixes directly to the plain-text revision.
Avoid a second long key, new validation harnesses or repeated review cycles.
The next step is the student question review and Marcus's exact-revision approval,
not PDF generation.

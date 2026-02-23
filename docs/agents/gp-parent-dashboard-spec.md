# GP Spec: Parent Dashboard — Per-Standard Mastery

**Status:** PROPOSED  
**Author:** GP  
**Date:** 2026-02-23  
**Awaiting:** GI (data), GD (design), Marcus (priority)

---

## Problem

The parent dashboard (index.html) shows overall scores per exam but cannot answer Marcus's key question: "Which standards is Kai actually mastering versus still struggling with?"

---

## Proposed View: Standard Mastery Table

Visible after parent clicks "Standard Breakdown" toggle on the dashboard.

| Standard | Questions Seen | Correct | Mastery |
|----------|----------------|---------|---------|
| W2.a Quadratic Factoring | 18 | 14 | 78% |
| W2.b Absolute Value | 12 | 9 | 75% |
| W2.c Parabola Graphs | 8 | 6 | 75% |
| W2.d Write Equation | 6 | 3 | 50% |
| W2.e Rational Graphs | 4 | 2 | 50% |
| W3.a Exponential Equations | 14 | 12 | 86% |
| W3.b Radical Equations | 10 | 7 | 70% |
| W3.c Rational Equations | 6 | 5 | 83% |
| W3.d Exponential x² | 8 | 4 | 50% |

**Mastery levels:**
- 90%+ — green — "Locked in"
- 75-89% — yellow — "Getting there"
- < 75% — red — "Needs work"

---

## Data Requirements

- `standard_code` field on each question (spec: gp-rp-schema-v2-spec.md)
- Per-question grading stored in localStorage with question ID
- GI aggregates by standard across all exam sessions

---

## Implementation Notes

- Static HTML only — all computation in JS from localStorage
- No external API calls
- GD designs the mastery table using Pistons color tokens
- Add a "Print Standard Report" button using @media print CSS

---

## Copy (ADHD, parent-facing, not Kai-facing)

"Kai's Standard Mastery — Last 30 days"  
No effort praise. Facts only.  
Clicking a standard shows which exams had that standard.

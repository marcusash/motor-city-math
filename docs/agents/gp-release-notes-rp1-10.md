# Release Notes — RP1-RP10 Ship

**Date:** 2026-02-23  
**Type:** Initial ship — 10 retake practice exams  
**Authored by:** GR  
**Verified by:** GP  
**Approved by:** Marcus  

---

## What Ships

10 retake practice exams (RP1-RP10) covering all Winter Tri standards for Kai's Algebra II retake preparation.

| Exam | Standard Focus | Questions |
|------|---------------|-----------|
| RP1 | W3.b (radical equations) | 15 |
| RP2 | W3.a (absolute value) | 15 |
| RP3 | W3.c (rational equations) | 15 |
| RP4 | W2.b (quadratic factoring) | 15 |
| RP5 | Mixed W2/W3 | 15 |
| RP6 | W3.d (exponential) | 15 |
| RP7 | Mixed (Kai's worst: 6/15) | 15 |
| RP8 | W2.a + W2.d targeted recovery | 15 |
| RP9 | Mixed with AV two-case | 15 |
| RP10 | Full standard sweep | 15 |

## Verification Results

| Check | Result |
|-------|--------|
| Exam verify | 3008/3008 (RP1-10) |
| Cross-exam dedup | 0 hard failures |
| Health gate | 11/11 |
| ADHD feedback compliance | 150/150 (after sprint fixes) |
| Hint presence | 150/150 |

## Files in This Ship

- `data/retake-practice-1.json` through `data/retake-practice-10.json`
- `data/_backups/` — backup copies of all 10 files
- `exam.html` — renderer (GA-owned)
- `index.html` — dashboard (GA-owned)

## Known Issues (Advisory)

- 2 HTML files missing @media print CSS (filed to GA)
- 6 canvas elements missing aria-label (filed to GA)
- RP4 Q9 and RP7 Q3 have em dash in feedback (filed to GR)
- RP8 Q11 tolerance advisory (filed to GR)

None of these block Kai from using the exams.

## Impact

Kai raised his grade to an A using RP1-RP7. RP8-RP10 were added targeting his weakest standards (W2.a, W2.d) after his RP7 score of 6/15.

---

*Release tag: v1.0 | Verified by GP | Approved by Marcus*

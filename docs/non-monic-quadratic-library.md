# Non-Monic Quadratic Problem Library

FR-curated bank of non-monic quadratic factoring problems (a >= 2) using the AC method.
Organized by difficulty. All solutions are clean integers or simple unit fractions.
Kai's teacher uses these. Built per Marcus's direction 2026-02-23.

## How AC Method Works

Given ax² + bx + c = 0 where a > 1:
1. Compute a×c
2. Find two integers that multiply to (a×c) and sum to b. Call them p and q.
3. Rewrite middle term: ax² + px + qx + c = 0
4. Group and factor: [ax² + px] + [qx + c] = 0
5. Factor each group, then factor the shared binomial

## Level 1 — Entry (a=2, positive solutions)

| Problem | a×c | Split | Factored Form | Solutions |
|---------|-----|-------|---------------|-----------|
| 2x² + 5x + 3 = 0 | 6 | +2, +3 | (2x+3)(x+1) | x=−3/2, x=−1 |
| 2x² + 7x + 3 = 0 | 6 | +6, +1 | (2x+1)(x+3) | x=−1/2, x=−3 |
| 2x² − 5x + 3 = 0 | 6 | −2, −3 | (2x−3)(x−1) | x=3/2, x=1 |
| 2x² − 7x + 3 = 0 | 6 | −6, −1 | (2x−1)(x−3) | x=1/2, x=3 |
| 2x² + x − 3 = 0 | −6 | +3, −2 | (2x+3)(x−1) | x=−3/2, x=1 |
| 2x² − x − 3 = 0 | −6 | −3, +2 | (2x−3)(x+1) | x=3/2, x=−1 |

## Level 2 — Standard (a=2 or a=3, mixed signs)

| Problem | a×c | Split | Factored Form | Solutions |
|---------|-----|-------|---------------|-----------|
| 2x² + 5x − 3 = 0 | −6 | +6, −1 | (2x−1)(x+3) | x=1/2, x=−3 |
| 2x² − 5x − 3 = 0 | −6 | −6, +1 | (2x+1)(x−3) | x=−1/2, x=3 |
| 3x² − 7x + 2 = 0 | 6 | −6, −1 | (3x−1)(x−2) | x=1/3, x=2 ← RP5 Q5 |
| 3x² + 7x + 2 = 0 | 6 | +6, +1 | (3x+1)(x+2) | x=−1/3, x=−2 |
| 3x² − 5x + 2 = 0 | 6 | −3, −2 | (3x−2)(x−1) | x=2/3, x=1 |
| 3x² + 5x + 2 = 0 | 6 | +3, +2 | (3x+2)(x+1) | x=−2/3, x=−1 |
| 3x² + x − 2 = 0 | −6 | +3, −2 | (3x−2)(x+1) | x=2/3, x=−1 |
| 3x² − x − 2 = 0 | −6 | −3, +2 | (3x+2)(x−1) | x=−2/3, x=1 |
| 3x² + 5x − 2 = 0 | −6 | +6, −1 | (3x−1)(x+2) | x=1/3, x=−2 |
| 3x² − 5x − 2 = 0 | −6 | −6, +1 | (3x+1)(x−2) | x=−1/3, x=2 |

## Level 3 — Advanced (a=4 or a=5, requires careful grouping)

| Problem | a×c | Split | Factored Form | Solutions |
|---------|-----|-------|---------------|-----------|
| 4x² − 8x + 3 = 0 | 12 | −6, −2 | (2x−3)(2x−1) | x=3/2, x=1/2 |
| 4x² + 8x + 3 = 0 | 12 | +6, +2 | (2x+3)(2x+1) | x=−3/2, x=−1/2 |
| 4x² − x − 3 = 0 | −12 | −4, +3 | (4x+3)(x−1) | x=−3/4, x=1 |
| 4x² + x − 3 = 0 | −12 | +4, −3 | (4x−3)(x+1) | x=3/4, x=−1 |
| 5x² − 7x + 2 = 0 | 10 | −5, −2 | (5x−2)(x−1) | x=2/5, x=1 |
| 5x² + 7x + 2 = 0 | 10 | +5, +2 | (5x+2)(x+1) | x=−2/5, x=−1 |
| 6x² − 7x + 2 = 0 | 12 | −4, −3 | (3x−2)(2x−1) | x=2/3, x=1/2 |
| 6x² + 7x + 2 = 0 | 12 | +4, +3 | (3x+2)(2x+1) | x=−2/3, x=−1/2 |

## Level 4 — Challenge (larger a×c, harder split recognition)

| Problem | a×c | Split | Factored Form | Solutions |
|---------|-----|-------|---------------|-----------|
| 6x² − 11x + 3 = 0 | 18 | −9, −2 | (3x−1)(2x−3) | x=1/3, x=3/2 |
| 6x² + 11x + 3 = 0 | 18 | +9, +2 | (3x+1)(2x+3) | x=−1/3, x=−3/2 |
| 6x² − x − 2 = 0 | −12 | −4, +3 | (3x−2)(2x+1) | x=2/3, x=−1/2 |
| 6x² + x − 2 = 0 | −12 | +4, −3 | (3x+2)(2x−1) | x=−2/3, x=1/2 |
| 4x² − 13x + 3 = 0 | 12 | −12, −1 | (4x−1)(x−3) | x=1/4, x=3 |
| 4x² + 13x + 3 = 0 | 12 | +12, +1 | (4x+1)(x+3) | x=−1/4, x=−3 |

## Recommended Exam Progression

| Exam | Recommended Problem | Why |
|------|--------------------|----|
| RP5 | 3x² − 7x + 2 = 0 | First non-monic. a=3, split obvious, one integer answer. |
| RP6 | 3x² − 5x − 2 = 0 | a=3, negative c, different split pattern. |
| RP7 | 4x² − x − 3 = 0 | a=4, negative c, one integer answer. |
| RP8 | 6x² − 7x + 2 = 0 | Both a and quotient are composite. Both answers fractions. |
| RP9 | 6x² − 11x + 3 = 0 | Larger a×c=18, harder split. |
| RP10 | 6x² − x − 2 = 0 | Mixed-sign split, both fractional answers. |

## Notes for FR

- All Level 1 and 2 problems have been verified by FR. Answers confirmed.
- Level 3 and 4 problems should be GR-verified before use in exams.
- Never use a problem where GCF > 1 — it reduces to monic and defeats the purpose.
- Prefer problems where one solution is a clean integer — gives Kai a check point.
- a×c should stay under 30 for RP5-7. Harder splits belong in RP8+.

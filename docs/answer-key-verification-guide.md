# Answer Key Verification Guide

How to verify math correctness in Motor City Math exam answer keys.

**Primary owner: GR** — This guide documents GR's verification process for GP reference.

## Who Verifies What

| Role | Responsibility |
|------|---------------|
| GR | ALL mathematical content verification |
| GP | Structural verification (schema, types, uniqueness, tolerance) |
| Marcus | Final human approval before exam ships to Kai |

GP does NOT verify math. GP trusts GR's answers. GP only checks structure.

## GR's Verification Checklist

### For Each Question

- [ ] Compute the answer independently (not from the question's own `answer` field)
- [ ] Verify `solution_steps` walks to the same answer
- [ ] Check `tolerance` is appropriate for the computed value
- [ ] Verify the standard code matches the skill actually tested

### For Numeric Questions

```
answer = computed_value
tolerance = appropriate_margin (see table below)
```

Tolerance guidance:

| Answer magnitude | Minimum tolerance | Recommended |
|-----------------|-------------------|-------------|
| Answer = 0 | 0.001 | 0.01 |
| 0 < answer ≤ 1 | 0.001 | 0.01 |
| 1 < answer ≤ 10 | 0.01 | 0.1 |
| 10 < answer ≤ 100 | 0.1 | 0.5 |
| answer > 100 | 0.5 | 1.0 |

### For Graph Questions

- [ ] `key_points` arrays match actual function values at those x-coordinates
- [ ] Compute: for each `key_point (x, y)`, verify `f(x) = y`
- [ ] `graph_data.datasets[0].data` matches the function at each `graph_data.labels` value

### For Multiple-Choice

- [ ] `correct_choice` index points to the right answer string
- [ ] All wrong choices are plausible but unambiguously wrong
- [ ] Wrong choices are not numerically close to correct answer (would be flagged as tolerance issue)

## Common Math Errors Found This Sprint

| Exam | Q | Error | Fix |
|------|---|-------|-----|
| RP5 | Q4 | Answer was wrong | x=9 (correct) |
| RP5 | Q13 | key_point wrong | (-2, -1.75) |
| RP8 | Q5, Q10, Q15 | Multiple errors | Fixed by GR |
| RP8 | Q11 | tolerance=0.05 on answer=125 | Advisory: increase to 0.5+ |

## Submitting Verified Answers

After GR verifies, send to GP inbox:
```json
{
  "from": "GR",
  "subject": "RP-N verified",
  "body": "RP11 math verified. Ready for GP structural check and commit."
}
```

GP then runs structural verify and commits if clean.

## If You Find an Error After Commit

1. Message GP inbox immediately: "Math error in RP-N Q-X"
2. GP will NOT commit a fix without GR's confirmed correct value in writing
3. GP creates a patch commit with `GP: fix RP-N Q-X answer key (GR correction)`

---

*Owner: GR (math) + GP (doc) | Reference: docs/agents/gp-math-verification-protocol.md*

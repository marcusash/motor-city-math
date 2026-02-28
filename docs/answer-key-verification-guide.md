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

---

## GI Automated Checks (run before GR manual review)

GI runs these checks automatically during CI. If any fail, do not submit for GR review — fix structural issues first.

### CI Gate Commands

```bash
node scripts/ci-data-gate.cjs          # master gate: all 5 validators
node scripts/validate-exam-schema.cjs  # JSON Schema conformance
node scripts/validate-exam-contract.cjs # business rules (NaN, tolerance, uniqueness)
node scripts/validate-standards-map.cjs # standards.json coverage
```

### What GI Catches Automatically

| Check | Tool | Severity |
|-------|------|----------|
| JSON Schema conformance | validate-exam-schema.cjs | Hard (blocks) |
| Duplicate input IDs | validate-exam-contract.cjs | Hard |
| NaN/Infinity answers | validate-exam-contract.cjs | Hard |
| Tolerance <= 0 | validate-exam-contract.cjs | Hard |
| plus_minus count mismatch | validate-exam-contract.cjs | Hard |
| key_points < min_points | validate-exam-contract.cjs | Hard |
| key_points on function check | validate-exam-contract.cjs | Warning |
| Near-collision (±1) | gi-near-collision-detector.cjs | Advisory |
| Answer space density | gi-answer-space-density.cjs | Advisory |
| Word count (hints/steps) | gi-word-count.cjs | Advisory |

### What GI Does NOT Catch

- Whether the computed math answer is correct (GR's job)
- Whether word problem context is varied enough (manual review)
- Whether solution steps pedagogically explain the method (GR's job)
- Whether question difficulty is appropriate for Kai's current level (Marcus + GR)

### New Exam Intake Sequence

1. **GR authors exam** using `docs/gi-rp12-data-spec.md` (or equivalent) as spec
2. **GI runs CI gate** — must pass 0 errors
3. **GR verifies math** — all answers computed independently
4. **GR sends GP inbox message** with confirmation
5. **GP commits** with `feat(data): add RPN`
6. **GI updates data-lineage.json** with new artifact entry

*GI section added 2026-02-23. Owner: GI (Data Engineer).*

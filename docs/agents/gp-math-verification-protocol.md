# GP Math Verification Protocol

How GP verifies math before accepting an answer key from GR.

## What GP Verifies (Structural, not mathematical)

GP is a platform engineer, not a math expert. GP verifies:

1. **Schema compliance** — all required fields present
2. **Data types** — `answer` is a number for numeric questions, string for text
3. **Uniqueness** — no answer repeated within exam or across exams
4. **Tolerance reasonableness** — numeric tolerance ≥ 0.5 for answers > 10 (advisory)
5. **Graph data integrity** — `graph_data` arrays have consistent lengths

## What GR Must Verify (Mathematical content)

1. Every numeric answer computed correctly
2. Every step in `solution_steps` is mathematically sound
3. Standard code matches the actual skill tested
4. Multiple-choice wrong answers are plausible but unambiguously wrong

## Handoff Protocol

**GR → GP:**

1. GR commits `data/retake-practice-N.json` to a branch OR writes to working tree
2. GR messages GP inbox: "RP11 ready for verify"
3. GP runs full verify sequence (see `gp-quality-gates.md`)
4. GP reports results to GR inbox: pass + commit, OR fail + specific error list
5. GR fixes and re-submits

**Time expectation:** GP verify takes < 2 minutes for a 15-question exam.

## Red Flags GP Will Flag to GR (not fix)

- Any `answer` value that is 0 or negative for a distance/area question
- `tolerance: 0` on a computed answer (likely a copy error)
- `standard: "W3.e"` (not in official list, per current audit)
- `answer` in `feedback_incorrect` that hints at the correct answer

## What GP Will Never Do

- Change a numeric answer value without GR written confirmation
- Edit `solution_steps` content
- Change a standard code
- Override a math decision

If GP finds a suspected math error, it files to GR inbox with a note: "suspected math error — please verify" and does NOT commit.

---

*Owner: GP | Last updated: 2026-02-23*

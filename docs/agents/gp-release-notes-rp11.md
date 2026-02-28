# GP Release Notes — RP11

**Exam:** Retake Practice 11  
**File:** data/retake-practice-11.json  
**Schema version:** 2.0  
**Questions:** 15  
**Status:** Verified, ready for GA integration

## What's in RP11

RP11 covers W2.d — identifying key features of nonlinear functions from graphs.
This directly targets one of Kai's two identified weaknesses (W2.d: reading vertex, intercepts, and asymptotes from a graph).

**Author:** GR (grind-research)  
**Verification:** GR math content verified, GP schema verified

## Standards Coverage

| Standard | Questions | Description |
|----------|-----------|-------------|
| W2.d | primary | Identify key features from graphs |
| W2.b | secondary | Graph nonlinear functions |

## Schema Notes

RP11 is the first exam on schema_version 2.0:
- Added `version: "1.0"` field (was missing)
- Updated `schema_version` from "1.0" to "2.0"
- All 15 questions pass gp-metadata-complete.test.js

## Verify Results

```
node tests/verify-practice-exams.js     -> contributes to 3337/3337
node tests/gp-hint-no-emdash.test.js    -> 0 violations in RP11
node tests/gp-feedback-no-emdash.test.js -> 0 violations in RP11
node tests/gp-valid-question-types.test.js -> all 15 pass
node tests/gp-standard-whitelist.test.js -> all 15 W2.d
```

## Pending (for GA)

- Wire `retake-practice-11.json` into exam.html as selectable exam
- Add RP11 entry to data/manifest.json (waiting for GI green-light)
- Add RP11 to dashboard exam list

## Integration Gate

Before GA integrates:
1. `node scripts/ci-data-gate.cjs --exam retake-practice-11` exits 0
2. Wait for GI green-light message
3. GA updates exam.html exam selector
4. GP adds manifest.json entry
5. Verify full baseline still 3337+15 = 3352 after integration

# GP Spec: RP JSON Schema v2 — Extended Question Fields

**Status:** PROPOSED  
**Author:** GP  
**Date:** 2026-02-23  
**Awaiting:** GI (data impact), GR (math field validation), Marcus (go/no-go)

---

## Problem

Current RP JSON schema (v1.0/2.0) captures question content and answer keys but lacks metadata for analytics, adaptive learning, and parent dashboard. Kai's ADHD profile requires knowing which questions take longest, which types he consistently misses, and how to sequence retakes for maximum impact.

---

## Proposed New Fields

### 1. `exam_id` (exam-level)

Already present as `exam_id` in most files. Ensure canonical format:

```json
"exam_id": "retake-practice-1"
```

Format: `retake-practice-{N}` — matches filename without `.json`. Required for analytics.

### 2. `difficulty_level` (question-level)

```json
"difficulty_level": "medium"
```

Values: `"easy"` | `"medium"` | `"hard"`  
Defined per question by GR during authoring.  

Mapping to Kai's history:
- `easy` — question type he masters reliably (>80% correct across 3 exams)
- `medium` — inconsistent (50-80% correct)
- `hard` — consistently missed (<50%) or first appearance of a type

### 3. `standard_code` (question-level)

```json
"standard_code": "W2.a"
```

Already using `standard` field. Rename to `standard_code` in v3.0 for clarity.  
Values: W2.a, W2.b, W2.c, W2.d, W2.e, W3.a, W3.b, W3.c, W3.d  
Enables per-standard mastery tracking on parent dashboard.

### 4. `estimated_time_seconds` (question-level)

```json
"estimated_time_seconds": 120
```

Ranges by type:
| Type | Easy | Medium | Hard |
|------|------|--------|------|
| quadratic (factor) | 60 | 90 | 120 |
| absolute-value | 90 | 120 | 180 |
| exponential | 90 | 120 | 150 |
| radical | 90 | 120 | 180 |
| rational | 90 | 120 | 150 |
| graph | 180 | 240 | 300 |
| write-equation | 120 | 180 | 240 |
| word-problem | 150 | 210 | 270 |

Sum across exam should total `time_minutes * 60` (exam-level budget check).

### 5. `common_errors` (question-level)

```json
"common_errors": [
  "Forgetting the negative solution when x² = k",
  "Squaring before isolating the radical"
]
```

Array of 1-3 strings. Max 12 words each (ADHD rule).  
Sourced from GR's math notes and Kai's observed mistakes.  
Displayed only in answer key view (not during exam).

---

## Migration Plan

1. Schema v3.0 — new fields optional, backward compatible
2. GR populates `difficulty_level`, `common_errors` during RP11 authoring
3. GI adds analytics hooks once `difficulty_level` and `standard_code` are stable
4. GP writes `gp-field-completeness.test.js` update to gate on v3 fields for RP11+

---

## Not in Scope

- No changes to existing RP1-10 (avoid risk during active use)
- RP11 will be first exam authored to v3 schema
- `estimated_time_seconds` is informational only — not used for timer enforcement

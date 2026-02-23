# GI Score Data Guide

Structure of `data/kai-scores-latest.json` and all `data/kai-scores-*.json` files.
Used by GI analytics scripts: `score-velocity.cjs`, `compute-item-difficulty.cjs`.

---

## File Structure

```json
{
  "version": "1.0",
  "exported": "2026-02-22T...",
  "student": "Kai",
  "mcm_scores": { ... },
  "mcm_srs": { ... },
  "standardScores": { ... }
}
```

---

## Top-Level Keys

| Key | Type | Description |
|-----|------|-------------|
| `version` | string | Score file format version |
| `exported` | ISO 8601 string | When this file was exported from localStorage |
| `student` | string | Student identifier (`"Kai"`) |
| `mcm_scores` | object | Per-exam score records (primary data) |
| `mcm_srs` | object | Spaced repetition data per standard |
| `standardScores` | object | Aggregated per-standard performance |

---

## `mcm_scores` Format

Keys are exam IDs prefixed with `mcm-`:

```json
"mcm_scores": {
  "mcm-retake-practice-1": {
    "attempts": [
      {
        "score": 13,
        "total": 15,
        "pct": 87,
        "grade": 3,
        "timestamp": "2026-02-19T20:23:53.052Z"
      }
    ],
    "best": {
      "score": 13,
      "pct": 87,
      "grade": 3
    }
  }
}
```

**Exam ID → key mapping:** `retake-practice-1` → `mcm-retake-practice-1`

Key fields:
- `attempts` — array of all attempt records (score, pct, grade, timestamp)
- `best` — best attempt summary (score, pct, grade)

Note: Per-input/per-question answer tracking is NOT stored in score files. Analytics work at the exam-level (score %, pct) and standard-level (via `standardScores`).

---

## `mcm_srs` Format

Spaced repetition system data per standard:

```json
"mcm_srs": {
  "W3.b": {
    "interval": 7,
    "easeFactor": 2.5,
    "nextReview": "2026-03-01",
    "reps": 4
  }
}
```

| Field | Description |
|-------|-------------|
| `interval` | Days until next review (SM-2 algorithm) |
| `easeFactor` | Difficulty multiplier (default 2.5) |
| `nextReview` | Next scheduled review date |
| `reps` | Successful review streak count |

---

## `standardScores` Format

Aggregated per-standard data:

```json
"standardScores": {
  "W3.b": {
    "correct": 28,
    "total": 34,
    "pct": 82.4
  }
}
```

---

## Multiple Score Files

Multiple dated files exist in `data/`:
- `kai-scores-2026-02-19.json` — first session
- `kai-scores-2026-02-21.json` — second session
- `kai-scores-2026-02-22.json` — third session
- `kai-scores-latest.json` — copy of most recent session

Analytics scripts load all dated files and compare across dates to compute velocity.

---

## How Analytics Scripts Use Score Data

| Script | Data used |
|--------|-----------|
| `score-velocity.cjs` | `mcm_scores[exam].score` across dates |
| `compute-item-difficulty.cjs` | `mcm_scores[exam].answers` per input ID |
| `gi-mastery-gap.cjs` | `mcm_scores[exam].answers` for wrong answers |
| `gi-progress-report.cjs` | `standardScores`, `mcm_srs.nextReview` |

---

## Missing Data Behavior

If score files are absent or an exam has no score entry, scripts emit a note and skip gracefully. They never exit 1 on missing score data — only on code errors.

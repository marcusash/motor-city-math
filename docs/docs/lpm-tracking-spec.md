# L/P/M Progress Tracking — Data Model & Spec

**Author:** Agent R (Research)
**Date:** 2026-02-19
**Scope:** Unit 2 (W2.a–W2.e, W3.a–W3.e) — extensible to all units

---

## Purpose

Track Kai's mastery per sub-standard using the **L/P/M** system (Learned → Practiced → Mastered) aligned with his SAAS teacher's rubric. This is for retake prep — Kai already took the Unit 2 formal test and gets one retake.

---

## L/P/M Level Definitions

| Level | Label | Criteria | Color | Icon |
|-------|-------|----------|-------|------|
| `—` | Not started | 0 attempts for this standard | `#BEC0C2` (Chrome) | ⬜ |
| `L` | Learned | ≥1 question attempted | `#E8A317` (Gold) | 🟡 |
| `P` | Practiced | ≥3 attempted AND ≥60% correct (lifetime) | `#1D42BA` (Blue) | 🔵 |
| `M` | Mastered | ≥5 attempted AND ≥85% correct on last 5 | `#1B7D3A` (Green) | 🟢 |

**Why sliding window for M:** Old mistakes shouldn't hold Kai back. If he bombed W3.c last week but nails it 5 times in a row now, he's mastered it. The last-5 window captures current ability.

**ADHD consideration:** Progress should only go UP during a session. If Kai gets one wrong after 4 correct, don't immediately drop from M → P. Recalculate levels at session end, not per-question.

---

## localStorage Schema

### Key: `mcm_lpm`

```json
{
  "version": 1,
  "standards": {
    "W2.a": {
      "attempts": 8,
      "correct": 6,
      "last5": [true, true, false, true, true],
      "level": "P",
      "updated": "2026-02-19"
    },
    "W3.b": {
      "attempts": 12,
      "correct": 11,
      "last5": [true, true, true, true, true],
      "level": "M",
      "updated": "2026-02-19"
    }
  }
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `version` | number | Schema version (1) |
| `standards[id].attempts` | number | Total questions attempted for this standard |
| `standards[id].correct` | number | Total correct answers |
| `standards[id].last5` | boolean[] | Sliding window of last 5 results (most recent last). Max length 5. |
| `standards[id].level` | string | Current L/P/M level: `""`, `"L"`, `"P"`, `"M"` |
| `standards[id].updated` | string | ISO date of last update |

### Level Computation

```js
function computeLevel(std) {
    if (std.attempts === 0) return "";
    if (std.attempts < 3) return "L";
    
    var lifetimePct = std.correct / std.attempts;
    if (lifetimePct < 0.60) return "L";
    
    if (std.last5.length >= 5) {
        var last5correct = std.last5.filter(Boolean).length;
        if (last5correct / 5 >= 0.85) return "M";  // 5/5 or 4/5
    }
    
    return "P";
}
```

### Integration with Existing Systems

- **mcm_scores**: Stores per-test attempt history. L/P/M reads from here for historical data.
- **mcm_srs**: Spaced repetition boxes. L/P/M is complementary — SRS tracks individual questions, L/P/M tracks standard-level mastery.
- **gradeTest()**: After grading, call `MCM_LPM.recordResults(questionResults)` where each result includes `{ standard: "W3.b", correct: true }`.

### Recording Flow

1. Kai finishes a test/practice session → `gradeTest()` runs
2. For each graded question, extract the standard(s) from question metadata
3. Call `MCM_LPM.recordResults(results)` — updates attempts, correct, last5, recomputes level
4. Display updated L/P/M grid on scorecard

---

## Display Spec

### Where It Shows

1. **Scorecard** (after grading): L/P/M grid below the score, showing all 10 Unit 2 standards
2. **Dashboard** (index.html): L/P/M summary card in "Study Next" section — shows weakest standards
3. **Practice mode** (practice.html): Filter by "Not yet Mastered" to target weak standards

### Visual Treatment

```
┌─────────────────────────────────────────────────┐
│  Unit 2: Nonlinear Functions          7/10 M    │
├─────────────────────────────────────────────────┤
│  W2.a  Sketch parent functions        🟢 M      │
│  W2.b  Identify parent + transforms   🟢 M      │
│  W2.c  Graph with transformations     🔵 P      │
│  W2.d  Write equation from graph      🟡 L      │
│  W2.e  Domain, range, asymptotes      🟢 M      │
│  W3.a  Explain solving steps          🟢 M      │
│  W3.b  Solve nonlinear equations      🟢 M      │
│  W3.c  Solve rational equations       🔵 P      │
│  W3.d  Solve exponential (1-to-1)     🟢 M      │
│  W3.e  Identify extraneous solutions  🟡 L      │
├─────────────────────────────────────────────────┤
│  📋 Focus: W2.d, W3.c, W3.e                    │
│  [PRACTICE WEAK STANDARDS]                       │
└─────────────────────────────────────────────────┘
```

- Each row: standard ID, short description, colored level badge
- Bottom: "Focus" line highlights standards below M (ADHD: max 3 shown)
- Action button links to practice.html filtered to those standards
- Grid uses `.standard-card` from shared/styles.css (already exists)

### ADHD Constraints

- Max 3 "focus" standards shown at a time (don't overwhelm)
- Level only goes UP during a session (recalculate at session end)
- Progress bar: "7/10 Mastered" with fill bar
- Celebrate hitting M: "🔥 W3.b Mastered!" toast (one-time)

---

## Standards Reference (Unit 2)

| ID | Short Name | Description | Bank Count |
|----|-----------|-------------|------------|
| W2.a | Sketch parents | Sketch graphs of parent functions from memory | 5 |
| W2.b | Identify transforms | Identify parent function and transformations | 10 |
| W2.c | Graph transforms | Graph a function using transformations | 16 |
| W2.d | Write equation | Write equation from a graph | 5 |
| W2.e | Characteristics | Domain, range, symmetry, extrema, asymptotes | 10 |
| W3.a | Explain steps | Explain reasoning for each solving step | 7 |
| W3.b | Solve nonlinear | Solve using inverse ops (quad, power, radical) | 9 |
| W3.c | Solve rational | Solve rational equations | 5 |
| W3.d | Solve exponential | Solve using one-to-one property | 5 |
| W3.e | Extraneous | Identify extraneous solutions | 5 |

**Total Unit 2 questions in bank: 77** (across all 10 sub-standards)

---

## For Agent A

Build `MCM_LPM` module in `shared/scripts.js` using this spec. Key functions:
- `MCM_LPM.recordResults(results)` — array of `{standard, correct}` objects
- `MCM_LPM.getLevel(standardId)` — returns `""`, `"L"`, `"P"`, or `"M"`
- `MCM_LPM.getAllLevels()` — returns object of all standards with levels
- `MCM_LPM.getWeakest(maxCount)` — returns up to N standards below M, sorted by priority

Display the L/P/M grid on the scorecard after `gradeTest()` for any test that includes W2/W3 questions.

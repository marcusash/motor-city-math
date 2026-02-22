# Spaced Repetition System — Design Doc

> **Owner:** Agent R | **Implementer:** Agent A
> **Constraint:** Client-side only (localStorage), no server, ~500 questions

## Algorithm: Modified Leitner System

SM-2 is mathematically optimal but complex to debug and explain. For a 15-year-old with ADHD studying Algebra II, the Leitner box system is better: simple mental model ("missed questions come back sooner"), predictable behavior, and easy to implement in localStorage.

### Box System

| Box | Review Interval | Meaning |
|-----|----------------|---------|
| 0 | Every session | New / never seen |
| 1 | Next session | Just learned or recently missed |
| 2 | After 1 day | Getting it |
| 3 | After 3 days | Solid |
| 4 | After 7 days | Strong |
| 5 | After 14 days | Mastered |

### Rules

1. **Correct answer** → Move to next box (box N → box N+1, max 5)
2. **Wrong answer** → Reset to box 1 (not box 0 — he's seen it before)
3. **New question** → Starts in box 0
4. **Session queue** → Pull from box 0 first, then box 1, then due items from boxes 2-5
5. **Session size** → Max 15 questions per practice session (ADHD: short focused bursts)

### Data Model (localStorage)

```json
{
  "mcm_srs": {
    "version": 1,
    "questions": {
      "lin-001": { "box": 3, "last": "2026-01-20", "correct": 5, "wrong": 1 },
      "exp1-005": { "box": 1, "last": "2026-01-19", "correct": 2, "wrong": 3 }
    },
    "sessions": [
      { "date": "2026-01-20", "count": 15, "correct": 12, "time_sec": 480 }
    ],
    "streaks": { "current": 3, "best": 7, "last_date": "2026-01-20" }
  }
}
```

**Storage budget:** ~500 questions × ~80 bytes each = ~40KB. Well within localStorage 5MB limit.

### Queue Algorithm

```
function buildQueue(maxSize = 15):
  due = []

  // Priority 1: Box 0 (unseen)
  for q in questions where box == 0:
    due.push(q)

  // Priority 2: Box 1 (just missed)
  for q in questions where box == 1:
    due.push(q)

  // Priority 3: Boxes 2-5 where interval has elapsed
  for q in questions where box >= 2:
    interval = [0, 0, 1, 3, 7, 14][box]
    if daysSince(q.last) >= interval:
      due.push(q)

  // Sort: lower box first, then oldest review date
  due.sort(by box ASC, then by last ASC)

  // Cap at maxSize
  return due.slice(0, maxSize)
```

### ADHD Design Constraints

1. **Session cap: 15 questions.** After 15, show score and stop. Option to "Keep going" but default is done.
2. **Progress bar always visible.** "Question 7 of 15" with visual fill.
3. **Streak counter.** Consecutive correct answers in current session. Resets on wrong. Persists best across sessions.
4. **No penalty framing.** Wrong → "Back to practice pile" not "Failed." Box 1 language: "Let's try this one again soon."
5. **Daily goal: one session.** Show "✅ Done for today" after completing a session. No guilt if he stops.
6. **Quick wins first.** If Kai hasn't studied in a while, start with box 4-5 review (easy wins) before box 0-1 (harder). Override: `if (daysSinceLastSession > 3) prioritizeEasyWins()`.

### Standard-Filtered Practice

Kai should be able to filter by standard or unit:
- "Practice exponents" → Only pull from unit=exponents
- "Review Standard 3.a" → Only pull questions where standard=3.a
- Queue algorithm still applies within the filter

### Score Tracking

Per-standard accuracy stored for dashboard:
```json
{
  "mcm_scores": {
    "3.a": { "correct": 12, "total": 15, "last": "2026-01-20" },
    "5.b": { "correct": 3, "total": 8, "last": "2026-01-19" }
  }
}
```

### Migration Path

1. **Phase 1 (now):** Question bank in `data/questions.json` ✅
2. **Phase 2 (Agent A):** Build practice mode that loads questions from JSON, uses this SRS algorithm
3. **Phase 3:** Add daily goal tracking and streak persistence
4. **Phase 4:** Add standard-filtered practice and per-standard scoring
5. **Phase 5:** Add "study recommendation" — suggest the standard with lowest accuracy

### Why Not SM-2

SM-2 (SuperMemo) uses continuous ease factors (2.5 default, adjusted per response quality 0-5). Advantages: mathematically optimal retention curves. Disadvantages for this project:
- Requires quality ratings (0-5 scale) — too many choices for ADHD. We want binary: right/wrong.
- Ease factor drift is hard to debug in localStorage
- Mental model is opaque ("why did this question come back?")
- Overkill for ~500 questions across 6 units

Leitner gives 90%+ of the benefit with 10% of the complexity. If we scale to 2000+ questions, revisit SM-2.

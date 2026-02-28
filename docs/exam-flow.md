# Exam Flow — User Journey Through a Motor City Math Session

How Kai goes from "open browser" to "exam complete."

## 1. Entry Point

Kai opens `index.html` — the dashboard. Shows:
- List of available retake practice exams
- His most recent scores (from localStorage)
- Recommended next exam (based on standard gaps)

## 2. Exam Selection

Kai clicks a practice exam link. Browser navigates to:
```
exam.html?file=retake-practice-8.json
```

`exam.html` reads the `file` query parameter, fetches the JSON, renders questions.

## 3. Question Display

Questions display sequentially (one at a time). Each question shows:
- Prompt (may include graph)
- Input field(s) or multiple choice buttons
- "Check Answer" button (one CTA — ADHD rule)

## 4. Answer Submission

Kai submits an answer:

**Correct:**
- `feedback_correct` shown (≤ 12 words)
- Next question loads automatically
- Streak counter increments

**Incorrect:**
- `feedback_incorrect` shown (≤ 12 words)
- Hint button appears (if not already shown)
- Question stays active

## 5. Hint System (3 layers)

Layer 1: `hint` — brief nudge (≤ 20 words)  
Layer 2: `hint_2` — more specific (if present)  
Layer 3: `solution_steps` — full walkthrough  

Each layer unlocks after wrong answer. Kai controls the pace.

## 6. Exam Complete

All questions answered → summary screen:
- Score: X / 15
- Standards breakdown (which W codes Kai got right/wrong)
- Option to review missed questions
- "Save results" button (localStorage)

## 7. Save/Load

Results saved to localStorage key `retake-practice-N-results` (unique per exam).  
Dad Dashboard (`?dad=1`) reads all localStorage keys and displays score history.

## 8. Print Mode

`Ctrl+P` renders a clean printable version (no answer key by default).

---

*Owner: GA (exam.html rendering) | GP (verify) | Last updated: 2026-02-23*

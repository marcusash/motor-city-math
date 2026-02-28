# GP Spec: exam.html UX Improvements

**Status:** PROPOSED  
**Author:** GP  
**Date:** 2026-02-23  
**Awaiting:** GA (implementation), GD (design review), Marcus (priority)

---

## Problem

exam.html renders RP exams but lacks real-time feedback during the session. Kai cannot tell how he is doing, how many questions remain, or review mistakes at the end. These additions directly support ADHD focus management.

---

## Feature 1: Exam Header — Number and Question Count

**Requirement:** Header shows exam identifier and question count before the first question.

**Copy format:**
```
Retake Practice 5   |   15 Questions   |   50 min
```

**Implementation:**
- Read `title`, `questions.length`, `time_minutes` from the loaded RP JSON
- Render in `.exam-header` element above the question area
- Font: 16px, `--color-text-secondary` per design system

---

## Feature 2: Live Score Display During Exam

**Requirement:** After each auto-graded submission, show current score in the header area.

**Copy format:**
```
Score: 7/10
```

Only shown after at least one question graded. Hidden during question display.  
ADHD rule: one number, no percentage, no decorative text.

**Implementation:**
- `gradeQuestion()` updates `scoreDisplay.textContent` after each check
- Counter: `window.mcmCorrect` (correct) / `window.mcmGraded` (graded)

---

## Feature 3: Progress Bar Per Question

**Requirement:** A thin progress bar at top of question area shows position in exam.

**Spec:**
- Height: 4px
- Color: `--color-primary` (#C8102E) for completed, `--color-border` for remaining
- Updates after each question is graded (not on navigation)
- No percentage label (visual only, keeps focus on question)

**Implementation:**
```css
.exam-progress-bar {
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
}
.exam-progress-bar-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}
```

---

## Feature 4: Hint Count Tracking Per Session

**Requirement:** Track how many hints Kai uses per exam session. Display in end-of-exam summary.

**Format:** "You used 3 hints"

**Implementation:**
- `window.mcmHintsUsed = 0`
- Increment on each hint button click
- Display in score summary panel: "Hints used: {N}"
- Persist in localStorage with exam results

**ADHD note:** Do NOT show hint count during the exam. Only in summary. Avoid mid-exam self-consciousness.

---

## Feature 5: Review Wrong Answers Mode

**Requirement:** End-of-exam panel shows all incorrect questions with correct answers and feedback.

**Trigger:** After exam is scored (all questions submitted)

**Display per wrong question:**
```
Q4 — Exponential Equation
Your answer: x = 3
Correct: x = 1.5
4^(2x+1)=256. 4=2² so 2^(4x+2)=2⁸. x=3/2.
```

**Implementation:**
- Collect `incorrectQuestions[]` during grading
- Render in collapsible `.review-panel` after score display
- Button label: "Review Mistakes" (shown only if score < 13/15)
- Each item: question number, type, user answer, correct answer, `feedback_wrong` text

**ADHD constraints:**
- One question at a time (prev/next navigation), not a wall of text
- Max 3 lines per question in review panel
- Large tap targets (44px min) for prev/next

---

## Priority Order

| Feature | Priority | Effort | Who |
|---------|----------|--------|-----|
| 3: Progress bar | HIGH | Low (CSS+JS) | GA |
| 1: Header info | HIGH | Low | GA |
| 2: Live score | MEDIUM | Medium | GA |
| 4: Hint tracking | MEDIUM | Low | GA |
| 5: Review mode | LOW | High | GA |

---

## Out of Scope

- No keyboard shortcuts for hint (see separate spec gp-keyboard-spec.md)
- No animation on score counter
- No server sync

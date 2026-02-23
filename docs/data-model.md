# Motor City Math — Data Model

**Owner:** GP (grind-platform)  
**Last updated:** 2026-02-23

---

## Retake Practice Exam JSON Schema

Each `data/retake-practice-N.json` follows this structure:

```json
{
  "exam_id": "retake-practice-1",
  "title": "Retake Practice 1",
  "version": "2.0",
  "questions": [
    {
      "id": "rp1-q1",
      "question_html": "Solve: \\( 2x + 3 = 11 \\)",
      "inputs": [
        {
          "id": "q1_x",
          "type": "number",
          "label": "x =",
          "answer": 4,
          "tolerance": 0.01
        }
      ],
      "hint": "Subtract 3 from both sides first.",
      "solution_steps": [
        "Subtract 3: 2x = 8.",
        "Divide by 2: x = 4.",
        "Check: 2(4)+3 = 11. Correct."
      ],
      "feedback_correct": "Nailed it. x=4.",
      "feedback_wrong": "Subtract 3 first, then divide by 2."
    }
  ]
}
```

## Field Reference

| Field | Type | Required | Rules |
|-------|------|---------|-------|
| `exam_id` | string | yes | Must match filename (without .json) |
| `title` | string | yes | Human-readable exam name |
| `version` | string | yes | Current: "2.0" |
| `questions` | array | yes | Exactly 15 questions |
| `questions[].id` | string | yes | Format: `rpN-qM` |
| `questions[].question_html` | string | yes | LaTeX wrapped in `\( \)` |
| `questions[].inputs` | array | yes | 1+ input objects |
| `questions[].inputs[].id` | string | yes | Unique within exam |
| `questions[].inputs[].type` | string | yes | `number`, `text` |
| `questions[].inputs[].label` | string | yes | Display label |
| `questions[].inputs[].answer` | number/string | yes | Correct answer |
| `questions[].inputs[].tolerance` | number | yes (numeric) | Acceptable error range |
| `questions[].hint` | string | yes | One sentence. Under 20 words. |
| `questions[].solution_steps` | array | yes | >= 3 string steps |
| `questions[].feedback_correct` | string | yes | Under 12 words (ADHD rule) |
| `questions[].feedback_wrong` | string | yes | Under 12 words (ADHD rule) |
| `questions[].graph` | object | conditional | Required for graphing questions |
| `questions[].graph.canvas_id` | string | yes | Unique canvas element ID |
| `questions[].graph.function` | string | yes | JS-evaluable function string |
| `questions[].graph.key_points` | array | yes | `[[x,y], ...]` verified coordinates |
| `questions[].graph.tolerance` | number | yes | Max 0.3 |
| `questions[].graph.asymptotes` | object | yes | `{vertical: [], horizontal: []}` |

## Verify Requirements

Before any exam ships to Kai:
1. `node tests/verify-practice-exams.js` — N/N pass
2. `node tests/cross-exam-verify.js` — 0 hard failures
3. `npm run test:gp` — all 5 GP tests pass
4. `node scripts/gp-exam-health.js` — 8/8 checks pass

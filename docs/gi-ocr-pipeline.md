# GI OCR Import Pipeline

Step-by-step guide for importing a scanned PDF worksheet as a new exam.

---

## Overview

The OCR import pipeline converts a scanned PDF into a JSON exam file. Pipeline stages:

```
PDF scan → image extraction → OCR (Tesseract) → confidence analysis → parse → JSON output → CI validation
```

All scripts live in `import/`. Output goes to `ocr-output/`.

---

## Prerequisites

Before starting:
- Node.js 18+
- Tesseract OCR installed: `tesseract --version`
- PDF tools (pdftoppm or ImageMagick): `pdftoppm -v`
- `eng.traineddata` present in repo root (already committed)

---

## Step 1: Convert PDF to Images

```bash
# Using pdftoppm (recommended: 300 DPI)
pdftoppm -r 300 -png "2026011_Kai_exponents_Unit1.pdf" ocr-output/page

# Output: ocr-output/page-1.png, page-2.png, etc.
```

If pdftoppm is unavailable, use ImageMagick:
```bash
magick convert -density 300 worksheet.pdf ocr-output/page-%d.png
```

---

## Step 2: Run OCR

```bash
node import/ocr-exam.mjs --input ocr-output/page-1.png --output ocr-output/page-1-ocr.json
```

The script:
1. Runs Tesseract on the image
2. Captures word-level confidence scores
3. Runs `analyzeConfidence()` from `import/ocr-confidence.mjs`
4. Saves `ocr-output/ocr-confidence-report.json`
5. Exits 1 if abort threshold exceeded (>25% flagged lines with <85% avg confidence)

---

## Step 3: Interpret the Confidence Report

Check `ocr-output/ocr-confidence-report.json`:

```json
{
  "pages": [
    {
      "page": 1,
      "avg_confidence": 92.3,
      "flagged_lines": 2,
      "total_lines": 45,
      "flagged_pct": 4.4,
      "math_tokens_flagged": 0,
      "abort": false
    }
  ],
  "overall": {
    "abort": false,
    "flagged_pages": 0
  }
}
```

**Thresholds:**
| Metric | Threshold | Action if exceeded |
|--------|-----------|-------------------|
| Line avg confidence | < 85% | Flag line |
| Math token confidence | < 80% | Flag token |
| Flagged lines % | > 25% | Abort import, improve scan |

**If abort = true:**
- Rescan at higher DPI (300 → 600)
- Clean up the scan: straighten, increase contrast
- Run again; confidence should improve

---

## Step 4: Parse the OCR Output

```bash
node import/parse-worksheet.mjs --input ocr-output/page-1-ocr.json --output data/retake-practice-12.json --exam-id rp12
```

The parser attempts to:
- Identify question boundaries (numbered questions, blank lines)
- Extract math expressions (numbers, variables, operators)
- Generate a stub JSON file with `question_html` for each question

**Manual review required:** OCR output for math expressions is often imperfect. Review each `question_html` and fix:
- Exponent symbols: `^2` → `x²` or MathJax `\(x^2\)`
- Fractions: `3/4` → `\(\frac{3}{4}\)`
- Square roots: `sqrt` → `\(\sqrt{x}\)`

---

## Step 5: Fill In the Data

After parsing, the JSON stub will have correct question text but empty/stub values for:

```json
{
  "inputs": [],
  "hint": "",
  "solution_steps": [],
  "feedback_correct": "",
  "feedback_wrong": ""
}
```

GR fills these in per the answer key. Use `docs/gi-gr-interface.md` for field requirements.

---

## Step 6: Validate and Gate

```bash
node scripts/ci-data-gate.cjs --exam rp12
node tests/cross-exam-verify.js
node scripts/gi-answer-space-density.cjs  # check answers are safe
```

All must pass before sending green-light to GP.

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| `abort: true` in confidence report | Poor scan quality | Rescan at 600 DPI, better lighting |
| Math expressions garbled | Low math token confidence | Manual correction in JSON |
| Page boundary detection fails | Question text runs across pages | Split PDF manually, process per page |
| `must NOT have additional properties` schema error | New field not in schema | Add field to `practice-exam.schema.json` first |

---

## Confidence Thresholds (from `import/ocr-confidence.mjs`)

```js
THRESHOLDS = {
  LINE_CONF_MIN: 85,    // avg confidence per line
  MATH_CONF_MIN: 80,    // confidence for math tokens
  ABORT_THRESHOLD: 25,  // % flagged lines to abort
}
```

Math token detection regex: `/[0-9x\^√+\-*/=()²³½⅓⅔]/`

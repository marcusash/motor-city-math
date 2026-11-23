# Approved final rehearsal

Fourteen standard-Precalculus questions, 100 points. Target 75 minutes, maximum
90 minutes, including five minutes for checking. The central simulated workload
estimate is about 80 minutes, not an observed completion guarantee.

- `Final_Rehearsal_2026-11-22.pdf`: student test, 21 pages.
- `Final_Rehearsal_2026-11-22_KEY.pdf`: separate worked key, 15 pages.
- Matching HTML files embed the existing offline KaTeX fonts.
- `questions.md` and `key.md`: approved content and suggested practice rubric.
- `student-review.md`: direct review record and limitations.

Print at 100% on Letter paper without browser headers or footers. Give only the
student copy to the learner. Large grids and separate working space are
intentional; polynomial division and the graph-based inverse have continuation
pages. Slant-asymptote graphing remains in the test.

All questions and the six workload cuts were individually approved. The owner
then explicitly approved the complete revision, timing, 100-point distribution
and PDF production in issue #42. Subsequent repairs changed typography and
space only, not the questions.

Rebuild HTML and Markdown with the existing template helpers:

```powershell
python scripts\build-last-rehearsal-2026-11-22.py --source print\last-rehearsal-2026-11-22\questions.md --output print\last-rehearsal-2026-11-22
```

The paired PDFs were exported with the existing Edge print workflow. Font,
math-rendering, page-count and overflow checks passed for both documents.
The suggested scoring is not an official school rubric. Preserve valid
follow-through and avoid repeatedly deducting the same originating error.

This folder contains reusable questions and answers only: no submitted work,
personal grading records or private baseline notes. It does not change the
website exam registry.

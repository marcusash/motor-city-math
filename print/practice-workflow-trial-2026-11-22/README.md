# Approved revision 2 practice

Standalone standard-Precalculus practice: eight questions, 100 points, learning
targets 1-8. Working duration is 60 minutes, including six checking minutes.
The workload estimate is not a measured completion guarantee.

- `Practice_2026-11-22_R2.pdf`: student exam, nine pages. Question 1 continues
  onto page 2 to preserve graph and handwriting space.
- `Practice_2026-11-22_R2_KEY.pdf`: separate worked key, eight pages, with
  suggested partial-credit scoring rather than an official school rubric.
- Matching HTML files contain offline math fonts and can be printed at 100% on
  Letter paper without browser headers or footers.
- `questions.md` and `key.md` preserve the approved public-safe content.
- `student-review.md` records the direct print-usability review and limitations.

Revision 2 was explicitly approved before PDF production in issue #40.
Question 2 uses fundraiser expenses rather than repeating a mixture problem.
All graph windows are symmetric and labeled. Question 6 supplies its source
graph; it does not require the student to reconstruct the given polyline.

Rebuild the HTML from the committed sources:

```powershell
python scripts\build-practice-workflow-trial-2026-11-22.py
```

The builder reuses the earlier packet's typography, math embedding and grid
helpers without running that packet's authoring side effects. The original
grid's default output is unchanged; its optional horizontal extent supports
the approved -8 to 8 window.

All nine student pages and eight key pages were inspected as actual PDF images.
Existing export checks passed for math fonts, page counts and clipping. See the
review record for the formatting repairs and precise simulation limitations.
No subagents, new dependencies or broad application validation were used.

This folder contains no submitted handwriting, personal academic results or
personalized baseline history. It does not change the website's exam registry.

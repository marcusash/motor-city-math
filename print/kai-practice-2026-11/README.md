# Kai's November 2026 practice content

This folder preserves the authored work from the rational-functions, inverse-functions,
and mixed-refresher conversation. It is the cross-machine handoff; local chat artifacts
and Downloads are not required to use it.

## Start here

**Current student test:** [Mixed refresher with easier factoring](Kai_Mixed_Refresher_Quiz_2026-11-04_Easier_Factoring.pdf)
([editable HTML](Kai_Mixed_Refresher_Quiz_2026-11-04_Easier_Factoring.html)).

**Matching parent key:** [Worked solutions and scoring](Kai_Mixed_Refresher_Quiz_2026-11-04_Easier_Factoring_PARENT_KEY.pdf)
([HTML](Kai_Mixed_Refresher_Quiz_2026-11-04_Easier_Factoring_PARENT_KEY.html)).
Keep the key separate from the student copy.

Marcus's latest direction is **standard Precalculus, aiming for an A**, not honors math.
The November 4 date is the quiz's authoring date, not evidence of completion.
No completion, grade, dashboard entry, or school-certified rubric is implied.

## Preserved deliverables

| Version | Student copy | Parent key | Status |
|---|---|---|---|
| November 1 rational functions, five questions | [PDF](Kai_Rational_Functions_Practice_5_Problems.pdf) | No separate key created | Earlier individual-unit practice |
| November 1 inverse functions, five questions | [PDF](Kai_Inverse_Functions_Practice_5_Problems.pdf) | No separate key created | Earlier individual-unit practice |
| November 4 original mixed refresher | [PDF](Kai_Mixed_Refresher_Quiz_2026-11-04.pdf), [HTML](Kai_Mixed_Refresher_Quiz_2026-11-04.html) | [PDF](Kai_Mixed_Refresher_Quiz_2026-11-04_PARENT_KEY.pdf), [HTML](Kai_Mixed_Refresher_Quiz_2026-11-04_PARENT_KEY.html) | Superseded: harder numerator factoring |
| November 4 easier-factoring revision | Current links above | Current links above | Use this version |

The mixed quiz contains exactly three rational-function questions and two
inverse-function questions, with 20 points per question. Its six student pages
include a separate large graphing grid; the parent key has five pages.
Only question 1 and the parent-key guidance changed in the easier-factoring revision.

## Instructions for the next agent

- Use numbered questions without descriptive titles, multiple choice, or method hints.
- Preserve generous writing space and large coordinate grids.
- Vary structure and context, not just numbers or nouns; avoid rehearsing the same word problem.
- Require written interpretations with units and explanations, not just selected values.
- In inverse lookup questions, the queried number can occur as both an input and an output
  so forward and inverse lookup must be distinguished.
- Ask what both inverse compositions should equal before asking for algebraic verification.
  Do not print the expected answer on the student copy.
- Keep rational-function factoring manageable. The current numerator starts with a
  common factor and a straightforward positive-coefficient quadratic; the denominator
  is retained at the difficulty Marcus approved.
- Preserve a removable hole, vertical asymptote, and nonunit horizontal asymptote in
  the current first question. Its complete verified solution is in the matching key.
- Use a dedicated math typesetter for new work. The mixed PDFs use KaTeX 0.16.9 and
  Playwright; do not manually position fractions or radicals as separate text pieces.
- Verify every changed answer, domain restriction, graph feature, and both composition orders.
  Do not assume a simulation predicts Kai's grade.

## Rebuild the current version

The canonical editable generator is
[`scripts/build-kai-mixed-refresher.cjs`](../../scripts/build-kai-mixed-refresher.cjs).
It uses the repository's existing `shared/katex` assets and declared Playwright
dependency. HTML links are repository-relative and work after a checkout on another machine.
The PDFs are standalone and require no runtime dependencies.

From the repository root, with Node.js 18+ and dependencies installed:

```text
npx playwright install chromium
node scripts/build-kai-mixed-refresher.cjs
node --test tests/kai-practice-handoff.test.cjs
```

The builder defaults to Playwright Chromium on all supported platforms.
If using an installed Edge instead, set `MCM_PDF_BROWSER_CHANNEL=msedge`.
Use `--output-dir <directory>` for an isolated build and `--screenshots` for page proofs.
The builder checks KaTeX errors, font loading, page overflow, and radical spacing.
It does not copy anything to a machine's Downloads folder.

After deliberately rebuilding or changing distributed files, refresh the checksum inventory:

```text
node scripts/kai-practice-inventory.cjs --write
node --test tests/kai-practice-handoff.test.cjs
```

Do not refresh checksums merely to hide an unexplained file change.

## Legacy sources and evaluation provenance

`sources/` preserves all three original ReportLab Python generators. They retain the
original content and arithmetic checks, but are archival, Windows-oriented tools
using ReportLab and pypdfium2. Their manual math layout is superseded for mixed quizzes.
Do not run their `--publish` mode as part of a build; it writes to Windows Downloads.
The old mixed generator produces the harder original, not the current revision.

[`evidence/original-honors-simulation.json`](evidence/original-honors-simulation.json)
is the unchanged record of the earlier, explicitly requested Opus 5.5 honors-student
simulation. That persona and verdict apply to the earlier draft only. Marcus later
clarified that Kai is in standard Precalculus; the current revision was not rerun
through an honors simulator. The simulation is qualitative, not a school rubric.

## Privacy and distribution

The source reviews were scans dated November 1, 2026. Raw school PDFs, rendered scans,
handwriting, school identifiers, chat transcripts, local paths, installed dependencies,
and redundant screenshots are intentionally not published in this public repository.
This handoff preserves our authored content, not reproductions of school worksheets.
If future agents need the original scans, Marcus must provide them through an appropriate
private channel; do not infer missing marks or scores.

`inventory.json` lists the distributed files and SHA-256 hashes. Existing published
chat snapshots remain historical copies; use this folder's current-version links.

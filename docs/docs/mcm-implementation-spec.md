# MCM Design Refresh — Implementation Spec

> **Author:** Agent FD (Design Director)
> **Reviewed by:** FA (Chief Architect), Mash (CEO/CPO)
> **Date:** 2026-02-19
> **Status:** APPROVED — ready for implementation
> **Process:** FD specs → GA builds → GF validates → FA spot-checks

---

GA IMPLEMENTATION SPEC — MCM Design Refresh

From Agent FD (Design Director). FA reviewed and approved this direction.
Mash walked through all 14 findings and approved. FA set the build order.

PROCESS: FD specs, GA builds, GF validates. You build all 14 items. CC FA on your commits so he can spot-check.

CRITICAL DESIGN CONSTRAINT: Kai has ADHD. Every decision: fewer choices, less visual noise, one action at a time, positive framing. If in doubt, simplify.

CURRENT FILES (5 total):
  index.html — Active (dashboard)
  exam.html — Active (dynamic exam loader)
  final_exam_251123.html — Archive
  final_exam_251123_mini.html — Archive
  nonlinear_exam_mvp.html — Archive

=== BUILD ORDER (per FA) ===

PHASE 1: CRITICAL BUGS
-----------------------

TASK 1: Fix exam.html error state
FILE: exam.html
WHAT: When loaded without ?file= param, show a friendly test picker instead of broken loading state.
HOW: Detect missing/invalid file param. Instead of showing "Loading...", render a card with:
  - Title: "Pick Your Challenge 🏀"
  - List available exam JSON files as clickable cards with the jersey stripe
  - Link back to dashboard
DONE WHEN: exam.html with no params shows a friendly picker. No "Loading..." text. No console errors.

TASK 2: Fix Times New Roman leak
FILE: shared/styles.css
WHAT: KaTeX's serif fallback (KaTeX_Main, "Times New Roman", serif) bleeds into parent elements. Every page shows Times New Roman as a computed font.
HOW: Add targeted rule:
  .katex, .katex * { font-family: KaTeX_Main, KaTeX_Math, "Times New Roman", serif; }
  .katex-display + *, .katex-html ~ * { font-family: inherit; }
  Or simpler: ensure all non-KaTeX containers explicitly set font-family: var(--font-body) where --font-body: 'Helvetica Neue', Helvetica, Arial, sans-serif.
DONE WHEN: Run Playwright, extract computedStyle.fontFamily on body, h1, h2, p, label, button, input elements. None contain "Times New Roman". KaTeX math elements still render correctly.

PHASE 2: BUTTON + DASHBOARD
-----------------------------

TASK 3: Button hierarchy
FILE: shared/styles.css, index.html, exam.html
WHAT: Define 3 button tiers. Currently multiple colors compete.
HOW: Define in shared/styles.css:
  .btn-primary { background: var(--accent-red); color: var(--text-inverse); } — THE one action per screen
  .btn-secondary { background: transparent; border: 2px solid var(--accent-navy); color: var(--accent-navy); } — alternatives
  .btn-ghost { background: none; border: none; color: var(--text-secondary); text-decoration: underline; } — navigation/back
  Apply to index.html and exam.html. ONE red button per screen maximum.
DONE WHEN: Every button on index.html and exam.html uses one of the 3 tiers. No other button colors exist. Visual: the primary action is immediately obvious.

TASK 4: Dashboard progressive disclosure
FILE: index.html
WHAT: index.html shows 7+ sections at once. Redesign above-the-fold to show ONE primary action.
HOW:
  Above the fold (always visible):
    - Jersey stripe header
    - "Up Next 🏀" — the ONE test Mash/system recommends
    - Current streak or latest score (small, secondary)
    - One primary button: "Start" (red)
  Below the fold (expandable/collapsible):
    - "Your Stats 📊" (collapsed by default) — score history
    - "Study Guide 📚" (collapsed) — standards breakdown + what to study
    - "All Tests 🏆" (collapsed) — test list
    - "Send to Dad 📱" (collapsed) — score sharing
  Use details/summary HTML elements for collapse — zero JS needed, accessible by default.
DONE WHEN: index.html above-the-fold shows one clear action. Other sections are collapsed. Expanding/collapsing works. ADHD test: a 15-year-old should know what to do within 3 seconds.

PHASE 3: ARENA + TYPE SCALE + HEADER
--------------------------------------

TASK 5: Arena Mode localStorage persistence
FILES: shared/scripts.js (or new shared/theme.js), all 5 HTML files
WHAT: Arena Mode choice persists across all pages. Currently resets per page.
HOW:
  In <head> of every HTML file (BEFORE any CSS renders — blocking script):
    <script>
      if (localStorage.getItem('arena-mode') === 'true') document.body.classList.add('arena-mode');
    </script>
  In the toggle handler (shared/scripts.js):
    localStorage.setItem('arena-mode', document.body.classList.contains('arena-mode'));
  Add aria-label="Toggle dark mode" to the toggle button.
DONE WHEN: Toggle Arena Mode on index.html. Navigate to exam.html. Page loads in Arena Mode. Toggle off. Navigate back. Light mode. No flash-of-wrong-theme.

TASK 6: Type scale tokens
FILE: shared/styles.css
WHAT: Lock typography to 6 sizes. Currently 22+ unique sizes.
HOW: Add to :root:
  --text-xs: 0.75rem;    /* 12px — captions, labels */
  --text-sm: 0.875rem;   /* 14px — secondary text */
  --text-base: 1rem;     /* 16px — body, questions */
  --text-lg: 1.25rem;    /* 20px — section headers */
  --text-xl: 1.75rem;    /* 28px — page subtitles */
  --text-2xl: 2.5rem;    /* 40px — page titles */
  Audit every font-size declaration in shared/styles.css. Map each to the nearest token. Replace px/em values with var(--text-*).
DONE WHEN: grep shared/styles.css for font-size — every value is a var(--text-*) token. No raw px values except in KaTeX (which we don't control).

TASK 7: Consistent header on 2 active pages
FILES: index.html, exam.html
WHAT: Same header structure on both active pages.
HOW: Both files use the same HTML:
  <header>
    <a href="index.html" class="btn-ghost" aria-label="Back to dashboard">←</a>
    <h1>Motor City Math</h1>
    <div class="header-right">[timer if applicable, arena toggle]</div>
  </header>
  <div class="jersey-stripe"></div>
  index.html: no back arrow (it IS the dashboard). exam.html: back arrow visible.
  Per FA: duplicate the HTML, don't inject with JS. 2 files doesn't justify a component.
DONE WHEN: Both pages have visually identical headers. Back arrow on exam, not on index. Jersey stripe below both.

TASK 8: Archive mode for 3 legacy tests
FILES: shared/styles.css, final_exam_251123.html, final_exam_251123_mini.html, nonlinear_exam_mvp.html
WHAT: Mark completed tests as read-only with a banner.
HOW:
  Add to each file: <body class="archived" data-completed="2025-11-23" data-score="X/Y">
  Add to shared/styles.css:
    body.archived input, body.archived select, body.archived textarea { pointer-events: none; opacity: 0.85; }
    body.archived .submit-btn, body.archived .answer-key-btn { display: none; }
    body.archived::before { content: "Completed " attr(data-completed) " · Score: " attr(data-score); display: block; text-align: center; padding: 8px; background: var(--bg-highlight); color: var(--text-secondary); font-size: var(--text-sm); }
  Arena toggle still works on archive pages.
DONE WHEN: 3 legacy pages show "Completed [date] · Score: X/Y" banner. Inputs are non-interactive. Submit buttons hidden. Arena Mode toggle still works.

PHASE 4: POLISH
----------------

TASK 9: Blue borders on unanswered questions
FILE: shared/styles.css
WHAT: Question cards currently use red left borders before grading. Red = "wrong" to a student.
HOW: Default question card border: border-left: 4px solid var(--accent-blue).
  After grading: .question-card.correct { border-left-color: var(--color-correct); }
  After grading: .question-card.incorrect { border-left-color: var(--color-incorrect); }
DONE WHEN: Load any exam. Before answering: all question borders are blue. After grading: correct = green, incorrect = red.

TASK 10: Warm section headers
FILES: index.html (primarily), shared/styles.css
WHAT: Replace ALL CAPS institutional headers with title case + emoji.
HOW: In HTML, change text content:
  "SCORE HISTORY" → "Your Stats 📊"
  "STANDARDS BREAKDOWN" → "Your Game Plan 🎯"
  "WHAT TO STUDY NEXT" → "Up Next 📚"
  "ALL TESTS" → "All Tests 🏆"
  "RETAKE PRACTICE" → "Run It Back 🔄"
  In CSS: remove text-transform: uppercase and letter-spacing from section headers.
DONE WHEN: No ALL CAPS section headers. Each header has an emoji. Copy feels like a coach, not a test form.

TASK 11: Coach voice empty states
FILE: index.html
WHAT: Replace developer placeholder strings with encouraging coach copy.
HOW:
  "No scores yet. Take your first test." → "Let's get your first score on the board. 🏀"
  "No standard data yet. Complete a test to see your breakdown." → "Take a test and we'll break down your game. 📊"
  "Ask Dad for your next test." → "Your highlights reel starts with test #1. 💪"
DONE WHEN: No empty state reads like a developer string. Every empty state passes the "coach test" — would a great coach say this?

TASK 12: Curriculum-based test titles
WHAT: Future tests generated by exam.html should title as curriculum content.
HOW: When exam.html generates a test title, use format: "[Unit]: [Topic] — [Standards]"
  Example: "Unit 2: Nonlinear Functions — W2 & W3"
  NOT: "Motor City Math — Nonlinear Functions Test"
  The <title> tag and <h1> should both use curriculum format.
DONE WHEN: exam.html with a valid ?file= param shows curriculum-based title in both <title> and <h1>.

TASK 13: Print — expanded writing space
FILES: shared/print.css
WHAT: Paper tests need more room for handwriting than screen tests.
HOW:
  @media print:
    input[type="text"], textarea { min-height: 3em; border-bottom: 1px solid #ccc; }
    .question-card { margin-bottom: 2em; }
    .btn-primary, .btn-secondary, .btn-ghost, .arena-toggle { display: none; }
    .answer-key-btn { display: none; }
    Score displays, timer: display: none
  Ensure enough blank space after each question for handwriting (2-3x the online input height).
DONE WHEN: Print preview shows clean questions with generous writing space. No buttons, no toggle, no timer. Just questions and answer areas.

TASK 14: Print — page break control
FILE: shared/print.css
WHAT: Optimize for double-sided printing (user still selects duplex in printer settings).
HOW:
  .question-card { break-inside: avoid; }
  h1, h2 { break-after: avoid; }
  Add page numbers: @page { @bottom-center { content: counter(page); } }
  Set margins: @page { margin: 2cm; }
DONE WHEN: Print preview shows no questions split across pages. Page numbers appear. Margins are comfortable for hole-punching.

=== SUMMARY ===

14 tasks. 5 files. 4 phases. FA says this is one sprint — don't overthink it.

Phase 1 (Critical): Tasks 1-2
Phase 2 (High): Tasks 3-4
Phase 3 (High): Tasks 5-8
Phase 4 (Polish): Tasks 9-14

CC Agent FA on every commit. When done, notify GF to run the design QA validation suite.

— Agent FD

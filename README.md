# Motor City Math 🏀

Adaptive Algebra II study tool built by a dad for his son. Detroit Pistons energy. ADHD-friendly design. Static HTML — no server, no install, no login.

**Result:** Kai raised his grade to an A.

---

## What Is This?

The dashboard follows Kai from sophomore-year Algebra II into junior-year Pre-Calculus. The current Fall 2026 section opens first with a printable Functions prep test. Spring 2026 and Winter 2025-26 retain their separate Algebra II charts and test lists behind collapsible trimester headings.

Test 1 Study Guide is a separate reference evaluation of the original seven handwritten Assessment 1 Concept Review pages. It shows original-page evidence, answer transcriptions, worked solutions, and instructor-assigned points totaling 100. Its 84/100 score is provisional, not a teacher grade or timed-test result.

Scorecards and assessment HTML pages use a top-of-page `Back to Dashboard` link with a left arrow. Nested pages link to the root dashboard, and assessment navigation is hidden when printing.

The [Prep Test 2 question proposal](reviews/prep-test-2-proposal.html) is a parent review companion: 10 questions, 100 points, and 70 minutes of work plus 5 minutes to check. Two polynomial sketch questions cover degrees 4 and 5 (22 points, 16 minutes), balanced with piecewise, transformation, algebraic composition, graph-reading, domain, applied cost-model, and square-root construction questions. It includes plain-language purposes, worked answers, and partial-credit rubrics, separate from the student copy.

The reviewed set is now built as a [printable Prep Test 2](tests/assessment-2-functions-75min.pdf), with [student HTML](tests/assessment-2-functions-75min.html) and a separate [parent key PDF](tests/assessment-2-functions-75min-KEY.pdf) / [key HTML](tests/assessment-2-functions-75min-KEY.html). The student copy follows the previous test's format and keeps answers separate. It includes six dedicated large drawing pages with centered axes; numerical grids use matching symmetric ranges and square cells. Question 3 adds reflected/scaled compositions with fractional coordinates; Question 4 solves a composite equation from graphs; Question 5 compares algebraic compositions; Question 9 adds a challenging word problem; Question 10 restores square-root graph construction. Question 2 remains simple and Question 6 is retained. Regenerate the HTML with `node scripts/build-prep-test-2.cjs`; the source proposal remains the editable question source. No dashboard entry or score is added by this build.

12 practice tests covering 5 Algebra II units with ~200 questions. Each test is a standalone HTML file — open it in a browser and start studying. Standards-aligned to Seattle Academy (SAAS) curriculum.

### Units Covered

| Unit | Topics | Tests |
|------|--------|-------|
| Exponents | Simplification, scientific notation, radicals, complex numbers | 4 tests + exam |
| Linear Functions | Composition, sequences, graphing, inverses, regression | 2 practice + exam |
| Exponential Functions | Growth/decay, linear vs exponential comparison | 2 quizzes |
| Non-Linear Functions | Quadratics, absolute value, square root, piecewise | 1 test |
| Inverse Functions | Finding, verifying, graphing inverses | 1 quiz |

## Quick Start

```bash
# Verify all exams are healthy
node scripts/gp-exam-health.js

# Run all GP quality tests
npm run test:gp

# Run full verification
npm run audit:all
```

1. Download the zip file
2. Unzip to a folder
3. Open any `.html` file in your browser
4. Work the problems, check your answers

No internet required. No install. Works on laptop, phone, or tablet.

### Features

- **11 retake practice exams** — 165 questions, auto-graded, ADHD-optimized
- **Answer key** on every test (toggle on/off)
- **Interactive graphing** — Canvas-based with key_points verification
- **3-layer hint system** — nudge → worked example → full solution
- **Auto-grading** with instant feedback (max 12 words, ADHD rule)
- **Save/load progress** via localStorage
- **Print-ready** — `Ctrl+P` produces clean paper tests
- **Math rendering** with MathJax
- **Dad Dashboard** — Marcus can view Kai's scores via `?dad=1`
- **Progress autosave** — survives browser refresh via sessionStorage

## URL Query Params

| Param | File | Values | Description |
|-------|------|--------|-------------|
| `file` | exam.html | `retake-practice-{N}` | Loads exam JSON from `data/` |
| `dad` | index.html | `1` | Activates Dad Mode banner |

Example: `exam.html?file=retake-practice-6`

## localStorage Key

Active MCM key: **`mcm_scores`** (shared across all exams, structured by exam ID).

Format: `{ "mcm-{exam-id}": { score, outOf, pct, grade, timestamp, locked } }`

All active exam files (`exam.html`, `index.html`, `final_exam_251123.html`, `nonlinear_exam_mvp.html`) use the same key. Each exam writes to its own sub-key to avoid collisions. See `docs/data-model.md` for the full schema.

## Project Structure

```
kai-algebra2-tests/
├── index.html                  ← Dashboard (Kai's study hub)
├── exam.html                   ← Retake exam renderer
├── shared/                     ← Shared CSS, JS, chart theme, print styles
├── data/
│   ├── retake-practice-1..11.json  ← 11 retake exams (165 questions)
│   ├── questions.json          ← Legacy question bank (~327 questions)
│   ├── manifest.json           ← Exam registry
│   └── _backups/               ← Dated backups of RP JSON files
├── tests/                      ← 60+ quality assurance tests
├── scripts/                    ← Platform tooling (GP-owned)
├── docs/                       ← Architecture, data model, agent docs
├── .github/workflows/          ← CI/CD (publish + data validation)
└── .*.md                       ← Agent collaboration docs
```

## Design Language

Detroit Pistons palette — `#C8102E` red, `#1D42BA` blue, `#002D62` navy, `#BEC0C2` chrome. Bold, confident, physical. See `.design-system.md` for the full spec.

## For the Agent Team

This project has a local Grind team and seven available Forge specialist identities.
The `.agents.md` registry describes the Grind roles. Forge profiles and session setup
are maintained in `.github/agents/` and `.github/forge-agent-os/`.

This repository is the active development project and the source for its GitHub Pages
site. Make changes here through feature branches and pull requests; it is not a
publish-only mirror.

To start using a Forge identity, create or restart a Copilot project session for this
repository and select the identity in the agent picker. See
`.github/forge-agent-os/START-HERE.md` for setup and verification.

For project context and local team conventions, read these files in order:

1. `.agent-onboarding.md` — Start here
2. `.agents.md` — File ownership and roles
3. `.agent-protocol.md` — Communication rules
4. `.agent-status.md` — Live status board
5. `.design-system.md` — Visual design system
6. `.voice-guide.md` — Copy/tone guidelines
7. `.project-review.md` — Current state inventory

**Rules:** One owner per file. Update status after every task. Math accuracy is non-negotiable. One file at a time during migration.

### Agents

| ID | Role | Focus |
|----|------|-------|
| GA | App Engineer | exam.html, index.html, shared components |
| GD | Design Engineer | UI/UX, CSS, Pistons palette |
| GF | QA Engineer | Playwright tests, regression suites |
| GI | Data Engineer | question bank, standards mapping |
| GP | Platform Engineer | CI/CD, test infrastructure, quality gates |
| GR | Research Specialist | math verification, question accuracy |

### Key Metrics

Current baseline: **3008/3008** exam checks, **11/11** health gates.  
Stats: [`docs/gp-project-stats.md`](docs/gp-project-stats.md)

### Test Files

| Test | Command | Baseline |
|------|---------|---------|
| Practice exam verification | `node tests/verify-practice-exams.js` | 3008/3008 |
| Cross-exam answer dedup | `node tests/cross-exam-verify.js` | 0 hard failures |
| localStorage schema | `node tests/f-validation/localstorage-schema-guard.test.js` | 62/62 |
| Exam grading unit | `node tests/f-validation/exam-grading-unit.test.js` | 33/33 |
| Hint + scorecard | `node tests/f-validation/exam-hint-scorecard.test.js` | 125/125 |
| Save/load audit | `node tests/f-validation/save-load-audit.test.js` | 4/4 |

See `docs/testing.md` for the full guide.

---

*Built with 💪 by Dad. Motor City Math.*

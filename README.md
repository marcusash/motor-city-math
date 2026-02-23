# Motor City Math 🏀

Adaptive Algebra II study tool built by a dad for his son. Detroit Pistons energy. ADHD-friendly design. Static HTML — no server, no install, no login.

**Result:** Kai raised his grade to an A.

---

## What Is This?

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

This project uses a 6-agent collaboration model. Read these files in order:

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

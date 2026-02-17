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

## How to Use

1. Download the zip file
2. Unzip to a folder
3. Open any `.html` file in your browser
4. Work the problems, check your answers

No internet required. No install. Works on laptop, phone, or tablet.

### Features

- **Answer key** on every test (toggle on/off)
- **Print-ready** — `Ctrl+P` produces clean paper tests
- **Auto-grading** on select tests (instant score + feedback)
- **Save/load progress** via localStorage (7/12 tests)
- **Interactive charts** with Chart.js (7/12 tests)
- **Math rendering** with KaTeX/MathJax (4/12 tests)

## Project Structure

```
motor-city-math/
├── index.html                  ← Dashboard (coming soon)
├── shared/                     ← Shared CSS, JS, chart theme, print styles
├── tests/                      ← Tests organized by unit
│   ├── unit1-exponents/
│   ├── unit2-linear-functions/
│   ├── unit3-exponential/
│   └── unit4-nonlinear/
├── data/                       ← Question bank JSON (coming soon)
├── docs/                       ← Agent infrastructure docs
├── *.html                      ← Current test files (pre-migration)
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

---

*Built with 💪 by Dad. Motor City Math.*

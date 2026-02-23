# Agent Index — Motor City Math

One-line summary of all 12 agents across the Forge/Grind structure.

## Grind Agents (Motor City Math project)

| ID | Title | Focus |
|----|-------|-------|
| GA | App Engineer | Full-stack builder: exam.html, index.html, shared components, dashboard |
| GD | Design Engineer | UI/UX implementation, Pistons palette enforcement, design QA |
| GF | QA Engineer | Playwright test suites, regression testing, cross-browser validation |
| GI | Data Engineer | Question bank structure, standards mapping, analytics |
| GP | Platform Engineer | Build tooling, CI/CD, quality gates, test infrastructure, pre-commit hooks |
| GR | Research Specialist | Math verification, question accuracy, curriculum alignment |

## Forge Agents (Shared leadership/advisory)

| ID | Title | Focus |
|----|-------|-------|
| FA | Chief Architect | Architecture review, code quality, hardest problems |
| FD | Design Director | Design system v2.0, brand language, UX standards |
| FF | Quality Lead | QA strategy, design QA, test coverage |
| FI | Data Lead | M365 integration, data pipelines, identity |
| FP | Security + Ops | Infrastructure, agent comms, session management, coaching |
| FR | Research Lead | Prompt engineering, evals, mentoring GR |

## File Ownership Summary

See `.agents.md` for the full ownership table. Quick reference:

| File Pattern | Owner |
|-------------|-------|
| `exam.html`, `index.html` | GA |
| `shared/*.css`, `shared/*.js` | GA/GD |
| `data/retake-practice-*.json` | GR (content), GP (verify) |
| `tests/gp-*.test.js`, `scripts/gp-*.js` | GP |
| `tests/f-validation/*.js` | GF |
| `.design-system.md`, `.voice-guide.md` | FD |
| `.agent-status.md` | All (own section) |

---

*Owner: GP (index) | Primary: .agents.md | Last updated: 2026-02-23*

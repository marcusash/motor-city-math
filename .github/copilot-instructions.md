# Copilot Instructions — Motor City Math

> This file is read by the GitHub Copilot Coding Agent before every task in this repo.
> Keep it accurate and current. Owner: GA (Grind Lead Architect).

## What This Project Is

Motor City Math is an adaptive algebra learning tool built for Kai, a high school student.
Focus: Algebra 2. Goal: mastery-based practice, immediate feedback, visual explanations.

## Who Uses It

- **Kai** — the student. High school Algebra 2. Needs clear steps, not just answers.
- **Marcus** — the parent/owner. Reviews content and outcomes. Approves what ships.

## Tech Stack

- Language: TypeScript
- Tests: Jest
- CI: GitHub Actions
- Dev repo: marcusash_microsoft/kai-algebra2-tests (this repo)
- Publish repo: marcusash/motor-city-math (GitHub Pages — personal account)
- Do not push directly to the personal publish repo. Changes go here first.

## Agent Output Rules (Mandatory for all Forge + Grind agents)

- **Em dash ban.** Never use em dashes (— or –) in any output. Use colons, commas, or periods.
- **Fully qualified paths. ALWAYS.** Every file path must be a full absolute Windows path (e.g., `C:\Github\kai-algebra2-tests\data\kai-scores-latest.json`). Never use relative paths. No exceptions.
- **Response lint gate. MANDATORY before every reply to Marcus.** Before finalizing any console response, run: `node C:\Github\journal\scripts\response-lint.cjs --text "your draft response text"`. Fix every violation and re-run until PASS. Do not post without a PASS.

## Code Standards

- All new features must include unit tests. Tests live in /tests.
- TypeScript strict mode. No implicit any.
- Math expressions: use LaTeX notation in comments and content strings (e.g. \^2 + 2x + 1\$).
- No hardcoded secrets.

## Repository Structure

\\\
data/          -- Question banks, answer keys, curriculum maps
docs/          -- Architecture, content plan, data schema
scripts/       -- Build and utility scripts
tests/         -- Unit tests
shared/        -- Shared types and utilities
artifacts/     -- Generated outputs
.squad/        -- Squad config (do not modify unless GP or FO)
\\\

## What a Complete PR Looks Like

1. All exit criteria in the linked issue are met
2. Unit tests written and passing
3. No TypeScript errors
4. README.md updated if new feature added
5. No out-of-scope file changes

## Never Do These Things

- Do not modify .squad/team.md
- Do not push to marcusash/motor-city-math directly
- Do not add questions without difficulty level (1=intro, 2=standard, 3=advanced)
- Do not commit package-lock.json unless dependencies changed

## Math Content Standards

- All math must be correct. Double-check formulas.
- Algebra 2 scope: polynomials, rational functions, exponentials, logarithms, sequences, series, intro stats.
- Every question needs: stem, correct answer, 3 distractors, explanation of the correct answer.
- Step-by-step solutions required for any procedural question.

## Key Docs

- Architecture: docs/ARCHITECTURE.md
- Curriculum map: docs/curriculum-map.md
- Data schema: docs/data-schema.md
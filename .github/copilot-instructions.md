# Copilot Instructions — Motor City Math

> This file is read by the GitHub Copilot Coding Agent before every task in this repo.
> Keep it accurate and current.

## Agent OS

This repository is a standalone Forge-enabled project. Its seven Forge profiles,
boot skill, identity knowledge, and skills are installed in `.github/agents/`,
`.github/skills/forge-boot/`, and `.github/forge-agent-os/`. Do not require a
separate Forge checkout to use these identities.

- **Start here:** `.github/forge-agent-os/START-HERE.md`
- **Preflight:** `node .github/forge-agent-os/verify.mjs preflight`
- **Identity and skills:** use the selected profile and its bundled capability
  files under `.github/forge-agent-os/capabilities/`.
- **Lessons:** `.github/forge-agent-os/capabilities/shared/LESSONS.md`

Create or restart a Copilot project session after the bundle is present on the
default branch, then select the desired Forge identity in the agent picker.

## What This Project Is

Motor City Math is an adaptive algebra learning tool built for Kai, a high school student.
Focus: Algebra 2. Goal: mastery-based practice, immediate feedback, visual explanations.

## Who Uses It

- **Kai** — the student. High school Algebra 2. Needs clear steps, not just answers.
- **Marcus** — the parent/owner. Reviews content and outcomes. Approves what ships.

## Tech Stack

- Application: static HTML, CSS, and JavaScript
- Tooling: Node.js scripts and tests (Node.js 18 or newer)
- CI: GitHub Actions
- Project repository: `marcusash/motor-city-math`
- This repository is both the active development project and the source for its
  GitHub Pages site. Make code, documentation, tests, and Forge configuration changes
  here; do not treat this repository as a publish-only mirror or redirect development
  to a separate repository.
- Use feature branches and pull requests into `master`. Do not push directly to
  `master` or bypass review.

## Agent Output Rules (Mandatory for all Forge + Grind agents)

- Use repository-relative paths for files in this project. Use absolute paths only
  when referring to external local files.
- Prefer plain punctuation in prose. Preserve canonical labels and exact source text
  when needed.
- Do not depend on machine-specific response lint scripts. Run a configured,
  repository-provided lint check when one exists.

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
- Do not push directly to `master` or bypass the pull request workflow
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
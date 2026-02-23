# Motor City Math — Agent Index

**Last updated:** 2026-02-23

A quick reference for all active agents and their responsibilities.

---

## Grind Agents

| ID | Name | Role | Key Files |
|----|------|------|-----------|
| GA | grind-app | Full-stack exam renderer, dashboard, shared components | index.html, exam.html, shared/ |
| GD | grind-design | UI/UX implementation, visual design, ADHD design QA | nonlinear_exam_mvp.html, CSS components |
| GF | grind-fun | QA engineer, Playwright tests, regression suites | tests/ |
| GI | grind-id | Data engineer, question bank, standards mapping | data/questions.json, data/manifest.json |
| GP | grind-plat | Platform: CI/CD, scripts, repo hygiene, agent coordination | scripts/, .github/, docs/ |
| GR | grind-research | Math verification, question accuracy, answer keys | data/retake-practice-*.json |

## Forge Agents (Leadership)

| ID | Name | Role |
|----|------|------|
| FA | forge-app | Chief Architect, hardest problems, code review |
| FD | forge-design | Design Director, design system, voice guide |
| FF | forge-fun | Quality Lead, QA standards, test coverage |
| FI | forge-id | Data Lead, M365 integration, identity |
| FP | forge-plat | Security and Ops, agent comms, coaching |
| FR | forge-research | Research Lead, prompt engineering, evals |

## Communication

- GP inbox: `.agent-comms/grind/inbox-GP/`
- To message GP: write JSON to that directory and commit
- Required fields: id, from, to, project, type, subject, body, created, status

## File Ownership Rules

- Do NOT edit files owned by another agent without posting a cross-agent request first
- Check `.agents.md` for the authoritative ownership table
- Pre-commit hook will warn if critical shared files are staged for deletion

# Motor City Math — CHANGELOG

Tracks significant changes by sprint. Most recent first.

---

## 2026-02-23 — GP 1-Hour Autonomous Sprint

**GP (grind-platform)**

- Fixed RP5 Q4 collision (4^(x-3)=8^(x-5), x=9) and Q13 key_point (-1.75)
- Added 93 missing fields across all 10 RP exams (feedback_correct, feedback_wrong, version, solution_steps padding)
- ADHD compliance: trimmed 34 feedback_wrong strings to 12-word limit
- Pre-commit hook created with 5 quality checks (polyfill.io, HTML structure, JSON parse, feedback_correct, answer dedup)
- 5 new GP tests: field-completeness, answer-uniqueness, solution-steps, feedback-length, manifest-integrity
- 3 new utility scripts: gp-exam-health.js, gp-missing-fields.js, gp-word-count.js
- npm scripts added: verify, verify:cross, audit:all, test:gp
- Self-audit doc: gp-self-audit-sprint-gap.md
- Docs: data-model.md, gp-tools-index.md, gp-field-audit-report.json
- All 10 exams: 3008/3008 verify, 8/8 health checks

## 2026-02-22 — Retake Sprint Complete

**GP, GR, GF, GD, GI**

- All 10 retake practice exams verified (3008/3008)
- GR delivered RP1-RP10 answer keys
- GF shipped schema-guard-all-rp.test.js (1774/1774)
- GD completed Sprint 6 (content audits, autosave toast, template audit)
- GI completed all 25 learning plan tasks

## 2026-02-21 — Agent Comms System

**GP, FA, FP**

- .agent-comms/ directory system deployed
- Inbox directories for all 12 agents
- JSON message schema defined
- Protocol documented in .agent-protocol.md §12

## 2026-02-19 — MVP Nonlinear Exam

**GA, GR, GD, GF**

- nonlinear_exam_mvp.html shipped (15 questions, canvas graphing)
- GR verified all 15 answers computationally
- GD visual QA pass
- GF 208 tests passing

## 2026-02-18 — Security + Shared Engine

**GP, GA**

- polyfill.io removed from all 5 affected files (B-F4 closed)
- shared/scripts.js and shared/styles.css created
- Pre-commit hook initial version (HTML structure check)
- Forge-watch.ps1 watchdog created

## 2026-02-17 — Foundation

**FD (Design Agent)**

- Design system v2.0 shipped (.design-system.md)
- Voice guide shipped (.voice-guide.md)
- Agent onboarding master doc (.agent-onboarding.md)
- Pistons palette defined: #C8102E, #1D42BA, #002D62

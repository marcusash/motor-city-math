# Motor City Math — Agent Communication Protocol

**Owner:** GP (grind-platform)
**Compatible with:** Inkwell `.agent-comms/` system (reviewed by FP)

---

## Overview

File-based message queue for agent-to-agent communication. Each agent has an inbox folder. Messages are JSON files with a defined schema. Agents check their inbox after every task.

This system supports **cross-project messaging** between Forge (leadership) and Grind (project) agents.

---

## Organization Structure

| Org | Prefix | Role | Agents |
|-----|--------|------|--------|
| **Forge** | `F` | Leadership team. Reviews, mentors, architects, tackles hardest problems across all Marcus projects. | FA, FD, FF, FP, FR, ID |
| **Grind** | `G` | Learning tools org. MCM is the first project. Dedicated builders. | GA, GD, GF, GI, GP, GR, GS |

Forge agents always have inboxes in every project. Grind agents have inboxes in Grind project repos only.

---

## Directory Structure

```
.agent-comms/
├── README.md                     ← this file
├── forge/                        ← Forge leadership inboxes (always present)
│   ├── inbox-FA/                 ← Chief Architect (forge-application)
│   ├── inbox-FD/                 ← Design Director (forge-design)
│   ├── inbox-FF/                 ← Quality Lead (forge-fundamentals)
│   ├── inbox-FP/                 ← Security & Ops Lead (forge-platform)
│   ├── inbox-FR/                 ← Research Lead (forge-research)
│   └── inbox-ID/                 ← Data & Identification Lead (forge-data)
├── grind/                        ← Grind org agent inboxes
│   ├── inbox-GA/                 ← Application Engineer (grind-application)
│   ├── inbox-GD/                 ← Design Agent (grind-design)
│   ├── inbox-GF/                 ← QA/Testing Agent (grind-fundamentals)
│   ├── inbox-GI/                 ← Import Pipeline Agent (grind-importer)
│   ├── inbox-GP/                 ← Platform Agent (grind-platform)
│   ├── inbox-GR/                 ← Research/Math Agent (grind-research)
│   └── inbox-GS/                 ← Security Agent (grind-security)
└── outbox/                       ← Processed messages (moved here after handling)
```

---

## Agent Roster

### Forge Leadership (float across all projects)

| ID | Full Name | Role |
|----|-----------|------|
| FA | forge-application | Chief Architect — architecture decisions, code patterns, cross-app reviews |
| FD | forge-design | Design Director — design system, brand language, UX reviews |
| FF | forge-fundamentals | Quality Lead — test strategy, coverage standards, CI/CD patterns |
| FP | forge-platform | Security & Ops Lead — infrastructure, agent comms, repo ops |
| FR | forge-research | Research Lead — voice/tone optimization, AI models, prompt engineering |
| ID | forge-data | Data & Identification Lead — data pipelines, M365, identity mining |

### Grind Project Agents (MCM)

| ID | Full Name | Role |
|----|-----------|------|
| GA | grind-application | Application Engineer — hands-on builder, feature implementation |
| GD | grind-design | Design Agent — visual QA, design specs for MCM |
| GF | grind-fundamentals | QA/Testing — ~690 tests, grading validation, print/mobile QA |
| GI | grind-importer | Import Pipeline — PDF/OCR, content conversion |
| GP | grind-platform | Platform Agent — repo ops, coordination, commit proxy |
| GR | grind-research | Research/Math — question accuracy, curriculum, spaced repetition |
| GS | grind-security | Security — localStorage schema, data integrity, offline-first |

### ID Migration (old → new)

| Old | New | Notes |
|-----|-----|-------|
| A | GA | Application Engineer |
| A2 | FA | Was Staff Engineer — actually Forge Chief Architect working cross-project |
| D | GD | Design Agent |
| F | GF | Fundamentals/QA Agent |
| I | GI | Importer Agent |
| P | GP | Platform Agent |
| R | GR | Research/Math Agent |
| S | GS | Security Agent |

---

## Message Schema

Every message is a `.json` file placed in the recipient's inbox folder.

### Filename Format

`{YYYYMMDD}-{HHMM}-from-{sender}-{slug}.json`

**Examples:**
- `20260218-2030-from-GR-mvp-answers-verified.json`
- `20260218-2100-from-FA-canvas-arch-notes.json`
- `20260218-2200-from-GP-naming-convention-update.json`

### JSON Schema

```json
{
  "id": "msg-20260218-001",
  "from": "GR",
  "to": "GA",
  "project": "mcm",
  "type": "deliverable_ready",
  "priority": "high",
  "subject": "Q10 math verified — clear to build",
  "body": "All 15 MVP answers independently verified. Zero errors.\ndata/mvp-exam-hints.json ready.",
  "files": ["data/mvp-exam-hints.json"],
  "created": "2026-02-18T20:30:00Z",
  "status": "unread"
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique ID: `msg-YYYYMMDD-NNN` |
| `from` | string | yes | Sender agent ID (e.g., `GR`, `FA`) |
| `to` | string | yes | Recipient agent ID |
| `project` | string | no | Project context: `mcm`, `inkwell`, `dispatch`. Omit for same-project messages. |
| `type` | enum | yes | See Message Types below |
| `priority` | enum | yes | See Priority Levels below |
| `subject` | string | yes | Short description (≤80 chars) |
| `body` | string | yes | Full message. Can be multi-line. |
| `file` | string | no | Single deliverable path (Inkwell convention) |
| `files` | array | no | Multiple deliverable paths (preferred) |
| `created` | ISO-8601 | yes | Timestamp |
| `status` | enum | yes | `unread`, `read`, `actioned` |

**Note:** Both `file` (string) and `files` (array) are valid. Use `files` for new messages. Consumers check `files` first, fall back to `file`.

### Message Types

| Type | Meaning | Example |
|------|---------|---------|
| `deliverable_ready` | "I finished X, it's ready for you" | GR → GA: "Question bank updated" |
| `review_request` | "Please review this file" | GA → FA: "MVP exam ready for arch review" |
| `task_assignment` | "Here's a new task" | FA → GA: "Fix the duplicate body tag" |
| `blocker` | "I'm blocked, need your help" | GF → GA: "Can't test — shared/scripts.js syntax error" |
| `directive` | "Marcus says do this" | FP → GP: "New protocol rule for all agents" |
| `info` | General notification, no action required | GP → all: "New naming convention adopted" |

### Priority Levels

| Priority | Meaning |
|----------|---------|
| `critical` | Blocking other agents RIGHT NOW. Handle before current task. |
| `high` | Important, handle next (after current task). |
| `normal` | Standard priority, handle in order. |
| `low` | Nice-to-know, handle when you have time. |

---

## Workflow

### After EVERY completed task:

1. **Check your inbox:** look for `.json` files in `.agent-comms/{org}/inbox-{your-ID}/`
2. **Process unread messages** (highest priority first)
3. **Update your section** in `.agent-status.md`
4. **If your work unblocks another agent**, send them an inbox message

### Sending a Message

1. Create a `.json` file following the schema above
2. Place it in the recipient's inbox folder
3. Use the filename format: `{YYYYMMDD}-{HHMM}-from-{your-ID}-{slug}.json`
4. Commit the message (it's part of the repo)

### Processing a Message

1. Read the message and do what it asks
2. Move the `.json` file from your inbox to `.agent-comms/outbox/`
3. If the message needs a response, send one back to the sender

### Cross-Project Messages

**Grind → Forge:** Drop the message in `.agent-comms/forge/inbox-{ID}/` in this repo.

**Forge → Grind:** Commit the message to the MCM repo at `.agent-comms/grind/inbox-{ID}/`.

Set the `"project"` field to identify the context (e.g., `"mcm"`, `"inkwell"`).

---

## Rules

1. **Never delete messages** — move to `outbox/` after processing
2. **One message per file** — don't batch multiple requests
3. **Include file paths** when referencing deliverables
4. **Set priority honestly** — `critical` means someone is literally blocked on you
5. **Check inbox after EVERY task** — this is mandatory protocol (§12)

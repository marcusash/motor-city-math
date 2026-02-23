# GP Learning Notes — Kelsey Hightower Infrastructure Philosophy

**Why This Matters:** Kelsey represents the gold standard for turning platform work into reusable, trustable systems. The gap for GP is turning ad-hoc fixes into operating patterns.

---

## Core Principles (from talks and writing)

### 1. Make the Right Thing Easy
Infrastructure should make correct usage the path of least resistance.

**MCM application:**
- Pre-commit hook: wrong answer format fails loudly before it reaches the repo
- CI validate-data.yml: bad RP JSON can't land on master without a check
- npm run audit:all: one command surfaces all issues

### 2. Runbooks Are for Humans, Not Robots
Automation handles the happy path. Runbooks handle the exceptions.

**MCM application:**
- gp-incident-response.md: written for a human reading it at 2am when Kai can't load his exam
- gp-publish-spec.md: written for a human who needs to know exactly what "ready to publish" means

### 3. Know Your Blast Radius
Every change has a scope. Know what breaks if it goes wrong.

**MCM application:**
- GP never batch-refactors all 10 RP files in one commit
- Always run verify before and after data changes
- Backup before bulk operations (data/_backups/)

### 4. Boring Technology in Production
Prefer proven, simple tools over clever new ones.

**MCM application:**
- Node.js scripts over exotic tooling
- GitHub Actions (standard) over custom runners
- JSON over databases for question data

---

## Reading List

1. **Hightower's Kubernetes talk (KubeCon NA 2016)** — "Kubernetes the Hard Way" philosophy: understand every layer
2. **"The Configuration Problem"** — why good defaults matter more than flexibility
3. **KubeCon keynote 2018** — "Simple is Hard"

---

## Gap Statement

Kelsey's bar: systems that work without you present. GP is not there yet.  
Current state: GP's systems work WHEN GP is present.  
Target: CI, pre-commit hook, and health gate run every day with or without a session.

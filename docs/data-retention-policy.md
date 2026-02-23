# MCM Data Retention Policy

**Owner:** GI (Data Engineer)
**Last updated:** 2026-02-23
**Status:** Active

---

## What This Covers

This policy governs retention of `data/kai-scores-*.json` files in the Motor City Math repository. These files contain Kai's score history and are used by GI analytics scripts.

---

## Files In Scope

- `data/kai-scores-YYYY-MM-DD.json` — per-session exports written by exam.html when Kai clicks "Save Results"
- `data/kai-scores-latest.json` — symlink or copy of the most recent score file (written by exam.html)

**Not in scope:** `data/*.json` exam files (those are question content, never deleted).

---

## Retention Rules

### Rule 1: Keep all score files indefinitely (current policy)

Rationale: the score history is sparse. As of 2026-02-23 there are 3 score files covering 21 days. The total size is under 100KB. There is no storage pressure.

Deletion schedule: **none**. All kai-scores files are retained permanently.

### Rule 2: Never delete manually

Score files must not be deleted by any agent without Marcus's explicit approval. They are the only source of truth for Kai's learning trajectory. Deleting a score file is permanent data loss.

### Rule 3: kai-scores-latest.json is always overwritten, not appended

`kai-scores-latest.json` is a convenience copy. It always reflects the most recent export. Retaining it alongside dated files is intentional.

---

## When to Review This Policy

Review if:
1. Score files exceed 1MB total (unlikely before 50+ exam sessions)
2. Kai uses MCM on a device with very limited storage (mobile, Chromebook)
3. A score file is found to be corrupted and needs removal

In any of those cases, post a note in `.marcus-queue.md` before deleting anything.

---

## Analytics Scripts That Read Score Files

| Script | File pattern read | What it computes |
|---|---|---|
| `scripts/score-velocity.cjs` | `kai-scores-*.json` | Kai's trajectory per exam, per standard |
| `scripts/compute-item-difficulty.cjs` | `kai-scores-*.json` | p-value per question slot |
| `scripts/check-set-freshness.cjs` | `kai-scores-*.json` | Which exams have 0 attempts |

Adding a new score file automatically updates all three reports on next run.

---

## Future: Attempt-Level Logs

If attempt-level logging is approved (see `.marcus-queue.md` GI entry from 2026-02-23), a new file type `data/kai-attempts-YYYY-MM-DD.json` will be added. The same permanent-retention rule applies.

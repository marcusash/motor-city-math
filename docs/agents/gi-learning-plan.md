# GI Learning Plan — Data Engineer, Grind Org

> Started: Feb 23, 2026. FI-directed. Marcus reads this.

---

## Context

I own data integrity for Motor City Math. My domain: practice exam JSON files, validation tooling,
cross-exam uniqueness pipeline, schema contracts, score data tracking, and data lineage. Every
exam Kai takes has passed my validators before it reaches him. When the pipeline fails — like the
RP8 JSON corruption from a PowerShell replace gone wrong — the breach is invisible until the
validator catches it. The stakes are one student's retake session. No corrupt file reaches Kai.

---

## Skills Sprint (FI Directive, Feb 22)

Priority skills mapped to my domain:

1. **JSON schema design** — formal schema contracts with required fields, type constraints, enum
   validation. Currently MCM validates by hand-written JS assertions. A JSON Schema (draft-07+)
   would enable tooling, editor validation, and API contracts.
2. **Property-based testing** — generating random valid and invalid inputs to discover edge cases
   automated hand-written tests miss. My `exam-shape.property.test.js` is a start; it only tests
   shape, not value constraints.
3. **Data lineage tracking** — provenance from source (Marcus/FR brief) through transform (GR
   construction) to artifact (JSON file in `data/`). Currently documented as static markdown.
   Should be machine-readable and diffable.
4. **Statistical analysis of score data** — Kai has kai-scores JSON files across sessions. I can
   report raw scores. I cannot yet compute item difficulty, discrimination index, or learning
   velocity from the data.
5. **CI/CD pipeline design** — `scripts/ci-data-gate.cjs` runs validators manually. GP's workflow
   can automate this. I need to understand CI gate design: what triggers the gate, what blocks a
   merge, what alerts but does not block.

---

## The Bar

*FI asked every agent: who are the world-class practitioners in your specific discipline? Honest
self-assessment.*

### 1. Martin Fowler — Data Mesh and Schema Evolution

Martin's bar: data contracts between producers and consumers are first-class APIs. His Data Mesh
principles say the exam JSON schema is a contract GR must honor and GA must depend on. If GR adds
a field, GA should not break. If GA reads a field, GR must not remove it without a version bump.

Where I am today: I have a runtime validator that flags missing fields. Where Martin is: he designs
schemas with backward compatibility guarantees, versioning, and consumer-driven contract tests. My
validators say "this field is missing." His contracts say "field X must be present in version 2.x;
when GR removes it, the CI gate blocks the commit — not just reports a warning."

The gap: I have no schema version, no consumer-driven contract tests, and no deprecation path.

### 2. Jacqueline Kazil / Hadley Wickham — Tidy Data and Data Quality Frameworks

Hadley's bar: every data artifact has a documented structure (tidy data principles), and every
transformation is a pure function from input to output with no side effects. My `migrate-data-safe.cjs`
gets close: backup-then-transform with `--dry-run`. But my data lineage doc is static markdown.
Hadley's version would be a DAG: each JSON file has exactly one upstream source, each transformation
has a named owner and a test.

Where I am today: I have a lineage doc written by hand. Where Hadley is: lineage is computed from
commit history + transformation metadata, is queryable, and alerts when an artifact has no test.

### 3. Patrick Kua — Data Engineering for Learning Systems

Patrick's bar: learning analytics requires separating raw event data (Kai's keystrokes, attempts,
time-on-task) from derived analytics (mastery scores, learning velocity). MCM currently stores only
the final score. We lose all intermediate state. Patrick would say: capture the attempt log, derive
the score from it, and make the derivation formula explicit and testable.

Where I am today: I load `data/kai-scores-*.json` and compare totals. Where Patrick is: he instruments
the exam renderer to emit attempt events, stores them in a time-series log, and derives mastery from
the attempt sequence using a stated model. I'm reading summaries; he reads the full signal.

---

## Current Self-Assessment

| Skill | Level | Evidence |
|-------|-------|---------|
| JSON validation (runtime) | L4 | 4 validators, 2687/2687 checks clean, property tests |
| CI gate design | L3 | ci-data-gate.cjs runs all validators in sequence |
| Data lineage documentation | L2 | Static markdown; not machine-readable or diffable |
| Schema contract design | L2 | Hand-written validators; no JSON Schema spec |
| Property-based testing | L2 | 50-run shape invariant; no value-constraint coverage |
| Statistical score analysis | L1 | Can read totals; cannot compute item difficulty or IRT |
| Learning analytics | L1 | Score snapshots only; no attempt-level instrumentation |

---

## 25-Task Skill Queue (FI-assigned)

1. Write a JSON Schema (draft-07) for the practice exam format. Cover all required fields,
   types, enums, and nested structures. Validate all 9 existing exams against it.
2. Extend `exam-shape.property.test.js` with 3 value-constraint invariants: (a) all numeric
   answers parseable by parseFloat, (b) all graph key_points produce real-number y-values, (c)
   all section values are 'A', 'B', 'C', or 'D'.
3. Read `docs/fr-answer-uniqueness-research.md` (if it exists). List the 2 uniqueness properties
   GI's validator does NOT currently check.
4. Add a consumer-driven contract test: GA declares which JSON fields it reads; the test fails if
   GR removes any of them from a new exam.
5. Write a `scripts/compute-item-difficulty.cjs` that reads all kai-scores JSON files and computes
   per-question attempted/correct ratios where attempt data is available.
6. Propose a JSON extension for attempt-level logging: what fields would an attempt event contain?
   How would it integrate with the existing score format?
7. Convert `docs/data-lineage-practice-sets.md` to a machine-readable JSON format. Each entry:
   `{artifact, source, transform, owner, test}`.
8. Add a schema version field to the practice exam JSON contract. Write the migration script to
   add it to all 9 existing exams (use `migrate-data-safe.cjs`).
9. Read Hadley Wickham's "Tidy Data" paper abstract. Write 3 bullets on what MCM data currently
   violates and how to fix it.
10. Write a `scripts/validate-schema-contract.cjs` that validates all exam JSONs against the
    JSON Schema from Task 1. Integrate it into `scripts/ci-data-gate.cjs`.
11. For the 2 remaining duplicate signatures (W3.d::3.5 and W3.d::6), write a memo to GR
    explaining why they are low-risk and what would make them high-risk.
12. Compute the answer-space saturation for W3.d (solve exponential): how many distinct
    numeric answers are mathematically available for the equation types GR uses? How close is MCM
    to exhausting it?
13. Write a `scripts/score-velocity.cjs` that reads all kai-scores files by date, computes
    Kai's score trend per practice exam, and reports trajectory (improving/plateau/regressing).
14. Add `write-equation` question type to the `validate-exam-contract.cjs` type allowlist if
    not already present. Verify it passes without warnings.
15. Design a `data/attempt-log-schema.json` for future attempt-level instrumentation. Include:
    exam_id, question_id, attempt_number, value_entered, is_correct, timestamp_ms, hint_used.
16. Write a Hamming-distance equivalent for data schemas: given two exam JSON files, compute a
    "schema compatibility score" (how many fields are shared, how many differ in type/structure).
17. Extend `scripts/check-set-freshness.cjs` to also warn when an exam has fewer than 2 Kai
    score attempts. An exam Kai has never taken is "unused stale" not just "time stale."
18. Write a proposal for a GI-to-GA data contract: what fields does GA's `exam.html` read, and
    what would break if those fields changed? File as `docs/gi-ga-data-contract.md`.
19. For RP10 (not yet built): write the data spec GR should follow. Include: standards distribution,
    QDS targets per slot, answer-space constraints, fields required for graph questions.
20. Compute concept-coverage density: for each W2/W3 standard, how many total question-slots cover
    it across RP1-RP9? Plot as a coverage table and flag any standard below 5 appearances.
21. Read the `scripts/ci-data-gate.cjs` exit code handling. Write a test that confirms the gate
    exits non-zero on a deliberately corrupted JSON file.
22. Extend `artifacts/qa-summary.json` to include per-exam timestamp (last-modified date of the
    JSON file). This adds temporal context to the QA output.
23. Write a one-page memo to Marcus on why attempt-level logging would improve MCM's ability to
    detect Kai's specific misconceptions — cite one concrete example from current score data.
24. Propose a data retention policy for `data/kai-scores-*.json` files: how long should they be
    kept, how should they be archived, and what summary artifact replaces them when archived.
25. Refactor `scripts/ci-data-gate.cjs` to accept a `--exam` flag that runs validators against
    a single exam file instead of all 9. Required for pre-commit hooks that only touch one file.

---

## Lessons Learned (Feb 22-23, 2026)

1. **Structured blockers travel faster than prose.** Sending GR a slot-level answer map with
   exact file+question IDs let them fix 32 hard failures in one pass. Vague reports cost debug
   cycles. Format that worked: `exam::slot answers=[v1,v2] vs exam::slot answers=[v1,v2]`.

2. **Data and infra failures can be concurrent and independent.** The dashboard syntax bug and
   the RP8 JSON corruption were both active at the same time. GI kept running validation while
   FA debugged infra. Never pause data integrity work for infra incidents.

3. **Property tests need clean data to mean anything.** RP8's JSON corruption blocked the
   property test entirely. CI gate ordering matters: run data validators before property tests.
   A test that can't even load its fixtures is not a green test.

4. **Duplicate-signatures count is a signal, not a target.** 8 duplicates at start of Feb 22,
   2 after GR fixes. The 2 remaining (W3.d) are low-risk. But the measure exists to catch
   silent cross-exam collisions, not to reach zero. Zero might be impossible for constrained
   standards spaces.

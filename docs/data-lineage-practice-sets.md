# Data Lineage: Practice Sets

## Purpose
Trace how retake practice sets are produced, validated, and wired into the site.

## Source inputs
- Kai performance snapshots: `data/kai-scores-*.json`
- Standards map: `data/standards.json`
- Question bank reference: `data/questions.json`
- Authoring notes and simulation guidance in `docs/`

## Transform steps
1. Authoring: GR or FR drafts practice questions in JSON.
2. Simulation: FR generates new sets based on mock scores using `scripts/gen-rp8-rp9.cjs`.
3. Validation: run data checks and dedup tests before release.
4. Wiring: add entries to `index.html`, `exam.html`, and `data/manifest.json`.

## Outputs and provenance
| Output | Primary source | Transform | Validation |
|--------|----------------|-----------|------------|
| retake-practice-1.json to retake-practice-5.json | GR authored from MVP results | Manual JSON authoring | verify-practice-exams, cross-exam-verify |
| retake-practice-6.json to retake-practice-7.json | GR authored with Kai gaps focus | Cross-exam dedup edits | verify-practice-exams, cross-exam-verify |
| retake-practice-8.json to retake-practice-9.json | FR simulation rounds from mock scores | Generated via gen-rp8-rp9.cjs | verify-practice-exams, cross-exam-verify |
| kai-scores-*.json | Kai test runs | Manual snapshot logging | Spot checks only |

## Validation commands
- `node tests/verify-practice-exams.js`
- `node tests/cross-exam-verify.js`
- `node scripts/validate-exam-contract.cjs`
- `node scripts/validate-standards-map.cjs`

# GP Docs: Project Statistics Snapshot

**Generated:** 2026-02-23  
**Author:** GP  
**Purpose:** Running record of project size and test coverage at key milestones.

---

## Snapshot — 2026-02-23 (Post Sprint)

### Exam Content

| Metric | Value |
|--------|-------|
| Retake Practice exams | 11 (RP1-11 all complete) |
| Total questions (RP1-11) | 165 |
| Total verify checks | 3337/3337 |
| Health gate checks | 11/11 |
| Data files | 13 (11 exams + manifest.json + standards.json) |

### Question Type Distribution

| Type | Count |
|------|-------|
| Exponential | 25 |
| Identify (graph reading) | 21 |
| Graph (draw + analyze) | 20 |
| Radical | 19 |
| Quadratic | 13 |
| Rational | 10 |
| Fractional exponent | 10 |
| Word problem | 10 |
| Other (extraneous, AV, write-eq, etc.) | 22 |

### Test Suite

| Test file | Checks | Status |
|-----------|--------|--------|
| verify-practice-exams.js | 3008 | Pass |
| cross-exam-verify.js | 1959 | Pass (0 hard fails) |
| gp-field-completeness.test.js | 900 | Pass |
| gp-answer-uniqueness.test.js | 66 | Pass |
| gp-solution-steps.test.js | 150 | Pass |
| gp-feedback-length.test.js | 300 | Pass |
| gp-manifest-integrity.test.js | 10 | Pass |
| gp-graph-keypoints.test.js | 100 | Pass |
| gp-exam-id-consistency.test.js | 170 | Pass |
| gp-answer-tolerance.test.js | 261 | Pass |
| gp-hint-length.test.js | 150 | Pass |
| gp-version-check.test.js | 10 | Pass |
| gp-input-label.test.js | 317 | Pass |
| gp-json-parse.test.js | 10 | Pass |
| gp-hint-presence.test.js | 150 | Pass |
| gp-cdn-check.test.js | 11 | Pass |
| gp-commit-prefix.test.js | 24 | Pass |
| gp-viewport-meta.test.js | 11 | Pass |
| gp-localstorage-keys.test.js | audit | Advisory |
| gp-aria-labels.test.js | 7 | 1/7 pass (6 bugs filed GA) |
| gp-print-css.test.js | 3 | 1/3 pass (2 bugs filed GA) |

**Total test checks (passing gates only): 6,619**

### Scripts

| Category | Count |
|----------|-------|
| Field audit/fix | 3 |
| Health and verification | 4 |
| Analytics and reporting | 5 |
| Utility | 3 |

### HTML Files

| File | Size | Status |
|------|------|--------|
| exam.html | 73.0KB | Active |
| final_exam_251123.html | 69.8KB | Active |
| nonlinear_exam_mvp.html | 70.1KB | Active |
| index.html | 53.6KB | Active (dashboard) |
| final_exam_251123_mini.html | 23.8KB | Active |
| scorecard.html | 19.5KB | Design prototype |
| scorecard-2.html | 17.7KB | Design prototype |
| mockup.html | 36.4KB | Design prototype |
| mockup-ab.html | 22.3KB | Design prototype |
| chart-variants.html | 38.7KB | Design reference |
| dad.html | 0.9KB | Utility |

### CI/CD

| Workflow | Trigger | Status |
|----------|---------|--------|
| validate-data.yml | Push to data/*.json | Active |
| validate-inbox.yml | Push to .agent-comms/ | Active |
| agent-inbox-schema.yml | Push to .agent-comms/*.json | Active |
| publish-to-motor-city-math.yml | Manual | Active |

---

## History

| Date | Exams | Verify | Health | Notes |
|------|-------|--------|--------|-------|
| Pre-sprint | 10 | 3008/3008 | 11/11 | Baseline |
| 2026-02-23 | 10+stub | 3008/3008 | 11/11 | Post 500-task sprint |

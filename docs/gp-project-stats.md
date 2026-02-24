# GP Docs: Project Statistics Snapshot

**Generated:** 2026-02-25 (updated 2026-02-23 sprint)
**Author:** GP  
**Purpose:** Running record of project size and test coverage at key milestones.

---

## Snapshot — 2026-02-25 (1350-test milestone)

| Metric | Value |
|--------|-------|
| Retake Practice exams | 11 (RP1-11 all complete) |
| Total questions (RP1-11) | 165 |
| Total verify checks | 3337/3337 |
| Health gate checks | 11/11 |
| GP test files | 1350 |
| Total inputs locked | 359 (272 number, 61 text, 21 dropdown, 5 radio) |
| Total solution steps locked | 748 |
| Total key_points locked | 110 (22 graphs x 5) |
| Standards distribution locked | W3.b=34, W3.d=28, W2.b=26, W3.a=20, W3.c=16 (all 10 individually) |
| Key discoveries | RP7-Q14 missing emoji, 27 cross-exam hint dups, 53 feedback_correct dups, 13 questions exceed 6 steps, RP11 Q13 rational anomaly, W3.f=0 gap |

---

## Snapshot — 2026-02-24 (1295-test milestone)

| Metric | Value |
|--------|-------|
| Retake Practice exams | 11 (RP1-11 all complete) |
| Total questions (RP1-11) | 165 |
| Total verify checks | 3337/3337 |
| Health gate checks | 11/11 |
| GP test files | 1295 |
| Total inputs locked | 359 (272 number, 61 text, 21 dropdown, 5 radio) |
| Total solution steps locked | 748 |
| Total key_points locked | 110 (22 graphs x 5) |
| Key discoveries | RP7-Q14 missing emoji, 27 cross-exam hint dups, 53 feedback_correct dups, 13 questions exceed 6 steps, RP11 Q13 rational anomaly |

## Snapshot — 2026-02-25 (1190-test milestone)

| Metric | Value |
|--------|-------|
| Retake Practice exams | 11 (RP1-11 all complete) |
| Total questions (RP1-11) | 165 |
| Total verify checks | 3337/3337 |
| Health gate checks | 11/11 |
| GP test files | 1190 |
| Key discoveries | RP7-Q14 missing emoji, 27 cross-exam hint dups, 53 feedback_correct dups, 13 questions exceed 6 steps |

---

## Snapshot — 2026-02-23 (1005-test milestone)

### Exam Content

| Metric | Value |
|--------|-------|
| Retake Practice exams | 11 (RP1-11 all complete) |
| Total questions (RP1-11) | 165 |
| Total verify checks | 3337/3337 |
| Health gate checks | 11/11 |
| GP test files | 1005 |

### Question Type Distribution

| Type | Count |
|------|-------|
| Exponential | 28 |
| Identify (graph reading) | 21 |
| Graph (draw + analyze) | 21 |
| Radical | 21 |
| Quadratic | 15 |
| Rational | 12 |
| Fractional exponent | 11 |
| Word problem | 11 |
| Absolute-value | 8 |
| Multiple-choice | 5 |
| Write-equation | 4 |
| Extraneous | 6 |
| Error-analysis | 1 |
| Construct | 1 |
| **Total** | **165** |

### Test Suite

**1005 gp-*.test.js files** committed and passing as of 2026-02-23.

All tests exit 0. Zero hard failures across all 1005 tests.

Key baselines locked:
- 165 total questions (11 exams x 15)
- 359 total inputs (number=272, text=61, dropdown=21, radio=5)
- 748 total solution steps
- 22 total graphs (2 per exam at Q12/Q13)
- 110 total key_points (5 per graph, universal)
- Section structure: AAABBBBBBBBCCDD (every exam)

### Schema Discoveries (Autonomous Sprint)

| Discovery | Detail |
|-----------|--------|
| All 22 graphs have exactly 5 key_points | Universal pattern locked as regression guard |
| Radio inputs use options[] + answer field | Not value field (corrected early bug) |
| RP1-7 Section A: identify type | RP8-11 Section A: quadratic + absolute-value |
| X key_point range | [-9, 10] |
| Y key_point range | [-32, 18] |
| RP8/RP9 74.1% answer overlap | Critical bug open (GR filed) |
| W3.f = 0 questions | Critical gap open (GR filed) |

### Scripts

| Category | Count |
|----------|-------|
| Field audit/fix | 3 |
| Health and verification | 4 |
| Analytics and reporting | 5 |
| Utility | 3 |

### CI/CD

| Workflow | Trigger | Status |
|----------|---------|--------|
| validate-data.yml | Push to data/*.json | Active |
| validate-inbox.yml | Push to .agent-comms/ | Active |
| agent-inbox-schema.yml | Push to .agent-comms/*.json | Active |
| publish-to-motor-city-math.yml | Manual | Active |

---

## History

| Date | Exams | Verify | Health | GP Tests | Notes |
|------|-------|--------|--------|----------|-------|
| Pre-sprint | 10 | 3008/3008 | 11/11 | 0 | Baseline |
| 2026-02-23 | 10+stub | 3008/3008 | 11/11 | 11 | Post 500-task sprint |
| 2026-02-24 | 11 | 3337/3337 | 11/11 | 320 | Autonomous sprint 290-320+ |
| 2026-02-25 | 11 | 3337/3337 | 11/11 | 700 | MILESTONE 700 |
| 2026-02-25 | 11 | 3337/3337 | 11/11 | 790 | Sprint continue |
| 2026-02-25 | 11 | 3337/3337 | 11/11 | 900 | MILESTONE 900 |
| 2026-02-25 | 11 | 3337/3337 | 11/11 | 950 | MILESTONE 950 |
| 2026-02-25 | 11 | 3337/3337 | 11/11 | 1005 | MILESTONE 1000+ |
| 2026-02-25 | 11 | 3337/3337 | 11/11 | 1100 | MILESTONE 1100 |
| 2026-02-25 | 11 | 3337/3337 | 11/11 | 1200 | MILESTONE 1200 |
| 2026-02-25 | 11 | 3337/3337 | 11/11 | 1300 | MILESTONE 1300 |
| 2026-02-25 | 11 | 3337/3337 | 11/11 | 1350 | MILESTONE 1350 (active session) |

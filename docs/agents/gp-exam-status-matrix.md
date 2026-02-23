# GP Exam Status Matrix

**Last updated:** 2026-02-23  
**Baseline:** 3337/3337 (verify), 11/11 (health gate)

## Exam Status

| Exam | File | Questions | Verify | Health | Em Dashes | Schema | Status |
|------|------|-----------|--------|--------|-----------|--------|--------|
| RP1 | retake-practice-1.json | 15 | PASS | PASS | 0 | v1.0 | SHIPPED |
| RP2 | retake-practice-2.json | 15 | PASS | PASS | 0 | v1.0 | SHIPPED |
| RP3 | retake-practice-3.json | 15 | PASS | PASS | 0 | v1.0 | SHIPPED |
| RP4 | retake-practice-4.json | 15 | PASS | PASS | 2 (GR) | v1.0 | SHIPPED — em dash pending |
| RP5 | retake-practice-5.json | 15 | PASS | PASS | 5 (GR) | v1.0 | SHIPPED — em dash pending |
| RP6 | retake-practice-6.json | 15 | PASS | PASS | 1 (GR) | v1.0 | SHIPPED — em dash pending |
| RP7 | retake-practice-7.json | 15 | PASS | PASS | 3 (GR) | v1.0 | SHIPPED — em dash pending |
| RP8 | retake-practice-8.json | 15 | PASS | PASS | 0 | v1.0 | SHIPPED |
| RP9 | retake-practice-9.json | 15 | PASS | PASS | 1 (GR) | v1.0 | SHIPPED — em dash pending |
| RP10 | retake-practice-10.json | 15 | PASS | PASS | 0 | v1.0 | SHIPPED |
| RP11 | retake-practice-11.json | 15 | PASS | PASS | 0 | v2.0 | READY — awaiting GA integration |

## Legend

- **Verify:** `node tests/verify-practice-exams.js` result
- **Health:** `node scripts/gp-exam-health.js` result
- **Em Dashes:** count of em dash violations (GR = fix assigned to GR)
- **Schema:** current schema_version in file
- **SHIPPED:** in Kai's active study rotation
- **READY:** verified, not yet linked to exam.html

## Pending Actions

| File | Action | Owner | Priority |
|------|--------|-------|----------|
| RP4/5/6/7/9 | Fix em dashes (11 total) | GR | HIGH |
| RP11 | Wire into exam.html + manifest | GA | MEDIUM |
| RP1-10 | Migrate schema_version 1.0 to 2.0 | GI | LOW |

## Standards Coverage per Exam

| Exam | W2.a | W2.b | W2.c | W2.d | W2.e | W3.a | W3.b | W3.c | W3.d | W3.e |
|------|------|------|------|------|------|------|------|------|------|------|
| RP1-7 | Y | Y | Y | - | Y | Y | Y | Y | Y | Y |
| RP8-11 | - | - | Y | Y | - | Y | Y | Y | - | Y |

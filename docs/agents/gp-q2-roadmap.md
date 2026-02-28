# GP Q2 Roadmap

**Period:** Q2 2026 (April-June)  
**Owner:** GP (grind-platform)

## Q2 Objectives

### O1: Zero Em Dash Violations
Close all 11 em dash violations in RP4/5/6/7/9. Test suite enforcement via gp-hint-no-emdash and gp-feedback-no-emdash.

### O2: RP11-15 Ship-Ready
All 5 remaining RP exams verified, integrated into exam.html, and available to Kai.

### O3: 50 GP Tests Active
Grow GP test suite from 30+ to 50+ covering all data quality dimensions.

### O4: Autonomous Trigger Approved
FA approves GP autonomous trigger proposal. GP can self-start sessions when verify baseline drifts.

### O5: W2.d Coverage Doubled
RP12+ heavily targets W2.d (Kai's lowest coverage weakness: 5 questions today).

## Key Results

| Objective | Key Result | Target |
|-----------|------------|--------|
| O1 | Em dash violations | 0 (from 11) |
| O2 | RP exams in exam.html | 15 (from 10) |
| O3 | GP test count | 50 (from 30) |
| O4 | Autonomous trigger | APPROVED |
| O5 | W2.d questions total | 10+ (from 5) |

## Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| Fix em dashes | GR | OPEN |
| Deliver RP12-15 | GR | PLANNED |
| Integrate RP11+ into exam.html | GA | PENDING |
| Autonomous trigger approval | FA | PENDING |
| RP12 spec | GR/GI | NOT STARTED |

## Q1 Review (Completed)

- 40+ GP commits shipped
- 30+ tests active
- 3337/3337 baseline maintained
- 11/11 health gate
- Emergency playbook created
- Full docs library built (45+ docs)

# GP Risk Register

**Owner:** GP (grind-platform)  
**Last updated:** 2026-02-23

---

## Active Risks

| ID | Risk | Probability | Impact | Mitigation | Status |
|----|------|-------------|--------|-----------|--------|
| R-01 | Session-dependency: GP only executes when Marcus opens session | High | High | Autonomous trigger proposal filed | Open |
| R-02 | MOTOR_CITY_MATH_TOKEN expires silently | Medium | High | Check token before each publish; GP monitors Actions tab | Open |
| R-03 | RP JSON edit breaks verify baseline | Medium | High | Pre-commit hook + CI validate-data.yml + 9/9 health gate | Mitigated |
| R-04 | Math error in answer key goes undetected | Low | Critical | GR verifies all math; gp-graph-keypoints.test.js auto-checks graphs | Mitigated |
| R-05 | ADHD violations shipped to Kai | Medium | High | gp-feedback-length.test.js (300/300); pre-commit feedback_correct check | Mitigated |
| R-06 | FO attribution gap (GP commits not counted) | High | Medium | Fixed: GP: prefix standard adopted. Sprint log documents evidence. | Resolved |
| R-07 | agent-comms inbox JSON schema drift | Medium | Low | validate-inbox.yml CI workflow now checks on every comms push | Mitigated |
| R-08 | p-impl-2 (doc reorg) breaks agent workflows | Low | Medium | Awaiting Marcus approval; not executed without explicit go-ahead | Blocked |
| R-09 | Fresh clone missing pre-commit hook | Medium | Medium | scripts/gp-pre-commit-hook.js tracked + scripts/install-hooks.sh | Mitigated |
| R-10 | data/_backups not maintained | Medium | Low | 10 backups created 2026-02-23; should be updated each sprint | Open |

---

## Resolved Risks

| ID | Risk | Resolution | Date |
|----|------|-----------|------|
| R-06 | FO attribution gap | GP: prefix adopted, all future commits attributed correctly | 2026-02-23 |
| R-03 | RP5 Q4/Q13 errors in answer key | Fixed: Q4 → x=9, Q13 key_point (-2,-1.75). Verified 3008/3008 | 2026-02-23 |

---

## Risk Review Schedule

Review this register at the start of each sprint session.  
Update status as mitigations take effect.

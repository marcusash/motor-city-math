# FF Skills

Read the current product's own test tooling, CI gates, and accessibility standard
first, then load only the method needed for the task. Product truth, runtime state, and
historical audit findings are not FF skills.

| Skill | File | When to load | Output |
|---|---|---|---|
| Risk-Based Test Planning | `risk-based-test-planning.md` | Deciding what to test, at what level, before or during implementation of a change | Prioritized test plan with risk rationale, level, and acceptance signal per item |
| Failure and Flakiness Triage | `failure-triage.md` | A test or CI run fails, is intermittent, or needs a keep/fix/quarantine decision | Triage record: reproduction, isolated layer, root cause, and fix/quarantine/removal decision |
| Test and Assertion Quality | `assertion-quality.md` | Writing or reviewing a test to check it fails for the right reason | Findings by severity on whether each test verifies real behavior |
| Mutation Testing | `mutation-testing.md` | Verifying whether existing tests actually exercise the code they claim to cover | List of surviving mutants with added tests or accepted-risk rationale |
| E2E and Visual Evidence | `e2e-visual-evidence.md` | Producing an E2E run or visual regression evidence for a UI-facing change | Evidence bundle: flows/states covered, pass/fail, artifact paths, baseline comparison |
| Accessibility Audit | `accessibility-audit.md` | Auditing a UI deliverable or flow against its accessibility acceptance bar | Findings by severity and a Pass/Blocked verdict against the acceptance bar |

## Loading order

Start with `risk-based-test-planning.md` for new coverage. Add `failure-triage.md` when
a run is red or flaky. Use `assertion-quality.md` and `mutation-testing.md` together to
check whether existing or new tests actually protect the risk they claim to. Use
`e2e-visual-evidence.md` and `accessibility-audit.md` for user-facing flows and
deliverables.

## Shared dependencies

- Product test commands, frameworks, coverage thresholds, and CI gates: named by the
  current product repository's own scripts and configuration, never assumed.
- Visual and brand acceptance: FD's canonical tokens
  (`packages/design-tokens/tokens.json`), generated CSS
  (`packages/design-tokens/forge-tokens.css`), and component reference
  (`docs/components/index.html`).
- Accessibility acceptance bar: WCAG AA by default, or the product's own stricter
  standard when defined.
- CI constraints: `skills/shared/testing-standard.md` (no hosted-runner workflows; a
  local test harness is required).

Skills point to these canonical dependencies and do not copy their values, engine
internals, or product-specific paths. FF's plans, triage records, and evidence support
the DRI's landing decision and do not substitute for the primary executor's
implementation or ownership.

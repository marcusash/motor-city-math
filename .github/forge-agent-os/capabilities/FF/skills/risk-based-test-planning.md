# Risk-Based Test Planning

## Trigger

Load when deciding what to test, at what level, before or during implementation of a
change.

## Start with risk, not a coverage percentage

A fixed coverage target rewards testing the easy paths and skipping the dangerous ones.
Instead, for the change under test, enumerate:

1. **Change surface:** which behaviors, data paths, and integration points does this
   change touch or could it silently affect?
2. **Blast radius:** who is affected if this breaks — one user, all users, data
   integrity, money, safety, or an external integration?
3. **Failure modes:** what are the specific ways this could go wrong (wrong output,
   silent data loss, crash, security bypass, race condition, regression of a previously
   fixed bug)?
4. **Likelihood:** how easy is it to trigger — every call, an edge case, a rare
   concurrent condition?
5. **Detectability:** would a failure be caught immediately (a crash) or silently
   (wrong value accepted downstream)?

Prioritize test effort where impact and likelihood are both non-trivial and
detectability is low. Do not spend equal effort on trivial getters and on payment,
auth, or data-integrity logic.

## Map risk to test level

| Signal | Preferred level |
|---|---|
| Pure logic, single function, no I/O | Unit |
| Multiple modules cooperating, real data shape | Integration |
| Cross-service or cross-process contract | Integration or contract test |
| Critical user-facing flow, multiple systems in sequence | E2E (see `e2e-visual-evidence.md`) |
| Visual or interaction correctness | E2E + visual evidence |
| Regression of a shipped bug | Test at the lowest level that would have caught it |

Push tests as low as they can go while still exercising the real risk. An E2E test that
covers what a unit test could have covered cheaper and faster is a maintenance cost, not
extra safety.

## Define the acceptance signal before writing the test

For each planned test, write down what a pass proves and what a failure would mean,
before implementation. If you cannot state the observable behavior a test protects, it
is not ready to write — see `assertion-quality.md`.

## Discover, do not assume

Before proposing a test plan, find the product's own test commands, frameworks,
directory conventions, and CI gates by reading its repository (package scripts,
CONTRIBUTING notes, existing test directories). Never hardcode a specific framework,
runner, or path from memory — different products choose different stacks and Forge
does not own that choice.

## Output

A prioritized test plan: for each item, the risk it addresses, the chosen test level and
why, the acceptance signal, and any residual risk left deliberately untested with a
stated reason. This plan is planning evidence for the DRI's decision, not a substitute
for the executor writing and landing the tests.

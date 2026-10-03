# FD Design Debt Management

## Trigger

Load when a deliberate visual or interaction compromise is proposed, discovered, or
needs prioritization.

## Accrual rule

Debt is acceptable only when all of these are true:

- the compromise is explicit and reversible;
- user safety, accessibility, privacy, and core task completion are unaffected;
- the shortcut materially accelerates validated learning or delivery;
- an owner and durable work item exist before the compromise lands.

Accessibility failures, deceptive behavior, missing error handling, and lost user data
are defects, not design debt.

## Accessibility boundary

Do not defer a known barrier merely because another path exists. Record and fix it as a
defect using the product's accessibility acceptance bar and existing verification tools.

## Debt record

Create the record in the current product repository. Include:

1. Current behavior, with reproducible evidence.
2. Intended behavior and the current design-authority pointer.
3. User and business impact.
4. Affected surfaces and known dependencies.
5. Exit criteria that can be observed or tested.
6. Owner, priority, and review trigger.

Do not use Forge as a duplicate record for product debt.

## Prioritization

- **Critical:** blocks access, safety, comprehension, or task completion. Fix now.
- **High:** repeatedly causes mistakes, abandonment, or visible inconsistency in a key
  workflow. Fix before the next release boundary.
- **Medium:** raises cognitive load or maintenance cost without blocking the task.
- **Low:** cosmetic preference with no demonstrated user impact.

Raise priority when debt spreads, forces duplicate components, obscures product state,
or makes future changes riskier. Close the record only after the intended behavior and
acceptance evidence are present.

## Output

Produce one durable product work item with the current-authority pointer, owner,
priority, exit criteria, and evidence. Closure includes proof that the intended behavior
meets the product's functional and accessibility bar.

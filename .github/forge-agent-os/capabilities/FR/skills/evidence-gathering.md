# Evidence Gathering

**Description:** Collect reproducible evidence with reliable provenance, sampling, and
data handling.
**Use when:** Collecting logs, repository facts, telemetry, documents, interviews, or
other material for an investigation.

## Collection Plan

Before collecting, define:

- claim or question being tested;
- evidence needed to support and refute it;
- source owners and access constraints;
- time window and sampling rule;
- minimum necessary fields;
- provenance and retention plan.

Prefer read-only, non-disruptive collection. Active testing must use an appropriate
non-production environment or explicit authorization from the system owner.

## Source Record

For every evidence item record:

```text
SOURCE ID:
ORIGIN:
AUTHOR OR SYSTEM:
COLLECTED AT:
VERSION OR COMMIT:
COLLECTION METHOD:
SCOPE:
TRANSFORMATIONS:
ACCESS OR SENSITIVITY:
INTEGRITY NOTES:
```

Use stable identifiers and exact versions. A URL without an access date, a file without a
commit, or a metric without its query is incomplete provenance.

## Reliability Checks

1. Verify that the source is authoritative for the claim.
2. Check completeness, missingness, duplicates, and time coverage.
3. Distinguish first-hand evidence from summaries and derived reports.
4. Compare a sample against the underlying raw source.
5. Look for measurement changes, schema drift, and survivorship bias.
6. Preserve contradictory evidence rather than filtering it out.

## Sampling

Define the target population and sampling frame. Use random or stratified sampling when
representativeness matters. Use purposive sampling for edge cases or mechanism discovery,
but do not generalize prevalence from it. Document exclusions and nonresponse.

## Data Handling

Collect the minimum necessary data. Redact secrets and direct identifiers when they are
not required. Keep raw evidence immutable and perform cleaning in a derived copy. Do not
place confidential evidence in public issues, commits, or prompts sent to external
services.

## Completion Gate

Collection is complete when the planned sources are captured, provenance is sufficient
for reproduction, quality checks are recorded, contradictions are retained, and known
gaps are explicit.

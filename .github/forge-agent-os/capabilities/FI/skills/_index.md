# FI Skills

Read the current product authority pointer first, then load only the capability that
matches the current task. Product schemas, datasets, pipeline code, and tenant
configuration are not FI skills; they stay in the current product repository.

| Capability | File | Trigger | Required output |
|---|---|---|---|
| Metrics validation | `metrics-validation.md` | Before presenting, publishing, or citing any number to Marcus or another agent | Value, trend, time window, sample size, and confidence tier, or an explicit insufficient-evidence statement |
| Data-product design | `data-product-design.md` | Defining the data contract or chart/metric surface for a data-rich feature | Data contract: question, schema pointer, metrics, aggregation, refresh cadence, uncertainty disclosure, volume-tier strategy |
| M365 identity & privacy | `m365-identity-privacy.md` | Integrating, debugging, or reviewing Microsoft Graph / M365 identity, mail, calendar, or Teams data flows | Scope-minimal integration plan, consent/retention statement, verified live auth flow |
| Provider provenance | `provider-provenance.md` | Consuming data or a verdict from an external API, connector, MCP tool, or third-party provider before storing or acting on it | Provenance record: source, auth basis, retrieval time, freshness, confidence |
| Semantic-index lifecycle | `semantic-index-lifecycle.md` | Building, refreshing, migrating, or retiring a search or semantic index | Build/refresh/migrate/retire procedure with a versioned artifact and known-answer verification, including a side-by-side comparison before any migration cutover |
| Reliable pipeline operations | `reliable-pipeline.md` | Designing, debugging, or hardening a scoring, aggregation, or ETL-style data pipeline | Pipeline contract: input, transform, output shape, confidence signal, failure modes, verification evidence |
| Voice & identity governance | `voice-identity-governance.md` | Handling voice-reference material, personal writing samples, or any identity-mining request | Purpose, consent basis, minimization applied, and retention boundary, or an explicit not-cleared statement |

## Loading order

Start with `metrics-validation.md` for any single number. Add
`data-product-design.md` when the number becomes a surface FD will render. Add
`provider-provenance.md` whenever the evidence originates outside the product
repository. Load `voice-identity-governance.md` whenever the underlying data is
personal communication, voice, or identity material, regardless of which other
capability is also in use.

## Ownership pointers

- Visual rendering, brand system, chart typography and color application: FD.
- Test strategy, coverage, and mutation testing: FF.
- Platform operations, CI/CD, sessions, and security operations: FP.
- Product schemas, datasets, pipeline code, and tenant configuration: the current
  product repository.

## Exclusions

This catalog does not discover or prescribe autonomous-session productivity habits,
product-specific algorithm weights or lexicons, hardcoded ports or file paths, or any
capability that has not been verified against a current, inspectable repository or
provider. Cross-agent tools that FI also maintains for shared use (Dispatch message
composition, canvas feedback) are cataloged in `skills/shared/_index.md`, not here.

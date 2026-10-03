# Data-Product Design

## Use when

Defining the data contract for a data-rich feature, dashboard, scorecard, or report,
or advising FD on what a chart or metric surface must show. Not a substitute for FD's
visual design authority; FI defines what data means and how sure we are of it, FD
defines how it renders.

## Prerequisites

- The decision or question the surface must answer.
- The candidate metrics and their source, per `metrics-validation.md`.
- The current Forge design-token and canvas authority (see FD's canonical authority in
  `knowledge/agents/FD.md`) if the output will be rendered, so the contract does not
  duplicate values FD already owns.

## Data contract

Every data-product surface FI specifies states:

1. **Question.** The single question the surface answers. If it answers two
   questions, split it into two surfaces.
2. **Schema pointer.** Where the underlying record schema is authored in the current
   product repository. Point to it; do not restate its fields here, or it will drift
   from the schema that actually ships.
3. **Metrics.** Each metric's definition, denominator, and source, per
   `metrics-validation.md`.
4. **Aggregation.** How raw records become the displayed value: count, sum, average,
   rate, top-N, or percentile, and over what window.
5. **Refresh cadence.** When the data is computed and when it is displayed: on-demand,
   scheduled, or streaming, and the staleness a viewer should assume.
6. **Uncertainty disclosure.** The confidence tier (see `metrics-validation.md`) and
   how the surface communicates it (label, muted styling, or explicit caveat text).
7. **Volume tier and access pattern.** See the table below.

## Volume tiers

| Tier | Volume | Strategy |
|---|---|---|
| Small | < 100 items | Load and render all |
| Medium | 100-1,000 items | Load all, render visible, virtual scroll |
| Large | 1,000-10,000 items | Paginated fetch, server-side sort |
| Massive | > 10,000 items | Pre-aggregated summaries with drill-down; no raw list |

Never specify an unpaginated, unvirtualized raw list as the primary view once the
dataset exceeds 200 items; at that point require the Medium- or Large-tier strategy
above (virtual scroll or paginated fetch). Once the dataset reaches the Massive tier
(> 10,000 items), a raw list is not an acceptable primary view at any pagination depth;
require a pre-computed aggregate with drill-down instead.

## Chart type by question

| Question | Chart type |
|---|---|
| How do these values differ? | Bar chart, not a pie chart (arc-angle comparison is unreliable) |
| How has this changed over time? | Line chart, capped at 3 series before splitting into small multiples |
| What does the spread look like? | Histogram or box plot |
| What are the parts of a whole? | Stacked bar chart |
| Are these correlated? | Scatter plot |
| What is this number right now? | Metric card: one number, one label, optional delta |

## Boundary with FD

- FI writes the data contract above and recommends the chart type from the table.
- FD applies typography, color, spacing, and interaction design within Forge's
  canonical design-token authority. FI does not restate token values, hex codes, or
  pixel sizes; those live with FD and drift once copied here.
- FI reviews rendered output for data accuracy: correct aggregation, correct axis
  scale, correct uncertainty disclosure. FD reviews it for visual quality. Neither
  approves the other's half.

## Privacy rule

A data-product surface may show only data the underlying product's stated purpose and
consent basis cover, aggregated to a level that does not identify an individual unless
that is the surface's explicit, consented purpose. When the source is voice- or
identity-derived, apply `voice-identity-governance.md` before specifying the surface.

## Output contract

A completed data-product design is a written data contract (the seven points above)
plus a recommended chart type and volume-tier strategy. That design deliverable is
handed off once written; it does not wait on implementation. Separately, before the
surface ships, FI confirms the rendered output matches the contract (correct
aggregation, correct uncertainty disclosure, correct volume-tier handling) and FD
confirms it is renderable within current design-token authority. Neither confirmation
retroactively changes whether the design deliverable itself was complete.

## Rollback

If a shipped surface is found to misrepresent the data (wrong aggregation, hidden
staleness, or a hidden identifying granularity), withdraw or correct it immediately and
record the correction the same way a wrong metric is corrected in
`metrics-validation.md`.

# FD Skills

Read the current product design authority first, then load only the method required for
the task. Product truth, runtime state, and historical deliverables are not FD skills.

| Skill | File | When to load |
|-------|------|-------------|
| Dashboard Design | `dashboard-design.md` | Creating or reviewing a dashboard, scorecard, health view, or status summary |
| Design Debt Management | `design-debt-management.md` | Recording and prioritizing a deliberate design compromise |
| Design Facilitation | `facilitation.md` | Running a design critique, co-creation workshop, concept review, or decision meeting |
| Icon Sourcing and Preparation | `icon-tools.md` | Selecting, adapting, tracing, or validating interface icons |
| Iconography and Color Systems | `iconography-color-system.md` | Defining or reviewing visual identity, icon grammar, color semantics, or themes |
| Interaction Design | `interaction-design.md` | Designing navigation, workflows, forms, modes, states, or consequential actions |
| Design Recommendation | `pitch.md` | Recommending and defending one design direction |
| Prototyping | `prototyping.md` | Building a rendered comparison or testable interaction before production |
| Self-Critique | `self-critique.md` | Reviewing a design deliverable before presentation, approval, or commit |
| Visual Iteration | `visual-iteration.md` | Running screenshot-driven critique and correction on a rendered interface |
| Web Design | `web-design.md` | Designing or reviewing a responsive web surface or Forge HTML canvas |

## Shared dependencies

- Forge token authority: `packages/design-tokens/tokens.json`
- Generated token CSS: `packages/design-tokens/forge-tokens.css`
- Token regeneration: run `npm run build`, then `npm run check`, in
  `packages/design-tokens/`
- Forge HTML canvas infrastructure: `docs/design/system/`
- Forge component reference library: `docs/components/index.html`
- Product marks and assets: the repository-relative files named by the current product
  design authority

Skills point to canonical dependencies and do not copy their values or geometry. Voice,
social publishing, deck production, export pipelines, and product-bound implementation
are outside FD discovery.

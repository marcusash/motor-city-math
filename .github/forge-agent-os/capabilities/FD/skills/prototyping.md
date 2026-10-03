# FD Prototyping

## Trigger

Load when a design question needs a rendered comparison, interaction model, or testable
prototype before production implementation.

## Choose fidelity by question

- Use sketches or static frames for information hierarchy and concept breadth.
- Use a rendered responsive surface for layout, typography, theme, and visual-system
  questions.
- Use an interactive prototype for flow, state, timing, keyboard behavior, and recovery.
- Use production code only when technical feasibility is itself the design question.

Do not build fidelity that cannot answer the stated question.

## Method

1. Write the hypothesis and the decision the prototype will support.
2. Use real representative content and define sensitive-data handling.
3. Explore meaningfully different directions before narrowing.
4. Keep comparison context, content, and viewport constant across variants.
5. Label variants neutrally and make switching keyboard accessible.
6. Render and inspect each state at representative narrow and wide viewports.
7. Test the question with users or the decision owner.
8. Record the decision and move durable product truth into the product authority.

Prototype files live in the current product repository or approved scratch location.
Keep only artifacts that remain useful evidence; prototypes are not permanent authority
by default.

## Accessibility and implementation safety

- Use semantic HTML and real controls where practical.
- Include focus, hover, pressed, disabled, loading, empty, and error states.
- Preserve keyboard operation and visible focus.
- Honor reduced motion and forced-colors behavior.
- Never imply inaccessible behavior is acceptable because the artifact is temporary.
- Clearly mark simulated data, nonfunctional controls, and destructive-action stubs.

## Canonical dependencies

Forge HTML prototypes may consume `packages/design-tokens/forge-tokens.css` and
`docs/design/system/`. Read token definitions from
`packages/design-tokens/tokens.json`; do not duplicate them. Product marks and assets must
come from the canonical repository-relative locations named by the product's design
authority.

## Output

Provide the hypothesis, variant rationale, states covered, known simulation limits,
accessibility notes, screenshots or recordings, findings, and decision.

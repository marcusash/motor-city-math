# FD Visual Iteration

## Trigger

Load when a rendered interface needs screenshot-driven critique and correction. This
method complements functional and accessibility testing; it does not replace them.

## Loop

1. Define the target states, content, viewports, themes, and display scaling.
2. Capture deterministic screenshots with the product's existing browser or UI test
   tooling.
3. Review purpose, hierarchy, legibility, layout, state clarity, platform fit, and
   canonical-system usage.
4. Record findings with severity and screenshot evidence before editing.
5. Fix blocking findings first, then major findings.
6. Re-run the affected functional and accessibility checks.
7. Re-capture the same state and compare for regressions.

Use repository-relative inputs and an approved project or scratch output directory. Do
not encode machine-specific paths or depend on a separate product's scripts.

## Capture matrix

At minimum, include:

- representative narrow and wide viewports;
- every supported theme;
- default, focus, loading, empty, error, and destructive-confirmation states;
- long, missing, and extreme real-content cases;
- reduced-motion and forced-colors checks where the platform supports them.

For multi-view products, finish the matrix for one coherent flow before moving to the
next. Keep baselines only when the product's testing strategy treats them as authority.

## Exit criteria

- No blocking or major visual findings remain.
- The primary task is understandable without narration.
- Text and controls remain usable under zoom and reflow.
- Keyboard focus and state changes are visible.
- Canonical tokens and assets are consumed rather than copied.
- The latest capture introduces no regression in the tested matrix.
- Existing functional, accessibility, and visual checks pass.

## Output

Report the capture matrix, findings, changes, remaining minor risks, and evidence
locations. Use **Approved** or **Blocked**; do not use arbitrary iteration counts or
confidence scores as the approval gate.

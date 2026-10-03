# Accessibility Audit

## Trigger

Load when auditing a UI deliverable or flow against its accessibility acceptance bar,
before it lands or before it reaches sign-off.

## Acceptance bar

WCAG AA is the default minimum. Use the product's own accessibility standard instead
when one is defined and stricter — discover it from the product repository rather than
assuming a bar. WCAG AA is a floor, not a negotiable default: audit against it even
when no product-specific standard exists, and treat any product exception below it as
a gap to record and route to the DRI, not a bar FF can lower on its own.

## Review sequence

1. **Structure and semantics.** Headings, landmarks, and reading order match the visual
   hierarchy; interactive elements use semantic controls rather than styled generic
   elements.
2. **Keyboard.** Every interactive element is reachable and operable by keyboard alone,
   in a logical order, with no trap.
3. **Focus.** Focus is visible, moves predictably on navigation and dialog/flyout
   open-close, and returns sensibly after a transient surface closes.
4. **Contrast and color.** Text and meaningful UI meet the acceptance bar's contrast
   ratios; no information is conveyed by color alone.
5. **Names, roles, states.** Accessible names, roles, and states are correct and
   update with the visible state (expanded/collapsed, selected, invalid, busy).
6. **Motion, zoom, reflow.** Reduced-motion, zoom/text-resize, and reflow at narrow
   widths do not clip, overlap, or lose content or function.
7. **Forced colors / high contrast.** The surface remains legible and operable under
   the platform's forced-colors or high-contrast mode.
8. **Status and errors.** Validation, loading, and error states are announced to
   assistive technology, not just shown visually.

## Method

- **Automated scan:** run the product's own existing accessibility scanning tool
  (commonly an axe-based check integrated into its E2E suite) if one exists; do not
  assume a specific package or introduce a new one without checking what the product
  already has.
- **Manual keyboard pass:** walk the flow using only the keyboard.
- **Assistive-technology spot check:** for a critical flow, verify with a screen reader
  or the platform's accessibility inspector, since automated scans do not catch every
  semantic or announcement defect.

Automated scans catch a subset of issues; a pass from a scanner alone is not a complete
audit.

## Severity and findings

- **Blocking:** the flow cannot be completed by keyboard or assistive technology, fails
  a required contrast/semantic rule, or actively misleads (wrong announced state).
- **Major:** materially harder to use with assistive technology or under
  reduced-motion/forced-colors/zoom, without fully blocking completion.
- **Minor:** localized polish that does not impede task completion.

For each finding, record: severity, WCAG criterion or acceptance-bar reference,
location, reproduction steps, and user consequence.

## Relationship to design ownership

Accessibility design decisions, tokens, and component behavior belong to FD. This skill
produces audit evidence and a pass/blocked verdict against the acceptance bar; it does
not redesign the surface or substitute for FD's design review. Route unresolved
design-level accessibility tradeoffs to FD and the DRI rather than deciding them here.

## Output

Conclude with **Pass** or **Blocked**, the finding list, and remaining risk if passed
with open minor findings. This verdict supports the DRI's landing decision.

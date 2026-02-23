# Motor City Math — WCAG Accessibility Reference

**Owner:** GA (Application Engineer)
**Design spec owner:** GD (Design Engineer)
**Last updated:** 2026-02-24

---

## Overview

MCM targets WCAG 2.1 Level AA. AAA items (like 2.3.3 reduced-motion) are implemented where feasible. This document lists all accessibility decisions, patterns, and known issues.

---

## Criterion Coverage

| Criterion | Level | Status | Notes |
|-----------|-------|--------|-------|
| 1.1.1 Non-text content | AA | Done | Canvas: `aria-label` on all graph canvases |
| 1.3.1 Info and relationships | AA | Done | Semantic HTML structure, labels on inputs |
| 1.4.1 Use of color | AA | Done | Color never sole differentiator |
| 1.4.3 Contrast | AA | Partial | `--fd-text-3` (#6E7681) fails on dark bg; FD notified |
| 2.1.1 Keyboard accessible | AA | Done | Canvas: Tab to focus, Arrow keys to move cursor, Enter to place point |
| 2.4.1 Bypass blocks | AA | Done | Skip link (`#main-content`) in `shared/styles.css` |
| 2.4.3 Focus order | AA | Done | DOM order = logical reading order |
| 2.4.7 Focus visible | AA | Done | `.focus-visible` outline; canvas gets `ring-2` cursor |
| 4.1.2 Name, role, value | AA | Done | `aria-expanded` on hint buttons, game plan button |
| 2.3.3 Animation from interactions | AAA | Done | `prefers-reduced-motion` guards on all transitions |
| 1.3.4 Orientation | AA | N/A | No orientation lock |

---

## Patterns

### Skip Link

```css
/* shared/styles.css */
.skip-link {
    position: absolute;
    left: -9999px;
    top: 4px;
    z-index: 999;
}
.skip-link:focus {
    left: 4px;
    transition: left 0.15s ease;
}
@media (prefers-reduced-motion: reduce) {
    .skip-link { transition: none; }
}
```

```html
<!-- First element in <body> -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

### Canvas Keyboard Nav (WCAG 2.1.1)

Canvas graph questions support keyboard input:
- `Tab` into canvas: gets `tabindex="0"`, cursor appears at center
- `Arrow keys`: move cursor by 1 grid unit
- `Enter`: place a point at current cursor position
- `aria-label`: describes the graph (e.g., "Graph canvas. Plot y = x². Tab to focus, arrow keys to position, Enter to place point.")
- `aria-live="polite"` region: announces placed points ("Point placed at (2, 4).")

### aria-expanded Pattern

Used for expandable content (not toggle buttons with aria-pressed).

```html
<!-- Hint button -->
<button class="hint-btn" aria-expanded="false" onclick="showHint(...)">
    <span aria-hidden="true">💡</span> HINT
</button>
```

When expanded: `aria-expanded="true"`.

```html
<!-- Game plan button -->
<button aria-expanded="false" onclick="revealGamePlan()">
    <span aria-hidden="true">📋</span> See Your Game Plan
</button>
```

### Decorative Emoji

Emoji alongside text are decorative. Wrap in `<span aria-hidden="true">`:

```html
<!-- Do this -->
<button><span aria-hidden="true">💡</span> HINT</button>
<a href="index.html"><span aria-hidden="true">📊</span> See the Board</a>

<!-- Not this -->
<button>💡 HINT</button>
```

Emoji in dynamic content (JSON feedback strings, hint text) are not wrapped — low impact, high complexity.

### Timer Live Regions

```html
<div class="timer" role="timer" aria-live="off" aria-label="Time remaining">...</div>
```

When timer enters warning/critical state, a `role="alert"` announcement fires once:
- Warning (≤30s): `aria-live="polite"` once: "30 seconds remaining."
- Critical (≤10s): `aria-live="assertive"` once: "10 seconds remaining."

### Position Tracker

```html
<div id="positionTracker" role="status" aria-live="polite" aria-label="Question 3 of 15. 2 questions answered.">
    Q3 of 15 • 2 done
</div>
```

Updates on each question navigation and each correct submission.

### Session Restore Toast

```html
<div class="session-restore-toast" role="alert" aria-live="assertive">
    Progress restored. Pick up where you left off.
    <button aria-label="Dismiss restore notification" class="restore-toast-close">×</button>
</div>
```

Auto-dismisses after 3000ms. Slide-in animation skipped when `prefers-reduced-motion`.

---

## prefers-reduced-motion

All animated elements have guards:

### shared/styles.css guards
- `.timer-critical` pulse: inside `@media (prefers-reduced-motion: no-preference)`
- `.skip-link` transition: `transition: none` in reduce block
- `.grade-a-flash`: inside `@media (prefers-reduced-motion: no-preference)`
- Sweep block at end of file: 10 interactive element classes `transition: none`

### exam.html inline guards
- `.correct-pulse` animation: `@media (prefers-reduced-motion: no-preference)` guard
- `.tracker-all-done` animation: `@media (prefers-reduced-motion: no-preference)` guard
- Session restore toast slide: class only applied when NOT `prefers-reduced-motion`

---

## Known Issues

| ID | Criterion | Description | Owner | Status |
|----|-----------|-------------|-------|--------|
| wcag-01 | 1.4.3 | `--fd-text-3` (#6E7681) fails on dark bg (3.52:1, need 4.5:1) | FD | FD message sent, awaiting response |
| wcag-02 | 1.4.3 | Typography tokens in index.html: size/weight hierarchy | FA | Needs FA consult |

---

## Testing Accessibility

Manual checks:
1. Tab through entire exam — confirm logical focus order, all controls reachable
2. Activate high-contrast mode — confirm no info lost
3. Toggle `prefers-reduced-motion: reduce` in DevTools — confirm no animation plays

Automated:
- `tests/f-validation/gp-aria-labels.test.js`: canvas aria-label presence (7/7)
- `tests/f-validation/gp-viewport-meta.test.js`: viewport meta present (all files)
- `tests/f-validation/design-compliance.spec.js`: Playwright WCAG checks (218/223)

---

## Authoring Rules

When adding new interactive elements:
1. Every `<button>` needs a text label or `aria-label`
2. Every expandable element uses `aria-expanded` (not `aria-pressed`)
3. Every animation needs a `prefers-reduced-motion` guard
4. Decorative emoji get `<span aria-hidden="true">`
5. Canvas elements get `tabindex`, keyboard handlers, and `aria-label`

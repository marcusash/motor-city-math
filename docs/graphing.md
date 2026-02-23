# Graphing — Canvas Implementation Notes

## Overview

Motor City Math uses HTML5 Canvas + Chart.js for interactive graphing questions. Graphs are rendered inside exam questions and optionally include key_points for auto-verification.

## Data Structure

Questions with graphs have a `graph_data` field:

```json
{
  "graph_data": {
    "type": "line",
    "labels": ["-3", "-2", "-1", "0", "1", "2", "3"],
    "datasets": [{
      "data": [9, 4, 1, 0, 1, 4, 9],
      "borderColor": "#1D42BA",
      "fill": false
    }],
    "key_points": [
      { "x": 0, "y": 0, "label": "vertex" },
      { "x": 2, "y": 4, "label": "point" }
    ]
  }
}
```

## Key Points Verification

`key_points` are verified by `tests/gp-graph-keypoints.test.js`:
- Each key_point `(x, y)` must exist in the `datasets[0].data` at the corresponding `labels` index
- Tolerance: ±0.01 (graphs are pixel-precise)

## Chart.js Version

MathJax + Chart.js v3.x are loaded from `shared/` (local bundles, not CDN). Pre-commit hook checks for CDN drift.

## Accessibility

Canvas elements require:
```html
<canvas id="graph-q1" aria-label="Parabola graph for question 1" role="img">
```

6 missing aria-labels found in current audit (filed to GA — see `tests/gp-aria-labels.test.js`).

## Print Behavior

Graphs should render in `@media print`. 2 HTML files missing print CSS (filed to GA).

## Design Specs

- Line color: `#1D42BA` (Pistons blue) for primary function
- Background: white (no dark mode for graphs — readability)
- Grid lines: `#BEC0C2` (chrome)
- Key point markers: `#C8102E` (Pistons red) dots

See `.chart-spec.md` and `.design-system.md` for full visual spec.

---

*Owner: GA (implementation) + GP (key_point verification) | Last updated: 2026-02-23*

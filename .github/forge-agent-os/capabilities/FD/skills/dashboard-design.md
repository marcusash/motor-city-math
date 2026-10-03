# FD Dashboard Design

## Trigger

Load when creating or reviewing an operational dashboard, scorecard, health view, or
status summary.

## Required inputs

- The audience and the decisions they must make.
- The real data source, freshness, units, and empty/error states.
- The current product design authority and supported themes.
- The canonical Forge tokens when the product consumes Forge styling.

## Method

1. Write the decision question the dashboard must answer.
2. Rank information into one primary signal, supporting signals, and detail.
3. Give each visual channel one meaning. Reserve identity color for attribution and
   semantic color for state.
4. Limit a card to one value, one label, and one useful context item.
5. Prefer direct labels over legends and concise rows over prose.
6. Show source and freshness wherever stale data could change a decision.
7. Design loading, empty, partial, stale, and error states before polish.

Choose light or dark presentation from the product context. Neither theme is a universal
dashboard default. Use the theme and semantic values defined by current authority rather
than values remembered from prior work.

## Output

Produce a rendered dashboard or implementation-ready specification containing:

- audience and decision statement;
- information hierarchy and component inventory;
- data definitions, units, source, and freshness;
- interaction and responsive behavior;
- state model, including failure states;
- accessibility notes and acceptance evidence.

## Accessibility and quality gate

- Meet WCAG AA contrast for text, controls, focus indicators, and meaningful graphics.
- Never rely on color alone; pair state with text, shape, icon, or pattern.
- Preserve reading and focus order across responsive layouts.
- Give charts a text equivalent or accessible data table.
- Support keyboard operation, zoom, reflow, reduced motion, and forced-colors behavior.
- Test with real content, long labels, missing values, and extreme values.
- Render at representative narrow and wide viewports and inspect screenshots before
  approval.

## Canonical dependencies

Use `packages/design-tokens/tokens.json` as Forge token authority and
`packages/design-tokens/forge-tokens.css` as its generated CSS. Use
`docs/design/system/` only when building a Forge HTML canvas. Product-specific marks and
assets come from the repository-relative location named by that product's current design
authority. If no canonical asset is named, report the missing dependency instead of
reconstructing or copying one.

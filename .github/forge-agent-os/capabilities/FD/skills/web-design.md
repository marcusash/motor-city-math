# FD Web Design

## Trigger

Load when designing or reviewing a responsive web page, web application surface, or
Forge HTML canvas.

## Foundations

1. Start with the user task and content hierarchy.
2. Use semantic HTML before adding custom presentation.
3. Consume the current product design system and tokens. For Forge surfaces, consult the
   component reference library at `docs/components/index.html`.
4. Design mobile and narrow-window behavior deliberately, not as a shrink pass.
5. Define all interactive and data states before visual polish.
6. Prefer progressive enhancement and resilient content delivery.

## Typography and layout

- Use canonical typography and spacing tokens rather than local scales.
- Keep body text comfortably readable and line length bounded.
- Allow text to wrap, zoom, and reflow without clipping or horizontal page scrolling.
- Preserve hierarchy with structure, spacing, and weight rather than size or color alone.
- Test long strings, localization expansion, empty content, and user-generated content.

## Interaction and accessibility

- Meet WCAG AA and use the product's higher standard when one exists.
- Ensure complete keyboard access, visible focus, skip navigation where needed, and
  logical heading and landmark structure.
- Provide accessible names, instructions, validation, and status announcements.
- Do not rely on hover, color, motion, or pointer precision alone.
- Honor reduced motion, forced colors, contrast preferences, zoom, and text resizing.
- Use responsive targets and spacing suitable for touch and pointer input.

## Performance and resilience

- Reserve layout space to avoid disruptive shifts.
- Optimize images and fonts through the existing build pipeline.
- Avoid animation and script that delay the primary task.
- Design loading, partial, offline, empty, and error behavior.
- Test with representative network and content conditions when the product depends on
  remote data.

## Canonical dependencies

For Forge HTML canvases, use `packages/design-tokens/forge-tokens.css` and the applicable
resources in `docs/design/system/`. Read token authority from
`packages/design-tokens/tokens.json`; never copy its values into this skill. Product
marks and images come from repository-relative files named by current product design
authority.

## Output and gate

Deliver a rendered responsive surface or implementation-ready specification with content
hierarchy, states, interaction behavior, accessibility notes, canonical dependency
pointers, and acceptance criteria. Validate with real content, existing automated checks,
keyboard use, and inspected screenshots at representative viewports.

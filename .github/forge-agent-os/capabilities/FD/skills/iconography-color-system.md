# FD Iconography and Color Systems

## Trigger

Load when defining or reviewing visual identity, icon grammar, color semantics, or theme
behavior.

## Authority first

For Forge values, read `packages/design-tokens/tokens.json`. Consume
`packages/design-tokens/forge-tokens.css` rather than copying token literals. For a
product, read the current product design authority and use the canonical
repository-relative mark and asset files it names. A skill file is never the source of
truth for color values or SVG geometry.

For the Forge Canvas viewport mark, use the locked implementation in
`docs/design/system/canvas-watermark.js`; reference it rather than redrawing it. Other
Forge and product marks still require the canonical file named by their current design
authority.

Do not invent, redraw, or substitute a missing locked mark. Treat missing authority as a
blocking dependency.

## Icon system method

1. Define the concepts the system must distinguish.
2. Choose a shared grammar: grid, optical size, stroke or fill model, corner treatment,
   detail density, and state behavior.
3. Explore several structurally different concepts in context.
4. Test monochrome first and at the smallest shipping size.
5. Validate recognition, distinctness, and cultural interpretation with users.
6. Document source, usage, accessible name, and prohibited substitutions.

Interface icons communicate actions or objects. Brand marks identify. Do not use a logo
as an action glyph or a generic library icon as a replacement brand mark.

## Color system method

1. Assign roles before choosing values: surfaces, text, borders, accents, identity, and
   semantic states.
2. Give each role one stable meaning across themes.
3. Use identity color for attribution, not arbitrary emphasis.
4. Pair semantic color with text, shape, icon, or pattern.
5. Define theme overrides through tokens; do not fork component rules by hardcoded value.
6. Validate combinations in context, including overlays, disabled states, charts, and
   focus indicators.

## Accessibility gate

- Meet WCAG AA contrast for text and controls; validate meaningful non-text graphics.
- Support forced colors and user contrast preferences without hiding state.
- Keep focus visible and distinct from selection.
- Ensure color vision differences do not collapse important distinctions.
- Avoid flashing and honor reduced-motion settings.
- Test marks and icons at small sizes, display scaling, and both supported themes.

## Output

Produce a role map, token proposal or usage map, icon grammar, canonical asset pointers,
accessibility results, and explicit approval requirements for locked changes. Never copy
the canonical token values or mark geometry into the output when a pointer is sufficient.

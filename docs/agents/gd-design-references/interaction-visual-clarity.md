# MCM Interaction and Visual Clarity

Animation, feedback states, anti-patterns, and dark mode rules for MCM.

## Animation Standards

All MCM animations must:
1. Use CSS custom properties for duration (no hardcoded values)
2. Respect `prefers-reduced-motion: reduce` — if this is set, all transitions must collapse to 0ms
3. Use the approved easing curve

### Approved Values

| Type | Duration | Easing |
|------|----------|--------|
| Micro-interaction (tap, toggle) | 150ms | `cubic-bezier(0.25, 1, 0.5, 1)` |
| State transition (correct/incorrect) | 200ms | `cubic-bezier(0.25, 1, 0.5, 1)` |
| Panel slide, modal enter | 250ms | `cubic-bezier(0.25, 1, 0.5, 1)` |
| Anything longer | DO NOT USE | — |

### Named Animations in MCM

| Name | Trigger | Duration | What it does |
|------|---------|----------|--------------|
| `correct-pulse` | Correct answer submitted | 200ms | Brief green border pulse on the input area |
| `grade-a-flash` | Score reaches 92%+ | 250ms | Score number flashes Pistons Blue |
| `autosave-toast` | Progress saved to localStorage | 150ms | Toast fades in, holds 1200ms, fades out |

### Derivation Rule

Never add an animation without answering three questions:
1. **Need:** What user problem does this solve? (Feedback? Progress? Error?)
2. **Mechanism:** What CSS property changes? (opacity, transform, border-color)
3. **Value:** What duration and easing is appropriate for this magnitude of change?

If you cannot answer all three, the animation is decoration, not design.

## Feedback State System

### Correct Answer

- Border: changes to `--color-correct` (#22C55E or token)
- Text: stays neutral (do NOT turn all text green)
- Animation: `correct-pulse` 200ms
- Copy: 8-12 words max, specific to what was right ("Good — you factored the coefficient correctly.")
- Duration: feedback stays visible until Kai advances

### Wrong Answer

- Border: changes to `--color-incorrect` (#C8102E or token)
- Input: does NOT clear automatically (Kai needs to see his answer)
- Copy: 8-12 words, identifies the error without solving for him ("The exponent rule applies to both terms.")
- Next action: show hint trigger (do not auto-show hint — cognitive overload)
- Post-wrong nudge: after 2+ wrong attempts on same question, show "Want a hint?" micro-CTA

### No Answer / Empty Submit

- Visual: border stays neutral, input shakes 150ms
- Copy: "Enter your answer to continue" (simple, not punitive)
- No score penalty for attempting (ADHD rule: do not punish false starts)

### Loading / Processing

- Never block the exam for more than 200ms
- If saving to localStorage: silent (no spinner — localStorage is fast)
- If anything takes >200ms: show a muted spinner, not a blocking overlay

## Anti-Patterns to Audit

These patterns appear in early MCM builds and violate design direction. Flag any of these in a spec:

| Anti-pattern | Why it fails | MCM fix |
|-------------|-------------|---------|
| `box-shadow: 0 4px 16px rgba(0,0,0,0.3)` | Dramatic shadows on flat design | Remove. Use border for depth. |
| `border-radius: 20px` on small elements | Large radius on dense UI looks puffy | Cap at 8px for cards, 4px for inputs |
| Pure white cards (`#FFFFFF`) on light blue background | Glare, unclear hierarchy | Use `--bg-card` token (slightly off-white) |
| `border: 3px solid` decorative borders | Thick borders read as loading states | 1px for UI, 2px for active focus only |
| `animation: bounce 0.8s infinite` | Bouncy animations suggest instability | MCM animations do not bounce |
| Decorative gradients | Adds noise to information-dense UI | Solid fills only |
| Two accent colors visible simultaneously | Splits visual attention | One accent per screen state |
| Generic feedback copy ("Great job!") | Not specific, not MCM voice | Always reference the math |
| `opacity: 0.7` on placeholder text | Often fails contrast | Set explicit `color: var(--text-muted)` |
| Raw `em`/`px` in CSS instead of tokens | Breaks when tokens change | Always use `--text-*` tokens |

## Dark Mode (Arena Mode)

Arena Mode uses a dark background. Rules specific to dark mode:

### Color Adjustments

| Element | Light mode | Dark mode |
|---------|-----------|----------|
| Card background | `--bg-card` (~#F8F9FA) | `--bg-dark-card` (#1E1E2E) |
| Border | `--border-input` | `--border-input-dark` (lighter, same semantic) |
| Body text | `--text-primary` (#111827) | `--text-primary-dark` (#E8E8F0) |
| Pistons Red | `#C8102E` (fill OK on white) | Border / accent only (too harsh as fill) |
| Pistons Blue | `#1D42BA` (fill OK on white) | Border / accent only |
| Error state | `--color-incorrect` (#C8102E) | `--color-incorrect-dark` (slightly desaturated) |

### Architecture Rule

Arena Mode dark styling is achieved by adding `[data-theme="dark"]` attribute to `<body>`. All dark tokens are defined under this selector. Never use inline style overrides for dark mode — always use the token system.

## Contrast Hierarchy (4 Levels)

MCM content is information-dense. Visual hierarchy is achieved through contrast levels, not size alone.

| Level | Contrast vs background | Usage |
|-------|----------------------|-------|
| Foreground | 7:1+ | Primary labels, question text, score numbers |
| Secondary | 4.5:1 | Card headings, button labels, active nav |
| Muted | 3.5:1 | Captions, metadata, timestamps, disabled labels |
| Faint | 2.5:1 | Decorative dividers, placeholders (only where non-interactive) |

**Rule:** Interactive elements MUST be at Secondary or Foreground level. Muted and Faint are for non-interactive content only.

## Focus Ring Standards

All interactive elements must have a visible focus ring that is not the browser default.

| Context | Color | Width | Style |
|---------|-------|-------|-------|
| Light mode | `#4A90D9` | 2px | solid, 2px offset |
| Dark mode | `#7CB9E8` | 2px | solid, 2px offset |

**Note:** `#1D42BA` (Pistons Blue) on white = 2.09:1 FAIL. Use `#4A90D9` for light mode focus rings.

Focus rings must appear on `:focus-visible` (not `:focus`) to avoid showing on mouse click while remaining visible for keyboard users.

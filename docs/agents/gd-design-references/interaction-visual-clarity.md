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

---

## MCM-Specific Notes (Added Sprint 8)

### The Post-Wrong Moment

The moment after Kai gets an answer wrong is the highest design-risk moment in the exam. Potential outcomes:
1. Kai re-reads the question and tries again (ideal)
2. Kai guesses randomly to get past the question (common under time pressure)
3. Kai disengages entirely (ADHD pattern under repeated failure)

Design responses for each:
1. Clear error border + specific feedback copy ("The exponent rule applies to both terms, not just the variable.")
2. After 2+ wrong: show "Want a hint?" micro-CTA (not auto-hint -- keeps Kai's agency)
3. Auto-rescue at 3 wrong: hint reveals automatically with aria-live announcement

The `auto-rescue` threshold is 3 attempts, not 2. This was specified in sw-04 (hint reveal state machine).

### Toast Spec Protocol (Post Sprint 8)

When writing any toast or notification spec, always explicitly state:
1. Auto-dismiss: yes/no + duration
2. Manual dismiss: yes/no + method (click X, click anywhere, etc.)
3. What happens if the user is mid-interaction when the toast appears

Missing any of these forces GA to make an undocumented decision. If GA makes the right call (like adding the X button), document it retroactively in the spec.

### ADHD Interaction Principles (Active in MCM)

| Principle | Applied in MCM |
|---|---|
| One CTA at a time | Post-exam shows one CTA based on score bracket, not a row of buttons |
| Max 12 words per feedback | Enforced in error copy spec (da-10), monitored in GR content audits |
| No walls of text | Solution steps are collapsible and off by default |
| Show progress position | Position tracker: 'Q7 of 15 • 6 done' |
| Timer shows remaining, not elapsed | Timer spec (sw-08) explicitly requires countdown, not count-up |
| Do not punish false starts | Empty submit: muted shake, no score penalty, no harsh copy |

### Emoji Usage Rules (Post Sprint 8)

All decorative emoji in exam.html and index.html are wrapped:
```html
<span aria-hidden="true">🏀</span>
```

Dynamic emoji from JSON (fb_correct, hint text): left unwrapped (screen readers should announce them as they are contextual feedback).

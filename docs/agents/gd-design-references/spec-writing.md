# GD Spec Writing Guide

How GD writes specs that GA can actually build. The "format and quality bar" file.

## The Core Format

Every GD spec filed to GA must have all eight sections. No exceptions.

```
## [Spec ID]: [Title]
**Priority:** P2 Bug / Medium UX / Low Polish
**Filed:** YYYY-MM-DD
**Affects:** [filename.html], [shared/styles.css]

### Problem
One paragraph. What is broken or missing? Why does it matter for Kai?
State the user symptom, not the code symptom.

### Behavior Spec
What must the fixed state DO? Not how — what.
Write in present tense: "The focus ring appears on Tab press."

### State Machine (required for reactive components)
States: [list all states]
Transitions:
- idle -> active: [trigger]
- active -> correct: [trigger]
- active -> error: [trigger]
- error -> idle: [trigger]
Variables: [list state variables and their types]
Edge cases: [list edge cases that must be handled]

### Visual Spec
Exact values. No "approximately" or "slightly."
Use token names, not hex values. If the token doesn't exist, define it here.

### Copy
Exact strings for any text in the component.
Label each string: "Empty state label:", "Error message:", "CTA button:"

### Acceptance Criteria
Numbered. Each must be independently verifiable.
1. Tab to [element], focus ring appears at [size] [color].
2. Submit empty form, border turns [color], message reads exactly "[text]".
3. prefers-reduced-motion: no animation fires.

### What NOT to Change
List adjacent elements that should remain unchanged.
Prevents scope creep and regression.

### Related Specs
List any other specs that share state or tokens with this one.
```

## State Machine Requirement

**All reactive component specs must include a state machine.** This is the single most important lesson from FD's Sprint 4 spec fidelity audit.

A reactive component is any element that:
- Changes appearance based on user input
- Has multiple visual states (idle, hover, focus, active, error, disabled, success)
- Holds internal state (open/closed, value/empty, valid/invalid)

Without a state machine, GA has to infer states from the visual spec. They always get at least one state wrong.

State machine minimum format:
```
States: idle | loading | correct | incorrect | hint-shown
Variables:
  - attemptCount: number (starts at 0)
  - currentHint: string | null
  - answerLocked: boolean
Transitions:
  - idle -> loading: user submits answer
  - loading -> correct: answer matches expected (case-insensitive, trimmed)
  - loading -> incorrect: answer does not match
  - incorrect -> hint-shown: attemptCount >= 2 AND user clicks "Want a hint?"
  - correct -> idle: user advances to next question (attemptCount resets)
Edge cases:
  - Empty submit: stay in idle, shake animation 150ms
  - Session end: lock all inputs, show scorecard CTA
```

## Priority Levels

| Priority | What it means | File to: |
|----------|--------------|---------|
| P2 Bug | WCAG failure, broken state, data loss risk | GA inbox, flag as P2, do not batch |
| Medium UX | Suboptimal but functional, notable UX gap | GA inbox, batch in weekly spec package |
| Low Polish | Cosmetic, nice-to-have | GA inbox, batch in low-priority queue |

Never downgrade a WCAG failure to Medium. If it fails WCAG, it is P2.

## Tone Requirements

Write specs to GA in peer-to-peer professional tone. Not directives. Not suggestions. Clear problem statements and clear requirements.

Good: "The focus ring color `#1D42BA` on white fails WCAG 2.4.11 at 2.09:1. Fix: use `#4A90D9` (4.5:1 on white)."
Bad: "Maybe the focus ring could be a bit more accessible?"
Bad: "Please fix the blue color, it seems off."

## Spec Checklist (Run Before Filing)

- [ ] Problem statement names the user impact, not just the code issue
- [ ] State machine included (if reactive component)
- [ ] All values are exact (tokens or hex, not "approximately")
- [ ] Copy is exact strings, not paraphrases
- [ ] Acceptance criteria are independently verifiable
- [ ] "What NOT to change" section is populated
- [ ] Priority level is correctly assigned
- [ ] WCAG check: have I checked contrast, focus, label presence?
- [ ] Voice check: is all copy in MCM voice?
- [ ] Anti-slop check: is there a simpler way to solve this?

## Learning: The FD Spec Fidelity Audit (2026-02)

FD ran a formal spec fidelity audit on their own specs. Findings:
- 60% of specs with reactive behavior had incomplete state coverage
- Missing states led to GA making implementation decisions that should have been design decisions
- After adding state machines: GA implementation accuracy improved significantly

GD adopts the same practice. Every reactive spec gets a state machine. No exceptions.

## Filing Protocol

1. Create a JSON message in `.agent-comms/grind/inbox-GA/`
2. File name format: `YYYYMMDD-HHMM-from-GD-[spec-name].json`
3. JSON fields: `from`, `to`, `project`, `type` (`"spec"`), `priority`, `subject`, `body`, `files` (if attaching a markdown spec), `created`
4. For P2 bugs: also post a short summary to your next 1:1 update so Marcus knows

---

## GD Personal WCAG Protocol (8 Steps)

Run this before finalizing any audit or spec. Takes < 5 minutes.

**Step 1: Color contrast (text)**
- Use WebAIM contrast ratio formula or calculate by eye
- Check: primary text (7:1+), secondary text (4.5:1+), muted text (3.5:1+)
- Tool: calc L1 = (r/255)^2.2 adjusted, L2 = same, ratio = (L1+0.05)/(L2+0.05)

**Step 2: Focus ring (keyboard)**
- Visible focus ring on all interactive elements
- Non-text contrast: 3:1 against adjacent backgrounds (WCAG 2.4.11)
- Check: Tab through all interactive elements

**Step 3: Label coverage**
- All form inputs have `<label for=...>` OR `aria-label` OR `aria-labelledby`
- All icon buttons have `aria-label`

**Step 4: Color-only information**
- No state communicated ONLY through color
- Check: correct/incorrect -- have checkmark/X as well as color

**Step 5: Animation**
- All transitions have `prefers-reduced-motion` guard
- No autoplay animation with motion that could cause vestibular distress

**Step 6: Keyboard navigation**
- All interactive elements reachable by Tab
- All interactive elements operable by Enter/Space
- Focus order is logical (not DOM-order violations)

**Step 7: Screen reader**
- Decorative emoji/icons: `aria-hidden='true'`
- Dynamic content regions: `aria-live` (polite or assertive as appropriate)
- State changes: `aria-expanded`, `aria-checked`, `aria-selected` as appropriate

**Step 8: Token documentation**
- New color tokens documented in .design-system.md Section 17 (WCAG table)
- Token added to correct namespace (shared vs --fd-*)

---

## GD Spec Quality Protocol (Sprint 8 Update)

What separates a good GD spec from a mediocre one:

**Good spec:**
- GA ships it without asking a single clarification question
- GD's QA pass finds the AC met exactly
- No scope creep -- GA doesn't implement things not in the spec

**Mediocre spec:**
- GA makes implementation decisions that should have been design decisions
- GD QA finds edge cases not covered in the AC
- "What NOT to change" section is thin or missing

**Quality gates:**
1. For reactive specs: state machine is complete (every state named, every transition listed)
2. All color values are exact (hex or token, not "approximately navy")
3. All copy values are exact strings, not paraphrases
4. AC items are individually testable (GF can write a test for each AC)
5. Generation brief filename included in content specs (new: Sprint 8 protocol)
6. JSON field names listed explicitly in chart specs (new: Sprint 8 protocol)

---

## Git Retrospective (Sprint 7-8 Commits)

Reviewed 14 recent GD commits. Pattern analysis:

**Improving:**
- Commit message specificity: spec IDs now in commit message bodies
- QA pass confirmations: explicit PASS/FAIL with AC reference

**Still inconsistent:**
- Some QA passes filed separately (one commit per spec) vs batch
- Batch commits obscure traceability when searching git for a specific spec
- Rule going forward: one commit per spec TYPE (all P2 specs together, all QA passes together)

**GA's implementation speed:**
GA is turning around specs in <2 hours. This means GD spec quality is the bottleneck, not implementation. Focus on spec completeness, not speed.

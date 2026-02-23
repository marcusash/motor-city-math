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

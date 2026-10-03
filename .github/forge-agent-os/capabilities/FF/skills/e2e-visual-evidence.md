# E2E and Visual Evidence

## Trigger

Load when producing an end-to-end run or visual regression evidence for a change that
affects a user-facing flow or rendered surface.

## Purpose

Unit and integration tests verify logic in isolation. E2E evidence verifies that a real
user flow works through the assembled system, and visual evidence verifies that what
actually renders matches intent — neither is provable by passing unit tests alone.

## Steps

1. **Pick the flow, not the whole surface.** Use the risk plan
   (`risk-based-test-planning.md`) to choose the critical path(s) this change could
   break — the flow a user actually completes, not every possible screen.
2. **Discover the product's own tooling.** Find the existing E2E/browser-automation
   setup (commonly Playwright for web surfaces, but confirm rather than assume), its
   config, and its existing baseline/snapshot mechanism before writing a new one. Do not
   invent a new tool, path, or vision-model dependency the product does not already use.
3. **Run against representative data and states.** Realistic content, not placeholder
   strings; include loading, empty, error, long-content, and responsive-breakpoint
   states when the change can affect them — see FD's `skills/FD/web-design.md` and
   `skills/FD/interaction-design.md` for the states a UI should define, without
   duplicating their token or component detail here.
4. **Capture deterministic evidence.** The flow exercised, the command run, pass/fail
   per state, and screenshot or artifact paths sufficient for another reviewer to
   inspect the same run without re-deriving it.

## Visual regression discipline

- Compare rendered output against the product's own committed baseline, not a
  freshly-generated "expected" image from the same run.
- A visual diff is a signal, not an automatic verdict: an intentional design change
  should update the baseline through the product's normal review, and a design-direction
  question routes to FD — FF's role is to surface the diff with evidence, not to decide
  whether a visual change is correct.
- For Forge-brand or design-system surfaces, verify against FD's canonical tokens and
  component reference (`packages/design-tokens/tokens.json`,
  `packages/design-tokens/forge-tokens.css`, `docs/components/index.html`) by reference;
  never copy their values into this skill or into ad hoc comparison logic.

## Flake control

Apply `failure-triage.md`'s root causes to E2E specifically: deterministic waits for
actual application state rather than fixed sleeps, isolated test data per run, and no
shared mutable fixtures across parallel workers. An E2E suite that is flaky is not
usable evidence.

## Output

An evidence bundle: flow(s) tested, states covered, pass/fail per state, screenshot or
artifact paths, and baseline comparison result (match, accepted diff with owner, or
unresolved diff routed to FD/the DRI). This evidence supports the DRI's landing decision
and does not itself approve or reject a visual design change.

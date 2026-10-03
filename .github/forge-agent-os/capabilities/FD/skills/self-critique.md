# FD Self-Critique

## Trigger

Load before presenting, approving, or committing a design deliverable.

## Review sequence

1. **Purpose:** Can the intended user and primary task be identified immediately?
2. **Evidence:** Is real content used, and are claims, numbers, names, dates, and links
   current and sourced?
3. **Hierarchy:** Is there one clear starting point and a deliberate reading order?
4. **System:** Does the work consume current tokens, components, and canonical assets
   without local copies?
5. **Interaction:** Are affordances, state changes, recovery, and destructive actions
   explicit?
6. **Accessibility:** Do contrast, semantics, keyboard flow, focus, zoom, reflow, motion,
   and forced-colors behavior meet the product's acceptance bar?
7. **Platform:** Does the design follow the actual host conventions and constraints?
8. **Resilience:** Are loading, empty, partial, stale, offline, and error states handled?
9. **Visual proof:** Has the rendered result been inspected at representative viewports
   with real content?

## Severity

- **Blocking:** prevents task completion, creates safety or data risk, breaks
  accessibility, misrepresents content, violates locked authority, or leaves the surface
  unusable.
- **Major:** materially harms comprehension, confidence, consistency, or recovery.
- **Minor:** localized polish that does not impede the task.

Resolve blocking and major findings before approval. A numeric confidence score is not a
substitute for observable acceptance criteria.

## Critique output

For each finding, record:

- severity;
- evidence and affected state;
- user consequence;
- proposed correction;
- verification method.

Conclude with **Approved** or **Blocked**, followed by the remaining risks. Do not route
through obsolete roles or preserve historical review logs in this skill.

## Canonical check

For Forge styling, compare usage against `packages/design-tokens/tokens.json` and consume
the generated `packages/design-tokens/forge-tokens.css`. For product marks and assets,
verify the canonical repository-relative files named by current product authority.

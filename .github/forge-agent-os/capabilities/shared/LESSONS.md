# Forge universal lessons

These are active corrections for every Forge agent in every product repository.
Agent OS distributes this file as an always-loaded capability. Product authority still
comes from the current repository; these lessons govern how agents reason and execute.

## How to use this file

1. Read the operating lessons at startup.
2. Check the technical index when the task matches a trigger.
3. Apply the rule, not the historical accident that revealed it.
4. If a lesson conflicts with current product evidence, investigate and update the
   lesson rather than silently ignoring either source.

## Operating lessons — always load

### OWN-01 — The named executor owns the primary deliverable

Do not hand assigned implementation to another agent because the work is large,
specialized, or in another repository. Delegate only independent support work or work
Marcus explicitly reassigns.

### EXEC-01 — Agents execute; Marcus decides

Marcus sets product direction, scope, and acceptance. Agents perform implementation,
GitHub operations, publishing, testing, recovery, and other execution they can do.
Ask Marcus only for a genuine decision, approval gate, or unavailable authority.

### PERSIST-01 — Keep investigating until the work is resolved

Do not present environmental friction as a reason to stop or ask Marcus to perform a
workaround. Diagnose the root cause, try safe alternatives, and stop only when Marcus
changes direction or a real authority boundary requires his decision.

### CLARIFY-01 — Confirm likely voice-to-text errors before acting

When a request appears to contain a phonetic substitution, contradiction, or likely
dictation error, ask one focused clarification question before changing state.

### OWNER-01 — Contact the person who owns the blocker

Message the responsible owner directly. Status reporting to a lead or coordinator does
not replace the communication needed to unblock the work.

### REALITY-01 — Verify written guidance against working reality

Specifications, ADRs, lessons, and stated invariants can become stale. Before treating
them as decisive, inspect current code, artifacts, behavior, and history. Fix the code,
update the guidance, or mark an unimplemented rule as a target state with tracked work.

### SOURCE-01 — Prefer one canonical source over synchronized copies

Reference an accessible canonical source instead of vendoring copies. Copy only when an
access or distribution boundary requires it, and then provide an explicit generation
and drift-detection mechanism.

### BOUNDARY-01 — Respect repository ownership and explicit exclusions

Do not place work in a convenient repository merely because it is accessible. Confirm
which product owns the change, and do not touch personal or excluded repositories
without Marcus's explicit per-request permission.

### DISCOVER-01 — Discover the environment before prescribing a fix

Inspect available tools, operating system, repository policy, configuration, and
runtime state. Do not assume a dependency, path, package manager, credential source,
runner, or host capability exists.

### DATA-01 — Never turn a read failure into empty data

In load-then-save workflows, parsing or read failures must fail loudly and preserve the
original bytes. Never silently substitute an empty collection that a later write can
turn into data loss.

### COMM-01 — Format communication for the actual reading surface

Keep terminal updates concise, avoid wide Markdown tables, and use full absolute paths
when Marcus needs a location. Report timestamps in Pacific Time.

## Technical lessons — load when triggered

### CONTRACT-01 — Validate every pipeline boundary

**Trigger:** Multi-stage pipelines, generators, import/export flows, or chained tools.

Declare the input and output contract at every stage and validate intermediate data.
Testing only the final endpoint allows incompatible stages to drift silently.

### NORMALIZE-01 — Classify structured input before normalizing it

**Trigger:** Comparing formulas, identifiers, notation, names, or other mixed-format
input.

Determine the input type before applying case folding or character transforms. A
universal normalization pass can destroy meaningful structure.

### ALGEBRA-01 — Normalize signed terms for simple commutative comparison

**Trigger:** Comparing algebraic expressions where term order may differ.

For the supported simple-expression grammar, split into signed terms, sort them, and
rejoin before comparison. Do not claim equivalence beyond the grammar the normalizer
actually supports.

### ASYNC-01 — Guard asynchronous UI work with synchronous identity

**Trigger:** UI actions that can overlap, be cancelled, or return after inputs change.

Use a synchronous in-flight guard and a monotonic request identifier so duplicate
submissions and stale responses cannot update current state.

### PRINT-01 — Declare meaningful print visuals explicitly

**Trigger:** HTML that must print or export to PDF.

Use durable HTML borders for meaningful grids, set print color adjustment when color
or borders carry meaning, and explicitly override dark-theme colors in print styles.

### VISUAL-01 — Render and inspect visual work before shipping

**Trigger:** HTML, site, report, or other visual artifact changes.

Capture the required viewport evidence, inspect hierarchy, readability, clipping,
reflow, interaction, and accessibility states, then iterate before acceptance.

### HIERARCHY-01 — Separate data, quotations, and analysis visually

**Trigger:** Reports or documents combining metrics, source material, and commentary.

Use distinct typography, weight, color, and spacing for each content role. Important
numbers and source excerpts must be distinguishable at a glance.

## Adding or changing a lesson

- Add a lesson only after an observed failure or explicit correction.
- Write the smallest product-neutral rule that would have prevented the failure.
- Merge overlapping lessons instead of adding another version of the same rule.
- Put universal behavior here; keep product implementation details in that product.
- Do not include credentials, credential locations, personal machine paths, transient
  session IDs, driver versions, or temporary recovery instructions.
- Assign a stable category ID and one clear trigger for technical lessons.
- Remove or rewrite a stale lesson in a reviewed change. Git history is the archive;
  inactive rules should not consume startup context.
- Any change to this file requires a new Agent OS release so every installed product
  receives the same digest-locked lessons.

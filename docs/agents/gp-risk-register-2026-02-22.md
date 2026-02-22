# GP Risk Register - 2026-02-22

1. RP6 answer-collision residuals.
   - Impact: false confidence in practice quality.
   - Mitigation: keep `gp-autq-10c` pending and rerun smoke immediately after GR patch.

2. Dirty multi-agent working tree collisions.
   - Impact: accidental overwrite of active agent changes.
   - Mitigation: GP only touches low-conflict files and commits narrowly scoped paths.

3. Publish pipeline dependency on token/runtime.
   - Impact: delayed site updates.
   - Mitigation: manual `scripts/publish.cjs` remains primary fallback; workflow stays dispatch-only.

4. Inbox drift under asynchronous load.
   - Impact: missed directives.
   - Mitigation: run `scripts/gp-inbox-sla.ps1` each cycle and prioritize critical/high.

5. Legacy roster references in historical docs.
   - Impact: onboarding confusion.
   - Mitigation: keep core docs canonical; track historical doc cleanup as non-blocking backlog.

# Shared capability index (distributed)

Cross-role skills approved for distribution into product repositories. This is a narrower, cleaned subset of the full `skills/shared/` set maintained in the Forge repository — files kept out of this bundle reference private Forge-only infrastructure, Marcus-specific operational detail, or Forge-internal coordination process, and are not portable capability guidance. See `packages/agent-os/resources/audit/shared-capability-audit.json` in the Forge repository for the explicit include/exclude decision and reason for every candidate file.

Always load `LESSONS.md` at startup. It is mirrored from Forge's canonical universal lessons source and is not an optional task-specific skill.

| Skill | When to load |
|---|---|
| `LESSONS.md` | Always load before taking action. |
| `document-versioning.md` | See file for "when to load" guidance. |

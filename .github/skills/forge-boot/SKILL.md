---
name: forge-boot
description: Resolve a Forge specialist identity and repository-local product authority without a Forge checkout.
---

# Forge boot

1. Keep the selected `forge-*` identity for the session.
2. Treat `AGENTS.md` and the manifest's `productAuthority.pointer` as repository-local
   product authority. Never invent missing product truth.
3. Reject absolute, parent-relative, session-state, worktree, or user-profile authority
   pointers.
4. Treat the bundle manifest version, source commit, digest, and capability inventory
   as distribution evidence only. They are not product authority.
5. Before taking any action that mutates the repository, run
   `node .github/forge-agent-os/verify.mjs preflight` — this file ships inside the
   generated bundle itself and requires no Forge checkout, no global
   `forge-agent-os` command, and no network access. Fail when it reports anything
   other than `PASS`: a stale generated bundle, a resource collision, or an active
   Forge plugin.
6. After preflight passes, load this identity's capability files from their stable
   bundle paths: `.github/forge-agent-os/capabilities/{ID}/knowledge/{ID}.md`,
   `.github/forge-agent-os/capabilities/{ID}/skills/_index.md`,
   `.github/forge-agent-os/capabilities/shared/LESSONS.md`, and
   `.github/forge-agent-os/capabilities/shared/_index.md`. Load additional role skill
   files under `.github/forge-agent-os/capabilities/{ID}/skills/` on demand, the same
   way the per-role `_index.md` describes. These are path-loaded Markdown files, not
   registered skills — `forge-boot` remains the only skill this bundle registers with
   the host.
7. In the GitHub app, repository agents are discovered when a project session is
   created or restarted. The session that generated the bundle keeps its already
   selected identity.
8. Cloud/isolated and extension loading paths remain unsupported until separately
   measured.

# Document Versioning Standard

**Applies to:** All PRDs and API contracts across Forge repos.

## Rules

1. **One file, one name, always.** The file is `prd.md` — never `prd-v2.md`, `prd-v3-final.md`. No version prefixes/suffixes in filenames.

2. **Git is the version history.** Don't duplicate what git already tracks.

3. **Changelog table at the top** of every spec doc:

```markdown
## Changelog

| Date | Rev | Summary |
|------|-----|---------|
| 2026-05-24 | 2.1 | Two-pass workflow, refine prompt, design spec |
| 2026-05-24 | 2.0 | Complete rewrite — scope reduction |
| 2026-02-27 | 1.0 | Original |
```

4. **Versioning scheme:** `major.minor`
   - **Major** = fundamental scope change (new direction, kill features, architectural shift)
   - **Minor** = feature additions, clarifications, or refinements within same scope

5. **Title never changes.** The `# Title` heading stays the same across all revisions. No "v2" in the title.

6. **Footer:** `*[Agent] ([Role]), Forge. Rev X.Y.*`

## Scope

- All PRDs (`docs/products/*/prd.md`)
- API contracts (`docs/api-contract.md`)
- NOTE: No separate UX spec docs — the latest merged code IS the design spec (see .agent-protocol.md §26)

## Migration

If any repo has versioned filenames (e.g., `prd-v3.md`), consolidate to a single `prd.md` with the changelog table. Delete the old versioned files.

## Enforcement

In PR reviews: if an agent creates a `thing-v2.md`, reject and ask them to update the existing file with a changelog entry instead.

---
*FP (Platform & Ops Lead), Forge. Proposed by FI.*

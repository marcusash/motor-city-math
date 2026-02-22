# GP Storage Audit - 2026-02-22

## Scope
Audit localStorage key usage across active site files.

## Keys in active use
- `mcm_scores`
- `mcm-arena-mode`
- `mcm_srs`
- `standardScores`

## Findings
1. No current collision found among active scoring keys; core score writes are consolidated to `mcm_scores`.
2. Arena mode key is consistent (`mcm-arena-mode`) across dashboard and exam pages.
3. `standardScores` is the only non-prefixed key and should be migrated to `mcm_standardScores` in a future controlled change.

## Risk
- Low immediate risk for data overwrite.
- Medium maintainability risk from mixed key naming (`standardScores` vs `mcm_*`).

## Recommendation
Plan a one-file-at-a-time migration for `standardScores` -> `mcm_standardScores` with backward-compat read fallback during transition.

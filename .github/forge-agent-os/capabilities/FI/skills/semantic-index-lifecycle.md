# Semantic-Index Lifecycle

## Use when

Building, refreshing, migrating, or retiring a search or semantic (embedding-based)
index for product content.

## Supported hosts

Any environment where the index build script, its input corpus location, and its
storage target are inspectable from the current product repository. Do not assume an
embedding model, vector store, or refresh trigger; discover them from the product's
own build configuration.

## Prerequisites

- The current build/refresh script or job definition for the index.
- The corpus source of truth and how it is scoped (per-user, per-tenant, or shared).
- A way to measure index health after a build: coverage, freshness, and a small set of
  known-answer queries.

## Procedure

### 1. Discover the current index contract

1. Read the product's build script to find the embedding model or scoring method
   in use, the chunking strategy, and the storage target. Do not assume these are
   stable across product versions.
2. Identify what triggers a rebuild or incremental refresh (on write, on schedule, or
   manual) and what happens to queries during a rebuild.
3. Identify the corpus's access scope. An index must not mix content across users or
   tenants unless the product's stated purpose and consent explicitly allow shared
   retrieval.

### 2. Build or refresh

1. Run the smallest reproducible build: a fixed corpus snapshot and a fixed model
   version, so a diff in results can be attributed to a real change.
2. Version the index artifact (model version, corpus version, build timestamp) so a
   regression can be bisected.
3. Prefer incremental refresh over full rebuild when the product supports it, but
   verify that stale entries are actually retired, not just shadowed by new ones.

### 3. Verify index health

- **Coverage.** What fraction of the corpus is actually indexed; investigate any gap.
- **Freshness.** The age of the oldest entry that should have been refreshed by now.
- **Known-answer queries.** A small fixed set of queries with expected top results,
  run after every build to catch silent regressions before they reach users.
- **Scope isolation.** Confirm a query scoped to one user or tenant cannot return
  another's content.

### 4. Migrate safely

Migration is any change to the embedding model, chunking strategy, or storage target
that requires re-deriving the index rather than incrementally refreshing it.

1. Build the new index version alongside the current one; do not replace the current
   version in place.
2. Run the same known-answer query set against both versions and compare results
   before routing any live traffic to the new version.
3. Cut over reads only after coverage, freshness, and known-answer results on the new
   version meet or exceed the version being replaced.
4. Backfill or re-embed the full corpus under the new model or chunking strategy
   before retiring the old version; a partially migrated index silently returns mixed
   or missing results for content that was never re-derived.

### 5. Retire safely

1. Confirm no active query path depends on the index (or index version) before
   removing it.
2. Remove or archive the underlying storage according to the product's retention
   policy; do not leave orphaned embeddings of retired content reachable by any query
   path.
3. Record the retirement decision and its date in the product repository, not in
   Forge.

## Outputs

A build/refresh/migrate/retire procedure with named triggers, a versioned artifact,
and a known-answer verification set, plus the current coverage and freshness
measurement at time of last build. A migration additionally produces a side-by-side
known-answer comparison against the version it replaces before cutover.

## Rollback

Keep the previous index version addressable until the new build or migration passes
known-answer verification. If a build or migration regresses coverage, freshness, or a
known-answer query, revert query traffic to the previous version and investigate before
reattempting.

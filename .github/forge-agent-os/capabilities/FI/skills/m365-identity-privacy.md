# M365 Identity & Privacy

## Use when

Integrating, debugging, or reviewing a Microsoft Graph / M365 data flow (mail,
calendar, Teams, identity, or directory data), or any feature that reads or writes
personal-communication data on a user's behalf.

## Supported hosts

Any environment where the current product's Graph app registration, consent scopes,
and authentication flow are directly inspectable from repository configuration and a
live, authorized call. Do not assume a tenant, app registration, or scope set exists;
discover it from the product repository and its designated owner.

## Prerequisites

- The product's current Graph app registration and the exact scopes it requests.
- The consent model in use (delegated vs. application permissions) and who can grant
  it.
- The product's stated purpose for each data type it reads or writes.
- An identified owner who can authorize scope changes or new data access.

## Procedure

### 1. Discover the current integration

1. Read the product repository's auth configuration, not a memorized scope list; Graph
   scopes and consent requirements change per API version and tenant policy.
2. Identify delegated vs. application permission mode. Delegated permissions act as the
   signed-in user and are bounded by that user's own access; application permissions
   act tenant-wide and require higher scrutiny.
3. Confirm token acquisition, refresh, and storage: where tokens live, how they are
   scoped, and how they expire. Never record a live token, client secret, or tenant ID
   in a durable Forge file.

### 2. Apply least privilege

- Request the narrowest scope that satisfies the stated feature. Prefer
  `.Read` over `.ReadWrite`, and delegated over application permissions, unless the
  feature genuinely requires broader access.
- Re-justify any existing broad scope when extending a feature; do not inherit
  over-broad access by default.
- Treat mailbox, calendar, and chat content as sensitive by default regardless of
  whether the tenant marks it with a sensitivity label.

### 3. Apply data minimization

- Fetch only the fields the feature needs (`$select`), not the full resource.
- Do not persist raw message bodies, attendee lists, or attachment content beyond the
  processing step that needs them, unless the product's stated purpose and retention
  policy require it.
- Redact or hash user-identifying fields before they enter logs, metrics, or eval
  fixtures.

### 4. Verify the live flow

1. Exercise the auth flow end to end with a test or scoped account, not assumed
   documentation.
2. Confirm the response shape matches what the code expects; Graph API versions and
   beta endpoints change field names and pagination behavior.
3. Confirm throttling and error handling: Graph returns `429` with `Retry-After`, and
   consent or conditional-access failures return distinct error codes that must not be
   treated as generic failures.

## Outputs

- A scope-minimal integration plan or diagnosis: requested scopes, permission mode,
  and why each scope is necessary.
- A consent and retention statement: what is fetched, what is stored, for how long, and
  under what purpose.
- Verified evidence of the live auth flow and response shape, with tokens and tenant
  identifiers redacted.

## Rollback

Revoke any newly granted scope or application permission that is not in active use,
delete data collected beyond the stated retention window, and restore the last known
consented configuration. Never leave an expanded scope in place "in case it's needed
later."

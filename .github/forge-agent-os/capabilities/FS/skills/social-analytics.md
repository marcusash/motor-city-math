# Social Performance Analysis
**Description:** Run repeatable, evidence-based X and LinkedIn performance analysis without rediscovering platform access, losing credential context, or overstating the available data.
**When to load:** When Marcus asks for a weekly, monthly, date-bounded, comparative, or post-level analysis of his X or LinkedIn communications.

## Purpose

This skill is the operating procedure for acquiring social performance data and turning
it into a defensible report. It complements `engagement-metrics.md`, which defines the
metrics and evidence bar; this file defines how to obtain, validate, compare, and report
the data.

FS owns this analysis directly. Do not delegate the primary analysis to another agent
or create an infrastructure project before checking the existing client, authentication
state, runner availability, and supported local path.

## Non-negotiable continuity rules

1. **Do not ask Marcus to regenerate a credential merely because it is unavailable in
   the current process.** First distinguish an invalid or revoked credential from a
   credential stored in a runtime the session cannot access.
2. **GitHub Actions secrets are write-only to local sessions.** `gh secret list` can
   confirm a secret name exists, but neither `gh` nor an agent can retrieve its value.
   Never claim repository secrets automatically become local environment variables.
3. **Do not print, paste, log, commit, or copy credential values.** Check only presence,
   authentication status, expiry, or provider error codes.
4. **Do not repeat setup work that already exists.** Inspect `packages/social/`, the
   current authentication status, existing sanitized artifacts, and active workflow
   capability before proposing a new client or asking Marcus to act.
5. **Do not scrape or browser-automate LinkedIn analytics.** Use an approved API,
   LinkedIn's native export, or state that the requested evidence is unavailable.
6. **Ask for one exact human action only when the provider requires it.** Examples are
   one-time OAuth consent, Page verification, or supplying an export. Explain why the
   action is unavoidable and do not convert an infrastructure failure into a request
   to regenerate credentials.

## Procedure

### Saved reports and cross-session discovery

Store requested reference PDFs, editable scorecards, and sanitized report datasets
under `artifacts/FS/reports/YYYY-MM-DD/` in Forge. Add a pointer in
`artifacts/FS/README.md`; preserve dated versions and checksums. Keep the actual
metrics, private reports, and operational expectations out of distributed skills
and role knowledge.

The September 2026 reference is
`artifacts/FS/reports/2026-09-21/README.md` in `marcusash_microsoft/forge`.
It identifies the two-page manager brief, complete available-post appendix, and
editable scorecard. When running outside Forge, use authenticated repository access
to retrieve this record; do not assume a Dispatch checkout, session artifact, or
machine-specific directory exists.

The capability payload carries this procedure and pointer, not the report files.
After editing canonical skills, regenerate/check the Agent OS capability mirror.
FP must then publish/bind the approved release source and refresh intended consumer
bundles. Existing sessions need the documented create/restart discovery boundary.

### 1. Fix the reporting windows

1. Convert the requested dates to an inclusive UTC current window.
2. Create an immediately preceding comparison window with the same number of days.
3. State both exact windows before computing any trend.
4. Load `skills/FS/engagement-metrics.md` and
   `skills/FI/metrics-validation.md`.

For a request covering 2026-08-24 through 2026-09-20, the comparable prior window is
2026-07-27 through 2026-08-23.

### 2. Establish provenance before fetching

Check sources in this order:

1. A sanitized analytics artifact already produced for the exact window.
2. A working local `packages/social/` authentication context.
3. The repository's X analytics workflow, but only after confirming that an eligible
   runner exists and can access the required secret.
4. A provider-native export supplied for analysis.

Record the selected source as one of:

- provider API response;
- provider-native export;
- previously generated sanitized artifact.

Never mix sources silently. If current and comparison windows use different metric
availability, label the difference beside every affected comparison.

### 3. Run X analysis

The canonical collector is:

```powershell
npm --prefix packages/social run analytics:x -- `
  --start-date 2026-08-24 `
  --end-date 2026-09-20 `
  --output-dir artifacts/FS/x-analytics
```

Expected output is a sanitized JSON report and Markdown summary named
`x-post-analytics-START-to-END`. The collector obtains the equal-duration prior window
automatically.

Before running:

1. Verify Node.js 20 or newer.
2. Check authentication through the client; do not inspect credential values.
3. If using GitHub Actions, verify runner capacity before dispatching the workflow.
   A registered workflow with no usable runner is not an analytics result.
4. If local authentication is absent but a valid GitHub secret exists, report that the
   secret is inaccessible locally. Do not call it missing, expired, or invalid.
5. Prefer a local public/native OAuth client with PKCE and least-privilege scopes
   `tweet.read users.read offline.access` when hosted execution is unavailable.
   Store access and refresh tokens in the operating-system credential store, not a
   repository file. `tweet.write` is not required for analytics.

For first-time local authorization on Windows:

```powershell
$env:X_CLIENT_ID = "<public Native App client ID>"
npm --prefix packages/social start
Invoke-RestMethod -Method Post http://127.0.0.1:3901/api/fs/auth/start
```

The browser callback stores the OAuth token in
`packages/social/.fs-tokens.dpapi`, encrypted to the current Windows user. The stored
bundle includes the public client ID, so recurring analytics runs do not require an
`.env` file or another consent cycle while the refresh token remains valid. Never
commit, display, or copy the DPAPI file to another machine.

X metric constraints:

- `public_metrics` are available through supported application or user-context reads.
- Organic and non-public metrics require user context, ownership of the post, and an
  eligible X access tier.
- X limits organic and non-public metrics to posts created within the preceding
  30 days. Older comparison posts may therefore have public metrics only.
- Never compare a private-metric current window to a public-only prior window as if
  the fields were equivalent.

### 4. Run LinkedIn analysis

The supported member analytics route is LinkedIn's Community Management API:

```http
GET /rest/memberCreatorPostAnalytics?q=me
GET /rest/memberFollowersCount?q=dateRange
```

Use three-legged OAuth with only:

```text
r_member_postAnalytics r_member_profileAnalytics
```

LinkedIn access requirements:

1. An approved Community Management developer application.
2. A registered legal organization and accepted commercial use case.
3. A verified business domain, website, privacy policy, and associated LinkedIn Page.
4. Verification by the Page's super admin.
5. Marcus's one-time OAuth authorization for his own profile.

Do not claim Microsoft employment grants API access. Do not request or depend on
`r_member_social`; LinkedIn currently treats broad member-post reads as closed.
Aggregate analytics are available through `q=me`, while post-level analytics require a
known Share or UGC Post URN.

If Community Management access is not approved, say that automated LinkedIn analysis is
unavailable and use only:

- LinkedIn's native analytics export;
- an approved LinkedIn Marketing Partner with explicit member-analytics support; or
- first-party UTM/link analytics, clearly labeled as downstream behavior rather than
  LinkedIn reach or engagement.

For a native export, use the member profile's Content analytics, select the date
range, then Export. Check existing user-supplied exports before asking for another.
Inspect XLSX files through the Excel canvas and leave the source workbook unchanged.
The ranked TOP POSTS sheet can contain separately sorted engagement and impression
lists: join by exact post URL, never by row number. It is not a complete publishing
inventory and can include posts created before the selected dates. Missing metric
cells remain unreported, not zero. New followers are gross additions, not net growth.

LinkedIn reports activity during the selected period; the X collector reports
cumulative counters for posts published during the selected period. Do not present
these as like-for-like platform totals.

### 5. Validate the dataset

Before analysis:

1. Confirm every requested day is represented or list the missing dates.
2. Count posts in each window and state `n`.
3. Check that impressions are present before calculating engagement rate.
4. Flag metrics whose denominators differ between platforms or windows.
5. Inspect extreme jumps for API, pagination, or collection failures.
6. Separate original posts, replies, reposts, threads, image/video posts, and link
   posts when the source supports that classification.
7. Assign a content pillar only when the post text provides enough evidence; otherwise
   use `unknown`, not an invented label.
8. Exclude plain X repost objects from performance totals: their counters can inherit
   the original post's engagement. Report authored posts, replies, and repost activity
   separately. Clearly state whether reply metrics are included in a given total.
9. For core engagement, sum likes, replies received, and reposts received. The existing
   collector's expanded `engagements` field also includes quotes and bookmarks;
   do not silently mix those definitions. Impressions are exposures, not unique people.
10. For a post appendix, retain every available row, public URL, date, and reported
    metric. Separate older LinkedIn posts from in-period posts; label incomplete
    inventory and low-sample conclusions instead of implying complete coverage.

### 6. Produce the report

Every report includes:

1. Exact current and prior windows.
2. Source and collection method.
3. Coverage limitations and unavailable metrics.
4. Post count and confidence tier.
5. Aggregate impressions and engagement rate, with explicit denominators.
6. Follower delta when available.
7. Top posts by impressions, engagement rate, replies, and reposts, with public URLs.
8. Content-pillar and format breakdown only where sample sizes support comparison.
9. Reply-quality assessment based on substantive replies, not raw reply count alone.
10. Contradictory signals and plausible confounders.
11. One specific next experiment tied to observed evidence.

Use this metric form:

```text
value | trend versus equal prior window | exact dates | n | confidence
```

Do not describe correlation as causation. Fewer than 30 posts is preliminary evidence.
If the source query fails, the denominator is unknown, or the windows are not
comparable, report insufficient evidence rather than manufacturing a number.

## Failure handling

| Failure | Required response |
|---|---|
| Secret name exists but is not available locally | State the runtime boundary; do not ask for regeneration |
| Workflow exists but no runner can execute it | Do not wait or create another project; use supported local auth or report the blocker |
| OAuth token is explicitly rejected or revoked | Request one new authorization, not a pasted token |
| LinkedIn application is unapproved | Use an export or approved partner; do not scrape |
| Historical private X metrics exceed 30 days | Report public metrics only and mark the baseline limitation |
| Current and prior fields differ | Suppress the invalid trend and explain why |

## Successful result

A successful analysis has reproducible source data, equal reporting windows, explicit
denominators, public post links, confidence labels, and a recommendation supported by
the observed pattern. No credential values, raw private exports, commenter identities,
or session-specific paths appear in the report or this skill.

## References

- `packages/social/src/analytics/x-post-analytics.mjs`
- `packages/social/src/analytics/report.mjs`
- `.github/workflows/x-post-analytics.yml`
- `skills/FS/engagement-metrics.md`
- `skills/FS/social-media.md`
- `skills/FI/metrics-validation.md`
- https://docs.x.com/x-api/fundamentals/metrics
- https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code
- https://learn.microsoft.com/en-us/linkedin/marketing/community-management/members/post-statistics
- https://learn.microsoft.com/en-us/linkedin/marketing/community-management/members/follower-statistics
- https://learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-overview
- https://learn.microsoft.com/en-us/linkedin/marketing/community-management-app-review
- https://learn.microsoft.com/en-us/linkedin/marketing/data-storage-requirements

Updated 2026-09.

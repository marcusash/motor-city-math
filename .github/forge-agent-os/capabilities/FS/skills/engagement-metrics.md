# FS Engagement Metrics

**Description:** What FS tracks to judge whether social strategy is working, and how to
present it without misleading Marcus.
**Use when:** Reporting on post or account performance, or deciding whether a content
or engagement approach is working.

This file defines metric **definitions and presentation rules only**. Raw analytics
exports, per-post dashboards, and pulled engagement data stay in their product location
(for example `packages/social/` output or the platform's own analytics), never in this
file or elsewhere under `skills/FS/`.

## What to track

| Metric | Definition | Denominator |
|--------|-----------|-------------|
| Impressions | Exposures to the post; repeated views can count, not unique accounts | n/a (raw count) |
| Engagement rate | (likes + replies + reposts) ÷ impressions | Impressions for that post |
| Reply quality | Substantive replies (adds context, asks a real question, or reports a specific issue) ÷ total replies | Total replies received |
| Follower delta | Net new followers over the reporting window | n/a (raw count) |
| Feedback-intake handoffs | Replies that correctly redirected to feedback intake vs. total feedback-shaped replies | Feedback-shaped replies for that window |

### Content performance

Track which content pillar (see `social-media.md`) each post belongs to and how it
performed, and which format (text, image, thread) was used. Do not compare across
pillars or formats until each has enough posts to be a fair comparison (see Sample size
below).

### Anti-metrics — do not optimize for these

- Total follower count alone (vanity metric, no denominator).
- Raw like count alone (does not indicate reply quality or substantive engagement).
- Posting frequency (quality of engagement over volume of posts).

## Evidence bar before setting a numeric target

Do not carry forward a fixed numeric target (for example a specific engagement-rate
percentage) unless it is derived from this account's own measured baseline. Apply
`skills/FI/metrics-validation.md` before presenting or acting on any number:

- **Sample size:** fewer than 30 posts or replies in the window is preliminary — say so,
  do not present it as a stable rate.
- **Baseline:** always show the trend against the prior comparable window, not just the
  current value. If there is no prior window yet, say "first measurement, no trend
  yet" instead of inventing a target.
- **Denominator:** never present a rate without stating what it's a rate of.
- **Correlation vs. causation:** if a metric moved and a specific change (voice
  adjustment, posting time, format) is credited, name what else changed in the same
  window before attributing the effect.

## Red flags

- A metric improves but replies get worse in substance — the observed outcome, not the
  metric, is the reliable signal here; treat the metric as wrong or misleading and
  investigate before reporting a win.
- Two metrics move in contradictory directions — investigate before reporting either.
- A metric jumps overnight with no clear cause — treat as a likely data or platform
  issue, not a real signal, until confirmed.
- A reported "100% success rate" on anything with a small sample is a sample-size
  problem, not a result.

## Reporting cadence

- **Weekly:** top-performing post (with pillar and format noted) and the engagement-rate
  trend against the prior week.
- **Monthly:** content-pillar and format breakdown, follower-delta trend, and one
  specific recommendation for what to try next, tied to an observed pattern rather than
  a generic best practice.

Every reported number states its value, trend direction, time window, and sample size
together — a bare average with none of the other three is not a complete report.

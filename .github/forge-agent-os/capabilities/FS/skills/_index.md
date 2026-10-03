# FS Skills

Load only the capability file relevant to the current task.

## Capability catalog

| Capability | File | Load when |
|---|---|---|
| Social media publishing | `social-media.md` | Triaging a mention, drafting a reply or post, or moving any content through the draft → exact approval → publish → receipt lifecycle |
| Eval scenarios | `eval-scenarios.md` | Calibrating or re-validating FS after any change to `social-media.md`, or before enabling live posting |
| Engagement metrics | `engagement-metrics.md` | Reporting on or deciding from post/account performance |
| Social performance analysis | `social-analytics.md` | Running a weekly, monthly, date-bounded, comparative, or post-level analysis of Marcus's X or LinkedIn communications |

## Loading order

Start with `social-media.md` for any drafting or triage task — it is the single
canonical capability and covers voice, platform scope, guardrails, escalation, privacy,
and credential safety. Load `eval-scenarios.md` only when validating a change, and
load both `social-analytics.md` and `engagement-metrics.md` when acquiring or reporting
performance data.

## Retired

The standalone system-prompt copy previously in this directory duplicated
`social-media.md` and is retired. Do not recreate a separate bootstrap prompt here —
identity and load order come from `.github/agents/forge-social.agent.md` and
`knowledge/agents/FS.md`.

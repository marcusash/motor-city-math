# Incident Response and Learning

## Use when

Availability, integrity, confidentiality, delivery, or operational control is materially
degraded or at credible risk. Start response before root cause is known.

## Supported hosts

Any repository, CI provider, service, or host for which the responder has authorized
observability and control. Provider-native incident and audit systems remain the source
of operational evidence.

## Prerequisites

- A named incident lead and a durable incident record in the affected product or
  service repository.
- Read access to health, deployment, workflow, audit, and change evidence.
- Authority for containment actions, or a clearly identified approval path.
- A known time zone for all timeline entries; preserve source timestamps when converting.

## Response

### 1. Declare and bound impact

Record start time, detection source, affected users or systems, data risk, current
symptoms, and severity. State what is known, unknown, and assumed. Open one coordination
channel and one durable record; do not fragment authority across private notes.

### 2. Stabilize and preserve evidence

Prefer reversible containment: pause deployment, disable the failing path, drain
traffic, revoke compromised access, or restore known-good capacity. Capture relevant
run, deployment, commit, configuration, audit, and health evidence before it expires.
Redact secrets and private data. Do not destroy logs or mutate the suspected source
before preservation.

### 3. Diagnose

Build a timestamped change and symptom timeline. Compare the last known-good state to
the first known-bad state. Test competing hypotheses with the smallest safe probe.
Separate trigger, contributing conditions, failed safeguards, and detection gaps.

### 4. Recover

Choose rollback, roll-forward, failover, credential rotation, or capacity restoration
based on the lowest-risk path to service. Validate user-visible behavior, critical data
integrity, queued work, dependent systems, and recurrence signals. Monitor through an
appropriate stability window before resolving.

### 5. Communicate

Report severity, impact, containment, recovery state, evidence, and next update time.
Keep the incident lead, product DRI, and affected operators synchronized. Notify the
human principal immediately for suspected credential or private-data exposure,
irreversible data loss, safety risk, or sustained user-facing outage. External
communications follow the outbound approval gate. Never speculate about cause or expose
private operational details.

## Post-incident review

Write a blameless review in the affected repository:

1. **Summary:** impact, duration, severity, and resolution.
2. **Timeline:** source-stamped detection, response, decisions, recovery, and validation.
3. **Causal analysis:** trigger, contributing factors, and why safeguards did not prevent
   or detect the incident.
4. **Response assessment:** what helped and what delayed recovery.
5. **Corrective actions:** one owner, priority, acceptance evidence, and tracked Issue
   per durable action.
6. **Residual risk:** explicit owner and review date.
7. **Shared lesson:** when the incident reveals a durable cross-agent pattern, add a
   concise entry to the Forge shared lessons log; keep incident-specific evidence in the
   affected repository.

Root cause is not "human error." Explain the system conditions that allowed an action
to create impact.

## Outputs

- Durable incident record and evidence references.
- Verified containment and recovery state.
- Blameless post-incident review.
- Owned corrective-action Issues and an explicit rollback or failover path.

## Rollback

Every recovery change needs its own rollback. If the recovery worsens impact, return to
the last stable configuration, reapply containment, preserve new evidence, and reassess
with a smaller blast radius.

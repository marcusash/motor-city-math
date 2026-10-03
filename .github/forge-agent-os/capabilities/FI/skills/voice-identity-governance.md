# Voice & Identity Governance

## Use when

Handling voice-reference material, personal writing samples, sentiment or identity
signals derived from personal communication, or any request to mine, model, or apply
someone's identity, tone, or personal data.

## Prerequisites

- The stated purpose the material was collected or is being used for.
- Knowledge of whether the person the material describes has consented to this
  specific use, not just to the material's original collection.
- The product's retention policy for personal or identity-derived material.

## Core duties

- Use personal voice, identity, or communication data only for the purpose it was
  collected or explicitly extended for. A voice sample collected to draft messages in
  someone's tone is not automatically license to build an unrelated behavioral profile.
- Minimize what is retained. Keep the smallest derived representation (e.g. a style
  guide or scored signal) that serves the stated purpose, rather than retaining raw
  personal text indefinitely.
- Keep restricted or private material out of durable Forge capability files entirely.
  A skill file may describe the *method* used to derive tone, sentiment, or identity
  signals; it must not contain the personal writing samples, message content, or
  identifying details themselves.
- Distinguish material scoped to one person's own personal use (their own journal,
  their own voice reference, content they explicitly asked to have modeled) from
  material about or from other people, which carries a stricter consent bar.

## Risk review

Before starting any voice- or identity-mining task, identify:

1. **Whose data.** The person the material is from and the person it is about, when
   different.
2. **Consent basis.** What the person agreed to, and whether the current task is
   inside or outside that scope.
3. **Sensitivity.** Whether the material includes health, relationship, financial,
   legal, or other sensitive content beyond what the task needs.
4. **Downstream use.** Who or what will consume the derived signal, and whether that
   use could affect the person's access, reputation, relationships, or opportunities.

Escalate to the product's designated privacy owner (or Marcus directly, for Marcus's
own personal material) before proceeding when consent basis is unclear, the material
involves a third party who has not consented, or the downstream use could create real
harm.

## Application boundary

Marcus's own personal material (his journal, his voice reference, his own product
data) may be modeled for his own stated purposes at his direction; general privacy
minimization still applies to retention and to any onward sharing. Material describing
or belonging to any other person is never modeled, mined, or redistributed without
that person's own consent, regardless of who requests it.

## Output contract

A voice- or identity-derived capability is usable only once it documents: the stated
purpose, the consent basis, the minimization applied (what was kept vs. discarded), and
the retention boundary (how long the derived signal is kept and when it is deleted).
Absent any one of these, treat the capability as not cleared for use.

## Rollback

If personal or identity-derived material is found in a durable file outside its
authorized scope, remove it immediately, confirm no downstream copy remains, and
record the correction with the affected person or the product's privacy owner notified.

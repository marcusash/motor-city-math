# GD Autonomous Queue

Agent GD (Design Engineer, Grind) — self-directed work queue.
Check inbox after every task. Reprioritize if new guidance arrives.

Last updated: 2026-02-23

---

## Execution Protocol

1. Check `.agent-comms/grind/inbox-GD/` before starting any task
2. If P2 bug landed in inbox: stop current task, address the P2 first
3. If spec request from GA: address before continuing audit work
4. After completing any spec: file to GA inbox using standard format
5. After completing any learning task: update `.forge/learnings/GD.md`
6. After every 10 tasks: update `.agent-status.md` with progress count

---

## P2 Queue (Do First)

| ID | Task | Depends on |
|----|------|-----------|
| ct-09 | Hint quality audit: RP10 | RP10 publish blocked on GR sign-off |
| ca-02 | Error state spec for corrupted localStorage | GF qa-risk-brief surfaced this |

---

## Design Audit Queue (da-01 to da-35)

Systematic audits. Each produces either a PASS note or a spec filed to GA.

| ID | Task |
|----|------|
| da-01 | Audit exam.html: all hardcoded inline font sizes (19 declarations, may have grown) |
| da-02 | Audit index.html: --fd-text-3 fix status — is #7D8590 now live? |
| da-03 | Audit shared/styles.css: token coverage — are any raw hex values still present? |
| da-04 | Audit shared/print.css: does print mode work for all 10 exam types? |
| da-05 | Audit index.html dark mode: G4 badge color in arena mode |
| da-06 | Audit focus ring: light mode, verify #4A90D9 is live after GA fix |
| da-07 | Audit autosave toast: fires on save, shows correct copy, 1200ms duration |
| da-08 | Audit correct-pulse animation: does it fire on correct submit? |
| da-09 | Audit exam.html: position tracker visible on all 10 exam types |
| da-10 | Audit scorecard disclosure: collapsed by default on load |
| da-11 | Audit exam.html: prefers-reduced-motion honored for all animations |
| da-12 | Audit exam.html: keyboard nav complete (Tab order, skip nav) |
| da-13 | Audit chart labels: are all Chart.js labels using MCM typography scale? |
| da-14 | Audit chart colors: Pistons palette applied consistently across all chart types |
| da-15 | Audit dashboard hero card: Up Next card shows correct next exam |
| da-16 | Audit dashboard sparkline: renders correctly for 0, 1, 5, 10 attempts |
| da-17 | Audit exam picker: all 10 exams listed, correct titles, correct routes |
| da-18 | Audit error state: empty question bank gracefully handled |
| da-19 | Audit error state: localStorage parse failure shows CTA not blank screen |
| da-20 | Audit error state: network failure (file:// mode, not a concern — verify no network deps) |
| da-21 | Audit post-wrong nudge: after 2 wrong, "Want a hint?" appears |
| da-22 | Audit hint display: hint text WCAG contrast check (muted on dark) |
| da-23 | Audit timer display: shows remaining time, not elapsed |
| da-24 | Audit score number: uses --text-4xl token (not 3em inline) |
| da-25 | Audit dad.html: 2 low gaps from template audit (what were they? are they still present?) |
| da-26 | Audit label[for=] on all exam input types (text, multiple choice, graphing) |
| da-27 | Audit aria-live regions: correct and incorrect feedback announced correctly |
| da-28 | Audit mobile layout: exam.html at 375px (graph questions legible?) |
| da-29 | Audit mobile layout: dashboard at 375px (sidebar collapses?) |
| da-30 | Audit print output: scorecard prints correctly (page breaks, no cut-off questions) |
| da-31 | Audit .design-system.md: Sections 1-16h for stale references (fixed bugs still documented as open) |
| da-32 | Audit shared/styles.css: are all --fd-* tokens absent? (fd tokens belong in index.html only) |
| da-33 | Audit chart-variants.html: design diagnostic artifact — does it reflect current chart spec? |
| da-34 | Audit score reveal animation: fires at end of exam, duration 250ms, grade-a-flash correct |
| da-35 | Audit exam.html: all interactive elements reachable by keyboard in correct Tab order |

---

## Spec Writing Queue (sw-01 to sw-18)

New specs for features not yet built or not yet specced to current quality bar.

| ID | Task |
|----|------|
| sw-01 | Write spec: localStorage error state UI (corrupted JSON recovery flow) |
| sw-02 | Write spec: autosave toast full state machine (saving, saved, error) |
| sw-03 | Write spec: post-wrong nudge state machine (0, 1, 2+ attempts) |
| sw-04 | Write spec: hint reveal state machine (hidden, visible, exhausted) |
| sw-05 | Write spec: position tracker full spec (Q7 of 15, percent bar) |
| sw-06 | Write spec: score reveal animation sequence (number count-up, grade flash) |
| sw-07 | Write spec: scorecard progressive disclosure (summary -> details expand) |
| sw-08 | Write spec: timer display (remaining, warning threshold, expired state) |
| sw-09 | Write spec: post-exam CTA flow (what happens after submit on last question) |
| sw-10 | Write spec: exam picker accessibility (keyboard navigable, aria-selected) |
| sw-11 | Write spec: .design-system.md Section 17 — WCAG contrast audit table |
| sw-12 | Write spec: .design-system.md Section 18 — spacing system |
| sw-13 | Write spec: .design-system.md Section 19 — animation standards |
| sw-14 | Write spec: .design-system.md Section 20 — 4-level contrast hierarchy |
| sw-15 | Write spec: .design-system.md Section 21 — anti-patterns catalog |
| sw-16 | Write spec: .design-system.md Section 22 — design direction commitment |
| sw-17 | Write spec: shared --border-input token (replaces inline border colors) |
| sw-18 | Write Mini-PRD: post-wrong nudge feature (FD method — full product thinking) |

---

## Skill Development Queue (sd-01 to sd-30)

Learning tasks that grow GD's capabilities. Each has a file deliverable.

| ID | Task |
|----|------|
| sd-01 | Run git retrospective: what was Sprint 6 journey? 3 insights. File to .forge/learnings/GD.md |
| sd-02 | Study FD's RAMSO protocol. Write GD's version for web design context. |
| sd-03 | Skills.sh audit: research 10 skills, map each to MCM applicability |
| sd-04 | Study Chart.js docs: learn 3 chart configuration techniques GD doesn't currently use |
| sd-05 | Design a chart: create chart-gd-01.html as a design experiment |
| sd-06 | Study data visualization principles: 5 rules for MCM chart design |
| sd-07 | Study FD peer review template: write GD peer review README (8 sections) |
| sd-08 | Write GD's honest gap statement for Muriel Cooper's bar (updated) |
| sd-09 | Write GD's honest gap statement for Ethan Marcotte's bar (updated after Sprint 7) |
| sd-10 | Write GD's honest gap statement for Khan Academy design team (updated) |
| sd-11 | Draft GD's peer review request: what 5 questions would GD ask external reviewers? |
| sd-12 | Broadcast spec format proposal to all Grind agents via inbox messages |
| sd-13 | Write "broadcast" design idea: one MCM improvement idea sent to all 12 agents for feedback |
| sd-14 | Study GA learning plan: what does GA find hardest to build from GD's specs? |
| sd-15 | Run CSS cascade debugging exercise: intentionally introduce and find a token override bug |
| sd-16 | Study WCAG 2.2 new criteria (not just AA): what is in 2.2 that isn't in 2.1? |
| sd-17 | Write GD's ADHD UX framework: 5 personal research questions with answers |
| sd-18 | Study Kat Holmes "Mismatch" chapter 1: extract 3 design from constraint principles |
| sd-19 | Practice contrast calculation: calculate 10 MCM token combinations by hand (no tool) |
| sd-20 | Write a design crit: pick one GA implementation, write a 5-point design critique |
| sd-21 | Run T31 submission to FD inbox: spec-writing state machine requirement |
| sd-22 | Run T32 submission to FD inbox: reference library rationale and structure |
| sd-23 | Run T33 submission to FD inbox: Muriel Cooper bar analysis |
| sd-24 | Run T34 submission to FD inbox: constraint-setting vs constraint-applying reflection |
| sd-25 | Run T35 submission to FD inbox: GD peer review readiness assessment |
| sd-26 | Study typesetting for math: KaTeX default styles — what does GD need to spec vs what KaTeX provides? |
| sd-27 | Analyze GD's own spec history: which specs took longest for GA to implement? Why? |
| sd-28 | Write GD's working norms document: when GD is online, response time, scope rules |
| sd-29 | Create GD's intake form: what information does GD need from Marcus to write a spec? |
| sd-30 | Write GD's Sprint 8 plan (after inbox check and Canvas discussion with Marcus) |

---

## Design System Queue (ds-01 to ds-15)

Formal updates to .design-system.md.

| ID | Task |
|----|------|
| ds-01 | Add Section 17: Full WCAG audit table |
| ds-02 | Add Section 18: Spacing system |
| ds-03 | Add Section 19: Animation standards |
| ds-04 | Add Section 20: 4-level contrast hierarchy |
| ds-05 | Add Section 21: Anti-patterns catalog |
| ds-06 | Add Section 22: Design direction commitment |
| ds-07 | Add Section 23: UX workflow checklist |
| ds-08 | Update gd-design-references/craft-foundations.md with card border-radius system |
| ds-09 | Update gd-design-references/interaction-visual-clarity.md with Arena Mode complete rules |
| ds-10 | Document two CSS token systems coexistence rule |
| ds-11 | Document spec string safety rule |
| ds-12 | Document grade threshold system (92% in 3 places — system invariant) |
| ds-13 | Audit .design-system.md for stale references |
| ds-14 | Formalize ADHD design rules section |
| ds-15 | Formalize Pistons brand rules section |

---

## Content Queue (ct-01 to ct-14)

Content quality audits. Each produces either a PASS or a GR content brief.

| ID | Task |
|----|------|
| ct-01 | RP10 fb_correct quality: write GR quality brief |
| ct-02 | Cross-exam answer dedup: RP4-RP7 vs RP1-RP3 |
| ct-03 | Hint quality audit: RP4 |
| ct-04 | Hint quality audit: RP5 |
| ct-05 | Hint quality audit: RP6 |
| ct-06 | Hint quality audit: RP7 |
| ct-07 | Hint quality audit: RP8 |
| ct-08 | Hint quality audit: RP9 |
| ct-09 | Hint quality audit: RP10 (P2 — publish blocked) |
| ct-10 | Copy audit: all 10 exam titles |
| ct-11 | Solution steps check: RP4 |
| ct-12 | Solution steps check: RP5-RP7 |
| ct-13 | Standards mapping audit: spot-check 10 questions across 3 exams |
| ct-14 | Difficulty field audit: all 10 RPs |

---

## Cross-Agent Learning Queue (ca-01 to ca-15)

Peer learning and cross-agent coordination tasks.

| ID | Task |
|----|------|
| ca-01 | Read GF learning plan fully — extract design implications |
| ca-02 | Write localStorage error state spec (GF risk brief implication) |
| ca-03 | Study GP field audit report — design implications |
| ca-04 | Read GI learning plan — data quality design constraints |
| ca-05 | Read GR learning plan — improve handoff quality for GR |
| ca-06 | Review GA Sprint 5-6 implementations — design perspective pass/fail |
| ca-07 | Write GD-to-GA design handoff protocol |
| ca-08 | Message GF: propose spec-first QA process |
| ca-09 | Review GI uniqueness gap analysis — design implication |
| ca-10 | Read FR variability framework — design rules from variability |
| ca-11 | Study FA learning plan — simplicity principle for design systems |
| ca-12 | Study FP learning plan — security/ops design constraints |
| ca-13 | Message FR: request feedback on GD ADHD UX framework |
| ca-14 | Study GR learning plan — difficulty and pedagogy for design |
| ca-15 | Write GD peer review README using FD 8-section template |

---

## Learning Log Queue (ll-01 to ll-05)

Journaling and retrospective tasks.

| ID | Task |
|----|------|
| ll-01 | Update .forge/learnings/GD.md: Sprint 6 retrospective |
| ll-02 | Update .forge/learnings/GD.md: FD cross-pollination session |
| ll-03 | Git retrospective: Sprint 5-6 commits — 3 insights |
| ll-04 | Update .design-system.md WCAG running table (mark fixed bugs) |
| ll-05 | Update .agent-status.md: GD Sprint 7 opening entry |

---

## Research Queue (rt-01 to rt-10)

Research tasks with a deliverable note at the end.

| ID | Task |
|----|------|
| rt-01 | Khan Academy ADHD research: 3 design decisions, apply 1 to MCM |
| rt-02 | Desmos math input UX: 1 spec if gap found |
| rt-03 | Quizlet feedback design: 3-point comparison |
| rt-04 | IXL Math progress tracking: what can MCM learn? |
| rt-05 | Delta Math exam interface: 5-point brand critique |
| rt-06 | ADHD and error recovery research: 2 principles, 1 improvement spec |
| rt-07 | Working memory load in online testing: design implications |
| rt-08 | Color and emotion for ADHD users: does Pistons Red trigger stress? |
| rt-09 | Detroit Pistons 2023-2026 brand evolution |
| rt-10 | FD WinUI3 principles: 3 that apply to MCM web, 3 that don't |

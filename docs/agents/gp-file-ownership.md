# GP File Ownership

Complete list of files owned by GP (grind-platform).

## Primary Ownership (GP modifies without approval)

### Test Files
```
tests/gp-*.test.js                    # all 23 GP test files
tests/verify-practice-exams.js        # primary exam validator
tests/cross-exam-verify.js            # cross-exam dedup
```

### Script Files
```
scripts/gp-*.js                       # all GP analytics/tooling scripts
scripts/gp-exam-health.js             # health gate
scripts/gp-pre-commit-hook.js         # hook source of truth
scripts/install-hooks.sh              # hook installer
```

### Platform Files
```
.gitignore                            # security patterns + temp files
package.json                          # engines field + npm scripts
.github/workflows/validate-data.yml   # CI data validation
.github/workflows/agent-inbox-schema.yml  # CI inbox validation
.github/workflows/validate-exams.yml  # CI exam validation
.github/ISSUE_TEMPLATE/bug-report.md
.github/ISSUE_TEMPLATE/exam-fix-request.md
.github/ISSUE_TEMPLATE/exam-request.md
```

### Communication Files
```
.agent-comms/grind/inbox-GP/          # GP inbox
.agent-comms/grind/inbox-*/           # GP can write (not read others)
.agent-comms/forge/inbox-*/           # GP can write to forge agents
.marcus-queue.md                      # GP appends decisions needed
```

### Data Files (structural, not content)
```
data/gp-*.json                        # GP audit outputs
data/_backups/                        # all backup files
```

### Documentation
```
docs/agents/gp-*.md                   # all GP agent docs (23 files)
docs/gp-project-stats.md              # project stats snapshot
docs/testing-guide.md                 # test suite reference
docs/exam-authoring-guide.md          # GR authoring guide
docs/retake-exam-spec.md              # canonical exam spec
docs/exam-flow.md                     # user journey doc
docs/scoring.md                       # scoring system doc
docs/hints.md                         # hint system doc
docs/graphing.md                      # graphing implementation
docs/deploy.md                        # deployment docs
docs/agents/agent-index.md            # agent index
```

## Shared Ownership (GP coordinates, others approve)

```
.agent-status.md                      # GP updates GP section; other agents own their sections
.agent-protocol.md                    # GP maintains; Marcus approves changes
.agents.md                            # GP maintains; Marcus approves ownership changes
```

## Read-Only for GP (do not modify without owner approval)

```
exam.html, index.html                 # GA
shared/*.css, shared/*.js             # GA/GD
data/retake-practice-*.json           # GR (content), GP (structure verify only)
.design-system.md, .voice-guide.md   # FD
tests/f-validation/*.js               # GF
```

---

*Owner: GP | Reference: .agents.md for full ownership table*

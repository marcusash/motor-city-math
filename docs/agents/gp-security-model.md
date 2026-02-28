# GP Security Model

**Owner:** GP  
**Scope:** Motor City Math static file deployment

## Threat Model

Motor City Math is a static HTML application opened from a local filesystem (`file://` URL). Kai opens the HTML files directly in his browser. There is no server, no authentication, no database.

## Security Boundaries

| Layer | Risk | Mitigated? |
|-------|------|------------|
| CDN dependencies | CDN takedown kills exam during study session | YES — pre-commit hook blocks polyfill.io and other CDNs |
| External scripts | Malicious script injection via CDN | YES — banned CDN list enforced |
| Data integrity | Wrong answers sent to Kai | YES — verify suite + GR math verification |
| localStorage | Data from another exam overwrites progress | PARTIAL — known bug (LOCAL-001), GA owns fix |
| File corruption | Exam file becomes invalid JSON | YES — npm run lint:json + gp-json-parse.test.js |
| Answer leakage | Kai sees answers before attempting | YES — password-protected answer keys (pw: 121274) |
| Build-time injection | Malicious code in npm deps | LOW RISK — pure static files, no build step |

## Security Checks in Pre-commit Hook

1. No polyfill.io CDN references
2. No other banned CDN URLs with local alternatives
3. File size limits (no accidental 50MB file commits)

## No-Server Guarantee

Motor City Math must NEVER require a server. If any agent proposes:
- Fetching data from an API
- Requiring a running backend
- Using WebSockets

...GP must flag this as a protocol violation. Static-only is a hard constraint.

## Sensitive Data

- Answer key password (`121274`) is embedded in HTML — this is intentional (Kai's study tool, not production security)
- No API keys, tokens, or credentials should ever be committed
- Pre-commit hook includes eval() detection as defense-in-depth

## Security Incident Response

1. If banned CDN is found in committed code: revert the commit immediately
2. If wrong answer reaches Kai: file bug to GR, do not modify data without GR confirmation
3. If exam file becomes invalid JSON: restore from data/_backups/

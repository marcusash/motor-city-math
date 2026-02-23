# GD Design Reference Library

Motor City Math (MCM) design references for Agent GD. Adapted from FD's modular reference system.

## Purpose

These files are living references GD consults before every spec and every design decision. They encode MCM-specific constraints so GD does not rediscover the same rules each sprint. Update them when something new is learned.

## Files

| File | What it answers |
|------|----------------|
| `design-direction.md` | What is MCM's personality? What is it NOT? |
| `craft-foundations.md` | What are the spacing, grid, and layout rules? |
| `interaction-visual-clarity.md` | Animation, feedback, anti-patterns, dark mode rules |
| `spec-writing.md` | How do GD specs need to be formatted for GA to build them? |

## How to Use Before Writing a Spec

1. Read `design-direction.md` first: confirm your direction fits the personality
2. Check `craft-foundations.md` for any spacing values your spec touches
3. Check `interaction-visual-clarity.md` if your spec involves animation, color, or feedback
4. Use `spec-writing.md` as the actual template when drafting

## Update Protocol

After every sprint that yields a new design insight:
- Add a bullet under the relevant section in the appropriate file
- Date the bullet: `<!-- added YYYY-MM-DD -->`
- If an insight contradicts an older bullet, strikethrough the old one

## Lineage

Adapted from FD's `.forge/design/references/` system. Key differences:
- FD's references cover the full Forge design language (across multiple apps)
- GD's references are MCM-specific: one app, one student, one mission

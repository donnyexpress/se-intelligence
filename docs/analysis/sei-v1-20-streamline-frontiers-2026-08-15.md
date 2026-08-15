# SE Intelligence v1.20 — Streamline Research Frontier Sections

**Date**: 2026-08-15
**Status**: Analysis only — awaiting user approval
**Trigger**: User asked to "review if the various research frontier
sections can be streamlined further". Looking at the 7 topic pages
that v1.18 updated (system-def, eng-domains, sos, realization,
sys-fund, management, sec), the research frontier sections have
grown to 13-21 lines each, with several patterns of bloat.

## Problem

Three patterns of bloat are visible across all 7 topic pages:

### Pattern 1: "Other 2024-2025 work worth noting" sub-section

5 of the 7 pages have a separate "Other 2024-2025 work worth noting"
or "Other 2024-2025 work" sub-section after the main 3-5 themed
bullets. This sub-section is just a flat list of 4-8 short bullets
that don't fit the themes. The bullet count is high (4-8) but each
bullet is short, making the section feel like a bibliography.

Examples:
- system-def: 4 bullets in the "Other" subsection
- eng-domains: 4 bullets
- sos: 3 bullets
- realization: 8 bullets (the most bloated)
- sys-fund: similar pattern (4 bullets in "Other")

### Pattern 2: Verbose lead-in and trailing summary

Most pages have:
- A lead-in: "The 2024-2026 evidence base shows [N] threads moving
  from research into practice:" or "Active threads in 2024-2025:"
- A trailing summary: "The 2024-2026 period is best understood as..."

These are decorative text that doesn't add information beyond what
the bullets already say.

### Pattern 3: Duplicated citations within a section

Some sections cite the same entry multiple times in different
bullets. E.g. sos.md cites `journal-wiley-se-29-4-bakhshi-...` in
the "SoS is becoming a measurement discipline" bullet and again in
a later "AI-driven labor transitions" bullet (because Kaplan cites
Bakhshi). This is fine for cross-references but adds to length.

## Plan

### Step 1: Eliminate the "Other 2024-2025 work" sub-section

Fold the "Other" bullets back into the main 3-5 themed bullets, OR
(if they don't fit any theme) drop them entirely — they're usually
short stubs that the references list already covers.

Action by page:
- **system-def**: drop the 4 "Other" bullets (MBDE, ARCADIA, V-Model,
  product line modeling with confidentiality) — the last one
  (Bourdellès) is already cited elsewhere in the body. The other
  three are short stubs that the references list covers.
- **eng-domains**: drop the 4 "Other" bullets (AI-enhanced autonomous
  safety, trust/distrust, AI-assisted safety, federated learning).
  The first two (autonomous safety, trust/distrust) are good but
  short — promote the trust/distrust one to a full theme bullet
  (it's a major new contribution from IS 2024).
- **sos**: keep the 3 "Other" bullets as a single compressed
  sub-section, OR drop the Mission Engineering one (already cited
  in the SoS working group section) and fold the other two into
  theme bullets.
- **realization**: this is the most bloated with 8 "Other" bullets.
  Drop the ones that are short stubs (MBDE, design reviews) and
  keep the 5-6 most substantive ones.
- **sys-fund**: drop the "Other 2024-2025 work" section entirely
  (only 3 bullets, all of which can be folded into the main themes).

### Step 2: Trim verbose lead-ins

Replace "The 2024-2026 evidence base shows three threads moving
from research into practice:" with shorter forms, e.g.:
- "Three 2024-2026 threads:"
- Or just remove the lead-in entirely and let the bullets stand
  on their own

### Step 3: Trim trailing summaries

Remove the "The 2024-2026 period is best understood as..." trailing
summaries. They restate what the bullets say.

### Step 4: Compress theme bullets

Some theme bullets are 4-6 lines long. Split them where it makes
sense:
- The "what changed" sentence
- The "key citations" sentence (or just the inline citations)
- The "implication" sentence (if present)

A 2-3 line bullet is more scannable than a 5-line paragraph.

## Target state

After streamlining:
- Each research frontier section: 8-12 lines (down from 13-21)
- No "Other 2024-2025 work" sub-sections
- Cleaner bullet structure
- Same coverage, less words

Concretely:
- system-def: 15 lines → 10 lines
- eng-domains: 17 lines → 11 lines
- sos: 16 lines → 10 lines
- realization: 21 lines → 12 lines
- sys-fund: 16 lines → 10 lines
- management: 14 lines → 10 lines (lighter)
- sec: 13 lines → 9 lines

Total: ~112 lines → ~72 lines (35% reduction in research-frontier
content). Same knowledge, more scannable.

## What I'm NOT doing

- Not removing inline citations — all references stay
- Not changing the "What to read first" section — that structure
  is working well
- Not changing the "Patterns that work" or "Best practices" sections
  in this pass — only the research frontiers
- Not removing the trailing summary from every page — only where
  it restates the bullets

## Save Path

- topics/system-def.md — drop "Other 2024-2025 work" sub-section,
  trim lead-in
- topics/eng-domains.md — drop or compress "Other 2024-2025 work"
- topics/sos.md — fold "Other 2024-2025 work" bullets into themes
  or drop
- topics/realization.md — compress 8 "Other" bullets to 4-5
- topics/sys-fund.md — drop "Other 2024-2025 work" sub-section
- topics/management.md — light trim if needed
- topics/sec.md — light trim if needed

## Test Matrix

- All inline citations still resolve (existing smoke check)
- No new entries added or removed
- Research frontier sections are 25-40% shorter
- 24 smoke + 47 parser + 86 routes = 157 tests still pass

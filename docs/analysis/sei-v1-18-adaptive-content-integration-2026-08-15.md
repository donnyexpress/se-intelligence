# SE Intelligence v1.18 — Adaptive Content Integration

**Date**: 2026-08-15
**Status**: Analysis only — awaiting user approval
**Trigger**: User noted that v1.16/v1.17's "What's new in 20XX" appendices
are too passive — they append research notes without changing the body
of knowledge. The user wants the **body** of the topic pages to be
updated by the new research, not just the bibliography.

## Impact

- 31 topic pages get **in-place revisions** to their `## Patterns that
  work`, `## Best practices`, and `## Research frontiers` sections
  based on the 439 research entries (IS 2024 + IS 2025 + Wiley SE
  29(4))
- 11 new Wiley 2026 entries get a `## Related entries` section that
  cross-links to other related entries
- Some existing inline citations get **upgraded** to peer-reviewed
  alternatives when both exist
- The `maturity:` field on topic pages is **bumped** where the
  evidence base now supports it (e.g. "research frontier" →
  "established")
- The "What's new in 20XX" appendices from v1.16 + v1.17 are
  **folded into the body** and removed as standalone sections

## Problem (user's actual feedback)

> "I want the new articles to add meaningful content updates, not
> just say it is frontier research. suggest ways the body of
> knowledge can be more adaptive and integrated."

The current v1.16 + v1.17 work:
- Adds ~24 `[<key>]` inline citations across 6 topic pages
- Adds "What's new in 20XX" appendices at the bottom of each
- Adds 16 entries to the references list

What the user is asking for: the **body** of the topic page should
*change* in response to the new research. A reader who lands on
`/topic/system-def` should see updated patterns, not "here are the
patterns (as of 2024), and also here are some 2026 papers".

## Plan

### Step 1: Adaptive body updates per topic

For each topic page, walk through the existing claims in `## Patterns
that work`, `## Best practices`, and `## Research frontiers` and:

1. **Strengthen** any claim with a new peer-reviewed or peer-abstracted
   reference (e.g. a Wiley paper or a substantive IS 2024/2025 paper)
2. **Add a new pattern/bullet** when the new research shows a
   pattern that isn't already in the list
3. **Remove or downgrade** a claim when the new research contradicts
   it (rare; only if we have strong evidence)
4. **Bump maturity** when 3+ peer-reviewed sources support a pattern

### Step 2: Topic-by-topic scope (the realistic subset)

There are 31 topic pages but the new research is heavily concentrated
in 6-8 topics. The work is bounded:

| Topic | New entries that map here | Action |
|---|---|---|
| `system-def` | ~186 (IS 2024-2025) + 3 (Wiley) | Heavy update |
| `sos` | ~75 + 2 | Heavy update |
| `realization` | ~70 + 1 | Moderate update |
| `eng-domains` | ~23 + 3 | Moderate update |
| `sys-fund` | ~45 + 1 | Moderate update |
| `management` | ~14 | Light update |
| `deploy-use` | 0-5 | Light update |
| `concept-def` | 0-5 | Light update |
| `sec` (sub-area) | 1 (Wiley) + ~10 (IS) | Moderate update |
| Other 22 topics | 0-5 | Skip if no new evidence |

For the heavy/moderate topics, I read all the abstracts and look for
*new patterns* not already captured. For light topics, I add the new
references as inline citations where they support an existing claim
and skip if they don't.

### Step 3: Inline citation upgrades

When a topic page has an inline `[conf-is2024-pXXX]` or
`[conf-is2025-pYYY]` citation for a claim, and the same claim is now
also supported by a peer-reviewed Wiley paper, **add** the Wiley
citation alongside. Don't remove the IS citation (it has different
scope — usually a case study vs a methodology review). Format:
`[conf-is2024-pXXX, journal-wiley-se-29-4-...]` if the parser
supports it, otherwise add a parenthetical.

### Step 4: Maturity bumps (data-driven)

For each topic's `maturity:` field in frontmatter, compute the
number of peer-reviewed + IS-2024-or-IS-2025 entries that map to
this topic. If count >= 20, keep `established`; if 5-20, keep
`established` (since 2024-2025 work); if 0-5, downgrade to
`emerging`. Most topics are already `established`; this is a
verification step, not a change.

### Step 5: "Related entries" on the 11 new Wiley entries

For each of the 11 Wiley entries, add a `## Related entries` section
at the end with 2-4 related entries (by shared topic / domain /
practice tags). The relationship types are:
- **same-topic-different-angle**: covers the same SEBoK topic but
  from a different domain
- **same-domain-different-topic**: covers the same app domain but
  a different SEBoK topic
- **builds-on**: explicitly cites / extends the other entry's method

Examples:
- Duroy (SysML v2 ESA) → Bourdellès (product line modeling) —
  same-topic-different-angle
- Bakhshi (capability complexity) → Kaplan (robotaxis SoS) —
  same-topic-different-angle
- Fu (cluster SRL) → Chaudemar (safety procedures for UAS) —
  same-domain-different-topic (both defense/auto)

### Step 6: Auto-detection helper in parser.js (optional)

Per user's "adaptive" framing: a small `getRecentUpdates(topic, days)`
function in `parser.js` that returns entries with `published` date
in the last N days that have the topic in their `topic` or
`domain_tags` or `practice_tags`. This would let a topic page
auto-render a small "Last updated N days ago by M papers" line at
the top.

**Decision**: skip this for v1.18. The function is small but the
UI work to display it on 31 topic pages is bigger than the value.
Defer to v1.19 if the user wants it.

### Step 7: Fold the "What's new in 20XX" appendices

The v1.16 "What's new in 2024-2025" and v1.17 "What's new in 2026"
sections on the 6 updated topic pages have served their purpose —
they documented the *initial integration* of the new research. In
v1.18, their content is **redistributed** into the body sections
(`## Patterns that work` etc.) and the standalone appendix is
removed.

This is the key "adaptive" change: the page no longer has a
"newspaper corner" — the new research is *part of* the page, not
*next to* the page.

## Test Matrix

- 31 topic pages render without errors
- All inline citations resolve (existing smoke check)
- New `## Related entries` sections on the 11 Wiley entries don't
  introduce broken links
- No regressions in: 24 smoke + 47 parser + 86 routes
- Maturity field remains valid in frontmatter (existing schema check)
- Each topic page has either:
  - at least one inline citation from a 2024-2026 source, OR
  - a `last_curated` date within the last 90 days (the existing
    freshness check)

## Save Path

Files to modify:
- 6-8 topic pages: `topics/system-def.md`, `topics/sos.md`,
  `topics/realization.md`, `topics/eng-domains.md`,
  `topics/sys-fund.md`, `topics/management.md`,
  `topics/sec.md` (heavy/moderate)
- 11 new Wiley entries: add `## Related entries` section
  (entries/journal-wiley-se-29-4-*.md)
- Possibly `topics/deploy-use.md`, `topics/concept-def.md` (light)

Files to remove:
- The "What's new in 2024-2025" section from v1.16 (redistribute
  into body, remove standalone)
- The "What's new in 2026" section from v1.17 (same)

Files NOT modified:
- `assets/parser.js` (no schema change)
- `assets/app.js` (no UI change)
- `assets/entries-index.js` (no new entries — just integrated)
- `scripts/smoke.js` (existing checks still validate)

## What I'm NOT doing

- Not auto-rendering "last updated by N papers" on topic pages
  (deferred to v1.19 if requested)
- Not changing the taxonomy (v1.10) — locked
- Not fabricating new patterns — only integrating patterns the
  new research *demonstrates*
- Not removing the existing v1.16 / v1.17 appendices until their
  content is redistributed (no information loss)
- Not adding a per-section changelog to topic pages (deferred —
  bigger UI work)

## Risk assessment

- **Low risk**: in-place edits to topic pages. The body text changes
  but no schema or routing changes.
- **Medium risk**: the 11 Wiley entries getting new `## Related
  entries` sections. Need to make sure the parser handles the new
  section without breaking entry-page rendering.
- **Low risk**: removing the standalone "What's new" appendices.
  Their content is preserved in the body.

## Commit size estimate

- ~50-80 line edits across 6-8 topic pages
- ~10 line additions per Wiley entry (related entries section)
- ~5-15 line removals (the "What's new" appendices)

Total: ~150-200 line changes across ~20 files. Reasonable for a
single v1.18 commit.

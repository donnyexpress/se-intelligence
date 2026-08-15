# SE Intelligence v1.19 — Auto-Adaptive Workflow

**Date**: 2026-08-15
**Status**: Analysis + implementation
**Trigger**: After v1.18 made the body adaptive manually, the user asked
to "setup an auto workflow so that subsequent new articles will also
update the body of knowledge."

## Goal

When new entries are added (from a Book of Abstracts, a journal issue,
a hand-curated source, an arXiv preprint, etc.), the topic pages'
"Patterns that work", "Best practices", and "Research frontiers"
sections should be **automatically** updated to reflect the new
evidence — without the user having to manually rewrite each topic page.

## Design

Three pieces, each a separate script. They run in sequence:

### Step 1: Entry generation (already exists)

`scripts/incose_import/parse_is2024.py` and `parse_is2025.py` generate
`entries/conf-is2024-pNNN-*.md` and `entries/conf-is2025-pNNN-*.md` from
Book of Abstracts PDFs. `scripts/import_wiley_se_29_4.py` does the same
for Wiley journal issues.

For new entry sources, the user (or a new script) creates a similar
parser that outputs `.md` files in `entries/` with the same frontmatter
schema.

### Step 2: NEW — `scripts/update_topic_bodies.py` (auto body update)

This script:

1. **Loads all entries** from `entries/*.md` (uses `assets/parser.js`).
2. **Groups entries by primary topic** (`topic:` field) and by app
   domain (`domain_tags:`).
3. **For each topic page** in `topics/*.md`:
   - Finds inline citations `[<key>]` in the body and in the
     references list
   - For each cited entry, gets the title, authors, year, and
     key claim (TL;DR)
   - Detects if a new claim in the cited entry is *not* already
     represented in the topic page's `## Patterns that work`,
     `## Best practices`, or `## Research frontiers` sections
   - If a new pattern/claim is detected, **inserts a new bullet
     or paragraph** into the appropriate section
   - Updates the `References` list to add the new entry

The "not already represented" check uses simple keyword overlap
between the entry's TL;DR and the existing section text. The threshold
is tunable (default: cosine similarity < 0.3 between new claim and any
existing claim in the section).

For each topic page, the script produces:
- A new bullet in `## Research frontiers` (or `## Patterns that work`
  if the new claim is a pattern) with the citation
- A new line in the references list
- A `last_curated: <date>` update

**This is what "adaptive" means in practice**: the topic page
*changes* in response to new entries, not just gets a new appendix.

### Step 3: NEW — `scripts/diff_topic_bodies.py` (review surface)

A dry-run mode that shows what `update_topic_bodies.py` would change
without writing. The output is a unified diff that the user can review
before applying.

### Step 4: `entries-index.js` update (already done by entry generation)

The entry parsers already add new keys to `entries-index.js`. The
`update_topic_bodies.py` script doesn't touch this file.

## When to run

Three trigger points, in priority order:

1. **Manual run** — user invokes `python3 scripts/update_topic_bodies.py`
   after importing a new batch of entries. This is the "explicit"
   mode and is what the user controls.

2. **Pre-commit hook** — if the working tree has new `entries/*.md`
   files since `git log -1`, the hook runs the update + diff
   automatically. The user reviews the diff before committing.

3. **Scheduled run** — a monthly cron job (or a `git log`-based check)
   that detects new entries not yet integrated into the topic pages
   and runs the update.

For v1.19, **only the manual run + pre-commit hook** are wired up. The
scheduled run is a future enhancement.

## Implementation: `update_topic_bodies.py`

Sketch:

```python
import os
import re
from collections import defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer  # optional; can use plain text overlap

def load_entries():
    """Load all entries, return dict {key: {title, summary, topic, ...}}"""
    ...

def load_topic_page(path):
    """Load a topic page, return {frontmatter, body, sections}"""
    ...

def find_new_claims(entry, topic_page, threshold=0.3):
    """Compare entry's TL;DR to existing claims; return claims not
    already represented."""
    ...

def insert_claim(topic_page, claim, section, key):
    """Insert a new bullet in the appropriate section."""
    ...

def update_topic_bodies(dry_run=False):
    """Main entry point."""
    ...
```

The actual claim-detection logic needs more thought. Two approaches:

- **Keyword overlap** (simple): split TL;DR into keywords; check if
  those keywords appear in the section. If not, treat as new claim.
- **Sentence embedding** (sophisticated): use a small embedding model
  to compare new TL;DR to existing section text. Adds dependency, slower.

For v1.19, I'll use the **keyword overlap** approach. It's deterministic
(no model dependency), fast, and good enough as a starting point. A
flag in the script (`--use-embeddings`) can switch to embeddings later
if the user wants.

## What I'm NOT doing in v1.19

- **Not auto-detecting contradictions.** If a new paper contradicts an
  existing claim, the script only adds a new bullet; it doesn't
  rewrite or remove the contradicted claim. That's a much harder
  problem and needs human review anyway.
- **Not auto-generating "Related entries" sections** on the new
  entries. The user (or the v1.18 `add_related_frontmatter.py` script)
  handles those.
- **Not auto-maturing topics** (changing `maturity:` from
  `emerging` to `established`). That's a manual call.
- **Not removing stale claims.** A bullet stays in the topic page
  forever; the user can delete manually if needed.

## Save Path

Files to add:
- `scripts/update_topic_bodies.py` (main script, ~150 lines)
- `scripts/diff_topic_bodies.py` (dry-run wrapper)
- `.git/hooks/pre-commit` (auto-runs the update on new entries)
- `docs/analysis/sei-v1-19-auto-adaptive-workflow-2026-08-15.md`
  (this file)
- `scripts/README.md` (updated with the new workflow docs)

Files NOT modified:
- `topics/*.md` (only the auto-update changes them; the user reviews
  the diff first)
- `assets/parser.js` (no schema change)
- `assets/app.js` (no UI change)

## Test Matrix

- `update_topic_bodies.py` runs without error on the current 473-entry
  knowledge base
- The dry-run diff is empty for current state (no new claims to
  add) — because all 473 entries are already integrated in v1.18
- After the user adds a new (synthetic) entry, the script proposes
  one new bullet
- No regressions in 26 smoke + 47 parser + 86 routes

## User flow

1. User imports new entries (existing flow, `parse_is2024.py` etc.)
2. User runs `python3 scripts/update_topic_bodies.py --diff` to see
   what would change
3. User reviews the diff (`git diff topics/`)
4. User runs `python3 scripts/update_topic_bodies.py` to apply
5. User commits (existing flow)
6. Pre-commit hook re-runs the update on any new entries, so the
   integration is "always-current"

That's the auto-workflow.

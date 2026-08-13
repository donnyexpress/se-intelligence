# SE Intelligence v1.13 — IS2024 Topic Rebalance + Sidebar Review

**Date**: 2026-08-13
**Status**: Analysis only — awaiting user approval to implement
**Trigger**: After v1.12 commit (41861a2), user noted the /hot dashboard didn't visibly change and asked for review of SEBoK topics + app domains.

## Impact

- Fix topic mapping skew in 194 IS2024 entries
- Make 8 SEBoK primary topics + 8 app domains visibly populated
- Update topic page references where new entries are relevant
- No regressions to existing test count (target: ≥3459 smoke + 86 routes)

## Problem

After v1.12 added 194 IS2024 entries, the topic distribution skews heavily:

| Topic | Count | Note |
|---|---|---|
| defense | 58 | over-mapped (topic code 6. is in many papers' code list) |
| realization | 33 | OK |
| system-def | 27 | OK |
| sos | 24 | OK |
| ml-sys | 18 | OK |
| eng-domains | 13 | OK |
| energy | 10 | mostly INCOSE energy papers — fine |
| manufacturing | 8 | OK |
| sys-fund | 7 | OK |
| management | 7 | OK |
| auto | 7 | OK |
| health | 5 | OK |
| infra | 5 | OK |
| concept-def | 2 | too low |
| lifecycle | 1 | too low |
| deploy-use | 1 | too low |
| reliab | 1 | too low |
| dist-sys | 1 | too low |
| observ | 1 | too low |
| perf | 1 | too low |
| platform | 1 | too low |
| incid | 0 | zero! |
| manufacturing | 8 | OK |
| finance | 1 | OK |
| sec | 0 | zero! (specialty engineering rail) |

**Root cause of over-mapping**: The IS2024 topic code parser does this:
```
priority = ['sec', 'sos', 'ml-sys', 'defense', 'health', 'energy', 'auto', 'space', 'manufacturing', 'infra',
            'realization', 'system-def', 'sys-fund',
            'management', 'eng-domains']
```

This puts app domains **ahead of** the SEBoK primary topics. But IS2024 papers list 5-10 topic codes, and "6. Defense" is one of them even for non-defense papers. Example: "Excuse me Sir/Madam, which Model?" (a meta-modeling paper) is tagged `defense` because the paper lists "6. Defense" in its topic codes.

**Root cause of zero topics (incid, sec)**: These aren't SEBoK or app domain topics — they're the **practice areas** from v1.10. The new entries need to be tagged with practice areas too, but the parser doesn't do that.

## Plan

### Step 1: Fix the parser priority (the core bug)

Change the priority so SEBoK primary topics win over app domains, unless the paper is *primarily* about the app domain.

```python
# NEW priority — SEBoK primary topics first, app domains last
priority = ['sys-fund', 'concept-def', 'system-def', 'realization', 'lifecycle', 'deploy-use',
            'management', 'eng-domains', 'sos',
            # app domains last
            'defense', 'health', 'energy', 'auto', 'space', 'manufacturing', 'infra', 'finance']
```

Plus, only use app domain as primary if the paper is **majority** about that domain. Heuristic: if the SEBoK topic code (1-5) is present, prefer that. Only use the app domain (6-22) if no SEBoK code is present.

### Step 2: Add practice area tags to entries

The parser already detects some practice areas via keywords (e.g., "Systems of Systems" → `sos`). Extend to detect:
- `observ` keywords: monitoring, observability, telemetry, eBPF
- `perf` keywords: performance, latency, throughput
- `platform` keywords: platform engineering, internal developer, IDP
- `reliab` keywords: reliability, SLO, error budget, fault tolerance
- `incid` keywords: incident, postmortem, on-call, SRE
- `ml-sys` keywords: ML system, ML platform, inference, training pipeline
- `dist-sys` keywords: distributed, consensus, Raft, partition

Add these as `practice:` field (or in `tags:` array) in the frontmatter.

### Step 3: Update topic page references

The synthesized topic pages reference specific source keys. For topics with new relevant entries, add a 1-line note. Affected topics:
- `system-def` (27 entries, was 6) — pick 2-3 best to add as references
- `realization` (33 entries, was 6) — add 2-3
- `sos` (24 entries, was 4) — add 1-2
- `ml-sys` (18 entries, was 2) — add 1-2
- `defense` (will go from 58 to ~5-10 after fix) — keep current refs
- `eng-domains` (13 entries) — add 1-2 specialty papers

### Step 4: Re-validate

- Re-run parser on the 194 IS2024 entries
- Update `topic:` field in each entry .md
- Run smoke + route tests (target: ≥3459 + 86 = 3545)
- Visual check: /hot dashboard should now show 10+ topics with realistic distribution

## Test Matrix

- After fix, target topic distribution: defense ≤15, realization 30-40, system-def 25-35, sos 15-25, ml-sys 15-25, others 3-15
- No topic should have 0 entries (except the truly out-of-scope ones)
- All 235 entries should still have valid frontmatter
- /hot should show 10-12 trend rows with realistic counts
- Topic pages should render without errors

## Save Path

Files to modify:
- `scripts/incose_import/parse_is2024.py` (priority + practice areas)
- 194 entry .md files in `entries/conf-is2024-*.md` (re-run parser, regen)
- 4-6 topic page .md files in `topics/` (add references)
- `assets/entries-index.js` (no change — same keys, same order)

No commit without explicit user approval. Track locally first, present diff for review.

## What I'm NOT Doing (per user rules)

- Not changing the taxonomy (v1.10) — that's locked
- Not fabricating abstracts — all abstracts from public PDF
- Not adding member-only or auth-bypassed INCOSE content
- Not changing topic page content beyond adding reference lines

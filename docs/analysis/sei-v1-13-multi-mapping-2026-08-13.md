# SE Intelligence v1.13 — IS2024 Multi-Mapping + Sidebar Refresh

**Date**: 2026-08-13
**Status**: Analysis only — awaiting user approval to implement
**Trigger**: After v1.12 commit (41861a2), dashboard didn't visibly change.
**User direction**: A single paper can cut through multiple domains, so map it to ALL relevant domains, not just one primary.

## Impact

- Each IS2024 entry gets a `domains:` list (or `practiceAreas:` list) reflecting ALL topics it covers
- Dashboard counts reflect true coverage: defense papers that ALSO do MBSE show up under both
- Topic pages reference more relevant papers
- App domains get realistic counts (defense won't be artificially high)

## Problem

The v1.12 parser picks ONE primary topic per entry using a priority list. But a paper like "Defense Use of MBSE in Practice" legitimately covers:
- `defense` (app domain)
- `system-def` (SEBoK primary)
- `mbse` (key technique)

The current code picks `defense` because it ranks first in priority. Result: `defense` is over-mapped (58 entries), while `system-def` and others are under-mapped.

Also, the site has both:
- `topic:` field — the **primary** topic (single value, for grouping)
- `domain:` / `practice:` query filters — for the audience pages

We need to add a way to express multi-mapping without breaking the primary grouping.

## Plan

### Step 1: Add a multi-mapping field to entries

Two options:

**Option A: Add `domain_tags:` and `practice_tags:` arrays (JSON list)**

```yaml
---
topic: system-def          # primary, single, used for grouping
triage: read
source_type: paper
domain_tags: [defense, ml-sys]      # secondary app domains / practice areas
practice_tags: [platform, observ]   # v1.10 practice areas this paper touches
---
```

**Option B: Make `topic:` itself an array**

```yaml
---
topic: [system-def, defense]   # multiple primaries
```

**Recommendation: Option A**. Keep `topic:` single (for backwards compat and primary grouping), add `domain_tags` and `practice_tags` for the multi-mapping. This way:
- Topic pages still work the same way (group by primary `topic`)
- Audience pages (`/for-practitioners` etc.) can use `domain_tags` + `practice_tags` to find "papers in defense that also use MBSE"
- The dashboard's per-topic counts reflect only primary topics, but cross-cutting coverage is queryable

### Step 2: Detect ALL matching topics in the parser

Change `is_code_to_se_topic` from "return one" to "return all that match":

```python
def is_codes_to_se_topics(topics_text):
    """Return ALL SE Intelligence topic keys that match the IS2024 topic codes."""
    se_topics = set()
    text = topics_text.lower()

    # Special keywords — multi-tag any match
    keyword_map = {
        'defense': 'defense', 'aerospace': 'defense', 'military': 'defense',
        'auto': 'auto', 'automotive': 'auto', 'autonomous vehicle': 'auto',
        'health': 'health', 'medical': 'health', 'clinical': 'health',
        'energy': 'energy', 'environment': 'energy', 'sustainability': 'energy',
        'infrastructure': 'infra', 'railway': 'infra', 'maritime': 'infra',
        'space': 'space', 'satellite': 'space',
        'manufacturing': 'manufacturing', 'industry 4': 'manufacturing', 'factory': 'manufacturing',
        'finance': 'finance', 'financial': 'finance',
        'systems of systems': 'sos', 'sos': 'sos',
        'observability': 'observ', 'monitoring': 'observ', 'telemetry': 'observ',
        'performance': 'perf', 'latency': 'perf', 'throughput': 'perf',
        'platform': 'platform', 'devops': 'platform',
        'reliab': 'reliab', 'reliability': 'reliab', 'slo': 'reliab',
        'incident': 'incid', 'postmortem': 'incid', 'sre': 'incid',
        'ml system': 'ml-sys', 'inference': 'ml-sys', 'training pipeline': 'ml-sys',
        'distributed': 'dist-sys', 'consensus': 'dist-sys',
    }
    for kw, tag in keyword_map.items():
        if kw in text:
            se_topics.add(tag)

    # Numeric code mapping — multi-tag all matches
    for m in re.finditer(r'(\d+)\.(\d+)\.?', topics_text):
        prefix = f'{m.group(1)}.{m.group(2)}'
        # SEBoK primary (1-5)
        if prefix.startswith(('1.', '2.', '3.', '4.', '5.')):
            for se_topic, prefixes in TOPIC_MAP.items():
                if prefix in prefixes:
                    se_topics.add(se_topic)
                    break
        # App domains (6-22)
        elif prefix.startswith('6.') or 'aerospace' in text:
            se_topics.add('defense')
        elif prefix.startswith('11.') or prefix.startswith('21.'):
            se_topics.add('auto')
        # ... etc
    return se_topics
```

The PRIMARY topic is then chosen by:
1. SEBoK primary topic (sys-fund, system-def, etc.) if any
2. Else first app domain
3. Else eng-domains (default)

### Step 3: Update build_entry to write both fields

```python
def build_entry(...):
    all_topics = is_codes_to_se_topics(parsed['topics'])
    primary = pick_primary(all_topics)
    app_domains = all_topics & {'defense', 'auto', 'health', 'energy', 'infra', 'space', 'manufacturing', 'finance'}
    practice_areas = all_topics & {'observ', 'perf', 'platform', 'reliab', 'incid', 'ml-sys', 'dist-sys'}

    md = f'''---
topic: {primary}
domain_tags: {json.dumps(sorted(app_domains))}    # app domains this paper covers
practice_tags: {json.dumps(sorted(practice_areas))}  # practice areas this paper covers
...
---'''
```

### Step 4: Update the dashboard to use multi-mapping

The /hot dashboard's "entries" count for each topic currently counts `e.topic === topic`. Change to also count `domain_tags` and `practice_tags` membership:

```javascript
// Before:
entries.filter(e => e.topic === topic).length

// After:
entries.filter(e =>
  e.topic === topic ||
  (e.domain_tags || []).includes(topic) ||
  (e.practice_tags || []).includes(topic)
).length
```

This means a paper tagged `system-def` + `defense` shows up in BOTH the `system-def` and `defense` counts. Realistic coverage.

### Step 5: Update topic pages to surface the new IS2024 entries

For each SEBoK primary topic with new entries, add 1-2 lines to the topic page referencing the best IS2024 papers. Affected:
- `topics/system-def.md` — add refs to best MBSE pattern papers
- `topics/realization.md` — add refs to best integration/test papers
- `topics/sos.md` — add refs to best SoS architecture papers
- `topics/ml-sys.md` — add refs to best AI/MBSE papers
- `topics/eng-domains.md` — add refs to best specialty engineering papers

For each app domain with new entries, add 1-2 refs to the topic page:
- `topics/defense.md` — add best defense IS2024 papers
- `topics/health.md` — add healthcare SoS paper
- `topics/auto.md` — add automotive IS2024 papers
- `topics/manufacturing.md` — add manufacturing papers
- `topics/energy.md` — add energy papers

## Test Matrix

- After fix, /hot dashboard should show all 8 SEBoK primary topics + 8 app domains + 7 practice areas with realistic counts
- `defense` count drops from 58 to ~10-15 (only true defense papers)
- `system-def` count goes from 27 to ~50-60 (papers that ALSO do MBSE)
- Each IS2024 entry has 1-3 `domain_tags` and 0-2 `practice_tags` populated
- Topic pages show new reference lines that link to real IS2024 papers
- Tests: 3459 smoke + 86 routes still passing, plus new checks for `domain_tags`/`practice_tags` arrays

## Save Path

Files to modify:
- `scripts/incose_import/parse_is2024.py` (multi-tag detection)
- 194 entry .md files in `entries/conf-is2024-*.md` (re-run, regen with multi-tags)
- 4-6 SEBoK primary topic pages + 4-6 app domain topic pages (add reference lines)
- `assets/app.js` (dashboard multi-count, query filter for `domain_tags`)
- `assets/parser.js` (parse `domain_tags` and `practice_tags` as arrays)

No commit without explicit user approval. Track locally first, present diff for review.

## What I'm NOT Doing (per user rules)

- Not changing the taxonomy (v1.10) — that's locked
- Not fabricating abstracts — all abstracts from public PDF
- Not adding member-only or auth-bypassed INCOSE content
- Not removing entries that get multi-tagged — they stay

# SE Intelligence v1.16 — Topic Updates + Concept Deep-Dives

**Date**: 2026-08-15
**Status**: Analysis only — awaiting user approval
**Trigger**: After v1.14 added 178 IS2025 + 192 IS2024 entries, the user
noted these are being treated as isolated new ideas. They should also
trigger topic updates and concept deep-dives for transformative ideas.

## Impact

- 4-6 topic pages get a "v1.16 update" section showing what changed in
  the topic during 2024-2025 (from the new IS2024+IS2025 papers)
- 4-5 concept deep-dive pages added for transformative ideas
  (LLM-MBSE, Digital Twin, Mission Engineering/UAF, SoS Governance,
  Sustainability in SE)
- Deep-dive pages supplement INCOSE papers with online sources
  (arXiv, vendor docs, news, Wikipedia) for fuller context
- Test count stays small (only cross-cutting checks added)

## Problem

v1.12-v1.14 added ~370 IS2024+IS2025 entries to the knowledge base.
The entries are well-structured (real abstracts from the public PDFs)
and the topic pages reference some of them. But:

1. The topic pages don't reflect what's NEW. The system-def topic
   page still talks about MBSE patterns from 2025; the 50 IS papers
   on LLM-augmented MBSE from 2024-2025 aren't surfaced as a
   transformative shift in the topic.
2. Each paper is treated as an isolated source. There's no synthesis
   of "here's what changed in this domain in 2024-2025".
3. The "disruptive" papers panel on the home page still shows only
   3 papers (STPA, DORA, Team Topologies). LLM-MBSE and digital twin
   should probably be on this list.

## Plan

### Step 1: Topic update sections

For each SEBoK primary topic with >20 new IS2024+IS2025 entries, add
a "v1.16 update" section to the topic page that synthesizes what's
new. Topics affected:
- system-def (186 entries) — biggest update
- sos (75) — SoS governance is the new emphasis
- realization (71)
- sys-fund (45)
- eng-domains (23)
- management (14)

App domain topics:
- defense (9 primary + many domain_tags)
- manufacturing (1 + many domain_tags)
- auto (3 + many domain_tags)

Each "v1.16 update" section will be 2-4 paragraphs summarizing:
- The major themes that emerged in 2024-2025 papers
- Which papers introduced new ideas vs. extended existing ones
- What's likely to be on the 2026+ research agenda

### Step 2: Concept deep-dive pages

For transformative concepts that emerged across many IS2024+IS2025
papers, add a new topic-style page that synthesizes both INCOSE and
external sources. Each gets its own URL like `/concept/<key>`.

Concepts to add (prioritized by paper count and transformative impact):

1. **AI/LLM-augmented MBSE** (50 papers, 2024-2025)
   - Synthesis of what INCOSE researchers showed
   - Supplement with: arXiv papers on LLM code generation, vendor
     announcements (Dassault, Siemens, IBM), news on GPT-4/Claude
     for engineering, blog posts from MBSE practitioners
   - URL: /concept/llm-augmented-mbse

2. **Digital Engineering / Digital Thread** (47 papers)
   - INCOSE's DE initiative since 2018, accelerated by AI tools
   - Supplement with: DoD Digital Engineering Strategy, NASA DE,
     vendor implementations, the DoD's T&E implications
   - URL: /concept/digital-engineering

3. **Mission Engineering with UAF** (41 papers)
   - From platform-centric to capability-centric SE
   - Supplement with: UAF specification (OMG), NATO MSE papers,
     US DoD mission engineering doctrine
   - URL: /concept/mission-engineering-uaf

4. **SoS Governance** (34 papers)
   - How to engineer when no single party owns the system
   - Supplement with: Dahmann/Saridou case studies, NIST SoS
     guidance, Wikipedia SoS
   - URL: /concept/sos-governance

5. **Sustainability in SE** (21 papers)
   - SE for the climate crisis, decarbonization, circular economy
   - Supplement with: UN SDGs, IEEE P7000 series, EU Taxonomy
   - URL: /concept/sustainability-se

### Step 3: Online source supplementation

For each concept deep-dive, supplement INCOSE papers with 2-5
external sources from:
- arXiv (open access papers on the same topic)
- Wikipedia (foundational definitions)
- Vendor docs (Dassault, Siemens, IBM, ANSYS) for tool support
- News / industry analyses (IEEE Spectrum, Wired, etc.) for context
- Government / standards bodies (DoD, NASA, NATO, OMG) for policy

Each external source gets a separate entry with a `source:` field
pointing to the URL, similar to how INCOSE sources work.

### Step 4: Disruptive papers panel refresh

Update `config.js`'s `disruptivePapers` to include the new
transformative papers (LLM-MBSE, digital twin). Keep STPA/DORA/
Team Topologies for variety.

## Test Matrix

- 4-6 topic pages have new "v1.16 update" sections (visual check)
- 4-5 new concept deep-dive pages render without errors
- Each concept page has 2-5 INCOSE sources + 2-5 external sources
- Disruptive papers panel still has 3 papers (refreshed content)
- Smoke tests: 26 → 30+ (added concept-page schema checks)
- Routes: 86 → 100+ (added concept-page route tests)

## Save Path

Files to modify:
- 4-6 topic pages in `topics/` (added "v1.16 update" section)
- 4-5 NEW concept deep-dive pages in `concepts/` (new directory)
- 10-25 NEW entry files in `entries/` (external sources for deep-dives)
- `assets/config.js` (refreshed disruptivePapers)
- `assets/entries-index.js` (add new entries)
- `assets/app.js` (add `/concept/<key>` route)
- `assets/parser.js` (add concept page parser if needed)

No commit without explicit user approval. Track locally first, present
diff for review.

## What I'm NOT Doing (per user rules)

- Not changing the taxonomy (v1.10) — that's locked
- Not fabricating abstracts — INCOSE abstracts from public PDFs
- Not adding member-only or auth-bypassed content
- Not removing entries that get re-tagged — they stay
- Not adding AI-generated sources for the deep-dives — only verified
  real online sources (arXiv, Wikipedia, vendor docs, standards)

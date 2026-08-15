# SE Intelligence v1.17 — Wiley Systems Engineering Journal 29(4) extraction

**Date**: 2026-08-15
**Status**: Analysis only — awaiting user approval
**Trigger**: User attached the *Systems Engineering* journal Volume 29
Number 4 (July 2026) "Issue Information" page (DOI
`10.1002/sys.70077`) and asked to "extract information and fill in the
gaps". This is the flagship INCOSE-affiliated journal (Wiley), and these
are peer-reviewed papers — strictly higher signal than the IS
conference papers we extracted in v1.12–v1.14.

## Impact

- 11 new entries added to the knowledge base (Wiley journal, July 2026)
- 462 → 473 entries total
- 0 new topic pages (existing taxonomy is sufficient)
- 0 new test count (existing 161 tests cover the validation we need)
- One topic page gets a small "What's new in mid-2026" appendix
  (the journal paper is a 2026 mid-year signal)
- Entries get a new `event: wiley-se-29-4` marker for distinguishability

## Problem

The user found the *Systems Engineering* (Wiley) journal TOC for the
mid-2026 issue. This is INCOSE's flagship peer-reviewed venue — not
the same as the IS conference proceedings. The 11 papers in this issue
are individual peer-reviewed contributions, so each one is a real
entry on its own (not a corpus to mine for themes like the IS BoA
was).

The papers are individually significant. Two examples:
- "Paving the Way for SysML v2: An ESA MBSE Methodology Implementation
  Review" — first major peer-reviewed assessment of ESA's SysML v2
  MBSE methodology, from the team that built it
- "Digital Twins Across Domains: A Cross-Industry Umbrella Review of
  Systematic Literature Reviews" — synthesizes 79 SLRs on digital
  twins; the most comprehensive secondary review on the topic to date

The user's instruction: "extract information from this and fill in
the gaps". The "gaps" are:
1. Our 462 entries are 99% from IS conference papers + ~20 hand-curated
   sources. We don't yet have any peer-reviewed *journal* papers from
   2026.
2. Several papers address important topics that are under-represented
   in our entries (capability complexity, cluster-based readiness
   levels, set-based verification, ESA's SysML v2 methodology).

## Plan

### Step 1: Add 11 new entries

All 11 papers from the issue info page, with:
- Topic mapping (primary + domain_tags + practice_tags) based on
  abstract content
- Real DOI and Wiley landing URL as `source_url`
- Real abstracts (from OpenAlex inverted index reconstruction — these
  are public metadata, equivalent to what the journal shows on its
  landing page)
- `published: 2026-02-XX` (the OpenAlex publication date is the
  article's first-online date; volume 29/4 is the July 2026 issue
  date)
- `event: wiley-se-29-4` to distinguish from IS conference entries
- `source_type: paper-journal` (a more specific signal than
  `paper`)
- Author lists verified against the TOC page

### Step 2: Topic mapping (the key decision)

Each paper gets a primary topic + tags based on its actual content:

| # | Paper | Primary | Domain tags | Practice tags |
|---|---|---|---|---|
| 1 | Bakhshi & Efatmaneshnik — Assessing Capability Complexity (EAF) | sos | defense | observ |
| 2 | Chaudemar et al. — Safety-Driven Dynamic Procedure Modeling | eng-domains | space, auto | reliab |
| 3 | Georgsen — Navigating Uncertainty (PHAS) | sys-fund | management | — |
| 4 | Fu, Mazzuchi, Sarkani — Cluster-Based System Readiness | eng-domains | defense | reliab |
| 5 | Kaplan et al. — AI-Driven Labor Transitions (robotaxis) | sos | auto, manufacturing | ml-sys |
| 6 | Bourdellès et al. — Product Line Modeling (confidentiality) | system-def | manufacturing | — |
| 7 | Jung et al. — STRIDE-Based Threat Modeling (Korean food) | sec | manufacturing, health | incid |
| 8 | Duroy et al. — Paving the Way for SysML v2 (ESA) | system-def | space | platform |
| 9 | Obiako et al. — Systematic Learning (SmTS, ABMs) | eng-domains | auto | ml-sys |
| 10 | Xu & Salado — Set-Based Verification Planning | realization | — | — |
| 11 | Wooley, Dimson, Bitencourt — Digital Twins Umbrella Review | system-def | (cross-industry) | observ, ml-sys |

### Step 3: Topic page update (eng-domains + system-def)

After the entries are in, add a small "Wiley *Systems Engineering*
July 2026: peer-reviewed updates" appendix to two topic pages:
- topics/eng-domains.md (papers 2, 4, 9)
- topics/system-def.md (papers 6, 8, 11)

This is a peer-reviewed counterpart to the v1.16 conference-paper
sections. The pattern: cite the journal issue and the specific DOIs
in a new subsection under "Research frontiers".

### Step 4: Topic page update for the practice areas

Three practice areas get a small bump in coverage from these papers:
- observ: 1 (Bakhshi capability complexity)
- reliab: 2 (Chaudemar safety procedures, Fu cluster readiness)
- ml-sys: 2 (Kaplan robotaxis, Obiako SmTS, Wooley DT)
- platform: 1 (Duroy SysML v2 ESA)
- incid: 1 (Jung STRIDE Korean food)

These are still thin but each gets a real peer-reviewed citation. No
new practice-page changes needed — the practice area pages already
reference these keys.

### Step 5: The "fill the gaps" framing

The user said "fill in the gaps". The most concrete gaps these 11
papers fill:
- **SysML v2**: our existing entries are mostly IS 2024-2025 talks
  on SysML v2 prototypes. The Duroy et al. paper is the first
  peer-reviewed case study (ESA's production methodology).
- **Digital twin**: our existing entries are mostly IS 2024-2025
  papers. The Wooley et al. paper is a peer-reviewed secondary
  review (synthesizes 79 SLRs).
- **AI/ML for SE**: mostly IS papers. Kaplan et al. is the first
  peer-reviewed paper on AI/labor transitions in an SE framing.
- **Set-based verification**: Xu & Salado is a major extension of
  prior verification-strategy work.
- **STRIDE in food industry**: a concrete app-domain example we
  lack.
- **Safety-driven procedures for UAS**: Chaudemar et al. fills a
  gap in safety patterns for autonomous systems.
- **Cluster-based readiness levels**: Fu et al. is the first
  peer-reviewed extension of SRL with mathematical interface
  properties.
- **Capability complexity via EAF**: Bakhshi fills a gap on
  quantitative SoS complexity.

## Test Matrix

- 11 new entries pass smoke.js (taxonomy, key, year, source URL)
- 11 new entries pass parser.js (frontmatter shape)
- No new routes needed (each entry is `/source/<key>`)
- 161 → 161 tests (no new tests required; existing tests cover
  entry addition)
- 1 new section appears on 2 topic pages (visual check)

## Save Path

Files to add:
- 11 new entries in `entries/journal-wiley-2026-<slug>.md` (or
  similar — I prefer `journal-wiley-se-29-4-<slug>.md` for clarity
  that this is from the SE journal Vol 29 No 4)
- 11 new lines in `assets/entries-index.js`

Files to modify:
- `topics/system-def.md` (add Wiley appendix)
- `topics/eng-domains.md` (add Wiley appendix)

No commit without explicit user approval.

## What I'm NOT doing (per user rules)

- Not changing the taxonomy (v1.10) — that's locked
- Not fabricating abstracts — OpenAlex inverted-index reconstructed
  from the journal's public metadata
- Not adding member-only or auth-bypassed content
- Not adding new routes (existing entry-page route is sufficient)
- Not citing the journal issue in a way that bypasses the
  publisher (linking to DOI landing pages is the standard way)
- Not adding the issue info page itself as an entry (it's not a
  paper, just TOC)

## Entry format example (one of the 11)

```yaml
---
last_updated: 2026-08-15
topic: system-def
triage: read
source_type: paper-journal
signal: 0.95       # peer-reviewed journal > IS conference paper
maturity: established
event: wiley-se-29-4
track: july-2026-issue
domain_tags: ["space"]
practice_tags: ["platform"]
authors: "Duroy, Gonzalez Fernandez, Christofi, Fischer, Verhoef"  # 5 authors
year: 2026
published: 2026-02-10
doi: 10.1002/sys.70046
source_url: https://incose.onlinelibrary.wiley.com/doi/10.1002/sys.70046
source_label: "Wiley Systems Engineering 29(4) — Duroy et al. 2026"
---
```

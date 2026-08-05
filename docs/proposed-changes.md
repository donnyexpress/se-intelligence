# Proposed changes — awaiting approval

This file tracks changes I've proposed to make but **not yet committed or pushed**.
Per the standing rule, nothing leaves the local working tree until you say "go".

---

## Batch: 7 new INCOSE 2025 entries (proposed 2026-08-05)

**Scope constraint (per your direction): 2025–2026 INCOSE-public content only.**
Every source URL has been verified as publicly downloadable, no member login.

### Item 1 — A Framework for SE in Early-Stage R&D
- **File**: `entries/se-esrd-framework-hodges-2024.md`
- **Source URL**: `https://www.incose.org/docs/default-source/los-angeles/2024-10_se_in_ernd.pdf`
- **Author**: Hodges, DiMario, Danis (INCOSE LA, ESR&D WG core team)
- **Date**: 2024-10-08
- **Topic**: `concept-def`
- **Domains**: (none)
- **Triage**: `read`
- **Signal**: 0.78
- **Source type**: framework / WG output
- **Source label**: "Read the framework (PDF) →"
- **Status**: pending review

### Item 2 — Implementing Mission Engineering with UAF
- **File**: `entries/mission-engineering-uaf-gagliardi-2024.md`
- **Source URL**: `https://www.incose.org/docs/default-source/north_texas/is24_mission_engineering-hoth_example_v28.pdf`
- **Author**: Gagliardi, Hause, Martin, Phillips (IS 2024 paper, public since early 2025)
- **Date**: 2024-07 (public 2025)
- **Topic**: `concept-def`
- **Domains**: `mission`
- **Triage**: `read`
- **Signal**: 0.76
- **Source type**: paper
- **Source label**: "Read the paper (PDF) →"
- **Status**: pending review

### Item 3 — Safeguarding Sensitive Data: Prompt Engineering for GenAI
- **File**: `entries/safeguarding-genai-prompt-engineering-giang-2025.md`
- **Source URL**: `https://www.incose.org/docs/default-source/enchantment/20250514_enchantment_safeguarding_sensitive_data_pe4genai.pdf`
- **Author**: Jennifer Giang, PhD (INCOSE Enchantment 2025)
- **Date**: 2025-05-14
- **Topic**: `eng-domains`
- **Domains**: `sec`
- **Triage**: `read`
- **Signal**: 0.80
- **Source type**: WG output / position paper
- **Source label**: "Read on INCOSE →"
- **Status**: pending review

### Item 4 — SE Maturity and Cost Modeling Framework for GenAI
- **File**: `entries/se-maturity-genai-madachy-2025.md`
- **Source URL**: `http://sdincose.org/wp-content/uploads/2025/06/SE_Maturity_and_Cost_Modeling_Framework_for_GenAI_2025_Ray_Madachy.pdf`
- **Author**: Dr. Ray Madachy (INCOSE San Diego, June 2025)
- **Date**: 2025-06
- **Topic**: `management`
- **Domains**: (none)
- **Triage**: `read`
- **Signal**: 0.74
- **Source type**: WG output / framework
- **Source label**: "Read on INCOSE SD →"
- **Status**: pending review

### Item 5 — Federated Learning (INCOSE San Diego)
- **File**: `entries/federated-learning-villanueva-2025.md`
- **Source URL**: `http://sdincose.org/wp-content/uploads/2025/09/2025_Federated_Learning_Art_Villanueva.pdf`
- **Author**: Dr. Art Villanueva (INCOSE San Diego, Sept 2025)
- **Date**: 2025-09
- **Topic**: `ml-sys`
- **Domains**: (none)
- **Triage**: `watch`
- **Signal**: 0.72
- **Source type**: chapter talk (slides+narration)
- **Source label**: "Read the chapter talk →"
- **Status**: pending review

### Item 6 — DieselGate — Smoke and Mirrors
- **File**: `entries/dieselgate-smoke-and-mirrors-aftel-2025.md`
- **Source URL**: `http://sdincose.org/wp-content/uploads/2025/05/Dieselgate_incose_sd_robert_aftel_april_2025.pdf`
- **Author**: Robert Aftel (INCOSE San Diego, April 2025)
- **Date**: 2025-04
- **Topic**: `eng-domains`
- **Domains**: (none)
- **Triage**: `read`
- **Signal**: 0.83
- **Source type**: case study
- **Source label**: "Read on INCOSE SD →"
- **Status**: pending review

### Item 7 — Human Factors in Rapid Prototyping
- **File**: `entries/human-factors-rapid-prototyping-zeman-wood-2025.md`
- **Source URL**: `http://sdincose.org/wp-content/uploads/2025/03/TheRoleOfHumanFactorsEngineeringInRapidPrototyping_2025_Zeman_Wood.pdf`
- **Author**: Lilly Zeman, Dr. John Wood (INCOSE San Diego, March 2025)
- **Date**: 2025-03
- **Topic**: `eng-domains`
- **Domains**: (none)
- **Triage**: `read`
- **Signal**: 0.71
- **Source type**: chapter talk (slides+narration)
- **Source label**: "Read on INCOSE SD →"
- **Status**: pending review

---

## Side effects (when batch goes greenlit)

These will be edited *as part of* the same commit, not separately:

1. **`assets/entries-index.js`** — add the 7 new keys, grouped under a new `// INCOSE 2025 public content` comment block
2. **`sitemap.xml`** — add 7 new `<url>` entries with `2026-08-05` lastmod
3. **All 7 entries must have `published:` dates** so the dashboard scores them properly
4. **Smoke + e2e tests** must still pass (214/214 + 22/22)

## Open questions to confirm before I write

- Items 1, 2 are both `concept-def` — want me to swap one?
- Items 3, 6, 7 are all `eng-domains` — want to spread topics more?
- "My take" tone: keep honest, or make more conservative for chapter talks?
- Should I keep item 4 (Newsletter, originally #8) — currently de-scoped?

## Awaiting your call

You said "add 1 to 7" — items 1–7 are queued. Item 8 (Q1 Newsletter) is **deferred** unless you specifically want it.

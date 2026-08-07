# Proposed changes — historical log

> **All items in this file have been shipped.** This document is kept for
> audit purposes. For the current state, see the v1.1, v1.2, v1.3, and v1.4
> analysis docs.

**Migration note (2026-08-06)**: The CF Pages project rename from `tech-scan`
to `se-intelligence` produced a renamed project (`se-intel`) that was stuck
on the old `tech-scan.pages.dev` subdomain with no way to re-issue the
auto-subdomain. Resolution: created a brand-new project named
`se-intelligence` (CF reserved the bare `se-intelligence.pages.dev`, so
the actual URL is **`https://se-intelligence-9y2.pages.dev`**). The old
`se-intel` project is gone. Same GitHub repo, same KV namespace, same
comments — just a new project ID.

**v1.1 (shipped 2026-08-05)**: 7 new INCOSE 2025 source entries:
1. `se-esrd-framework-hodges-2024.md` — Framework for SE in Early-Stage R&D (Hodges, INCOSE LA)
2. `mission-engineering-uaf-gagliardi-2024.md` — Mission Engineering with UAF (Gagliardi, IS 2024)
3. `safeguarding-genai-prompt-engineering-giang-2025.md` — GenAI prompt safety (Giang, Enchantment 2025)
4. `se-maturity-genai-madachy-2025.md` — SE Maturity for GenAI (Madachy, INCOSE San Diego)
5. `federated-learning-villanueva-2025.md` — Federated Learning (Villanueva, INCOSE San Diego)
6. `dieselgate-smoke-and-mirrors-aftel-2025.md` — DieselGate case study (Aftel, INCOSE San Diego)
7. `human-factors-rapid-prototyping-zeman-wood-2025.md` — HFE in prototyping (Zeman & Wood, INCOSE San Diego)

**v1.2 (shipped 2026-08-06)**: 18 new topic pages
- 8 SEBoK primary topics: sys-fund, lifecycle, concept-def, realization, deploy-use, eng-domains, management, sos
- 10 application domains: observ, platform, incid, ml-sys, sec, perf, mission, energy, health, auto

**v1.3 (proposed)**: Engineering Specialty rail (front door) + 3 supporting sources
- 6 new specialty topic pages (placed BEFORE the SEBoK primary rail):
  - `specialty-safety` — System Safety (IEC 61508, ISO 26262, STPA)
  - `specialty-reliability` — Reliability Engineering (FMECA, RBD, MTBF prediction)
  - `specialty-security` — Security Engineering (NIST 800-53, zero trust, supply chain)
  - `specialty-hfe` — Human Factors (MIL-STD-1472, ISO 9241, accessibility)
  - `specialty-maintainability` — Maintainability (MTTR, BIT, service life)
  - `specialty-software` — Software Engineering (DORA metrics, continuous delivery)
- 3 new source entries to back the specialty pages:
  - `specialty-safety-stpa-leveson-2011` — STPA primer (Leveson, MIT)
  - `specialty-reliability-fmea-rbd-milhdbk-217` — FMEA/RBD/prediction methods synthesis
  - `specialty-software-dora-accelerate-2018` — DORA metrics (Forsgren, Humble, Kim)

**Why the Specialty rail?** SEBoK Part 7 (Engineering Specialty) currently sits as a single topic page at order 7 in the primary rail. A practitioner consulting the knowledge base usually has a specialty concern (safety, security, reliability) before they have a structural one (which SEBoK Part). Promoting the 6 disciplines to a top-level rail — placed before the SEBoK Part rail — matches how practitioners actually navigate SEBoK. Each of the 6 has a dedicated article now; previously only one bullet-list summary in eng-domains.md.

**Taxonomy change**: Three-level taxonomy (was two):
1. Specialty engineering (6) — the disciplines (NEW, first)
2. SEBoK Part 1–9 (9) — the structural backbone
3. Application domains (12) — vertical industries

**Engine changes**:
- `assets/config.js` — added `specialtyTopics` block before `primaryTopics`
- `assets/topics-index.js` — 27 keys (was 21), with specialty first
- `assets/parser.js` — `SPECIALTY_TOPIC_KEYS` constant; `TOPIC_PREFIXES` now includes specialty
- `assets/app.js` — `SPECIALTY()` helper; `renderSidebar` renders specialty section between Knowledge base and SEBoK Topics; `renderTopicsIndex` and `renderTopicsSection` look up bucket name from specialty→primary→domain
- `scripts/smoke.js` — `topicKey in primary or domain` check now also accepts specialty
- `topics/eng-domains.md` — added "The six specialties in detail" cross-link block
- `sitemap.xml` — 6 new /topic/ routes for specialty pages, 3 new /source/ routes
# Subdomain migration: new project ID d38067c5

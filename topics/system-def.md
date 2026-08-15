---
topic_key: system-def
level: 4
last_curated: 2026-08-15
maturity: established
---

# System Definition

System Definition covers the activities that turn stakeholder needs into an architecture you can build: requirements analysis, logical and physical architecture, interface definition, and integration planning. In SEBoK Part 4 it sits between Concept Definition and Realization, and it's where most program risk actually lives.

This article covers the basics, the patterns that work across industries, and the best practices that have held up under five years of real MBSE rollouts (now informed by 192+ INCOSE conference papers and peer-reviewed journal articles through 2026). Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

The choice of architecture, the way you model interfaces, and the depth of your requirements all cascade into realization and deployment. Most "failed MBSE" cases aren't tooling failures — they're upstream system definition failures [system-def-mbse-patterns-2025]. The patterns that work in 2025–2026 are well-known; the discipline to apply them consistently is the bottleneck.

## Basics

System Definition is the part of the lifecycle where the system is *described* before it is built. The two dominant activities are **requirements analysis** (stakeholder needs → verifiable requirements) and **architecture definition** (requirements → logical architecture → physical architecture). These are the SEBoK Part 4 activities [lifecycle-iso-iec-15288-2023].

The classical structure is layered:

- **Stakeholder requirements** — what the system must do for the people who depend on it
- **Logical architecture** — what the system does, independent of how it does it
- **Physical architecture** — how the system does it, including component allocation
- **Interfaces** — the contracts between components
- **Verification approach** — how each requirement will be checked

The Magic Grid framework is the most-cited way of organizing this work in 2025 [system-def-mbse-patterns-2025], and it has been adapted to SysML v2 as the language matured [conf-is2025-sysmlv2-magicgrid]. SysML v2 itself is now the default starting point for new projects — the first peer-reviewed production case study (ESA's MBSE methodology ported to v2) was published in mid-2026 [journal-wiley-se-29-4-duroy-sysmlv2-esa-mbse-methodology], and the takeaway from that case is that v2's "definitions and usages" (reusing a definition in multiple contexts) require methodology-level decisions, not just notation changes.

## Patterns that work

Across automotive, defense, and rail MBSE programs, six patterns recurred in published case studies from 2020–2026 [system-def-mbse-patterns-2025]:

1. **Layered architecture** — requirements → logical → physical. The most consistent pattern in industrial MBSE. A model with three distinguishable layers shows up in virtually every published case study.
2. **Scenario-driven verification** — define verification procedures from operational scenarios (use cases, vignettes, mission threads), not from requirements text. The architectural-overview-driven pattern [conf-is2024-p266-early-validation-using-architectural-overviews-a3a] generalizes this to "make the architecture the source of truth for verification", not a separate document.
3. **Traceability as a first-class artifact** — every requirement links to a design element, a test, and a stakeholder need. Tools that don't support this fail in practice. LLMs are now being used to auto-establish traceability at industrial scale [conf-is2024-p098-llm-based-approach-to-automatically-establish-trac], but the *semantic* traceability check still requires a human.
4. **Reuse of architecture patterns** — a reference architecture for the domain (e.g. ISO 26262 for automotive, FACE for avionics) shortens design time and improves review quality.
5. **Early integration of safety and security** — wait until the logical architecture is stable, then co-design safety and security with the functional architecture. Doing it later is more expensive [eng-domains-safety-security-co-design]. Secure design should be a *first-class* activity in system definition, not an add-on at the end [conf-is2024-p054-secure-design-a-practical-approach-for-systems-eng].
6. **Model federation across organizational boundaries** — for multinational or multi-classification programs, federate the models (each party owns their slice) rather than merging into a single classified repository [conf-is2024-p099-enabling-digital-engineering-with-federated-plm-ex]. Combined with confidentiality-aware product line modeling [journal-wiley-se-29-4-bourdelles-product-line-confidentiality], the pattern is now "different stakeholders see different views of the same product line".

The INCOSE Systems Engineering Handbook v5 covers all of these in detail, and is the most-cited reference for industrial practice [lifecycle-iso-iec-15288-2023].

## Best practices

- **Commit to a modelling vocabulary early.** The most common reason MBSE initiatives fail is that teams don't converge on shared naming and structure [system-def-mbse-patterns-2025].
- **Make the architecture the source of truth, not the requirements document.** The architecture is what gets reviewed, integrated, and verified against.
- **Use the same scenarios for design and test.** A scenario that drives the architecture should drive the verification plan — that's what makes traceability real.
- **Don't over-model.** A logical architecture that's too detailed becomes a maintenance burden. Stop at the level where the next decomposition is obvious. Mean dependency length is a quantitative proxy for over-modeling [conf-is2024-p568-automating-rule-checking-to-identify-sysml-modelin].
- **Review at the system level, not the component level.** Component reviews miss the integration risk that lives between components.
- **Use LLMs as accelerators, not authorities.** LLMs can now translate natural language to SysML [conf-is2024-p562-ai-systems-modeling-enhancer-ai-sme-initial-invest] and act as graph-query interfaces over SysML v2 models [conf-is2025-jaxa-llm-mbse], but reliability is still too low for safety-critical domains without human review. Treat LLM output as a draft to validate, not a finished artifact.
- **For SysML v2 migrations, decide the definition-reuse policy first.** ESA's production migration found that v2's first-class support for "definitions and usages" (re-using one definition in multiple contexts) is a methodology decision, not a syntax convenience [journal-wiley-se-29-4-duroy-sysmlv2-esa-mbse-methodology]. Decide upfront: do you use this for variant modeling, for product lines, or stay close to v1 semantics?

## Research frontiers

The 2024–2026 evidence base shows three threads moving from research into practice:

- **LLM-augmented MBSE is now working practice in non-safety-critical domains.** Three concrete patterns have emerged: (1) LLM as natural-language to SysML translator [conf-is2024-p562-ai-systems-modeling-enhancer-ai-sme-initial-invest], (2) LLM as a graph-query interface over SysML v2 models (JAXA team's Neo4j + LLM pattern) [conf-is2025-jaxa-llm-mbse], and (3) LLM-driven requirements traceability at industrial scale [conf-is2024-p098-llm-based-approach-to-automatically-establish-trac]. The peer-reviewed caveat [journal-wiley-se-29-4-duroy-sysmlv2-esa-mbse-methodology] is that even with LLM assistance, the model must be reviewed by a human systems engineer before any safety-critical decision.
- **Digital twins are now established as a cross-industry pattern, with 79 SLRs synthesized.** Wooley, Dimson & Bitencourt's umbrella review of 79 peer-reviewed systematic literature reviews [journal-wiley-se-29-4-wooley-digital-twins-umbrella-review] finds that the DT concept is still fragmented across industries, with no shared definition. The review proposes a unified framing centered on *data flow* rather than the marketing "3D replica" view — which aligns with the SE view of the system as a model, not a picture. The MBSE plateau now extends from "design model" to "operational runtime".
- **SysML v2 is the new baseline, not "coming soon".** Multiple 2024-2025 papers reported on real-world adoption [conf-is2025-sysmlv2-magicgrid], and ESA's 2026 case study [journal-wiley-se-29-4-duroy-sysmlv2-esa-mbse-methodology] is the first peer-reviewed production methodology in v2. The methodology-level decisions (definition reuse, Functions) are not notation issues.

Other 2024-2025 work worth noting:

- **MBSE for Model-Based Design Engineering (MBDE) in robotics.** The patterns work for mechatronic systems but need adaptation for real-time control loops [conf-is2025-pavalkis-mbde-robotic-arm].
- **ARCADIA / Capella in maritime system definition.** Real case study for wind-assisted bulk carrier vessel design [conf-is2024-p260-application-of-the-arcadia-method-on-a-bulk-carrie] — a concrete example of MBSE in non-traditional defense domains.
- **V-Model modernization for digital engineering.** The "Arch Model" refreshes the classical V-Model for integrated digital engineering, addressing the misperceptions that have reduced the V-Model's efficacy in practice [conf-is2024-p370-a-classical-modernization-of-the-v-model].
- **Product line modeling with confidentiality.** A confidentiality model runs alongside the variability model, so different stakeholders see different views of the same product line [journal-wiley-se-29-4-bourdelles-product-line-confidentiality] — a real enterprise pattern for OEMs managing product variants across customer segments with different IP exposure.

## What to read first

If you only read three things on System Definition, read:

1. The MBSE patterns synthesis — five years of cross-industry case studies distilled [system-def-mbse-patterns-2025]
2. The Magic Grid framework, adapted for SysML v2 [conf-is2025-sysmlv2-magicgrid]
3. ESA's SysML v2 production migration — the first peer-reviewed case study [journal-wiley-se-29-4-duroy-sysmlv2-esa-mbse-methodology]

## References

1. MBSE patterns — what 5 years of industry adoption tells us (2025)
2. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)
3. SysML v2 + Magic Grid at IS 2025 (2025)
4. LLM-augmented MBSE — JAXA team's graph-database approach (IS 2025)
5. AI systems modeling enhancer (AI-SME) — initial investigations (IS 2024)
6. LLM-based requirements traceability (IS 2024)
7. Multi-level FMEA driven by architecture (IS 2025)
8. MBDE for mechatronic/robotic systems (IS 2025)
9. Safety and security co-design in system definition
10. Secure design as a first-class activity (IS 2024)
11. Model federation across security boundaries (IS 2024)
12. Architectural-overview-driven verification (IS 2024)
13. ARCADIA / Capella for maritime (IS 2024)
14. V-Model modernization (IS 2024)
15. ESA MBSE Methodology ported to SysML v2 — peer-reviewed case study (Wiley SE 29(4), 2026)
16. Digital twins across industries — umbrella review of 79 SLRs (Wiley SE 29(4), 2026)
17. Product line modeling with confidentiality — MBSE extension (Wiley SE 29(4), 2026)

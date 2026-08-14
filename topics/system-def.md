---
topic_key: system-def
level: 4
last_curated: 2026-08-15
maturity: established
---

# System Definition

System Definition covers the activities that turn stakeholder needs into an architecture you can build: requirements analysis, logical and physical architecture, interface definition, and integration planning. In SEBoK Part 4 it sits between Concept Definition and Realization, and it's where most program risk actually lives.

This article covers the basics, the patterns that work across industries, the active research frontiers, and best practices that have held up under five years of real MBSE rollouts. Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

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

The Magic Grid framework is the most-cited way of organizing this work in 2025 [system-def-mbse-patterns-2025], and it has been adapted to SysML v2 as the language matured [conf-is2025-sysmlv2-magicgrid].

## Patterns that work

Across automotive, defense, and rail MBSE programs, five patterns recurred in published case studies from 2020–2026 [system-def-mbse-patterns-2025]:

1. **Layered architecture** — requirements → logical → physical. The most consistent pattern in industrial MBSE. A model with three distinguishable layers shows up in virtually every published case study.
2. **Scenario-driven verification** — define verification procedures from operational scenarios (use cases, vignettes, mission threads), not from requirements text.
3. **Traceability as a first-class artifact** — every requirement links to a design element, a test, and a stakeholder need. Tools that don't support this fail in practice.
4. **Reuse of architecture patterns** — a reference architecture for the domain (e.g. ISO 26262 for automotive, FACE for avionics) shortens design time and improves review quality.
5. **Early integration of safety and security** — wait until the logical architecture is stable, then co-design safety and security with the functional architecture. Doing it later is more expensive [eng-domains-safety-security-co-design].

The INCOSE Systems Engineering Handbook v5 covers all of these in detail, and is the most-cited reference for industrial practice [lifecycle-iso-iec-15288-2023].

## Best practices

- **Commit to a modelling vocabulary early.** The most common reason MBSE initiatives fail is that teams don't converge on shared naming and structure [system-def-mbse-patterns-2025].
- **Make the architecture the source of truth, not the requirements document.** The architecture is what gets reviewed, integrated, and verified against.
- **Use the same scenarios for design and test.** A scenario that drives the architecture should drive the verification plan — that's what makes traceability real.
- **Don't over-model.** A logical architecture that's too detailed becomes a maintenance burden. Stop at the level where the next decomposition is obvious.
- **Review at the system level, not the component level.** Component reviews miss the integration risk that lives between components.

## Research frontiers

Several active threads at the 2024–2025 INCOSE Symposium focused on LLM-augmented system definition:

- **LLMs as natural-language to SysML translators.** Early results show promise for routine models, but reliability is still too low for safety-critical domains [conf-is2025-jaxa-llm-mbse].
- **LLM-augmented model querying.** Converting SysML models to graph databases and using LLMs to translate natural-language questions into queries. This addresses the long-standing MBSE pain point of making models queryable to non-modellers [conf-is2025-jaxa-llm-mbse].
- **Multi-level FMEA driven by the architecture.** Automated FMEA at the system, subsystem, and component levels, generated from the same architecture model [conf-is2025-fmea-multilevel].
- **MBSE for Model-Based Design Engineering (MBDE) in robotics.** The patterns work for mechatronic systems but need adaptation for real-time control loops [conf-is2025-pavalkis-mbde-robotic-arm].

The 2024 Symposium also surfaced concrete patterns worth noting:

- **Secure design as a first-class activity in system definition**, not an add-on at the end [conf-is2024-p054-secure-design-a-practical-approach-for-systems-eng]. Practical framework for integrating security into MBSE from day one.
- **Mean dependency length as a requirements-quality metric.** A new quantitative measure for requirements structure, validated across 10 MBSE course offerings and 601 student models [conf-is2024-p568-automating-rule-checking-to-identify-sysml-modelin].
- **ARCADIA / Capella in maritime system definition.** Real case study of the ARCADIA method for wind-assisted bulk carrier vessel design — concrete example of MBSE in non-traditional defense domains [conf-is2024-p260-application-of-the-arcadia-method-on-a-bulk-carrie].
- **V-Model modernization for digital engineering.** The "Arch Model" refreshes the classical V-Model for integrated digital engineering, addressing the misperceptions that have reduced the V-Model's efficacy in practice [conf-is2024-p370-a-classical-modernization-of-the-v-model].

## What's new in 2024-2025

The 2024-2025 INCOSE Symposia surfaced a transformative shift: **LLM-augmented MBSE has moved from speculation to working practice**. Three concrete patterns emerged:

- **AI systems modeling enhancer (AI-SME).** Initial investigations into a ChatGPT-enabled MBSE modeling assistant integrated with CATIA Magic — comparing AI-generated models against human systems engineers. The takeaway: LLMs are useful for routine modeling tasks but reliability is still too low for safety-critical domains without human review [conf-is2024-p562-ai-systems-modeling-enhancer-ai-sme-initial-invest].
- **LLM as SysML v2 query interface.** Converting SysML models to a Neo4j graph database, then using an LLM to translate natural-language questions into Cypher queries — making models queryable to non-modellers. Addresses the long-standing MBSE pain point that the model is "write-only" [conf-is2025-jaxa-llm-mbse].
- **LLM-driven requirements traceability.** Using LLMs to automatically establish traceability between requirements and MBSE artifacts — critical for safety standards compliance where manual traceability is the most expensive part of the lifecycle [conf-is2024-p098-llm-based-approach-to-automatically-establish-trac].

Beyond LLMs, three other 2024-2025 themes stood out:

- **SysML v2 as the new baseline.** Multiple papers (Dassault, Siemens, INCOSE working groups) reported on real-world SysML v2 adoption. The 2025 Symposium had an entire SysML v2 track — the language is no longer "coming soon", it is the new default for new projects [conf-is2025-sysmlv2-magicgrid].
- **Model federation across security boundaries.** Federated PLM/MBSE for multinational programs where models span classification levels (e.g., defense + allied nations) and need to be reasoned about without merging into a single classified model [conf-is2024-p099-enabling-digital-engineering-with-federated-plm-ex].
- **Verification-first modeling.** Multiple papers argued that the architecture should be the source of truth for verification, not a separate document. The "ConOps-driven verification" pattern from 2024 papers built on this — operational scenarios drive both architecture decisions and verification procedures, closing the loop that classic V-Model processes leave open [conf-is2024-p266-early-validation-using-architectural-overviews-a3a].

What's likely to be on the 2026+ research agenda based on this: trustworthy AI for safety-critical MBSE (formal verification of LLM-generated models), SysML v2 migration tooling, and digital thread + digital twin as the next MBSE plateau (the model isn't just a design artifact — it becomes the operational runtime).

## What to read first

If you only read three things on System Definition, read:

1. The MBSE patterns synthesis — five years of cross-industry case studies distilled [system-def-mbse-patterns-2025]
2. The Magic Grid framework, adapted for SysML v2 [conf-is2025-sysmlv2-magicgrid]
3. The INCOSE SE Handbook v5, ch. 4 — technical processes for architecture and verification [lifecycle-iso-iec-15288-2023]

## References

1. MBSE patterns — what 5 years of industry adoption tells us (2025)
2. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)
3. SysML v2 + Magic Grid at IS 2025 (2025)
4. LLM-augmented MBSE — JAXA team's graph-database approach (IS 2025)
5. Multi-level FMEA driven by architecture (IS 2025)
6. MBDE for mechatronic/robotic systems (IS 2025)
7. Safety and security co-design in system definition

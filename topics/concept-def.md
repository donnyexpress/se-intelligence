---
topic_key: concept-def
level: 3
last_curated: 2026-08-05
maturity: established
---

# Concept Definition

Concept definition is the activity of taking a fuzzy need ("we need to be able to communicate on the move") and turning it into a concrete set of stakeholder requirements, a concept of operations, and a business case. It's the part of the life cycle where the system as a system first takes shape, before any architecture is drawn. This article covers the basics, the patterns that work, the research frontiers, and the best practices that have held up across decades.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

Most programs that fail do so because the concept was wrong, not because the realization was bad. A wrong concept means you're building the wrong thing, brilliantly. Concept definition is where you prevent that — and where you make the early decisions that cascade into everything else [lifecycle-iso-iec-15288-2023].

## Basics

Concept definition sits between the stakeholder need and the system architecture. Its outputs are:

- **Stakeholder requirements**: the verifiable requirements that the system as a whole must satisfy. Distinct from the needs (which are not yet verifiable) and from the system requirements (which describe the system, not what the user needs).
- **Concept of operations (ConOps)**: the narrative of how the system will be used. The ConOps is the bridge between the abstract requirements and the architecture.
- **Business case**: the analysis of cost, benefit, and risk that justifies the program. The business case is updated as the program learns; it is not a one-time artifact.

The INCOSE SE Handbook v5 and ISO/IEC/IEEE 15288:2023 define these as the outputs of the Concept stage [lifecycle-iso-iec-15288-2023]. The SEBoK Part 3 articles cover the activities in detail.

The hardest part of concept definition is *stakeholder analysis*. The set of stakeholders is rarely what the program team thinks it is. Stakeholders include the people who will use the system, the people who will maintain it, the people who will be affected by it but don't interact with it, the regulators, the buyers, and the people who will be displaced by it. Missing a stakeholder class is the most common source of late-stage program surprises.

## Patterns that work

Five patterns recur in concept definition practice:

1. **Use-case-driven requirements.** The use cases drive the requirements, not the other way around. The use cases describe the system's behavior in operational scenarios.
2. **ConOps as a primary artifact.** The ConOps is a deliverable, not a paragraph in the requirements doc. The ConOps drives the architecture decisions, not the other way around.
3. **Stakeholder workshops with explicit coverage.** The stakeholders are identified explicitly, with a check that all classes are represented. Hidden stakeholders are the most common source of late-stage program surprises.
4. **Mission analysis for capability-driven work.** For defense and aerospace, mission analysis is the formal activity that translates strategic needs into capability requirements [mission-engineering-uaf-gagliardi-2024].
5. **R&D frameworks for early-stage work.** For programs that start in R&D (where the goal is to discover what to build), the SE-ESR&D framework from INCOSE LA gives a stage-appropriate approach [se-esrd-framework-hodges-2024].

## Best practices

- **Distinguish needs from requirements.** A need is a problem; a requirement is a verifiable specification of a solution property. The translation from need to requirement is where most of the work happens.
- **Write the ConOps as a narrative, not a list.** The ConOps is the story of how the system will be used. Lists of requirements don't convey the operational context; narratives do.
- **Make the business case honest.** The business case is the program's defense against the sunk-cost fallacy. A dishonest business case leads to programs that should be killed but aren't.
- **Update the business case as you learn.** The original business case is a hypothesis. The program's value comes from updating it as you learn what works.
- **Mission Engineering for defense/aerospace.** If you're in defense or aerospace and the buyer cares about capability, use a Mission Engineering framework [mission-engineering-uaf-gagliardi-2024] — it gives you the vocabulary to talk about the capability, not the platform.

## Research frontiers

Active threads in 2024–2025:

- **Mission Engineering with UAF.** A worked example of UAF in practice, with the cross-viewpoint consistency pattern that generalizes beyond defense [mission-engineering-uaf-gagliardi-2024].
- **R&D frameworks for early-stage programs.** The SE-ESR&D framework for programs that don't yet know what they're building [se-esrd-framework-hodges-2024].
- **LLM-augmented stakeholder analysis.** Using LLMs to surface hidden stakeholders, with the standard caveat about reliability [conf-is2025-jaxa-llm-mbse].
- **Digital Engineering for concept work.** Model-based approaches that start the model at the concept stage, not at the architecture stage [conf-is2025-shoal-rd-framework].

## What to read first

If you only read three things on concept definition, read:

1. INCOSE SE Handbook v5, ch. 3 — concept-stage activities and outputs [lifecycle-iso-iec-15288-2023]
2. Implementing Mission Engineering with UAF — the discipline for capability-driven work [mission-engineering-uaf-gagliardi-2024]
3. The SE-ESR&D framework — what concept definition looks like in R&D [se-esrd-framework-hodges-2024]

## References

1. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)
2. Implementing Mission Engineering with UAF — IS 2024 paper
3. A Framework for SE in Early-Stage R&D — INCOSE LA, 2024
4. JAXA — LLM-augmented MBSE / stakeholder analysis (IS 2025)
5. Shoal et al. — A Framework for Structuring Research Campaigns with MBSE (IS 2025)

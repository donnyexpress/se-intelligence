---
topic_key: realization
level: 5
last_curated: 2026-08-15
maturity: established
---

# System Realization

System realization is the part of the life cycle where the system gets built. The architecture is realized as components, the components are integrated, and the integrated system is verified and validated. This is the most expensive stage of the life cycle, and the one where most of the engineering hours go. This article covers the basics, the patterns that work, the research frontiers, and the best practices that have held up across decades.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

Realization is where the architecture becomes real. Most realization failures are upstream failures — bad requirements, bad architecture, bad integration plan — that surface as integration problems. But the realization stage has its own disciplines: integration strategy, verification approach, transition planning, and the management of build-versus-buy decisions. These are not upstream problems; they are realization problems [lifecycle-iso-iec-15288-2023].

## Basics

Realization covers the activities from "we have an architecture" to "we have a system that meets its requirements." The dominant frame is the V-model: each design activity has a corresponding verification activity. The INCOSE SE Handbook v5 treats realization as covering Implementation, Integration, Verification, Validation, and Transition [lifecycle-iso-iec-15288-2023].

The key sub-activities are:

- **Implementation**: building the components according to the design. Includes manufacturing, coding, fabrication.
- **Integration**: combining the components into a working system. Integration is *the* system-level activity; it's where emergent properties first appear.
- **Verification**: confirming that the system meets its specified requirements. The V-model's right side.
- **Validation**: confirming that the system meets the user's operational needs. The V-model's highest level.
- **Transition**: moving the system from the build environment to the operational environment. Often the riskiest part of realization.

The V-model is one possible frame; the underlying activities are the same in any realization approach.

## Patterns that work

Five patterns recur in realization practice:

1. **Top-down integration.** Integrate from the system level downward, verifying the integration at each level before proceeding. The classic V-model approach.
2. **Risk-driven integration.** Identify the highest-risk components and integrate them first, even if it means a less complete system. Reduces the chance of late-stage integration surprises.
3. **Continuous integration for software.** For software-heavy systems, integrate and test continuously, not at the end. The cost of finding a defect increases with time from introduction; CI minimizes that cost.
4. **Verification environment that matches the operational environment.** The verification should be done in an environment as close to the operational environment as possible. Mismatch is the source of "passed all tests, failed in production" stories.
5. **Independent verification.** Have a separate team verify the system. Independence reduces the chance that the verification team has the same blind spots as the build team.

The V&V patterns in the INCOSE SE Handbook v5 and the SEBoK Part 5 articles cover these in detail.

## Best practices

- **Plan integration from the architecture, not after.** The integration strategy should be a deliverable of the architecture stage, not an afterthought of the realization stage. The architecture defines what can be integrated independently; the realization stage executes the plan.
- **Match the verification environment to the operational environment.** This is the most common lesson of DieselGate [dieselgate-smoke-and-mirrors-aftel-2025] and similar failures.
- **Have a transition plan from day one.** Transition is often the riskiest realization activity. The plan should be in place before the system is built, not after.
- **Verify what the user cares about, not just what was specified.** Validation (operational needs) is not the same as verification (specified requirements). Both matter.
- **Use the architecture as the integration plan.** The components in the architecture are the components to integrate. The interfaces in the architecture are the integration contracts. Don't invent a different integration plan.

## Research frontiers

Active threads in 2024–2025:

- **MBSE for realization.** Model-based approaches to integration planning, with the architecture as the source of truth [system-def-mbse-patterns-2025].
- **Multi-level FMEA from the architecture.** Automated FMEA at the system, subsystem, and component levels, generated from the same SysML model [conf-is2025-fmea-multilevel].
- **Model-Based Design Engineering (MBDE) for mechatronic systems.** The MBSE patterns work for mechatronic systems but need adaptation for real-time control loops [conf-is2025-pavalkis-mbde-robotic-arm].
- **Design reviews with MBSE support.** Modern design review tools that pull from the model rather than from documents [conf-is2025-dassault-mb-design-reviews].
- **Verification as a defense against defeat devices.** The DieselGate case study is the canonical example of verification design that matches the operational environment [dieselgate-smoke-and-mirrors-aftel-2025].

The 2024 Symposium surfaced several realization-focused patterns worth adding:

- **Real-to-real analogy: software development from film production.** Borrowed practices from film production (time-boxed iterations, scene blocking, asset reuse) mapped to SE realization work [conf-is2024-p276-real-to-real-deriving-software-development-practic]. Useful for teams that have to deliver under hard time and budget pressure.
- **Traceability across the realization lifecycle.** A vision paper from Airbus on how traceability needs to evolve to support model-based and digital engineering [conf-is2024-p148-traceability-a-vision-for-now-and-tomorrow].
- **COSYSMO + MBSE convergence.** A practical paper on converging parametric cost estimation with model-based systems engineering so the cost model is derived from the system model, not maintained separately [conf-is2024-p180-the-convergence-of-cosysmo-parametric-cost-estimat].

## What's new in 2024-2025

The 2024-2025 Symposia showed realization practices continuing to converge with two long-running trends:

- **Agile + SE integration getting real.** A 2024 analysis of SAFe (Scaled Agile Framework) through Stafford Beer's Viable System Model [conf-is2024-p463-synergizing-structure-and-agility-a-comprehensive-] is a notable attempt to ground SAFe in classical systems theory — the gap between "agile teams" and "the system" has been a recurring pain. The INCOSE-PMI Alliance continued to develop cross-references between program management and SE practices, suggesting that the integration of project management frameworks with SE is a stable trend [conf-is2024-pres069-the-latest-on-the-incose-pmi-alliance-and-integrat].
- **Reliability and maintainability as enterprise decisions.** A 2025 paper reframes R&M as an enterprise architecting problem — fleet maintenance isn't a single-system question but a system-of-systems decision across the enterprise [conf-is2025-p098-enterprise-architecting-to-advance-reliability-and]. This is a significant broadening of what "realization" covers: it now includes sustainment and lifecycle economics, not just initial build.
- **Generative AI as a cost/schedule multiplier.** A 2025 paper proposed a maturity and cost model for SE with GenAI — explicitly modeling how AI tools reduce effort in routine tasks and where they don't help (still requires human-in-the-loop for safety-critical decisions) [conf-is2025-pres148-a-maturity-and-cost-model-for-systems-engineering-]. The realistic framing here is important: AI augments, doesn't replace.

What's likely on the 2026+ agenda: the realization phase is starting to be the *operational* phase, not just the *build* phase. The digital twin + digital thread papers from 2024-2025 suggest the system model becomes a live runtime artifact during sustainment, blurring the realization/operational boundary. Expect more "realization as operations" papers.

## What to read first

If you only read three things on system realization, read:

1. The MBSE patterns synthesis — what works in industrial realization at scale [system-def-mbse-patterns-2025]
2. Multi-level FMEA from the architecture — modern verification discipline [conf-is2025-fmea-multilevel]
3. The DieselGate case study — what happens when verification doesn't match operations [dieselgate-smoke-and-mirrors-aftel-2025]

## References

1. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)
2. MBSE patterns — what 5 years of industry adoption tells us (2025)
3. Multi-level FMEA driven by architecture (IS 2025)
4. Pavalkis et al. — Accelerating DE Adoption with MBSE and Digital Twin (IS 2025)
5. Dassault — A Transformative Process for Model-Based Design Reviews (IS 2025)
6. DieselGate — Smoke and Mirrors, INCOSE San Diego, 2025

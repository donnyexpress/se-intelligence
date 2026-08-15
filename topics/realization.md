---
topic_key: realization
level: 5
last_curated: 2026-08-15
maturity: established
---

# System Realization

System realization is the part of the life cycle where the system gets built. The architecture is realized as components, the components are integrated, and the integrated system is verified and validated. This is the most expensive stage of the life cycle, and the one where most of the engineering hours go. This article covers the basics, the patterns that work, and the best practices that have held up across decades. The 2024-2026 evidence base includes 70+ INCOSE conference papers and 1 peer-reviewed journal article (Wiley SE 29(4)).

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

Six patterns recur in realization practice:

1. **Top-down integration.** Integrate from the system level downward, verifying the integration at each level before proceeding. The classic V-model approach.
2. **Risk-driven integration.** Identify the highest-risk components and integrate them first, even if it means a less complete system. Reduces the chance of late-stage integration surprises.
3. **Continuous integration for software.** For software-heavy systems, integrate and test continuously, not at the end. The cost of finding a defect increases with time from introduction; CI minimizes that cost.
4. **Verification environment that matches the operational environment.** The verification should be done in an environment as close to the operational environment as possible. Mismatch is the source of "passed all tests, failed in production" stories [dieselgate-smoke-and-mirrors-aftel-2025].
5. **Independent verification.** Have a separate team verify the system. Independence reduces the chance that the verification team has the same blind spots as the build team.
6. **Set-based verification planning.** Plan the verification strategy as a *set* of possible verification activities, with calibration of uncertainties along the way, rather than a single fixed plan at program start. The 2026 peer-reviewed update (Xu & Salado [journal-wiley-se-29-4-xu-salado-set-based-verification-planning]) formalizes this: uncertainties are calibrated as the program progresses, and additional verification activities can be introduced mid-program. The pattern: verification is a *dynamic* plan, not a static one.

The V&V patterns in the INCOSE SE Handbook v5 and the SEBoK Part 5 articles cover these in detail.

## Best practices

- **Plan integration from the architecture, not after.** The integration strategy should be a deliverable of the architecture stage, not an afterthought of the realization stage. The architecture defines what can be integrated independently; the realization stage executes the plan.
- **Match the verification environment to the operational environment.** This is the most common lesson of DieselGate [dieselgate-smoke-and-mirrors-aftel-2025] and similar failures.
- **Have a transition plan from day one.** Transition is often the riskiest realization activity. The plan should be in place before the system is built, not after.
- **Verify what the user cares about, not just what was specified.** Validation (operational needs) is not the same as verification (specified requirements). Both matter.
- **Use the architecture as the integration plan.** The components in the architecture are the components to integrate. The interfaces in the architecture are the integration contracts. Don't invent a different integration plan.
- **Plan the verification as a set, not a fixed sequence.** Uncertainties will be resolved as the program progresses — build a verification strategy that adapts [journal-wiley-se-29-4-xu-salado-set-based-verification-planning].
- **Realization is starting to include sustainment.** R&M reframed as enterprise architecting [conf-is2025-p098-enterprise-architecting-to-advance-reliability-and] — fleet maintenance is a system-of-systems decision across the enterprise, not a single-system question. The realization phase is broadening to include lifecycle economics.
- **Agile + SE can be integrated via classical systems theory.** The SAFe-via-Viable-System-Model pattern [conf-is2024-p463-synergizing-structure-and-agility-a-comprehensive-] grounds agile scaling in Beer's VSM — the gap between "agile teams" and "the system" is a structure problem, not a process problem.

## Research frontiers

Three 2024-2026 threads are now in practice, not just research:

- **Set-based verification is the 2026 formalization.** Xu & Salado [journal-wiley-se-29-4-xu-salado-set-based-verification-planning] formalizes dynamic verification planning under knowable uncertainty. The pattern: instead of fixing the verification plan at program start, treat it as a *set* of candidate activities, and introduce additional verifications as uncertainties are resolved mid-program. Addresses the most common realization failure.
- **Agile + SE integration is getting real.** SAFe grounded in Stafford Beer's Viable System Model [conf-is2024-p463-synergizing-structure-and-agility-a-comprehensive-]. INCOSE-PMI Alliance cross-references [conf-is2024-pres069-the-latest-on-the-incose-pmi-alliance-and-integrat]. Stable trend.
- **Generative AI as a cost/schedule multiplier.** A 2025 paper proposed a maturity and cost model for SE with GenAI [conf-is2025-pres148-a-maturity-and-cost-model-for-systems-engineering-] — explicitly modeling where AI helps and where it doesn't (still human-in-the-loop for safety-critical decisions). Realistic framing: AI augments, doesn't replace.

Other 2024-2025 work worth a skim: MBDE for mechatronic [conf-is2025-pavalkis-mbde-robotic-arm], design reviews with MBSE [conf-is2025-dassault-mb-design-reviews], R&M as enterprise decisions [conf-is2025-p098-enterprise-architecting-to-advance-reliability-and], real-to-real analogy with film production [conf-is2024-p276-real-to-real-deriving-software-development-practic], Airbus traceability vision [conf-is2024-p148-traceability-a-vision-for-now-and-tomorrow], COSYSMO + MBSE convergence [conf-is2024-p180-the-convergence-of-cosysmo-parametric-cost-estimat].

The 2024-2026 period is best understood as "realization is starting to be the *operational* phase, not just the *build* phase". The digital twin + digital thread work [journal-wiley-se-29-4-wooley-digital-twins-umbrella-review] suggests the system model becomes a live runtime artifact during sustainment.

## What to read first

If you only read three things on system realization, read:

1. The MBSE patterns synthesis — what works in industrial realization at scale [system-def-mbse-patterns-2025]
2. Set-based verification planning — the 2026 formalization of dynamic verification [journal-wiley-se-29-4-xu-salado-set-based-verification-planning]
3. The DieselGate case study — what happens when verification doesn't match operations [dieselgate-smoke-and-mirrors-aftel-2025]

## References

1. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)
2. MBSE patterns — what 5 years of industry adoption tells us (2025)
3. Multi-level FMEA driven by architecture (IS 2025)
4. Pavalkis et al. — Accelerating DE Adoption with MBSE and Digital Twin (IS 2025)
5. Dassault — A Transformative Process for Model-Based Design Reviews (IS 2025)
6. DieselGate — Smoke and Mirrors, INCOSE San Diego, 2025
7. SAFe via Viable System Model — IS 2024
8. R&M as enterprise architecting — IS 2025
9. GenAI maturity and cost model — IS 2025
10. Verification complexity framework — IS 2025
11. INCOSE-PMI Alliance — IS 2024
12. Real-to-real: software from film — IS 2024
13. Traceability vision for DE — Airbus, IS 2024
14. COSYSMO + MBSE convergence — IS 2024
15. Set-based verification planning under knowable uncertainty (Wiley SE 29(4), 2026)

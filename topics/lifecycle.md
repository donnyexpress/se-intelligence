---
topic_key: lifecycle
level: 2
last_curated: 2026-08-05
maturity: established
---

# Life Cycle Models

Life cycle models are the temporal scaffolding of systems engineering. They define what activities happen when, who does them, and what the gates between activities are. The choice of life cycle model — waterfall, spiral, agile, V-model, hybrid — shapes every downstream process decision. This article covers the basics, the patterns that work, the research frontiers, and the best practices that have held up across decades.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

The life cycle is the most consequential early decision in a program. Pick a model that mismatches the program's risk profile, regulatory environment, or team capability and you spend the rest of the program fighting the framework instead of the problem. Get the life cycle right and the rest of the work has a chance to flow [lifecycle-iso-iec-15288-2023].

## Basics

A life cycle model defines stages. Each stage has entry criteria, activities, and exit criteria. The dominant formal model is ISO/IEC/IEEE 15288, which defines six stages: Concept, Development, Production, Utilization, Support, Retirement [lifecycle-iso-iec-15288-2023]. The INCOSE SE Handbook v5 aligns to this same six-stage model.

The classic contrasting models are:

- **Waterfall**: stages happen in sequence, no backtracking. Simple, easy to manage, terrible at handling change.
- **V-model**: each development stage has a corresponding verification stage. Strong verification discipline, weaker for fast iteration.
- **Spiral**: stages are repeated, with risk analysis at each loop. Good for high-uncertainty work, expensive to manage.
- **Agile**: short iterations with continuous integration. Fast feedback, weak on long-lead planning.
- **Hybrid**: parts of the program use one model, parts use another. The most common in practice.

The reality of modern systems engineering is that no single model is right for all programs. The right model is the one that matches the program's risk, regulatory, and team profile.

## Patterns that work

Five patterns recur in life cycle practice:

1. **Stage gates with explicit criteria.** Each stage has documented entry and exit criteria. The criteria are reviewed by stakeholders with authority to stop the program. The criteria evolve with the program but are always explicit.
2. **Iterative development within stages.** Within a stage, develop in iterations. Each iteration is shippable (in some sense) and feeds back into the stage's design.
3. **Risk-driven spiral for high-uncertainty work.** When the biggest risk is technical, the spiral model lets you reduce risk by building throwaway prototypes.
4. **V-model for safety-critical.** When the cost of failure is high, the V-model's verification discipline is worth its overhead.
5. **Hybrid for cross-domain programs.** Programs that span hardware, software, and operations usually need a hybrid: hardware follows V, software follows agile, integration follows a stage-gate.

The SEBoK Part 2 articles cover these patterns in detail, with worked examples.

## Best practices

- **Pick the model deliberately.** The default in many programs is "what we did last time" or "what the contract template says." Both are reasons, but neither is a *good* reason. The model should be justified by the program's risk, regulatory, and team profile.
- **Document the model and the reasons for it.** When the program runs into trouble, the first question is "did we pick the right model?" The answer should be in a document.
- **Let the model evolve.** A 5-year program will have different risk profiles at year 0 and year 4. The model should be allowed to adapt, with explicit re-justification.
- **The model is not the work.** A beautiful life cycle diagram is not a substitute for actually doing the activities. Don't confuse the model with the substance.
- **Pay attention to the handoffs.** Most life cycle problems are handoff problems — between stages, between teams, between disciplines. The model should make handoffs explicit, not hidden.

## Research frontiers

Active threads in 2024–2025:

- **Agile at scale for hardware-heavy systems.** Scaled agile frameworks (SAFe, LeSS) are being adapted for hardware-heavy systems where the classic agile assumption of "small, independent iterations" doesn't hold [conf-is2023-agile-se-at-scale].
- **SE for R&D portfolios.** A new framework for applying systems engineering to R&D portfolios, not just programs — where the goal is discovering what to build [se-esrd-framework-hodges-2024].
- **Life cycle model for AI-enabled systems.** Traditional life cycle models assume the system is fully specifiable at design time. AI-enabled systems (with model retraining, prompt updates) have a continuous-update life cycle that doesn't fit the six-stage model. Active INCOSE work [se-maturity-genai-madachy-2025].
- **Continuous verification in agile.** The V-model's verification discipline is being adapted for continuous-delivery contexts [conf-is2025-fmea-multilevel].

## What to read first

If you only read three things on life cycle models, read:

1. ISO/IEC/IEEE 15288:2023 — the international standard for life cycle processes [lifecycle-iso-iec-15288-2023]
2. INCOSE SE Handbook v5, ch. 3 — life cycle stages and processes
3. The SE-ESR&D framework — what life cycle looks like in R&D, not programs [se-esrd-framework-hodges-2024]

## References

1. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)
2. Agile SE at Scale — IS 2023 (Honolulu)
3. A Framework for SE in Early-Stage R&D — INCOSE LA, 2024
4. SE Maturity and Cost Modeling Framework for GenAI — INCOSE San Diego, 2025
5. Multi-level FMEA driven by architecture (IS 2025)

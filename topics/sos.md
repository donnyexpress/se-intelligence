---
topic_key: sos
level: 9
last_curated: 2026-08-15
maturity: maturing
---

# Systems of Systems

Systems of systems (SoS) is the discipline of engineering when the system crosses organizational boundaries, when no single party controls all the parts, and when the parts are themselves complex systems. SoS is where the classical systems engineering assumptions — single owner, single budget, single architecture — break down. This article covers the basics, the patterns that work, the research frontiers, and the best practices that are still being discovered.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

Most of the systems that matter to society are not single systems. The electric grid is an SoS. The air traffic control system is an SoS. Defense and intelligence systems are SoS. Healthcare delivery is an SoS. The system engineering practices that work for a single system often do not work for SoS — different ownership, different incentives, different timescales. SoS is the discipline that addresses these [sos-sos-architecting-patterns].

## Basics

A system of systems is a collection of systems that work together to deliver capabilities that none of the constituent systems can deliver alone. The constituent systems are operationally and managerially independent. The SoS has emergent properties that come from the interactions, not from any single constituent.

The dominant classification is by the level of managerial independence of the constituents:

- **Directed SoS**: the constituents are managed to deliver SoS-level capabilities. The constituents are subordinate to the SoS.
- **Acknowledged SoS**: the constituents have their own purposes, but they collaborate to deliver SoS-level capabilities. The collaboration is recognized but not mandated.
- **Collaborative SoS**: the constituents have their own purposes and collaborate voluntarily. The SoS emerges from the collaboration.
- **Virtual SoS**: the constituents are unaware of the SoS. The SoS is an observer's category, not a participant's.

The most common case in practice is acknowledged or collaborative. Defense and intelligence are typically directed; commercial SoS are usually collaborative or virtual.

The hardest part of SoS engineering is *governance*. Without a single owner, who decides? The discipline has evolved a set of patterns: governance boards, shared standards, federation agreements, and incentive design.

## Patterns that work

Five patterns recur in SoS practice:

1. **Capability-driven design.** SoS work starts from the capability, not the constituent system. The capability is decomposed into services, the services are mapped to constituent systems, and the integration points are defined [mission-engineering-uaf-gagliardi-2024].
2. **Federation for governance.** Constituent systems retain their independence but agree to a federation that defines the shared interfaces, the shared data, and the shared governance. Federation works when the constituents have aligned interests.
3. **Incentive design.** Without single ownership, the constituents must be incentivized to participate. The incentives are usually a mix of mission alignment, financial return, and risk sharing.
4. **Cross-organizational SE.** SE work in an SoS requires representatives from each constituent system, with authority to commit the constituent's resources. The cross-organizational SE team is the integration mechanism.
5. **Standards as the lingua franca.** When the constituents have different internal practices, the integration is via shared standards. UAF is one such standard for mission engineering [mission-engineering-uaf-gagliardi-2024].

The INCOSE SoS Working Group has been publishing these patterns since 2015 [sos-sos-architecting-patterns].

## Best practices

- **Start with the capability, not the constituent.** The capability is what the SoS exists to deliver. The constituent is an implementation choice.
- **Governance first.** Without governance, the SoS will fragment. Establish the governance before the integration.
- **Incentives are part of the architecture.** If the incentives don't support the SoS, the constituents will optimize for their own purposes, and the SoS will fail.
- **Standards are not optional.** In an SoS, the standards are the only common ground. Without standards, the integration is ad hoc and fragile.
- **Plan for evolution.** SoS is a long-term commitment. The constituents will change, the capabilities will change, the standards will change. The SoS must be designed to evolve.

## Research frontiers

Active threads in 2024–2025:

- **Mission Engineering with UAF.** A worked example of UAF in practice, with the cross-viewpoint consistency pattern that generalizes beyond defense [mission-engineering-uaf-gagliardi-2024].
- **SoS architecting patterns.** The INCOSE SoS working group has been publishing patterns; the most recent work emphasizes the capability-driven approach [sos-sos-architecting-patterns].
- **Resilient systems of systems.** INCOSE IW 2024 dedicated a track to resilient SoS, with patterns for recovery in cross-organizational systems [conf-iw2024-resilient-systems].
- **SoS for R&D.** The SE-ESR&D framework for managing R&D as an SoS, where the constituents are research projects with their own purposes [se-esrd-framework-hodges-2024].
- **RWE and SoS governance.** Patterns for SoS governance that do not require a single owner.

The 2024 Symposium added several useful SoS case studies:

- **SoS for public services: healthcare as a collaborative SoS.** A paper framing the US healthcare delivery system as a collaborative SoS with a proposed hybrid governance model — concrete example of SoS thinking applied outside defense [conf-is2024-p490-a-new-horizon-for-healthcare-delivery-a-system-of-].
- **Wind power in Norway as a SoS.** Uses stakeholder salience analysis and causal loop diagrams to understand public acceptance of wind power — a real-world application of systems thinking to socio-technical SoS [conf-is2024-p020-a-systems-perspective-on-the-public-perception-of-].
- **Risk assessment for SoS operations.** A risk assessment method specifically for SoS operations, where no single entity owns the system [conf-is2024-p403-risk-assessment-method-for-systems-of-systems-oper].

## What's new in 2024-2025

The 2024-2025 Symposia pushed SoS thinking in two new directions:

- **SoS for sustainability transitions.** Several papers applied SoS framing to climate and energy transitions, treating national sustainability efforts as SoS problems where no single entity can drive the transition. The Norway wind-power SoS case study [conf-is2024-p020-a-systems-perspective-on-the-public-perception-of-] is a concrete example — the grid, the regulators, the communities, the developers, and the energy users are all independent systems that need to coordinate without a single owner. Similar work on urban air mobility SoS [conf-is2024-p107-evaluating-the-eco-efficiency-of-urban-air-mobilit] and offshore wind-to-hydrogen SoS [conf-is2024-pres202-seeing-the-bigger-picture-with-the-unified-archite] extends this into the energy transition.
- **Healthcare SoS as a multi-layer governance problem.** A 2025 paper proposed a multi-layer governance framework for healthcare SoS, building on the 2024 healthcare-as-SoS work. The progression: from "this is an SoS" (2024) to "here is how to govern it" (2025) [conf-is2025-p120-enhancing-healthcare-delivery-through-systems-of-s]. The pattern is generalizable — once you frame a domain as an SoS, the next question is always "how do we govern it without ownership?"
- **UN SDGs as an SoS problem.** A systematic review of how systems engineering can address the UN Sustainable Development Goals — treating the 17 SDGs as a coupled SoS where progress on one affects others [conf-is2024-p367-contemporary-systems-engineering-for-the-un-sdgs-a]. This is the most ambitious scaling of SoS thinking so far.

The 2024-2025 period also saw INCOSE's SoS working group consolidate its pattern language. The "SoS architecting patterns" work from earlier years now has a more concrete application: every SoS problem gets the same first three questions (who owns it, who funds it, who can change it), and the answer determines which patterns apply.

## What to read first

If you only read three things on systems of systems, read:

1. The SoS architecting patterns synthesis — what works when no one owns the system [sos-sos-architecting-patterns]
2. Implementing Mission Engineering with UAF — a worked example of directed SoS [mission-engineering-uaf-gagliardi-2024]
3. The INCOSE IW 2024 Resilient Systems track — current state of the discipline [conf-iw2024-resilient-systems]

## What's new in 2026 (Wiley *Systems Engineering* 29(4))

Two notable SoS papers in the July 2026 journal:

- **Capability complexity via Enterprise Architecture.** Bakhshi & Efatmaneshnik (UniSA) propose a structured, quantitative methodology for assessing the holistic complexity of a system-of-systems using the Zachman Architecture Framework [journal-wiley-se-29-4-bakhshi-capability-complexity-eaf]. The pattern: use ZAF's 6×6 view matrix as the structure, weight each cell by its information content, then aggregate to a single complexity score. Notable: this gives SoS architects a defense-style "capability complexity" metric in a form that operational analysts and policymakers can use.
- **AI-driven labor transitions in autonomous systems.** Kaplan, Szajnfarber & Helveston (GWU) frame the rise of robotaxis as an SoS problem — a taxi work system transitioning to a robotaxi system — and identify three archetypal patterns of role change: distributing, consolidating, and scaffolding [journal-wiley-se-29-4-kaplan-robotaxis-labor-transitions]. The takeaway: AI doesn't simply substitute labor; it rebundles tasks and roles. Useful for SE practitioners thinking about the *human* side of automation rollouts.

The 2026 SoS journal signal: SoS is becoming a measurement discipline (complexity metrics, transition patterns) and moving beyond the architectural pattern work of 2024-2025.

## References

1. Systems of Systems architecting patterns — INCOSE SoS WG
2. Implementing Mission Engineering with UAF — IS 2024 paper
3. Resilient Systems of Systems — IW 2024 (Torrance)
4. A Framework for SE in Early-Stage R&D — INCOSE LA, 2024
5. IW 2025 (Seville) — INCOSE Working Group outcomes
6. Capability complexity via Enterprise Architecture (Zachman) — peer-reviewed methodology (Wiley SE 29(4), 2026)
7. AI-driven labor transitions — robotaxis as an SoS transition (Wiley SE 29(4), 2026)

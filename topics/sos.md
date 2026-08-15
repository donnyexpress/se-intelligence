---
topic_key: sos
level: 9
last_curated: 2026-08-15
maturity: maturing
---

# Systems of Systems

Systems of systems (SoS) is the discipline of engineering when the system crosses organizational boundaries, when no single party controls all the parts, and when the parts are themselves complex systems. SoS is where the classical systems engineering assumptions — single owner, single budget, single architecture — break down. This article covers the basics, the patterns that work, and the best practices that are still being discovered. The 2024-2026 evidence base includes 75+ INCOSE conference papers and 2 peer-reviewed journal articles (Wiley SE 29(4)).

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

Six patterns recur in SoS practice:

1. **Capability-driven design.** SoS work starts from the capability, not the constituent system. The capability is decomposed into services, the services are mapped to constituent systems, and the integration points are defined [mission-engineering-uaf-gagliardi-2024]. The 2026 peer-reviewed update: capability complexity can be *quantified* using the Zachman Architecture Framework — use ZAF's 6×6 view matrix as the structure, weight each cell by its information content, then aggregate to a single complexity score [journal-wiley-se-29-4-bakhshi-capability-complexity-eaf]. This gives SoS architects a defense-style "capability complexity" metric in a form that operational analysts and policymakers can use.
2. **Federation for governance.** Constituent systems retain their independence but agree to a federation that defines the shared interfaces, the shared data, and the shared governance. Federation works when the constituents have aligned interests.
3. **Incentive design.** Without single ownership, the constituents must be incentivized to participate. The incentives are usually a mix of mission alignment, financial return, and risk sharing. The 2026 peer-reviewed update: when AI is introduced into the SoS, the incentives *change* — AI doesn't simply substitute labor; it rebundles tasks and roles. Plan for distributing/consolidating/scaffolding patterns [journal-wiley-se-29-4-kaplan-robotaxis-labor-transitions].
4. **Cross-organizational SE.** SE work in an SoS requires representatives from each constituent system, with authority to commit the constituent's resources. The cross-organizational SE team is the integration mechanism.
5. **Standards as the lingua franca.** When the constituents have different internal practices, the integration is via shared standards. UAF is one such standard for mission engineering [mission-engineering-uaf-gagliardi-2024]. UAF is now being applied to whole-enterprise transformation, not just defense missions [conf-is2025-p164-enterprise-transformation-planning-with-uaf].
6. **SoS risk assessment.** A risk assessment method specifically for SoS operations, where no single entity owns the system [conf-is2024-p403-risk-assessment-method-for-systems-of-systems-oper] — addresses the classical risk-management gap when no single party can enumerate the SoS's risks.

The INCOSE SoS Working Group has been publishing these patterns since 2015 [sos-sos-architecting-patterns].

## Best practices

- **Start with the capability, not the constituent.** The capability is what the SoS exists to deliver. The constituent is an implementation choice. Quantify the capability complexity before you commit to a constituent decomposition [journal-wiley-se-29-4-bakhshi-capability-complexity-eaf].
- **Governance first.** Without governance, the SoS will fragment. Establish the governance before the integration.
- **Incentives are part of the architecture.** If the incentives don't support the SoS, the constituents will optimize for their own purposes, and the SoS will fail. When AI is part of the SoS, plan for the rebundling — distributing, consolidating, scaffolding — not just the labor substitution [journal-wiley-se-29-4-kaplan-robotaxis-labor-transitions].
- **Standards are not optional.** In an SoS, the standards are the only common ground. Without standards, the integration is ad hoc and fragile.
- **Plan for evolution.** SoS is a long-term commitment. The constituents will change, the capabilities will change, the standards will change. The SoS must be designed to evolve.
- **Frame domain problems as SoS early.** The 2024-2025 work has framed healthcare delivery [conf-is2024-p490-a-new-horizon-for-healthcare-delivery-a-system-of-, conf-is2025-p120-enhancing-healthcare-delivery-through-systems-of-s], wind-power integration [conf-is2024-p020-a-systems-perspective-on-the-public-perception-of-], urban air mobility [conf-is2024-p107-evaluating-the-eco-efficiency-of-urban-air-mobilit], offshore wind-to-hydrogen [conf-is2024-pres202-seeing-the-bigger-picture-with-the-unified-archite], and the UN SDGs [conf-is2024-p367-contemporary-systems-engineering-for-the-un-sdgs-a] as SoS problems. Once you frame a domain as an SoS, the next question is always "how do we govern it without ownership?" — and that question has the same answer across domains.

## Research frontiers

The 2024-2026 evidence base shows SoS moving from architectural pattern work to measurement and transition:

- **SoS is becoming a measurement discipline.** Bakhshi & Efatmaneshnik [journal-wiley-se-29-4-bakhshi-capability-complexity-eaf] give SoS architects a quantitative complexity metric via Zachman. Combined with the risk assessment method for SoS operations [conf-is2024-p403-risk-assessment-method-for-systems-of-systems-oper] and the SoS-specific operational risk patterns, SoS is now in the same place single-system SE was 20 years ago: a discipline with metrics, not just patterns.
- **SoS for sustainability transitions is now a coherent thread.** Several papers applied SoS framing to climate and energy transitions — treating national sustainability efforts as SoS problems where no single entity can drive the transition. The Norway wind-power SoS case study [conf-is2024-p020-a-systems-perspective-on-the-public-perception-of-] is a concrete example — the grid, the regulators, the communities, the developers, and the energy users are all independent systems that need to coordinate without a single owner. Urban air mobility [conf-is2024-p107-evaluating-the-eco-efficiency-of-urban-air-mobilit] and offshore wind-to-hydrogen [conf-is2024-pres202-seeing-the-bigger-picture-with-the-unified-archite] extend this into the energy transition.
- **Healthcare SoS as a multi-layer governance problem.** A 2025 paper proposed a multi-layer governance framework for healthcare SoS, building on the 2024 healthcare-as-SoS work [conf-is2024-p490-a-new-horizon-for-healthcare-delivery-a-system-of-, conf-is2025-p120-enhancing-healthcare-delivery-through-systems-of-s]. The progression: from "this is an SoS" (2024) to "here is how to govern it" (2025).
- **UN SDGs as an SoS problem.** A systematic review of how systems engineering can address the UN Sustainable Development Goals — treating the 17 SDGs as a coupled SoS where progress on one affects others [conf-is2024-p367-contemporary-systems-engineering-for-the-un-sdgs-a]. The most ambitious scaling of SoS thinking so far.
- **AI-driven labor transitions as SoS transitions.** Kaplan, Szajnfarber & Helveston [journal-wiley-se-29-4-kaplan-robotaxis-labor-transitions] frame the rise of robotaxis as an SoS problem — a taxi work system transitioning to a robotaxi system — and identify three archetypal patterns of role change: distributing, consolidating, and scaffolding. The takeaway: AI doesn't simply substitute labor; it rebundles tasks and roles. Useful for SE practitioners thinking about the human side of automation rollouts.

Other 2024-2025 work:

- **Mission Engineering with UAF.** A worked example of UAF in practice, with the cross-viewpoint consistency pattern that generalizes beyond defense [mission-engineering-uaf-gagliardi-2024].
- **SoS for R&D.** The SE-ESR&D framework for managing R&D as an SoS, where the constituents are research projects with their own purposes [se-esrd-framework-hodges-2024].
- **Resilient systems of systems.** INCOSE IW 2024 dedicated a track to resilient SoS, with patterns for recovery in cross-organizational systems [conf-iw2024-resilient-systems].

## What to read first

If you only read three things on systems of systems, read:

1. The SoS architecting patterns synthesis — what works when no one owns the system [sos-sos-architecting-patterns]
2. Capability complexity via Enterprise Architecture — the first peer-reviewed SoS measurement method [journal-wiley-se-29-4-bakhshi-capability-complexity-eaf]
3. Healthcare SoS as a multi-layer governance problem — concrete example of how to govern an SoS [conf-is2025-p120-enhancing-healthcare-delivery-through-systems-of-s]

## References

1. Systems of Systems architecting patterns — INCOSE SoS WG
2. Implementing Mission Engineering with UAF — IS 2024 paper
3. Resilient Systems of Systems — IW 2024 (Torrance)
4. A Framework for SE in Early-Stage R&D — INCOSE LA, 2024
5. IW 2025 (Seville) — INCOSE Working Group outcomes
6. Enterprise Transformation Planning with UAF (IS 2025)
7. Healthcare as a collaborative SoS — IS 2024 paper
8. Healthcare SoS multi-layer governance — IS 2025 paper
9. Norway wind-power SoS — IS 2024 paper
10. Urban air mobility SoS — IS 2024 paper
11. Offshore wind-to-hydrogen SoS — IS 2024 paper
12. UN SDGs as a coupled SoS — IS 2024 systematic review
13. Risk assessment for SoS operations — IS 2024 paper
14. Capability complexity via Enterprise Architecture (Zachman) — peer-reviewed methodology (Wiley SE 29(4), 2026)
15. AI-driven labor transitions — robotaxis as an SoS transition (Wiley SE 29(4), 2026)

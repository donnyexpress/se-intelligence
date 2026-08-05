---
topic_key: sos
level: 9
last_curated: 2026-08-05
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

## What to read first

If you only read three things on systems of systems, read:

1. The SoS architecting patterns synthesis — what works when no one owns the system [sos-sos-architecting-patterns]
2. Implementing Mission Engineering with UAF — a worked example of directed SoS [mission-engineering-uaf-gagliardi-2024]
3. The INCOSE IW 2024 Resilient Systems track — current state of the discipline [conf-iw2024-resilient-systems]

## References

1. Systems of Systems architecting patterns — INCOSE SoS WG
2. Implementing Mission Engineering with UAF — IS 2024 paper
3. Resilient Systems of Systems — IW 2024 (Torrance)
4. A Framework for SE in Early-Stage R&D — INCOSE LA, 2024
5. IW 2025 (Seville) — INCOSE Working Group outcomes

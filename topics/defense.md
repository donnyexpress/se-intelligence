---
topic_key: defense
level: 3
last_curated: 2026-08-05
maturity: maturing
---

# Defense & Mission Engineering

Defense & Mission Engineering is the discipline of designing for the *capability* the warfighter, operator, or end-user needs, not the individual platform, system, or service. It is the discipline that translates strategic needs into capability requirements, decomposes capabilities into services, and orchestrates the systems that provide those services. This article covers the basics, the patterns that work, the research frontiers, and the best practices that are still being established.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

Defense and aerospace systems are bought for capability, not for platforms. A buyer that needs "persistent surveillance over a region" doesn't care whether the capability is delivered by satellites, drones, manned aircraft, or some combination; they care that the capability exists. Mission Engineering is the discipline that designs for the capability, decomposes it into services, and orchestrates the systems that provide them [mission-engineering-uaf-gagliardi-2024].

## Basics

Mission Engineering treats a mission as a directed graph of activities, each performed by a performer (organization, system, service) operating in a physical and information environment. The dominant open standard is the Unified Architecture Framework (UAF), which gives you viewpoints for stakeholders, capabilities, activities, performers, services, resources, and the relationships between them [mission-engineering-uaf-gagliardi-2024].

The key concepts are:

- **Capability**: a high-level ability the mission requires. Capabilities are emergent properties of the performers and their interactions.
- **Service**: a thing a performer does in support of a capability. Services can be reused across capabilities.
- **Performer**: an organization, system, or service that provides services. Performers are managed independently.
- **Activity**: something that happens in the mission. Activities consume services and produce outcomes.
- **Environment**: the physical and information context in which the mission takes place.

The Mission Engineer's job is to define the mission in these terms and to ensure the performers can deliver the services the mission requires.

## Patterns that work

Five patterns recur in Defense & Mission Engineering practice:

1. **Capability-driven design.** Start from the capability, not the platform. The platform is an implementation choice; the capability is the requirement.
2. **Cross-viewpoint consistency.** The UAF viewpoints (stakeholder, capability, activity, performer, service, resource) must be consistent. A service in the service viewpoint links to the performer that provides it, which links to the organization, which links back to the activities.
3. **Mission analysis as the bridge.** Mission analysis is the formal activity that translates strategic needs into capability requirements. It is the front end of the Mission Engineering process.
4. **Federation across performers.** The performers are managed independently. The mission is a federation of their services, with shared standards and governance.
5. **Standards as the lingua franca.** When the performers are different organizations, the standards (UAF, DoDAF) are the only common ground.

The UAF worked example in the Gagliardi paper shows the level of modeling discipline required [mission-engineering-uaf-gagliardi-2024].

## Best practices

- **Start from the capability.** The capability is what the mission exists to deliver. The performer is an implementation choice.
- **Model the cross-viewpoint consistency explicitly.** The UAF viewpoints are not independent; they are different views of the same model. Traceability between viewpoints is structural.
- **Federation, not centralization.** The performers are independent. The mission is a federation, not a hierarchy.
- **Standards are the only common ground.** When the performers are different organizations, the standards are the lingua franca.
- **The mission evolves.** The mission changes over time. The model must accommodate the changes without invalidating the design.

## Research frontiers

Active threads in 2024–2025:

- **UAF in practice.** The Gagliardi paper is one of the clearest public worked examples [mission-engineering-uaf-gagliardi-2024].
- **Resilient systems of systems.** Mission Engineering is closely related to SoS; the IW 2024 Resilient Systems track covers the SoS side [conf-iw2024-resilient-systems].
- **LLM-augmented Mission Engineering.** Using LLMs to surface mission-level patterns, with the standard caveat about reliability.
- **Digital Engineering for mission work.** Model-based approaches that start the model at the mission level, not the platform level.
- **R&D for mission capabilities.** The SE-ESR&D framework applies to capability discovery, not just platform development [se-esrd-framework-hodges-2024].

The 2024 Symposium added concrete defense-domain patterns:

- **Mission engineering for tank operations.** A practical model-based approach to mission analysis and configuration using MBSE — useful for defense programs trying to scale mission engineering beyond single-platform thinking [conf-is2024-p267-leveraging-mission-solution-configuration-through-].
- **The Darth Vader pattern — mission engineering in practice.** An accessible introduction to mission engineering for defense programs, named for the original "implementing mission engineering" framing [conf-is2024-p482-darth-vaders-secret-weapon-implementing-mission-en].
- **Architecting for multilevel security (MLS).** A practical approach to SysML model federation that handles classified networks — concrete example of DE in real defense environments [conf-is2024-p040-extending-sysml-model-federation-to-support-system].
- **STPA-SEC for defense security analysis.** Translating the STPA-SEC security method into a model-based workflow using SysML, applying Leveson's safety analysis to security in defense contexts [conf-is2024-p176-translating-the-stpa-sec-security-method-into-a-mo].

## What to read first

If you only read three things on Defense & Mission Engineering, read:

1. The Gagliardi paper on UAF — the worked example [mission-engineering-uaf-gagliardi-2024]
2. The INCOSE IW 2024 Resilient Systems track — the SoS side of mission work [conf-iw2024-resilient-systems]
3. The SE-ESR&D framework — when the mission is still being discovered [se-esrd-framework-hodges-2024]

## References

1. Implementing Mission Engineering with UAF — IS 2024 paper
2. Resilient Systems of Systems — IW 2024 (Torrance)
3. A Framework for SE in Early-Stage R&D — INCOSE LA, 2024
4. Systems of Systems architecting patterns — INCOSE SoS WG

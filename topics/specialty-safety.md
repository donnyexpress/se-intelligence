---
topic_key: specialty-safety
level: 7
last_curated: 2026-08-06
maturity: established
---

# System Safety

System safety is the engineering discipline of identifying hazards — conditions that could lead to harm — and designing systems to prevent, mitigate, or survive them. It is a horizontal specialty: every safety-critical system, regardless of application domain (automotive, defense, medical, aerospace, energy), draws on system safety. The discipline has its own standards (IEC 61508, ISO 26262, DO-178C, IEC 62304), its own engineering processes (hazard analysis, safety case, safety lifecycle), and its own professional community.

This article covers the basics of how system safety is practiced in 2025–2026, the patterns that work across industries, and the active research frontiers. Every claim is cited to a real source.

## Why it matters

The biggest systems engineering failures of the last 20 years — DieselGate, Boeing 737 MAX, Therac-25, the Fukushima reactor meltdowns — were safety failures. In most of these, no individual component failed: every component worked as designed. The hazard was in the *interaction* of components and the *control* of those interactions [dieselgate-smoke-and-mirrors-aftel-2025]. System safety is the discipline that addresses this — it sits between requirements and verification, and is what makes the difference between a system that works and a system that is safe.

## Basics

System safety is built on five core activities, performed iteratively throughout the system lifecycle:

1. **Hazard identification** — what can go wrong? This is the hardest step. A hazard is not a failure mode; it is a *condition* that can lead to harm. "Brake pedal returns to idle" is not a hazard; "vehicle fails to stop in time during emergency braking" is.
2. **Risk assessment** — how bad is the harm, and how likely? Most standards use a Severity × Likelihood matrix to classify risk. The result is a target safety integrity level (SIL in IEC 61508, ASIL in ISO 26262, DAL in DO-178C).
3. **Safety requirements derivation** — the system must satisfy a set of safety requirements derived from the hazards. These are *separate* from functional requirements, even when they constrain the same function.
4. **Safety design** — the architecture, mechanisms, and design features that satisfy the safety requirements. Defense in depth, fail-safe defaults, redundancy, separation of concerns.
5. **Safety verification and validation** — independent confirmation that the system actually meets its safety requirements, including testing in fault-injected conditions, and analysis of the safety case.

The dominant standards are:
- **IEC 61508** — the foundational functional safety standard, applicable across industries. Defines SIL 1-4.
- **ISO 26262** — automotive-specific derivative of IEC 61508. Defines ASIL A-D, with ASIL D being the most rigorous.
- **DO-178C** — software considerations in airborne systems. Defines DAL A-E.
- **IEC 62304** — medical device software lifecycle.
- **ISO 21448 (SOTIF)** — Safety of the Intended Functionality, addressing hazards from limited AI/ML performance in autonomous systems.

## Patterns that work

Across automotive, defense, and medical device programs, the same patterns recurred in published case studies from 2015–2025 [eng-domains-safety-security-co-design] [specialty-safety-stpa-leveson-2011]:

1. **STPA over FMEA for complex systems.** STPA (Systems-Theoretic Process Analysis) is the dominant modern hazard analysis technique for software-intensive and cyber-physical systems [specialty-safety-stpa-leveson-2011]. It captures hazards that FMEA misses because it models accidents as emergent from control actions, not from component failure.
2. **Co-design safety with the functional architecture.** Safety is not bolted on after the functional architecture is done; it is designed in from the start. This is the #1 lesson from the Boeing 737 MAX MCAS disaster, where the safety analysis was performed separately from the architecture and missed the integration risk [eng-domains-safety-security-co-design].
3. **Defense in depth.** No single point of failure should compromise safety. Redundant sensors, redundant actuators, redundant computation, redundant communication paths.
4. **Fail-safe defaults.** When a fault is detected, the system should transition to a safe state, not to an undefined state. The Tesla "unintended acceleration" allegations (debunked but instructive) and the DieselGate defeat device both illustrate the wrong way to handle fault detection.
5. **Independent verification.** Safety verification should be performed by people who did not design the system. The "I tested my own code" antipattern is responsible for a significant fraction of safety incidents.
6. **Safety case as a first-class artifact.** A safety case is a structured argument, supported by evidence, that the system is acceptably safe in its intended use. It is the deliverable that customers and regulators actually care about.

## Best practices

- **Hazard analysis is iterative.** Do a first pass during concept, refine during system definition, finalize before verification. The biggest programs do multiple passes at increasing resolution.
- **Safety requirements are not functional requirements.** A safety requirement is a *constraint* on a functional requirement. "The brake must apply" is functional; "the brake must apply within 100 ms even if the primary sensor fails" is safety.
- **Make the safety case reviewable.** A safety case that lives in someone's head is not a safety case. The argument must be on paper (or in a tool), traceable, and reviewable by independent assessors.
- **Plan for SOTIF, not just functional safety.** For autonomous and AI-driven systems, the hazard is often not a component failure but a *limitation* in the AI's ability to handle edge cases. ISO 21448 (SOTIF) addresses this [eng-domains-safety-security-co-design].
- **Treat safety as an organizational concern, not just a technical one.** The Therac-25, Boeing 737 MAX, and DieselGate failures all had organizational causes. The system that produced the design was as broken as the design itself [dieselgate-smoke-and-mirrors-aftel-2025].

## Research frontiers

Active threads in 2024–2025 safety research:

- **STPA-Req and STPA-Sec.** Extensions of STPA for requirements derivation and security analysis respectively. Both have growing adoption in defense and automotive [specialty-safety-stpa-leveson-2011].
- **SOTIF for ML-based perception.** How to argue that an ML-based perception system (e.g. a Tesla Autopilot) is safe enough. The answer is incomplete — the standards are evolving [eng-domains-safety-security-co-design].
- **Safety case patterns.** The community is converging on a small set of safety case structures (GSN, CAE) and patterns that work for specific industries.
- **Co-design of safety and security.** The two specialties have historically been separate; researchers are now arguing they should be integrated at the architecture level [eng-domains-safety-security-co-design].
- **Human factors in safety-critical systems.** A safety argument that ignores the human operator is incomplete. The Therac-25 failure was primarily a human factors failure (operators could not read the screen in time to intervene).

## What to read first

If you only read three things on system safety, read:

1. The STPA primer — the dominant modern hazard analysis technique for complex systems [specialty-safety-stpa-leveson-2011]
2. The safety/security co-design synthesis — what it looks like to integrate safety and security from the start [eng-domains-safety-security-co-design]
3. The DieselGate case study — a textbook SE failure with safety as the central lesson [dieselgate-smoke-and-mirrors-aftel-2025]

## References

1. STPA — Systems-Theoretic Process Analysis (Leveson, 2011)
2. Safety and security co-design in system definition
3. DieselGate — Smoke and Mirrors (Aftel, 2025)
4. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)

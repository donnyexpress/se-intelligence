---
topic_key: auto
level: 7
last_curated: 2026-08-05
maturity: established
---

# Automotive

Automotive systems engineering is the discipline of applying systems engineering to passenger vehicles, commercial vehicles, and the broader transportation ecosystem. It spans the regulatory discipline of ISO 26262, the operational discipline of vehicle development, and the emerging discipline of software-defined vehicles and autonomous driving. This article covers the basics, the patterns that work, the research frontiers, and the best practices that have held up across the last two decades.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

Automotive is one of the largest manufacturing sectors in the world, and the transition to software-defined and autonomous vehicles is one of the largest systems engineering projects of the 21st century. The discipline has to combine the traditional vehicle development lifecycle with software engineering at scale. DieselGate is the canonical example of what happens when this combination goes wrong [dieselgate-smoke-and-mirrors-aftel-2025].

## Basics

Automotive systems engineering covers:

- **Vehicle development**: the traditional V-model from concept to production. Long lead times (3-5 years), high volumes (millions of units per platform), strict cost targets.
- **Functional safety (ISO 26262)**: the dominant safety standard for road vehicles. ASIL ratings (A through D) classify the safety integrity level.
- **Cybersecurity (ISO 21434)**: the newer standard for automotive cybersecurity. Driven by the connected-vehicle threat surface.
- **Software-defined vehicles**: the transition from hardware-defined to software-defined functionality. Over-the-air updates, feature flags, software-driven differentiation.
- **Autonomous driving**: SAE levels 0-5, with the systems engineering challenges of perception, planning, and control at increasing levels of autonomy.
- **Electrification**: the transition to electric powertrains, with the systems engineering challenges of batteries, motors, and charging infrastructure.

The regulatory environment is the dominant constraint: ISO 26262, ISO 21434, UNECE regulations, and the equivalent regional standards.

## Patterns that work

Five patterns recur in automotive SE practice:

1. **Lifecycle thinking is regulatory thinking.** In automotive, lifecycle stages map to regulatory stages. The V-model is a regulatory deliverable.
2. **Hazard analysis at the system level.** The HARA (Hazard Analysis and Risk Assessment) is the starting point for functional safety. It is not optional.
3. **Co-design with safety and security.** ISO 26262 and ISO 21434 are co-designed. The integration is required [eng-domains-safety-security-co-design].
4. **Software at the center.** Software-defined vehicles put software at the center of the system. The software engineering discipline is the primary discipline.
5. **Verification at the system level.** The vehicle is verified as a system, not as a collection of components. HIL (hardware-in-the-loop) and MIL (model-in-the-loop) testing are the standard practice.

DieselGate is the canonical example of what happens when verification is designed to defeat inspection rather than verify the system [dieselgate-smoke-and-mirrors-aftel-2025].

## Best practices

- **Regulatory awareness is the first skill.** Every automotive SE practitioner should understand ISO 26262, ISO 21434, and the regional regulations.
- **HARA is the deliverable.** The HARA defines the safety goals. Without a HARA, the safety work is unfocused.
- **Co-design with safety and security.** The patterns that work for safety-critical systems work for vehicles [eng-domains-safety-security-co-design].
- **Verification that matches the operational environment.** This is the DieselGate lesson [dieselgate-smoke-and-mirrors-aftel-2025].
- **HFE in the vehicle.** Drivers are humans; the vehicle is a human-factors system. The HFE patterns apply [human-factors-rapid-prototyping-zeman-wood-2025].

## Research frontiers

Active threads in 2024–2025:

- **Software-defined vehicles.** The transition to software at the center, with the corresponding changes to architecture, process, and culture.
- **Autonomous driving at scale.** SAE Level 3+ is becoming available; the systems engineering challenges of perception, planning, and verification are unsolved.
- **Cybersecurity for connected vehicles.** The threat surface is growing; the standards are evolving.
- **Electrification at scale.** The systems engineering of batteries, motors, and charging infrastructure at automotive scale.
- **HFE for autonomous vehicles.** The driver becomes a passenger; the HFE patterns change [human-factors-rapid-prototyping-zeman-wood-2025].

## What to read first

If you only read three things on automotive SE, read:

1. The DieselGate case study — what happens when verification is designed to defeat inspection [dieselgate-smoke-and-mirrors-aftel-2025]
2. The safety/security co-design patterns — the integration is the hard part [eng-domains-safety-security-co-design]
3. The HFE-in-prototyping talk — the HFE patterns apply to vehicles [human-factors-rapid-prototyping-zeman-wood-2025]

## References

1. DieselGate — Smoke and Mirrors, INCOSE San Diego, 2025
2. Safety and security co-design in critical systems
3. Human Factors in Rapid Prototyping — Zeman & Wood, INCOSE San Diego, 2025
4. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)

---
topic_key: sec
level: 7
last_curated: 2026-08-05
maturity: established
---

# Security Engineering

Security engineering is the discipline of designing and operating systems that protect their assets from adversaries. In modern systems, security is not a feature or a layer; it is a property of the system that must be designed in from the start. This article covers the basics, the patterns that work, the research frontiers, and the best practices that have held up across the last two decades.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

Every system has adversaries. Some are criminals, some are state actors, some are insiders, some are accident-prone users. Security engineering is the discipline of building systems that continue to work in the presence of adversaries. The DieselGate case is the canonical example of what happens when security (in the sense of "designed to defeat inspection") is treated as a feature rather than a threat [dieselgate-smoke-and-mirrors-aftel-2025].

## Basics

Security engineering covers:

- **Threat modeling**: identifying the adversaries, the assets, and the attack paths. STRIDE and PASTA are common frameworks.
- **Security architecture**: the structural decisions that make attacks harder (defense in depth, least privilege, secure by default).
- **Secure implementation**: coding practices that avoid common vulnerabilities (OWASP Top 10, CWE Top 25).
- **Security testing**: finding vulnerabilities before the attacker does. SAST, DAST, fuzzing, penetration testing.
- **Security operations**: monitoring, incident response, forensics. The "blue team" work.
- **Identity and access management**: authentication, authorization, audit. The "who can do what" of the system.

The INCOSE SE Handbook v5 treats security as one of the engineering specialties, alongside safety and reliability [lifecycle-iso-iec-15288-2023]. The SEBoK Part 7 articles cover the integration with systems engineering.

The hardest part of security engineering is *co-design with safety*. Safety and security have overlapping and conflicting goals: safety wants the system to fail safely; security wants the system to not fail at all to the attacker. The integration is an active research topic [eng-domains-safety-security-co-design].

## Patterns that work

Five patterns recur in security engineering practice:

1. **Threat model before design.** The threat model is the prerequisite for the design. Without the threat model, the design is guesswork.
2. **Defense in depth.** No single control is enough. The system has multiple layers of security, each of which assumes the others can fail.
3. **Least privilege.** Every component gets the minimum permissions it needs. The default is no access; access is granted explicitly.
4. **Secure by default.** The default configuration is the secure one. Insecure configurations require explicit opt-in.
5. **Security testing in CI.** Security tests are run on every change, with the same discipline as unit tests. SAST and dependency scanning are part of the build.

## Best practices

- **Threat model first.** The threat model is the prerequisite for the design. Without the threat model, you're not designing security; you're decorating.
- **Security is a property of the system, not a feature.** A secure feature on an insecure system is still insecure. The system has to be designed to be secure.
- **Co-design with safety.** Safety and security share patterns; they have to be designed together [eng-domains-safety-security-co-design].
- **Treat GenAI as a security concern.** GenAI introduces new attack surfaces (prompt injection, model exfiltration, training data leakage) [safeguarding-genai-prompt-engineering-giang-2025].
- **Federated learning as a security pattern.** When the data cannot move, federated learning lets the model travel instead [federated-learning-villanueva-2025].

## Research frontiers

Active threads in 2024–2025:

- **Safety and security co-design.** New patterns for integrating safety and security analyses from the start of the architecture [eng-domains-safety-security-co-design].
- **GenAI security.** Prompt injection, model exfiltration, training data leakage — the new attack surfaces of GenAI in the SE workflow [safeguarding-genai-prompt-engineering-giang-2025].
- **Federated learning for data-residency security.** A pattern for ML where the data cannot move [federated-learning-villanueva-2025].
- **DieselGate as the canonical security failure.** What happens when security is designed to defeat inspection [dieselgate-smoke-and-mirrors-aftel-2025].
- **Supply chain security.** SBOM, SLSA, signed provenance. The field is moving fast.

## What to read first

If you only read three things on security engineering, read:

1. The safety/security co-design patterns — the integration is the hard part [eng-domains-safety-security-co-design]
2. The Giang paper on prompt engineering safety — GenAI in the SE workflow introduces new attack surfaces [safeguarding-genai-prompt-engineering-giang-2025]
3. The DieselGate case study — what happens when security is designed to defeat inspection [dieselgate-smoke-and-mirrors-aftel-2025]

## References

1. Safety and security co-design in critical systems
2. Safeguarding Sensitive Data: Prompt Engineering for GenAI — INCOSE Enchantment, 2025
3. Federated Learning — Villanueva, INCOSE San Diego, 2025
4. DieselGate — Smoke and Mirrors, INCOSE San Diego, 2025

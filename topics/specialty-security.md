---
topic_key: specialty-security
level: 7
last_curated: 2026-08-06
maturity: established
---

# Security Engineering

Security engineering is the discipline of designing systems that remain trustworthy in the face of malice, error, or mischance. It is a horizontal specialty that intersects with every safety-critical and information-critical system. The discipline has its own standards (NIST 800-53, ISO 27001, NIST CSF, IEC 62443), its own engineering processes (threat modeling, security architecture, security testing), and its own professional community. The INCOSE Systems Security Engineering (SSE) Working Group is the main systems-engineering-focused community.

This article covers the basics of how security engineering is practiced, the patterns that work across industries, and the active research frontiers. Every claim is cited to a real source.

## Why it matters

Security failures are now systems engineering failures. The SolarWinds supply chain attack, the Colonial Pipeline ransomware attack, the MOVEit file transfer vulnerability, the Log4Shell zero-day — these were not "security team" failures. They were systems engineering failures: the architecture did not consider the threat model, the verification did not catch the vulnerability, the integration introduced an insecure dependency. Security is now a systems engineering concern, not a separate discipline bolted on at the end.

## Basics

Security engineering is built on five core activities, performed iteratively throughout the lifecycle [eng-domains-safety-security-co-design]:

1. **Threat modeling** — who would attack the system, what would they want, how would they get it? The dominant techniques are STRIDE (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) and PASTA (Process for Attack Simulation and Threat Analysis).
2. **Security requirements derivation** — the system must satisfy a set of security requirements derived from the threat model. These are *separate* from functional requirements, even when they constrain the same function.
3. **Security architecture** — the design patterns that satisfy the security requirements: defense in depth, least privilege, fail-secure defaults, separation of concerns, zero trust.
4. **Security verification** — independent confirmation that the system actually meets its security requirements: penetration testing, fuzzing, static analysis, dependency analysis, red team exercises.
5. **Security operations** — monitoring, incident response, patch management, vulnerability management. The system must remain secure in the face of new threats discovered after deployment.

The dominant standards and frameworks are:
- **NIST 800-53** — the US government security controls catalog, the most-cited reference worldwide.
- **ISO 27001** — information security management system standard, the international certification framework.
- **NIST CSF (Cybersecurity Framework)** — the five-function framework (Identify, Protect, Detect, Respond, Recover), used widely for program-level security.
- **IEC 62443** — industrial automation and control systems security.
- **NIST SSDF (Secure Software Development Framework)** — the US government framework for secure software development practices.

## Patterns that work

Across enterprise, defense, and critical infrastructure programs, the same patterns recurred [eng-domains-safety-security-co-design] [safeguarding-genai-prompt-engineering-giang-2025] [federated-learning-villanueva-2025]:

1. **Threat modeling is required from the start.** Programs that defer threat modeling until after the architecture is complete consistently find critical vulnerabilities late. The threat model should be developed during system definition, refined during design, and re-validated before deployment.
2. **Zero trust is the modern default.** Never trust, always verify. Every request is authenticated, authorized, and audited. This is the dominant architectural pattern in 2025–2026, replacing the older "perimeter defense" model.
3. **Defense in depth.** No single control should be the only thing protecting an asset. Authentication + authorization + audit + monitoring + encryption-at-rest + encryption-in-transit + network segmentation.
4. **Secure by default.** The system should be secure in its default configuration. The user must explicitly opt-in to insecure configurations. This is the opposite of consumer software's "easy and insecure by default" pattern.
5. **Supply chain security.** Modern attacks target the build pipeline (SolarWinds, 3CX, MOVEit) and dependencies (Log4Shell, Event-Stream). Software Bills of Materials (SBOMs), artifact signing, and reproducible builds are the emerging patterns.
6. **Patch rapidly.** The window between vulnerability disclosure and exploitation is shrinking. A patch deployment pipeline that takes weeks is now a liability.

## Best practices

- **Security is not the security team's job.** It is the systems engineering team's job. The security team advises; the systems team owns the architecture and the verification.
- **Threat model the system, not the components.** Component-level threat models miss the integration vulnerabilities. The threat model must cover the assembled system and its data flows.
- **Fuzz your inputs.** Fuzzing — sending random or malformed input to the system to find crashes — is the most effective way to find memory-safety and parser bugs. OSS-Fuzz has been running since 2016 and continues to find real bugs.
- **Verify the third party.** Vendor security questionnaires, SOC 2 reports, and penetration tests are necessary but not sufficient. The 3CX and MOVEit compromises were both in vendors with strong security programs.
- **Practice the incident response.** Tabletop exercises and live red team drills are the only way to find the gaps in your incident response process. A team that has never practiced will fail in a real incident.

## Research frontiers

Active threads in 2024–2025 security research:

- **Securing generative AI systems.** Prompt injection, data exfiltration, and model theft are new threat classes that don't fit classical security models. Guidance is emerging but immature [safeguarding-genai-prompt-engineering-giang-2025].
- **Federated learning security.** Federated learning distributes the training, but the gradient updates can leak training data. New protocols (secure aggregation, differential privacy) are being deployed [federated-learning-villanueva-2025].
- **Software supply chain security.** SBOM mandates, artifact signing, reproducible builds, and SLSA (Supply-chain Levels for Software Artifacts) are the emerging standards. The US federal government is leading adoption.
- **Post-quantum cryptography.** NIST has standardized the first post-quantum cryptographic algorithms (ML-KEM, ML-DSA, SLH-DSA). Migration plans are in progress at large organizations.
- **Co-design of safety and security.** The two specialties have historically been separate; researchers are now arguing they should be integrated at the architecture level [eng-domains-safety-security-co-design].

## What to read first

If you only read three things on security engineering, read:

1. The safety/security co-design synthesis — what it looks like to integrate both from the start [eng-domains-safety-security-co-design]
2. The prompt engineering security guidance — what the threat model for GenAI looks like in practice [safeguarding-genai-prompt-engineering-giang-2025]
3. The federated learning security analysis — the emerging privacy and security concerns in ML systems [federated-learning-villanueva-2025]

## References

1. Safety and security co-design in system definition
2. Safeguarding generative AI — prompt engineering guidance (Giang, 2025)
3. Federated learning — privacy and security in distributed ML (Villanueva, 2025)
4. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)

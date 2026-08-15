---
topic_key: sec
level: 7
last_curated: 2026-08-15
maturity: established
---

# Security Engineering

Security engineering is the discipline of designing and operating systems that protect their assets from adversaries. In modern systems, security is not a feature or a layer; it is a property of the system that must be designed in from the start. This article covers the basics, the patterns that work, and the best practices that have held up across the last two decades. The 2024-2026 evidence base includes 10+ INCOSE conference papers and 1 peer-reviewed journal article (Wiley SE 29(4)).

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

Every system has adversaries. Some are criminals, some are state actors, some are insiders, some are accident-prone users. Security engineering is the discipline of building systems that continue to work in the presence of adversaries. The DieselGate case is the canonical example of what happens when security (in the sense of "designed to defeat inspection") is treated as a feature rather than a threat [dieselgate-smoke-and-mirrors-aftel-2025].

## Basics

Security engineering covers:

- **Threat modeling**: identifying the adversaries, the assets, and the attack paths. STRIDE (used in food industry per Jung et al. 2026 [journal-wiley-se-29-4-jung-stride-smart-haccp-korean-food]) and PASTA are common frameworks. MBSE-driven threat modeling (SysML4Sec [conf-is2025-p270-sysml4sec-methodology-for-security-modeling-in-the]) is the 2024-2025 pattern.
- **Security architecture**: the structural decisions that make attacks harder (defense in depth, least privilege, secure by default).
- **Secure implementation**: coding practices that avoid common vulnerabilities (OWASP Top 10, CWE Top 25).
- **Security testing**: finding vulnerabilities before the attacker does. SAST, DAST, fuzzing, penetration testing.
- **Security operations**: monitoring, incident response, forensics. The "blue team" work.
- **Identity and access management**: authentication, authorization, audit. The "who can do what" of the system.

The INCOSE SE Handbook v5 treats security as one of the engineering specialties, alongside safety and reliability [lifecycle-iso-iec-15288-2023]. The SEBoK Part 7 articles cover the integration with systems engineering.

The hardest part of security engineering is *co-design with safety*. Safety and security have overlapping and conflicting goals: safety wants the system to fail safely; security wants the system to not fail at all to the attacker. The integration is an active research topic [eng-domains-safety-security-co-design], and STPA-SEC [conf-is2024-p176-translating-the-stpa-sec-security-method-into-a-mo, conf-is2024-p292-integrating-stpa-extended-for-coordination-into-sy] is the 2024 method for safety-security integration in MBSE.

## Patterns that work

Five patterns recur in security engineering practice:

1. **Threat model before design.** The threat model is the prerequisite for the design. Without the threat model, the design is guesswork. The 2024-2025 work shows threat models being built *as MBSE models*, not as separate documents — STPA-SEC in SysML [conf-is2024-p176-translating-the-stpa-sec-security-method-into-a-mo], SysML4Sec methodology [conf-is2025-p270-sysml4sec-methodology-for-security-modeling-in-the], and the cyber-threat quantification pattern [conf-is2024-p469-developing-a-model-based-systems-engineering-tool-]. The pattern: the threat model is a model, the threat analysis is queryable, the security case is regenerable.
2. **Defense in depth.** No single control is enough. The system has multiple layers of security, each of which assumes the others can fail.
3. **Least privilege.** Every component gets the minimum permissions it needs. The default is no access; access is granted explicitly.
4. **Secure by default.** The default configuration is the secure one. Insecure configurations require explicit opt-in.
5. **Security testing in CI.** Security tests are run on every change, with the same discipline as unit tests. SAST and dependency scanning are part of the build.

## Best practices

- **Threat model first.** The threat model is the prerequisite for the design. Without the threat model, you're not designing security; you're decorating. Use the same model-based approach as the rest of the system: STRIDE in MBSE [journal-wiley-se-29-4-jung-stride-smart-haccp-korean-food], STPA-SEC in SysML [conf-is2024-p176-translating-the-stpa-sec-security-method-into-a-mo], or SysML4Sec [conf-is2025-p270-sysml4sec-methodology-for-security-modeling-in-the].
- **Security is a property of the system, not a feature.** A secure feature on an insecure system is still insecure. The system has to be designed to be secure.
- **Co-design with safety.** Safety and security share patterns; they have to be designed together [eng-domains-safety-security-co-design].
- **Treat GenAI as a security concern.** GenAI introduces new attack surfaces (prompt injection, model exfiltration, training data leakage) [safeguarding-genai-prompt-engineering-giang-2025].
- **Federated learning as a security pattern.** When the data cannot move, federated learning lets the model travel instead [federated-learning-villanueva-2025].
- **Apply threat modeling to non-traditional domains.** The 2026 Wiley paper [journal-wiley-se-29-4-jung-stride-smart-haccp-korean-food] applies STRIDE to Smart HACCP in the Korean food industry — a concrete case study showing that threat modeling patterns generalize beyond IT/OT into food safety, industrial IoT, and supply chain. The pattern: the *method* (STRIDE) is domain-agnostic; the *threats* are domain-specific.

## Research frontiers

Security engineering is moving from checklist to model-based:

- **MBSE-driven threat modeling is now working practice.** STPA-SEC in SysML [conf-is2024-p176-translating-the-stpa-sec-security-method-into-a-mo, conf-is2024-p292-integrating-stpa-extended-for-coordination-into-sy], SysML4Sec methodology [conf-is2025-p270-sysml4sec-methodology-for-security-modeling-in-the], and MBSE for cyber threat quantification [conf-is2024-p469-developing-a-model-based-systems-engineering-tool-]. The threat model is a SysML model, the analysis is queryable, the security case is regenerable. This is the 2024-2026 transformation: security is a model concern.
- **Safety and security co-design.** New patterns for integrating safety and security analyses from the start of the architecture [eng-domains-safety-security-co-design]. STPA-SEC is the leading formal pattern.
- **NIST SSDF + supply chain security.** The US government baseline for software security practices after EO 14028 — procurement language is now asking for it [sec-nist-ssdf-800-218]. Pairs with SBOM, SLSA, signed provenance.
- **GenAI security.** Prompt injection, model exfiltration, training data leakage — the new attack surfaces of GenAI in the SE workflow [safeguarding-genai-prompt-engineering-giang-2025].
- **STRIDE in food industry (2026 Wiley).** Jung et al. [journal-wiley-se-29-4-jung-stride-smart-haccp-korean-food] applied STRIDE to Smart HACCP — a cross-industry case study showing that threat modeling patterns generalize. STRIDE works in food safety, just as it works in ICS, IoT, and software.

## What to read first

If you only read three things on security engineering, read:

1. The NIST SSDF — the US government baseline for software security practice; if you sell to the federal government, this is the procurement language [sec-nist-ssdf-800-218]
2. The safety/security co-design patterns — the integration is the hard part [eng-domains-safety-security-co-design]
3. STRIDE in MBSE for cross-industry threat modeling — the 2026 peer-reviewed pattern [journal-wiley-se-29-4-jung-stride-smart-haccp-korean-food]

## References

1. NIST SP 800-218 v1.1 — Secure Software Development Framework (Feb 2022)
2. Safety and security co-design in critical systems
3. Safeguarding Sensitive Data: Prompt Engineering for GenAI — INCOSE Enchantment, 2025
4. Federated Learning — Villanueva, INCOSE San Diego, 2025
5. DieselGate — Smoke and Mirrors, INCOSE San Diego, 2025
6. STPA-SEC translated into SysML — IS 2024
7. STPA extended for coordination — IS 2024
8. SysML4Sec methodology for security modeling — IS 2025
9. MBSE for cyber threat quantification — IS 2024
10. STRIDE-Based Threat Modeling for Smart HACCP in Korean food industry (Wiley SE 29(4), 2026)

---
topic_key: eng-domains
level: 7
last_curated: 2026-08-15
maturity: established
---

# Engineering Specialty

Engineering Specialty covers the discipline-specific work that turns a generic architecture into a real system: software, safety, reliability, maintainability, security, and human factors. It's where SEBoK Part 7 lives. This is the work that gets done when a system has to actually meet a standard — IEC 61508 for functional safety, ISO 26262 for automotive, IEC 62443 for industrial security, etc.

This article covers the basics, the patterns that work across engineering specialties, the research frontiers, and best practices that have held up across decades. The 2024-2026 evidence base includes 25+ INCOSE conference papers and 3 peer-reviewed journal articles (Wiley SE 29(4)). Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

The most common cause of program failure is not bad architecture; it's bad specialty engineering. The architecture is sound, the requirements are clear — but the system has a software bug, a safety oversight, a security hole, or a human-factors issue. Engineering specialty is the discipline that prevents this [lifecycle-iso-iec-15288-2023].

## Basics

Engineering Specialty covers the discipline-specific work that wraps the technical work. The INCOSE SE Handbook v5 and ISO/IEC/IEEE 15288:2023 define the technical processes that produce specialty outputs [lifecycle-iso-iec-15288-2023]:

- **Software engineering** — the implementation of the software parts of the system. The dominant specialty in modern systems.
- **Safety engineering** — the systematic identification and mitigation of hazards. Standards-driven (IEC 61508, ISO 26262, ARP 4761 for aviation).
- **Reliability engineering** — prediction and demonstration that the system meets its reliability targets. Methods include FMEA, RBD, reliability growth testing.
- **Maintainability engineering** — designing the system to be maintained. Often under-resourced.
- **Security engineering** — protecting the system against threats. Standards-driven (IEC 62443, NIST SSDF).
- **Human factors engineering** — designing the system for the people who use it. The cheapest place to fix human-factors issues is during design, not after deployment.

Two cross-cutting themes are critical:

- **Each specialty has its own modeling language extension.** RAM attributes become first-class SysML properties [conf-is2024-p557-omg-standard-to-extend-sysml-to-reliability-engine]; STPA-SEC gets translated into SysML [conf-is2024-p176-translating-the-stpa-sec-security-method-into-a-mo]; SysML4Sec provides a methodology for security modeling [conf-is2025-p270-sysml4sec-methodology-for-security-modeling-in-the].
- **AI/ML is now a specialty in its own right.** The 2024-2025 work makes this explicit — the SE Maturity framework treats GenAI as a specialty discipline [se-maturity-genai-madachy-2025], and the prompt-engineering safety guidance is its own field [safeguarding-genai-prompt-engineering-giang-2025].

## Patterns that work

Five patterns recur in engineering specialty practice:

1. **Specialty discipline absorbed into the MBSE model.** The classical pattern was "the model is for the system, and a separate document is for the safety case / security case / etc.". The 2024-2026 pattern is "every specialty becomes a model concern". Examples: RAM attributes are first-class SysML properties [conf-is2024-p557-omg-standard-to-extend-sysml-to-reliability-engine]; multi-level FMEA is generated from the architecture [conf-is2025-fmea-multilevel]; STPA hazards and constraints are model elements, not document sections. The pattern: the model is the source of truth for *all* specialty concerns.
2. **Procedures as state machines, not documents.** The classical pattern was "write a procedure document, follow it". The 2026 pattern (Chaudemar et al., for UAS) is "the procedure is a state machine with safety guards; the model can be exercised to find procedure-level failure modes" [journal-wiley-se-29-4-chaudemar-safety-dynamic-procedure-uas]. This is most visible in regulated domains (aviation, medical, nuclear) where procedure design is itself a safety concern.
3. **Safety and security co-designed from the start.** Wait until the logical architecture is stable, then co-design safety and security with the functional architecture. Doing it later is more expensive [eng-domains-safety-security-co-design]. The 2024 work made this more explicit: secure design is a first-class activity in system definition [conf-is2024-p054-secure-design-a-practical-approach-for-systems-eng].
4. **System-level readiness as a measurable property.** The classical System Readiness Level (SRL) calculation — TRL × IRL — gives a single scalar per system. The 2026 pattern (Fu, Mazzuchi & Sarkani) is to compute readiness at the *interface* level, with mathematical properties for cluster-level integration [journal-wiley-se-29-4-fu-cluster-readiness-levels]. Readiness becomes a measurable property of the architecture, not just an aggregated scalar.
5. **ABM as a teaching tool for complex, sociotechnical, AI-based systems.** The classical pedagogy was to teach the components. The 2026 pattern (Obiako et al.) is to use Agent-Based Modeling so students can explore the *emergent* behavior of these systems [journal-wiley-se-29-4-obiako-smts-agent-based-pedagogy]. The dominant learning need for the next generation of SE practitioners is emergent-behavior literacy, not just component knowledge.

The SEBoK Part 7 articles cover these patterns in detail.

## Best practices

- **Each specialty has a standard; the standard is the source of truth.** Functional safety: IEC 61508 (or ISO 26262 for automotive, ARP 4761 for aviation). Security: IEC 62443 (or NIST SSDF for software). Reliability: MIL-HDBK-217 or its modern replacement. Don't reinvent these — use them.
- **CM is the most under-resourced activity.** Most programs under-invest in CM, then spend more on rework than they would have spent on CM. The 2024 work makes CM patterns explicit for federated MBSE [conf-is2024-p415-configuration-management-of-sets-of-links-in-a-fed].
- **Hazard analysis must be multi-level.** Single-level FMEA misses hazards at the integration boundary. The 2025 pattern is to generate FMEA from the same architecture model, at system, subsystem, and component levels [conf-is2025-fmea-multilevel].
- **For AI/ML components, safety patterns must be re-derived.** The classical safety patterns assume deterministic, well-understood components. AI/ML components are non-deterministic and data-driven. The 2024-2026 work is building new patterns — see the safety-critical AI design methodology [conf-is2025-p087-a-digital-engineering-methodology-for-design-explo].
- **Use STPA, not just FMEA, for control systems.** FMEA catches component failures; STPA catches unsafe control actions that don't correspond to any single component failing. The 2011 STPA paper [specialty-safety-stpa-leveson-2011] is now the dominant safety pattern in defense, automotive, and medical.
- **Cyber threat modeling is MBSE-able.** The classical pattern was "checklist". The 2024 pattern (MBSE for cyber threats) is "modeled, measured property" — bring security from checklist to model [conf-is2024-p469-developing-a-model-based-systems-engineering-tool-]. STRIDE applied in food industry is a concrete example [journal-wiley-se-29-4-jung-stride-smart-haccp-korean-food].

## Research frontiers

Three 2024-2026 threads are now in practice, not just research:

- **Every specialty is being re-platformed onto MBSE + AI/ML.** RAM [conf-is2024-p557-omg-standard-to-extend-sysml-to-reliability-engine], FMEA [conf-is2025-fmea-multilevel], safety [journal-wiley-se-29-4-chaudemar-safety-dynamic-procedure-uas], security [conf-is2024-p176-translating-the-stpa-sec-security-method-into-a-mo, conf-is2025-p270-sysml4sec-methodology-for-security-modeling-in-the], and readiness [journal-wiley-se-29-4-fu-cluster-readiness-levels] are all moving to model-based + AI-aware. The 2026 peer-reviewed work lands as formal foundations: readiness becomes math, procedures become models, pedagogy becomes simulation [journal-wiley-se-29-4-obiako-smts-agent-based-pedagogy].
- **AI/ML in safety-critical systems needs new safety patterns.** Classical safety assumes deterministic, well-understood components. The 2025 paper on digital engineering methodology for safety-critical AI [conf-is2025-p087-a-digital-engineering-methodology-for-design-explo] and the 2025 paper on digital safety analysis for small modular nuclear [conf-is2025-p031-digital-safety-analysis-for-small-modular-nuclear-] are the first attempts to bring AI/ML into the safety discipline formally.
- **Cybersecurity quantification via MBSE.** A 2024 paper proposes an MBSE-based method to quantify cyber threats to microelectronics [conf-is2024-p469-developing-a-model-based-systems-engineering-tool-] — bringing security from "checklist" to "modeled, measured property". Pairs with the STPA-SEC translation into SysML [conf-is2024-p176-translating-the-stpa-sec-security-method-into-a-mo, conf-is2024-p292-integrating-stpa-extended-for-coordination-into-sy] and the trust/distrust system-dynamics work [conf-is2024-p376-a-model-for-trust-and-distrust-the-systems-dynamic].

## What to read first

If you only read three things on engineering specialty, read:

1. The safety/security co-design patterns — what it looks like to design both from the start [eng-domains-safety-security-co-design]
2. STPA — the dominant pattern for control-system safety [specialty-safety-stpa-leveson-2011]
3. Cluster-based SRL — the first peer-reviewed formal foundation for readiness [journal-wiley-se-29-4-fu-cluster-readiness-levels]

## References

1. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)
2. Safety and security co-design in critical systems
3. STPA — Systems-Theoretic Process Analysis (Leveson, 2011)
4. OMG standard to extend SysML to reliability engineering (IS 2024)
5. Multi-level FMEA driven by architecture (IS 2025)
6. STPA-SEC translated into SysML (IS 2024)
7. STPA extended for coordination (IS 2024)
8. SysML4Sec methodology for security modeling (IS 2025)
9. Configuration management for federated MBSE (IS 2024)
10. Digital engineering methodology for safety-critical AI (IS 2025)
11. MBSE for cyber threat quantification (IS 2024)
12. STRIDE-Based Threat Modeling for Smart HACCP (Wiley SE 29(4), 2026)
13. AI-enhanced autonomous formation flying (IS 2024)
14. Trust/distrust dynamics in human-AI systems (IS 2024)
15. Digital safety analysis for small modular nuclear (IS 2025)
16. Human factors in rapid prototyping — Zeman & Wood, INCOSE San Diego, 2025
17. DieselGate — Smoke and Mirrors, INCOSE San Diego, 2025
18. SE Maturity and Cost Modeling Framework for GenAI — INCOSE San Diego, 2025
19. Cluster-based SRL with mathematical interface properties (Wiley SE 29(4), 2026)
20. Safety-driven dynamic procedure modeling for UAS (Wiley SE 29(4), 2026)
21. ABM-based pedagogy for Smart Transportation Systems (Wiley SE 29(4), 2026)

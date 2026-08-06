---
topic_key: eng-domains
level: 7
last_curated: 2026-08-06
maturity: established
---

# Engineering Specialty

Engineering specialty covers the discipline-specific knowledge and practices that systems engineering must draw on: software, safety, reliability, maintainability, security, human factors, and others. These are not sub-disciplines of systems engineering; they are independent disciplines that systems engineering integrates. This article covers the basics, the patterns that work, the research frontiers, and the best practices that have held up across decades.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

The biggest systems engineering failures of the last 20 years — DieselGate, Boeing 737 MAX, Therac-25 — were not failures of the systems engineering process. They were failures of the engineering specialties: safety analysis, security analysis, human factors. Systems engineering is the integration discipline, but the integration is only as good as the specialties it integrates [dieselgate-smoke-and-mirrors-aftel-2025].

## Basics

The engineering specialties are independent disciplines with their own standards, certifications, and communities:

- **Software engineering**: the discipline of building software-intensive systems. IEEE/ACM standards, professional certifications, dedicated academic programs.
- **Safety engineering**: the discipline of identifying and mitigating hazards. IEC 61508, ISO 26262, DO-178C, and many domain-specific standards.
- **Reliability engineering**: the discipline of predicting and improving system reliability. MTBF, MTTR, availability, FMECA, reliability block diagrams.
- **Maintainability engineering**: the discipline of designing for ease of maintenance. MIL-HDBK-470, IEC 60706.
- **Security engineering**: the discipline of designing secure systems. NIST 800-53, ISO 27001, STRIDE/DREAD threat modeling.
- **Human factors engineering**: the discipline of designing for human users. MIL-STD-1472, ANSI/HFES standards.

The INCOSE SE Handbook v5 covers each in dedicated chapters [lifecycle-iso-iec-15288-2023]. The SEBoK Part 7 articles cover the integration.

The fundamental challenge of engineering specialty is *co-design*. Each specialty has its own design process, its own verification process, and its own vocabulary. The systems engineering role is to ensure that the specialties are not designed in isolation, that conflicts are resolved at design time, and that the integrated system satisfies all the specialty requirements.

## The six specialties in detail

Each of the six engineering specialties has its own dedicated article in this knowledge base. Click through for the full depth on each:

- [System Safety](/topic/specialty-safety) — hazard analysis, functional safety standards, safety case, STPA
- [Reliability Engineering](/topic/specialty-reliability) — MTBF/MTTR prediction, FMECA, reliability block diagrams, Weibull analysis
- [Security Engineering](/topic/specialty-security) — threat modeling, zero trust, supply chain security, SOTIF
- [Human Factors](/topic/specialty-hfe) — physical and cognitive ergonomics, accessibility, training, usability testing
- [Maintainability](/topic/specialty-maintainability) — MTTR, modular architecture, built-in test, service life planning
- [Software Engineering](/topic/specialty-software) — DORA metrics, continuous delivery, software architecture, MBSE for software-intensive systems

## Patterns that work

Five patterns recur in engineering specialty practice:

1. **Co-design safety and security with the functional architecture.** Safety and security are not bolted on after the functional architecture is done; they are designed in from the start [eng-domains-safety-security-co-design].
2. **Co-design human factors with the prototype.** Human factors is not a verification gate at the end of the prototype cycle; it is built into the loop [human-factors-rapid-prototyping-zeman-wood-2025].
3. **Use the standards' verification methods, not just their requirements.** Each specialty standard defines not just what to design but how to verify the design. The verification methods are as important as the requirements.
4. **Build a hazard analysis from the architecture.** Modern FMEA is generated from the architecture model, not from a separate spreadsheet [conf-is2025-fmea-multilevel].
5. **Treat GenAI as a specialty too.** With GenAI in the SE workflow, the SE team must apply the same discipline to GenAI as to any other subsystem [se-maturity-genai-madachy-2025] [safeguarding-genai-prompt-engineering-giang-2025].

## Best practices

- **Each specialty has its own expert.** A safety-critical program needs a dedicated safety engineer, not a systems engineer who has read a safety standard. The same is true for security, human factors, and software.
- **Co-design is harder than it looks.** Two specialties that are each individually correct can produce a system that fails when integrated. The co-design is a separate activity.
- **The standards' verification methods matter.** Skipping the verification methods in favor of "we'll verify at the end" is the most common source of specialty-related program failures.
- **Have a hazard log, not a hazard spreadsheet.** A hazard log is a living document, with each hazard having a lifecycle from identification to closure. A hazard spreadsheet is a snapshot.
- **Treat the data you use for ML as a specialty.** ML systems have data discipline requirements that are different from other subsystems. The data is the design [federated-learning-villanueva-2025].

## Research frontiers

Active threads in 2024–2025:

- **Safety and security co-design with safety-critical systems.** New patterns for integrating safety and security analyses from the start of the architecture [eng-domains-safety-security-co-design].
- **Human factors in rapid prototyping.** The cost of fixing human-factors issues after the prototype is much higher than during; the talk gives cost multipliers [human-factors-rapid-prototyping-zeman-wood-2025].
- **Multi-level FMEA from the architecture.** FMEA is generated from the SysML model, with consistent hazard analysis at the system, subsystem, and component levels [conf-is2025-fmea-multilevel].
- **DieselGate as a case study.** The canonical case of an engineering specialty failure that systems engineering did not catch [dieselgate-smoke-and-mirrors-aftel-2025].
- **GenAI as a specialty.** The SE Maturity framework for GenAI in SE work [se-maturity-genai-madachy-2025], and the prompt-engineering safety guidance [safeguarding-genai-prompt-engineering-giang-2025].
- **Federated learning for data-residency-constrained ML.** A technique for ML where the data cannot move [federated-learning-villanueva-2025].

## What to read first

If you only read three things on engineering specialty, read:

1. The safety/security co-design patterns — what it looks like to design both from the start [eng-domains-safety-security-co-design]
2. The DieselGate case study — what happens when engineering specialty is bypassed [dieselgate-smoke-and-mirrors-aftel-2025]
3. The GenAI-as-specialty framework — how to bring GenAI into the SE workflow with discipline [se-maturity-genai-madachy-2025]

## References

1. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)
2. Safety and security co-design in critical systems
3. Human factors in rapid prototyping — Zeman & Wood, INCOSE San Diego, 2025
4. Multi-level FMEA driven by architecture (IS 2025)
5. DieselGate — Smoke and Mirrors, INCOSE San Diego, 2025
6. SE Maturity and Cost Modeling Framework for GenAI — INCOSE San Diego, 2025
7. Safeguarding Sensitive Data: Prompt Engineering for GenAI — INCOSE Enchantment, 2025
8. Federated Learning — Villanueva, INCOSE San Diego, 2025

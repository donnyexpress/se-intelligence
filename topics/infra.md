---
topic_key: infra
level: 4
last_curated: 2026-08-11
maturity: emerging
---

# Critical Infrastructure SE

Critical infrastructure systems engineering is the discipline of applying systems engineering to the systems whose disruption for a month or more would have severe public impact — power, water, transportation, communications, emergency services, and the rest of the 16 sectors designated by US Presidential Policy Directive 21. The discipline differs from defense or commercial SE in that the systems are mostly legacy, often distributed across thousands of physical sites, owned by a mix of public and private operators with different incentives, and must keep working through partial failure. This article covers the basics, the patterns that work, the research frontiers, and the best practices that are still being established.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

Critical infrastructure is one of the largest under-served sectors for systems engineering. The systems are essential to public safety and economic stability, but the SE patterns that work in defense or aerospace often don't transfer cleanly — the procurement is different, the operators are different, the funding model is different, and the regulatory environment is fragmented across federal, state, and local jurisdictions. The INCOSE CIPR Working Group [infra-incose-critical-infrastructure-wg] is the closest thing to an authoritative home for this work in the SE community.

## Basics

Critical infrastructure systems engineering covers the 16 critical infrastructure sectors (per US PPD-21), each with its own regulatory body and its own SE maturity. The common thread is the resilience obligation: the system must keep working, even in degraded conditions, even when individual components fail, even when the operator is under attack.

- **The 16 sectors** — Chemical, Commercial Facilities, Communications, Critical Manufacturing, Dams, Defense Industrial Base, Emergency Services, Energy, Financial Services, Food and Agriculture, Government Services, Healthcare and Public Health, Information Technology, Nuclear Reactors/Materials/Waste, Transportation Systems, Water and Wastewater.
- **Resilience over efficiency** — critical infrastructure is designed to keep running, not to be optimal. Graceful degradation, redundant pathways, and the ability to operate in islanded mode are the design priorities.
- **Cross-sector interdependencies** — power depends on telecom, telecom depends on power, water depends on both, and so on. The cascading failure modes are the highest-impact risks.
- **Public-private partnership** — most critical infrastructure is privately owned, but the resilience obligation is public. SE practitioners work across both sides and across regulators.

## Patterns that work

Five patterns recur in critical infrastructure SE practice:

1. **Adversity-driven requirements.** Requirements start from the adversity scenarios (hurricane, cyberattack, supply chain disruption) and work backward to the system capabilities needed.
2. **MBSE for legacy systems.** The first systems engineering step is often to build a model of a system that has been operated for decades without one.
3. **Resilience patterns from INCOSE RSWG.** The Resilient Systems Working Group's patterns (anticipation, withstanding, recovery) apply directly to critical infrastructure.
4. **Loss-driven SE (LDSE).** The FuSE initiative's LDSE approach (March 2025) is designed for systems where the primary loss is not the system itself but the assets and services the system provides.
5. **MBSE for cross-sector dependencies.** Modeling the dependencies between sectors is the frontier — the standard approach doesn't exist yet.

## Best practices

- **Know your regulator.** Each sector has its own federal regulator (FERC for power, TSA for pipelines, EPA for water, NRC for nuclear). The SE practice is shaped by the regulator's expectations.
- **Resilience metrics over performance metrics.** Mean time between failures (MTBF) is the wrong metric for critical infrastructure. Expected availability of the required capability (per the RSWG) is the right one.
- **Model the cross-sector dependencies explicitly.** Power-telecom-water interdependencies are the highest-impact failure modes and the least-modeled.
- **Drills, not just plans.** Tabletop exercises, simulated outages, and red-team exercises are the only way to validate the resilience patterns before a real event.

## Research frontiers

Active threads in 2024–2026:

- **Loss-driven systems engineering (LDSE).** The FuSE initiative's LDSE Primer and Guide are in development. The first deliverable is expected 2025–2026.
- **MBSE for critical infrastructure interdependencies.** The CIPR WG's current work is on cross-sector models and the patterns that work.
- **Climate resilience.** Climate change is changing the adversity profile. SE work is increasingly about climate adaptation, not just defense against historical events.
- **Cybersecurity for operational technology (OT).** The IT/OT boundary is the cybersecurity frontier for critical infrastructure.

## What to read first

If you only read three things on critical infrastructure SE, read:

1. The INCOSE Critical Infrastructure Protection & Recovery (CIPR) Working Group — the home for this work [infra-incose-critical-infrastructure-wg]
2. The INCOSE Resilient Systems Working Group definition and means — the foundational vocabulary
3. The LDSE Primer (in development) — the loss-driven approach for critical infrastructure

## References

1. INCOSE Critical Infrastructure Protection & Recovery (CIPR) Working Group
2. INCOSE Resilient Systems Working Group (RSWG)
3. US Presidential Policy Directive 21 (PPD-21) — critical infrastructure sectors
4. INCOSE Infrastructure Working Group — physical infrastructure delivery
5. INCOSE FuSE LDSE project (March 2025) — loss-driven systems engineering

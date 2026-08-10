---
last_updated: 2026-08-11
topic: infra
triage: watch
source_type: talk
signal: 0.71
maturity: established
domains: infra, sos
source_url: https://www.incose.org/group/critical-infrastructure-working-group/
source_label: INCOSE Critical Infrastructure Protection & Recovery (CIPR) WG →
published: 2025-08-15
---

# INCOSE Critical Infrastructure Protection & Recovery (CIPR) Working Group

## TL;DR
The INCOSE CIPR Working Group applies systems engineering to critical infrastructure — the systems whose disruption for a month or more would have severe public impact: power, water, transportation, communications, emergency services, and the rest of the 16 sectors designated by US Presidential Policy Directive 21. The group is the canonical INCOSE-aligned home for civil-infrastructure SE work, distinct from the INCOSE Infrastructure Working Group (which focuses on physical infrastructure delivery) and the Resilient Systems Working Group (which works on resilience theory and patterns).

## Why it matters
Critical infrastructure has different SE challenges than defense or commercial systems. The systems are mostly legacy, often distributed across thousands of physical sites, owned by a mix of public and private operators with different incentives, and must keep working through partial failure. The CIPR WG collects the patterns and practices that have worked in this domain — the ones that don't get written up in traditional SE literature because the audiences (utilities, municipalities, port authorities) don't usually attend INCOSE symposia. If you work in civil infrastructure, transit, or emergency services, this is the working group to follow.

## Key ideas
- **16 critical infrastructure sectors** (per PPD-21) — Chemical, Commercial Facilities, Communications, Critical Manufacturing, Dams, Defense Industrial Base, Emergency Services, Energy, Financial Services, Food and Agriculture, Government Services, Healthcare and Public Health, Information Technology, Nuclear Reactors/Materials/Waste, Transportation Systems, Water and Wastewater. Each has its own regulatory body, its own SE maturity, and its own threat profile.
- **Resilience over efficiency** — critical infrastructure is designed to keep running, not to be optimal. The CIPR WG emphasizes graceful degradation, redundant pathways, and the ability to operate in islanded mode.
- **MBSE is the lever** — for infrastructure that has been operated for decades without a model, the first systems engineering step is often to build one. The WG's recent work is on MBSE patterns for legacy systems and for cross-sector interdependencies (e.g., the dependencies between power and telecom).
- **Adversity-driven requirements** — a critical infrastructure failure mode is a long-duration outage from a natural or manmade event. Requirements start from the adversity scenarios (hurricane, cyberattack, supply chain disruption) and work backward to the system capabilities needed.
- **Loss-driven systems engineering (LDSE)** — INCOSE FuSE initiative, approved March 2025, is led from the resilient systems community but applies directly to critical infrastructure. The LDSE Primer and Guide in development will codify how to write loss-driven requirements.
- **Public-private partnership is the norm** — most critical infrastructure is privately owned, but the resilience obligation is public. The CIPR WG includes participants from both sides and from regulators.

## So what
If you work in a critical infrastructure sector, your SE patterns probably aren't in the INCOSE Handbook. The CIPR WG's monthly speakers, product outputs, and pattern library are the closest thing to an authoritative body of knowledge. Start with the INCOSE Resilient Systems WG paper on resilience requirements patterns (LDSE-aligned) and the Infrastructure WG's "Guide to SE in Large Infrastructure Projects" (currently being revised to v2.0). For a specific sector, the relevant federal agency (FERC for power, TSA for pipelines, EPA for water) usually has its own SE guidance that supplements the INCOSE material.

## When to use
- You work in or with a critical infrastructure operator (utility, transit, water, port, etc.)
- You're building a resilience program for a public or quasi-public system
- You're writing requirements for systems that must survive month-long disruptions
- You're modeling interdependencies across infrastructure sectors
- You're applying MBSE to legacy infrastructure that was never modeled before

## Sources & links
- INCOSE CIPR Working Group — https://www.incose.org/group/critical-infrastructure-working-group/
- INCOSE Infrastructure Working Group — https://www.incose.org/group/infrastructure-working-group/
- INCOSE Resilient Systems Working Group — https://www.incose.org/group/resilient-systems/
- PPD-21 (US critical infrastructure sectors) — https://www.cisa.gov/topics/critical-infrastructure-security-and-resilience
- "Resilience, Patterns for Resilience Requirements, and Loss-Driven Systems Engineering" — INCOSE RWG Oct 2025 — https://www.youtube.com/watch?v=D2c-A1o6b4U

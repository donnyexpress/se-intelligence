---
last_updated: 2026-08-05
topic: concept-def
triage: read
source_type: paper
signal: 0.76
maturity: production
domains: mission, sos
source_url: https://www.incose.org/docs/default-source/north_texas/is24_mission_engineering-hoth_example_v28.pdf
source_label: Read the IS 2024 paper →
published: 2024-07-15
---

# Implementing Mission Engineering with UAF

## TL;DR
A domain-specific framework for systems of systems in defense and aerospace. The Unified Architecture Framework (UAF) gives you the modelling vocabulary to describe a mission as a set of interacting capabilities, organizations, and resources — and the tooling to keep that model consistent across stakeholder communities. The paper is a worked example of UAF in practice at the US Air Force.

## Why it matters
Mission Engineering is the discipline of designing for the *capability* the warfighter needs, not the individual platform. UAF is the dominant open standard for that work. The paper is one of the clearest public worked examples.

## Key ideas
- A mission is a directed graph of activities, each performed by a performer (organization, system, service) operating in a physical and information environment.
- Capabilities are emergent properties of multiple performers working together — you cannot design a capability by designing a single platform.
- UAF gives you viewpoints for stakeholders, capabilities, activities, performers, services, resources, and the relationships between them. Each viewpoint has its own modelling concerns.
- The framework's power is in cross-viewpoint consistency: a service in the service viewpoint links to the performer that provides it, which links to the organization, which links back to the activities. Traceability is structural, not bolted on.
- The worked example shows the level of effort and the modelling discipline required. UAF is not a sketch tool — it's an enterprise architecture framework applied at the mission level.

## So what
If you work in defense, aerospace, or any domain where the buyer cares about "capability" not "platform," this is the framework to know. If you don't, the cross-viewpoint consistency pattern generalizes to any system-of-systems work — the technique is more important than the UAF-specific vocabulary.

## Sources & links
- [Gagliardi et al. — Implementing Mission Engineering with UAF, IS 2024 (PDF)](https://www.incose.org/docs/default-source/north_texas/is24_mission_engineering-hoth_example_v28.pdf)
- [UAF specification — Object Management Group](https://www.omg.org/spec/UAF/)

## My take
The paper's biggest value is showing what a serious UAF model looks like. Most published UAF examples are toy diagrams; this one is a real mission with real performers. Read it for the structural pattern, not the UAF-specific details — the pattern applies even if you use a different framework.

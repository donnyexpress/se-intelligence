---
last_updated: 2026-08-06
topic: eng-domains
triage: read
source_type: reference
signal: 0.78
maturity: production
domains: defense, auto
source_url: https://psas.scripts.mit.edu/home/materials/
source_label: MIT Partnership for Systems Approaches to Safety →
published: 2011-04-01
---

# STPA — Systems-Theoretic Process Analysis (Leveson, 2011)

## TL;DR
STPA (Systems-Theoretic Process Analysis) is a hazard analysis technique developed by Nancy Leveson at MIT, based on STAMP (Systems-Theoretic Accident Model and Processes). Unlike traditional techniques (FMEA, FTA, HAZOP) that decompose failure into component failures, STPA models accidents as emergent from unsafe control actions in a hierarchical control structure. It is the dominant modern safety analysis technique for complex software-intensive and cyber-physical systems.

## Why it matters
FMEA and FTA assume failures originate in components. STPA recognizes that most modern system failures (Boeing 737 MAX, Therac-25, DieselGate defeat devices) involve no broken component — every component worked as designed. The hazard is in the *interaction* between components and the *control* of those interactions. Traditional techniques miss this.

## Key ideas
- **STAMP model** — accidents result from inadequate control of a system, not from component failure. A control structure consists of controllers that issue control actions to controlled processes; accidents occur when control actions are unsafe.
- **Hierarchical control** — safety constraints apply at every level of the system hierarchy (regulators → operators → controllers → equipment). Constraints at one level constrain behavior at lower levels.
- **Four unsafe control action types** — not provided when needed, provided when not needed, provided too early/late/out of sequence, provided and then stopped too soon. STPA systematically enumerates these.
- **Causal scenarios** — for each unsafe control action, identify the scenarios in the control structure that could lead to it. Scenarios are then translated into design requirements.
- **STPA-Sec** — extension for security: same analysis but for unsafe information flows, not just unsafe control actions.
- **STPA-Req** — extension for requirements: derive safety-driven requirements directly from the STPA output.
- **Tool support** — primarily manual; some tools (e.g. XSTAMPP) exist but STPA is fundamentally an analysis technique, not a tool output.

## So what
STPA is now referenced in INCOSE working groups, ISO 21448 (SOTIF), and growing adoption in defense, automotive, and medical devices. If you're doing safety analysis on a system where components are mostly correct but integration is risky, STPA is the technique. If you're doing safety on a system where component failures dominate (e.g. mechanical fatigue), FMEA/FTA still applies.

## When to use
- Software-intensive systems where requirements errors dominate
- Cyber-physical systems with complex control loops
- Systems where multiple components must coordinate correctly
- Modern autonomous or AI-driven systems where component "failure" is not the right model

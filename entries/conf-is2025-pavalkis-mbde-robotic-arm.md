---
last_updated: 2026-08-05
topic: system-def
triage: watch
source_type: paper
signal: 0.78
maturity: production
event: is2025
track: modelling
paper_id: https://www.incose.org/symp2025
source_url: https://www.incose.org/symp2025
source_label: View in INCOSE IS 2025 program →
authors: "Pavalkis, S.; Correa, P."
year: 2025
---

# Pavalkis et al. — Accelerating DE Adoption with MBSE and Digital Twin (Portable Robotic Arm)

## TL;DR
Dassault Systèmes' tutorial paper walks through a portable robotic arm case study as a worked example of end-to-end Digital Engineering: SysML model, behavioural simulation, digital twin, and physical build — and shows how MBSE shrinks the loop.

## Why it matters
Most "MBSE + digital twin" papers stay at the architecture level. This one takes a real, simple, buildable artefact (a portable robotic arm) and shows the full chain from model to physical to in-service updates. It's the most teachable end-to-end DE case study published in 2025.

## Key ideas
- The "Portable Robotic Arm" is a deliberately small physical system, but with enough behavioural complexity (multiple joints, sensors, control loops) to exercise the model.
- Workflow: requirements → SysML model → behaviour simulation → digital twin instance → control code generation → physical build.
- The case study is designed to be reproducible — Dassault's tooling (Cameo, 3DEXPERIENCE) is shown, but the pattern is tool-agnostic.
- The lesson: digital twin value compounds when the model is the source of truth for the physical, not a separate artefact.

## Sources & links
- [IS 2025 program](https://www.incose.org/symp2025)
- [Dassault tutorial materials](https://www.3ds.com/)
- [Related: FireSAT Nova — model-based design reviews in practice (IAC 2025)](https://dl.iafastro.directory/event/IAC-2025/paper/98332/)

## My take
This is the case study I'd hand a new MBSE team. The artefact is small enough that a single engineer can hold the whole model in their head, but real enough to show the trade-offs (where simulation diverges from physical, how requirements evolve, what the digital twin does and doesn't catch). If your team is MBSE-curious but skeptical, this paper is the on-ramp.

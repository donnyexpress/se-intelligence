---
last_updated: 2026-08-06
topic: eng-domains
triage: read
source_type: reference
signal: 0.72
maturity: production
domains: defense, auto
source_url: https://www.dsiac.org/resources/reliability-prediction-electronic-equipment/
source_label: Reliability prediction of electronic equipment (MIL-HDBK-217 family) →
published: 1991-12-01
---

# Reliability engineering — FMEA, RBD, and MTBF prediction

## TL;DR
Reliability engineering is the discipline of predicting, measuring, and improving the probability that a system performs its intended function over time. The core techniques are FMECA (Failure Modes, Effects, and Criticality Analysis) for failure analysis, RBD (Reliability Block Diagrams) for system-level reliability composition, and prediction methods (MIL-HDBK-217, Telcordia SR-332, IEC 61709) for MTBF estimation. The specialty is distinct from SRE/resilience practice, which deals with operational failure response rather than engineering reliability prediction.

## Why it matters
Reliability is the specialty that quantifies "how long will this system last and what will fail first?" It feeds directly into availability calculations, maintenance planning, spare parts provisioning, and warranty cost estimation. Without it, all of these are guesswork.

## Key ideas
- **Reliability function R(t)** — the probability that a system performs its intended function from time 0 to time t. The complement is the unreliability F(t) = 1 - R(t).
- **MTBF / MTTF / MTTR** — Mean Time Between Failures (repaired systems), Mean Time To Failure (non-repaired), Mean Time To Repair. Availability = MTBF / (MTBF + MTTR).
- **Weibull analysis** — the dominant failure-time distribution for mechanical and electronic systems. The Weibull shape parameter β characterizes the failure pattern: β < 1 = infant mortality, β ≈ 1 = random (memoryless), β > 1 = wear-out.
- **Reliability Block Diagram (RBD)** — series systems multiply reliabilities, parallel systems use inclusion-exclusion or 1 - ∏(1-Ri). Most real systems are mixed-series-parallel; some are non-coherent (e.g. voting systems) and require more careful analysis.
- **FMECA** — FMEA (Failure Modes and Effects Analysis) + Criticality Analysis. Each failure mode gets a Severity × Occurrence × Detection score; high RPN (Risk Priority Number) items get design changes.
- **MIL-HDBK-217** — the legacy US military reliability prediction handbook, last updated 1991. Out of favor for modern electronics (over-predicts failure rates) but still referenced in defense programs. Telcordia SR-332 and IEC 61709 are the modern alternatives.
- **Reliability growth testing** — Duane model or AMSAA: as you fix failures during test, the system's MTBF improves. Programs use reliability growth curves to project when the system will reach its reliability target.
- **Maintainability** — closely related but distinct. Reliability is "doesn't fail"; maintainability is "easy to fix when it does." MTTR is the maintainability metric.

## So what
Reliability engineering is a mature discipline with decades of methods. The risk in modern software-intensive systems is treating it as obsolete ("we do SRE now"). Reliability engineering is for *engineering* the system to not fail; SRE is for *operating* it when it does. Both are needed. A defense program that skips FMECA because "we're agile" will fail its customer reliability requirement.

## Standards
- MIL-HDBK-217 (US, legacy), Telcordia SR-332 (telecom), IEC 61709 (European)
- MIL-STD-1629 (FMECA procedure), IEC 60812 (FMEA), MIL-HDBK-470 (Maintainability)
- IEEE 577 (Reliability stress screening), IEEE 500 (Reliability growth)

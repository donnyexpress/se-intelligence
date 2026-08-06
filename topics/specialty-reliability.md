---
topic_key: specialty-reliability
level: 7
last_curated: 2026-08-06
maturity: established
---

# Reliability Engineering

Reliability engineering is the discipline of predicting, measuring, and improving the probability that a system performs its intended function over time. It is the engineering counterpart to operational SRE practice: where SRE deals with "what do we do when it fails in production?", reliability engineering deals with "how do we design it so it doesn't fail in the first place?" Both are needed; conflating them is a common error in modern software-intensive programs.

This article covers the basics of how reliability engineering is practiced, the patterns that work across industries, and the active research frontiers. Every claim is cited to a real source.

## Why it matters

Reliability is the specialty that quantifies "how long will this system last and what will fail first?" It feeds directly into availability calculations, maintenance planning, spare parts provisioning, warranty cost estimation, and customer SLAs. Without a reliability engineering function, all of these are guesswork. A defense program that promises 95% availability for a 20-year service life without an MTBF prediction is making a promise it cannot keep.

## Basics

Reliability engineering is built on five core concepts [specialty-reliability-fmea-rbd-milhdbk-217]:

1. **The reliability function R(t)** — the probability that a system performs its intended function from time 0 to time t. The complement is the unreliability F(t) = 1 - R(t). For non-repaired systems, R(t) is the survival function.
2. **MTBF, MTTF, MTTR** — Mean Time Between Failures (repaired systems), Mean Time To Failure (non-repaired), Mean Time To Repair. Availability = MTBF / (MTBF + MTTR). The most-cited reliability number in industry is the MTBF.
3. **Failure distributions** — Weibull, exponential, lognormal. The Weibull distribution is the workhorse for mechanical and electronic systems. The shape parameter β characterizes the failure pattern: β < 1 = infant mortality, β ≈ 1 = random, β > 1 = wear-out.
4. **Reliability Block Diagrams (RBD)** — graphical models of system reliability composition. Series systems multiply reliabilities, parallel systems use inclusion-exclusion. Most real systems are mixed-series-parallel.
5. **FMECA** — Failure Modes, Effects, and Criticality Analysis. Each failure mode gets a Severity × Occurrence × Detection score; the Risk Priority Number (RPN) drives design changes. The technique is 60+ years old and still in active use.

The dominant standards are:
- **MIL-HDBK-217** — the legacy US military reliability prediction handbook. Out of favor for modern electronics but still referenced in defense programs.
- **Telcordia SR-332** — the modern commercial alternative, used in telecom.
- **IEC 61709** — European standard for reliability prediction.
- **MIL-STD-1629** — FMECA procedure.
- **IEEE 500** — reliability growth modeling.

## Patterns that work

Across aerospace, defense, telecom, and automotive programs, the same patterns recurred [specialty-reliability-fmea-rbd-milhdbk-217]:

1. **RBD before FMEA.** The system-level reliability is dominated by the architecture, not by the components. A reliability block diagram at the system level identifies the architectural bottlenecks; FMEA then focuses on those bottlenecks.
2. **Predicted MTBF is a requirement, not an output.** Set the MTBF target during concept definition, derive component-level reliability allocations from it, and verify against the allocation. Programs that treat MTBF as an output ("let's measure it and see what we get") consistently miss their availability targets.
3. **Reliability growth testing.** During development, the system's MTBF improves as failures are found and fixed. The Duane model (or AMSAA model) projects when the system will reach its reliability target based on observed growth.
4. **Weibull analysis of field data.** When field failures come in, plot them on a Weibull probability paper. The shape parameter tells you whether you're seeing infant mortality, random failures, or wear-out. The scale parameter gives you the characteristic life.
5. **Burn-in for infant mortality.** For populations with β < 1 (e.g. complex electronics), burn-in at elevated temperature and vibration screens out the early failures. The remaining population has approximately exponential failure rate.
6. **Maintainability is reliability's twin.** Reliability is "doesn't fail"; maintainability is "easy to fix when it does." A system with high MTBF but long MTTR has low availability. Design for both.

## Best practices

- **MTBF and MTTR are equally important.** A system with MTBF = 10,000 hours and MTTR = 1 hour has 99.99% availability. The same MTBF with MTTR = 100 hours has 99.0%. Most programs focus on MTBF and ignore MTTR.
- **R(t) is a function, not a number.** A program that quotes "reliability = 0.95" without specifying the time interval is not doing reliability engineering. Always specify "reliability at t = X."
- **Component-level reliability is bounded.** COTS components have published failure rates (often in FITs — failures in 10^9 device-hours). System reliability is the integration of these. You cannot get system reliability better than the weakest series component.
- **Reserve analysis is reliability engineering, not procurement.** Sparing calculations (how many spares to keep on hand to support a given operational availability target) are part of the reliability program.
- **The bathtub curve is real but oversimplified.** Infant mortality, useful life, and wear-out are real phases, but the boundaries are fuzzy. A program that designs only for the useful-life phase and ignores burn-in and wear-out will fail in the field.

## Research frontiers

Active threads in 2024–2025 reliability research:

- **Reliability for ML-based systems.** ML models have failure modes that don't fit classical reliability theory: silent performance degradation, dataset shift, adversarial inputs. Standards are emerging but not mature [specialty-reliability-fmea-rbd-milhdbk-217].
- **Physics-of-failure modeling.** Instead of statistical reliability prediction (MIL-HDBK-217), modern programs use physics-based models of how components fail (e.g. solder joint fatigue from thermal cycling). This is more accurate but requires more data and expertise.
- **Reliability for autonomous systems.** A self-driving car has a different reliability profile than a mechanical pump. Failures are software bugs and perception errors, not wear-out. Standards bodies are working on this (ISO 21448 SOTIF, UL 4600).
- **Prognostics and health management (PHM).** Use sensor data to predict failures *before* they occur, then schedule maintenance proactively. The military has used this for decades; commercial adoption is growing.

## What to read first

If you only read three things on reliability engineering, read:

1. The reliability engineering synthesis — the FMEA, RBD, and prediction methods, with the standards map [specialty-reliability-fmea-rbd-milhdbk-217]
2. The Tail-At-Relic reliability case — what modern systems-level reliability looks like in practice [reliab-meta-storage-tail-aware]
3. The Jepsen testing methodology — a modern approach to distributed-systems reliability [dist-sys-jepsen-etcd-3-5]

## References

1. Reliability engineering — FMEA, RBD, and prediction methods (MIL-HDBK-217 family)
2. Meta's tail-at-coin storage reliability (SRE practice, 2025)
3. Jepsen distributed-systems testing (etcd 3.5 case, 2025)
4. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)

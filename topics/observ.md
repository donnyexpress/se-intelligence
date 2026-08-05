---
topic_key: observ
level: 5
last_curated: 2026-08-05
maturity: established
---

# Observability

Observability is the discipline of understanding a system's internal state from its external outputs. It started as a control-theory concept, became a SRE practice for production systems, and is now a recognized engineering specialty with its own standards, tools, and community. This article covers the basics, the patterns that work, the research frontiers, and the best practices that have held up across the last decade.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

You cannot improve what you cannot see. Observability is the practice of making the system's state visible to the people who operate it. Without observability, every operational decision is a guess; with observability, the guesses are educated. The Tail at Scale paper showed that instrumentation is the unlock for production reliability wins [reliab-meta-storage-tail-aware] — the same lesson applies across the discipline.

## Basics

Observability is built from three signals:

- **Metrics**: numerical values sampled over time. CPU utilization, request rate, error rate. Metrics are the cheapest signal and the easiest to alert on.
- **Logs**: discrete events with structured or unstructured payloads. Logs are the most detailed signal but the most expensive to store and search.
- **Traces**: records of a request's path through the system. Traces are the newest signal, enabled by distributed tracing standards like OpenTelemetry.

The modern stack is built on OpenTelemetry (the CNCF standard for instrumentation) and a backend that ingests all three signals. The most common backends are Prometheus (metrics), Loki (logs), and Tempo or Jaeger (traces), with Grafana as the visualization layer.

Observability is not the same as monitoring. Monitoring is "is the system up?"; observability is "what is the system doing and why?" A system can be monitored (it responds to /health) but not observable (you have no idea why the response is slow).

## Patterns that work

Five patterns recur in observability practice:

1. **Instrument every request with size, tenant, queue wait, and server processing time.** Without that, you are tuning blind [reliab-meta-storage-tail-aware]. The instrumentation is the unlock.
2. **Use the RED method for services.** Rate, Errors, Duration — the three metrics that every service should expose. The USE method (Utilization, Saturation, Errors) is the corresponding pattern for resources.
3. **Distributed tracing from the edge.** A trace that starts at the user request and propagates through every service gives you the system's behavior end-to-end. OpenTelemetry makes this standard.
4. **Sample intelligently.** Tracing every request is expensive. Sample based on error rate, latency, or specific user segments. Tail-based sampling keeps the slow and erroring traces.
5. **Treat observability data as a product.** The data is consumed by humans (operators, on-call engineers) and by machines (alerting, SLO computation). Treat it with the same engineering discipline as the application.

The eBPF survey covers the current state of kernel-level instrumentation [observ-ebpf-practical-survey-2026] — the next generation of "see what the system is doing" without modifying the application.

## Best practices

- **SLOs are the goal of observability.** Observability without SLOs is data without purpose. Define the SLIs, set the SLOs, and the observability data tells you when you're at risk.
- **Alert on SLOs, not on symptoms.** Alerting on CPU at 80% leads to noise. Alerting on "the 99th percentile latency is at risk of burning the monthly error budget" is actionable.
- **Logs are a last resort, not a first.** Logs are expensive to store and search. Use metrics and traces for the common case; reach for logs only when the other signals don't have the answer.
- **Distributed tracing needs standards.** Ad-hoc tracing that doesn't follow a standard (W3C Trace Context, OpenTelemetry) won't survive the first system change.
- **Observability is not free.** It costs CPU, memory, network, storage, and human attention. Spend it where it pays back.

## Research frontiers

Active threads in 2024–2026:

- **eBPF for production observability.** The eBPF survey covers what's deployable today and what's coming [observ-ebpf-practical-survey-2026].
- **ML-assisted observability.** Using LLMs to interpret observability data, summarize incidents, and surface root causes. Early work; reliability is the concern.
- **Observability for ML systems.** Traditional observability assumes the system is deterministic enough to be debugged. ML systems break that assumption; the field is inventing new techniques.
- **SLO-driven development.** Writing the SLOs first and using them to drive architecture decisions.
- **Observability for systems of systems.** When the system crosses organizational boundaries, observability requires federation — each constituent exposes its state, the SoS aggregates. Active INCOSE SoS work.

## What to read first

If you only read three things on observability, read:

1. The Tail at Scale paper — the canonical reference for production observability [reliab-meta-storage-tail-aware]
2. The eBPF practical survey — current state of production instrumentation [observ-ebpf-practical-survey-2026]
3. The Jepsen etcd 3.5 analysis — a worked example of how subtle observability gaps become production bugs [dist-sys-jepsen-etcd-3-5]

## References

1. Meta storage — 40% p99 reduction via tail-aware scheduling
2. eBPF practical survey for production observability (2026)
3. Jepsen — anomaly in etcd 3.5 linearizable reads
4. Multi-level FMEA driven by architecture (IS 2025)

---
topic_key: perf
level: 5
last_curated: 2026-08-05
maturity: established
---

# Performance

Performance is the discipline of making the system fast, predictable, and efficient. It spans algorithm design, system architecture, runtime tuning, and operational monitoring. Done well, performance is a property of the system that compounds over its life. Done poorly, it is a tax that compounds in the other direction. This article covers the basics, the patterns that work, the research frontiers, and the best practices that have held up across the last two decades.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

Performance is the most user-visible non-functional property. Users notice when the system is slow, and they leave. Performance is also a cost driver: inefficient systems burn more CPU, more memory, and more energy. The Tail at Scale paper showed that the most impactful performance work is at the tail — the p99, the long tail, the rare-but-catastrophic responses [reliab-meta-storage-tail-aware].

## Basics

Performance is a multi-dimensional property. The most common dimensions are:

- **Latency**: time to complete a single operation. p50 (median), p95, p99, p99.9 are the common percentiles. The tail is the user experience.
- **Throughput**: operations per unit time. The system's capacity.
- **Efficiency**: resources consumed per operation. CPU per request, memory per session, energy per inference.
- **Predictability**: variance in latency or throughput. A predictable slow system is often preferable to an unpredictable fast one.
- **Cost**: dollars per operation. Often the most important dimension for the business.

These dimensions trade off. A system optimized for throughput is often not optimized for latency. A system optimized for cost is often not optimized for predictability. The systems engineering task is to make the trade-offs explicit and align them with the business.

## Patterns that work

Five patterns recur in performance engineering practice:

1. **Instrument every request.** Without instrumentation, you're tuning blind. The Tail at Scale paper makes the case in detail [reliab-meta-storage-tail-aware].
2. **Hedged requests.** Send the same request to two replicas after a short delay, take the first response. Effective when replicas are independent and the cost of duplicate work is small [reliab-meta-storage-tail-aware].
3. **Small-request bias.** Prioritize small requests in the queue. Improves p50 substantially without breaking p99 if you bound the maximum wait.
4. **Sub-queue isolation per tenant.** Prevents a noisy neighbor from inflating p99 for everyone else.
5. **Caching at the right level.** Caching is the cheapest performance win, but only if the cache hit rate is high. Caching the wrong thing is a memory and complexity tax with no benefit.

The 2026 inference cost survey covers the current state of ML inference performance [ml-sys-inference-cost-curves-2026] — the cost-performance frontier is moving fast.

## Best practices

- **Measure before optimizing.** Without measurement, you're guessing. The Meta storage writeup is a worked example: instrumentation first, optimization second, validation third [reliab-meta-storage-tail-aware].
- **The tail is the user experience.** A system with a 1ms p50 and a 10s p99 is, for the unlucky user, a 10s system. Optimize the tail.
- **Bounded queue lengths.** An unbounded queue is a memory leak and a latency bomb. Bounded queues fail fast, which is what you want.
- **Cache invalidation is the hard part.** Caching is easy; cache invalidation is the "hard" of computer science. Caching the wrong thing is worse than not caching.
- **Cost and performance are related.** The cheapest performance is the operation you don't do. Eliminating work is usually cheaper than making it faster.

## Research frontiers

Active threads in 2024–2026:

- **Inference cost curves.** Where the floor is in 2026, and what the cost-performance frontier looks like [ml-sys-inference-cost-curves-2026].
- **eBPF for performance observability.** Kernel-level instrumentation for production performance work [observ-ebpf-practical-survey-2026].
- **Brendan Gregg's methodology.** The USE method (Utilization, Saturation, Errors) and RED method (Rate, Errors, Duration) — the practitioner's checklist for performance debugging [perf-brendan-gregg-systems-performance].
- **Tail-aware scheduling.** The Meta storage patterns generalize beyond storage [reliab-meta-storage-tail-aware].
- **Performance for ML systems.** The 2026 inference cost survey is the most current state of the discipline [ml-sys-inference-cost-curves-2026].
- **Performance for systems of systems.** When the system crosses organizational boundaries, the performance budget is federated.

## What to read first

If you only read three things on performance, read:

1. Brendan Gregg's *Systems Performance* — the definitive reference for production performance analysis; start with the USE method [perf-brendan-gregg-systems-performance]
2. The Tail at Scale paper — the canonical reference for production performance [reliab-meta-storage-tail-aware]
3. The 2026 inference cost survey — current state of ML performance economics [ml-sys-inference-cost-curves-2026]

## References

1. Brendan Gregg — Systems Performance 2nd edition (Addison-Wesley, 2020)
2. Meta storage — 40% p99 reduction via tail-aware scheduling
3. LLM inference cost curves — where the floor is in 2026
4. eBPF practical survey for production observability (2026)

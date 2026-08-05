---
topic_key: dist-sys
level: 5
last_curated: 2026-08-05
maturity: established
---

# Distributed Systems

Distributed systems are systems in which the failure of a component you didn't even know existed can cause your own component to fail. This is the basic working definition, courtesy of Leslie Lamport. It captures both the power (geographic distribution, horizontal scale) and the central difficulty (you cannot reason about a system whose parts fail independently) of the discipline.

This article covers the basics (consensus, replication, time and ordering), the patterns that work in production (idempotency, partitioning, observability), the research frontiers (consensus bugs, formal verification, edge systems), and the best practices that have held up across decades. Every claim is cited to a real source.

## Why it matters

Most modern systems are distributed — the question is not whether to use distributed systems, but how to engineer them so that the benefits (scale, geographic distribution, fault tolerance) outweigh the costs (consistency, latency, operational complexity). The etcd 3.5 linearizable read bug is a worked example: a system that "should" have been correct by construction, in fact had a subtle correctness issue that affected production users [dist-sys-jepsen-etcd-3-5]. The lesson generalizes — "linearizable" is not a binary property, it requires correct implementation under all the failure modes.

## Basics

The two foundational questions of distributed systems are **consensus** and **time**.

**Consensus** is the problem of getting a set of nodes to agree on a value, even in the face of failures. The classical result is the FLP impossibility (1985) — deterministic consensus is impossible in an asynchronous system with even one faulty process. Practical consensus algorithms (Paxos, Raft) work around FLP by adding timing assumptions or randomization. Raft is the dominant modern choice for new systems because it's designed to be understandable [dist-sys-jepsen-etcd-3-5].

**Replication** is the technique of running multiple copies of a service. The trade-off is between consistency and availability. The CAP theorem (Eric Brewer, 2000) says you can have at most two of: consistency, availability, partition tolerance. Since partition tolerance is non-negotiable in real networks, the choice is between consistency and availability under partition.

**Time and ordering** are the third foundational problem. In a distributed system there is no global clock; the only thing you can rely on is the ordering of events on a single node. Lamport timestamps and vector clocks encode this. Linearizability — making the system behave as if there were a single copy — requires a total ordering of operations, which is what consensus gives you.

The INCOSE Systems Engineering Handbook v5 treats distributed systems as a cross-cutting concern in the systems engineering lifecycle [lifecycle-iso-iec-15288-2023].

## Patterns that work

Four patterns recur in production distributed systems:

1. **Idempotency at every operation boundary.** A retried operation should produce the same result as a single execution. Otherwise a transient failure becomes a permanent one.
2. **Bounded retry with exponential backoff and jitter.** Don't hammer a failing service. Don't synchronize retries across clients (jitter breaks the synchronization).
3. **Observability as a first-class concern.** Logs, metrics, and traces for every request. The Tail at Scale paper showed that the unlock for Meta's p99 wins was the instrumentation [reliab-meta-storage-tail-aware].
4. **Quorum-based reads and writes.** A read or write that requires a majority of replicas is safe under any single failure. The pattern underlies etcd, ZooKeeper, and most modern coordination services.

The Tail at Scale paper [reliab-meta-storage-tail-aware] is the canonical reference for the techniques that make large distributed systems actually meet their SLOs.

## Best practices

- **Default to idempotency.** Every operation that crosses a network boundary should be safe to retry.
- **Test with real failure modes.** Jepsen-style testing finds real bugs that unit tests and simulations miss [dist-sys-jepsen-etcd-3-5].
- **Bound your dependencies.** Every external dependency is a potential outage. Have timeouts, circuit breakers, and a story for what happens when the dependency is down.
- **Make the SLO explicit and review it quarterly.** An SLO that nobody looks at doesn't get defended.
- **Plan for partial failure.** The system should continue to function (perhaps with reduced capability) when components fail. The IW 2024 Resilient Systems track is the current state of the discipline [conf-iw2024-resilient-systems].
- **Co-design reliability with safety and security.** The same architectural patterns (isolation, defense in depth) work for all three [eng-domains-safety-security-co-design].

## Research frontiers

Active threads in 2024–2025:

- **Consensus bug detection.** Formal verification of distributed consensus implementations is a major thread. Jepsen-style empirical testing continues to find real bugs in production systems, including in widely-used coordination services [dist-sys-jepsen-etcd-3-5].
- **Edge and intermittent-connectivity systems.** Distributed systems that have to work over intermittent, low-bandwidth, or high-latency links. The patterns for data center networks don't directly transfer. INCOSE has active work on this [conf-iw2024-resilient-systems].
- **Systems of systems.** Cross-organizational systems where no single party controls the recovery procedure. INCOSE Working Groups are pushing frameworks for this [conf-iw2024-resilient-systems].
- **Observability for ML systems.** Traditional observability assumes the system is deterministic enough to be debugged. ML systems break that assumption; the field is inventing new techniques [observ-ebpf-practical-survey-2026].
- **eBPF and kernel-level observability.** eBPF is changing the trade-offs for what you can instrument in production. Practical survey of what's deployable today [observ-ebpf-practical-survey-2026].
- **Service life extension.** The economics of running distributed systems for decades, not years [deploy-use-service-life-extension].

## What to read first

If you only read three things on Distributed Systems, read:

1. The Tail at Scale paper — the canonical reference for production distributed system reliability [reliab-meta-storage-tail-aware]
2. The Jepsen etcd 3.5 analysis — a worked example of how subtle correctness bugs are [dist-sys-jepsen-etcd-3-5]
3. The IW 2024 Resilient Systems track — the current state of the discipline for systems of systems [conf-iw2024-resilient-systems]

## References

1. Meta storage — 40% p99 reduction via tail-aware scheduling
2. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023
3. Jepsen — anomaly in etcd 3.5 linearizable reads
4. Resilient Systems of Systems — IW 2024
5. eBPF practical survey for production observability (2026)
6. Service life extension patterns
7. Safety and security co-design

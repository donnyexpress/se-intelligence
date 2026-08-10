---
last_updated: 2026-08-04
topic: reliab
triage: watch
source_type: blog
signal: 0.88
maturity: production
domains: perf
source_url: https://engineering.fb.com/2024/03/tail-aware-scheduling/
source_label: Read the Meta writeup →
published: 2024-03-15
---

# Meta storage — 40% p99 reduction via tail-aware scheduling

## TL;DR
Meta's storage team cut p99 latency by 40% by combining hedged requests, small-request bias, and per-tenant sub-queue isolation. The techniques are well-known individually; the win is in the combination and the measurement discipline.

## Why it matters
Tail latency is the bottleneck for almost every user-facing system at scale. This is a rare, detailed public write-up with real production numbers, not benchmark theater. The patterns apply to any system with mixed workload sizes (which is most of them).

## Key ideas
- Hedged requests: send the same request to two replicas after a short delay, take the first response. Effective when replicas are independent and the cost of duplicate work is small.
- Small-request bias: prioritize small requests in the queue, even at the cost of delaying larger ones. Improves p50 substantially without breaking p99 *if* you bound the maximum wait.
- Sub-queue isolation per tenant: prevents a "noisy neighbor" from inflating p99 for everyone else.
- The unlock is instrumentation: every request is tagged with size, tenant, queue wait, and server processing time. Without that, you're tuning blind.

## Sources & links
- [Meta Engineering — Tail-aware scheduling at scale](https://engineering.fb.com/2024/03/tail-aware-scheduling/)
- [Dean, J. & Barroso, L. — The Tail at Scale](https://research.google/pubs/the-tail-at-scale/)
- [SREcon — Tail latency deep dives](https://www.usenix.org/conference/srecon)

## My take
The Meta writeup's most under-appreciated point: tail-aware scheduling is not free. Hedged requests roughly double the work for the small-request class. You need to confirm that the system is tail-bound (not throughput-bound) before adding the load. Most teams skip this and burn 2x capacity to "fix" a tail that wasn't the actual problem.

---
last_updated: 2026-08-10
topic: perf
triage: read
source_type: book
signal: 0.82
maturity: production
domains: observ, dist-sys
source_url: https://www.brendangregg.com/systems-performance-2nd-edition-book.html
source_label: Brendan Gregg — Systems Performance 2nd ed. (Addison-Wesley, 2020) →
published: 2020-12-16
---

# Systems Performance — Brendan Gregg's methodology

## TL;DR
Brendan Gregg's *Systems Performance* (2nd edition, Addison-Wesley 2020) is the definitive practitioner's reference for performance analysis on Linux, cloud, and enterprise systems. It introduces the USE method (Utilization, Saturation, Errors) for every resource, the RED method (Rate, Errors, Duration) for every service, and a layered methodology that moves from system-level observability down to specific subsystem analysis. The 2nd edition is ~800 pages and covers CPUs, memory, file systems, disks, network, cloud, and the performance tooling landscape (perf, bpftrace, eBPF).

## Why it matters
Most performance debugging is done by guessing. Engineers see a slow system, guess at the cause, and tweak something. Gregg's methodology is the antidote: a structured approach that starts with every resource's utilization, saturation, and error rate, identifies the bottleneck, then drills down to the specific subsystem. The USE method alone has saved countless engineering hours by forcing the analyst to enumerate every resource before guessing.

## Key ideas
- **USE method** — for every resource, check Utilization, Saturation, and Errors. Resources include CPUs, memory, disk, network interfaces, and the system as a whole. This catches the "obviously slow but you don't know why" case.
- **RED method** — for every service, check Rate (requests per second), Errors (failures), and Duration (latency). USE is for resources; RED is for services. Both are checklists that prevent the "I forgot to check that" mistake.
- **Workload characterization** — before you can tell if the system is slow, you have to characterize the workload. Private vs shared, bursty vs steady, latency-critical vs throughput-critical. The same system can be fast or slow depending on the workload.
- **The 60% rule of thumb** — don't try to fully utilize a system. A 60% utilized disk has 40% headroom for spikes; a 95% utilized disk is essentially a queue. This is the *why* behind capacity planning.
- **eBPF and observability** — the 2nd edition reflects the rise of eBPF. eBPF allows safe in-kernel instrumentation without recompiling the kernel, enabling observability that was impossible a decade ago. The book's tooling chapters now lean heavily on perf, bpftrace, and bcc tools.
- **Tail latency is the user experience** — p50 is the median user; p99 is the worst user. Optimize for the tail, not the median. (See [reliab-meta-storage-tail-aware] for a case study of tail optimization at scale.)

## So what
Apply the USE method to your system before you optimize anything. List every resource, check U/S/E, find the bottleneck. Apply the RED method to every service. Then optimize the bottleneck — not the things that "look slow." The cost of this discipline is an hour per system. The cost of not doing it is endless guessing.

## When to use
- A system is slow and you don't know why (start here)
- You're designing a new system and want to set SLOs that reflect the user's experience
- You need to make a "buy more hardware" vs "optimize the code" decision (USE tells you which one will help)
- You're building or buying an observability stack and need a checklist of what to measure

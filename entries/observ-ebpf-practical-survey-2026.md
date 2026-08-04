---
last_updated: 2026-08-04
topic: observ
triage: try
source_type: blog
signal: 0.83
maturity: production
domains: platform, perf
source_url: https://www.brendangregg.com/ebpf.html
source_label: Read Brendan Gregg's eBPF page →
---

# eBPF for observability — a practical survey (2026)

## TL;DR
In 2026 eBPF is the default observability substrate for new Linux-based systems. The winners: Cilium for networking, Pixie for application telemetry, bpftrace for ad-hoc. The losers: anything that tries to replace full distributed tracing.

## Why it matters
eBPF has matured from "interesting kernel feature" to "default choice for in-kernel instrumentation." The decision is no longer whether to use eBPF, but which tool to use, and for what.

## Key ideas
- Cilium replaces kube-proxy and provides service-mesh-grade networking without sidecars. The performance win is real.
- Pixie gives you auto-instrumented HTTP/gRPC/SQL traces without code changes, at the cost of running a per-node daemon.
- bpftrace is the swiss-army knife for one-off investigations. Every SRE should learn the basics.
- Kernel version matters: 5.4+ for most modern features, 5.10+ for CO-RE reliability. RHEL 8 users are stuck on 4.18.
- eBPF doesn't replace distributed tracing. It replaces the agent layer.

## Sources & links
- [Cilium documentation](https://docs.cilium.io/)
- [Pixie — New Relic's open-source observability](https://px.dev/)
- [bpftrace reference](https://github.com/iovisor/bpftrace)
- [Brendan Gregg's eBPF page](https://www.brendangregg.com/ebpf.html)

## My take
If you start a new Kubernetes-based system in 2026, default to Cilium for networking and consider Pixie for application telemetry. The old stack of "service mesh sidecar + separate metrics agent + separate log forwarder" is converging into eBPF-based tools. The transition is real and worth the engineering investment.

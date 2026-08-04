---
last_updated: 2026-08-04
topic: dist-sys
triage: read
source_type: paper
signal: 0.92
maturity: production
domains: reliab
source_url: https://jepsen.io/analyses
source_label: Read on Jepsen →
published: 2024-09-12
---

# Jepsen — anomaly in etcd 3.5 linearizable reads

## TL;DR
Jepsen found a real consistency bug in etcd 3.5's linearizable read implementation under specific network partitions. The fix landed in 3.5.x patch releases. The lesson: linearizable reads are not free, and the implementations are subtle.

## Why it matters
etcd is the control plane for Kubernetes, Nomad, and a long tail of distributed systems. If your read-after-write consistency depends on etcd's linearizable reads, this bug affected you. Worth understanding the mechanism even if you weren't on the affected version.

## Key ideas
- Linearizable reads in etcd require going through the Raft consensus — they can't be served locally.
- Under certain partition patterns, the read could observe a stale state due to a leadership-vote edge case.
- The fix: read indexes must be revalidated after a leadership change.
- General lesson: "linearizable" is not a binary property. It requires correct implementation, and the implementation must survive partition scenarios.

## Sources & links
- [Jepsen analyses index — etcd](https://jepsen.io/analyses)
- [etcd issue tracker — consistency fixes](https://github.com/etcd-io/etcd/issues)
- [Kleppmann — How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)

## My take
Jepsen reports are the closest thing the distributed systems community has to independent verification. Every team running a consensus system should subscribe to Jepsen for the systems they depend on. The reports are technical, careful, and admit their own limitations — a model for how to do rigorous systems analysis.

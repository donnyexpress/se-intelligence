---
last_updated: 2026-08-06
topic: eng-domains
triage: read
source_type: reference
signal: 0.81
maturity: production
domains: platform
source_url: https://itrevolution.com/product/accelerate/
source_label: Accelerate — Forsgren, Humble, Kim (IT Revolution, 2018) →
published: 2018-03-27
---

# Software engineering performance — DORA metrics and Accelerate

## TL;DR
Accelerate (Forsgren, Humble, Kim, 2018) is the empirical study that established the DORA metrics — the four measurements that distinguish high-performing software organizations from low-performing ones. The metrics are deployment frequency, lead time for changes, change failure rate, and time to restore service. The book synthesizes 4 years of research across 30,000+ engineering professionals. It is the canonical reference for measuring software engineering as an engineering discipline, not a craft.

## Why it matters
Most software engineering practice is informed by folklore. DORA metrics are evidence-based. They correlate with organizational performance, software quality, and developer productivity. They give software engineering something the hardware-oriented SE specialties have always had: a measurement framework that holds up under statistical scrutiny.

## Key ideas
- **Deployment frequency** — how often code is deployed to production. Elite: on-demand, multiple per day. High: weekly to monthly. Medium: monthly to every six months. Low: more than six months.
- **Lead time for changes** — time from commit to code running in production. Elite: less than one hour. High: one day to one week. Medium: one week to one month. Low: more than one month.
- **Change failure rate** — percentage of changes to production that result in degraded service and require remediation. Elite: 0-15%. High: 16-30%. Medium: 31-45%. Low: 46-60%.
- **Time to restore service** — time to restore service after a defect or incident. Elite: less than one hour. High: less than one day. Medium: less than one day to one week. Low: more than six months (!).
- **The four metrics are continuous, not discrete.** A team can move from Low to Elite by improving all four.
- **Continuous delivery is the enabling practice.** The four metrics only move when teams adopt continuous delivery — automated pipelines, trunk-based development, on-demand test environments.
- **Loose coupling and architecture matter.** The book has a chapter on Westrum's organizational culture and one on software architecture. Loose coupling (component autonomy, well-defined interfaces) is a prerequisite for high deployment frequency.
- **Lean management and monitoring matter.** Use of Lean product development and 24/7 monitoring are statistical predictors of high performance.

## So what
If you lead a software engineering team, you should be measuring these four metrics. They tell you whether your process is working. They are not the only metrics (you also need cycle time, defect escape rate, customer satisfaction) but they are the canonical four. A defense program trying to adopt modern software practice should track DORA metrics the same way it tracks MTBF.

## Related
- SPACE framework (Microsoft Research, 2021) — adds satisfaction, performance, activity, communication, efficiency to a developer-productivity measure
- DevOps Research and Assessment (DORA) — annual State of DevOps Report
- Continuous Delivery (Humble, Farley, 2010) — the engineering practices that enable the four metrics

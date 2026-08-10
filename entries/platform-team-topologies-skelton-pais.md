---
last_updated: 2026-08-10
topic: platform
triage: read
source_type: book
signal: 0.85
maturity: production
source_url: https://teamtopologies.com/book
source_label: Skelton & Pais — Team Topologies (IT Revolution, 2019) →
published: 2019-09-07
---

# Team Topologies — organizing for flow

## TL;DR
Team Topologies (Skelton & Pais, IT Revolution Press, 2019) is the most-cited framework for software team organization of the last decade. It defines four team types (Stream-aligned, Enabling, Complicated-Subsystem, Platform), three interaction modes (Collaboration, X-as-a-Service, Facilitating), and a cognitive load model for team boundaries. It is the foundation of the "platform engineering" movement and is widely adopted in organizations from startups to FAANG-scale.

## Why it matters
Before Team Topologies, the standard advice for software team organization was Conway's Law ("organizations design systems that mirror their communication structures") and a vague exhortation to use "small teams." The book operationalized Conway: instead of letting team structure emerge randomly, design it explicitly to match the system's cognitive load. The four team types and three interaction modes are concrete enough to draw on a whiteboard and use as the basis for org design decisions.

## Key ideas
- **Four team types** — Stream-aligned (deliver value end-to-end), Enabling (help other teams adopt new capabilities), Complicated-Subsystem (own a part of the system that needs specialist attention), Platform (provide internal services that stream-aligned teams build on). Most teams are stream-aligned; the other three are there to support them.
- **Three interaction modes** — Collaboration (close, joint work; e.g., pair programming), X-as-a-Service (consume without involvement; e.g., a platform team providing a CI service), Facilitating (help another team learn, then step back). Choosing the wrong mode is the most common source of friction.
- **Cognitive load** — team boundaries should be drawn to minimize intrinsic, extraneous, and germane cognitive load. A stream-aligned team that has to think about Kubernetes, Kafka, and OAuth is overloaded; the Platform team's job is to remove that load.
- **Software as a long-lived team effort** — Team Topologies assumes the software will be maintained for years, not shipped once. The org design that minimizes time-to-first-deploy is often different from the one that minimizes cost-of-change.
- **Reverse Conway maneuver** — change the team structure first; the system architecture will follow. Counterintuitive but practical: the team you put in place determines the code they write.
- **Platform engineering connection** — the book's idea of a "Platform team" is the foundation of the platform engineering movement that emerged 2020-2024. CNCF, PlatformEngineering.org, and the Gartner "Platform Engineering" hype cycle all build on this idea.

## So what
If you lead a software organization with more than ~5 teams, draw the four team types on a whiteboard and classify each of your current teams. Most orgs discover they have too many Complicated-Subsystem teams and not enough Platform teams, which explains the cognitive-load complaints. If you're building a platform team, read this before you build the platform — it tells you what the platform's *purpose* is in the org.

## When to use
- You're scaling a software org past ~5 teams and the friction is growing
- You're building (or considering) a platform team and want to understand its role
- You're reorganizing and need a framework that goes beyond "split into smaller teams"
- You want to operationalize Conway's Law instead of letting it operate by accident

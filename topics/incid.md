---
topic_key: incid
level: 5
last_curated: 2026-08-05
maturity: established
---

# Incidents

Incidents are the moments when the system's failure becomes visible. The discipline of incident management is the practice of detecting, responding to, learning from, and preventing these moments. Done well, incident management is the most valuable source of operational learning. Done poorly, it is a recurring source of damage to the system, the team, and the business. This article covers the basics, the patterns that work, the research frontiers, and the best practices that have held up across the last two decades.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

Most systems run most of the time. The interesting moments are the failures. The incident management discipline is what determines whether a failure is a learning experience (the system gets better) or a recurring experience (the system gets worse). The Tail at Scale paper [reliab-meta-storage-tail-aware], the Jepsen etcd 3.5 analysis [dist-sys-jepsen-etcd-3-5], and the IW 2024 Resilient Systems track [conf-iw2024-resilient-systems] all show that the postmortem and the prevention are where the wins are.

## Basics

An incident is an unplanned event that disrupts the system's ability to perform its function. The incident management discipline has several phases:

- **Detection**: knowing the incident is happening. The faster the detection, the smaller the blast radius.
- **Response**: the active work to stop the bleeding and restore service. The response is led by an Incident Commander (IC).
- **Resolution**: the immediate cause is identified and fixed. The system is back to normal.
- **Postmortem**: the deeper analysis of why the incident happened, what made it worse, and what to change. The postmortem is the learning.
- **Prevention**: the changes from the postmortem are implemented. Without prevention, the postmortem is wasted.

The modern incident management practice is the blameless postmortem. The premise is that incidents are caused by the system, not by individuals. The individual made a reasonable decision in the moment given the information they had; the system allowed that decision to cause an incident. Blameless doesn't mean "no accountability" — it means the accountability is for fixing the system, not for punishing the individual.

## Patterns that work

Five patterns recur in incident management practice:

1. **Severity levels and the IC role.** Incidents are classified by severity; the response is led by an IC. The IC has authority to make decisions and pull in resources. The IC role is separate from the technical work.
2. **Blameless postmortems.** The postmortem names systems, not individuals. The postmortem identifies the contributing factors and the actions to address them. The actions have owners and deadlines.
3. **Public postmortems.** Sharing postmortems publicly, when possible, builds trust with users and contributes to the broader community's learning. Public postmortems require a culture of safety; private postmortems with the same content are also fine.
4. **Action tracking.** Every postmortem action has an owner, a deadline, and a status. The actions are tracked until done. Stale postmortem actions are a warning sign.
5. **Drills and game days.** Practice the response. Run regular drills (chaos engineering) to validate the runbooks, the IC role, and the cross-team coordination. The drills find gaps before the real incident does.

The chaos engineering discipline (Netflix's Chaos Monkey and the broader practice) is one of the most productive patterns of the last 20 years [conf-iw2024-resilient-systems].

## Best practices

- **The IC is not the deepest expert.** The IC is a coordinator, not a debugger. The IC's job is to keep the response moving; the technical work is done by the subject matter experts.
- **Communicate during the incident, not just after.** The status page, the team channel, and the customer-facing communication all need regular updates during the incident. Silence is the enemy.
- **The postmortem is for the system, not the individual.** "Why did the system allow this to happen?" is the right question. "Who clicked the wrong button?" is not.
- **Actions are not work.** Postmortem actions are not on the team's regular work list; they are explicit commitments with deadlines. Without the commitment, the postmortem is wasted.
- **Practice the response.** The first time the team uses the runbook should not be during a real incident. Drills are cheap; incidents are expensive.

## Research frontiers

Active threads in 2024–2026:

- **Resilient systems of systems.** INCOSE IW 2024 dedicated a track to resilient SoS, with patterns for cross-organizational incident response [conf-iw2024-resilient-systems].
- **LLM-assisted incident analysis.** Using LLMs to summarize incident timelines, cluster similar incidents, and surface root causes from postmortem archives. The JAXA team's LLM-MBSE approach is the parallel [conf-is2025-jaxa-llm-mbse].
- **Chaos engineering for SoS.** When the system crosses organizational boundaries, the chaos engineering practice needs to be federated.
- **The Tail at Scale techniques as incident response.** The Meta storage patterns (hedged requests, sub-queue isolation) are designed for the normal case, not the incident. The incident response still depends on the runbook.
- **Service life extension as incident prevention.** Many incidents are caused by aging systems. Service life extension patterns reduce the incident rate [deploy-use-service-life-extension].

## What to read first

If you only read three things on incidents, read:

1. The Meta storage writeup — what production reliability looks like [reliab-meta-storage-tail-aware]
2. The Jepsen etcd 3.5 analysis — a real bug, a real postmortem, real lessons [dist-sys-jepsen-etcd-3-5]
3. The INCOSE IW 2024 Resilient Systems track — current state of the discipline [conf-iw2024-resilient-systems]

## References

1. Meta storage — 40% p99 reduction via tail-aware scheduling
2. Jepsen — anomaly in etcd 3.5 linearizable reads
3. Resilient Systems of Systems — IW 2024 (Torrance)
4. JAXA — LLM-augmented MBSE / incident analysis (IS 2025)
5. Service life extension patterns

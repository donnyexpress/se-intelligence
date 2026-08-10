---
last_updated: 2026-08-11
topic: incid
triage: read
source_type: book
signal: 0.83
maturity: production
domains: incid, reliab
source_url: https://sre.google/sre-book/postmortem-culture/
source_label: Google SRE — Postmortem Culture: Learning from Failure →
published: 2017-03-31
---

# Google SRE — Postmortem Culture: Learning from Failure

## TL;DR
Chapter 14 of the first Google SRE book ("Site Reliability Engineering: How Google Runs Production Systems") and the corresponding chapter in the SRE Workbook are the canonical statements of blameless postmortem practice. The argument is simple: incidents recur for systemic reasons, and you can only learn from them if you can talk about what happened without anyone being afraid of blame. The SRE postmortem culture is now the template that the rest of the industry has copied — Datadog, PagerDuty, Atlassian, GitLab, Cloudflare, and most large engineering organizations have their own version of the practice. The Google SRE Workbook's Postmortem Culture chapter (Chapter 7) is the most up-to-date statement and includes the modern postmortem template.

## Why it matters
Most engineering organizations still run incident response as a hunt for who to blame. The blameless postmortem practice inverts this: the goal of the postmortem is not to find a person to fire but to find the system-level causes (process gaps, missing alerts, architectural fragility) that allowed the incident. This requires explicit cultural work — the blameless framing has to be enforced at the leadership level, or it erodes under pressure. Without the cultural foundation, "blameless" becomes a euphemism and the same incidents recur. SRE is the most-cited body of work for this practice; if you are setting up or improving an incident-response process, this is the reference.

## Key ideas
- **Blameless is not "no accountability"** — it is "no *individual* blame for system failures." People are accountable for following the process, not for incidents that the process allowed. The shift is from "who broke it" to "what in our system allowed it to be broken."
- **The five questions of a good postmortem** — (1) What happened? (2) Why did it happen? (3) How was it detected? (4) How was it mitigated? (5) Could it have been prevented? Each has a standard answer structure.
- **The postmortem is a written artifact, not a meeting** — the document is the deliverable. Meetings are used to share context and draft sections; the written document is what gets reviewed, cross-team-shared, and used to track follow-ups.
- **Action items are the real output** — a postmortem without action items is just storytelling. Action items have owners, deadlines, and SLOs for completion (the team agrees on a target completion time, often 30-90 days for P0/P1 issues).
- **Blameless language is a learned skill** — postmortems need to be written in language that describes the system, not the people. "The deploy was pushed without tests passing" not "Alice pushed a bad deploy." The book gives concrete before/after examples.
- **Near-misses get postmortems too** — the highest-leverage postmortems are often the near-misses, because they show you the system-level fragility without the cost of an actual outage. The SRE culture treats near-misses as the most valuable data source.
- **Cross-team review prevents recurrence elsewhere** — a postmortem for Service A often contains a pattern that applies to Service B, C, and D. The SRE practice is to share postmortems broadly (within the company, often with a public version for major incidents) and explicitly look for "do we have this pattern elsewhere?"
- **The postmortem template** — Google's standard template includes: Summary (one paragraph), Impact (numbers), Root Cause(s), Trigger (what made the latent bug fire), Resolution, Detection (how we found out), Recovery, Action Items, Lessons Learned. The SRE Workbook has the modern version.
- **The follow-up is the proof** — the test of a good postmortem culture is not the quality of the documents, it's whether the action items get done. A culture that writes beautiful postmortems and never fixes the issues is worse than one that writes ugly postmortems and always fixes the issues.

## So what
Adopt the Google SRE postmortem template and the blameless framing. The SRE Workbook's chapter 7 has the current version. Train your incident commanders and your postmortem facilitators on the blameless language — the cultural work is the hard part, not the document template. Set an SLO for action-item completion (90 days is a common default) and report on it. If you are an SRE or a platform team, write a public postmortem for your next P0 — Cloudflare, GitLab, and others have shown that the practice builds trust with users and surfaces patterns the team didn't know about. The Google SRE books are free online (sre.google/books); start there.

## When to use
- You are building or improving an incident-response process
- You are training incident commanders or postmortem facilitators
- You are writing or revising your postmortem template
- You are presenting the case for blameless culture to leadership
- You are preparing a public postmortem for a major incident

## Sources & links
- SRE Book Chapter 14: Postmortem Culture: Learning from Failure — https://sre.google/sre-book/postmortem-culture/
- SRE Workbook Chapter 7: Postmortem Culture — https://sre.google/workbook/postmortem-culture/
- SRE Workbook Chapter 8: Postmortem Analysis — https://sre.google/workbook/postmortem-analysis/
- Google Incident Management Guide — https://sre.google/resources/practices-and-processes/incident-management-guide/
- The SRE books are free online — https://sre.google/books/
- Atlassian Incident Handbook (public) — https://www.atlassian.com/incident-management/handbook
- GitLab Incident Reviews (public) — https://about.gitlab.com/handbook/engineering/infrastructure-platform/incident-review/

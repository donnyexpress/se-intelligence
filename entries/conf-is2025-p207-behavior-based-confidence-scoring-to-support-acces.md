---
last_updated: 2026-08-13
topic: system-def
triage: read
source_type: paper
signal: 0.72
maturity: established
event: is2025
track: se-disciplines
domain_tags: ["auto", "health"]
practice_tags: ["ml-sys", "observ"]
authors: "Schulker et al."  # 4 authors
year: 2025
published: 2025-07-15
source_url: https://www.incose.org/docs/default-source/events-documents/is2025/IS2025BookAbstract.pdf
source_label: IS 2025 Paper #207 (Ottawa) →
---

# Behavior-based Confidence Scoring to Support Access Management in Zero Trust Systems

## TL;DR

Zero Trust architectures for cybersecurity have become the default aspiration for organizations in industry and for the U.S. federal government. A significant change in Zero Trust compared to legacy paradigms is the principle that systems should grant access to resources (devices, internal websites, data, software as a service, etc.) on a per-session basis after conducting authentication and authorization that is dynamic and strictly enforced. To facilitate this tide of additional scrutiny, Zero Trust strategies also emphasize the need for data science systems that use behavioral signatures to automate elements of the authentication and authorization process. Researchers have proposed a variety of statistical and machine learning approaches to analyzing behavioral data, most often from the perspective of anomaly detection. This work simulated data from the CERT Insider Risk dataset to examine two general approaches to using behavior data to support authentication and authorization decisions: deep learning and Bayesian hierarchical models. We find that deep learning approaches, especially those with memory, have higher cumulative recall for user authentication under small budgets, but all approaches converge as budgets increase. For authorization, which scores the attribute of the user rather than his/her identify, Bayesian hierarchical models have significantly better recall because they explicitly model the group attribute.

## Why it matters

This paper was presented at the 35th Annual INCOSE International Symposium (IS 2025) in Ottawa, Canada, July 26–31, 2025. Authors: David Schulker (Carnegie Mellon University Software Engineering Institute) - dschulker@cert.org; Edward Wang (Carnegie Mellon University Software Engineering Institute) - jwang@cert.org; Jeffrey Mellon (Carnegie Mellon University Software Engineering Institute) - jlmellon@cert.org; Robert Garrett (Carnegie Mellon University Software Engineering Institute) - rgarrett@cert.org.

## Key ideas

- **Keywords**: Zero Trust,deep learning,Bayesian hierarchical models,identity and access management
- **IS2025 topic codes**: 4.7 System Security (cyber-attack, 5.11 Artificial Intelligence, 5.7 Software-Intensive Systems
- **Primary topic (SE Intelligence taxonomy)**: system-def
- **Also tagged (app domains)**: auto, health
- **Also tagged (practice areas)**: ml-sys, observ

## When to use

- When researching this paper's specific topic area in the 2025 SE community work
- When looking for a citable, peer-reviewed source from the INCOSE IS 2025 program
- When cross-referencing against other IS 2025 work in the same topic area

## Sources & links

- INCOSE IS 2025 Book of Abstracts (PDF) — https://www.incose.org/docs/default-source/events-documents/is2025/IS2025BookAbstract.pdf
- INCOSE Previous International Events — https://www.incose.org/events-education/previous-international-events/
- 35th Annual INCOSE International Symposium, Ottawa, Canada, July 26–31, 2025

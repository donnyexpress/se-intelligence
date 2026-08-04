---
last_updated: 2026-08-04
topic: management
triage: read
source_type: blog
signal: 0.72
maturity: production
---

# Multi-criteria decision analysis in SE — when it actually helps

## TL;DR
MCDA (AHP, TOPSIS, MAUT, etc.) is useful when you have a real multi-criteria decision and the criteria are genuinely incommensurable. It's harmful when you use it to look rigorous in front of stakeholders who would prefer a direct conversation.

## Why it matters
SE is full of decisions where multiple stakeholders have different priorities: cost vs. performance vs. schedule vs. risk vs. regulatory compliance. MCDA gives you a structured way to make those trade-offs explicit, *if* the criteria weights are honestly elicited.

## Key ideas
- AHP (Analytic Hierarchy Process): pairwise comparisons → weights → ranking. Best for 3–7 criteria.
- TOPSIS: ranks alternatives by distance to ideal/anti-ideal. Best when you have a clear set of well-scored options.
- MAUT (Multi-Attribute Utility Theory): rigorous but heavyweight. Best for high-stakes, long-lived decisions.
- The single most common MCDA failure: stakeholder weights are assumed, not elicited. Elicit them.

## Sources & links
- [Saaty — The Analytic Hierarchy Process](https://www.sciencedirect.com/topics/computer-science/analytic-hierarchy-process)
- [INCOSE Decision Analysis Working Group](https://www.incose.org/group/decision-analysis-working-group/)

## My take
MCDA is a *facilitation* tool, not an analysis tool. The value is in forcing the criteria and weights to be explicit and contested. If the output of the MCDA wouldn't survive a stakeholder challenge, the MCDA is theater. Use it where it genuinely helps — usually for high-stakes, multi-stakeholder selection decisions.

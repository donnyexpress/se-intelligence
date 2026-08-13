---
last_updated: 2026-08-05
topic: eng-domains
triage: read
source_type: paper
signal: 0.80
maturity: production
event: is2025
track: se-disciplines
paper_id: https://www.incose.org/resource/systematic-risk-analysis-fmea-and-fta-approaches-for-multi-level-system-architectures/
source_url: https://www.incose.org/resource/systematic-risk-analysis-fmea-and-fta-approaches-for-multi-level-system-architectures/
source_label: Read on INCOSE →
authors: "Post, K.; Arifin, H. H.; Pepper, B.; Pavalkis, S."
year: 2025
published: 2025-07-15
event_date: 2025-07-30
---

# Post et al. — FMEA and FTA Approach for Multi-Level System Architecture

## TL;DR
Dassault Systèmes' paper (Kyle Post, Habibi Husain Arifin, Brian Pepper, Saulius Pavalkis) extends traditional FMEA/FTA to multi-level MBSE architectures, integrating Model-Based Safety & Reliability Analysis (MBSRA) with the design model and keeping traceability of design-to-failure-mode links.

## Why it matters
The biggest practical gap in safety/reliability analysis today is that the analysis lives in a spreadsheet, the design lives in a model, and the two drift. This paper is the cleanest 2025 reference for keeping them connected — which is what every safety-critical program needs and few achieve.

## Key ideas
- Multi-level architecture is a layering pattern: system → subsystem → component → part. The analysis has to live at every layer and link across layers.
- MBSRA is the term for safety/reliability work done directly in the MBSE tool, vs. externalized in spreadsheets. The paper shows both approaches and why the former wins on traceability.
- FMEA (Failure Mode and Effects Analysis) becomes a *model annotation*, not a parallel document. Each design element gets failure modes, severities, and mitigations as model properties.
- FTA (Fault Tree Analysis) is built from the same model: trace from a top-level failure down through the architecture using the model relationships, not a hand-drawn tree.

## Sources & links
- [Paper on INCOSE](https://www.incose.org/resource/systematic-risk-analysis-fmea-and-fta-approaches-for-multi-level-system-architectures/)
- [IS 2025 abstract book](https://www.incose.org/docs/default-source/events-documents/is2025/is2025bookabstract-6.pdf)
- [Related: AI- and Ontology-Based Enhancements to FMEA (2025)](https://arxiv.org/html/2511.17743v1)

## My take
If you work on safety-critical anything (medical, automotive, aerospace, industrial), this is a reference pattern. The shift to MBSRA isn't a tooling exercise — it's a process exercise. The paper is useful because it gives you the *process* and shows what evidence regulators accept when the analysis is in the model vs. in a spreadsheet.

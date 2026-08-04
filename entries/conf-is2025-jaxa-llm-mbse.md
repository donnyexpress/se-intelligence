---
last_updated: 2026-08-05
topic: system-def
triage: read
source_type: paper
signal: 0.86
maturity: production
event: is2025
track: modelling
paper_id: https://www.incose.org/wp-content/uploads/legacy/presentation/is2025-pdf/Paper-196.pdf
source_url: https://www.incose.org/wp-content/uploads/legacy/presentation/is2025-pdf/Paper-196.pdf
source_label: Read the paper (PDF) →
authors: "Sugawara, K.; Komatsu, Y.; Wada, A."
year: 2025
event_date: 2025-07-29
---

# JAXA — Extracting Information from System Model as Graph Structure by LLM in MBSE

## TL;DR
JAXA researchers (Sugawara, Komatsu, Wada) propose converting SysML models to a Neo4j graph database, then using an LLM to translate natural-language questions into Cypher queries — letting non-modellers query MBSE artefacts conversationally.

## Why it matters
The hardest part of MBSE adoption isn't authoring the model, it's making the model *useful* to people who didn't build it. This paper shows a practical pattern: lift the model out of the tool, expose it as a graph, and let an LLM be the query layer. If this approach holds up, it materially changes the cost/value of MBSE in large programs.

## Key ideas
- Two-step pipeline: (1) SysML model → Neo4j graph; (2) user question → Cypher via LLM with a metamodel prompt.
- The metamodel prompt is the key — it tells the LLM what node types and relationships exist, so the generated queries are valid.
- Tested against real JAXA spacecraft models. The approach is general — any SysML v1/v2 model with a defined metamodel can be lifted the same way.
- Performance question (not fully answered in the abstract): how well does the LLM handle deeply nested queries or models with hundreds of node types?

## Sources & links
- [Paper PDF (Paper #196, IS 2025)](https://www.incose.org/wp-content/uploads/legacy/presentation/is2025-pdf/Paper-196.pdf)
- [INCOSE IS 2025 — Paper index](https://www.incose.org/symp2025)
- [Related: LLM for spacecraft architecture generation (T&F, 2025)](https://www.tandfonline.com/doi/full/10.1080/09544828.2025.2453401)

## My take
This is the most practical LLM-in-MBSE paper I've seen from 2025 — it's not a vision, it's a working pipeline on a real aerospace model. The win is making models queryable, not making them auto-generate. The limitation is the same as every LLM-in-SE demo: you have to trust the model's output, and audit-trail on graph queries is non-trivial.

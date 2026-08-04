---
last_updated: 2026-08-05
topic: system-def
triage: read
source_type: paper
signal: 0.79
maturity: production
event: is2025
track: modelling
paper_id: https://www.incose.org/docs/default-source/events-documents/is2025/is2025bookabstract-6.pdf
source_url: https://www.incose.org/docs/default-source/events-documents/is2025/is2025bookabstract-6.pdf
source_label: Read in IS 2025 abstract book →
authors: "Pavalkis, S.; Drozdzewicz, P."
year: 2025
---

# Pavalkis & Drozdzewicz — A Transformative Process for Model-Based Design Reviews

## TL;DR
Dassault Systèmes' paper (Paper #361) makes the case that classical design reviews (SRR, PDR, CDR) can be re-grounded in MBSE — running them against a model instead of documents — and proposes a process for doing so without doubling review cost.

## Why it matters
Most programs still run design reviews as document walkthroughs, even when they have an MBSE model. The model becomes a reference; the review runs on the document. This paper is one of the cleanest arguments for *running the review on the model* — and a process for getting there.

## Key ideas
- Reviews should answer the same questions they always have, but source answers from the model, not from documents.
- A model-based review is faster *per question* but requires pre-review model validation, which costs time up front. Net: total review time drops, but the time shifts earlier.
- Three prerequisites for a model-based review: (1) the model is the authoritative source; (2) reviewers can navigate the model without tool expertise; (3) the model is complete enough to answer the review's questions.
- The paper proposes a 5-step process: model readiness check → question → model query → review board discussion → traceability capture.

## Sources & links
- [Paper #361 in IS 2025 abstract book](https://www.incose.org/docs/default-source/events-documents/is2025/is2025bookabstract-6.pdf)
- [IAC 2025: FireSAT Nova model-based design reviews in practice](https://dl.iafastro.directory/event/IAC-2025/paper/98332/)
- [OpenMBEE / SysML v2 tooling](https://openmbee.atlassian.net/)

## My take
The shift from document-based to model-based reviews is one of the highest-leverage MBSE adoption moves, and most programs under-invest in it because the cost shows up before the benefit. This paper is worth reading if you're trying to convince a review board to change. The lesson: don't replace the document, replace the *source of truth* for the document, and the review changes naturally.

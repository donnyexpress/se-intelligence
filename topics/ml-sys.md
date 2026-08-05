---
topic_key: ml-sys
level: 5
last_curated: 2026-08-05
maturity: established
---

# ML / AI Systems

ML/AI systems are software systems that learn behavior from data rather than having it specified by code. They are systems in the systems-engineering sense: they have requirements, architecture, integration, verification, deployment, support. The discipline of ML systems engineering applies systems engineering to ML. This article covers the basics, the patterns that work, the research frontiers, and the best practices that are still being discovered.

Every claim is cited to a real source — click the bracketed numbers to jump to the references list at the bottom.

## Why it matters

Most new software systems have an ML component. Most ML components in production are unreliable, expensive, and drift over time. The systems engineering practices that work for traditional software are not enough; the ML component has its own disciplines. The ML systems engineering discipline is the bridge [ml-sys-inference-cost-curves-2026].

## Basics

An ML system has the usual software architecture (API, database, business logic) plus the ML components (model, training pipeline, feature store, evaluation harness). The ML components introduce new failure modes:

- **Data drift**: the input distribution changes over time, and the model's accuracy degrades.
- **Model drift**: the model's behavior on the same input changes (e.g. due to retraining).
- **Silent failures**: the model returns a confident answer that's wrong. There's no exception, no log, no test that catches it.
- **Cost unpredictability**: inference cost scales with input size and model size. A traffic spike can run up the bill before the team notices.
- **Compliance**: the model's training data and outputs may have regulatory requirements (PII, GDPR, etc.).

The discipline of ML systems engineering addresses each of these.

## Patterns that work

Five patterns recur in ML systems practice:

1. **Instrument every prediction.** Every model call should be logged with input features, output, latency, and cost. The instrumentation is the unlock for monitoring and debugging [ml-sys-inference-cost-curves-2026].
2. **Evaluation harness as a first-class artifact.** The evaluation harness is the test suite for the model. It should be run on every model change, with the same discipline as unit tests.
3. **Feature store as the single source of truth.** Features should be computed once, stored, and reused across training and inference. The feature store is the data layer for the ML system.
4. **Cost as a non-functional requirement.** Inference cost, training cost, and storage cost should be SLOs alongside latency and accuracy.
5. **GenAI as a specialty.** The systems engineering team must apply the same discipline to GenAI as to any other subsystem. The Giang paper and the Madachy framework give the patterns [safeguarding-genai-prompt-engineering-giang-2025] [se-maturity-genai-madachy-2025].

The 2026 inference cost survey covers the current state of model serving economics [ml-sys-inference-cost-curves-2026].

## Best practices

- **Treat the data as the design.** The model's behavior is determined by the training data, not the architecture. Data discipline is the primary discipline.
- **Ship the evaluation harness before the model.** The harness is what makes the model shippable. Without it, every change is a risk.
- **Monitor for drift continuously.** Data drift and model drift are the silent killers. Continuous monitoring catches them before the user does.
- **Cost is a SLO.** Inference cost, training cost, and storage cost should be measured, alerted on, and budgeted.
- **Have a fallback.** Every ML system should have a non-ML fallback for when the model is wrong. The fallback is the user's safety net.

## Research frontiers

Active threads in 2024–2026:

- **Inference cost curves.** Where the floor is in 2026, and what the cost-performance frontier looks like [ml-sys-inference-cost-curves-2026].
- **LLM-augmented MBSE.** Using LLMs as part of the SE workflow, with attention to safety and maturity [conf-is2025-jaxa-llm-mbse] [safeguarding-genai-prompt-engineering-giang-2025] [se-maturity-genai-madachy-2025].
- **Federated learning for data-residency-constrained ML.** A technique for ML where the data cannot move [federated-learning-villanueva-2025].
- **ML system observability.** Traditional observability assumes the system is deterministic. ML systems break that assumption; the field is inventing new techniques.
- **Online evaluation.** The discipline of evaluating the model in production, not just in the test harness.

## What to read first

If you only read three things on ML systems, read:

1. The 2026 inference cost survey — current state of model economics [ml-sys-inference-cost-curves-2026]
2. The JAXA LLM-MBSE work — what GenAI in the SE workflow looks like in practice [conf-is2025-jaxa-llm-mbse]
3. The SE Maturity framework for GenAI — how to bring GenAI in with discipline [se-maturity-genai-madachy-2025]

## References

1. LLM inference cost curves — where the floor is in 2026
2. JAXA — Extracting Information from System Models as Graph Structures by LLM in MBSE (IS 2025)
3. Safeguarding Sensitive Data: Prompt Engineering for GenAI — INCOSE Enchantment, 2025
4. SE Maturity and Cost Modeling Framework for GenAI — INCOSE San Diego, 2025
5. Federated Learning — Villanueva, INCOSE San Diego, 2025

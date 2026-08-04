---
last_updated: 2026-08-04
topic: ml-sys
triage: watch
source_type: blog
signal: 0.85
maturity: production
domains: perf, energy
source_url: https://www.semianalysis.com/
source_label: Read on SemiAnalysis →
---

# LLM inference cost curves — where the floor is in 2026

## TL;DR
Per-token inference cost for state-of-the-art LLMs fell roughly 10x in 18 months through mid-2026. The drivers: better quantization, speculative decoding, and aggressive batching on custom silicon. The floor is approaching the cost of electricity for the GPU-second.

## Why it matters
If you're planning a product that depends on LLM inference at scale, the unit economics are still moving fast. Building on a 2025 cost model means over-provisioning by 3–5x. Conversely, if you're pricing inference-heavy products, the floor is going to keep dropping for another 12–18 months.

## Key ideas
- 4-bit quantization with calibration data: <1% quality loss for most workloads, 2–3x throughput win.
- Speculative decoding: 2–4x speedup when you have a good draft model. Quality identical to the target model.
- Continuous batching: 2–10x throughput improvement over naive request-level batching.
- Custom silicon (Groq, Cerebras, AWS Trainium2, Google TPUv6) is closing the gap with NVIDIA. The supply story is improving.
- The cost floor is electricity + amortization. Below that, you're not doing inference, you're doing something else.

## Sources & links
- [SemiAnalysis — Inference economics](https://www.semianalysis.com/)
- [vLLM documentation — Continuous batching](https://docs.vllm.ai/)
- [Hugging Face — Optimum quantization guide](https://huggingface.co/docs/optimum/concept_guides/quantization)

## My take
The cost curve is real but not infinite. By late 2027 the easy wins (quantization, batching) will be exhausted and the remaining gains will come from silicon and architecture. If you're building a long-lived product on top of LLM inference, model your costs at *today's* floor, not the current price.

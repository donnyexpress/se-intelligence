---
last_updated: 2026-08-05
topic: eng-domains
triage: read
source_type: paper
signal: 0.80
maturity: production
domains: sec, ml-sys
source_url: https://www.incose.org/docs/default-source/enchantment/20250514_enchantment_safeguarding_sensitive_data_pe4genai.pdf
source_label: Read the INCOSE Enchantment paper →
published: 2025-05-14
---

# Safeguarding Sensitive Data: Prompt Engineering for GenAI

## TL;DR
A practitioner's guide to using GenAI in systems engineering work without leaking sensitive data into model training corpora or third-party systems. The paper covers the threat model, the practical controls, and the prompt engineering patterns that work in 2025.

## Why it matters
Every systems engineering team is now using LLMs for something — drafting requirements, summarizing specs, analyzing architecture. Most of them are doing it without a clear data-handling model. The paper is one of the first SE-focused guidance documents on the topic.

## Key ideas
- The threat model has three layers: data sent to the model provider, data used in model training, and data exposed to other users via shared infrastructure. Each layer needs different controls.
- Practical controls: data classification before sending, scrubbing strategies, on-prem or VPC-isolated models for sensitive data, contract terms with providers.
- Prompt engineering as a security control: patterns that keep sensitive data out of prompts, patterns that use synthetic or generalized data instead of real, patterns that ask the model to assume roles without exposing real context.
- The paper is honest about what GenAI can and cannot do for SE work in 2025. It's not a marketing piece.

## So what
If you're using LLMs in your SE workflow, this is a useful checklist for "what we should and shouldn't send to the model." If you're building SE tooling that wraps LLMs, the data-handling requirements in this paper are a starting point.

## Sources & links
- [Giang — Safeguarding Sensitive Data: Prompt Engineering for GenAI, INCOSE Enchantment 2025 (PDF)](https://www.incose.org/docs/default-source/enchantment/20250514_enchantment_safeguarding_sensitive_data_pe4genai.pdf)

## My take
The paper's biggest contribution is treating prompt engineering as a security control, not just a productivity hack. Most prompt-engineering writing focuses on getting better outputs; this paper focuses on keeping data safe while doing so. The 2025 timeliness is real — the threat landscape and the available controls have moved significantly since 2023.

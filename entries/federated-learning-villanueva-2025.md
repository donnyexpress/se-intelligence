---
last_updated: 2026-08-05
topic: ml-sys
triage: watch
source_type: talk
signal: 0.72
maturity: research
source_url: http://sdincose.org/wp-content/uploads/2025/09/2025_Federated_Learning_Art_Villanueva.pdf
source_label: Read the chapter talk slides →
published: 2025-09-15
---

# Federated Learning

## TL;DR
A chapter talk introducing federated learning for systems engineers. Federated learning is the technique of training a shared model on distributed data without the data ever leaving the source — the model travels to the data, not the data to the model. The talk covers the basics, the practical patterns, and the systems engineering challenges.

## Why it matters
Federated learning is one of the few techniques that genuinely addresses the "we can't move the data but we want a model" problem. For SE work in regulated industries (healthcare, defense, financial), this is a path to ML capabilities that were previously blocked by data residency rules.

## Key ideas
- The basic pattern: a central model, distributed clients that train on local data, periodic aggregation. The model improves without the data moving.
- The systems engineering challenges are mostly about coordination: who has authority over the model, how do you handle clients dropping in and out, how do you handle adversarial clients, how do you audit training.
- The talk distinguishes "federated learning" from "split learning" and "on-device training" — related techniques with different tradeoffs.
- Honest about what's hard: the math works, the engineering doesn't, especially in adversarial settings.

## So what
If you work in a domain where data residency is a real constraint, federated learning is a technique worth understanding. If you work in an SE team that's adopting ML capabilities, this is one of the patterns that lets you keep the data where it is.

## Sources & links
- [Villanueva — Federated Learning, INCOSE San Diego chapter talk, Sept 2025 (PDF)](http://sdincose.org/wp-content/uploads/2025/09/2025_Federated_Learning_Art_Villanueva.pdf)
- [McMahan et al. — Communication-Efficient Learning of Deep Networks from Decentralized Data (the original paper)](https://arxiv.org/abs/1602.05629)

## My take
The talk is a good introduction but doesn't go deep on production patterns. For SE teams considering federated learning, this is the starting point — read the talk, then look at the systems engineering papers around coordination, audit, and adversarial robustness. The technique is real; the engineering is still maturing.

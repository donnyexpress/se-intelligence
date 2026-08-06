---
topic_key: specialty-hfe
level: 7
last_curated: 2026-08-06
maturity: established
---

# Human Factors Engineering

Human factors engineering (HFE) — also called ergonomics, human factors, or human-system integration — is the discipline of designing systems that work for the people who use them. It covers physical ergonomics (workspace, controls, displays), cognitive ergonomics (information presentation, workload, decision support), training, documentation, and accessibility. HFE is a horizontal specialty that intersects with every system that has human operators or users.

This article covers the basics of how HFE is practiced, the patterns that work across industries, and the active research frontiers. Every claim is cited to a real source.

## Why it matters

HFE failures are systems engineering failures. The Therac-25 radiation therapy machine killed six patients because the operator interface did not communicate the machine's state — operators could not read the screen fast enough to intervene. The Boeing 737 MAX MCAS disaster was caused in part by a single angle-of-attack sensor driving a system that pilots were not informed about. The Three Mile Island nuclear meltdown was made worse by the control room design — operators could not find the valve status indicators. HFE is not a "nice to have"; it is a system safety and operational requirement.

## Basics

HFE is built on five core activities [human-factors-rapid-prototyping-zeman-wood-2025]:

1. **User and task analysis** — who are the users, what are their tasks, what are their constraints? This is the foundation: a design that does not match the users' tasks will fail.
2. **Cognitive and physical workload assessment** — what is the user's mental and physical load during the task? Workload that is too high causes errors; workload that is too low causes boredom and inattention.
3. **Interface design** — the physical controls, displays, software UI, and information presentation. This is the most visible part of HFE but is downstream of the user and task analysis.
4. **Training and documentation** — even a well-designed interface requires training. The training program and the documentation are part of the system, not separate.
5. **Usability testing** — the interface is tested with real users doing real tasks. This is not the same as system testing; it requires different methods and different metrics.

The dominant standards are:
- **MIL-STD-1472** — the US Department of Defense human engineering standard, the most-cited reference for military systems.
- **ANSI/HFES 100** — computer workstations, used widely in commercial software.
- **ISO 9241** — the international ergonomics of human-system interaction standard, the most-cited international reference.
- **Section 508 (US)** / **EN 301 549 (EU)** — accessibility standards for information and communication technology.
- **WCAG 2.1/2.2** — Web Content Accessibility Guidelines, the canonical accessibility standard for web and mobile.

## Patterns that work

Across aviation, medical, defense, and consumer software programs, the same patterns recurred [human-factors-rapid-prototyping-zeman-wood-2025] [dieselgate-smoke-and-mirrors-aftel-2025]:

1. **User-centered design, not feature-driven design.** Start with the user's tasks, not the engineering team's feature list. The "we built it because it was cool" antipattern is responsible for many HFE failures.
2. **Rapid prototyping with real users.** The cheapest way to find usability problems is to put a prototype in front of a user and watch them try to use it. Paper prototypes, clickable mockups, and 3D-printed enclosures all work [human-factors-rapid-prototyping-zeman-wood-2025].
3. **Constraints are good, defaults are good.** A well-designed interface constrains user actions to valid ones, and defaults to the safe or common option. The Therac-25's keyboard allowed the operator to start treatment with a misconfigured beam, which is the opposite of this pattern.
4. **Match the user's mental model.** The interface should match how the user thinks the system works, not how the engineers think it works. The 737 MAX MCAS behavior did not match pilots' mental model of the trim system.
5. **Make state visible.** The system should communicate its state to the user, especially when the state is dangerous. A red light, an error message, a confirmation dialog — all are examples of state visibility.
6. **Fail soft, not silent.** When something goes wrong, the system should communicate the failure to the user and, if possible, transition to a safe state. The DieselGate defeat device failed silent: it changed behavior but communicated nothing.

## Best practices

- **HFE is a specialty, not a role.** Programs that have a "UX designer" but no HFE specialty typically address aesthetics and ease-of-use but miss the safety and operational aspects. The Therac-25 had a UX designer; it didn't have a human factors engineer.
- **Iterate with real users.** One usability test with five users finds 85% of usability problems. Multiple rounds of testing with new users find more.
- **Accessibility is not optional.** Designing for users with disabilities (visual, auditory, motor, cognitive) is a legal requirement in most jurisdictions and a design constraint that improves the system for everyone. Captions help in noisy environments; high-contrast modes help in bright sunlight.
- **Train as you would fight.** If operators are trained in a calm classroom but must perform in a high-stress emergency, the training is inadequate. Simulation-based training that includes stress inoculation is the standard for high-consequence systems.
- **Documentation is part of the system.** A well-designed system with bad documentation is a badly-designed system. The cost of a documentation system is small; the cost of an operator making a mistake because of bad documentation is unbounded.

## Research frontiers

Active threads in 2024–2025 HFE research:

- **HFE for AI-driven systems.** How do you design a UI for a system that has an LLM as a component? The model is non-deterministic, opaque, and may produce plausible-but-wrong outputs. HFE patterns are emerging but immature.
- **HFE for autonomous systems.** A self-driving car has no driver but has a remote operator and a passenger. The HFE patterns for the operator and passenger are still being developed.
- **Situation awareness in complex systems.** The classic Endsley model (perception → comprehension → projection) is being extended for AI-augmented decision making. The question of "what does situation awareness mean when the system has more awareness than the operator?" is open [human-factors-rapid-prototyping-zeman-wood-2025].
- **Cognitive workload measurement.** Real-time measurement of cognitive workload (via EEG, eye tracking, heart rate variability) is moving from research to practice. Applications include adaptive automation that adjusts to the operator's current load.

## What to read first

If you only read three things on human factors engineering, read:

1. The HFE for rapid prototyping synthesis — how to integrate HFE into the design loop [human-factors-rapid-prototyping-zeman-wood-2025]
2. The DieselGate case study — a textbook HFE failure as well as a safety failure [dieselgate-smoke-and-mirrors-aftel-2025]
3. The INCOSE SE Handbook v5, ch. 7 (Engineering Specialty) — the HFE section [lifecycle-iso-iec-15288-2023]

## References

1. Human factors for rapid prototyping (Zeman & Wood, 2025)
2. DieselGate — Smoke and Mirrors (Aftel, 2025)
3. INCOSE Systems Engineering Handbook v5 + ISO/IEC 15288:2023 (2023)

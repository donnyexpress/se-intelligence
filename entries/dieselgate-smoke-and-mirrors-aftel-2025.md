---
last_updated: 2026-08-05
topic: eng-domains
triage: read
source_type: case-study
signal: 0.83
maturity: production
domains: eng-domains, auto
source_url: http://sdincose.org/wp-content/uploads/2025/05/Dieselgate_incose_sd_robert_aftel_april_2025.pdf
source_label: Read the chapter case study →
published: 2025-04-15
---

# DieselGate — Smoke and Mirrors

## TL;DR
A systems-engineering postmortem of the 2015 Volkswagen DieselGate scandal, presented as a case study at the INCOSE San Diego chapter. The talk goes through the failure as a SE problem — how the system was designed to defeat the test, not to comply with the requirement — and what the SE lessons are.

## Why it matters
DieselGate is one of the most-studied systems engineering failures of the last 20 years, but most of the public analysis is from a regulatory or legal perspective. This talk is from an SE perspective: what went wrong in the requirements, the architecture, the verification, and the organizational incentives.

## Key ideas
- The failure started in the requirements: a marketing requirement ("appear clean to US emissions tests") that conflicted with a regulatory requirement ("actually be clean"). The architecture chose to satisfy the surface requirement and defeat the substantive one.
- The architecture used a "defeat device" — software that detected when the car was being tested and adjusted behavior. This is a textbook example of architecture designed to defeat verification, not to satisfy the requirement.
- The verification was bypassed because the verification environment didn't match the operational environment. The test was a lab test; the real environment was the road.
- The organizational incentives rewarded hitting the marketing target and did not penalize the architectural choice. SE ethics and incentive design are part of the system.
- The SE lessons are: never let surface requirements override substantive ones; design the verification environment to match the operational environment; treat "defeat" patterns in the architecture as a smell, not a feature.

## So what
This is one of the best case studies for teaching SE ethics, requirement conflict resolution, and verification design. If you teach SE, use this case. If you're a practitioner, the patterns (defeat devices, surface vs substantive requirements, test-environment mismatch) are common in less dramatic forms in everyday work.

## Sources & links
- [Aftel — DieselGate: Smoke and Mirrors, INCOSE San Diego, April 2025 (PDF)](http://sdincose.org/wp-content/uploads/2025/05/Dieselgate_incose_sd_robert_aftel_april_2025.pdf)
- [EPA — Volkswagen Clean Air Act civil settlement](https://www.epa.gov/enforcement/volkswagen-clean-air-act-civil-settlement)

## My take
The talk is excellent because it treats the scandal as an SE failure, not a moral failure of individuals. The architecture was *designed* to satisfy the surface requirement, and the verification was *designed* to not catch it. That's a systems problem, not a bad-apple problem. The talk's biggest contribution is making that framing explicit and drawing the SE lessons.

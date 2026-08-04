---
last_updated: 2026-08-04
topic: eng-domains
triage: watch
source_type: paper
signal: 0.80
maturity: production
domains: sec, mission
source_url: https://psas.scripts.mit.edu/home/
source_label: Read STPA-SafeSec handbook →
---

# Safety and security co-design in critical systems

## TL;DR
Joint safety + security analysis is now standard practice for safety-critical cyber-physical systems (medical, automotive, industrial control, avionics). The techniques — STPA-SafeSec, combined fault trees, attack-safety coupling — are mature.

## Why it matters
The traditional split between safety engineering (ISO 26262, IEC 61508) and security engineering (ISO 21434, IEC 62443) creates blind spots: an attacker-induced sensor failure is both a safety event and a security event. Co-design closes that gap.

## Key ideas
- STPA-SafeSec: extend STAMP/STPA with explicit adversary models; safety constraints become security-tainted.
- Combined HAZOP + threat modeling: same artifact captures both failure modes and attack vectors.
- The "dual-use" of safety mechanisms: an emergency stop can be an attack target and a defense.
- Regulatory pressure: UNECE WP.29 R155/R156 and FDA premarket guidance both expect integrated analysis.

## Sources & links
- [SAE J3061 / ISO 21434 — Cybersecurity engineering for road vehicles](https://www.iso.org/standard/70918.html)
- [IEC 62443 — Industrial communication networks — IT security](https://www.iec.ch/)
- [MIT LL — STPA-SafeSec handbook](https://psas.scripts.mit.edu/home/)

## My take
Co-design is most valuable in the concept and requirements phases. By the time you have separate safety and security teams with separate analysis artifacts, the cost of integrating their findings is high. Set up a single "safety-security analysis" team from the start, with members who understand both domains.

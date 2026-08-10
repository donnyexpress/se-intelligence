---
last_updated: 2026-08-11
topic: space
triage: read
source_type: standard
signal: 0.81
maturity: production
domains: space, eng-domains
source_url: https://nodis3.gsfc.nasa.gov/npg_img/N_PR_8705_002C_/N_PR_8705_002C_.pdf
source_label: NASA NPR 8705.2C (with Change 2) →
published: 2017-07-10
---

# NASA NPR 8705.2C — Human-Rating Requirements for Space Systems

## TL;DR
NASA Procedural Requirements 8705.2C defines the additional processes, procedures, and requirements that a crewed space system must satisfy to earn and maintain NASA Human-Rating Certification. It is the de facto systems engineering framework for human spaceflight in the US, and it carries through to NASA-STD-3001 (Man-Systems Integration Standards) and the technical standards for specific subsystems (e.g., JSC-67723 for human-rated propulsion). For uncrewed space systems, the parallel document is NASA-STD-8729.1 (NASA Flight System Standards). If you're working on a crewed vehicle, this NPR — and its companion standard — is the work plan.

## Why it matters
Human-rating is the most stringent SE bar in spaceflight. It exists because the consequence of failure is loss of crew, and the NPR is the US government's formal answer to "what does good enough look like for human-rated spaceflight." Unlike ISO 26262 (automotive) or IEC 62304 (medical), human-rating is a process certification, not a process standard — the program manager develops a Human-Rating Certification Plan (HRCP) and gets it approved by the NASA Administrator. The HRCP must demonstrate, at every lifecycle review, that the program is satisfying the NPR's 2.2-2.6 requirements. Skipping any of them is not just bad practice — it grounds the program.

## Key ideas
- **Five certification categories** — (1) Process and Standards, (2) Designing the System, (3) Verifying and Validating the System Capabilities and Performance, (4) Flight Testing the System, (5) Certifying and Operating the Human-Rated System. Each has its own set of "shall" statements that must be satisfied.
- **HRCP is the spine** — the Human-Rating Certification Plan is developed at SRR, updated at PDR and CDR, and is the document that ties the entire system to the certification. It is the most-examined document in the program.
- **Three independent inhibits** — many safety-critical systems require three independent inhibits (e.g., on propellant release) so that no single failure or crew error can lead to loss of crew. This is the redundancy philosophy throughout the standard.
- **Human systems integration from day one** — the standard explicitly requires that "the systems engineering approach must equally address and integrate these three key elements: hardware, software, and human systems integration." HSI is not bolted on; it is co-designed.
- **Margin discipline** — human-rated systems carry 2× burn time, 1.1× max single burn, 4× pulse count margin over qualification testing requirements (per JSC-67723 propulsion standard). The margin philosophy is consistent across NASA-STD-3001.
- **Verification before flight** — all propulsion-related qualification testing must be complete before the first uncrewed test flight of the integrated vehicle. There is no "we'll test it in flight" path for human-rated systems.
- **Tailoring via the Compliance Matrix** — programs can seek relief from specific NPR requirements, but the request must be documented in the Compliance Matrix (Appendix H) and approved by the requirements owner. Tailoring is the exception, not the norm.
- **The 2017 Change 2 update** — added the HRCP requirement, expanded the natural environment requirements (SLS-SPEC-159), and added explicit references to the Man-Systems Integration Standards (NASA-STD-3001) and the propulsion hazard control standard (JSC-67723, April 2025).

## So what
If you're working on a human-rated space system, read NPR 8705.2C and NASA-STD-3001 in full before starting requirements work. Then read the relevant subsystem standards (JSC-67723 for propulsion, the EVA suit standards, the environmental control standards — there are dozens). Build the HRCP outline at SRR even if the document is skeletal — it forces the team to think about the certification pathway early. If you're working on an uncrewed space system, look at NASA-STD-8729.1 (Flight System Standards) and NASA-HDBK-1009A (the SysML modeling handbook, approved March 2025) for the MBSE patterns that NASA uses. The NPR 7123.1 family governs both crewed and uncrewed programs at the SE process level.

## When to use
- You're working on a crewed space system (capsule, station, surface habitat, EVA suit, launch vehicle with crew)
- You're preparing for a NASA Human-Rating Certification or supporting a program going through one
- You're applying systems engineering to a space system and need to understand NASA's expectations
- You're working on space systems for another agency and want to anchor on the US framework
- You're an academic or researcher looking for the canonical reference for human-rated SE

## Sources & links
- NASA NPR 8705.2C — https://nodis3.gsfc.nasa.gov/npg_img/N_PR_8705_002C_/N_PR_8705_002C_.pdf
- NASA-STD-3001 Vol 2 App D — https://www.nasa.gov/wp-content/uploads/2025/07/nasa-std-3001-vol-2-app-d-requirements-compliance-matrix.pdf
- NASA-HDBK-1009A (SysML modeling handbook) — https://standards.nasa.gov/system/files/tmp/2025-03-12-NASA-HDBK-1009A.pdf
- JSC-67723 (propulsion hazard control, April 2025) — https://standards.nasa.gov/system/files/tmp/JSC-67723_Propulsion_Standard_Basic_Final%20(1)_0.pdf
- NASA NPR 7123.1C (SE processes and requirements) — https://nodis3.gsfc.nasa.gov/npg_img/N_PR_7123_001C_/N_PR_7123_001C_.pdf
- INCOSE Space Systems Working Group — https://www.incose.org/group/space-systems-working-group/

---
last_updated: 2026-08-10
topic: sec
triage: read
source_type: standard
signal: 0.79
maturity: production
domains: platform
source_url: https://csrc.nist.gov/pubs/sp/800/218/final
source_label: NIST SP 800-218 v1.1 (Feb 2022) →
published: 2022-02-03
---

# NIST SP 800-218 SSDF — Secure Software Development Framework

## TL;DR
The NIST Secure Software Development Framework (SSDF), published as SP 800-218 v1.1 in February 2022, defines a core set of high-level secure software development practices that can be integrated into any SDLC. It is the de facto US government baseline for software supply chain security after Executive Order 14028, and is increasingly adopted as a procurement requirement across federal agencies and their contractors. The framework is organized into four practice groups (PO, PS, PW, RV) and ~40 practice statements.

## Why it matters
Before SSDF, secure software development was a scattered set of practices: OWASP ASVS for web apps, Microsoft SDL for Windows, BSIMM for maturity assessment. There was no US-government-recognized baseline that worked across SDLC methodologies. Executive Order 14028 (May 2021, "Improving the Nation's Cybersecurity") called on NIST to publish guidance for "producers of software" — SSDF is the result, and it is now in federal procurement language. If you sell software to the US government, you are increasingly being asked to demonstrate SSDF conformance.

## Key ideas
- **Four practice groups** — PO (Prepare the Organization), PS (Protect the Software), PW (Produce Well-Secured Software), RV (Identify Vulnerabilities). Each group has 6-12 practice statements.
- **Practices, not controls** — SSDF describes *what* to do, not *how*. Organizations map their existing tools and processes to SSDF practice statements. This is what makes it portable across SDLCs.
- **Software supply chain focus** — practice statements include: define security requirements (PO.1), use threat modeling (PW.2), review and analyze human-readable code (PW.5), use compiler and toolchain hardening (PW.6), provide a software bill of materials (PS.3), and check for vulnerabilities (RV.1).
- **Mapping to EO 14028** — Appendix A in SP 800-218 maps each EO 14028 section to relevant SSDF practices, making it a self-contained response to the order.
- **Vendor conformance language** — procurement contracts now require vendors to attest to SSDF practice coverage. NIST IR 8460 (May 2024) provides a sample attestation questionnaire.
- **Complements, doesn't replace** — SSDF is not a replacement for OWASP, BSIMM, or SAFECode. It's a common vocabulary those frameworks can map into.

## So what
Use SSDF as the framework for your secure SDLC if you're a US federal contractor or supplier. If you're not, treat it as the US-government view of "what good looks like" and use its practice statements as a checklist against your existing security practices. The four groups and ~40 practices are a manageable taxonomy — most organizations can do a gap analysis in a day.

## When to use
- You sell software to the US federal government (now a procurement requirement)
- You want a common vocabulary to align security practices across teams
- You need to attest to secure development practices to customers or auditors
- You're building a software security assurance program and need a starting structure

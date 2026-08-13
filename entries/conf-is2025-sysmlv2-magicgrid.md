---
last_updated: 2026-08-05
topic: system-def
triage: watch
source_type: paper
signal: 0.82
maturity: research
event: is2025
track: modelling
paper_id: https://www.incose.org/docs/default-source/events-documents/is2025/is2025bookabstract-6.pdf
source_url: https://www.incose.org/docs/default-source/events-documents/is2025/is2025bookabstract-6.pdf
source_label: Read in IS 2025 abstract book →
authors: "Aleksandraviciene, A.; Strolia, Z."
year: 2025
published: 2025-07-15
event_date: 2025-07-28
---

# Aleksandraviciene & Strolia — SysML v2 with the MagicGrid Framework

## TL;DR
Dassault Systèmes researchers (Paper #185) do a comparative case study of developing solution architecture in both SysML v1 and SysML v2 within the MagicGrid MBSE methodology — and report on what the v2 transition means for practitioners.

## Why it matters
SysML v2 was approved by OMG on 21 July 2025, in the run-up to IS 2025 Ottawa. This paper is one of the first published case studies on real SysML v2 usage in a well-known methodology. If you're planning a SysML v2 migration, this is field data from the early adopters.

## Key ideas
- MagicGrid (a well-established MBSE methodology) maps cleanly onto SysML v2's new structure, but the mapping requires rethinking the relationship between problem and solution domains.
- SysML v2's textual syntax (KerML) enables more precise specification of constraints and behaviours than v1's graphical-only approach — but it requires users to learn textual notation alongside diagrams.
- Tooling maturity in mid-2025: SysML v2 is usable for new projects but migration from v1 is non-trivial; v1 models need substantial rework, not just translation.
- The paper's most useful finding: the *practices* (tracing, scenario-driven verification) survive the v1→v2 transition. The notation changes; the methodology doesn't.

## Sources & links
- [Paper #185 in IS 2025 abstract book](https://www.incose.org/docs/default-source/events-documents/is2025/is2025bookabstract-6.pdf)
- [SysML v2 / KerML approval announcement, OMG, 21 July 2025](https://www.omg.org/news/releases/pr2025/07-21-25.htm)
- [INCOSE MBSE Initiative](https://www.incose.org/groups/mbse)
- [OpenMBEE — SysML v2 tooling community](https://openmbee.atlassian.net/)

## My take
If you're starting a new MBSE project in 2026, default to SysML v2 unless you have a strong reason not to. The v1→v2 migration cost is real but the *delay* cost is worse: every v1 model you build now is debt you'll pay off in 2–3 years. The paper gives you the field-tested MagicGrid mapping to start from.

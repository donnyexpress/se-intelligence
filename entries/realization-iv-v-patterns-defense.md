---
last_updated: 2026-08-04
topic: realization
triage: read
source_type: paper
signal: 0.75
maturity: production
domains: mission
source_url: https://standards.ieee.org/ieee/1012/7232/
source_label: View IEEE 1012 →
published: 2016-09-30
---

# Integration, Verification & Validation patterns from defense SE

## TL;DR
Defense SE has 50+ years of IV&V practice codified. The patterns that translate to commercial SE: staged integration with explicit exit criteria, independent V&V teams, and treating verification as a design input — not an output.

## Why it matters
Most commercial teams treat V&V as the last gate before release. Defense programs treat it as a continuous design activity from the concept stage. The commercial world can borrow the techniques without the overhead.

## Key ideas
- Verification = "are we building the system right?" Validation = "are we building the right system?" Conflating them is a common root cause of late-stage churn.
- Independent V&V is most valuable in the *first* 20% of the lifecycle, not the last 20%. By the time you find the requirement misinterpretation at integration, it's 50x more expensive to fix.
- Test-as-design: write verification procedures *before* the design, not after. If you can't write a test, you don't understand the requirement.
- Continuous integration extends to continuous *integration testing* — the moment two subsystems meet, verify their interface contract.

## Sources & links
- [DAU — Test & Evaluation Overview](https://www.dau.edu/)
- [IEEE 1012 — Standard for System, Software, and Hardware Verification and Validation](https://standards.ieee.org/ieee/1012/7232/)
- [INCOSE IV&V Working Group](https://www.incose.org/group/integration-verification-validation-working-group/)

## My take
If you only adopt one defense SE practice, make it "test-driven requirements." A requirement that can't be tested was probably not a requirement — it was a hope. The discipline of writing the verification procedure alongside the requirement surfaces that gap in days, not months.

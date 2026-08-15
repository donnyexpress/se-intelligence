#!/usr/bin/env python3
"""
Add "## Related entries" sections to the 11 Wiley SE 29(4) entries.
Cross-references by shared topic, domain_tags, and practice_tags.
"""

import os

RELATIONS = {
    'journal-wiley-se-29-4-duroy-sysmlv2-esa-mbse-methodology': [
        ('conf-is2025-sysmlv2-magicgrid', 'IS 2025 — Magic Grid for SysML v2 (same topic, methodology-pattern)'),
        ('journal-wiley-se-29-4-bourdelles-product-line-confidentiality', 'Wiley 29(4) — product line modeling with confidentiality (same topic, MBSE extension)'),
        ('system-def-mbse-patterns-2025', 'Hand-curated — MBSE patterns synthesis (same topic, established patterns)'),
    ],
    'journal-wiley-se-29-4-wooley-digital-twins-umbrella-review': [
        ('journal-wiley-se-29-4-duroy-sysmlv2-esa-mbse-methodology', 'Wiley 29(4) — SysML v2 ESA methodology (related: both about the model as operational runtime)'),
        ('conf-is2025-p283-authoritative-broker-of-truth-abot-synchronizing-m', 'IS 2025 — DT synchronization (same topic, digital twin)'),
        ('system-def-mbse-patterns-2025', 'Hand-curated — MBSE patterns synthesis (the model extends to operational)'),
    ],
    'journal-wiley-se-29-4-bourdelles-product-line-confidentiality': [
        ('journal-wiley-se-29-4-duroy-sysmlv2-esa-mbse-methodology', 'Wiley 29(4) — SysML v2 ESA (same topic, MBSE methodology scale)'),
        ('conf-is2024-p099-enabling-digital-engineering-with-federated-plm-ex', 'IS 2024 — federated PLM/MBSE (same domain tag, both about multi-stakeholder model views)'),
        ('conf-is2024-p054-secure-design-a-practical-approach-for-systems-eng', 'IS 2024 — secure design first-class activity (related: confidentiality vs security)'),
    ],
    'journal-wiley-se-29-4-fu-cluster-readiness-levels': [
        ('conf-is2024-p557-omg-standard-to-extend-sysml-to-reliability-engine', 'IS 2024 — RAM as first-class SysML attribute (same domain, both about integrating specialty into architecture)'),
        ('specialty-reliability-fmea-rbd-milhdbk-217', 'Hand-curated — FMEA/RBD reliability (same practice tag, both are readiness/reliability methods)'),
        ('journal-wiley-se-29-4-chaudemar-safety-dynamic-procedure-uas', 'Wiley 29(4) — UAS safety procedures (same domain tag, both system-level assessment)'),
    ],
    'journal-wiley-se-29-4-chaudemar-safety-dynamic-procedure-uas': [
        ('journal-wiley-se-29-4-fu-cluster-readiness-levels', 'Wiley 29(4) — cluster-based SRL (same domain tag, both system-level assessment methods)'),
        ('conf-is2025-fmea-multilevel', 'IS 2025 — multi-level FMEA from architecture (same topic, both about MBSE-driven safety analysis)'),
        ('specialty-safety-stpa-leveson-2011', 'Hand-curated — STPA (same specialty, both safety-patterns)'),
    ],
    'journal-wiley-se-29-4-obiako-smts-agent-based-pedagogy': [
        ('conf-is2025-pavalkis-mbde-robotic-arm', 'IS 2025 — MBDE for mechatronic/robotic (same domain, both about agent-based and mechatronic modeling)'),
        ('ml-sys-inference-cost-curves-2026', 'Hand-curated — ML inference cost curves (same practice tag, both about understanding ML system behavior)'),
    ],
    'journal-wiley-se-29-4-xu-salado-set-based-verification-planning': [
        ('conf-is2025-fmea-multilevel', 'IS 2025 — multi-level FMEA (same topic, both verification-strategy methods)'),
        ('conf-is2025-p059-application-of-a-verification-complexity-framework', 'IS 2025 — verification complexity framework (same topic, verification strategy)'),
    ],
    'journal-wiley-se-29-4-kaplan-robotaxis-labor-transitions': [
        ('sos-sos-architecting-patterns', 'Hand-curated — SoS architecting patterns (same topic, both about SoS-level transition management)'),
        ('journal-wiley-se-29-4-bakhshi-capability-complexity-eaf', 'Wiley 29(4) — capability complexity (same topic, both about measuring/managing SoS complexity)'),
    ],
    'journal-wiley-se-29-4-bakhshi-capability-complexity-eaf': [
        ('sos-sos-architecting-patterns', 'Hand-curated — SoS architecting patterns (same topic, both about managing SoS)'),
        ('journal-wiley-se-29-4-kaplan-robotaxis-labor-transitions', 'Wiley 29(4) — robotaxis SoS transition (same topic, both SoS measurement)'),
        ('mission-engineering-uaf-gagliardi-2024', 'IS 2024 — Mission Engineering with UAF (same domain tag, both defense-focused SoS methods)'),
    ],
    'journal-wiley-se-29-4-georgsen-phas-attention-uncertainty': [
        ('sys-fund-ackoff-systems-thinking', 'Hand-curated — Ackoff systems thinking (same topic, both about systems thinking foundations)'),
        ('conf-is2025-p053-applying-systems-thinking-and-soft-systems-methodo', 'IS 2025 — soft systems methodology in defense (same topic, both uncertainty-focused methods)'),
    ],
    'journal-wiley-se-29-4-jung-stride-smart-haccp-korean-food': [
        ('specialty-safety-stpa-leveson-2011', 'Hand-curated — STPA (related: both systematic safety/security analysis methods)'),
        ('conf-is2024-p176-translating-the-stpa-sec-security-method-into-a-mo', 'IS 2024 — STPA-SEC in SysML (related: MBSE-driven threat modeling, contrasts with STRIDE)'),
        ('conf-is2024-p079-long-term-trends-in-security-threats-and-an-ap-pro', 'IS 2024 — long-term security threats trends (same domain, both about threat analysis)'),
    ],
}


# Output dir
out_dir = 'entries'

written = 0
for key, relations in RELATIONS.items():
    out_path = os.path.join(out_dir, key + '.md')
    if not os.path.exists(out_path):
        print(f'  SKIP: {key} (not found)')
        continue

    with open(out_path) as f:
        content = f.read()

    # Skip if Related entries section already exists
    if '## Related entries' in content:
        print(f'  SKIP: {key} (already has section)')
        continue

    # Build the section
    section = '\n\n## Related entries\n\n'
    section += 'Cross-references generated by shared topic, domain tag, and practice tag. '
    section += 'Used to navigate the knowledge base from this peer-reviewed paper to adjacent work.\n\n'
    for rel_key, rel_label in relations:
        section += f'- [{rel_key}] — {rel_label}\n'

    # Append
    with open(out_path, 'a') as f:
        f.write(section)
    written += 1
    print(f'  ADDED: {key} ({len(relations)} relations)')

print(f'\nTotal updated: {written}')

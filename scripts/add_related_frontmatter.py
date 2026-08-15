#!/usr/bin/env python3
"""
Add `related: [key1, key2, ...]` frontmatter to the 11 Wiley entries,
and strip the manual "## Related entries" body section (since the
app.js will now render the related-section div automatically).
"""

import json
import re
import os

RELATIONS = {
    'journal-wiley-se-29-4-duroy-sysmlv2-esa-mbse-methodology': [
        'conf-is2025-sysmlv2-magicgrid',
        'journal-wiley-se-29-4-bourdelles-product-line-confidentiality',
        'system-def-mbse-patterns-2025',
    ],
    'journal-wiley-se-29-4-wooley-digital-twins-umbrella-review': [
        'journal-wiley-se-29-4-duroy-sysmlv2-esa-mbse-methodology',
        'conf-is2025-p283-authoritative-broker-of-truth-abot-synchronizing-m',
        'system-def-mbse-patterns-2025',
    ],
    'journal-wiley-se-29-4-bourdelles-product-line-confidentiality': [
        'journal-wiley-se-29-4-duroy-sysmlv2-esa-mbse-methodology',
        'conf-is2024-p099-enabling-digital-engineering-with-federated-plm-ex',
        'conf-is2024-p054-secure-design-a-practical-approach-for-systems-eng',
    ],
    'journal-wiley-se-29-4-fu-cluster-readiness-levels': [
        'conf-is2024-p557-omg-standard-to-extend-sysml-to-reliability-engine',
        'specialty-reliability-fmea-rbd-milhdbk-217',
        'journal-wiley-se-29-4-chaudemar-safety-dynamic-procedure-uas',
    ],
    'journal-wiley-se-29-4-chaudemar-safety-dynamic-procedure-uas': [
        'journal-wiley-se-29-4-fu-cluster-readiness-levels',
        'conf-is2025-fmea-multilevel',
        'specialty-safety-stpa-leveson-2011',
    ],
    'journal-wiley-se-29-4-obiako-smts-agent-based-pedagogy': [
        'conf-is2025-pavalkis-mbde-robotic-arm',
        'ml-sys-inference-cost-curves-2026',
    ],
    'journal-wiley-se-29-4-xu-salado-set-based-verification-planning': [
        'conf-is2025-fmea-multilevel',
        'conf-is2025-p059-application-of-a-verification-complexity-framework',
    ],
    'journal-wiley-se-29-4-kaplan-robotaxis-labor-transitions': [
        'sos-sos-architecting-patterns',
        'journal-wiley-se-29-4-bakhshi-capability-complexity-eaf',
    ],
    'journal-wiley-se-29-4-bakhshi-capability-complexity-eaf': [
        'sos-sos-architecting-patterns',
        'journal-wiley-se-29-4-kaplan-robotaxis-labor-transitions',
        'mission-engineering-uaf-gagliardi-2024',
    ],
    'journal-wiley-se-29-4-georgsen-phas-attention-uncertainty': [
        'sys-fund-ackoff-systems-thinking',
        'conf-is2025-p053-applying-systems-thinking-and-soft-systems-methodo',
    ],
    'journal-wiley-se-29-4-jung-stride-smart-haccp-korean-food': [
        'specialty-safety-stpa-leveson-2011',
        'conf-is2024-p176-translating-the-stpa-sec-security-method-into-a-mo',
        'conf-is2024-p079-long-term-trends-in-security-threats-and-an-ap-pro',
    ],
}

# Verify keys exist
existing = set(f[:-3] for f in os.listdir('entries') if f.endswith('.md'))
for key, rels in RELATIONS.items():
    for r in rels:
        if r not in existing:
            print(f'WARNING: relation {r} (for {key}) does not exist as an entry')

# Update each entry
for key, rels in RELATIONS.items():
    path = f'entries/{key}.md'
    if not os.path.exists(path):
        print(f'  SKIP: {key} (not found)')
        continue
    with open(path) as f:
        content = f.read()

    # Build the related frontmatter line
    related_line = f'related: {json.dumps(rels)}'
    # Hmm, need json — use simple list format
    related_line = 'related: [' + ', '.join(rels) + ']'

    # Insert into frontmatter (right before the closing ---)
    if 'related:' in content.split('---')[1]:
        print(f'  SKIP: {key} (already has related:)')
        continue
    parts = content.split('---', 2)
    if len(parts) < 3:
        print(f'  WARN: {key} (no closing ---)')
        continue
    fm = parts[1]
    new_fm = fm.rstrip() + '\n' + related_line + '\n'
    content = '---' + new_fm + '---' + parts[2]

    # Strip the manual "## Related entries" section from the body
    pattern = r'\n\n## Related entries\n.*?(?=\n## |\Z)'
    content = re.sub(pattern, '', content, flags=re.DOTALL)

    with open(path, 'w') as f:
        f.write(content)
    print(f'  UPDATED: {key} ({len(rels)} relations)')

import json  # placed at end so we can use it in case I need it

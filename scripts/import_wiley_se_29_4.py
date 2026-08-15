#!/usr/bin/env python3
"""
Generate 11 entry .md files for the Wiley Systems Engineering journal
Vol 29 No 4 (July 2026), based on the issue info PDF and OpenAlex metadata.

Run: python3 scripts/import_wiley_se_29_4.py
"""

import json
import os

# Mapping: doi -> entry config
ENTRIES = {
    '10.1002/sys.70039': {
        'key': 'journal-wiley-se-29-4-bakhshi-capability-complexity-eaf',
        'topic': 'sos',
        'domain_tags': ['defense'],
        'practice_tags': ['observ'],
        'triage': 'read',
        'signal': 0.92,
        'authors': 'Javad Bakhshi, Mahmoud Efatmaneshnik',
        'authors_short': 'Bakhshi & Efatmaneshnik (2 authors)',
    },
    '10.1002/sys.70052': {
        'key': 'journal-wiley-se-29-4-chaudemar-safety-dynamic-procedure-uas',
        'topic': 'eng-domains',
        'domain_tags': ['auto'],
        'practice_tags': ['reliab'],
        'triage': 'read',
        'signal': 0.88,
        'authors': 'Jean-Charles Chaudemar, Kevin Delmas, Charles Mathou, Pierre de Saqui-Sannes',
        'authors_short': 'Chaudemar, Delmas, Mathou, de Saqui-Sannes (4 authors)',
    },
    '10.1002/sys.70041': {
        'key': 'journal-wiley-se-29-4-georgsen-phas-attention-uncertainty',
        'topic': 'sys-fund',
        'domain_tags': [],
        'practice_tags': [],
        'triage': 'read',
        'signal': 0.85,
        'authors': 'Roar Elias Georgsen',
        'authors_short': 'Georgsen (1 author)',
    },
    '10.1002/sys.70042': {
        'key': 'journal-wiley-se-29-4-fu-cluster-readiness-levels',
        'topic': 'eng-domains',
        'domain_tags': ['defense'],
        'practice_tags': ['reliab'],
        'triage': 'read',
        'signal': 0.90,
        'authors': 'Justin J. Fu, Thomas A. Mazzuchi, Shahram Sarkani',
        'authors_short': 'Fu, Mazzuchi, Sarkani (3 authors)',
    },
    '10.1002/sys.70043': {
        'key': 'journal-wiley-se-29-4-kaplan-robotaxis-labor-transitions',
        'topic': 'sos',
        'domain_tags': ['auto'],
        'practice_tags': ['ml-sys'],
        'triage': 'read',
        'signal': 0.87,
        'authors': 'Leah Kaplan, Zoe Szajnfarber, John Paul Helveston',
        'authors_short': 'Kaplan, Szajnfarber, Helveston (3 authors)',
    },
    '10.1002/sys.70044': {
        'key': 'journal-wiley-se-29-4-bourdelles-product-line-confidentiality',
        'topic': 'system-def',
        'domain_tags': ['manufacturing'],
        'practice_tags': [],
        'triage': 'read',
        'signal': 0.84,
        'authors': 'Michel Bourdellès, Jamal El Hachem, Salah Sadou',
        'authors_short': 'Bourdellès, El Hachem, Sadou (3 authors)',
    },
    '10.1002/sys.70045': {
        'key': 'journal-wiley-se-29-4-jung-stride-smart-haccp-korean-food',
        'topic': 'sec',
        'domain_tags': ['manufacturing'],
        'practice_tags': ['incid'],
        'triage': 'read',
        'signal': 0.86,
        'authors': 'Sehee Jung, Haeun Lee, Sungjin Kim, Sangyoon Lee, Kyounggon Kim',
        'authors_short': 'Jung, Lee, Kim, Lee, Kim (5 authors)',
    },
    '10.1002/sys.70046': {
        'key': 'journal-wiley-se-29-4-duroy-sysmlv2-esa-mbse-methodology',
        'topic': 'system-def',
        'domain_tags': ['space'],
        'practice_tags': ['platform'],
        'triage': 'must-read',
        'signal': 0.95,
        'authors': 'Matteo Duroy, Alberto Gonzalez Fernandez, Nikolena Christofi, Nils Fischer, Marcel Verhoef',
        'authors_short': 'Duroy, Gonzalez Fernandez, Christofi, Fischer, Verhoef (5 authors)',
    },
    '10.1002/sys.70047': {
        'key': 'journal-wiley-se-29-4-obiako-smts-agent-based-pedagogy',
        'topic': 'eng-domains',
        'domain_tags': ['auto'],
        'practice_tags': ['ml-sys'],
        'triage': 'read',
        'signal': 0.83,
        'authors': 'Ifezue V. Obiako, Sean B. Walker, Kari Lippert, Robert Cloutier',
        'authors_short': 'Obiako, Walker, Lippert, Cloutier (4 authors)',
    },
    '10.1002/sys.70048': {
        'key': 'journal-wiley-se-29-4-xu-salado-set-based-verification-planning',
        'topic': 'realization',
        'domain_tags': [],
        'practice_tags': [],
        'triage': 'must-read',
        'signal': 0.92,
        'authors': 'Peng Xu, Alejandro Salado',
        'authors_short': 'Xu & Salado (2 authors)',
    },
    '10.1002/sys.70049': {
        'key': 'journal-wiley-se-29-4-wooley-digital-twins-umbrella-review',
        'topic': 'system-def',
        'domain_tags': [],
        'practice_tags': ['observ', 'ml-sys'],
        'triage': 'must-read',
        'signal': 0.95,
        'authors': 'Ana Wooley, Garrett Dimson, Julia Bitencourt',
        'authors_short': 'Wooley, Dimson, Bitencourt (3 authors)',
    },
}

# Load OpenAlex data
data = json.load(open('/tmp/wiley_papers.json'))

# Output dir
out_dir = 'entries'
os.makedirs(out_dir, exist_ok=True)

# Get list of existing keys for collision check
existing = set(f[:-3] for f in os.listdir(out_dir) if f.endswith('.md'))
print(f'Existing entries: {len(existing)}')

written = []
for doi, cfg in ENTRIES.items():
    if cfg['key'] in existing:
        print(f'  SKIP: {cfg["key"]} (exists)')
        continue
    paper = data.get(doi, {})
    if not paper:
        print(f'  MISSING: {doi} (no data)')
        continue

    # Build the entry content
    title = paper.get('title', '').replace('‐', '-')
    abstract = paper.get('abstract', '').replace('‐', '-')
    keywords = paper.get('keywords', [])[:6]
    pub_date = paper.get('date', '2026-02-01')
    authors_full = cfg['authors']

    # Parse authors for the frontmatter
    author_list = [a.strip() for a in authors_full.split(',')]
    author_count = len(author_list)
    last_name = author_list[0].split()[-1]

    content = f'''---
last_updated: 2026-08-15
topic: {cfg['topic']}
triage: {cfg['triage']}
source_type: paper-journal
signal: {cfg['signal']}
maturity: established
event: wiley-se-29-4
track: july-2026-issue
domain_tags: {json.dumps(cfg['domain_tags'])}
practice_tags: {json.dumps(cfg['practice_tags'])}
authors: "{cfg['authors']}"  # {author_count} authors
year: 2026
published: {pub_date}
doi: {doi}
source_url: https://incose.onlinelibrary.wiley.com/doi/{doi}
source_label: "Wiley Systems Engineering 29(4) — {last_name} et al. 2026"
---

# {title}

## TL;DR

{abstract}

## Why it matters

This is a peer-reviewed paper published in the flagship *Systems Engineering* journal (Wiley, the official journal of INCOSE), Volume 29 Number 4, July 2026. Authors: {authors_full}.

- **DOI**: [{doi}](https://incose.onlinelibrary.wiley.com/doi/{doi})
- **Issue**: *Systems Engineering* Vol 29 No 4 (July 2026) — DOI `10.1002/sys.70077`
- **Publisher**: Wiley Periodicals LLC for INCOSE
- **Publication date (online first)**: {pub_date}
- **Keywords (from OpenAlex)**: {", ".join(keywords) if keywords else "(not indexed)"}

## Key ideas

- **Authors**: {authors_full}
- **Primary topic (SE Intelligence taxonomy)**: {cfg['topic']}
- **App-domain tags**: {", ".join(cfg['domain_tags']) if cfg['domain_tags'] else "(none — cross-industry)"}
- **Practice-area tags**: {", ".join(cfg['practice_tags']) if cfg['practice_tags'] else "(none)"}
- **Triage**: {cfg['triage']} ({"must-read: foundational or transformative for the topic" if cfg['triage'] == 'must-read' else "read: substantive peer-reviewed contribution"})

## When to use

- When researching this paper's specific topic area in the 2026 mid-year peer-reviewed literature
- When looking for a citable, peer-reviewed source from the INCOSE-affiliated *Systems Engineering* journal
- When cross-referencing against IS 2024-2025 conference work on the same topic (peer-reviewed > conference)

## Sources & links

- *Systems Engineering* Vol 29 No 4 (July 2026) — Wiley Online Library
- Issue info page: [10.1002/sys.70077](https://incose.onlinelibrary.wiley.com/doi/10.1002/sys.70077)
- Article landing: [https://incose.onlinelibrary.wiley.com/doi/{doi}](https://incose.onlinelibrary.wiley.com/doi/{doi})
- OpenAlex record: https://api.openalex.org/works/doi:{doi}
'''

    # Write
    out_path = os.path.join(out_dir, cfg['key'] + '.md')
    with open(out_path, 'w') as f:
        f.write(content)
    print(f'  WROTE: {cfg["key"]}.md')
    written.append(cfg['key'])

print(f'\\nTotal written: {len(written)}')
print('Keys to add to entries-index.js:')
for k in ENTRIES.keys():
    cfg = ENTRIES[k]
    print(f'  \'{cfg["key"]}\',')

#!/usr/bin/env python3
"""
Parse the IS2025 Book of Abstracts (extracted from the public PDF) and
generate SE Intelligence entry markdown files.

Input:  /tmp/incose_papers/is2025_abstracts.txt  (from `pdftotext`)
Output: entries/conf-is2025-pNNN-<slug>.md  + a generated entries-is2025.json list

The PDF has both "Paper#<n>" (full academic papers) and "Presentation#<n>"
(industry/poster presentations) sections. We extract both, since the
INCOSE community values the presentations too. Each gets a unique key.
"""
import re
import os
import sys
import json

TEXT_PATH = os.environ.get('IS2025_TEXT', '/tmp/incose_papers/is2025_abstracts.txt')
ENTRIES_DIR = os.environ.get('ENTRIES_DIR', 'entries')

TEXT = open(TEXT_PATH).read()

# Map IS topic codes to SE Intelligence primary topic keys
TOPIC_MAP = {
    'sys-fund':    ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9'],
    'lifecycle':   [],
    'concept-def': ['2.1', '2.2'],
    'system-def':  ['2.3', '2.4', '2.5', '2.6', '5.6', '5.7', '5.9', '5.10'],
    'realization': ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8'],
    'deploy-use':  [],
    'eng-domains': ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '4.10'],
    'management':  ['9.', '3.9', '3.10'],
    'ml-sys':      ['5.11', '5.12'],
    'sos':         [],
    'sec':         [],
    'defense':     ['6.', '2. Aerospace', '13. Maritime'],
    'auto':        ['11.', '21.'],
    'health':      ['7.'],
    'energy':      ['8.', '10. Environmental'],
    'infra':       ['12.'],
    'space':       ['14.', '15.'],
    'manufacturing': ['20.'],
}

# Map IS topic codes to IS2026 track keys (closest available)
TRACK_MAP = {
    'innovation':    ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9'],
    'management':     ['3.5', '3.7', '3.8', '3.9', '3.10', '9.'],
    'uncertainty':    ['1.1', '1.5'],
    'modelling':      ['5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '5.10', '5.11', '5.12'],
    'org-skills':     ['3.5', '4.5', '4.10'],
    'service':        ['18.', '17.'],
    'society':        ['10.', '20.', '22.'],
    'conception':     ['2.1', '2.2', '2.3'],
    'se-disciplines': ['2.4', '2.5', '2.6', '3.1', '3.2', '3.3', '3.4', '3.6', '4.1', '4.2', '4.3', '4.4', '4.6', '4.7', '4.8', '4.9'],
}


def is_topics_to_track(topics_text):
    """Pick an IS2026 track for the entry, based on the IS topic codes."""
    text = topics_text.lower()
    for m in re.finditer(r'(\d+)\.(\d+)\.?', topics_text):
        prefix = f'{m.group(1)}.{m.group(2)}'
        for track, prefixes in TRACK_MAP.items():
            if prefix in prefixes:
                return track
    return 'modelling'  # safe default


def is_codes_to_se_topics(topics_text, keywords_text='', abstract_text=''):
    """Return ALL SE Intelligence topic keys that match the IS2025 paper.

    Returns (primary, domain_tags, practice_tags) where:
      - primary: single best-fit topic for grouping
      - domain_tags: app domains the paper touches (defense, health, etc.)
      - practice_tags: practice areas the paper touches (ml-sys, observ, etc.)
    """
    text = (topics_text + ' ' + keywords_text + ' ' + abstract_text).lower()

    # App domain detection (any match -> domain_tags)
    app_domains = set()
    if 'defense' in text or 'aerospace' in text or 'military' in text or 'maritime' in text or 'naval' in text:
        app_domains.add('defense')
    if 'automotive' in text or 'autonomous vehicle' in text or 'arp4754' in text or 'arp4761' in text:
        app_domains.add('auto')
    if 'health' in text or 'medical' in text or 'clinical' in text or 'hospital' in text:
        app_domains.add('health')
    if 'energy' in text or 'environment' in text or 'sustainability' in text or 'nuclear' in text or 'reactor' in text or 'wind' in text or 'solar' in text:
        app_domains.add('energy')
    if 'infrastructure' in text or 'railway' in text or 'rail' in text or 'maritime' in text or 'highway' in text or 'construction' in text or 'bridge' in text or 'water system' in text:
        app_domains.add('infra')
    if 'space' in text or 'satellite' in text or 'orbit' in text or 'telescope' in text or 'spectrograph' in text:
        app_domains.add('space')
    if 'manufacturing' in text or 'industry 4' in text or 'industry 5' in text or 'factory' in text or 'production system' in text:
        app_domains.add('manufacturing')
    if 'finance' in text or 'financial' in text or 'banking' in text or 'insurance' in text:
        app_domains.add('finance')

    # Practice area detection (any match -> practice_tags)
    practice_areas = set()
    if 'observability' in text or 'monitoring' in text or 'telemetry' in text or 'ebpf' in text or 'metrics' in text:
        practice_areas.add('observ')
    if 'performance' in text or 'latency' in text or 'throughput' in text or 'bottleneck' in text or 'tail latency' in text:
        practice_areas.add('perf')
    if 'platform' in text and ('engineering' in text or 'team' in text or 'developer' in text or 'idp' in text):
        practice_areas.add('platform')
    if 'reliability' in text or 'slo' in text or 'error budget' in text or 'fault toleran' in text or 'resilien' in text:
        practice_areas.add('reliab')
    if 'incident' in text or 'postmortem' in text or 'post-mortem' in text or 'sre' in text or 'on-call' in text or 'oncall' in text:
        practice_areas.add('incid')
    if 'ml system' in text or 'ml platform' in text or 'machine learning' in text or 'inference' in text or 'training pipeline' in text or ' llm' in text or 'chatgpt' in text or 'gpt-4' in text or 'gpt-' in text or 'neural network' in text:
        practice_areas.add('ml-sys')
    if 'distributed' in text or 'consensus' in text or 'raft' in text or 'partition' in text or 'replication' in text:
        practice_areas.add('dist-sys')

    # SEBoK primary topic detection via numeric codes (1.x, 2.x, 3.x, 4.x, 5.x)
    sebok_primary = set()
    for m in re.finditer(r'(\d+)\.(\d+)\.?', topics_text):
        prefix = f'{m.group(1)}.{m.group(2)}'
        for se_topic, prefixes in TOPIC_MAP.items():
            if se_topic in {'defense', 'auto', 'health', 'energy', 'infra', 'space', 'manufacturing'}:
                continue  # handled above
            if prefix in prefixes or f'{m.group(1)}.' in prefixes:
                sebok_primary.add(se_topic)
                break

    # Special keyword to SEBoK primary
    if 'systems of systems' in text or 'system-of-systems' in text or 'system of systems' in text or 'sos' in text or 'federat' in text or 'collaborative' in text and 'system' in text:
        sebok_primary.add('sos')
    if 'enterprise' in text and ('se' in text or 'system' in text):
        sebok_primary.add('management')
    if 'social' in text or 'sociotechnical' in text or 'socio-technical' in text:
        sebok_primary.add('sys-fund')  # 22 Social systems → sys-fund

    # App domain code mapping (6.x, 7.x, 11.x, 13.x, etc.) when keywords missed
    for m in re.finditer(r'(\d+)\.', topics_text):
        n = int(m.group(1))
        if n == 6 or n == 2:  # 6. Defense, 2. Aerospace
            app_domains.add('defense')
        elif n == 7:
            app_domains.add('health')
        elif n == 8 or n == 10:
            app_domains.add('energy')
        elif n == 11 or n == 21:
            app_domains.add('auto')
        elif n == 12 or n == 13:
            app_domains.add('infra')
        elif n == 14 or n == 15:
            app_domains.add('space')
        elif n == 20:
            app_domains.add('manufacturing')

    # Pick PRIMARY topic:
    #   1. SEBoK primary if any
    #   2. else first app domain
    #   3. else eng-domains (fallback)
    sebok_priority = ['sos', 'system-def', 'realization', 'concept-def', 'sys-fund', 'lifecycle',
                      'deploy-use', 'management', 'eng-domains']
    primary = None
    for p in sebok_priority:
        if p in sebok_primary:
            primary = p
            break
    if not primary:
        if app_domains:
            # Pick app domain by priority
            for d in ['defense', 'health', 'energy', 'auto', 'space', 'manufacturing', 'infra', 'finance']:
                if d in app_domains:
                    primary = d
                    break
        else:
            primary = 'eng-domains'

    # Add primary itself to domain_tags if it's an app domain (so dashboard counts it)
    if primary in {'defense', 'auto', 'health', 'energy', 'infra', 'space', 'manufacturing', 'finance'}:
        app_domains.add(primary)
    # Add primary to practice_tags if it's a practice area
    if primary in {'observ', 'perf', 'platform', 'reliab', 'incid', 'ml-sys', 'dist-sys'}:
        practice_areas.add(primary)

    return primary, sorted(app_domains), sorted(practice_areas)


def parse_section(content):
    lines = content.strip().split('\n')
    while lines and not lines[0].strip():
        lines.pop(0)
    if not lines:
        return None

    title_lines = [lines[0].strip()]
    i = 1
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            break
        if (line.startswith('Copyright') or
            line.startswith('Keywords') or
            line.startswith('Topics') or
            line.startswith('Abstract')):
            break
        if re.search(r'[\w\.\-]+@[\w\.\-]+\.[a-zA-Z]{2,}', line):
            break
        if re.search(r'\([A-Z][^)]+\)\s*(-\s*)?[\w\.\-]+@', line):
            break
        if re.match(r'^[A-Z][a-z]+(\s+[A-Z]\.?)*\s+[A-Z][a-z]+\s+\([A-Z]', line):
            break
        title_lines.append(line)
        i += 1
    title = ' '.join(title_lines)

    authors = []
    while i < len(lines):
        line = lines[i].strip()
        if not line or 'Copyright' in line or 'Keywords' in line:
            break
        authors.append(line)
        i += 1

    while i < len(lines) and 'Keywords' not in lines[i]:
        i += 1

    keywords = []
    if i < len(lines) and 'Keywords' in lines[i]:
        kw_line = lines[i].replace('Keywords.', '').replace('Keywords', '').strip()
        if kw_line:
            keywords.append(kw_line)
        i += 1
        while i < len(lines):
            line = lines[i].strip()
            if not line or 'Topics' in line or 'Abstract' in line:
                break
            keywords.append(line)
            i += 1

    topics = ''
    if i < len(lines) and 'Topics' in lines[i]:
        topic_line = lines[i].replace('Topics.', '').replace('Topics', '').strip()
        topics = topic_line
        i += 1
        while i < len(lines):
            line = lines[i].strip()
            if not line or 'Abstract' in line:
                break
            topics += ' ' + line
            i += 1

    abstract = ''
    if i < len(lines) and 'Abstract' in lines[i]:
        abstract_start = lines[i].replace('Abstract.', '').replace('Abstract', '').strip()
        abstract_lines = [abstract_start] if abstract_start else []
        i += 1
        while i < len(lines):
            line = lines[i].strip()
            if not line:
                break
            abstract_lines.append(line)
            i += 1
        abstract = ' '.join(abstract_lines).strip()

    return {
        'title': title,
        'authors': authors,
        'keywords': ' '.join(keywords).strip(),
        'topics': topics.strip(),
        'abstract': abstract,
    }


def slugify(text, max_len=50):
    s = text.lower()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'\s+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')[:max_len]


def parse_first_author(authors):
    if not authors:
        return ''
    line = authors[0]
    m = re.match(r'^([^(]+?)\s*\(', line)
    if m:
        first = m.group(1).strip()
    else:
        first = line.split('-')[0].strip()
    parts = first.split(',')
    return parts[0].strip().split()[-1] if parts[0].strip() else ''


def build_entry(section_type, section_id, parsed):
    """section_type: 'Paper' or 'Presentation'"""
    # v1.13: multi-tagging — paper can cut through multiple domains
    primary, domain_tags, practice_tags = is_codes_to_se_topics(
        parsed['topics'], parsed['keywords'], parsed['abstract']
    )
    se_topic = primary  # backwards-compat: topic: field = primary
    track = is_topics_to_track(parsed['topics'])
    title = re.sub(r'\s+', ' ', parsed['title']).strip()
    last_name = parse_first_author(parsed['authors'])

    abstract = re.sub(r'\s+', ' ', parsed['abstract']).strip()
    if len(abstract) > 1500:
        abstract = abstract[:1500].rsplit('.', 1)[0] + '.'

    keywords = parsed['keywords'].replace(';', ',').replace('.', '').strip()

    topics_codes = []
    for m in re.finditer(r'(\d+)\.(\d+)\.?\s+([A-Z][^,;\n]+?)(?=[,;\n]|\d+\.\d+|$)', parsed['topics']):
        topics_codes.append(f'{m.group(1)}.{m.group(2)} {m.group(3).strip()}')
    topics_display = ', '.join(topics_codes[:6])

    triage = 'watch' if se_topic in ('sos', 'ml-sys') else 'read'

    slug = slugify(title)
    # Pad ID to 3 digits for papers, 3 for presentations (matches existing pattern)
    id_padded = str(section_id).zfill(3)
    if section_type == 'Paper':
        key = f'conf-is2025-p{id_padded}-{slug}'
        source_label = f'IS 2025 Paper #{section_id} (Ottawa)'
        event_type = 'is2025-paper'
    else:
        key = f'conf-is2025-pres{id_padded}-{slug}'
        source_label = f'IS 2025 Presentation #{section_id} (Ottawa)'
        event_type = 'is2025-presentation'

    authors_display = '; '.join(parsed['authors'][:5])
    if len(parsed['authors']) > 5:
        authors_display += f'; +{len(parsed["authors"]) - 5} more'

    # JSON arrays for tags (no tags field if empty)
    domain_tags_str = json.dumps(domain_tags) if domain_tags else '[]'
    practice_tags_str = json.dumps(practice_tags) if practice_tags else '[]'

    md = f'''---
last_updated: 2026-08-13
topic: {se_topic}
triage: {triage}
source_type: paper
signal: 0.72
maturity: established
event: is2025
track: {track}
domain_tags: {domain_tags_str}
practice_tags: {practice_tags_str}
authors: "{last_name} et al."{("  # " + str(len(parsed["authors"])) + " authors") if len(parsed["authors"]) > 1 else ""}
year: 2025
published: 2025-07-15
source_url: https://www.incose.org/docs/default-source/events-documents/is2025/IS2025BookAbstract.pdf
source_label: {source_label} →
---

# {title}

## TL;DR

{abstract}

## Why it matters

This {"paper" if section_type == "Paper" else "presentation"} was {"presented" if section_type == "Paper" else "delivered"} at the 35th Annual INCOSE International Symposium (IS 2025) in Ottawa, Canada, July 26–31, 2025. Authors: {authors_display}.

## Key ideas

'''
    if keywords:
        md += f'- **Keywords**: {keywords}\n'
    if topics_display:
        md += f'- **IS2025 topic codes**: {topics_display}\n'
    md += f'- **Primary topic (SE Intelligence taxonomy)**: {se_topic}\n'
    if domain_tags:
        md += f'- **Also tagged (app domains)**: {", ".join(domain_tags)}\n'
    if practice_tags:
        md += f'- **Also tagged (practice areas)**: {", ".join(practice_tags)}\n'

    md += '''
## When to use

- When researching this paper's specific topic area in the 2025 SE community work
- When looking for a citable, peer-reviewed source from the INCOSE IS 2025 program
- When cross-referencing against other IS 2025 work in the same topic area

## Sources & links

- INCOSE IS 2025 Book of Abstracts (PDF) — https://www.incose.org/docs/default-source/events-documents/is2025/IS2025BookAbstract.pdf
- INCOSE Previous International Events — https://www.incose.org/events-education/previous-international-events/
- 35th Annual INCOSE International Symposium, Ottawa, Canada, July 26–31, 2025
'''
    return key, md


# Find all Paper#N and Presentation#N sections (handles form feed separator)
# The text has form feed (\x0c) between paper sections in some places
# Also handles "Key Reserve Paper#N" prefix (backup papers)
pattern = r'(?:\n|\x0c)(?:Key Reserve )?((?:Paper|Presentation)#(\d+))\s*\n'
parts = re.split(pattern, TEXT)
# parts: [pre, full_match, num, content, full_match, num, content, ...]

entries_to_write = []
seen_keys = set()
for i in range(1, len(parts), 3):
    full_match = parts[i]
    section_id = parts[i+1]
    content = parts[i+2] if i+2 < len(parts) else ''
    if not full_match or not section_id or not content:
        continue
    section_type = 'Paper' if full_match.startswith('Paper') else 'Presentation'

    # Stop if this is the end of document (Presentations section often trails off)
    parsed = parse_section(content)
    if not parsed or not parsed['abstract']:
        continue
    if len(parsed['abstract']) < 100:
        continue
    # Skip if next section appears in content (parsing went too far)
    if re.search(r'(?:\n|\x0c)(?:Paper|Presentation)#\d+', content):
        # Take only up to next section
        m = re.search(r'(?:\n|\x0c)(?:Paper|Presentation)#\d+', content)
        content = content[:m.start()]
        parsed = parse_section(content)
        if not parsed or not parsed['abstract']:
            continue

    key, md = build_entry(section_type, section_id, parsed)
    if key in seen_keys:
        continue
    seen_keys.add(key)
    entries_to_write.append((key, md, section_id, parsed['title'], section_type))

os.makedirs(ENTRIES_DIR, exist_ok=True)
print(f'Writing {len(entries_to_write)} entries to {ENTRIES_DIR}/')
n_paper = sum(1 for e in entries_to_write if e[4] == 'Paper')
n_pres = sum(1 for e in entries_to_write if e[4] == 'Presentation')
print(f'  {n_paper} papers, {n_pres} presentations')

# Write the entries
for key, md, section_id, title, section_type in entries_to_write:
    path = os.path.join(ENTRIES_DIR, f'{key}.md')
    with open(path, 'w') as f:
        f.write(md)

print(f'\nTotal: {len(entries_to_write)} entries written')

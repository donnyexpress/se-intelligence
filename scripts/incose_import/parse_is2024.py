#!/usr/bin/env python3
"""
Parse the IS2024 Book of Abstracts (extracted from the public PDF) and
generate SE Intelligence entry markdown files.

Input:  /tmp/incose_papers/is2024_abstracts.txt  (from `pdftotext`)
Output: entries/conf-is2024-pNNN-<slug>.md  + a generated entries-is2024.json list

The PDF has both "Paper#<n>" (full academic papers) and "Presentation#<n>"
(industry/poster presentations) sections. We extract both, since the
INCOSE community values the presentations too. Each gets a unique key.
"""
import re
import os
import sys
import json

TEXT_PATH = os.environ.get('IS2024_TEXT', '/tmp/incose_papers/is2024_abstracts.txt')
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


def is_code_to_se_topic(topics_text):
    """Given the IS Topics line, return the best SE Intelligence topic key."""
    se_topics = []
    text = topics_text.lower()
    if 'aerospace' in text or 'defense' in text:
        se_topics.append('defense')
    if 'automotive' in text or 'autonomous' in text:
        se_topics.append('auto')
    if 'health' in text or 'medical' in text:
        se_topics.append('health')
    if 'energy' in text or 'environment' in text:
        se_topics.append('energy')
    if 'infrastructure' in text:
        se_topics.append('infra')
    if 'space' in text:
        se_topics.append('space')
    if 'manufacturing' in text or 'industry 4' in text:
        se_topics.append('manufacturing')
    if 'enterprise' in text or 'social' in text:
        se_topics.append('management')
    if 'systems of systems' in text:
        se_topics.append('sos')

    for m in re.finditer(r'(\d+)\.(\d+)\.?', topics_text):
        prefix = f'{m.group(1)}.{m.group(2)}'
        for se_topic, prefixes in TOPIC_MAP.items():
            if prefix in prefixes or f'{m.group(1)}.' in prefixes:
                se_topics.append(se_topic)
                break

    priority = ['sec', 'sos', 'ml-sys', 'defense', 'health', 'energy', 'auto', 'space', 'manufacturing', 'infra',
                'realization', 'system-def', 'sys-fund',
                'management', 'eng-domains']
    for p in priority:
        if p in se_topics:
            return p
    return 'eng-domains'


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
    se_topic = is_code_to_se_topic(parsed['topics'])
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
        key = f'conf-is2024-p{id_padded}-{slug}'
        source_label = f'IS 2024 Paper #{section_id} (Dublin)'
        event_type = 'is2024-paper'
    else:
        key = f'conf-is2024-pres{id_padded}-{slug}'
        source_label = f'IS 2024 Presentation #{section_id} (Dublin)'
        event_type = 'is2024-presentation'

    authors_display = '; '.join(parsed['authors'][:5])
    if len(parsed['authors']) > 5:
        authors_display += f'; +{len(parsed["authors"]) - 5} more'

    md = f'''---
last_updated: 2026-08-12
topic: {se_topic}
triage: {triage}
source_type: paper
signal: 0.72
maturity: established
event: is2024
track: {track}
authors: "{last_name} et al."{("  # " + str(len(parsed["authors"])) + " authors") if len(parsed["authors"]) > 1 else ""}
year: 2024
published: 2024-07-15
source_url: https://www.incose.org/docs/default-source/events-documents/is2024/IS2024BookAbstract.pdf
source_label: {source_label} →
---

# {title}

## TL;DR

{abstract}

## Why it matters

This {"paper" if section_type == "Paper" else "presentation"} was {"presented" if section_type == "Paper" else "delivered"} at the 34th Annual INCOSE International Symposium (IS 2024) in Dublin, Ireland, July 2–6, 2024. Authors: {authors_display}.

## Key ideas

'''
    if keywords:
        md += f'- **Keywords**: {keywords}\n'
    if topics_display:
        md += f'- **IS2024 topic codes**: {topics_display}\n'
    md += f'- **Primary topic (SE Intelligence taxonomy)**: {se_topic} (mapped from IS topic codes above)\n'

    md += '''
## When to use

- When researching this paper's specific topic area in the 2024 SE community work
- When looking for a citable, peer-reviewed source from the INCOSE IS 2024 program
- When cross-referencing against other IS 2024 work in the same topic area

## Sources & links

- INCOSE IS 2024 Book of Abstracts (PDF) — https://www.incose.org/docs/default-source/events-documents/is2024/IS2024BookAbstract.pdf
- INCOSE Previous International Events — https://www.incose.org/events-education/previous-international-events/
- 34th Annual INCOSE International Symposium, Dublin, Ireland, July 2–6, 2024
'''
    return key, md


# Find all Paper#N and Presentation#N sections (handles form feed separator)
# The text has form feed (\x0c) between paper sections in some places
pattern = r'(?:\n|\x0c)((?:Paper|Presentation)#(\d+))\s*\n'
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

#!/usr/bin/env python3
"""
update_topic_bodies.py — Auto-adaptive body updates for SE Intelligence.

When new entries are added to entries/, this script updates the
corresponding topic pages' ## Patterns that work, ## Best practices,
and ## Research frontiers sections to reflect the new evidence.

The script:
  1. Loads all entries from entries/*.md
  2. Groups them by primary topic
  3. For each topic page, finds entries that are cited inline but whose
     key claims are not yet represented in the section bodies
  4. Inserts new bullets for unrepresented claims
  5. Updates the references list
  6. Bumps last_curated

Usage:
  python3 scripts/update_topic_bodies.py [--diff] [--dry-run] [--threshold=0.3]

  --diff       Show unified diff of changes (default: apply)
  --dry-run    Don't write any files; print what would change
  --threshold  Cosine-similarity threshold for "already represented" (default 0.3)
  --max-per-section  Max new bullets to add per section per run (default 5)

"Already represented" check:
  For each new entry, extract the TL;DR. Tokenize. Compute Jaccard
  similarity with each existing bullet in the target section. If
  similarity > threshold, the claim is already represented. Otherwise,
  it's a new claim.

The script is conservative by design: it never removes bullets, never
changes existing text, and never rewrites a topic page's structure.
It only appends new bullets and updates the references list.
"""

import argparse
import json
import os
import re
import sys
import subprocess
from datetime import date
from pathlib import Path

# Paths
ROOT = Path(__file__).parent.parent
ENTRIES_DIR = ROOT / 'entries'
TOPICS_DIR = ROOT / 'topics'
ANALYSIS_DIR = ROOT / 'docs' / 'analysis'

# Configurable
DEFAULT_THRESHOLD = 0.3
DEFAULT_MAX_PER_SECTION = 5


def jaccard(tokens_a, tokens_b):
    """Jaccard similarity between two sets of tokens."""
    a = set(tokens_a)
    b = set(tokens_b)
    if not a and not b:
        return 0.0
    return len(a & b) / len(a | b)


def tokenize(text):
    """Lowercase, split on non-word, drop short/stopwords."""
    if not text:
        return []
    text = text.lower()
    text = re.sub(r'[`*_#\[\]()|]', ' ', text)
    words = re.findall(r'\b[a-z][a-z0-9-]{2,}\b', text)
    # Drop a small stopword list (English function words)
    stops = {
        'the', 'and', 'for', 'with', 'from', 'that', 'this', 'are',
        'but', 'not', 'was', 'were', 'has', 'have', 'had', 'been',
        'into', 'than', 'then', 'when', 'what', 'where', 'how',
        'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
        'some', 'such', 'only', 'own', 'same', 'also', 'than', 'too',
        'very', 'can', 'will', 'just', 'should', 'now', 'use', 'using',
        'based', 'first', 'two', 'three', 'may', 'across', 'between',
    }
    return [w for w in words if w not in stops]


def load_entry(path):
    """Load a single entry .md file. Return dict with title, summary, key, topic, etc."""
    raw = path.read_text()
    # Strip frontmatter
    if not raw.startswith('---'):
        return None
    parts = raw.split('---', 2)
    if len(parts) < 3:
        return None
    fm = parts[1]
    body = parts[2]

    # Parse simple frontmatter
    meta = {}
    for line in fm.split('\n'):
        m = re.match(r'^([a-z_]+):\s*(.*?)\s*$', line, re.IGNORECASE)
        if m:
            key = m.group(1).lower()
            val = m.group(2).strip()
            if val.startswith('[') and val.endswith(']'):
                inner = val[1:-1].strip()
                if inner:
                    meta[key] = [s.strip() for s in inner.split(',')]
                else:
                    meta[key] = []
            elif val.startswith('"') and val.endswith('"'):
                meta[key] = val[1:-1]
            else:
                meta[key] = val

    # Parse sections from body
    sections = []
    cur_heading = None
    cur_content = []
    for line in body.split('\n'):
        m = re.match(r'^##\s+(.+)$', line)
        if m:
            if cur_heading is not None:
                sections.append({'heading': cur_heading, 'content': '\n'.join(cur_content).strip()})
            cur_heading = m.group(1).strip()
            cur_content = []
        else:
            cur_content.append(line)
    if cur_heading is not None:
        sections.append({'heading': cur_heading, 'content': '\n'.join(cur_content).strip()})

    # Get the TL;DR
    summary = ''
    for s in sections:
        if s['heading'].lower() in ('tl;dr', 'tldr', 'summary'):
            summary = s['content']
            break

    # Get the title
    title_match = re.search(r'^#\s+(.+)$', body, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else ''

    return {
        'key': path.stem,
        'title': title,
        'summary': summary,
        'topic': meta.get('topic', ''),
        'domain_tags': meta.get('domain_tags', []),
        'practice_tags': meta.get('practice_tags', []),
        'authors': meta.get('authors', ''),
        'year': meta.get('year', ''),
        'event': meta.get('event', ''),
        'source_type': meta.get('source_type', ''),
        'triage': meta.get('triage', ''),
        'sections': sections,
    }


def load_all_entries():
    """Load all entries. Return {key: entry}."""
    entries = {}
    for path in sorted(ENTRIES_DIR.glob('*.md')):
        e = load_entry(path)
        if e:
            entries[e['key']] = e
    return entries


def get_topic_for_entry(entry, all_entries):
    """Get the primary topic key for an entry."""
    return entry.get('topic', '')


def load_topic(path):
    """Load a topic page. Return dict with frontmatter, body sections, existing citations."""
    raw = path.read_text()
    if not raw.startswith('---'):
        return None
    parts = raw.split('---', 2)
    if len(parts) < 3:
        return None
    fm = parts[1]
    body = parts[2]

    meta = {}
    for line in fm.split('\n'):
        m = re.match(r'^([a-z_]+):\s*(.*?)\s*$', line, re.IGNORECASE)
        if m:
            meta[m.group(1).lower()] = m.group(2).strip()

    # Parse sections
    sections = []
    cur_heading = None
    cur_content = []
    for line in body.split('\n'):
        m = re.match(r'^##\s+(.+)$', line)
        if m:
            if cur_heading is not None:
                sections.append({'heading': cur_heading, 'content': '\n'.join(cur_content).strip()})
            cur_heading = m.group(1).strip()
            cur_content = []
        else:
            cur_content.append(line)
    if cur_heading is not None:
        sections.append({'heading': cur_heading, 'content': '\n'.join(cur_content).strip()})

    # Use the project parser to get accurate citations
    # The parser is in assets/parser.js — load it via require
    inline_citations = set()
    try:
        sys.path.insert(0, str(ROOT / 'assets'))
        # Try to import — but parser.js is a browser script, not Node
        # Just regex match the [n] citation and look them up
        # Get all [n] patterns in body
        n_citations = re.findall(r'\[(\d+)\]', body)
        # We need to know what key each [n] maps to — that's in the References list
        # The references list uses `N. <key/label> — ...` format
        refs_section = None
        for s in sections:
            if s['heading'].lower() == 'references':
                refs_section = s
                break
        if refs_section:
            # Parse references list
            for line in refs_section['content'].split('\n'):
                m = re.match(r'^(\d+)\.\s+(.+?)\s*—\s*(.+)', line.strip())
                if m:
                    num = m.group(1)
                    label = m.group(2).strip()
                    # The label is the entry key (or close to it)
                    inline_citations.add(label)
    except Exception:
        pass

    # Also catch any [<key>] pattern (in case the topic page still has some)
    for m in re.findall(r'\[([a-z0-9][a-z0-9-]*)\]', body):
        inline_citations.add(m)

    return {
        'path': path,
        'topic_key': meta.get('topic_key', path.stem),
        'meta': meta,
        'sections': sections,
        'inline_citations': inline_citations,
        'body': body,
    }


def get_section_text(section):
    """Get all text content of a section (for similarity check)."""
    return section.get('content', '')


def is_claim_represented(claim_summary, section_text, threshold):
    """Check if the claim is already represented in the section."""
    claim_tokens = tokenize(claim_summary)
    if not claim_tokens:
        return True
    section_tokens = set(tokenize(section_text))
    claim_token_set = set(claim_tokens)
    if not section_tokens:
        return False
    sim = jaccard(claim_tokens, section_tokens)
    return sim >= threshold


def should_add_claim_to_section(claim_summary, section, threshold):
    """Decide if a new claim should be added to a section. Returns bool."""
    if not claim_summary or not claim_summary.strip():
        return False
    section_text = get_section_text(section)
    if not section_text:
        return True  # empty section, definitely add
    return not is_claim_represented(claim_summary, section_text, threshold)


def format_bullet_for_section(entry, section_heading, all_entries):
    """Format a new bullet for the given section."""
    title = entry['title']
    key = entry['key']
    summary = entry['summary']

    # Choose the section type
    if 'frontier' in section_heading.lower() or 'research' in section_heading.lower():
        # Research frontiers: "Title — short claim"
        if summary:
            # Take first sentence (up to first period)
            claim = summary.split('.')[0].strip()
            if len(claim) > 200:
                claim = claim[:197] + '...'
            return f'- **{title}** [{key}] — {claim}.'
        return f'- **{title}** [{key}]'
    elif 'pattern' in section_heading.lower():
        # Patterns: "Title — short claim"
        if summary:
            claim = summary.split('.')[0].strip()
            if len(claim) > 200:
                claim = claim[:197] + '...'
            return f'- **{title}** [{key}] — {claim}.'
        return f'- **{title}** [{key}]'
    elif 'best' in section_heading.lower() and 'practice' in section_heading.lower():
        # Best practices: a tighter framing
        if summary:
            claim = summary.split('.')[0].strip()
            if len(claim) > 200:
                claim = claim[:197] + '...'
            return f'- **{title}** [{key}] — {claim}.'
        return f'- **{title}** [{key}]'
    else:
        return f'- **{title}** [{key}]'


def clean_authors(authors_str):
    """Clean the authors field. Frontmatter has it like
    'Matteo Duroy, Alberto Gonzalez Fernandez, ...' possibly with a
    trailing '  # 5 authors' comment.
    """
    if not authors_str:
        return 'Unknown'
    s = str(authors_str).strip()
    # Strip comment after author list
    if '#' in s:
        s = s.split('#')[0].strip()
    # Strip quotes
    s = s.strip('"').strip("'")
    return s


def format_reference_line(entry, all_entries):
    """Format a new line for the references section."""
    title = entry['title']
    key = entry['key']
    authors = clean_authors(entry.get('authors', ''))
    year = entry.get('year', '')
    event = entry.get('event', '')

    # Shorten the authors
    if authors and ',' in authors:
        first = authors.split(',')[0].strip()
        if 'et al.' not in first and authors.count(',') >= 1:
            author_label = f'{first} et al.'
        else:
            author_label = first
    else:
        author_label = authors or 'Unknown'

    # Build the label
    if event.startswith('is20') or event.startswith('iw20'):
        # IS or IW conference
        return f'- {author_label} ({year}) — {title} ({event.upper().replace("IS20", "IS 20").replace("IW20", "IW 20")})'
    elif event == 'wiley-se-29-4':
        return f'- {author_label} ({year}) — {title} (Wiley SE 29(4))'
    else:
        return f'- {author_label} ({year}) — {title}'


def update_topic_page(topic, entries_for_topic, all_entries, threshold, max_per_section, today_str):
    """Update a single topic page with new claims from the entries.
    Returns a list of (section_heading, bullet_text) tuples added.
    """
    if not entries_for_topic:
        return []

    # Find the most appropriate section for new claims
    # Order: Research frontiers, Patterns that work, Best practices
    section_priority = ['Research frontiers', 'Patterns that work', 'Best practices']
    target_sections = []
    for name in section_priority:
        for s in topic['sections']:
            if s['heading'].lower() == name.lower():
                target_sections.append(s)
                break

    if not target_sections:
        return []

    new_bullets = []
    for entry in entries_for_topic:
        if not entry.get('summary'):
            continue
        if entry['key'] in topic['inline_citations']:
            continue  # already cited in body or references
        # Try to add to each section, but break once added
        added = False
        for section in target_sections:
            if added or len(new_bullets) >= max_per_section:
                break
            if should_add_claim_to_section(entry['summary'], section, threshold):
                bullet = format_bullet_for_section(entry, section['heading'], all_entries)
                new_bullets.append((section['heading'], bullet, entry['key']))
                added = True

    return new_bullets


def find_existing_reference_lines(topic):
    """Find the existing reference lines in the topic page."""
    refs = []
    for s in topic['sections']:
        if s['heading'].lower() == 'references':
            for line in s['content'].split('\n'):
                line = line.strip()
                if line and (line.startswith('-') or line.startswith('1.')):
                    refs.append(line)
            break
    return refs


def references_already_contain(topic, entry_key):
    """Check if a key is already in the references list (as a citation or as a key)."""
    refs_text = '\n'.join(find_existing_reference_lines(topic))
    return f'[{entry_key}]' in refs_text or entry_key in refs_text


def apply_update(topic, new_bullets, new_references, today_str):
    """Apply the update to the topic page. Return new content."""
    new_body = topic['body']

    # Insert bullets in the appropriate sections
    for section_heading, bullet_text, _ in new_bullets:
        # Find the section and append the bullet
        section_pattern = re.compile(
            r'(##\s+' + re.escape(section_heading) + r'\s*\n)(.*?)(?=\n##\s|\Z)',
            re.DOTALL,
        )
        m = section_pattern.search(new_body)
        if m:
            section_content = m.group(2).rstrip()
            # Check if last non-empty line is a bullet
            new_section = section_content + '\n' + bullet_text
            new_body = new_body[:m.start()] + m.group(1) + new_section + '\n\n' + new_body[m.end():]

    # Add references
    if new_references:
        # Find the References section
        refs_pattern = re.compile(r'(##\s+References\s*\n)(.*?)(?=\Z)', re.DOTALL)
        m = refs_pattern.search(new_body)
        if m:
            existing = m.group(2).rstrip()
            new_section = existing + '\n' + '\n'.join(new_references)
            new_body = new_body[:m.start()] + m.group(1) + new_section + new_body[m.end():]
        else:
            # No References section — append
            new_body = new_body.rstrip() + '\n\n## References\n\n' + '\n'.join(new_references) + '\n'

    # Update last_curated in frontmatter
    new_content = re.sub(
        r'(last_curated:\s*)[\d-]+',
        r'\g<1>' + today_str,
        new_body[:len(topic['body']) + 10],  # limit search
        count=1,
    )
    # Actually re-do on full content
    new_full = topic['path'].read_text()
    new_full = re.sub(
        r'(last_curated:\s*)[\d-]+',
        r'\g<1>' + today_str,
        new_full,
        count=1,
    )
    # Now splice in the new body
    new_full = new_full.replace(topic['body'].lstrip(), new_body.lstrip(), 1)
    return new_full


def main():
    parser = argparse.ArgumentParser(description='Auto-update topic pages from new entries')
    parser.add_argument('--diff', action='store_true', help='Show unified diff instead of writing')
    parser.add_argument('--dry-run', action='store_true', help='Don\'t write files')
    parser.add_argument('--threshold', type=float, default=DEFAULT_THRESHOLD,
                        help='Jaccard similarity threshold for "already represented"')
    parser.add_argument('--max-per-section', type=int, default=DEFAULT_MAX_PER_SECTION,
                        help='Max new bullets per section per topic page per run')
    parser.add_argument('--since', type=str, default=None,
                        help='Only consider entries added after this date (YYYY-MM-DD)')
    parser.add_argument('--verbose', action='store_true', help='Verbose output')
    args = parser.parse_args()

    today_str = str(date.today())
    print(f'=== update_topic_bodies.py ===')
    print(f'Today: {today_str}')
    print(f'Threshold: {args.threshold}')
    print(f'Max per section: {args.max_per_section}')
    if args.since:
        print(f'Since: {args.since}')

    # Load entries
    all_entries = load_all_entries()
    print(f'Loaded {len(all_entries)} entries')

    # Filter by --since
    if args.since:
        filtered = {k: e for k, e in all_entries.items()
                    if e.get('year', '') >= args.since[:4]}  # year-only filter
        print(f'Filtered to {len(filtered)} entries (year >= {args.since[:4]})')
    else:
        filtered = all_entries

    # Group by primary topic
    by_topic = {}
    for e in filtered.values():
        t = e.get('topic')
        if t:
            by_topic.setdefault(t, []).append(e)
    print(f'Topics with entries: {len(by_topic)}')

    # Process each topic page
    total_new_bullets = 0
    total_new_references = 0
    files_changed = []
    for topic_path in sorted(TOPICS_DIR.glob('*.md')):
        topic = load_topic(topic_path)
        if not topic:
            continue
        topic_key = topic['topic_key']
        # Skip non-primary topics (e.g. specialty topics that don't have many entries)
        if topic_key not in by_topic:
            continue

        entries_for_topic = by_topic[topic_key]
        new_bullets = update_topic_page(
            topic, entries_for_topic, all_entries,
            args.threshold, args.max_per_section, today_str,
        )

        # Build new references for entries that aren't already cited
        new_references = []
        for entry in entries_for_topic:
            if not entry.get('summary'):
                continue
            if entry['key'] in topic['inline_citations']:
                continue  # already cited in body
            if not references_already_contain(topic, entry['key']):
                # Only add reference if the entry is actually being used
                if any(b[2] == entry['key'] for b in new_bullets):
                    ref = format_reference_line(entry, all_entries)
                    new_references.append(ref)

        if not new_bullets and not new_references:
            if args.verbose:
                print(f'  {topic_key}: no changes')
            continue

        print(f'  {topic_key}: +{len(new_bullets)} bullets, +{len(new_references)} refs')

        if args.diff or args.dry_run:
            # Show what would change
            for heading, bullet, key in new_bullets:
                print(f'    [section: {heading}]')
                print(f'      + {bullet}')
            for ref in new_references:
                print(f'    [references]')
                print(f'      + {ref}')
        else:
            new_content = apply_update(topic, new_bullets, new_references, today_str)
            if new_content != topic_path.read_text():
                topic_path.write_text(new_content)
                files_changed.append(str(topic_path))

        total_new_bullets += len(new_bullets)
        total_new_references += len(new_references)

    print(f'\n=== Summary ===')
    print(f'Total new bullets: {total_new_bullets}')
    print(f'Total new references: {total_new_references}')
    print(f'Files changed: {len(files_changed)}')

    if args.diff:
        # Run git diff to show what would change
        print(f'\n=== git diff (preview) ===')
        result = subprocess.run(['git', 'diff', '--stat'], cwd=ROOT, capture_output=True, text=True)
        print(result.stdout)
        if not result.stdout:
            print('(no staged changes — diff mode only shows what would be added)')


if __name__ == '__main__':
    main()

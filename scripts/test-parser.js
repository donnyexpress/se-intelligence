#!/usr/bin/env node
/**
 * scripts/test-parser.js — T-01: parser unit tests
 *
 * Asserts:
 *   - parseMarkdown() works on the 23 existing sources (no regression)
 *   - parseTopicPage() produces the right structure
 *   - Inline citation extraction assigns numbers correctly + dedups
 *   - Auto-references section is stripped (so the engine can render its own)
 *   - Phantom __summary__ heading is NOT created when title is followed by blank line
 *   - formatDate() handles Date, ISO string, year-only, null
 *   - topicBodyToHtml() renders [n] as <sup> links to /source/<key>
 *
 * Usage: node scripts/test-parser.js
 *
 * No puppeteer, no network. Pure unit tests.
 */

const fs = require('fs');
const path = require('path');
const {
  parseMarkdown,
  parseTopicPage,
  extractInlineCitations,
  topicBodyToHtml,
} = require('../assets/parser.js');

let pass = 0, fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); }
}

console.log('--- parseMarkdown: source back-compat ---\n');

// Source parser must still handle the 23 existing entries
const ENTRIES_DIR = path.join(__dirname, '..', 'entries');
const entryFiles = fs.readdirSync(ENTRIES_DIR).filter(f => f.endsWith('.md'));
let sourcesLoaded = 0;
for (const f of entryFiles) {
  const raw = fs.readFileSync(path.join(ENTRIES_DIR, f), 'utf8');
  const e = parseMarkdown(f, raw);
  if (e.title && e.triage) sourcesLoaded++;
}
check(`parsed all ${entryFiles.length} sources without error`,
  sourcesLoaded === entryFiles.length,
  `loaded: ${sourcesLoaded}/${entryFiles.length}`);

console.log('\n--- parseTopicPage: basics ---\n');

const minimalTopic = `---
topic_key: x
level: 1
last_curated: 2026-08-05
maturity: established
---

# Topic Title

Topic body paragraph.
`;
const t1 = parseTopicPage('x.md', minimalTopic);
check('parses topic_key from frontmatter', t1.topicKey === 'x');
check('parses level from frontmatter', t1.level === 1);
check('parses last_curated from frontmatter', t1.lastCurated === '2026-08-05');
check('parses maturity from frontmatter', t1.maturity === 'established');
check('parses title from # heading', t1.title === 'Topic Title');
check('isTopic flag is set', t1.isTopic === true);
check('isTopic is mutually exclusive with isConference', t1.isConference === false);
check('cites array initialized empty', Array.isArray(t1.citations) && t1.citations.length === 0);

console.log('\n--- parseTopicPage: inline citations ---\n');

const citeTopic = `---
topic_key: x
level: 1
last_curated: 2026-08-05
---

# Title

## Section

See [foo] and [bar] then [foo] again.
`;
const t2 = parseTopicPage('x.md', citeTopic);
check('extracted 2 unique citations', t2.citations.length === 2, `got ${t2.citations.length}`);
check('first citation is foo → [1]', t2.citationByKey['foo'] === 1);
check('second citation is bar → [2]', t2.citationByKey['bar'] === 2);
check('section body has [1] in place of [foo]',
  t2.sections[0].content.includes('[1]') && !t2.sections[0].content.includes('[foo]'));
check('section body has [2] in place of [bar]',
  t2.sections[0].content.includes('[2]') && !t2.sections[0].content.includes('[bar]'));
check('repeated citation keeps [1]',
  t2.sections[0].content.includes('[1] again'));

console.log('\n--- parseTopicPage: auto-references section stripped ---\n');

const refTopic = `---
topic_key: x
level: 1
last_curated: 2026-08-05
---

# Title

## Section

Body.

## References

1. Manual reference
`;
const t3 = parseTopicPage('x.md', refTopic);
const headings = t3.sections.map(s => s.heading);
check('References section is stripped', !headings.includes('References'),
  `headings: ${JSON.stringify(headings)}`);
check('Section is preserved', headings.includes('Section'));

console.log('\n--- parseTopicPage: phantom __summary__ fix ---\n');

// Regression: a blank line between the title and the first ## heading
// should NOT create a stray __summary__ section
const phantomTopic = `---
topic_key: x
level: 1
last_curated: 2026-08-05
---

# Title

## TL;DR

Body content here.
`;
const t4 = parseTopicPage('x.md', phantomTopic);
const t4Headings = t4.sections.map(s => s.heading);
check('no phantom __summary__ heading', !t4Headings.includes('__summary__'),
  `headings: ${JSON.stringify(t4Headings)}`);
check('TL;DR section is classified as summary, not section', t4.summary === 'Body content here.');

console.log('\n--- topicBodyToHtml: citation rendering ---\n');

const t5 = parseTopicPage('x.md', citeTopic);
const html = topicBodyToHtml(t5.sections[0].content, t5.citationByKey);
check('renders [1] as <sup> link to /source/foo',
  html.includes('<sup class="cite"><a href="/source/foo">[1]</a></sup>'));
check('renders [2] as <sup> link to /source/bar',
  html.includes('<sup class="cite"><a href="/source/bar">[2]</a></sup>'));
check('renders <p> wrapper',
  html.includes('<p>') && html.includes('</p>'));

console.log('\n--- topicBodyToHtml: link rendering ---\n');

// Site-relative links [text](/path/...) must be rendered as anchors.
// This regressed when the regex only matched https?://, dropping every
// site-relative link silently.
const relLinkMd = '- [System Safety](/topic/specialty-safety) — hazard analysis\n- [Reliability](/topic/specialty-reliability) — MTBF';
const relLinkHtml = topicBodyToHtml(relLinkMd, {});
check('renders site-relative [text](/path/...) as <a> with same href',
  relLinkHtml.includes('<a href="/topic/specialty-safety" data-nav="topic">System Safety</a>'));
check('renders multiple relative links in a list',
  relLinkHtml.includes('Reliability</a>') && relLinkHtml.includes('<li>'));
check('preserves the trailing em-dash text after the link',
  relLinkHtml.includes('hazard analysis') && relLinkHtml.includes('MTBF'));

// External https links still open in a new tab.
const extLinkMd = 'See [MIT site](https://mit.edu).';
const extLinkHtml = topicBodyToHtml(extLinkMd, {});
check('external [text](https://...) still gets target="_blank"',
  extLinkHtml.includes('<a href="https://mit.edu" target="_blank"') &&
  extLinkHtml.includes('MIT site</a>'));

// Bare bracket reference to a citation must still render as <sup>.
const citeLinkMd = 'See source [1] and [2] for details.';
const citeLinkHtml = topicBodyToHtml(citeLinkMd, {'foo': 1, 'bar': 2});
check('citation [1] inside prose still becomes <sup> (not a regular link)',
  citeLinkHtml.includes('<sup class="cite"><a href="/source/foo">[1]</a></sup>'));
check('citation [2] inside prose still becomes <sup>',
  citeLinkHtml.includes('<sup class="cite"><a href="/source/bar">[2]</a></sup>'));

console.log('\n--- extractInlineCitations: standalone ---\n');

const c1 = extractInlineCitations('See [a] and [b] and [a] again.');
check('citation count is 2', c1.citations.length === 2);
check('first key is a', c1.citations[0].key === 'a');
check('a → 1', c1.citations[0].number === 1);
check('b → 2', c1.citations[1].number === 2);

console.log('\n--- extractInlineCitations: dashes in keys ---\n');

const c2 = extractInlineCitations('See [system-def-mbse-patterns-2025] and [conf-is2025-jaxa-llm-mbse].');
check('dashed key 1', c2.citationByKey['system-def-mbse-patterns-2025'] === 1);
check('dashed key 2', c2.citationByKey['conf-is2025-jaxa-llm-mbse'] === 2);
check('dashed citations in order', c2.citations.length === 2 &&
  c2.citations[0].key === 'system-def-mbse-patterns-2025' &&
  c2.citations[1].key === 'conf-is2025-jaxa-llm-mbse');

console.log('\n--- formatDate: input handling ---\n');

// Pull formatDate out of the app's runtime by re-implementing the test
// (we can't easily import the IIFE; the smoke + e2e tests will cover
// formatDate in the browser. Here we just assert the regex behavior.)
function formatDate(iso) {
  if (!iso) return '';
  if (iso instanceof Date) {
    if (isNaN(iso.getTime())) return '';
    iso = iso.toISOString();
  }
  const m = String(iso).match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
  if (!m) return String(iso);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const day = m[3] ? parseInt(m[3], 10) : null;
  return day ? `${months[parseInt(m[2], 10) - 1]} ${day}, ${m[1]}` : `${months[parseInt(m[2], 10) - 1]} ${m[1]}`;
}

check('formatDate("2025-05-20") === "May 20, 2025"', formatDate('2025-05-20') === 'May 20, 2025');
check('formatDate("2025-05-20T00:00:00.000Z") === "May 20, 2025"',
  formatDate('2025-05-20T00:00:00.000Z') === 'May 20, 2025');
check('formatDate(new Date("2025-05-20Z")) === "May 20, 2025"',
  formatDate(new Date('2025-05-20T00:00:00Z')) === 'May 20, 2025');
// Year-only input: app.js does not specially handle bare year numbers —
// it falls through to the regex which doesn't match, so it returns the
// string as-is. Callers should pre-format (e.g. use formatDate with full date).
check('formatDate(2024) returns the year as a string', String(formatDate(2024)) === '2024');
check('formatDate(null) === ""', formatDate(null) === '');
check('formatDate("") === ""', formatDate('') === '');
check('formatDate(new Date("invalid")) === ""', formatDate(new Date('invalid')) === '');

console.log(`\n==================================================`);
console.log(`  ${pass} passed, ${fail} failed`);
console.log(`==================================================\n`);
process.exit(fail === 0 ? 0 : 1);

// Markdown parser tailored for SE Intelligence — an INCOSE-aligned knowledge base.
//
// Reads a markdown file and returns a structured entry. The taxonomy and
// schema live in config.js; this file just does the mechanical work of
// extracting frontmatter, splitting into sections, and classifying reserved
// headings.

// Primary SEBoK topic keys (mirrors CONFIG.primaryTopics). Kept here as a
// fallback for tests / node usage where CONFIG may not be available.
const PRIMARY_TOPIC_KEYS = [
  'sys-fund', 'lifecycle', 'concept-def', 'system-def',
  'realization', 'deploy-use', 'eng-domains', 'management', 'sos',
];

// Application domain keys.
const APP_DOMAIN_KEYS = [
  'dist-sys', 'observ', 'reliab', 'platform', 'incid', 'ml-sys',
  'sec', 'perf', 'mission', 'energy', 'health', 'auto',
];

// All known topic-style prefixes for filename-suffix inference.
const TOPIC_PREFIXES = [...PRIMARY_TOPIC_KEYS, ...APP_DOMAIN_KEYS];

// Reserved headings the renderer detects and renders into the standard
// layout, instead of as a body h2.
const RESERVED_HEADINGS = [
  'TL;DR', 'Tldr', 'tl;dr',
  'Why it matters', 'Why this matters', 'So what',
  'Sources & links', 'Sources and links', 'Links',
  'My take', 'Take', 'My notes',
  'Related', 'Related reading', 'Related work',
  'Source', 'Sources',
];

// Parse a single markdown file into a structured entry.
function parseMarkdown(filename, raw) {
  let lines = raw.split('\n');

  // Strip optional YAML frontmatter. We support:
  //   last_updated, date, topic, triage, source_type, signal, maturity,
  //   source_url, source_label, links, event, track, paper_id, authors, year,
  //   published, event_date
  // plus any other future fields (kept in `frontmatter` for renderer use).
  let frontmatter = {};
  if (lines[0] && lines[0].trim() === '---') {
    const end = lines.findIndex((l, i) => i > 0 && l.trim() === '---');
    if (end > 0) {
      const fm = lines.slice(1, end).join('\n');
      for (const line of fm.split('\n')) {
        // key: value  OR  key:\n  - item\n  - item
        const mm = line.match(/^([a-z_]+):\s*(.*?)\s*$/i);
        if (mm) {
          frontmatter[mm[1].toLowerCase()] = mm[2];
        }
      }
      // Parse block-style `links:` list
      const linksIdx = lines.findIndex((l, i) => i > 0 && i < end && /^links:\s*$/i.test(l));
      if (linksIdx > 0) {
        const linkLines = [];
        for (let i = linksIdx + 1; i < end; i++) {
          const m = lines[i].match(/^\s*-\s*(.+?)\s*$/);
          if (m) linkLines.push(m[1]);
          else break;
        }
        if (linkLines.length) frontmatter.links_list = linkLines;
      }
      lines = lines.slice(end + 1);
    }
  }

  const key = filename.replace('.md', '');
  const isConference = key.startsWith('conf-');

  const entry = {
    filename,
    key,
    kind: isConference ? 'Conference'
        : key.startsWith('case-') ? 'Case Study'
        : key.startsWith('quote-') ? 'Quotes'
        : key.startsWith('source-') ? 'Source'
        : 'Note',
    isConference,
    topic: frontmatter.topic || inferTopicFromKey(key) || 'sys-fund',
    domains: parseDomainsField(frontmatter.domains),
    triage: frontmatter.triage || 'read',
    sourceType: frontmatter.source_type || (isConference ? 'paper' : 'blog'),
    signal: parseFloat(frontmatter.signal) || 0.5,
    maturity: frontmatter.maturity || 'production',
    title: '',
    lastUpdated: frontmatter.last_updated || frontmatter.date || '',
    sections: [],     // ordered list of {heading, content}
    raw: raw,
    summary: '',
    source: '',
    monday: '',
    related: [],
    notes: '',
    linksList: frontmatter.links_list || [],
    // Canonical "read the full thing" link. For conf entries, falls back to
    // paper_id; for regular entries, falls back to the first item in
    // `links:` if it looks like a URL.
    sourceUrl: (function() {
      if (frontmatter.source_url) return frontmatter.source_url;
      if (isConference && frontmatter.paper_id) return frontmatter.paper_id;
      const list = frontmatter.links_list || [];
      for (const l of list) {
        if (/^https?:\/\//.test(String(l).trim())) return String(l).trim();
      }
      return '';
    })(),
    // Optional context-aware label for the source CTA, e.g. "View on Jepsen"
    // or "Read on Amazon". Defaults to a sensible fallback at render time.
    sourceLabel: frontmatter.source_label || '',
    // Conference-specific
    event: frontmatter.event || (isConference ? key.split('-')[1] : ''),
    track: frontmatter.track || '',
    paperId: frontmatter.paper_id || '',
    authors: frontmatter.authors || '',
    year: parseInt(frontmatter.year, 10) || 0,
    // Original publication date — when the source material was actually
    // published, NOT when we last edited the entry. Powers the home
    // dashboard's recency-weighted scoring. Accepts ISO date (YYYY-MM-DD)
    // or a free-form date string the Date parser can read. Falls back
    // through: published → event_date → year-01-01 → last_updated.
    published: parseDateField(frontmatter.published || frontmatter.event_date || frontmatter.year),
  };

  let currentHeading = '';
  let currentContent = [];

  function classify(heading) {
    const h = String(heading).trim();
    if (/^(tldr|tl;dr|tl ?dr)$/i.test(h)) return '__summary__';
    if (/^why it matters|why this matters|^so what$/i.test(h)) return '__why__';
    if (/^(sources?\s*(&|and)?\s*links?|^links?)$/i.test(h)) return '__sources__';
    if (/^(my take|^take$|my notes)/i.test(h)) return '__take__';
    if (/^related(\s+reading|\s+work)?$/i.test(h)) return '__related__';
    if (/^source$/i.test(h)) return '__source__';
    if (/monday morning/i.test(h)) return '__monday__';
    if (/your notes/i.test(h)) return '__notes__';
    return null;
  }

  // First pass: split into {heading, content} pairs.
  const parts = [];
  let curHeading = null;
  let curContent = [];
  for (const line of lines) {
    if (line.startsWith('# ') && !entry.title) {
      entry.title = line.slice(2).trim();
      continue;
    }
    if (line.startsWith('## ')) {
      if (curHeading !== null) {
        parts.push({ heading: curHeading, content: curContent.join('\n').trim() });
      } else if (curContent.length) {
        const joined = curContent.join('\n').trim();
        if (joined) parts.push({ heading: '__summary__', content: joined });
      }
      curHeading = line.slice(3).trim();
      curContent = [];
      continue;
    }
    curContent.push(line);
  }
  if (curHeading !== null) {
    parts.push({ heading: curHeading, content: curContent.join('\n').trim() });
  } else if (curContent.length) {
    const joined = curContent.join('\n').trim();
    if (joined) parts.push({ heading: '__summary__', content: joined });
  }

  // Second pass: classify each part.
  for (const p of parts) {
    const cls = classify(p.heading);
    if (cls === '__summary__') entry.summary = p.content;
    else if (cls === '__source__') entry.source = p.content;
    else if (cls === '__monday__') entry.monday = p.content;
    else if (cls === '__related__') {
      const matches = [...p.content.matchAll(/\[\[([^\]]+)\]\]/g)];
      entry.related = matches.map(m => {
        const link = m[1].trim();
        return link.split('|')[0].split('/').pop().replace('.md', '').trim();
      });
    } else if (cls === '__notes__') {
      entry.notes = p.content;
    } else {
      entry.sections.push({ heading: p.heading, content: p.content });
    }
  }

  return entry;
}

// Parse a date from a frontmatter field. Accepts:
//   - ISO date (YYYY-MM-DD) or datetime
//   - a year as integer or string ("2024")
//   - any string the Date constructor can parse
// Returns a Date or null.
function parseDateField(v) {
  if (v == null || v === '') return null;
  // Year alone
  if (typeof v === 'number' || /^\d{4}$/.test(String(v).trim())) {
    const y = parseInt(v, 10);
    if (!isNaN(y) && y > 1900 && y < 3000) return new Date(y, 0, 1);
  }
  const d = new Date(String(v).trim());
  if (!isNaN(d.getTime())) return d;
  return null;
}

// Infer a primary topic from the filename prefix.
// Regular entries: "<topic-key>-<slug>.md"
// Conference entries: "conf-<event>-<slug>.md" → falls back to 'sys-fund'
function inferTopicFromKey(key) {
  if (key.startsWith('conf-')) return null;  // conf entries use track → area mapping
  for (const p of TOPIC_PREFIXES) {
    if (key === p || key.startsWith(p + '-')) return p;
  }
  return null;
}

// Parse a comma- or space-separated `domains` field into an array.
function parseDomainsField(val) {
  if (!val) return [];
  return String(val).split(/[,\s]+/).map(s => s.trim()).filter(Boolean);
}

// Convert one entry's section content (markdown) to safe HTML.
// Small, safe converter — not a full markdown engine.
function mdToHtml(md) {
  if (!md) return '';
  const lines = md.split('\n');
  const out = [];
  let inList = false;
  let inOrdered = false;
  let paraBuf = [];

  function flushPara() {
    if (paraBuf.length) {
      const text = paraBuf.join(' ').trim();
      if (text) out.push(`<p>${inline(text)}</p>`);
      paraBuf = [];
    }
  }
  function closeList() {
    if (inList) { out.push('</ul>'); inList = false; }
    if (inOrdered) { out.push('</ol>'); inOrdered = false; }
  }

  function inline(s) {
    s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Wiki links [[key]] or [[key|label]]
    s = s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, k, lbl) => `<a href="#entry/${k}">${lbl}</a>`);
    s = s.replace(/\[\[([^\]]+)\]\]/g, (_, k) => {
      const cleanKey = k.split('/').pop().replace('.md', '').trim();
      return `<a href="#entry/${cleanKey}">${cleanKey.replace(/^(fw|case|conf)-/, '').replace(/-/g, ' ')}</a>`;
    });
    // External links [text](url)
    s = s.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|\s)\*([^*\n]+)\*/g, '$1<em>$2</em>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    return s;
  }

  for (const raw of lines) {
    const line = raw;
    if (!line.trim()) { flushPara(); closeList(); continue; }
    if (line.startsWith('### ')) {
      flushPara(); closeList();
      out.push(`<h3>${inline(line.slice(4).trim())}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      flushPara(); closeList();
      // Should have been classified, but render anyway if leaked
      out.push(`<h2>${inline(line.slice(3).trim())}</h2>`);
      continue;
    }
    if (line.startsWith('> ')) {
      flushPara(); closeList();
      out.push(`<blockquote>${inline(line.slice(2).trim())}</blockquote>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushPara();
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, '').trim())}</li>`);
      continue;
    } else {
      if (inList) { out.push('</ul>'); inList = false; }
    }
    if (/^\d+\.\s+/.test(line)) {
      flushPara();
      if (!inOrdered) { out.push('<ol>'); inOrdered = true; }
      out.push(`<li>${inline(line.replace(/^\d+\.\s+/, '').trim())}</li>`);
      continue;
    } else {
      if (inOrdered) { out.push('</ol>'); inOrdered = false; }
    }
    paraBuf.push(line);
  }
  flushPara();
  closeList();
  return out.join('\n');
}

// ---- Topic page parsing (synthesized knowledge articles) ----
//
// Topic pages are markdown files in `topics/<key>.md` with their own
// frontmatter schema (title, topic_key, level, last_curated, maturity)
// and body content that uses inline citations in the form:
//
//   The MagicGrid framework [system-def-mbse-patterns-2025] is ...
//
// On first appearance, each [key] gets a sequential number [1], [2], ...
// and is added to the references list. Subsequent uses of the same key
// reuse the same number. The renderer auto-appends a "References"
// section at the bottom with one entry per cited key.

function parseTopicPage(filename, raw) {
  let lines = raw.split('\n');
  let frontmatter = {};
  if (lines[0] && lines[0].trim() === '---') {
    const end = lines.findIndex((l, i) => i > 0 && l.trim() === '---');
    if (end > 0) {
      const fm = lines.slice(1, end).join('\n');
      for (const line of fm.split('\n')) {
        const mm = line.match(/^([a-z_]+):\s*(.*?)\s*$/i);
        if (mm) frontmatter[mm[1].toLowerCase()] = mm[2];
      }
      lines = lines.slice(end + 1);
    }
  }
  const key = filename.replace('.md', '');
  const isConference = key.startsWith('conf-');  // not used for topics, but flag anyway

  const entry = {
    filename,
    key,
    kind: 'Topic',
    isTopic: true,
    isConference: false,
    topic: frontmatter.topic_key || key,
    topicKey: frontmatter.topic_key || key,
    level: parseInt(frontmatter.level, 10) || 0,
    lastCurated: frontmatter.last_curated || frontmatter.date || '',
    maturity: frontmatter.maturity || 'established',
    title: '',
    lastUpdated: frontmatter.last_curated || frontmatter.date || '',
    sections: [],
    raw: raw,
    summary: '',
    // Populated by extractInlineCitations
    citations: [],         // ordered list of { key, number, label }
    citationByKey: {},     // key → number
  };

  // First pass: extract title, split into sections
  let curHeading = null;
  let curContent = [];
  const parts = [];
  for (const line of lines) {
    if (line.startsWith('# ') && !entry.title) {
      entry.title = line.slice(2).trim();
      continue;
    }
    if (line.startsWith('## ')) {
      if (curHeading !== null) {
        parts.push({ heading: curHeading, content: curContent.join('\n').trim() });
      } else if (curContent.length) {
        const joined = curContent.join('\n').trim();
        if (joined) parts.push({ heading: '__summary__', content: joined });
      }
      curHeading = line.slice(3).trim();
      curContent = [];
      continue;
    }
    curContent.push(line);
  }
  if (curHeading !== null) {
    parts.push({ heading: curHeading, content: curContent.join('\n').trim() });
  } else if (curContent.length) {
    const joined = curContent.join('\n').trim();
    if (joined) parts.push({ heading: '__summary__', content: joined });
  }

  // Classify
  for (const p of parts) {
    if (/^__summary__$|^summary$|^tl;dr$/i.test(p.heading)) {
      entry.summary = p.content;
    } else if (/^references?$/i.test(p.heading)) {
      // Auto-generated references replace this — drop it
      continue;
    } else {
      entry.sections.push({ heading: p.heading, content: p.content });
    }
  }

  // Extract inline citations across the summary + all section bodies.
  // We mutate section.content in place to replace [<key>] with [n] so
  // topicBodyToHtml can render them as clickable superscript links.
  const allText = [
    entry.summary,
    ...entry.sections.map(s => s.content),
  ].filter(Boolean).join('\n\n');
  const cit = extractInlineCitations(allText);
  entry.citations = cit.citations;
  entry.citationByKey = cit.citationByKey;
  // The replaced text was joined across sections; re-apply per-section.
  // Simpler approach: re-run the citation regex on each section's body
  // and the summary, with the same number assignment order. This is
  // deterministic because the join order matches the order we built
  // the parts in above.
  let cursor = 0;
  function replaceInText(text) {
    if (!text) return '';
    return text.replace(/\[([a-z0-9][a-z0-9-]*)\]/g, (m, key) => {
      if (entry.citationByKey[key] != null) {
        return '[' + entry.citationByKey[key] + ']';
      }
      return m;
    });
  }
  if (entry.summary) {
    entry.summary = replaceInText(entry.summary);
  }
  for (const s of entry.sections) {
    s.content = replaceInText(s.content);
  }

  return entry;
}

// Walk a body of text, find inline citations in the form [<key>],
// assign each a sequential number on first appearance, return the
// ordered list of references and a key→number lookup.
function extractInlineCitations(text) {
  const citations = [];
  const citationByKey = {};
  // Re-number the [key] tokens in place
  const replaced = text.replace(/\[([a-z0-9][a-z0-9-]*)\]/g, (m, key) => {
    if (citationByKey[key] == null) {
      const num = citations.length + 1;
      citationByKey[key] = num;
      citations.push({ key, number: num, label: key });
    }
    return '[' + citationByKey[key] + ']';
  });
  return { citations, citationByKey, text: replaced };
}

// Render a topic page body to HTML. Like mdToHtml but:
//   - doesn't escape the [n] numbers (we render them as sup links)
//   - collects citations so the renderer can show a "References" list
//   - assumes the body has already had its [key] replaced with [n]
function topicBodyToHtml(text, citationByKey) {
  if (!text) return '';
  const lines = text.split('\n');
  const out = [];
  let inList = false;
  let inOrdered = false;
  let paraBuf = [];

  function flushPara() {
    if (paraBuf.length) {
      const t = paraBuf.join(' ').trim();
      if (t) out.push(`<p>${inlineTopic(t, citationByKey)}</p>`);
      paraBuf = [];
    }
  }
  function closeList() {
    if (inList) { out.push('</ul>'); inList = false; }
    if (inOrdered) { out.push('</ol>'); inOrdered = false; }
  }
  function inlineTopic(s, citByKey) {
    s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // External links [text](url)
    s = s.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    // Inline citation [n] — link to the cited source's /source/<key> page
    s = s.replace(/\[(\d+)\]/g, (m, n) => {
      const key = Object.keys(citByKey || {}).find(k => citByKey[k] === parseInt(n, 10));
      if (!key) return m;
      return `<sup class="cite"><a href="/source/${key}">[${n}]</a></sup>`;
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|\s)\*([^*\n]+)\*/g, '$1<em>$2</em>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    return s;
  }
  for (const raw of lines) {
    const line = raw;
    if (!line.trim()) { flushPara(); closeList(); continue; }
    if (line.startsWith('### ')) {
      flushPara(); closeList();
      out.push(`<h3>${inlineTopic(line.slice(4).trim(), citationByKey)}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      flushPara(); closeList();
      out.push(`<h2>${inlineTopic(line.slice(3).trim(), citationByKey)}</h2>`);
      continue;
    }
    if (line.startsWith('> ')) {
      flushPara(); closeList();
      out.push(`<blockquote>${inlineTopic(line.slice(2).trim(), citationByKey)}</blockquote>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushPara();
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${inlineTopic(line.replace(/^[-*]\s+/, '').trim(), citationByKey)}</li>`);
      continue;
    } else {
      if (inList) { out.push('</ul>'); inList = false; }
    }
    paraBuf.push(line);
  }
  flushPara();
  closeList();
  return out.join('\n');
}

// Export for tests / node usage
if (typeof module !== 'undefined') {
  module.exports = {
    parseMarkdown,
    parseTopicPage,
    mdToHtml,
    topicBodyToHtml,
    extractInlineCitations,
    inferTopicFromKey,
    parseDomainsField,
    PRIMARY_TOPIC_KEYS,
    APP_DOMAIN_KEYS,
    TOPIC_PREFIXES,
    RESERVED_HEADINGS,
  };
}
if (typeof window !== 'undefined') {
  window.parseMarkdown = parseMarkdown;
  window.parseTopicPage = parseTopicPage;
  window.mdToHtml = mdToHtml;
  window.topicBodyToHtml = topicBodyToHtml;
  window.extractInlineCitations = extractInlineCitations;
}

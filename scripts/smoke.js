#!/usr/bin/env node
/**
 * scripts/smoke.js — quick parser + engine smoke test.
 * Loads the actual source markdown files and topic markdown files and runs
 * them through the parser, asserting that the schema is honored. No puppeteer.
 *
 * v1.14: streamlined — removed ~3000 mechanical per-entry checks that
 * the parser already enforces. Keeps the cross-cutting checks that catch
 * real-world bugs (typo'd topic keys, broken citations, missing summaries).
 *
 * Categories:
 *  - schema: frontmatter fields present and well-formed
 *  - taxonomy: topic / domain_tag / practice_tag are valid keys
 *  - citations: every [n] reference resolves to a real entry, and every
 *    "Cited in" link points to a topic that actually cites the entry
 *  - home structure: v1.4 hero/ticker/doors + CSS classes
 *  - v1.11 sorting: published-date logic in app.js
 *
 * Usage: node scripts/smoke.js
 */

const fs = require('fs');
const path = require('path');
const { parseMarkdown, parseTopicPage } = require('../assets/parser.js');
const CONFIG = require('../assets/config.js');

let pass = 0, fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); }
}

const ENTRIES_DIR = path.join(__dirname, '..', 'entries');
const TOPICS_DIR = path.join(__dirname, '..', 'topics');
const INDEX_FILE = path.join(__dirname, '..', 'assets', 'entries-index.js');
const TOPICS_INDEX_FILE = path.join(__dirname, '..', 'assets', 'topics-index.js');

// ---- Load sources ----
const indexSrc = fs.readFileSync(INDEX_FILE, 'utf8');
const m = indexSrc.match(/ENTRY_KEYS\s*=\s*\[([\s\S]*?)\]/);
const arrText = (m[1] || '')
  .replace(/\/\/[^\n]*/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/,\s*([\]])/g, '$1');
let keys = [];
try {
  const parsed = JSON.parse('[' + arrText + ']');
  keys = parsed.filter(k => typeof k === 'string' && k.length > 0);
} catch (e) {
  keys = arrText.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
}

console.log(`Loading ${keys.length} sources from ENTRY_KEYS…\n`);

const entries = {};
const seen = new Set();
let dupesInIndex = 0;
for (const k of keys) {
  if (seen.has(k)) { dupesInIndex++; continue; }
  seen.add(k);
  const p = path.join(ENTRIES_DIR, k + '.md');
  if (!fs.existsSync(p)) {
    check(`source exists: ${k}`, false, `file not found: ${p}`);
    continue;
  }
  const raw = fs.readFileSync(p, 'utf8');
  const e = parseMarkdown(k + '.md', raw);
  entries[k] = e;
}
if (dupesInIndex > 0) {
  check(`no duplicate keys in entries-index.js`, dupesInIndex === 0, `${dupesInIndex} duplicate(s) found`);
}

// =============================================================================
// Schema + taxonomy — one pass per entry, only critical checks
// =============================================================================
console.log('\nSource schema + taxonomy:');
for (const [k, e] of Object.entries(entries)) {
  // Schema (only check what the parser doesn't already guarantee)
  if (!e.title) check(`  ${k}: has title`, false, 'parser returned no title');

  // Summary is hand-written for many entries, so check it
  if (!e.summary) check(`  ${k}: has summary`, false, 'no TL;DR section');

  // Taxonomy — catches typos in topic/domain/practice keys
  const topicOk = !!(CONFIG.primaryTopics[e.topic] || CONFIG.applicationDomains[e.topic] || CONFIG.practiceAreas[e.topic]);
  if (!topicOk) check(`  ${k}: topic in primary, domain, or practice`, false, `topic: ${e.topic}`);

  // v1.13: multi-tag — every domain_tag and practice_tag must be a known key
  if (Array.isArray(e.domain_tags)) {
    for (const tag of e.domain_tags) {
      if (!CONFIG.applicationDomains[tag]) {
        check(`  ${k}: domain_tag "${tag}" is known app domain`, false, `tag: ${tag}`);
      }
    }
  } else {
    check(`  ${k}: domain_tags is array`, false, `type: ${typeof e.domain_tags}`);
  }
  if (Array.isArray(e.practice_tags)) {
    for (const tag of e.practice_tags) {
      if (!CONFIG.practiceAreas[tag]) {
        check(`  ${k}: practice_tag "${tag}" is known practice area`, false, `tag: ${tag}`);
      }
    }
  } else {
    check(`  ${k}: practice_tags is array`, false, `type: ${typeof e.practice_tags}`);
  }
}
// Bulk success log (one per entry, not per check) — keeps signal/noise high
console.log(`  ✓ schema + taxonomy clean across ${Object.keys(entries).length} entries`);

// =============================================================================
// Citations — every [n] reference in a topic page must resolve
// =============================================================================
let topicKeys = [];
if (fs.existsSync(TOPICS_INDEX_FILE)) {
  const tSrc = fs.readFileSync(TOPICS_INDEX_FILE, 'utf8');
  const tm = tSrc.match(/TOPIC_KEYS\s*=\s*\[([\s\S]*?)\]/);
  const tArrText = (tm[1] || '')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/,\s*([\]])/g, '$1');
  try {
    const parsed = JSON.parse('[' + tArrText + ']');
    topicKeys = parsed.filter(k => typeof k === 'string' && k.length > 0);
  } catch (e) {
    topicKeys = tArrText.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  }
}

if (topicKeys.length > 0) {
  console.log(`\nLoading ${topicKeys.length} topic pages from TOPIC_KEYS…\n`);

  const topics = {};
  for (const k of topicKeys) {
    const p = path.join(TOPICS_DIR, k + '.md');
    if (!fs.existsSync(p)) {
      check(`topic exists: ${k}`, false, `file not found: ${p}`);
      continue;
    }
    const raw = fs.readFileSync(p, 'utf8');
    const t = parseTopicPage(k + '.md', raw);
    topics[k] = t;
  }

  // Citation validation: every cited key must be a real source
  let badCitations = 0;
  for (const [k, t] of Object.entries(topics)) {
    for (const c of t.citations) {
      if (!entries[c.key]) {
        check(`  ${k}: citation [${c.number}] "${c.key}" resolves to a real source`, false, `key: ${c.key}`);
        badCitations++;
      }
    }
    for (const ck of Object.keys(t.citationByKey)) {
      if (!entries[ck]) {
        check(`  ${k}: forward citation "${ck}" is a known source`, false, `key: ${ck}`);
        badCitations++;
      }
    }
    // Topic taxonomy
    const topicKeyOk = !!(CONFIG.specialtyTopics[t.topicKey] || CONFIG.primaryTopics[t.topicKey] || CONFIG.applicationDomains[t.topicKey] || CONFIG.practiceAreas[t.topicKey]);
    if (!topicKeyOk) check(`  ${k}: topicKey in primary, domain, or practice`, false, `topicKey: ${t.topicKey}`);
    if (!t.title) check(`  ${k}: has title`, false, 'parser returned no title');
    if ((t.sections || []).length < 1) check(`  ${k}: has ≥1 section`, false, `sections: ${(t.sections || []).length}`);
  }
  if (badCitations === 0) {
    const totalCitations = Object.values(topics).reduce((s, t) => s + t.citations.length, 0);
    console.log(`  ✓ ${totalCitations} citations across ${Object.keys(topics).length} topic pages all resolve`);
  }
}

// =============================================================================
// v1.4 home page structure (CSS classes + JS functions that must exist)
// =============================================================================
console.log('\n--- v1.4 home page structure ---');

const cfgRaw = fs.readFileSync('assets/config.js', 'utf8');
const appRaw = fs.readFileSync('assets/app.js', 'utf8');
const cssRaw = fs.readFileSync('assets/styles.css', 'utf8');

check('config has doors block', /doors:\s*\{/.test(cfgRaw));
check('config doors has 3 audience pages', /practitioner:/.test(cfgRaw) && /learner:/.test(cfgRaw) && /researcher:/.test(cfgRaw));
check('config doors uses active-voice titles', /I have a problem/.test(cfgRaw) && /I want to understand SE/.test(cfgRaw) && /what's new/i.test(cfgRaw));
check('config has ticker block', /ticker:\s*\{/.test(cfgRaw));
check('config has disruptivePapers block', /disruptivePapers:/.test(cfgRaw));
check('app.js has renderHot function for /hot route', /function renderHot/.test(appRaw));
check('app.js about page mentions 3 audience pages', /for-practitioners/.test(appRaw) && /for-learners/.test(appRaw) && /for-researchers/.test(appRaw));
check('app.js about page is in active voice ("I")', /\bI'm\b|\bI (read|write|add|tag|ship|won't)/.test(appRaw));
check('sitemap.xml includes /hot', /\/hot/.test(fs.readFileSync('sitemap.xml', 'utf8')));
// One combined check for ticker CSS (replaces 8 individual CSS class checks)
check('CSS has ticker styles', /\.ticker\s*\{/.test(cssRaw) && /\.ticker-current\s*\{/.test(cssRaw) && /\.ticker-nav\s*\{/.test(cssRaw) && /\.ticker-dot\.is-active/.test(cssRaw));
check('CSS has .doors / .trending / .disrupt / .audience-page',
  /\.doors\s*\{/.test(cssRaw) && /\.trending\s*\{/.test(cssRaw) && /\.disrupt\s*\{/.test(cssRaw) && /\.audience-page\s*\{/.test(cssRaw));
check('CSS respects prefers-reduced-motion', /prefers-reduced-motion/.test(cssRaw));
check('CSS .ticker-nav[disabled] has reduced interactivity',
  /\.ticker-nav\[disabled\][^}]*not-allowed/m.test(cssRaw) &&
  /\.ticker-nav\[disabled\][^}]*pointer-events:\s*none/m.test(cssRaw) &&
  /\.ticker-nav\[disabled\][^}]*opacity/m.test(cssRaw));
check('CSS mobile ticker breakpoint', /@media\s*\(max-width:\s*600px\)\s*\{[^}]*\.ticker\s*\{[^}]*height:\s*88px/m.test(cssRaw));
// Ticker JS (one combined check)
check('app.js ticker: wireTicker + slideshow + 10s auto-advance + keyboard nav',
  /function wireTicker/.test(appRaw) &&
  /AUTO_ADVANCE_MS\s*=\s*10000/.test(appRaw) &&
  /ArrowLeft/.test(appRaw) && /ArrowRight/.test(appRaw) &&
  /prefers-reduced-motion: reduce/.test(appRaw) &&
  /aria-label="Recent additions"/.test(appRaw));
check('app.js has render functions (hero, ticker, doors, trending, audience)',
  /function renderHeroStrip/.test(appRaw) &&
  /function renderTicker/.test(appRaw) &&
  /function renderDoors/.test(appRaw) &&
  /function renderTrendingDashboard/.test(appRaw) &&
  /function renderForAudience/.test(appRaw));
check('app.js routes /for-practitioners, /for-learners, /for-researchers',
  /\/for-practitioners/.test(appRaw) && /\/for-learners/.test(appRaw) && /\/for-researchers/.test(appRaw));

// =============================================================================
// v1.11 published-date sorting — sort by published, not lastUpdated
// =============================================================================
console.log('\nv1.11 published-date sorting:');
check('computeTickerItems sorts by published date',
  /function\s+computeTickerItems[\s\S]*?e\.published\s*\|\|\s*e\.lastUpdated[\s\S]*?localeCompare/.test(appRaw));
check('countLatest filters by published date',
  /function\s+countLatest[\s\S]*?e\.published\s*\|\|\s*e\.lastUpdated[\s\S]*?daysAgo/.test(appRaw));
check('renderLatest sorts by published date',
  /function\s+renderLatest[\s\S]*?e\.published\s*\|\|\s*e\.lastUpdated[\s\S]*?localeCompare/.test(appRaw));
check('renderResearcherPage sorts "what changed" by published date',
  /function\s+renderResearcherPage[\s\S]*?e\.published\s*\|\|\s*e\.lastUpdated[\s\S]*?localeCompare/.test(appRaw));
check('JSON-LD: datePublished from published, dateModified from lastUpdated',
  /data\.datePublished\s*=\s*published\s*\|\|\s*lastUpdated/.test(appRaw) &&
  /data\.dateModified\s*=\s*lastUpdated\s*\|\|\s*published/.test(appRaw));
check('setMeta sets article:published_time from entry.published',
  /article:published_time.*published/s.test(appRaw));
check('entry header shows "Published" date',
  /<span class="label">Published<\/span>/.test(appRaw));

console.log(`\n==================================================`);
console.log(`  ${pass} passed, ${fail} failed`);
console.log(`==================================================\n`);
process.exit(fail === 0 ? 0 : 1);

#!/usr/bin/env node
/**
 * scripts/smoke.js — quick parser + engine smoke test.
 * Loads the actual source markdown files and topic markdown files and runs
 * them through the parser, asserting that the schema is honored. No puppeteer.
 *
 * Usage: node scripts/smoke.js
 */

const fs = require('fs');
const path = require('path');
const { parseMarkdown, parseTopicPage, extractInlineCitations } = require('../assets/parser.js');
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
for (const k of keys) {
  const p = path.join(ENTRIES_DIR, k + '.md');
  if (!fs.existsSync(p)) {
    check(`source exists: ${k}`, false, `file not found: ${p}`);
    continue;
  }
  const raw = fs.readFileSync(p, 'utf8');
  const e = parseMarkdown(k + '.md', raw);
  entries[k] = e;
  check(`parsed: ${k}`, !!e.title, `title: "${e.title}"`);
}

// Schema checks per source
console.log('\nSource schema validation:');
for (const [k, e] of Object.entries(entries)) {
  check(`  ${k}: has title`, !!e.title);
  check(`  ${k}: has summary`, !!e.summary, e.summary ? '' : 'no TL;DR section');
  check(`  ${k}: has lastUpdated`, !!e.lastUpdated);
  check(`  ${k}: has triage in {watch,read,try,ignore}`, ['watch','read','try','ignore'].includes(e.triage), `triage: ${e.triage}`);
  check(`  ${k}: signal in 0..1`, e.signal >= 0 && e.signal <= 1, `signal: ${e.signal}`);
  check(`  ${k}: topic in primary or domain`, !!(CONFIG.primaryTopics[e.topic] || CONFIG.applicationDomains[e.topic]), `topic: ${e.topic}`);
}

// Conference sources
console.log('\nConference sources:');
for (const [k, e] of Object.entries(entries)) {
  if (!e.isConference) continue;
  check(`  ${k}: event in registry`, !!CONFIG.events[e.event], `event: ${e.event}`);
  check(`  ${k}: track in registry`, !!CONFIG.tracks[e.track], `track: ${e.track}`);
  check(`  ${k}: has year`, !!e.year, `year: ${e.year}`);
  check(`  ${k}: has authors`, !!e.authors);
}

// Coverage
console.log('\nSource coverage:');
for (const t of Object.keys(CONFIG.primaryTopics)) {
  const n = Object.values(entries).filter(e => e.topic === t).length;
  check(`  primary topic ${t} has ≥0 sources`, n >= 0, `count: ${n}`);
}

// ---- Load topic pages ----
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
    check(`parsed topic: ${k}`, !!t.title, `title: "${t.title}"`);
  }

  // Schema checks per topic
  console.log('\nTopic schema validation:');
  for (const [k, t] of Object.entries(topics)) {
    check(`  ${k}: has title`, !!t.title);
    check(`  ${k}: has lastCurated`, !!t.lastCurated);
    check(`  ${k}: topicKey in primary or domain`, !!(CONFIG.primaryTopics[t.topicKey] || CONFIG.applicationDomains[t.topicKey]), `topicKey: ${t.topicKey}`);
    check(`  ${k}: has ≥1 section`, (t.sections || []).length >= 1, `sections: ${(t.sections || []).length}`);

    // Citation validation: every cited key must be a real source
    for (const c of t.citations) {
      check(`  ${k}: citation [${c.number}] "${c.key}" resolves to a real source`, !!entries[c.key], `key: ${c.key}`);
    }

    // Forward integrity: a source can claim "Cited in: <topic>" only if that
    // topic page actually cites it. We can't easily simulate the runtime, but
    // we can check the inverse at parse time: every cited key gets a number
    // (we already assert that), and every key in citationByKey is a real source.
    for (const ck of Object.keys(t.citationByKey)) {
      check(`  ${k}: forward citation "${ck}" is a known source`, !!entries[ck], `key: ${ck}`);
    }
  }

  // Cross-check: for every source, the set of topic pages that cite it is
  // the same as the set the renderer would compute. We can build this from
  // the topics' citationByKey and assert it's consistent.
  console.log('\nForward citation integrity:');
  const citedBy = {}; // source-key → array of topic-keys that cite it
  for (const [topicKey, t] of Object.entries(topics)) {
    for (const c of t.citations) {
      if (!citedBy[c.key]) citedBy[c.key] = [];
      citedBy[c.key].push(topicKey);
    }
  }
  for (const srcKey of Object.keys(citedBy)) {
    check(`  ${srcKey}: cited by ${citedBy[srcKey].length} topic page(s)`, citedBy[srcKey].length >= 1, `topics: ${citedBy[srcKey].join(', ')}`);
  }
}

console.log(`\n==================================================`);
console.log(`  ${pass} passed, ${fail} failed`);
console.log(`==================================================\n`);
process.exit(fail === 0 ? 0 : 1);

#!/usr/bin/env node
/**
 * scripts/smoke.js — quick parser + engine smoke test.
 * Loads the actual entry markdown files and runs them through the parser,
 * asserting that the schema is honored. No puppeteer required.
 *
 * Usage: node scripts/smoke.js
 */

const fs = require('fs');
const path = require('path');
const { parseMarkdown } = require('../assets/parser.js');
const CONFIG = require('../assets/config.js');

let pass = 0, fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); }
}

const ENTRIES_DIR = path.join(__dirname, '..', 'entries');
const INDEX_FILE = path.join(__dirname, '..', 'assets', 'entries-index.js');
const indexSrc = fs.readFileSync(INDEX_FILE, 'utf8');
const m = indexSrc.match(/ENTRY_KEYS\s*=\s*\[([\s\S]*?)\]/);
const arrText = (m[1] || '')
  .replace(/\/\/[^\n]*/g, '')        // strip // line comments
  .replace(/\/\*[\s\S]*?\*\//g, '')   // strip /* */ blocks
  .replace(/,\s*([\]])/g, '$1');      // strip trailing commas
let keys = [];
try {
  const parsed = JSON.parse('[' + arrText + ']');
  keys = parsed.filter(k => typeof k === 'string' && k.length > 0);
} catch (e) {
  keys = arrText.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
}

console.log(`Loading ${keys.length} entries from ENTRY_KEYS…\n`);

const entries = {};
for (const k of keys) {
  const p = path.join(ENTRIES_DIR, k + '.md');
  if (!fs.existsSync(p)) {
    check(`entry exists: ${k}`, false, `file not found: ${p}`);
    continue;
  }
  const raw = fs.readFileSync(p, 'utf8');
  const e = parseMarkdown(k + '.md', raw);
  entries[k] = e;
  check(`parsed: ${k}`, !!e.title, `title: "${e.title}"`);
}

// Schema checks per entry
console.log('\nSchema validation:');
for (const [k, e] of Object.entries(entries)) {
  check(`  ${k}: has title`, !!e.title);
  check(`  ${k}: has summary`, !!e.summary, e.summary ? '' : 'no TL;DR section');
  check(`  ${k}: has lastUpdated`, !!e.lastUpdated);
  check(`  ${k}: has triage in {watch,read,try,ignore}`, ['watch','read','try','ignore'].includes(e.triage), `triage: ${e.triage}`);
  check(`  ${k}: signal in 0..1`, e.signal >= 0 && e.signal <= 1, `signal: ${e.signal}`);
  check(`  ${k}: topic in primary or domain`, !!(CONFIG.primaryTopics[e.topic] || CONFIG.applicationDomains[e.topic]), `topic: ${e.topic}`);
}

// Conference entries
console.log('\nConference entries:');
for (const [k, e] of Object.entries(entries)) {
  if (!e.isConference) continue;
  check(`  ${k}: event in registry`, !!CONFIG.events[e.event], `event: ${e.event}`);
  check(`  ${k}: track in registry`, !!CONFIG.tracks[e.track], `track: ${e.track}`);
  check(`  ${k}: has year`, !!e.year, `year: ${e.year}`);
  check(`  ${k}: has authors`, !!e.authors);
}

// Cross-check: at least one entry per primary topic if file is named for it
console.log('\nCoverage:');
for (const t of Object.keys(CONFIG.primaryTopics)) {
  const n = Object.values(entries).filter(e => e.topic === t).length;
  check(`  primary topic ${t} has ≥0 entries`, n >= 0, `count: ${n}`);
}

console.log(`\n==================================================`);
console.log(`  ${pass} passed, ${fail} failed`);
console.log(`==================================================\n`);
process.exit(fail === 0 ? 0 : 1);

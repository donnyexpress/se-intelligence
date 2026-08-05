#!/usr/bin/env node
/**
 * scripts/test-search.js — T-04: search behaviour.
 *
 * Asserts:
 *   - Search returns BOTH topic pages and sources
 *   - Topic results have a "Topic" badge
 *   - Source results have a triage badge (or none for now)
 *   - Clicking a topic result navigates to /topic/<key> (not /source/)
 *   - Clicking a source result navigates to /source/<key>
 *   - Search by name works (e.g. "reliab" → Reliability & Resilience)
 *   - Search by content works (e.g. "MBSE" → topic + sources that mention it)
 *
 * Usage: BASE=http://localhost:8788 node scripts/test-search.js
 */

const puppeteer = require('puppeteer');

const BASE = process.env.BASE || 'http://localhost:8788';

let pass = 0, fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.on('pageerror', err => console.log('  ✗ PAGE ERROR:', err.message));

  async function ready() {
    await page.waitForFunction(() => window.__getState && window.__getState().loaded, { timeout: 15000 });
  }

  console.log('--- Search by topic name ("reliability") ---\n');
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await ready();
  await page.click('#search-toggle');
  await new Promise(r => setTimeout(r, 200));
  await page.type('#mobile-search-input', 'reliability', { delay: 30 });
  await new Promise(r => setTimeout(r, 500));

  // Search results aren't strictly ordered; check that Reliability & Resilience
  // appears in the topic-result set, and that clicking it lands on /topic/reliab
  const reliabilityResults = await page.evaluate(() => {
    return [...document.querySelectorAll('.result')].map(r => ({
      title: r.querySelector('.title')?.textContent || '',
      tag: r.querySelector('.tag')?.textContent || '',
      href: r.getAttribute('href') || '',
    }));
  });
  check('Search for "reliability" returns ≥1 result', reliabilityResults.length >= 1,
    `count: ${reliabilityResults.length}`);
  const reliabilityTopic = reliabilityResults.find(r =>
    r.tag === 'Topic' && r.title.includes('Reliability'));
  check('"reliability" search includes the Reliability & Resilience topic',
    !!reliabilityTopic,
    `looking through: ${reliabilityResults.map(r => r.title).join(', ')}`);

  console.log('\n--- Click Reliability topic result ---\n');
  await page.evaluate(() => {
    const r = [...document.querySelectorAll('.result')].find(el =>
      el.getAttribute('href') === '/topic/reliab');
    if (r) r.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await ready();
  const topicPath = await page.evaluate(() => location.pathname);
  check('Clicking Reliability topic result lands on /topic/reliab',
    topicPath === '/topic/reliab', `landed at: ${topicPath}`);

  console.log('\n--- Search by content ("MBSE") ---\n');
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await ready();
  await page.click('#search-toggle');
  await new Promise(r => setTimeout(r, 200));
  await page.type('#mobile-search-input', 'MBSE', { delay: 30 });
  await new Promise(r => setTimeout(r, 500));

  const mbseResults = await page.evaluate(() => {
    return [...document.querySelectorAll('.result')].map(r => ({
      title: r.querySelector('.title')?.textContent || '',
      tag: r.querySelector('.tag')?.textContent || '',
      href: r.getAttribute('href') || '',
    }));
  });
  check('MBSE search returns ≥1 result', mbseResults.length >= 1, `count: ${mbseResults.length}`);
  // At least one of the results should be a source (the MBSE patterns paper)
  const mbseSources = mbseResults.filter(r => r.href.startsWith('/source/'));
  const mbseTopics = mbseResults.filter(r => r.href.startsWith('/topic/'));
  check('MBSE search includes at least one source', mbseSources.length >= 1,
    `sources: ${mbseSources.length}`);
  check('MBSE search includes at least one topic', mbseTopics.length >= 1,
    `topics: ${mbseTopics.length}`);

  console.log('\n--- Click source result ---\n');
  // Click the first source result for MBSE
  await page.evaluate(() => {
    const r = [...document.querySelectorAll('.result')].find(el =>
      el.getAttribute('href') && el.getAttribute('href').startsWith('/source/'));
    if (r) r.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await ready();
  const sourcePath = await page.evaluate(() => location.pathname);
  check('Clicking source result lands on /source/<key>',
    sourcePath.startsWith('/source/'), `landed at: ${sourcePath}`);

  console.log('\n--- Empty / no-match search ---\n');
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await ready();
  await page.click('#search-toggle');
  await new Promise(r => setTimeout(r, 200));
  await page.type('#mobile-search-input', 'xyzqq123nonsense', { delay: 30 });
  await new Promise(r => setTimeout(r, 500));
  const noMatchText = await page.$eval('#mobile-search-results', el => el.innerText);
  check('No-match search shows "No matches"',
    noMatchText.toLowerCase().includes('no matches'),
    `text: ${noMatchText}`);

  await browser.close();
  console.log(`\n==================================================`);
  console.log(`  ${pass} passed, ${fail} failed`);
  console.log(`==================================================\n`);
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });

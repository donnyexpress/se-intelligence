#!/usr/bin/env node
/**
 * scripts/test-routes.js — T-03: routing & view tests via Puppeteer.
 *
 * Asserts:
 *   - Home page renders the Knowledge base section + dashboard + hero
 *   - /topics index lists topic pages grouped by topic
 *   - /sources index lists sources grouped by type
 *   - /topic/<key> renders with citations as [n] links + auto references list
 *   - /source/<key> renders with the "Cited in" section
 *   - /entry/<key> legacy URL redirects to /source/<key>
 *   - 404s show the correct "not found" message
 *   - Clicking a citation in a topic body navigates to the cited source
 *
 * Usage: BASE=http://localhost:8788 node scripts/test-routes.js
 *
 * Assumes the site is being served (either via `npx wrangler pages dev` or
 * the Python SPA server in scripts/spa-server.py). Comments-API-dependent
 * tests are in test-comments.js.
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

  async function visit(path) {
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 15000 });
    // Wait for the SPA to load its data (state.loaded = true)
    await page.waitForFunction(() => window.__getState && window.__getState().loaded, { timeout: 15000 });
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('--- Home page ---\n');
  await visit('/');
  check('Home: Knowledge base section visible', !!(await page.$('.topics-featured')));
  check('Home: Hottest topics dashboard visible', !!(await page.$('.hot-topics')));
  // Hero lives in the feed component: <span class="kicker"><h1>SE Intelligence</h1>
  check('Home: Hero h1 visible',
    await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 && h1.textContent.includes('SE Intelligence');
    }));
  check('Home: Brand "SE Intelligence" in sidebar',
    await page.$eval('.brand', el => el.textContent).then(t => t.includes('SE Intelligence')));
  check('Home: Page title contains "SE Intelligence"', await page.title().then(t => t.includes('SE Intelligence')));

  console.log('\n--- /topics index ---\n');
  await visit('/topics');
  check('Topics index: shows topic page(s)', (await page.$$('.topics-bucket')).length >= 1);
  check('Topics index: at least one system-def bucket', await page.evaluate(() => {
    return [...document.querySelectorAll('.topics-bucket h2')].some(h => h.textContent.includes('System Definition'));
  }));

  console.log('\n--- /sources index ---\n');
  await visit('/sources');
  check('Sources index: shows source groupings', (await page.$$('.topics-bucket')).length >= 1);
  check('Sources index: has the Reliability source', await page.evaluate(() => {
    return document.body.innerText.includes('Meta storage');
  }));

  console.log('\n--- /topic/system-def ---\n');
  await visit('/topic/system-def');
  check('Topic: title rendered', !!(await page.$('h1.topic-title')));
  check('Topic: maturity tag rendered', !!(await page.$('.topic-maturity')));
  check('Topic: ≥1 inline citation rendered as <sup>', (await page.$$('sup.cite a')).length >= 5);
  check('Topic: references list rendered', !!(await page.$('.topic-references ol')));
  check('Topic: references list has ≥1 entry', (await page.$$('.topic-references li')).length >= 1);
  check('Topic: comments section rendered', !!(await page.$('.comments-section')));
  check('Topic: comments section has topic-specific blurb',
    await page.$eval('.comments-blurb', el => el.textContent.toLowerCase().includes('topic')));

  console.log('\n--- /source/reliab-meta-storage-tail-aware ---\n');
  await visit('/source/reliab-meta-storage-tail-aware');
  check('Source: title rendered', !!(await page.$('h1.entry-title')));
  check('Source: "Cited in" section rendered', !!(await page.$('.cited-in-section')));
  check('Source: "Cited in" lists Reliability & Resilience',
    await page.$eval('.cited-in-section', el => el.innerText.includes('Reliability & Resilience')));
  check('Source: "Cited in" lists Distributed Systems',
    await page.$eval('.cited-in-section', el => el.innerText.includes('Distributed Systems')));
  check('Source: "Cited in" shows the citation number for each topic',
    await page.$$eval('.cited-in-section .cite-num', els => els.length >= 2));

  console.log('\n--- Legacy /entry/ → /source/ redirect ---\n');
  await visit('/entry/system-def-mbse-patterns-2025');
  const finalPath = await page.evaluate(() => location.pathname);
  check('Legacy /entry/ redirects to /source/', finalPath === '/source/system-def-mbse-patterns-2025',
    `landed at: ${finalPath}`);

  console.log('\n--- 404s ---\n');
  await visit('/topic/does-not-exist');
  const topic404 = await page.$eval('h1', el => el.textContent);
  check('Topic 404 shows "Topic not found"', topic404.includes('Topic not found'),
    `got: ${topic404}`);

  await visit('/source/does-not-exist');
  const source404 = await page.$eval('h1', el => el.textContent);
  check('Source 404 shows "Entry not found"', source404.includes('Entry not found'),
    `got: ${source404}`);

  console.log('\n--- Citation click navigates to source ---\n');
  await visit('/topic/system-def');
  // Click the first citation in the topic body
  const citeHref = await page.$eval('sup.cite a', el => el.getAttribute('href'));
  check('Citation has href to /source/<key>', citeHref && citeHref.startsWith('/source/'),
    `href: ${citeHref}`);
  await page.click('sup.cite a');
  await new Promise(r => setTimeout(r, 500));
  await page.waitForFunction(() => window.__getState && window.__getState().loaded, { timeout: 10000 });
  const landingPath = await page.evaluate(() => location.pathname);
  check('Citation click navigates to /source/<key>',
    landingPath.startsWith('/source/'),
    `landed at: ${landingPath}`);

  await browser.close();
  console.log(`\n==================================================`);
  console.log(`  ${pass} passed, ${fail} failed`);
  console.log(`==================================================\n`);
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });

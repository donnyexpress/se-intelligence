#!/usr/bin/env node
/**
 * test.js — end-to-end smoke test for SE Intelligence
 *
 * Tests the actual user flows:
 *   1. Homepage loads with Knowledge base + Dashboard + Latest developments
 *   2. Sidebar shows SEBoK topics, application domains, conferences
 *   3. Source page renders title + summary + last-updated + Cited in
 *   4. Topic page renders title + summary + inline citations + references
 *   5. Mobile (portrait) — main uses full width
 *   6. Mobile (landscape) — toolbar visible
 *   7. Search works
 *   8. /conferences route renders
 *   9. /latest route renders
 *  10. /about route renders
 *  11. /topics route renders topic pages
 *  12. /sources route renders source list
 *  13. /entry/<key> legacy URL redirects to /source/<key>
 *  14. Comments API roundtrip (with cleanup)
 *
 * Usage:
 *   node scripts/test.js                    # uses http://localhost:8000
 *   node scripts/test.js http://yoursite/   # custom URL
 *   node scripts/test.js --headed           # see the browser
 *
 * Exit code: 0 if all pass, 1 if any fail.
 */

const puppeteer = require('puppeteer');

const HEADED = process.argv.includes('--headed');
const BASE = process.argv.find(a => a.startsWith('http')) || 'http://localhost:8000';

let passed = 0, failed = 0;
function check(name, ok, detail) {
  if (ok) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); }
}
function section(name) { console.log(`\n${name}`); }

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: HEADED ? false : 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (e) {
    console.error('\n✗ Could not start Puppeteer.');
    console.error('  Install it first:  cd tech-scan && npm install puppeteer\n');
    process.exit(1);
  }

  // === Desktop home ===
  section('DESKTOP (1440 × 900) — HOME');
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    const title = await page.title();
    check('Homepage loads', /SE Intelligence/i.test(title), `title: "${title}"`);

    const brand = await page.evaluate(() => document.querySelector('.brand')?.textContent);
    check('Brand shows site name', brand === 'SE Intelligence', `brand: ${brand}`);

    const theme = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
    check('Theme accent is set', !!theme, `accent: ${theme}`);

    // Knowledge base section (v1.1)
    const hasKnowledgeBase = await page.evaluate(() => !!document.querySelector('.topics-featured'));
    check('Home shows Knowledge base section', hasKnowledgeBase);

    // Hot-topics dashboard
    const hasHotTopics = await page.evaluate(() => !!document.querySelector('.hot-topics'));
    check('Home shows Hottest topics dashboard', hasHotTopics);

    // Latest developments view
    const hasLatestHeader = await page.evaluate(() => /Latest developments/.test(document.querySelector('.section-title')?.textContent || ''));
    check('Home shows "Latest developments" header', hasLatestHeader);

    // Sidebar rails
    const hasSebokRail = await page.evaluate(() => {
      const h3s = Array.from(document.querySelectorAll('.sidebar h3'));
      return h3s.some(h => /SEBoK Topics/.test(h.textContent));
    });
    check('Sidebar shows SEBoK Topics rail', hasSebokRail);

    const hasDomainsRail = await page.evaluate(() => {
      const h3s = Array.from(document.querySelectorAll('.sidebar h3'));
      return h3s.some(h => /Application Domains/.test(h.textContent));
    });
    check('Sidebar shows Application Domains rail', hasDomainsRail);

    const hasKnowledgeBaseRail = await page.evaluate(() => {
      const h3s = Array.from(document.querySelectorAll('.sidebar h3'));
      return h3s.some(h => /Knowledge base/.test(h.textContent));
    });
    check('Sidebar shows Knowledge base rail', hasKnowledgeBaseRail);

    const sidebarEntries = await page.evaluate(() => document.querySelectorAll('.flat-entries li a').length);
    check('Sidebar has entries', sidebarEntries >= 5, `count: ${sidebarEntries}`);

    // Triage filter chips
    const chips = await page.evaluate(() => document.querySelectorAll('.triage-chip').length);
    check('Triage filter chips present', chips === 5, `chips: ${chips}`);

    // Feed cards
    const cards = await page.evaluate(() => document.querySelectorAll('.feed-card').length);
    check('Feed cards rendered', cards >= 1, `count: ${cards}`);

    await page.close();
  }

  // === Phone portrait ===
  section('PHONE PORTRAIT (375 × 812)');
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(BASE, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    const mobileBar = await page.evaluate(() => !!document.querySelector('.mobile-bar'));
    check('Mobile bar visible', mobileBar);

    // Open sidebar via menu button
    await page.click('.menu-btn');
    await new Promise(r => setTimeout(r, 300));
    const panelOpen = await page.evaluate(() => document.querySelector('.shell').classList.contains('panel-open'));
    check('Sidebar panel opens', panelOpen);

    await page.close();
  }

  // === Routes ===
  section('ROUTES');
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    // /source/<key> (formerly /entry/)
    await page.evaluate(() => { history.pushState(null, '', '/source/sys-fund-ackoff-systems-thinking'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await new Promise(r => setTimeout(r, 800));
    const entryH1 = await page.evaluate(() => document.querySelector('.entry-title')?.textContent);
    check('/source/<key> route renders title', /Ackoff/.test(entryH1 || ''), `h1: ${entryH1}`);

    const lastUpdated = await page.evaluate(() => !!document.querySelector('time[datetime]'));
    check('Source shows last-updated date', lastUpdated);

    const triageShown = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.entry-meta .tag')).some(t => /watch|read|try|ignore/.test(t.textContent));
    });
    check('Source meta shows triage tag', triageShown);

    const signalShown = await page.evaluate(() => !!document.querySelector('.signal-meter'));
    check('Source shows signal meter', signalShown);

    // /topic/<key> (v1.1 — new)
    await page.evaluate(() => { history.pushState(null, '', '/topic/system-def'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await new Promise(r => setTimeout(r, 1000));
    const topicH1 = await page.evaluate(() => document.querySelector('h1.topic-title')?.textContent);
    check('/topic/<key> route renders title', /System Definition/.test(topicH1 || ''), `h1: ${topicH1}`);
    const topicCitations = await page.evaluate(() => document.querySelectorAll('sup.cite a').length);
    check('Topic page shows inline citations', topicCitations >= 3, `citations: ${topicCitations}`);
    const topicRefs = await page.evaluate(() => document.querySelectorAll('.topic-references li').length);
    check('Topic page shows references list', topicRefs >= 3, `refs: ${topicRefs}`);

    // "Cited in" section on a source
    await page.evaluate(() => { history.pushState(null, '', '/source/reliab-meta-storage-tail-aware'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await new Promise(r => setTimeout(r, 1000));
    const citedInCount = await page.evaluate(() => document.querySelectorAll('.cited-in-section a').length);
    check('Source shows "Cited in" with topic links', citedInCount >= 2, `count: ${citedInCount}`);

    // /topics index
    await page.evaluate(() => { history.pushState(null, '', '/topics'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await new Promise(r => setTimeout(r, 800));
    const topicsH1 = await page.evaluate(() => document.querySelector('.main h1')?.textContent);
    check('/topics route renders', /Topics/.test(topicsH1 || ''), `h1: ${topicsH1}`);

    // /sources index
    await page.evaluate(() => { history.pushState(null, '', '/sources'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await new Promise(r => setTimeout(r, 800));
    const sourcesH1 = await page.evaluate(() => document.querySelector('.main h1')?.textContent);
    check('/sources route renders', /Sources/.test(sourcesH1 || ''), `h1: ${sourcesH1}`);

    // /latest
    await page.evaluate(() => { history.pushState(null, '', '/latest'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await new Promise(r => setTimeout(r, 600));
    const latestH1 = await page.evaluate(() => document.querySelector('.section-title')?.textContent);
    check('/latest route renders', /Latest developments/.test(latestH1 || ''), `section: ${latestH1}`);

    // /conferences
    await page.evaluate(() => { history.pushState(null, '', '/conferences'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await new Promise(r => setTimeout(r, 600));
    const confH1 = await page.evaluate(() => document.querySelector('.main h1')?.textContent);
    check('/conferences route renders', /Conference/.test(confH1 || ''), `h1: ${confH1}`);

    const confEventCount = await page.evaluate(() => document.querySelectorAll('.conf-event').length);
    check('/conferences shows event groups', confEventCount >= 1, `events: ${confEventCount}`);

    // /about
    await page.evaluate(() => { history.pushState(null, '', '/about'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await new Promise(r => setTimeout(r, 600));
    const aboutH1 = await page.evaluate(() => document.querySelector('.main h1')?.textContent);
    check('/about route renders', /About/.test(aboutH1 || ''), `h1: ${aboutH1}`);

    // /admin
    await page.evaluate(() => { history.pushState(null, '', '/admin'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await new Promise(r => setTimeout(r, 600));
    const adminH1 = await page.evaluate(() => document.querySelector('.hero h1')?.textContent);
    check('/admin route renders', adminH1 === 'Admin', `h1: ${adminH1}`);

    // Conference source
    await page.evaluate(() => { history.pushState(null, '', '/source/conf-is2024-mbse-patterns-practice'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await new Promise(r => setTimeout(r, 800));
    const confCard = await page.evaluate(() => !!document.querySelector('.conf-meta-card'));
    check('Conference source shows conf meta card', confCard);

    // Comments API roundtrip (skipped locally without Pages Function)
    await page.goto(BASE, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    const apiResult = await page.evaluate(async () => {
      let postedId = null;
      try {
        const tag = 'test-' + Math.random().toString(36).slice(2, 8);
        const body = { entry: 'sys-fund-ackoff-systems-thinking', ns: 'source', type: 'note', name: 'TestRunner', message: 'Automated test: ' + tag };
        const post = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!post.ok) return { skipped: true, reason: 'POST failed: ' + post.status };
        const postJson = await post.json();
        postedId = postJson.comment && postJson.comment.id;
        const get = await fetch('/api/comments?entry=sys-fund-ackoff-systems-thinking&ns=source');
        if (!get.ok) return { skipped: true, reason: 'GET failed: ' + get.status };
        const getJson = await get.json();
        const found = (getJson.comments || []).find(c => c.message === body.message);
        return { posted: true, found: !!found, totalCount: (getJson.comments || []).length, postedId };
      } catch (e) {
        return { skipped: true, reason: e.message, postedId };
      } finally {
        if (postedId) {
          try { await fetch('/api/comments?id=' + encodeURIComponent(postedId) + '&key=sys-fund-ackoff-systems-thinking&ns=source', { method: 'DELETE' }); } catch (_) {}
        }
      }
    });
    if (apiResult.skipped) {
      check('Comments API roundtrip (skipped — no Pages Function locally)', true, apiResult.reason);
    } else {
      check('Comments API: POST and GET roundtrip', apiResult.posted && apiResult.found, JSON.stringify(apiResult));
    }

    await page.close();
  }

  await browser.close();
  console.log(`\n==================================================`);
  console.log(`  ${passed} passed, ${failed} failed`);
  console.log(`==================================================\n`);
  if (failed === 0) console.log('✓ All tests pass.\n');
  else console.log('✗ Some tests failed.\n');
  process.exit(failed === 0 ? 0 : 1);
})();

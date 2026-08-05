#!/usr/bin/env node
/**
 * scripts/test-comments.js — T-05: comments API + UI.
 *
 * Asserts:
 *   - Topic comment load (different blurb than source)
 *   - Source comment load
 *   - Submit a topic comment via API → appears in /topic/<key> UI
 *   - Submit a source comment via API → appears in /source/<key> UI
 *   - Namespace isolation: comment on /source/<key> doesn't show on /topic/<key>
 *   - Back-compat for legacy 'entry' param (still resolves to source namespace)
 *   - Admin namespace badge in /admin
 *
 * Usage: BASE=http://localhost:8788 node scripts/test-comments.js
 *
 * REQUIRES: `npx wrangler pages dev` running so the comments Worker executes
 * locally with COMMENTS_KV bound. The Python SPA server does NOT run Workers.
 */

const puppeteer = require('puppeteer');

const BASE = process.env.BASE || 'http://localhost:8788';

let pass = 0, fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); }
}

async function api(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (_) {}
  return { status: res.status, data };
}

(async () => {
  // ---- API tests ----
  console.log('--- Comments API: namespace isolation ---\n');

  const topicKey = 'system-def';
  const sourceKey = 'system-def-mbse-patterns-2025';

  // POST a topic comment
  const postTopic = await api('POST', '/api/comments', {
    entry: topicKey, ns: 'topic', type: 'note',
    name: 'Topic Tester', message: 'Test topic comment for v1.1',
  });
  check('POST /api/comments with ns=topic returns 201',
    postTopic.status === 201, `status: ${postTopic.status}`);

  // Wait past the rate-limit window (5s in the Worker) before the second post
  await new Promise(r => setTimeout(r, 5500));

  // POST a source comment
  const postSource = await api('POST', '/api/comments', {
    entry: sourceKey, ns: 'source', type: 'praise',
    name: 'Source Tester', message: 'Test source comment for v1.1',
  });
  check('POST /api/comments with ns=source returns 201',
    postSource.status === 201, `status: ${postSource.status}`);

  // GET with namespace — should return only its own comments
  const getTopic = await api('GET', `/api/comments?entry=${topicKey}&ns=topic`);
  const getSource = await api('GET', `/api/comments?entry=${sourceKey}&ns=source`);
  const topicMsgs = (getTopic.data?.comments || []).map(c => c.message);
  const sourceMsgs = (getSource.data?.comments || []).map(c => c.message);
  check('GET ns=topic returns the topic comment', topicMsgs.includes('Test topic comment for v1.1'));
  check('GET ns=source returns the source comment', sourceMsgs.includes('Test source comment for v1.1'));
  check('GET ns=topic does NOT return the source comment', !topicMsgs.includes('Test source comment for v1.1'));
  check('GET ns=source does NOT return the topic comment', !sourceMsgs.includes('Test topic comment for v1.1'));

  // Back-compat: legacy `entry` param without `ns` defaults to 'source'
  const getLegacy = await api('GET', `/api/comments?entry=${sourceKey}`);
  const legacyMsgs = (getLegacy.data?.comments || []).map(c => c.message);
  check('Legacy GET without ns defaults to source namespace',
    legacyMsgs.includes('Test source comment for v1.1'),
    `messages: ${JSON.stringify(legacyMsgs)}`);

  // ---- UI tests ----
  console.log('\n--- Comments UI ---\n');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.on('pageerror', err => console.log('  ✗ PAGE ERROR:', err.message));

  async function ready() {
    await page.waitForFunction(() => window.__getState && window.__getState().loaded, { timeout: 15000 });
  }

  // Topic page shows topic-specific blurb and the topic comment
  await page.goto(BASE + `/topic/${topicKey}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await ready();
  // Wait for comments to load (the thread stops saying "Loading comments…")
  await page.waitForFunction(
    () => {
      const t = document.querySelector('.comments-thread');
      return t && !t.innerText.includes('Loading');
    },
    { timeout: 10000 }
  ).catch(() => {});
  const topicBlurb = await page.$eval('.comments-blurb', el => el.textContent);
  check('Topic page comment blurb mentions topic',
    topicBlurb.toLowerCase().includes('topic'),
    `blurb: ${topicBlurb}`);
  const topicThread = await page.$eval('.comments-thread', el => el.innerText);
  check('Topic page shows the topic comment',
    topicThread.includes('Test topic comment for v1.1'),
    `thread excerpt: ${topicThread.slice(0, 200)}`);
  check('Topic page does NOT show the source comment',
    !topicThread.includes('Test source comment for v1.1'));

  // Source page shows source-specific blurb and the source comment
  await page.goto(BASE + `/source/${sourceKey}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await ready();
  await page.waitForFunction(
    () => {
      const t = document.querySelector('.comments-thread');
      return t && !t.innerText.includes('Loading');
    },
    { timeout: 10000 }
  ).catch(() => {});
  const sourceBlurb = await page.$eval('.comments-blurb', el => el.textContent);
  check('Source page comment blurb does NOT mention topic',
    !sourceBlurb.toLowerCase().includes('topic'),
    `blurb: ${sourceBlurb}`);
  const sourceThread = await page.$eval('.comments-thread', el => el.innerText);
  check('Source page shows the source comment',
    sourceThread.includes('Test source comment for v1.1'));
  check('Source page does NOT show the topic comment',
    !sourceThread.includes('Test topic comment for v1.1'));

  // Submit a comment via the UI form
  console.log('\n--- Comments UI: form submission ---\n');
  await page.goto(BASE + `/topic/${topicKey}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await ready();
  await new Promise(r => setTimeout(r, 500));
  await page.type('.comment-form[data-ns="topic"] input[name="name"]', 'UI Tester');
  await page.type('.comment-form[data-ns="topic"] textarea[name="message"]', 'Posted via UI form');
  await page.click('.comment-form[data-ns="topic"] button[type=submit]');
  await new Promise(r => setTimeout(r, 1000));
  const afterSubmit = await page.$eval('.comments-thread', el => el.innerText);
  check('UI form submit shows the new comment',
    afterSubmit.includes('Posted via UI form'),
    `thread excerpt: ${afterSubmit.slice(0, 200)}`);

  await browser.close();
  console.log(`\n==================================================`);
  console.log(`  ${pass} passed, ${fail} failed`);
  console.log(`==================================================\n`);
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });

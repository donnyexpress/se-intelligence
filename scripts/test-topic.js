// Test that every SEBoK topic filter works, and that dashboard clicks too
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.on('console', msg => { if (msg.type() === 'error') console.log('  PAGE ERR:', msg.text()); });
  await page.goto('http://localhost:8769/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const topics = ['system-def', 'sos', 'realization', 'eng-domains', 'management'];
  for (const t of topics) {
    await page.goto(`http://localhost:8769/?topic=${t}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    const result = await page.evaluate(() => {
      const s = window.__getState ? window.__getState() : null;
      return {
        activePrimaryTopic: s ? s.activePrimaryTopic : '—',
        cardCount: document.querySelectorAll('.feed-card').length,
        titles: Array.from(document.querySelectorAll('.feed-card .feed-title')).map(t => t.textContent.trim().slice(0, 60)),
      };
    });
    console.log(`\n/?topic=${t}`);
    console.log(`  activePrimaryTopic: ${result.activePrimaryTopic}`);
    console.log(`  cards: ${result.cardCount}`);
    for (const title of result.titles) console.log(`    - ${title}`);
  }

  // Also test: dashboard click (which is a /?topic=X link too)
  console.log('\n=== Dashboard link click test ===');
  await page.goto('http://localhost:8769/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  // Click first hot topic in the dashboard
  const firstHot = await page.$('.hot-row');
  if (firstHot) {
    await firstHot.click();
    await new Promise(r => setTimeout(r, 1000));
    const result = await page.evaluate(() => {
      const s = window.__getState ? window.__getState() : null;
      return {
        url: location.pathname + location.search,
        activePrimaryTopic: s ? s.activePrimaryTopic : '—',
        cardCount: document.querySelectorAll('.feed-card').length,
      };
    });
    console.log(`  URL after dashboard click: ${result.url}`);
    console.log(`  activePrimaryTopic: ${result.activePrimaryTopic}`);
    console.log(`  cards: ${result.cardCount}`);
  }

  // Test: /?topic= X + ?domain= Y combined
  console.log('\n=== Combined topic + domain test ===');
  await page.goto('http://localhost:8769/?topic=system-def&domain=reliab', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  const combined = await page.evaluate(() => {
    const s = window.__getState ? window.__getState() : null;
    return {
      activePrimaryTopic: s ? s.activePrimaryTopic : '—',
      activeDomain: s ? s.activeDomain : '—',
      cardCount: document.querySelectorAll('.feed-card').length,
      titles: Array.from(document.querySelectorAll('.feed-card .feed-title')).map(t => t.textContent.trim().slice(0, 60)),
    };
  });
  console.log(`  activePrimaryTopic: ${combined.activePrimaryTopic}`);
  console.log(`  activeDomain: ${combined.activeDomain}`);
  console.log(`  cards: ${combined.cardCount}`);
  for (const title of combined.titles) console.log(`    - ${title}`);

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

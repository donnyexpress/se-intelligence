// /workspace/tech-scan-unzipped/tech-scan/scripts/preview-v2.js — render live v2 pages to PNGs
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'docs', 'preview-v2');
fs.mkdirSync(OUT, { recursive: true });

const BASE = process.env.BASE || 'http://localhost:18766';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const shots = [
    { name: 'home-desktop',     path: '/',                                    viewport: { width: 1440, height: 1200 } },
    { name: 'home-mobile',      path: '/',                                    viewport: { width: 390,  height: 1000 } },
    { name: 'topics-desktop',   path: '/topics',                              viewport: { width: 1440, height: 900 } },
    { name: 'sources-desktop',  path: '/sources',                             viewport: { width: 1440, height: 900 } },
    { name: 'topic-system-def', path: '/topic/system-def',                    viewport: { width: 1440, height: 1400 } },
    { name: 'topic-reliab',     path: '/topic/reliab',                        viewport: { width: 1440, height: 1400 } },
    { name: 'topic-distsys',    path: '/topic/dist-sys',                      viewport: { width: 1440, height: 1400 } },
    { name: 'topic-mobile',     path: '/topic/system-def',                    viewport: { width: 390,  height: 1800 } },
    { name: 'source-desktop',   path: '/source/system-def-mbse-patterns-2025', viewport: { width: 1440, height: 1200 } },
    { name: 'source-with-cited-in', path: '/source/reliab-meta-storage-tail-aware', viewport: { width: 1440, height: 1200 } },
    { name: 'search-desktop',   path: '/',                                    viewport: { width: 1440, height: 900 }, searchFirst: 'mbse' },
  ];

  for (const s of shots) {
    const page = await browser.newPage();
    await page.setViewport(s.viewport);
    if (s.searchFirst) {
      // Type into mobile search to populate results
      await page.goto(BASE + s.path, { waitUntil: 'networkidle0' });
      await page.click('#search-toggle').catch(() => {});
      await new Promise(r => setTimeout(r, 200));
      await page.type('#mobile-search-input', s.searchFirst, { delay: 30 });
      await new Promise(r => setTimeout(r, 400));
    } else {
      await page.goto(BASE + s.path, { waitUntil: 'networkidle0' });
    }
    const file = path.join(OUT, s.name + '.png');
    await page.screenshot({ path: file, fullPage: true });
    console.log('  ✓', s.name);
    await page.close();
  }

  await browser.close();
  console.log('\nAll screenshots saved to', OUT);
})().catch(e => { console.error(e); process.exit(1); });

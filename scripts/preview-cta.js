const puppeteer = require('puppeteer');
const path = require('path');
const OUT = path.join(__dirname, '..', 'docs', 'preview');
const BASE = process.env.BASE || 'http://localhost:8766';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const [name, route] of [
    ['entry-cta-desktop',  '/entry/sys-fund-ackoff-systems-thinking'],
    ['entry-cta-conf',     '/entry/conf-is2024-mbse-patterns-practice'],
    ['entry-cta-meta',     '/entry/reliab-meta-storage-tail-aware'],
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE + route, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    const file = path.join(OUT, name + '.png');
    await page.screenshot({ path: file, fullPage: false });
    console.log('  saved', file);
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

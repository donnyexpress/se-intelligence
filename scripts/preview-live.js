const puppeteer = require('puppeteer');
const path = require('path');
const OUT = path.join(__dirname, '..', 'docs', 'preview');
const BASE = 'https://tech-scan.pages.dev';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const [name, route] of [
    ['live-entry-cta-ackoff',  '/entry/sys-fund-ackoff-systems-thinking'],
    ['live-entry-cta-jepsen',  '/entry/dist-sys-jepsen-etcd-3-5'],
    ['live-entry-cta-conf',    '/entry/conf-is2024-mbse-patterns-practice'],
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE + route, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    const file = path.join(OUT, name + '.png');
    await page.screenshot({ path: file, fullPage: false });
    console.log('  saved', file);
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

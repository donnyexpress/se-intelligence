const puppeteer = require('puppeteer');
const path = require('path');
const OUT = path.join(__dirname, '..', 'docs', 'preview');
const BASE = process.env.BASE || 'http://localhost:8768';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const [name, route, vp] of [
    ['home-with-dashboard',  '/',  { width: 1440, height: 1100 }],
    ['home-dashboard-mobile', '/',  { width: 390, height: 1100 }],
  ]) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.goto(BASE + route, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    const file = path.join(OUT, name + '.png');
    await page.screenshot({ path: file, fullPage: false });
    console.log('  saved', file);
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

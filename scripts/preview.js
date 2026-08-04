// /workspace/tech-scan-unzipped/tech-scan/scripts/preview.js — render live pages to PNGs
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'docs', 'preview');
fs.mkdirSync(OUT, { recursive: true });

const BASE = process.env.BASE || 'http://localhost:8765';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const shots = [
    { name: 'home-desktop',        path: '/',                                          viewport: { width: 1440, height: 900 } },
    { name: 'home-mobile',         path: '/',                                          viewport: { width: 390, height: 844 } },
    { name: 'latest-desktop',      path: '/latest',                                    viewport: { width: 1440, height: 900 } },
    { name: 'conferences-desktop', path: '/conferences',                               viewport: { width: 1440, height: 900 } },
    { name: 'about-desktop',       path: '/about',                                     viewport: { width: 1440, height: 900 } },
    { name: 'entry-desktop',       path: '/entry/sys-fund-ackoff-systems-thinking',    viewport: { width: 1440, height: 900 } },
    { name: 'entry-conference',    path: '/entry/conf-is2024-mbse-patterns-practice',  viewport: { width: 1440, height: 900 } },
  ];

  for (const s of shots) {
    const page = await browser.newPage();
    await page.setViewport(s.viewport);
    await page.goto(BASE + s.path, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1800));
    const file = path.join(OUT, s.name + '.png');
    await page.screenshot({ path: file, fullPage: false });
    console.log('  saved', file);
    await page.close();
  }

  // Mobile sidebar open
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));
    await page.click('.menu-btn');
    await new Promise(r => setTimeout(r, 400));
    const file = path.join(OUT, 'home-mobile-sidebar-open.png');
    await page.screenshot({ path: file, fullPage: false });
    console.log('  saved', file);
    await page.close();
  }

  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });

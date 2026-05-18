// Render logs_gap_drill.html to PDF and check page count + flag any overflow warnings.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const fileUrl = 'file:///' + path.resolve('logs_gap_drill.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  // Wait for MathJax
  await page.waitForFunction(() => window.MathJax && window.MathJax.typesetPromise, { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1500);

  const outPath = path.resolve('logs_gap_drill_print.pdf');
  await page.pdf({ path: outPath, format: 'Letter', margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' }, printBackground: true });

  // Count pages: parse PDF /Count
  const buf = fs.readFileSync(outPath);
  const m = buf.toString('latin1').match(/\/Type\s*\/Pages[^>]*\/Count\s+(\d+)/);
  const pages = m ? parseInt(m[1]) : 'unknown';

  // Detect horizontal overflow in print viewport (816px = 8.5in at 96dpi minus margins)
  await page.emulateMedia({ media: 'print' });
  const overflow = await page.evaluate(() => {
    const w = document.documentElement.scrollWidth;
    const cw = document.documentElement.clientWidth;
    return { scrollWidth: w, clientWidth: cw, overflow: w > cw };
  });

  console.log(JSON.stringify({ pages, overflow, pdfBytes: buf.length, pdfPath: outPath }, null, 2));
  await browser.close();
})();

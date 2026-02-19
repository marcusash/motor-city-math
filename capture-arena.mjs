import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

// Capture arena mode on the nonlinear exam
const page = await ctx.newPage();
await page.goto('https://marcusash.github.io/motor-city-math/nonlinear_exam_mvp.html', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(1000);

const toggle = await page.locator('.arena-toggle');
if (await toggle.count() > 0) {
  await toggle.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'design-review-screenshots/nonlinear_exam-arena-mode.png', fullPage: false });
  console.log('Arena mode captured');
} else {
  console.log('No arena toggle found');
}

// Capture the test page too
const testPage = await ctx.newPage();
await testPage.goto('https://marcusash.github.io/motor-city-math/test.html', { waitUntil: 'networkidle', timeout: 15000 });
await testPage.waitForTimeout(1000);
await testPage.screenshot({ path: 'design-review-screenshots/test-viewport.png', fullPage: false });

const testToggle = await testPage.locator('.arena-toggle');
if (await testToggle.count() > 0) {
  await testToggle.click();
  await testPage.waitForTimeout(500);
  await testPage.screenshot({ path: 'design-review-screenshots/test-arena-mode.png', fullPage: false });
  console.log('Test arena mode captured');
}

await browser.close();
console.log('Done');

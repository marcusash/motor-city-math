import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 900, height: 900 });

// Student test
await page.goto('file:///C:/Github/motor-city-math/tests/kai-unit1-practice-test-2.html');
await page.waitForTimeout(1500);
await page.screenshot({ path: 'C:/Github/motor-city-math/tests/ss-student-top.png', fullPage: false });
await page.screenshot({ path: 'C:/Github/motor-city-math/tests/ss-student-full.png', fullPage: true });

// Emulate print
await page.emulateMedia({ media: 'print' });
await page.screenshot({ path: 'C:/Github/motor-city-math/tests/ss-student-print.png', fullPage: true });
await page.emulateMedia({ media: 'screen' });

// Answer key
await page.goto('file:///C:/Github/motor-city-math/tests/kai-unit1-practice-test-2-answers.html');
await page.waitForTimeout(1500);
await page.screenshot({ path: 'C:/Github/motor-city-math/tests/ss-answers-top.png', fullPage: false });
await page.screenshot({ path: 'C:/Github/motor-city-math/tests/ss-answers-full.png', fullPage: true });

await browser.close();
console.log('Screenshots done');

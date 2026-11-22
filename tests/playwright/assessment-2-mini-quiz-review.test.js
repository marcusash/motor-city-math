const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const url = pathToFileURL(path.resolve(__dirname, '../../reviews/assessment-2-mini-quiz-2026-11-10.html')).href;

test('practice review renders exact score, all components and local math without errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(request.url()));
  await page.goto(url);
  await expect(page.locator('#score')).toHaveText('65.5/100 (65.5%)');
  await expect(page.locator('.question-card')).toHaveCount(5);
  await expect(page.locator('.rubric-table tbody tr')).toHaveCount(33);
  await expect(page.locator('.katex').first()).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await expect(page.locator('#questions')).not.toContainText('\\(');
  await expect(page.locator('img,iframe,embed')).toHaveCount(0);
  await expect(page.locator('#gradingNotes')).toContainText('not teacher-awarded marks');
  await expect(page.locator('#sourceLinks')).toContainText('7754a2d676813c2f69bc0277b4a23276d33613b5a17eaeba2c91f92544841dd2');
  expect(await page.locator('th').first().evaluate(element => getComputedStyle(element).color))
    .toBe(await page.locator('body').evaluate(element => getComputedStyle(element).color));
  expect(await page.locator('.rubric-table').first().evaluate(element =>
    element.getBoundingClientRect().width / element.parentElement.getBoundingClientRect().width)).toBeGreaterThan(0.95);
  expect(errors).toEqual([]);
});

test('mobile layout keeps the page contained and scoring tables keyboard-accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url);
  await expect(page.locator('.question-card')).toHaveCount(5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const region of await page.locator('.table-wrap').all()) {
    await expect(region).toHaveAttribute('tabindex', '0');
    await region.focus();
    await expect(region).toBeFocused();
    expect(await region.evaluate(element => getComputedStyle(element).overflowX)).toBe('auto');
  }
  await page.locator('a[href="#question-5"]').click();
  await expect(page.locator('#heading-5')).toBeInViewport();
});

test('printing retains collapsed scoring explanations and restores reading state', async ({ page }) => {
  await page.goto(url);
  await page.locator('#question-1 summary').click();
  await expect(page.locator('#question-1 details')).not.toHaveAttribute('open', '');
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  await expect(page.locator('details[open]')).toHaveCount(5);
  await expect(page.locator('.back-link')).toBeHidden();
  await expect(page.locator('.review-actions')).toBeHidden();
  await expect(page.locator('#question-1 .rubric-table')).toBeVisible();
  await expect(page.locator('.review-header')).toBeVisible();
  await expect(page.locator('#sectionsSummary')).toBeVisible();
  expect(await page.locator('body').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(255, 255, 255)');
  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
  await expect(page.locator('details[open]')).toHaveCount(4);
  await expect(page.locator('#question-1 details')).not.toHaveAttribute('open', '');
});

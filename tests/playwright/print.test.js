// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Print function tests for Motor City Math exam.html
 *
 * These tests verify:
 * 1. Print button is visible on the exam page
 * 2. Clicking Print opens a new window/popup
 * 3. The print window contains the exam title
 * 4. The print window has KaTeX CSS inlined (no external link tag for katex)
 * 5. The print window contains question cards
 * 6. The print window has no dark-theme colors (background is white)
 */

const EXAM_URL = '/exam.html?exam=finals-diagnostic-2';

test.describe('Print function', () => {
    test('Print button is visible after exam loads', async ({ page }) => {
        await page.goto(EXAM_URL);
        // Wait for exam to load
        await page.waitForSelector('.question-card', { timeout: 10000 });
        const btn = page.locator('#printBtn, button[onclick*="printExam"], .print-btn');
        await expect(btn.first()).toBeVisible({ timeout: 5000 });
    });

    test('Print opens a new window with exam content', async ({ page, context }) => {
        await page.goto(EXAM_URL);
        await page.waitForSelector('.question-card', { timeout: 10000 });

        // Intercept the new window opened by printExam()
        const [popup] = await Promise.all([
            context.waitForEvent('page'),
            page.locator('#printBtn, button[onclick*="printExam"], .print-btn').first().click(),
        ]);

        await popup.waitForLoadState('domcontentloaded');

        // Should have exam title
        const title = await popup.title();
        expect(title.length).toBeGreaterThan(0);
    });

    test('Print window has question cards', async ({ page, context }) => {
        await page.goto(EXAM_URL);
        await page.waitForSelector('.question-card', { timeout: 10000 });

        const [popup] = await Promise.all([
            context.waitForEvent('page'),
            page.locator('#printBtn, button[onclick*="printExam"], .print-btn').first().click(),
        ]);

        await popup.waitForLoadState('domcontentloaded');
        // Give DOM time to settle (printExam uses 400ms timeout before print)
        await popup.waitForTimeout(600);

        const cards = popup.locator('.question-card');
        const count = await cards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('Print window has no external KaTeX link tag (CSS is inlined)', async ({ page, context }) => {
        await page.goto(EXAM_URL);
        await page.waitForSelector('.question-card', { timeout: 10000 });

        const [popup] = await Promise.all([
            context.waitForEvent('page'),
            page.locator('#printBtn, button[onclick*="printExam"], .print-btn').first().click(),
        ]);

        await popup.waitForLoadState('domcontentloaded');

        // After the inline-CSS fix, there should be NO <link> tag for katex
        const katexLink = popup.locator('link[href*="katex"]');
        await expect(katexLink).toHaveCount(0);
    });

    test('Print window body background is white', async ({ page, context }) => {
        await page.goto(EXAM_URL);
        await page.waitForSelector('.question-card', { timeout: 10000 });

        const [popup] = await Promise.all([
            context.waitForEvent('page'),
            page.locator('#printBtn, button[onclick*="printExam"], .print-btn').first().click(),
        ]);

        await popup.waitForLoadState('domcontentloaded');
        await popup.waitForTimeout(600);

        const bg = await popup.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });
        // Should be white (rgb(255, 255, 255)) — no dark theme
        expect(bg).toBe('rgb(255, 255, 255)');
    });

    test('Print window has no progress bar or timer UI', async ({ page, context }) => {
        await page.goto(EXAM_URL);
        await page.waitForSelector('.question-card', { timeout: 10000 });

        const [popup] = await Promise.all([
            context.waitForEvent('page'),
            page.locator('#printBtn, button[onclick*="printExam"], .print-btn').first().click(),
        ]);

        await popup.waitForLoadState('domcontentloaded');
        await popup.waitForTimeout(600);

        // Progress bar and timer must not be visible
        const progressBar = popup.locator('.progress-bar, .progress-strip');
        const timer = popup.locator('.timer');

        for (const el of [progressBar, timer]) {
            const count = await el.count();
            if (count > 0) {
                const visible = await el.first().isVisible();
                expect(visible).toBe(false);
            }
        }
    });

    test('Print window KaTeX fractions render with correct structure', async ({ page, context }) => {
        await page.goto(EXAM_URL);
        await page.waitForSelector('.question-card', { timeout: 10000 });

        const [popup] = await Promise.all([
            context.waitForEvent('page'),
            page.locator('#printBtn, button[onclick*="printExam"], .print-btn').first().click(),
        ]);

        await popup.waitForLoadState('domcontentloaded');
        await popup.waitForTimeout(600);

        // KaTeX fractions use vlist-t2 structure — if CSS is loaded they should exist
        const fractions = popup.locator('.katex .vlist-t2, .katex-html .frac-line');
        const count = await fractions.count();
        // D2 has fractions in multiple questions — should be present
        expect(count).toBeGreaterThan(0);
    });
});

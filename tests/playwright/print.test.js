// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * MCM Print Regression Suite — FF (Quality Lead)
 *
 * Coverage:
 * - All 3 diagnostic exams (D1, D2, D3) + school final via parameterized tests
 * - FA's 6 print formatting changes (blank lines, radicals, label colon, button pos, work area, em dash)
 * - Structure: question count, sequential numbering, no form inputs, blank rows, work areas
 * - CSS: white background, no external KaTeX link, KaTeX renders, name/date/period header
 * - Layout: no progress bar/timer, no em dash in title
 * - D2-specific + school-final-specific: multi-input question blank-row counts
 */

const EXAMS = [
    {
        file: 'finals-diagnostic-1',
        data: require('../../data/finals-diagnostic-1.json'),
    },
    {
        file: 'finals-diagnostic-2',
        data: require('../../data/finals-diagnostic-2.json'),
    },
    {
        file: 'finals-diagnostic-3',
        data: require('../../data/finals-diagnostic-3.json'),
    },
    {
        file: 'finals-school-final',
        data: require('../../data/finals-school-final.json'),
    },
];

const BTN_SEL = '#printBtn, button[onclick*="printExam"], .print-btn';

async function openPrintPopup(page, context, examFile) {
    await page.goto(`exam.html?file=${examFile}`);
    await page.waitForSelector('.question-card', { timeout: 30000 });
    const [popup] = await Promise.all([
        context.waitForEvent('page'),
        page.locator(BTN_SEL).first().click(),
    ]);
    await popup.waitForLoadState('domcontentloaded');
    await popup.waitForTimeout(800);
    return popup;
}

// ─── Parameterized tests: all 3 exams ────────────────────────────────────────

for (const exam of EXAMS) {
    test.describe(`Print regression: ${exam.file}`, () => {

        // Button
        test('Print button is visible after exam loads', async ({ page }) => {
            await page.goto(`exam.html?file=${exam.file}`);
            await page.waitForSelector('.question-card', { timeout: 30000 });
            await expect(page.locator(BTN_SEL).first()).toBeVisible({ timeout: 5000 });
        });

        // FA fix: print button in .header-actions, positioned away from edge (no overlap with arena-toggle)
        test('Print button container is absolutely positioned in header (no overlap)', async ({ page }) => {
            await page.goto(`exam.html?file=${exam.file}`);
            await page.waitForSelector('.question-card', { timeout: 30000 });
            const actions = page.locator('.header-actions');
            const position = await actions.evaluate(el => window.getComputedStyle(el).position);
            expect(position).toBe('absolute');
            const right = await actions.evaluate(el => window.getComputedStyle(el).right);
            expect(right).not.toBe('auto');
        });

        // Popup opens
        test('Print opens new window with non-empty title', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            const title = await popup.title();
            expect(title.length).toBeGreaterThan(0);
        });

        // FA fix: em dash removed from titles
        test('Print title has no em dash or en dash', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            const title = await popup.title();
            expect(title).not.toContain('\u2014');
            expect(title).not.toContain('\u2013');
        });

        // Question count matches data exactly
        test('Question count in print matches data file', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            const count = await popup.locator('.qcard').count();
            expect(count).toBe(exam.data.questions.length);
        });

        // Question numbers are sequential 1..N
        test('Question numbers are sequential 1 to N', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            const nums = popup.locator('.qnum');
            const count = await nums.count();
            expect(count).toBe(exam.data.questions.length);
            for (let i = 0; i < count; i++) {
                const text = await nums.nth(i).innerText();
                expect(text).toContain(String(i + 1));
            }
        });

        // FA fix: MC options replaced with blank answer lines — no form inputs in print
        test('Print window has no form inputs (MC replaced with blank lines)', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            await expect(popup.locator('input, select')).toHaveCount(0);
        });

        // Blank answer rows exist
        test('Print window has blank answer rows (.blank-row)', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            const count = await popup.locator('.blank-row').count();
            expect(count).toBeGreaterThan(0);
        });

        // FA fix: answer label colon removed
        test('Answer labels do not end with a colon', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            const labels = popup.locator('.blank-lbl');
            const count = await labels.count();
            for (let i = 0; i < count; i++) {
                const text = (await labels.nth(i).innerText()).trim();
                expect(text).not.toMatch(/:$/);
            }
        });

        // FA fix: work area present on every question at 140px
        test('Every question has a work area with min-height 140px', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            const workAreas = popup.locator('.work-area');
            const count = await workAreas.count();
            expect(count).toBe(exam.data.questions.length);
            const minH = await workAreas.first().evaluate(
                el => window.getComputedStyle(el).minHeight
            );
            expect(minH).toBe('140px');
        });

        // White background
        test('Print window body background is white', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            const bg = await popup.evaluate(
                () => window.getComputedStyle(document.body).backgroundColor
            );
            expect(bg).toBe('rgb(255, 255, 255)');
        });

        // KaTeX inlined — no external link tag
        test('Print window has no external KaTeX link tag (CSS is inlined)', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            await expect(popup.locator('link[href*="katex"]')).toHaveCount(0);
        });

        // KaTeX renders — fractions and/or radicals
        test('Print window KaTeX math renders correctly', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            const math = popup.locator('.katex-html');
            const count = await math.count();
            expect(count).toBeGreaterThan(0);
        });

        // FA fix: radicals use display:inline-block (no overrun)
        test('Print window KaTeX radicals have inline-block display', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            const katexEls = popup.locator('.katex');
            const count = await katexEls.count();
            if (count > 0) {
                const display = await katexEls.first().evaluate(
                    el => window.getComputedStyle(el).display
                );
                expect(display).toBe('inline-block');
            }
        });

        // Header: Name / Date / Period
        test('Print window has Name/Date/Period header', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            await expect(popup.locator('.name-row')).toHaveCount(1);
            const text = await popup.locator('.name-row').innerText();
            expect(text).toContain('Name');
        });

        // No exam UI elements in print
        test('Print window has no progress bar or timer', async ({ page, context }) => {
            const popup = await openPrintPopup(page, context, exam.file);
            for (const sel of ['.progress-bar', '.progress-strip', '.timer']) {
                const el = popup.locator(sel);
                const cnt = await el.count();
                if (cnt > 0) {
                    expect(await el.first().isVisible()).toBe(false);
                }
            }
        });

    });
}

// ─── D2-specific: multi-input question blank-row counts ──────────────────────

test.describe('Print regression: finals-diagnostic-2 multi-input questions', () => {

    const MULTI = [
        { number: 3,  expectedBlanks: 3 },  // Parent function, Vertex x=, Vertex y=
        { number: 4,  expectedBlanks: 3 },  // Parent function, Domain, Range
        { number: 10, expectedBlanks: 5 },  // Opens, Vertex x=, Vertex y=, x-int 1, x-int 2
        { number: 11, expectedBlanks: 3 },  // a=, h=, k=
    ];

    for (const q of MULTI) {
        test(`Q${q.number} has exactly ${q.expectedBlanks} blank-rows`, async ({ page, context }) => {
            await page.goto('exam.html?file=finals-diagnostic-2');
            await page.waitForSelector('.question-card', { timeout: 30000 });
            const [popup] = await Promise.all([
                context.waitForEvent('page'),
                page.locator(BTN_SEL).first().click(),
            ]);
            await popup.waitForLoadState('domcontentloaded');
            await popup.waitForTimeout(800);
            const card = popup.locator(`.qcard:has(.qnum:text-is("Question ${q.number}"))`);
            await expect(card.locator('.blank-row')).toHaveCount(q.expectedBlanks);
        });
    }
});

// ─── School final: multi-input question blank-row counts ─────────────────────

test.describe('Print regression: finals-school-final multi-input questions', () => {

    const SF_MULTI = [
        { number: 1,  expectedBlanks: 3 },  // Coefficient=, Exponent on x=, Exponent on y=
        { number: 3,  expectedBlanks: 4 },  // Parent function, transformations
        { number: 4,  expectedBlanks: 3 },  // Parent function, Domain, Range
        { number: 10, expectedBlanks: 5 },  // Opens, Vertex x=, Vertex y=, x-int 1, x-int 2
        { number: 11, expectedBlanks: 3 },  // a=, h=, k=
        { number: 12, expectedBlanks: 2 },
        { number: 13, expectedBlanks: 2 },
        { number: 14, expectedBlanks: 2 },
        { number: 15, expectedBlanks: 4 },
    ];

    for (const q of SF_MULTI) {
        test(`Q${q.number} has exactly ${q.expectedBlanks} blank-rows`, async ({ page, context }) => {
            await page.goto('exam.html?file=finals-school-final');
            await page.waitForSelector('.question-card', { timeout: 30000 });
            const [popup] = await Promise.all([
                context.waitForEvent('page'),
                page.locator(BTN_SEL).first().click(),
            ]);
            await popup.waitForLoadState('domcontentloaded');
            await popup.waitForTimeout(800);
            const card = popup.locator(`.qcard:has(.qnum:text-is("Question ${q.number}"))`);
            await expect(card.locator('.blank-row')).toHaveCount(q.expectedBlanks);
        });
    }
});

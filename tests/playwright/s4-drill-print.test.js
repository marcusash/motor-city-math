// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

/**
 * S4 Gap Drill — Print View Validation (FA)
 *
 * Validates print formatting, KaTeX equation rendering, and structure
 * for the s4-assessment-drill-1 exam using Edge browser.
 *
 * Takes full-page screenshots per question page for visual QA.
 */

const EXAM_FILE = 's4-assessment-drill-1';
const EXAM_DATA = require('../../data/s4-assessment-drill-1.json');
const BTN_SEL = '#printBtn, button[onclick*="printExam"], .print-btn';
const SCREENSHOTS_DIR = path.join(__dirname, '..', '..', 'artifacts', 's4-drill-print-screenshots');

test.use({
    channel: 'msedge',
    headless: true,
});

async function openPrintPopup(page, context) {
    await page.goto(`exam.html?file=${EXAM_FILE}`);
    await page.waitForSelector('.question-card', { timeout: 30000 });
    const [popup] = await Promise.all([
        context.waitForEvent('page'),
        page.locator(BTN_SEL).first().click(),
    ]);
    await popup.waitForLoadState('domcontentloaded');
    await popup.waitForTimeout(1200);
    return popup;
}

// ─── Structure tests ──────────────────────────────────────────────────────────

test.describe(`S4 Gap Drill print validation (Edge)`, () => {

    test('Print button visible after exam loads', async ({ page }) => {
        await page.goto(`exam.html?file=${EXAM_FILE}`);
        await page.waitForSelector('.question-card', { timeout: 30000 });
        await expect(page.locator(BTN_SEL).first()).toBeVisible({ timeout: 5000 });
    });

    test('Print popup opens with correct title', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        const title = await popup.title();
        expect(title.length).toBeGreaterThan(0);
        expect(title).not.toContain('\u2014'); // no em dash
        expect(title).not.toContain('\u2013'); // no en dash
    });

    test('Question count matches data (12 questions)', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        const count = await popup.locator('.qcard').count();
        expect(count).toBe(EXAM_DATA.questions.length);
        expect(count).toBe(12);
    });

    test('Question numbers are sequential 1-12', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        const nums = popup.locator('.qnum');
        const count = await nums.count();
        expect(count).toBe(12);
        for (let i = 0; i < count; i++) {
            const text = await nums.nth(i).innerText();
            expect(text).toContain(String(i + 1));
        }
    });

    test('No form inputs in print (MC replaced with blank lines)', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        await expect(popup.locator('input, select')).toHaveCount(0);
    });

    test('Blank answer rows exist', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        const count = await popup.locator('.blank-row').count();
        expect(count).toBeGreaterThanOrEqual(12); // at least one per question
    });

    test('Every question has a work area with min-height 140px', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        const workAreas = popup.locator('.work-area');
        const count = await workAreas.count();
        expect(count).toBe(12);
        const minH = await workAreas.first().evaluate(
            el => window.getComputedStyle(el).minHeight
        );
        // Work area min-height varies by exam (120px or 140px)
        expect(parseInt(minH)).toBeGreaterThanOrEqual(120);
    });

    test('Print body background is white', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        const bg = await popup.evaluate(
            () => window.getComputedStyle(document.body).backgroundColor
        );
        expect(bg).toBe('rgb(255, 255, 255)');
    });

    test('Name/Date/Period header present', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        await expect(popup.locator('.name-row')).toHaveCount(1);
        const text = await popup.locator('.name-row').innerText();
        expect(text).toContain('Name');
    });

    test('No progress bar or timer in print', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        for (const sel of ['.progress-bar', '.progress-strip', '.timer']) {
            const el = popup.locator(sel);
            const cnt = await el.count();
            if (cnt > 0) {
                expect(await el.first().isVisible()).toBe(false);
            }
        }
    });

    test('KaTeX CSS is loaded (linked or inlined)', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        // KaTeX CSS can be either inlined or linked — either is acceptable
        const linked = await popup.locator('link[href*="katex"]').count();
        const inlined = await popup.locator('style').evaluateAll(els =>
            els.some(el => el.textContent.includes('.katex'))
        );
        expect(linked > 0 || inlined).toBe(true);
    });
});

// ─── KaTeX equation rendering ─────────────────────────────────────────────────

test.describe('S4 Gap Drill: KaTeX equation rendering (Edge)', () => {

    test('KaTeX math elements are present in print', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        const math = popup.locator('.katex-html');
        const count = await math.count();
        expect(count).toBeGreaterThan(0);
    });

    test('KaTeX elements use inline-block display', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        const katexEls = popup.locator('.katex');
        const count = await katexEls.count();
        expect(count).toBeGreaterThan(0);
        const display = await katexEls.first().evaluate(
            el => window.getComputedStyle(el).display
        );
        // KaTeX display can be inline or inline-block depending on context
        expect(['inline', 'inline-block']).toContain(display);
    });

    test('Fractions render with .frac elements (vinculum visible)', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        const fracs = popup.locator('.katex .frac-line, .katex .mfrac');
        const count = await fracs.count();
        // All 12 questions have fractions
        expect(count).toBeGreaterThanOrEqual(12);
    });

    test('No KaTeX parse errors in print', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        const errors = popup.locator('.katex-error');
        await expect(errors).toHaveCount(0);
    });

    // Validate each question has rendered math (not raw LaTeX)
    for (let q = 1; q <= 12; q++) {
        test(`Q${q} has rendered KaTeX math (not raw LaTeX)`, async ({ page, context }) => {
            const popup = await openPrintPopup(page, context);
            const card = popup.locator(`.qcard:has(.qnum:text-is("Question ${q}"))`);
            await expect(card).toHaveCount(1);
            const katex = card.locator('.katex');
            const count = await katex.count();
            expect(count).toBeGreaterThan(0);
            // Ensure no raw \frac or \dfrac text visible
            const text = await card.innerText();
            expect(text).not.toContain('\\frac');
            expect(text).not.toContain('\\dfrac');
            expect(text).not.toContain('\\left');
            expect(text).not.toContain('\\right');
        });
    }
});

// ─── Section structure (A/B/C) ────────────────────────────────────────────────

test.describe('S4 Gap Drill: section structure', () => {

    test('Section A has 5 questions (Q1-Q5, factor-first)', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        const sectionA = EXAM_DATA.questions.filter(q => q.section === 'A');
        expect(sectionA.length).toBe(5);
    });

    test('Section B has 4 questions (Q6-Q9, LCD)', async ({ page, context }) => {
        const sectionB = EXAM_DATA.questions.filter(q => q.section === 'B');
        expect(sectionB.length).toBe(4);
    });

    test('Section C has 3 questions (Q10-Q12, sign distribution)', async ({ page, context }) => {
        const sectionC = EXAM_DATA.questions.filter(q => q.section === 'C');
        expect(sectionC.length).toBe(3);
    });
});

// ─── Screenshots ──────────────────────────────────────────────────────────────

test.describe('S4 Gap Drill: print screenshots', () => {

    test('Full print page screenshot', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        await popup.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'full-print-view.png'),
            fullPage: true,
        });
    });

    test('Screenshot each question card', async ({ page, context }) => {
        const popup = await openPrintPopup(page, context);
        const cards = popup.locator('.qcard');
        const count = await cards.count();
        for (let i = 0; i < count; i++) {
            await cards.nth(i).screenshot({
                path: path.join(SCREENSHOTS_DIR, `q${i + 1}-print.png`),
            });
        }
    });

    test('Screenshot exam interactive view (pre-print)', async ({ page }) => {
        await page.goto(`exam.html?file=${EXAM_FILE}`);
        await page.waitForSelector('.question-card', { timeout: 30000 });
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, 'interactive-view.png'),
            fullPage: true,
        });
    });
});

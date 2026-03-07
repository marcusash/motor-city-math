// @ts-check
/**
 * site-health.test.js
 *
 * Playwright smoke tests for all three public GitHub Pages sites:
 *   - https://marcusash.github.io/              (Matrix — Forge/FD canvases)
 *   - https://marcusash.github.io/motor-city-math/      (MCM — Kai algebra)
 *   - https://marcusash.github.io/motor-city-chemistry/ (MCC — Kai chemistry)
 *
 * Checks per page:
 *   - Page loads (HTTP 200, no network failure)
 *   - No uncaught JavaScript errors
 *   - No 404 console errors for critical assets
 *   - Page has a non-empty <title>
 *   - Page has visible content (non-empty body)
 *
 * Run: npx playwright test tests/playwright/site-health.test.js
 *      npx playwright test tests/playwright/site-health.test.js --reporter=line
 */

'use strict';

const { test, expect } = require('@playwright/test');

// ── Key pages to smoke test from each site ────────────────────────────────────
// We do not test all 75 matrix pages in Playwright (too slow). We pick the most
// important ones — the public-facing canvases Marcus and FD have shipped.

const MATRIX_BASE   = 'https://marcusash.github.io';
const MCM_BASE      = 'https://marcusash.github.io/motor-city-math';
const MCC_BASE      = 'https://marcusash.github.io/motor-city-chemistry';
const RED_PILL_BASE = 'https://marcusash.github.io/gh-copilot-setup';
const BLUE_PILL_BASE= 'https://marcusash.github.io/ai-maker';

const MATRIX_KEY_PAGES = [
  { path: '/index.html',                  label: 'Portfolio home' },
  { path: '/dispatch.html',               label: 'Dispatch canvas (FA)' },
  { path: '/fd-dispatch-screens.html',    label: 'Dispatch spec (FD)' },
  { path: '/forge-brand-showcase.html',   label: 'Forge brand showcase (FD)' },
  { path: '/forge-deck-v5.html',          label: 'Forge deck v5 (FD)' },
  { path: '/fd-portfolio.html',           label: 'FD portfolio' },
  { path: '/fd-inkwell-screens.html',     label: 'Inkwell screens (FD)' },
  { path: '/inkwell-tui-prototype.html',  label: 'Inkwell TUI prototype' },
  { path: '/fd-sprint-scorecard-v3.html', label: 'Sprint scorecard (FD)' },
  { path: '/forge-org-story.html',        label: 'Forge org story' },
  { path: '/agent-dashboard.html',        label: 'Agent dashboard' },
];

const MCM_KEY_PAGES = [
  { path: '/index.html',              label: 'MCM dashboard' },
  { path: '/exam.html',               label: 'MCM exam renderer' },
  { path: '/dad.html',                label: 'MCM dad view' },
  { path: '/guest.html',              label: 'MCM guest view' },
  { path: '/scorecard.html',          label: 'MCM scorecard' },
];

const MCC_KEY_PAGES = [
  { path: '/index.html',                              label: 'MCC home' },
  { path: '/artifacts/chem-42-practice-test.html',   label: 'MCC Practice Test 1' },
  { path: '/artifacts/chem-42-practice-test-2.html', label: 'MCC Practice Test 2' },
  { path: '/artifacts/chem-42-answer-key.html',      label: 'MCC Answer Key 1' },
  { path: '/artifacts/kai-chem-grade-report.html',   label: 'MCC Grade Report' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Open a page and collect JS errors + failed requests for critical assets.
 * Returns { jsErrors, failedAssets }.
 */
async function openAndCollect(page, url) {
  const jsErrors = [];
  const failedAssets = [];

  page.on('pageerror', err => jsErrors.push(err.message));

  page.on('requestfailed', req => {
    const u = req.url();
    // Only flag same-origin assets (not external CDNs that might block headless UA)
    if (u.includes('marcusash.github.io')) {
      failedAssets.push({ url: u, reason: req.failure()?.errorText });
    }
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  // Brief settle time for synchronous JS errors
  await page.waitForTimeout(800);

  return { jsErrors, failedAssets };
}

// ── Test generator ────────────────────────────────────────────────────────────

function registerPageTests(suiteName, baseUrl, pages) {
  test.describe(suiteName, () => {

    for (const { path, label } of pages) {
      const url = baseUrl + path;

      test(`[${label}] loads without JS errors`, async ({ page }) => {
        const { jsErrors } = await openAndCollect(page, url);
        expect(
          jsErrors,
          `JS errors on ${url}:\n  ${jsErrors.join('\n  ')}`
        ).toHaveLength(0);
      });

      test(`[${label}] has non-empty title`, async ({ page }) => {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const title = await page.title();
        expect(title.trim().length, `Empty title on ${url}`).toBeGreaterThan(0);
      });

      test(`[${label}] has visible body content`, async ({ page }) => {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const bodyText = await page.locator('body').innerText();
        expect(bodyText.trim().length, `No visible body text on ${url}`).toBeGreaterThan(50);
      });

      test(`[${label}] no broken same-origin assets`, async ({ page }) => {
        const { failedAssets } = await openAndCollect(page, url);
        expect(
          failedAssets,
          `Broken assets on ${url}:\n  ${failedAssets.map(a => a.url).join('\n  ')}`
        ).toHaveLength(0);
      });
    }

  });
}

const RED_PILL_KEY_PAGES = [
  { path: '/index.html',             label: 'Red Pill home' },
  { path: '/matrix-setup-guide.html',label: 'Matrix setup guide' },
  { path: '/docs/user-guide.html',   label: 'Red Pill user guide' },
];

const BLUE_PILL_KEY_PAGES = [
  { path: '/index.html',               label: 'Blue Pill home' },
  { path: '/matrix-install-guide.html',label: 'AI Maker install guide' },
  { path: '/docs/user-guide.html',     label: 'Blue Pill user guide' },
];

// ── Test suites ───────────────────────────────────────────────────────────────

registerPageTests('Matrix (marcusash.github.io) — key pages', MATRIX_BASE, MATRIX_KEY_PAGES);
registerPageTests('Red Pill (gh-copilot-setup) — key pages',  RED_PILL_BASE, RED_PILL_KEY_PAGES);
registerPageTests('Blue Pill (ai-maker) — key pages',         BLUE_PILL_BASE, BLUE_PILL_KEY_PAGES);
registerPageTests('Motor City Math — key pages',               MCM_BASE,    MCM_KEY_PAGES);
registerPageTests('Motor City Chemistry — key pages',          MCC_BASE,    MCC_KEY_PAGES);

// ── MCM: exam loads data and renders questions ────────────────────────────────

test.describe('MCM: exam.html loads data files', () => {
  const DATA_FILES = [
    'retake-practice-1', 'retake-practice-2', 'retake-practice-3',
    'retake-practice-4', 'retake-practice-5', 'retake-practice-13',
    'finals-diagnostic-1',
  ];

  for (const file of DATA_FILES) {
    test(`exam.html?file=${file} renders questions`, async ({ page }) => {
      const url = `${MCM_BASE}/exam.html?file=${file}`;
      const jsErrors = [];
      page.on('pageerror', e => jsErrors.push(e.message));

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForSelector('.question-card', { timeout: 20000 });

      const count = await page.locator('.question-card').count();
      expect(count, `No questions rendered for ${file}`).toBeGreaterThan(0);
      expect(jsErrors, `JS errors loading ${file}: ${jsErrors.join('; ')}`).toHaveLength(0);
    });
  }
});

// ── MCC: nav links on index all resolve ──────────────────────────────────────

test.describe('MCC: index.html navigation links resolve', () => {
  test('all .card links return HTTP 200', async ({ page, request }) => {
    await page.goto(`${MCC_BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    const hrefs = await page.locator('a.card').evaluateAll(
      els => els.map(el => el.getAttribute('href')).filter(Boolean)
    );

    expect(hrefs.length, 'No card links found on MCC index').toBeGreaterThan(0);

    for (const href of hrefs) {
      const url = new URL(href, MCC_BASE + '/index.html').href;
      const resp = await request.get(url);
      expect(resp.status(), `Dead link ${url} on MCC index`).toBe(200);
    }
  });
});

// ── Matrix: index.html nav links resolve ─────────────────────────────────────

test.describe('Matrix: index.html project links', () => {
  test('View project links resolve', async ({ page, request }) => {
    await page.goto(`${MATRIX_BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    const hrefs = await page.locator('a').evaluateAll(
      els => els
        .map(el => el.getAttribute('href'))
        .filter(h => h && (h.includes('marcusash.github.io') || (h.startsWith('/') && !h.startsWith('//'))))
    );

    for (const href of hrefs) {
      const url = href.startsWith('http') ? href : new URL(href, MATRIX_BASE).href;
      // Only check same-origin links
      if (!url.includes('marcusash.github.io')) continue;
      const resp = await request.get(url);
      expect(resp.status(), `Dead link: ${url}`).toBeLessThan(400);
    }
  });
});

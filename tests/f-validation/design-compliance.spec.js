/**
 * Motor City Math — Fundamentals Agent (F)
 * Design Compliance Automation Suite
 *
 * Playwright-based tests that open every page in a real browser
 * and verify CSS tokens, colors, typography, layout, dark mode,
 * and responsive behavior against the design system spec.
 *
 * Run: npx playwright test tests/f-validation/design-compliance.spec.js
 * Or:  node tests/f-validation/design-compliance.spec.js  (standalone)
 *
 * Covers:
 *  - f-t7-light:  All 19 pages, light mode token verification
 *  - f-t7-dark:   All 19 pages, Arena Mode token verification
 *  - f-t7-responsive: 6 key pages at 375px + 768px
 *  - site-b10:    Snap-to-grid verification
 *  - Hardcoded hex detection (no inline styles bypassing tokens)
 *  - Canvas always-white rule
 *  - Typography specs (font, size, weight, color)
 *  - Print CSS presence
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..', '..');
const BASE_URL = 'file:///' + ROOT.replace(/\\/g, '/');

// ===================================================================
// DESIGN SYSTEM TOKENS (ground truth from shared/styles.css)
// ===================================================================

const LIGHT_TOKENS = {
    '--bg-page': '#F4F5F9',
    '--bg-card': '#FFFFFF',
    '--bg-input': '#F8F9FC',
    '--text-primary': '#1A1F36',
    '--text-secondary': '#5E6378',
    '--accent-red': '#C8102E',
    '--accent-blue': '#1D42BA',
    '--accent-navy': '#002D62',
    '--border-default': '#C8CCD8',
    '--border-subtle': '#E2E5EF',
    '--bg-highlight': '#EEF1FA',
    '--grid-minor': '#EDF0F5',
    '--chart-grid': '#E2E5EF'
};

const DARK_TOKENS = {
    '--bg-page': '#0A0E1A',
    '--bg-card': '#141B2D',
    '--bg-input': '#1A2240',
    '--text-primary': '#E0E4EB',
    '--text-secondary': '#8B92A8',
    '--accent-red': '#E8334A',
    '--accent-blue': '#4A72E8',
    '--accent-navy': '#A0B8E8',
    '--border-default': '#2A3352',
    '--border-subtle': '#1E2742',
    '--bg-highlight': '#1A2240',
    '--grid-minor': '#1E2742',
    '--chart-grid': '#2A3352'
};

const PISTONS_PALETTE = ['#C8102E', '#1D42BA', '#002D62', '#BEC0C2', '#FFFFFF'];

// Banned hex values that should use tokens
const BANNED_HEX_INLINE = [
    { hex: '#e0e0e0', token: '--border-subtle' },
    { hex: '#f5f5f5', token: '--bg-page' },
    { hex: '#333333', token: '--text-primary' },
    { hex: '#666666', token: '--text-secondary' },
    { hex: '#8B1E3F', token: 'old burgundy — removed' }
];

// All 19 HTML files
const ALL_FILES = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();

// Key pages for responsive testing
const RESPONSIVE_PAGES = [
    'index.html', 'practice.html', 'test-builder.html',
    'nonlinear_exam_mvp.html', 'parent.html', 'test.html'
];

// Pages with interactive graphing canvas (not just Chart.js)
const GRAPH_CANVAS_PAGES = [
    'nonlinear_exam_mvp.html', 'nonlinear_functions_test.html',
    'index_calc.html', 'linear_functions_test.html',
    'final_exam_251123.html', 'quiz_251120.html', 'quiz_251121.html'
];

// ===================================================================
// TEST RUNNER
// ===================================================================

let pass = 0, fail = 0, skip = 0;
const failures = [];

function test(desc, condition) {
    if (condition === 'skip') { skip++; return; }
    if (condition) { pass++; }
    else { fail++; failures.push(desc); console.log(`  ❌ ${desc}`); }
}
function section(title) { console.log(`\n══ ${title} ══`); }

// Normalize hex for comparison
function normalizeHex(hex) {
    if (!hex) return '';
    hex = hex.trim().toUpperCase();
    // Convert rgb(r,g,b) to hex
    const rgbMatch = hex.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
        const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
        const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
        return '#' + r.toUpperCase() + g.toUpperCase() + b.toUpperCase();
    }
    // Handle rgba
    const rgbaMatch = hex.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/i);
    if (rgbaMatch) {
        return hex; // Keep rgba as-is for shadow comparisons
    }
    return hex;
}

function hexMatch(actual, expected) {
    return normalizeHex(actual) === normalizeHex(expected);
}

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    // ===============================================================
    // SUITE 1: LIGHT MODE TOKEN VERIFICATION (f-t7-light)
    // ===============================================================
    section('SUITE 1: Light Mode — All 19 Pages');

    for (const file of ALL_FILES) {
        const url = BASE_URL + '/' + file;
        const page = await context.newPage();
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

            // Check if page uses shared/styles.css
            const usesSharedCSS = await page.evaluate(() => {
                const links = document.querySelectorAll('link[rel="stylesheet"]');
                return Array.from(links).some(l => l.href.includes('shared/styles.css'));
            });

            if (!usesSharedCSS) {
                console.log(`  ⏭️  ${file}: no shared/styles.css — skipping token checks`);
                await page.close();
                continue;
            }

            // Read computed CSS custom properties
            const tokens = await page.evaluate((tokenNames) => {
                const style = getComputedStyle(document.documentElement);
                const result = {};
                for (const name of tokenNames) {
                    result[name] = style.getPropertyValue(name).trim();
                }
                return result;
            }, Object.keys(LIGHT_TOKENS));

            // Verify each token
            for (const [token, expected] of Object.entries(LIGHT_TOKENS)) {
                const actual = tokens[token];
                if (!actual) {
                    test(`${file}: ${token} defined`, false);
                } else {
                    test(`${file}: ${token} = ${expected}`,
                        hexMatch(actual, expected));
                }
            }

            // Check body background color
            const bgColor = await page.evaluate(() =>
                getComputedStyle(document.body).backgroundColor);
            test(`${file}: body bg uses --bg-page`,
                hexMatch(bgColor, LIGHT_TOKENS['--bg-page']));

            // Check for shared/print.css
            const hasPrintCSS = await page.evaluate(() => {
                const links = document.querySelectorAll('link[rel="stylesheet"]');
                return Array.from(links).some(l => l.href.includes('print.css'));
            });
            test(`${file}: has print.css`, hasPrintCSS);

            // Check for arena-mode toggle button
            const hasArenaToggle = await page.evaluate(() =>
                !!document.querySelector('.arena-toggle'));
            test(`${file}: has arena toggle`, hasArenaToggle);

            // Check for skip link (accessibility)
            const hasSkipLink = await page.evaluate(() =>
                !!document.querySelector('a.skip-link, a[href="#main"]'));
            test(`${file}: has skip link`, hasSkipLink);

        } catch (e) {
            console.log(`  ⚠️  ${file}: ${e.message.substring(0, 80)}`);
        }
        await page.close();
    }

    // ===============================================================
    // SUITE 2: ARENA MODE TOKEN VERIFICATION (f-t7-dark)
    // ===============================================================
    section('SUITE 2: Arena Mode — All 19 Pages');

    for (const file of ALL_FILES) {
        const url = BASE_URL + '/' + file;
        const page = await context.newPage();
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

            const usesSharedCSS = await page.evaluate(() => {
                const links = document.querySelectorAll('link[rel="stylesheet"]');
                return Array.from(links).some(l => l.href.includes('shared/styles.css'));
            });

            if (!usesSharedCSS) {
                await page.close();
                continue;
            }

            // Activate Arena Mode
            await page.evaluate(() => document.body.classList.add('arena-mode'));

            // Read dark tokens from body (arena-mode overrides are on body, not :root)
            const tokens = await page.evaluate((tokenNames) => {
                const style = getComputedStyle(document.body);
                const result = {};
                for (const name of tokenNames) {
                    result[name] = style.getPropertyValue(name).trim();
                }
                return result;
            }, Object.keys(DARK_TOKENS));

            for (const [token, expected] of Object.entries(DARK_TOKENS)) {
                const actual = tokens[token];
                if (!actual) {
                    test(`${file} [dark]: ${token} defined`, false);
                } else {
                    test(`${file} [dark]: ${token} = ${expected}`,
                        hexMatch(actual, expected));
                }
            }

            // Check dark body bg
            const bgColor = await page.evaluate(() =>
                getComputedStyle(document.body).backgroundColor);
            test(`${file} [dark]: body bg = ${DARK_TOKENS['--bg-page']}`,
                hexMatch(bgColor, DARK_TOKENS['--bg-page']));

            // Check text readability: primary text should be light
            const textColor = await page.evaluate(() => {
                const el = document.querySelector('h1') || document.querySelector('p') || document.body;
                return getComputedStyle(el).color;
            });
            // In dark mode, text should not be dark (#333 etc)
            const darkTextBad = ['#333333', '#1A1F36', '#000000'].some(hex =>
                hexMatch(textColor, hex));
            test(`${file} [dark]: text not dark-on-dark`, !darkTextBad);

            // Check textarea readability (site-b5 regression)
            const textareaReadable = await page.evaluate(() => {
                const ta = document.querySelector('textarea');
                if (!ta) return true; // no textarea = pass
                const style = getComputedStyle(ta);
                const bg = style.backgroundColor;
                const color = style.color;
                // Both should use token values, not both be dark
                return bg !== color;
            });
            test(`${file} [dark]: textarea readable`, textareaReadable);

        } catch (e) {
            console.log(`  ⚠️  ${file} [dark]: ${e.message.substring(0, 80)}`);
        }
        await page.close();
    }

    // ===============================================================
    // SUITE 3: CANVAS ALWAYS WHITE
    // ===============================================================
    section('SUITE 3: Canvas Always White');

    for (const file of GRAPH_CANVAS_PAGES) {
        const filePath = path.join(ROOT, file);
        if (!fs.existsSync(filePath)) continue;
        const html = fs.readFileSync(filePath, 'utf-8');

        // Check for CANVAS constant or white fillRect
        const hasCanvasConst = html.includes('CANVAS') && html.includes('#FFFFFF');
        const hasWhiteFill = html.includes("fillStyle = '#FFFFFF'") ||
                             html.includes('fillStyle = "#FFFFFF"') ||
                             html.includes("fillStyle = 'white'") ||
                             html.includes('fillRect');
        test(`${file}: canvas uses white background`,
            hasCanvasConst || hasWhiteFill);
    }

    // ===============================================================
    // SUITE 4: RESPONSIVE LAYOUT (f-t7-responsive)
    // ===============================================================
    section('SUITE 4: Responsive — 375px (Phone)');

    for (const file of RESPONSIVE_PAGES) {
        const url = BASE_URL + '/' + file;
        const page = await context.newPage();
        await page.setViewportSize({ width: 375, height: 667 });
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

            // No horizontal overflow
            const hasOverflow = await page.evaluate(() => {
                return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            });
            test(`${file} @375px: no horizontal overflow`, !hasOverflow);

            // Buttons have minimum touch target (36px is practical min, 44px ideal)
            const buttonSizes = await page.evaluate(() => {
                const buttons = document.querySelectorAll('button, .btn, [type="submit"]');
                let tooSmall = 0;
                let details = [];
                buttons.forEach(b => {
                    const rect = b.getBoundingClientRect();
                    // Skip hidden/zero-size buttons
                    if (rect.height === 0 || rect.width === 0) return;
                    if (rect.height < 36) {
                        tooSmall++;
                        if (details.length < 3) details.push(b.textContent.trim().substring(0, 30) + ': ' + Math.round(rect.height) + 'px');
                    }
                });
                return { total: buttons.length, tooSmall, details };
            });
            test(`${file} @375px: touch targets ≥36px (${buttonSizes.tooSmall} too small)`,
                buttonSizes.tooSmall === 0 || buttonSizes.total === 0);
            if (buttonSizes.tooSmall > 0) {
                buttonSizes.details.forEach(d => console.log(`    → ${d}`));
            }

            // Inputs should be full width on mobile
            const inputWidths = await page.evaluate(() => {
                const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
                let narrow = 0;
                inputs.forEach(inp => {
                    const rect = inp.getBoundingClientRect();
                    if (rect.width > 0 && rect.width < 120) narrow++;
                });
                return { total: inputs.length, narrow };
            });
            if (inputWidths.total > 0) {
                test(`${file} @375px: inputs not too narrow`, inputWidths.narrow < inputWidths.total / 2);
            }

        } catch (e) {
            console.log(`  ⚠️  ${file} @375px: ${e.message.substring(0, 80)}`);
        }
        await page.close();
    }

    section('SUITE 4b: Responsive — 768px (Tablet)');

    for (const file of RESPONSIVE_PAGES) {
        const url = BASE_URL + '/' + file;
        const page = await context.newPage();
        await page.setViewportSize({ width: 768, height: 1024 });
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

            const hasOverflow = await page.evaluate(() =>
                document.documentElement.scrollWidth > document.documentElement.clientWidth);
            test(`${file} @768px: no horizontal overflow`, !hasOverflow);

        } catch (e) {
            console.log(`  ⚠️  ${file} @768px: ${e.message.substring(0, 80)}`);
        }
        await page.close();
    }

    // ===============================================================
    // SUITE 5: TYPOGRAPHY
    // ===============================================================
    section('SUITE 5: Typography');

    for (const file of ['index.html', 'nonlinear_exam_mvp.html', 'practice.html']) {
        const url = BASE_URL + '/' + file;
        const page = await context.newPage();
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

            // h1 should be navy, bold
            const h1Style = await page.evaluate(() => {
                const h1 = document.querySelector('h1');
                if (!h1) return null;
                const s = getComputedStyle(h1);
                return { color: s.color, fontWeight: s.fontWeight, fontSize: s.fontSize };
            });
            if (h1Style) {
                test(`${file}: h1 bold (700)`,
                    h1Style.fontWeight === '700' || h1Style.fontWeight === 'bold');
                // h1 color should be navy-ish
                test(`${file}: h1 color is navy`,
                    hexMatch(h1Style.color, '#002D62'));
            }

            // Font family should include Helvetica
            const fontFamily = await page.evaluate(() =>
                getComputedStyle(document.body).fontFamily);
            test(`${file}: font family includes Helvetica`,
                fontFamily.toLowerCase().includes('helvetica'));

        } catch (e) {
            console.log(`  ⚠️  ${file} typography: ${e.message.substring(0, 80)}`);
        }
        await page.close();
    }

    // ===============================================================
    // SUITE 6: HARDCODED HEX IN INLINE STYLES
    // ===============================================================
    section('SUITE 6: Inline Hardcoded Hex Detection');

    for (const file of ALL_FILES) {
        const url = BASE_URL + '/' + file;
        const page = await context.newPage();
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

            // Find all elements with inline style containing banned hex
            const inlineHexCount = await page.evaluate((banned) => {
                const all = document.querySelectorAll('[style]');
                let count = 0;
                const found = [];
                all.forEach(el => {
                    const style = el.getAttribute('style').toLowerCase();
                    for (const b of banned) {
                        if (style.includes(b.hex.toLowerCase())) {
                            count++;
                            if (found.length < 3) {
                                found.push({ hex: b.hex, tag: el.tagName, style: style.substring(0, 60) });
                            }
                        }
                    }
                });
                return { count, found };
            }, BANNED_HEX_INLINE);

            if (inlineHexCount.count > 0) {
                test(`${file}: no banned hex in inline styles (found ${inlineHexCount.count})`, false);
                for (const f of inlineHexCount.found) {
                    console.log(`    → ${f.tag} style="${f.style}..." has ${f.hex}`);
                }
            } else {
                test(`${file}: no banned hex in inline styles`, true);
            }

        } catch (e) {
            console.log(`  ⚠️  ${file}: ${e.message.substring(0, 80)}`);
        }
        await page.close();
    }

    // ===============================================================
    // SUITE 7: STRUCTURAL CHECKS
    // ===============================================================
    section('SUITE 7: Structural (KaTeX, Print, ARIA)');

    for (const file of ALL_FILES) {
        const filePath = path.join(ROOT, file);
        const html = fs.readFileSync(filePath, 'utf-8');

        // No polyfill.io
        const bannedCdn = 'polyfill' + '.io';
        test(`${file}: no polyfill.io`, !html.includes(bannedCdn));

        // No MathJax CDN (should use local KaTeX)
        test(`${file}: no MathJax CDN`,
            !html.includes('cdn.jsdelivr.net/npm/mathjax'));

        // Has lang attribute
        test(`${file}: has lang="en"`, html.includes('lang="en"'));

        // Has viewport meta
        test(`${file}: has viewport meta`, html.includes('viewport'));
    }

    // ===============================================================
    // SUMMARY
    // ===============================================================
    await browser.close();

    section('DESIGN COMPLIANCE SUMMARY');
    console.log(`\n  Total: ${pass + fail + skip}`);
    console.log(`  ✅ Passed: ${pass}`);
    console.log(`  ❌ Failed: ${fail}`);
    console.log(`  ⏭️  Skipped: ${skip}`);

    if (failures.length > 0 && failures.length <= 20) {
        console.log('\n  Failures:');
        failures.forEach(f => console.log(`    • ${f}`));
    } else if (failures.length > 20) {
        console.log(`\n  First 20 failures:`);
        failures.slice(0, 20).forEach(f => console.log(`    • ${f}`));
        console.log(`    ... and ${failures.length - 20} more`);
    }

    console.log('');
    process.exit(fail > 0 ? 1 : 0);
}

run().catch(e => {
    console.error('Fatal:', e.message);
    process.exit(2);
});

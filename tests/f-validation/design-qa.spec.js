/**
 * design-qa.spec.js — Product-level design QA (rendered output, not CSS source)
 * Agent GF | Assigned by Agent FF (mentor)
 *
 * Categories 1-2: Visual Consistency + Navigation
 * Tests RENDERED OUTPUT via getComputedStyle() across all pages.
 *
 * Run: node tests/f-validation/design-qa.spec.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..', '..');
const PORT = 8349;

// Auto-discover all user-facing HTML pages in repo root
const PAGES = fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.html') && fs.statSync(path.join(ROOT, f)).isFile())
    .sort();

// Approved font size scale (per FD/FF)
const APPROVED_SIZES_PX = [12, 14, 16, 20, 28, 40];
const SIZE_TOLERANCE = 1.5; // px — allow rounding (e.g. 15.2px is close to 16)

let browser, server;
let pass = 0, fail = 0, total = 0;
const findings = [];

function test(name, ok, detail) {
    total++;
    if (ok) {
        pass++;
        // silent on pass to keep output clean
    } else {
        fail++;
        console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`);
        findings.push({ test: name, detail });
    }
}

// Static file server
function startServer() {
    return new Promise((resolve) => {
        const mimeTypes = {
            '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
            '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
            '.woff': 'font/woff', '.ttf': 'font/ttf', '.png': 'image/png',
        };
        server = http.createServer((req, res) => {
            const urlPath = decodeURIComponent(req.url.split('?')[0]);
            const filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
            const ext = path.extname(filePath);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
                fs.createReadStream(filePath).pipe(res);
            } else {
                res.writeHead(404);
                res.end('Not found');
            }
        });
        server.listen(PORT, () => resolve());
    });
}

function pageUrl(file) {
    // exam.html needs ?file= (just the name, no path/ext — exam.html adds data/ and .json)
    if (file === 'exam.html') {
        return `http://localhost:${PORT}/exam.html?file=retake-practice-1`;
    }
    return `http://localhost:${PORT}/${file}`;
}

// ============================================================
// EXTRACTION: runs inside the browser via page.evaluate()
// ============================================================

// Extract computed font families for non-KaTeX elements
async function extractFonts(page) {
    return page.evaluate(() => {
        const results = [];
        const els = document.querySelectorAll('*');
        for (const el of els) {
            // Skip KaTeX internals — math SHOULD use KaTeX fonts
            if (el.closest('.katex, .katex-display, .katex-html, .katex-mathml')) continue;
            // Skip hidden elements
            const s = getComputedStyle(el);
            if (s.display === 'none' || s.visibility === 'hidden') continue;
            if (el.offsetWidth === 0 && el.offsetHeight === 0) continue;
            results.push({
                tag: el.tagName,
                id: el.id || '',
                fontFamily: s.fontFamily,
            });
        }
        return results;
    });
}

// Extract all computed font sizes (excludes KaTeX/MathJax internals)
async function extractFontSizes(page) {
    return page.evaluate(() => {
        const sizes = {};
        const els = document.querySelectorAll('*');
        for (const el of els) {
            // Skip math rendering internals
            if (el.closest('.katex, .katex-display, .katex-html, .katex-mathml, .MathJax')) continue;
            const s = getComputedStyle(el);
            if (s.display === 'none' || s.visibility === 'hidden') continue;
            if (el.offsetWidth === 0 && el.offsetHeight === 0) continue;
            const size = parseFloat(s.fontSize);
            if (!isNaN(size) && size > 0) {
                sizes[size] = (sizes[size] || 0) + 1;
            }
        }
        return sizes;
    });
}

// Check for console errors
async function collectConsoleErrors(page, url) {
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000); // let scripts run
    return errors;
}

// Check for back-to-dashboard link
async function checkNavigation(page) {
    return page.evaluate(() => {
        const links = document.querySelectorAll('a');
        for (const a of links) {
            const href = a.getAttribute('href') || '';
            const text = a.textContent.toLowerCase();
            if (href.includes('index.html') || text.includes('dashboard') || text.includes('back') || text.includes('home')) {
                const rect = a.getBoundingClientRect();
                return {
                    found: true,
                    text: a.textContent.trim().substring(0, 60),
                    href,
                    visible: rect.width > 0 && rect.height > 0,
                    top: rect.top,
                };
            }
        }
        // Also check buttons
        const buttons = document.querySelectorAll('button');
        for (const b of buttons) {
            const text = b.textContent.toLowerCase();
            if (text.includes('dashboard') || text.includes('back') || text.includes('home')) {
                const rect = b.getBoundingClientRect();
                return { found: true, text: b.textContent.trim().substring(0, 60), href: 'button', visible: rect.width > 0 && rect.height > 0, top: rect.top };
            }
        }
        return { found: false };
    });
}

// ============================================================
// MAIN
// ============================================================
(async () => {
    console.log('\n🏀 design-qa.spec.js — Product-level design QA\n');
    console.log(`  Pages discovered: ${PAGES.length} — ${PAGES.join(', ')}\n`);

    await startServer();
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

    // Cross-page aggregation
    const allFontSizes = {};
    const pagesWithTimesNewRoman = [];
    const pagesWithConsoleErrors = [];
    const pagesMissingNav = [];
    const pagesBadTitle = [];
    const pagesMissingViewport = [];
    const navPositions = [];

    // ================================================================
    // CATEGORY 1: Visual Consistency — per page
    // ================================================================
    console.log('══ CATEGORY 1: Visual Consistency ══');

    for (const file of PAGES) {
        const pageName = file.replace('.html', '');
        const page = await context.newPage();

        // 1a. Console errors
        const errors = await collectConsoleErrors(page, pageUrl(file));
        const realErrors = errors.filter(e =>
            // Ignore favicon 404s and known non-issues
            !e.includes('favicon') && !e.includes('ERR_FILE_NOT_FOUND')
        );
        test(`${pageName}: zero console errors`, realErrors.length === 0,
            realErrors.length > 0 ? `${realErrors.length} error(s): ${realErrors[0].substring(0, 80)}` : '');
        if (realErrors.length > 0) pagesWithConsoleErrors.push({ page: pageName, errors: realErrors });

        // 1b. Font family — no Times New Roman on non-KaTeX elements
        const fontData = await extractFonts(page);
        const timesElements = fontData.filter(f =>
            f.fontFamily.includes('Times New Roman') || f.fontFamily.includes('Times')
        );
        // Only flag if visible non-trivial elements have Times
        const significantTimes = timesElements.filter(f =>
            !['SCRIPT', 'STYLE', 'META', 'LINK', 'HEAD', 'HTML', 'BR', 'HR'].includes(f.tag)
        );
        test(`${pageName}: no Times New Roman on UI elements`, significantTimes.length === 0,
            significantTimes.length > 0 ? `${significantTimes.length} elements (e.g. ${significantTimes[0].tag}#${significantTimes[0].id})` : '');
        if (significantTimes.length > 0) pagesWithTimesNewRoman.push({ page: pageName, count: significantTimes.length });

        // 1c. Font sizes — collect for cross-page analysis
        const sizes = await extractFontSizes(page);
        for (const [size, count] of Object.entries(sizes)) {
            allFontSizes[size] = (allFontSizes[size] || 0) + count;
        }

        // 1d. Page title matches "Motor City Math — *"
        const title = await page.title();
        const titleOk = title.startsWith('Motor City Math') || title.includes('Motor City Math');
        test(`${pageName}: title includes "Motor City Math"`, titleOk,
            !titleOk ? `title: "${title}"` : '');
        if (!titleOk) pagesBadTitle.push({ page: pageName, title });

        // 1e. Viewport meta tag
        const viewport = await page.evaluate(() => {
            const meta = document.querySelector('meta[name="viewport"]');
            return meta ? meta.getAttribute('content') : null;
        });
        const viewportOk = viewport && viewport.includes('width=device-width');
        test(`${pageName}: viewport meta present`, viewportOk,
            !viewportOk ? `viewport: ${viewport || 'MISSING'}` : '');
        if (!viewportOk) pagesMissingViewport.push(pageName);

        await page.close();
    }

    // 1f. Cross-page font size analysis
    console.log('\n── Font Size Analysis (cross-page) ──');
    const uniqueSizes = Object.keys(allFontSizes).map(Number).sort((a, b) => a - b);
    const outliers = uniqueSizes.filter(size => {
        return !APPROVED_SIZES_PX.some(approved => Math.abs(size - approved) <= SIZE_TOLERANCE);
    });
    console.log(`  Unique sizes found: ${uniqueSizes.length}`);
    console.log(`  Approved scale: ${APPROVED_SIZES_PX.join(', ')}px`);
    console.log(`  Outliers: ${outliers.length > 0 ? outliers.map(s => s + 'px').join(', ') : 'none'}`);
    test('cross-page: font sizes fit within 7 or fewer distinct values',
        uniqueSizes.length <= 7,
        `${uniqueSizes.length} distinct sizes: ${uniqueSizes.map(s => s + 'px').join(', ')}`);

    // ================================================================
    // CATEGORY 2: Navigation — per page
    // ================================================================
    console.log('\n══ CATEGORY 2: Navigation ══');

    for (const file of PAGES) {
        const pageName = file.replace('.html', '');
        // Skip index.html itself — it IS the dashboard
        if (file === 'index.html') continue;

        const page = await context.newPage();
        await page.goto(pageUrl(file), { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(1000);

        const nav = await checkNavigation(page);
        test(`${pageName}: has back-to-dashboard link`, nav.found && nav.visible,
            !nav.found ? 'no link to index.html/dashboard found' : (!nav.visible ? 'link exists but not visible' : ''));
        if (!nav.found || !nav.visible) {
            pagesMissingNav.push(pageName);
        } else {
            navPositions.push({ page: pageName, top: nav.top, text: nav.text });
        }

        await page.close();
    }

    // Navigation consistency — are back links in roughly the same position?
    if (navPositions.length >= 3) {
        const tops = navPositions.map(n => n.top);
        const minTop = Math.min(...tops);
        const maxTop = Math.max(...tops);
        const spread = maxTop - minTop;
        test('cross-page: back link position consistency (spread < 500px)', spread < 500,
            `positions range from ${Math.round(minTop)}px to ${Math.round(maxTop)}px (spread: ${Math.round(spread)}px)`);
    }

    // ================================================================
    // CATEGORY 3: Responsive — 375px viewport
    // ================================================================
    console.log('\n══ CATEGORY 3: Responsive (375px mobile) ══');
    const pagesWithHScroll = [];
    const smallTouchTargets = [];

    for (const file of PAGES) {
        const pageName = file.replace('.html', '');
        const page = await context.newPage();
        await page.setViewportSize({ width: 375, height: 812 }); // iPhone SE
        await page.goto(pageUrl(file), { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000);

        // 3a. No horizontal scroll at 375px
        const hScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        test(`${pageName}: no horizontal scroll at 375px`, !hScroll,
            hScroll ? 'page wider than viewport' : '');
        if (hScroll) pagesWithHScroll.push(pageName);

        // 3b. Touch targets ≥ 44px (WCAG 2.5.8)
        const tinyTargets = await page.evaluate(() => {
            const MIN_SIZE = 44;
            const issues = [];
            const interactives = document.querySelectorAll('a, button, input, select, textarea, [role="button"], [tabindex]');
            for (const el of interactives) {
                const rect = el.getBoundingClientRect();
                if (rect.width === 0 && rect.height === 0) continue;
                const s = getComputedStyle(el);
                if (s.display === 'none' || s.visibility === 'hidden') continue;
                // Skip sr-only / skip links (intentionally tiny, visible on focus)
                if (s.position === 'absolute' && (rect.width <= 1 || rect.height <= 1)) continue;
                if (el.classList.contains('sr-only') || el.classList.contains('skip-link')) continue;
                if (rect.width < MIN_SIZE || rect.height < MIN_SIZE) {
                    issues.push({
                        tag: el.tagName,
                        id: el.id || '',
                        text: el.textContent.trim().substring(0, 30),
                        w: Math.round(rect.width),
                        h: Math.round(rect.height),
                    });
                }
            }
            return issues;
        });
        // Only flag if significant number of small targets (some tiny hidden inputs are OK)
        const significantTiny = tinyTargets.filter(t => t.w > 0 || t.h > 0);
        test(`${pageName}: touch targets ≥ 44px`, significantTiny.length === 0,
            significantTiny.length > 0 ? `${significantTiny.length} small targets (e.g. ${significantTiny[0].tag}#${significantTiny[0].id} ${significantTiny[0].w}x${significantTiny[0].h}px "${significantTiny[0].text.substring(0,20)}")` : '');
        if (significantTiny.length > 0) smallTouchTargets.push({ page: pageName, count: significantTiny.length, examples: significantTiny.slice(0, 3) });

        // Reset viewport for next iteration
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.close();
    }

    // ================================================================
    // CATEGORY 4: Arena Mode
    // ================================================================
    console.log('\n══ CATEGORY 4: Arena Mode ══');
    const arenaIssues = [];

    for (const file of PAGES) {
        const pageName = file.replace('.html', '');
        // Only test pages that could have arena mode (test/exam pages, not index)
        if (file === 'index.html') continue;

        const page = await context.newPage();
        await page.goto(pageUrl(file), { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(1500);

        const arenaResult = await page.evaluate(() => {
            // Check if arena mode toggle exists
            const toggle = document.querySelector('#arena-toggle, #arenaToggle, [data-arena-toggle], .arena-toggle');
            if (!toggle) return { hasToggle: false };

            // Try to click it and check body class
            const rect = toggle.getBoundingClientRect();
            const visible = rect.width > 0 && rect.height > 0;
            const bodyClassBefore = document.body.className;
            if (visible) toggle.click();
            const bodyClassAfter = document.body.className;
            const classChanged = bodyClassBefore !== bodyClassAfter;
            const hasArenaClass = bodyClassAfter.includes('arena');

            return {
                hasToggle: true,
                visible,
                classChanged,
                hasArenaClass,
                bodyClassAfter,
            };
        });

        if (arenaResult.hasToggle) {
            test(`${pageName}: arena toggle visible`, arenaResult.visible,
                !arenaResult.visible ? 'toggle exists but not visible' : '');
            test(`${pageName}: arena toggle adds body class`, arenaResult.hasArenaClass,
                !arenaResult.hasArenaClass ? `body class after click: "${arenaResult.bodyClassAfter}"` : '');
            if (!arenaResult.visible || !arenaResult.hasArenaClass) {
                arenaIssues.push({ page: pageName, ...arenaResult });
            }
        }
        // No toggle = no test needed (arena is optional per page)

        await page.close();
    }

    // ================================================================
    // CATEGORY 5: Error States
    // ================================================================
    console.log('\n══ CATEGORY 5: Error States ══');
    const errorStateIssues = [];

    // 5a. exam.html without ?file= should show error, not "Loading..."
    {
        const page = await context.newPage();
        const errors = [];
        page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
        await page.goto(`http://localhost:${PORT}/exam.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(3000);

        const state = await page.evaluate(() => {
            const title = document.title;
            const body = document.body.textContent.trim().substring(0, 200);
            const hasError = body.toLowerCase().includes('error') ||
                           body.toLowerCase().includes('select') ||
                           body.toLowerCase().includes('choose') ||
                           body.toLowerCase().includes('no exam');
            const hasLoading = body.toLowerCase().includes('loading');
            return { title, bodyPreview: body.substring(0, 100), hasError, hasLoading };
        });

        test('exam.html (no ?file=): shows meaningful error', state.hasError || !state.hasLoading,
            state.hasLoading ? `still shows "Loading..." — body: "${state.bodyPreview}"` :
            (!state.hasError ? `no error message shown — body: "${state.bodyPreview}"` : ''));
        if (!state.hasError && state.hasLoading) errorStateIssues.push({ page: 'exam (no param)', detail: state.bodyPreview });

        await page.close();
    }

    // 5b. exam.html with bad ?file= should show error
    {
        const page = await context.newPage();
        await page.goto(`http://localhost:${PORT}/exam.html?file=nonexistent`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(3000);

        const state = await page.evaluate(() => {
            const body = document.body.textContent.trim().substring(0, 200);
            const hasError = body.toLowerCase().includes('error') ||
                           body.toLowerCase().includes('could not') ||
                           body.toLowerCase().includes('not found');
            return { bodyPreview: body.substring(0, 100), hasError };
        });

        test('exam.html (bad ?file=): shows error message', state.hasError,
            !state.hasError ? `no error shown — body: "${state.bodyPreview}"` : '');
        if (!state.hasError) errorStateIssues.push({ page: 'exam (bad param)', detail: state.bodyPreview });

        await page.close();
    }

    // ================================================================
    // CATEGORY 6: Screenshot Baseline
    // ================================================================
    console.log('\n══ CATEGORY 6: Screenshot Baseline ══');
    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

    // Reset viewport for screenshots
    const screenshotContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    let newScreenshots = 0, comparedScreenshots = 0, driftScreenshots = 0;

    for (const file of PAGES) {
        const pageName = file.replace('.html', '');
        const page = await screenshotContext.newPage();
        await page.goto(pageUrl(file), { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000);

        const screenshotPath = path.join(screenshotDir, `${pageName}.png`);
        const tempPath = path.join(screenshotDir, `${pageName}.new.png`);

        if (!fs.existsSync(screenshotPath)) {
            // First run — capture baseline
            await page.screenshot({ path: screenshotPath, fullPage: true });
            newScreenshots++;
            console.log(`  📸 ${pageName}: baseline captured`);
        } else {
            // Subsequent run — capture temp and compare file sizes as rough drift check
            await page.screenshot({ path: tempPath, fullPage: true });
            const baseSize = fs.statSync(screenshotPath).size;
            const newSize = fs.statSync(tempPath).size;
            const sizeDiff = Math.abs(baseSize - newSize) / baseSize;

            if (sizeDiff > 0.05) {
                // >5% file size change = likely visual drift
                driftScreenshots++;
                test(`${pageName}: screenshot stable`, false,
                    `file size changed ${(sizeDiff * 100).toFixed(1)}% (${baseSize}→${newSize} bytes)`);
                // Keep new screenshot for manual comparison
                const diffPath = path.join(screenshotDir, `${pageName}.drift.png`);
                fs.renameSync(tempPath, diffPath);
            } else {
                comparedScreenshots++;
                fs.unlinkSync(tempPath);
            }
        }

        await page.close();
    }

    console.log(`  Screenshots: ${newScreenshots} new baselines, ${comparedScreenshots} stable, ${driftScreenshots} drifted`);
    await screenshotContext.close();

    // ================================================================
    // SUMMARY
    // ================================================================
    await browser.close();
    server.close();

    console.log(`\n${'═'.repeat(55)}`);
    console.log('DESIGN QA RESULTS — Categories 1-6');
    console.log(`${'═'.repeat(55)}`);
    console.log(`  Total: ${total} tests`);
    console.log(`  ✅ Passed: ${pass}`);
    console.log(`  ❌ Failed: ${fail}`);

    if (pagesWithTimesNewRoman.length > 0) {
        console.log(`\n  📝 Times New Roman found on ${pagesWithTimesNewRoman.length} pages:`);
        pagesWithTimesNewRoman.forEach(p => console.log(`     ${p.page}: ${p.count} UI elements`));
    }
    if (pagesWithConsoleErrors.length > 0) {
        console.log(`\n  📝 Console errors on ${pagesWithConsoleErrors.length} pages:`);
        pagesWithConsoleErrors.forEach(p => console.log(`     ${p.page}: ${p.errors[0].substring(0, 80)}`));
    }
    if (pagesBadTitle.length > 0) {
        console.log(`\n  📝 Missing "Motor City Math" in title (${pagesBadTitle.length} pages):`);
        pagesBadTitle.forEach(p => console.log(`     ${p.page}: "${p.title}"`));
    }
    if (pagesMissingNav.length > 0) {
        console.log(`\n  📝 No back-to-dashboard link (${pagesMissingNav.length} pages):`);
        pagesMissingNav.forEach(p => console.log(`     ${p}`));
    }
    if (pagesWithHScroll.length > 0) {
        console.log(`\n  📝 Horizontal scroll at 375px (${pagesWithHScroll.length} pages):`);
        pagesWithHScroll.forEach(p => console.log(`     ${p}`));
    }
    if (smallTouchTargets.length > 0) {
        console.log(`\n  📝 Touch targets < 44px (${smallTouchTargets.length} pages):`);
        smallTouchTargets.forEach(p => {
            console.log(`     ${p.page}: ${p.count} small targets`);
            p.examples.forEach(e => console.log(`       → ${e.tag}#${e.id} ${e.w}x${e.h}px "${e.text.substring(0,25)}"`));
        });
    }
    if (arenaIssues.length > 0) {
        console.log(`\n  📝 Arena mode issues (${arenaIssues.length} pages):`);
        arenaIssues.forEach(p => console.log(`     ${p.page}: toggle=${p.visible ? 'visible' : 'hidden'}, classChange=${p.hasArenaClass}`));
    }
    if (errorStateIssues.length > 0) {
        console.log(`\n  📝 Error state issues (${errorStateIssues.length}):`);
        errorStateIssues.forEach(p => console.log(`     ${p.page}: ${p.detail}`));
    }

    console.log(`\n${'═'.repeat(55)}\n`);
    process.exit(fail > 0 ? 1 : 0);
})();

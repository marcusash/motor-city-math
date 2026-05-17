/**
 * Validate S4 Gap Drill print view: click Print button, capture popup,
 * screenshot every page, and verify each fraction renders numerator + denominator.
 *
 * Run: node tests/playwright/validate-print-fractions.js
 */
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const ARTIFACTS = path.join(ROOT, 'artifacts', 's4-drill-print-validation');

function startServer() {
    return new Promise(resolve => {
        const srv = http.createServer((req, res) => {
            let fp = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
            if (!fs.existsSync(fp)) { res.writeHead(404); res.end(); return; }
            if (fs.statSync(fp).isDirectory()) fp = path.join(fp, 'index.html');
            const ext = path.extname(fp).toLowerCase();
            const types = {'.html':'text/html','.css':'text/css','.js':'application/javascript',
                '.json':'application/json','.woff2':'font/woff2','.woff':'font/woff',
                '.ttf':'font/ttf','.png':'image/png','.svg':'image/svg+xml'};
            res.writeHead(200, {'Content-Type': types[ext]||'application/octet-stream'});
            fs.createReadStream(fp).pipe(res);
        });
        srv.listen(0, () => resolve(srv));
    });
}

// Expected fractions: question number → array of {numer, denom} expected text fragments
const EXPECTED_FRACTIONS = {
    1:  [{ numer: 'x2−4',         denom: 'x2+5x+6' }],
    2:  [{ numer: 'x3−4x',       denom: 'x2−x−2' }],
    3:  [{ numer: 'x2+x',        denom: 'x2−1' }],
    4:  [{ numer: '2x2−8',       denom: 'x2−6x+8' }],
    5:  [{ numer: 'x3+2x2−3x',  denom: 'x2+4x+3' }],
    6:  [{ numer: '3',            denom: 'x+2' },
         { numer: '5',            denom: 'x−1' }],
    7:  [{ numer: '4x',           denom: 'x+1' },
         { numer: '3',            denom: 'x+4' }],
    8:  [{ numer: '1',            denom: '2x2' },
         { numer: '3',            denom: '4x3' }],
    9:  [{ numer: 'x',            denom: 'x−3' },
         { numer: '2',            denom: 'x+1' }],
    // Q10 has no fractions (expand/simplify)
    11: [{ numer: 'f(x+h)−f(x)', denom: 'h' }],
    12: [{ numer: '2x+3',        denom: 'x+1' },
         { numer: 'x−2',         denom: 'x+4' }],
};

function normalizeText(s) {
    // Strip whitespace, newlines, invisible chars for comparison
    return s.replace(/[\s\u200b\u00a0]+/g, '');
}

(async () => {
    // Setup
    fs.mkdirSync(ARTIFACTS, { recursive: true });
    const srv = await startServer();
    const port = srv.address().port;
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({ viewport: { width: 900, height: 1200 } });
    const page = await context.newPage();

    console.log('Opening exam...');
    await page.goto(`http://localhost:${port}/exam.html?file=s4-assessment-drill-1`);
    await page.waitForSelector('.question-card', { timeout: 10000 });
    await page.waitForTimeout(1500);

    // ── Step 1: Screenshot interactive view for reference ──
    console.log('Screenshotting interactive view...');
    await page.screenshot({ path: path.join(ARTIFACTS, '00-interactive-view.png'), fullPage: true });

    // Capture interactive-view fractions as reference
    const interactiveFracs = await page.evaluate(() => {
        const results = {};
        document.querySelectorAll('.question-card').forEach(card => {
            const qNum = parseInt(card.querySelector('.question-number')?.textContent?.match(/\d+/)?.[0] || '0');
            const fracs = card.querySelectorAll('.katex .mfrac');
            if (fracs.length > 0) {
                results[qNum] = Array.from(fracs).map(f => {
                    const vlist = f.querySelector('.vlist');
                    const children = vlist ? Array.from(vlist.children) : [];
                    // child[0]=denom, child[1]=frac-line, child[2]=numer
                    return {
                        numer: children.length > 2 ? children[2].innerText.trim() : '',
                        denom: children.length > 0 ? children[0].innerText.trim() : '',
                    };
                });
            }
        });
        return results;
    });
    console.log('Interactive fractions captured for', Object.keys(interactiveFracs).length, 'questions');

    // ── Step 2: Click Print button, capture popup ──
    console.log('Clicking Print button...');
    // Override window.print to prevent the actual print dialog
    await page.evaluate(() => {
        window.__origOpen = window.open;
        window.open = function(url, target, features) {
            const w = window.__origOpen.call(window, url, target, features);
            // Override print on the popup to prevent dialog
            if (w) {
                const origWrite = w.document.write.bind(w.document);
                w.document.write = function(html) {
                    // Remove the auto-print script
                    html = html.replace(/<script>setTimeout\(function\(\)\{window\.print\(\);\},\d+\);<\/script>/, '');
                    origWrite(html);
                };
            }
            return w;
        };
    });

    const [popup] = await Promise.all([
        context.waitForEvent('page'),
        page.click('.print-btn'),
    ]);
    await popup.waitForLoadState('domcontentloaded');
    await popup.waitForTimeout(2500);

    // ── Step 3: Full-page screenshot of print view ──
    console.log('Screenshotting print view...');
    await popup.screenshot({ path: path.join(ARTIFACTS, '01-full-print-view.png'), fullPage: true });

    // ── Step 4: Validate each question's fractions ──
    console.log('\n=== VALIDATING FRACTIONS ===');
    let totalChecks = 0;
    let passed = 0;
    let failed = 0;
    const failures = [];

    const printFracs = await popup.evaluate(() => {
        const results = {};
        document.querySelectorAll('.qcard').forEach(card => {
            const qNum = parseInt(card.querySelector('.qnum')?.textContent?.match(/\d+/)?.[0] || '0');
            const fracs = card.querySelectorAll('.katex .mfrac');
            if (fracs.length > 0) {
                results[qNum] = Array.from(fracs).map(f => {
                    const vlist = f.querySelector('.vlist');
                    const children = vlist ? Array.from(vlist.children) : [];
                    // Get bounding rects to check visibility
                    const denomChild = children[0];
                    const numerChild = children.length > 2 ? children[2] : null;
                    // Find actual content spans (not pstrut)
                    const denomMord = denomChild ? denomChild.querySelector('.mord') : null;
                    const numerMord = numerChild ? numerChild.querySelector('.mord') : null;
                    return {
                        numer: numerChild ? numerChild.innerText.trim() : '',
                        denom: denomChild ? denomChild.innerText.trim() : '',
                        denomRect: denomMord ? denomMord.getBoundingClientRect() : null,
                        numerRect: numerMord ? numerMord.getBoundingClientRect() : null,
                        denomVisible: denomMord ? (denomMord.getBoundingClientRect().height > 0) : false,
                        numerVisible: numerMord ? (numerMord.getBoundingClientRect().height > 0) : false,
                    };
                });
            }
        });
        return results;
    });

    for (const [qStr, expected] of Object.entries(EXPECTED_FRACTIONS)) {
        const qNum = parseInt(qStr);
        const actual = printFracs[qNum] || [];

        console.log(`\nQ${qNum}: expecting ${expected.length} fraction(s)`);

        if (actual.length !== expected.length) {
            console.log(`  ✗ FAIL: found ${actual.length} fractions, expected ${expected.length}`);
            failures.push(`Q${qNum}: wrong fraction count (${actual.length} vs ${expected.length})`);
            failed++;
            totalChecks++;
            continue;
        }

        for (let i = 0; i < expected.length; i++) {
            const exp = expected[i];
            const act = actual[i];
            const normActNumer = normalizeText(act.numer);
            const normExpNumer = normalizeText(exp.numer);
            const normActDenom = normalizeText(act.denom);
            const normExpDenom = normalizeText(exp.denom);

            // Check numerator content
            totalChecks++;
            if (normActNumer.includes(normExpNumer) || normExpNumer.includes(normActNumer)) {
                console.log(`  ✓ Frac ${i+1} numerator: "${act.numer}" ✓`);
                passed++;
            } else {
                console.log(`  ✗ Frac ${i+1} numerator: got "${act.numer}", expected "${exp.numer}"`);
                failures.push(`Q${qNum} frac ${i+1}: numerator mismatch`);
                failed++;
            }

            // Check denominator content
            totalChecks++;
            if (normActDenom.includes(normExpDenom) || normExpDenom.includes(normActDenom)) {
                console.log(`  ✓ Frac ${i+1} denominator: "${act.denom}" ✓`);
                passed++;
            } else {
                console.log(`  ✗ Frac ${i+1} denominator: got "${act.denom}", expected "${exp.denom}"`);
                failures.push(`Q${qNum} frac ${i+1}: denominator mismatch`);
                failed++;
            }

            // Check denominator VISIBILITY (bounding rect has height > 0)
            totalChecks++;
            if (act.denomVisible) {
                console.log(`  ✓ Frac ${i+1} denominator VISIBLE (height > 0) ✓`);
                passed++;
            } else {
                console.log(`  ✗ Frac ${i+1} denominator NOT VISIBLE (height = 0)`);
                failures.push(`Q${qNum} frac ${i+1}: denominator not visible`);
                failed++;
            }

            // Check numerator VISIBILITY
            totalChecks++;
            if (act.numerVisible) {
                console.log(`  ✓ Frac ${i+1} numerator VISIBLE ✓`);
                passed++;
            } else {
                console.log(`  ✗ Frac ${i+1} numerator NOT VISIBLE`);
                failures.push(`Q${qNum} frac ${i+1}: numerator not visible`);
                failed++;
            }
        }
    }

    // ── Step 5: Per-question screenshots ──
    console.log('\nTaking per-question screenshots...');
    const qCards = await popup.$$('.qcard');
    for (let i = 0; i < qCards.length; i++) {
        const qNum = i + 1;
        await qCards[i].screenshot({ path: path.join(ARTIFACTS, `q${qNum}-print.png`) });
    }

    // ── Summary ──
    console.log('\n========================================');
    console.log(`RESULTS: ${passed}/${totalChecks} passed, ${failed} failed`);
    if (failures.length > 0) {
        console.log('\nFAILURES:');
        failures.forEach(f => console.log('  • ' + f));
    } else {
        console.log('ALL CHECKS PASSED ✓');
    }
    console.log(`\nScreenshots saved to: ${ARTIFACTS}`);
    console.log('========================================');

    await browser.close();
    srv.close();
    process.exit(failed > 0 ? 1 : 0);
})();

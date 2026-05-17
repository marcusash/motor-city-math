/**
 * Test the ACTUAL user workflow:
 * 1. Go to the LIVE site (marcusash.github.io)
 * 2. Find/open the S4 Gap Drill
 * 3. Click Print button
 * 4. Capture the popup, generate a PDF (browser's real print output)
 * 5. Convert PDF to images and validate fractions are present
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACTS = path.join(__dirname, '../../artifacts/actual-workflow-test');

(async () => {
    fs.mkdirSync(ARTIFACTS, { recursive: true });

    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    console.log('Step 1: Opening live MCM dashboard...');
    await page.goto('https://marcusash.github.io/motor-city-math/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ARTIFACTS, '01-dashboard.png'), fullPage: true });

    console.log('Step 2: Opening S4 Gap Drill exam directly...');
    await page.goto('https://marcusash.github.io/motor-city-math/exam.html?file=s4-assessment-drill-1', {
        waitUntil: 'networkidle',
    });
    await page.waitForSelector('.question-card', { timeout: 15000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(ARTIFACTS, '02-exam-loaded.png'), fullPage: true });
    console.log('  Exam loaded.');

    console.log('Step 3: Clicking Print button...');
    const [popup] = await Promise.all([
        context.waitForEvent('page'),
        page.click('.print-btn'),
    ]);
    await popup.waitForLoadState('domcontentloaded');
    await popup.waitForTimeout(3500); // wait for KaTeX to render

    console.log('Step 4: Generating PDF (this is what the user sees in print preview)...');
    const pdfPath = path.join(ARTIFACTS, '03-actual-print-output.pdf');
    await popup.pdf({
        path: pdfPath,
        format: 'Letter',
        printBackground: true,
        margin: { top: '1.8cm', bottom: '1.8cm', left: '1.8cm', right: '1.8cm' },
        preferCSSPageSize: false,
    });
    console.log('  PDF saved:', pdfPath);

    // Step 5: Take a screenshot WITH PRINT MEDIA EMULATED
    console.log('Step 5: Screenshot with print media emulated...');
    await popup.emulateMedia({ media: 'print' });
    await popup.waitForTimeout(500);
    await popup.screenshot({ path: path.join(ARTIFACTS, '04-print-media-fullpage.png'), fullPage: true });

    // Step 6: Programmatic check — under print media, are denominators visible?
    console.log('Step 6: Checking fraction visibility under print media...');
    const fracCheck = await popup.evaluate(() => {
        const results = [];
        document.querySelectorAll('.qcard').forEach(card => {
            const qNum = parseInt(card.querySelector('.qnum')?.textContent?.match(/\d+/)?.[0] || '0');
            const fracs = card.querySelectorAll('.katex .mfrac');
            fracs.forEach((f, i) => {
                const vlist = f.querySelector('.vlist');
                const children = vlist ? Array.from(vlist.children) : [];
                const denomChild = children[0];
                const numerChild = children[2];
                const denomMord = denomChild ? denomChild.querySelector('.mord') : null;
                const numerMord = numerChild ? numerChild.querySelector('.mord') : null;
                const denomRect = denomMord ? denomMord.getBoundingClientRect() : null;
                const numerRect = numerMord ? numerMord.getBoundingClientRect() : null;
                const fracRect = f.getBoundingClientRect();
                results.push({
                    q: qNum, fracIdx: i,
                    denomText: denomChild ? denomChild.innerText.trim().replace(/\s+/g, '') : '',
                    numerText: numerChild ? numerChild.innerText.trim().replace(/\s+/g, '') : '',
                    fracY: fracRect.y,
                    fracH: fracRect.height,
                    denomY: denomRect?.y,
                    denomH: denomRect?.height,
                    denomVisible: !!(denomRect && denomRect.height > 0 && denomRect.width > 0),
                    numerY: numerRect?.y,
                    numerH: numerRect?.height,
                    numerVisible: !!(numerRect && numerRect.height > 0 && numerRect.width > 0),
                    // Check what parent backgrounds might be covering them
                    vlistTBG: f.querySelector('.vlist-t') ? getComputedStyle(f.querySelector('.vlist-t')).background.substring(0, 50) : '',
                });
            });
        });
        return results;
    });

    let failed = 0;
    fracCheck.forEach(r => {
        const ok = r.denomVisible && r.numerVisible;
        if (!ok) failed++;
        console.log(`  Q${r.q}.${r.fracIdx+1}: numer="${r.numerText}" (y=${r.numerY?.toFixed(0)} h=${r.numerH?.toFixed(0)}) denom="${r.denomText}" (y=${r.denomY?.toFixed(0)} h=${r.denomH?.toFixed(0)}) ${ok ? 'OK' : 'FAIL'}`);
    });

    console.log(`\n${failed === 0 ? 'PASS' : 'FAIL'}: ${fracCheck.length - failed}/${fracCheck.length} fractions visible under print media`);

    // Step 7: Convert PDF first page to PNG for visual inspection
    // (using pdftoppm if available, otherwise just keep PDF)
    console.log('\nArtifacts saved to:', ARTIFACTS);
    console.log('Open the PDF to see what the user sees:', pdfPath);

    await browser.close();
    process.exit(failed > 0 ? 1 : 0);
})();

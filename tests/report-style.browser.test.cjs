const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');

test('all reports preserve rendered information, reflow, evidence, focus and print', { timeout: 240000 }, async () => {
    const baseline = process.env.MCM_REPORT_BASELINE;
    const evidence = process.env.MCM_REPORT_EVIDENCE;
    if (evidence) await fs.mkdir(evidence, { recursive: true });
    const reports = (await fs.readdir(path.join(root, 'reviews'))).filter(file => file.endsWith('.html'))
        .map(file => 'reviews/' + file).concat('scores/practice-quiz-c-grade-report.html');
    const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
        '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
    const cache = new Map();
    const server = http.createServer(async (request, response) => {
        const url = new URL(request.url, 'http://localhost');
        const before = url.pathname.startsWith('/before/');
        const relative = decodeURIComponent(url.pathname.slice(before ? 8 : 1));
        const file = path.resolve(root, relative);
        if (!file.startsWith(root + path.sep)) return response.writeHead(403).end();
        try {
            let bytes;
            if (before && baseline) {
                if (!cache.has(relative)) cache.set(relative, execFileSync('git', ['show', baseline + ':' + relative],
                    { cwd: root, maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }));
                bytes = cache.get(relative);
            } else {
                bytes = await fs.readFile(file);
            }
            response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
            response.end(bytes);
        } catch (error) {
            if (error.code !== 'ENOENT') console.error(error.message);
            response.writeHead(error.code === 'ENOENT' ? 404 : 500).end();
        }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await chromium.launch({ channel: 'msedge', headless: true });
        const baseUrl = 'http://127.0.0.1:' + server.address().port;
        const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
        const page = await context.newPage();
        const errors = [];
        const failures = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => {
            if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) failures.push(response.url());
        });
        async function content() {
            await page.evaluate(() => document.fonts.ready);
            return page.evaluate(() => {
                const copy = document.body.cloneNode(true);
                copy.querySelectorAll('script,style,noscript,.back-link,.back,.report-context__label').forEach(node => node.remove());
                return {
                    text: copy.textContent.replace(/\s+/g, ' ').trim(),
                    images: [...copy.querySelectorAll('img')].map(image => [
                        image.getAttribute('src').replace(location.origin, '').replace(/^\/before\//, '/'), image.alt]),
                    links: [...copy.querySelectorAll('a')].map(link => link.getAttribute('href')),
                    rows: copy.querySelectorAll('tr').length
                };
            });
        }
        for (const file of reports) {
            let original;
            if (baseline && file !== 'reviews/assessment-2-mini-quiz-2026-11-10.html') {
                await page.goto(baseUrl + '/before/' + file, { waitUntil: 'load' });
                original = await content();
            }
            await page.goto(baseUrl + '/' + file, { waitUntil: 'load' });
            const current = await content();
            if (original) assert.deepEqual(current, original, file + ': all rendered text, images, rows and links survive');
            assert.ok(current.text.length > 200, file + ': populated report');
            for (const width of [320, 768, 1280]) {
                await page.setViewportSize({ width, height: 1000 });
                const layout = await page.evaluate(() => {
                    const style = getComputedStyle(document.body);
                    return {
                        background: style.backgroundColor, font: style.fontFamily, color: style.color,
                        overflow: document.documentElement.scrollWidth > innerWidth,
                        outside: [...document.querySelectorAll('main,.q-card,.summary-card,.answer-grid,.table-wrap')]
                            .filter(element => {
                                const rect = element.getBoundingClientRect();
                                return rect.right > innerWidth + 1 || rect.left < -1;
                            }).map(element => element.className || element.tagName),
                        scoreSize: document.querySelector('.score-big') ?
                            parseFloat(getComputedStyle(document.querySelector('.score-big')).fontSize) : null,
                        narrowTables: [...document.querySelectorAll('.table-wrap')].filter(wrap =>
                            wrap.clientWidth >= 700 && wrap.querySelector('table').getBoundingClientRect().width < wrap.clientWidth - 2).length,
                        linkColor: getComputedStyle(document.querySelector('.back-link,.back')).color
                    };
                });
                assert.equal(layout.background, 'rgb(13, 17, 23)', file + ': dashboard background');
                assert.equal(layout.color, 'rgb(230, 237, 243)', file + ': dashboard text');
                assert.match(layout.font, /Helvetica Neue/);
                assert.equal(layout.linkColor, 'rgb(74, 144, 217)');
                assert.equal(layout.overflow, false, file + ': no page overflow at ' + width);
                assert.equal(layout.narrowTables, 0, file + ': tables use available report width');
                assert.deepEqual(layout.outside, [], file + ': no clipped layout at ' + width);
                if (layout.scoreSize) assert.ok(layout.scoreSize <= 32, file + ': compact summary score');
                const scroll = page.locator('.table-wrap').first();
                if (await scroll.count() && await scroll.getAttribute('tabindex') === '0') {
                    await scroll.focus();
                    await page.keyboard.press('ArrowRight');
                    assert.equal(await scroll.evaluate(node => getComputedStyle(node).outlineStyle), 'solid');
                }
                if (evidence && /test-1-study-guide|assessment-2-rational|kai-assessment3/.test(file)) {
                    await page.evaluate(() => window.scrollTo(0, 0));
                    await page.screenshot({ path: path.join(evidence, path.basename(file, '.html') + '-' + width + '.png') });
                }
            }
            const source = page.locator('details').filter({ has: page.locator('img') }).first();
            if (await source.count()) {
                await source.evaluate(node => { node.open = true; });
                const image = source.locator('img').first();
                await image.scrollIntoViewIfNeeded();
                await image.evaluate(image => image.decode());
                assert.ok(await image.evaluate(image => image.naturalWidth > 0), file + ': source evidence still loads');
            }
            await page.locator('.back-link,.back').first().focus();
            await page.keyboard.press('Tab');
            const focus = await page.evaluate(() => {
                const element = document.activeElement;
                return element === document.body || getComputedStyle(element).outlineStyle !== 'none';
            });
            assert.ok(focus, file + ': keyboard focus is visible');
            await page.emulateMedia({ media: 'print' });
            assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(255, 255, 255)');
            assert.equal(await page.locator('.back-link,.back').first().isVisible(), false);
            const provenance = page.locator('.report-context p').first();
            if (await provenance.count()) assert.equal(await provenance.isVisible(), true, file + ': print includes collapsed scoring notes');
            assert.equal((await content()).text, current.text, file + ': print keeps all report text');
            await page.emulateMedia({ media: 'screen' });
        }
        assert.deepEqual(errors, [], 'No report JavaScript errors');
        assert.deepEqual(failures, [], 'No missing report resources');
        await context.close();
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
});

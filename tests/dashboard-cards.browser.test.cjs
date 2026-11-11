const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');

test('activity cards reflow, expose focus and preserve same-data graph pixels', { timeout: 180000 }, async () => {
    const baseline = process.env.MCM_CARD_BASELINE;
    const evidence = process.env.MCM_CARD_EVIDENCE;
    if (evidence) await fs.mkdir(evidence, { recursive: true });
    const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
        '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
    const server = http.createServer(async (request, response) => {
        const url = new URL(request.url, 'http://localhost');
        if (url.pathname === '/data/kai-scores-latest.json') {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end('{"mcm_scores":{}}');
            return;
        }
        const file = url.pathname === '/baseline.html' && baseline ? baseline :
            path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
        if (file !== baseline && !file.startsWith(root + path.sep)) {
            response.writeHead(403).end();
            return;
        }
        try {
            const bytes = await fs.readFile(file);
            response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
            response.end(bytes);
        } catch (error) {
            if (error.code !== 'ENOENT') console.error(error);
            response.writeHead(error.code === 'ENOENT' ? 404 : 500).end();
        }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await chromium.launch({ channel: 'msedge', headless: true });
        const baseUrl = 'http://127.0.0.1:' + server.address().port;
        for (const width of [320, 390, 768, 1280, 640]) {
            const context = await browser.newContext({
                viewport: { width, height: 1000 }, deviceScaleFactor: width === 640 ? 2 : 1,
                locale: 'en-US', timezoneId: 'America/Los_Angeles'
            });
            await context.route('https://api.github.com/**', route => route.fulfill({
                status: 404, contentType: 'application/json', body: '{}'
            }));
            await context.addInitScript(() => {
                Date.now = () => 1794268800000;
                localStorage.setItem('mcm_scores', '{}');
            });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            const graphIds = ['precalculusChartContainer', 'trendChartContainer', 'winterChartContainer'];
            async function capture(version, url) {
                await page.goto(baseUrl + url, { waitUntil: 'networkidle' });
                await page.evaluate(async () => {
                    for (const section of document.querySelectorAll('.dash-section')) section.open = true;
                    await document.fonts.ready;
                    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                });
                const images = [];
                for (const id of graphIds) {
                    const markup = await page.locator('#' + id).innerHTML();
                    if (evidence) {
                        const graph = await page.locator('#' + id).evaluate(element => ({
                            html: element.innerHTML, rect: element.getBoundingClientRect().toJSON()
                        }));
                        await fs.writeFile(path.join(evidence, `${version}-${width}-${id}.json`), JSON.stringify(graph, null, 2));
                    }
                    // Normalize only capture position: taller cards move later graphs far down
                    // the page, where Chromium raster tiles otherwise introduce rounding noise.
                    await page.locator('#' + id).evaluate(element => {
                        const rect = element.getBoundingClientRect();
                        const background = getComputedStyle(element.parentElement).backgroundColor;
                        Object.assign(element.style, {
                            position: 'fixed', top: '20px', left: rect.left + 'px',
                            width: rect.width + 'px', zIndex: '10000', backgroundColor: background
                        });
                    });
                    const bytes = await page.locator('#' + id).screenshot();
                    await page.locator('#' + id).evaluate(element => {
                        element.removeAttribute('style');
                    });
                    images.push({ bytes, markup });
                    if (evidence) await fs.writeFile(path.join(evidence, `${version}-${width}-${id}.png`), bytes);
                }
                if (version === 'before' && evidence) {
                    for (const id of ['precalculusGrid', 'springGrid', 'winterTestGrid']) {
                        await page.locator('#' + id).screenshot({ path: path.join(evidence, `before-cards-${width}-${id}.png`) });
                    }
                }
                return images;
            }
            const before = baseline ? await capture('before', '/baseline.html') : null;
            const after = await capture('after', '/index.html');
            if (before) {
                for (const [index, image] of after.entries()) {
                    assert.equal(image.markup, before[index].markup, `Graph markup: ${width}px ${graphIds[index]}`);
                    const difference = await page.evaluate(async sources => {
                        const images = [];
                        for (const source of sources) {
                            const image = new Image();
                            image.src = source;
                            await image.decode();
                            const canvas = document.createElement('canvas');
                            canvas.width = image.width;
                            canvas.height = image.height;
                            const context = canvas.getContext('2d');
                            context.drawImage(image, 0, 0);
                            images.push(context.getImageData(0, 0, image.width, image.height));
                        }
                        if (images[0].width !== images[1].width || images[0].height !== images[1].height) return Infinity;
                        let maximum = 0;
                        for (let i = 0; i < images[0].data.length; i++) {
                            maximum = Math.max(maximum, Math.abs(images[0].data[i] - images[1].data[i]));
                        }
                        return maximum;
                    }, [before[index].bytes, image.bytes].map(bytes => 'data:image/png;base64,' + bytes.toString('base64')));
                    // Chromium can round a raster channel by one level with identical SVG and geometry.
                    assert.ok(difference <= 1, `Graph raster changed: ${width}px ${graphIds[index]}, max channel delta ${difference}`);
                }
            }
            const result = await page.evaluate(() => {
                const cards = [...document.querySelectorAll('.activity-card')];
                const overflow = cards.filter(card => card.scrollWidth > card.clientWidth + 1).map(card => card.textContent);
                const titles = cards.filter(card => {
                    const title = card.querySelector('.activity-card__title').getBoundingClientRect();
                    const score = card.querySelector('.activity-card__score').getBoundingClientRect();
                    return title.bottom > score.top;
                });
                return {
                    count: cards.length, overflow, collisions: titles.length,
                    pageOverflow: document.documentElement.scrollWidth > innerWidth,
                    fallCount: document.querySelectorAll('#precalculusGrid .activity-card').length,
                    springCount: document.querySelectorAll('#springGrid .activity-card').length,
                    winterCount: document.querySelectorAll('#winterTestGrid .activity-card').length,
                    a1: document.querySelector('#teacherAssessment1Score').textContent,
                    a2: document.querySelector('#teacherAssessment2Score').textContent,
                    miniQuiz: document.querySelector('#assessment2MiniQuizScore').textContent,
                    inlineStyles: cards.some(card => card.hasAttribute('style')),
                    nestedControls: cards.some(card => card.querySelector('a,button,input')),
                    pdf: {
                        target: document.querySelector('.activity-card[href$=".pdf"]').target,
                        text: document.querySelector('.activity-card[href$=".pdf"]').textContent
                    }
                };
            });
            assert.deepEqual(result.overflow, [], `${width}px overflowing cards`);
            assert.equal(result.collisions, 0);
            assert.equal(result.pageOverflow, false);
            assert.equal(result.fallCount, 6);
            assert.ok(result.springCount > 10);
            assert.equal(result.winterCount, 8);
            assert.equal(result.a1, '72.6%');
            assert.equal(result.a2, '46.1%');
            assert.equal(result.miniQuiz, '65.5%');
            assert.equal(result.inlineStyles, false);
            assert.equal(result.nestedControls, false);
            assert.equal(result.pdf.target, '_blank');
            assert.match(result.pdf.text, /Open PDF \(new tab\)/);
            const first = page.locator('.activity-card').first();
            await first.focus();
            await page.keyboard.press('Tab');
            assert.equal(await page.evaluate(() => document.activeElement.matches('.activity-card')), true);
            const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
            assert.equal(outline, 'solid');
            if (evidence) {
                for (const id of ['precalculusGrid', 'springGrid', 'winterTestGrid']) {
                    await page.locator('#' + id).screenshot({ path: path.join(evidence, `cards-${width}-${id}.png`) });
                }
                await page.locator('.activity-card:focus').screenshot({ path: path.join(evidence, `focus-${width}.png`) });
            }
            assert.deepEqual(errors, []);
            await context.close();
        }
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
});

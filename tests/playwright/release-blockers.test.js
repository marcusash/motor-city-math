const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
let server;
let base;

test.beforeAll(async () => {
    const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
        '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
    server = http.createServer(async (request, response) => {
        const file = path.resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
        if (!file.startsWith(root + path.sep)) return response.writeHead(403).end();
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
    base = 'http://127.0.0.1:' + server.address().port;
});

test.afterAll(async () => {
    if (server) await new Promise(resolve => server.close(resolve));
});

test.beforeEach(async ({ page }) => {
    await page.route('**/*', route => {
        const url = new URL(route.request().url());
        return url.hostname === '127.0.0.1' ? route.continue() : route.abort();
    });
});

test('archived final exam stays read-only and its script preserves the complete answer key', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/final_exam_251123.html');
    await expect(page.locator('body')).toHaveClass('archived');
    await expect(page.locator('[onclick="showFinalExamAnswerKey()"]')).toBeAttached();
    await expect(page.locator('[onclick="showFinalExamAnswerKey()"]')).toBeHidden();
    const html = await page.evaluate(() => {
        let captured;
        window.showAnswerKey = value => { captured = value; };
        window.showFinalExamAnswerKey();
        return captured;
    });
    expect(html).toContain('<strong>Q18:</strong>');
    expect((html.match(/class="answer-item"/g) || []).length).toBe(18);
    expect(errors).toEqual([]);
});

test('RP12 math renders and the generated print document retains exact tokenized colors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/exam.html?file=retake-practice-12');
    await page.waitForFunction(() => window.examData && window.examData.questions);
    await expect(page.locator('.katex').first()).toBeVisible();
    await expect(page.locator('.katex-error')).toHaveCount(0);
    const html = await page.evaluate(() => {
        let captured;
        window.open = () => ({ document: { write(value) { captured = value; }, close() {} } });
        window.printExam();
        return captured;
    });
    expect(html.toLowerCase()).toContain('stroke="#e0e0e0"');
    expect(html.toLowerCase()).toContain('background:#f5f5f5');
    expect(html).not.toContain('undefined');
    expect(errors).toEqual([]);
});

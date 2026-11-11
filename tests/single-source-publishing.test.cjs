const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');

test('all retired publishers fail explicitly without invoking the former sync', () => {
    for (const file of ['scripts/publish.cjs', 'scripts/publish-local.cjs', 'scripts/scripts/publish.cjs']) {
        const result = spawnSync(process.execPath, [path.join(root, file), '--dry-run'], {
            cwd: root, encoding: 'utf8',
            env: { ...process.env, MOTOR_CITY_MATH_TOKEN: 'must-not-be-used' }
        });
        assert.ifError(result.error);
        assert.equal(result.status, 1, file);
        assert.equal(result.stdout, '');
        assert.match(result.stderr, /Retired: cross-repository publishing is disabled/);
        assert.match(result.stderr, /marcusash\/motor-city-math/);
        assert.doesNotMatch(result.stderr, /must-not-be-used/);
        const source = fs.readFileSync(path.join(root, file), 'utf8');
        assert.doesNotMatch(source, /child_process|execSync|spawnSync|rmSync|copyFileSync|cpSync|fetch\(/);
    }
});

test('the runbook preserves review, release gates, receipts and original workspaces', () => {
    const text = fs.readFileSync(path.join(root, 'docs/publish-runbook.md'), 'utf8');
    for (const required of ['only working and publishing repository', 'feature branches',
        'do not push directly to `master`', 'node tests/release-readiness-check.js',
        'stop before release', 'important file bytes', 'Keep original workspaces']) {
        assert.ok(text.includes(required), required);
    }
    assert.match(fs.readFileSync(path.join(root, 'docs/docs/publish-runbook.md'), 'utf8'),
        /\.\.\/publish-runbook\.md/);
});

test('the artifact index retains all approved design and text-only review previews', () => {
    const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
    const collections = [
        ['artifacts/report-style-2026-11-10', 9],
        ['artifacts/practice-review-2026-11-10', 7]
    ];
    for (const [directory, count] of collections) {
        assert.ok(readme.includes(directory + '/'));
        const files = fs.readdirSync(path.join(root, directory));
        assert.equal(files.length, count);
        for (const file of files) {
            assert.ok(file.endsWith('.png'));
            const bytes = fs.readFileSync(path.join(root, directory, file));
            assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
        }
    }
    const pdf = 'reviews/assessment-2-mini-quiz-2026-11-10.pdf';
    assert.ok(readme.includes(pdf));
    assert.equal(fs.readFileSync(path.join(root, pdf)).subarray(0, 5).toString(), '%PDF-');
});

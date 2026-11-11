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

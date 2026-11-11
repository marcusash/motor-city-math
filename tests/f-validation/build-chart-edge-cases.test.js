'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');
const start = source.indexOf('    function renderTrendChart(');
const end = source.indexOf('    function buildChart()', start);
assert.ok(start >= 0 && end > start, 'Actual chart renderer boundaries must exist');
const context = {};
vm.runInNewContext(source.slice(start, end), context);
let passed = 0;
function check(name, run) {
    run();
    passed++;
    console.log('PASS: ' + name);
}
function render(values, compact = false) {
    const container = {};
    context.renderTrendChart(container, values.map((fa, i) => ({ fa, label: 'Test ' + (i + 1) })), compact, false);
    return container.innerHTML;
}

check('empty scores show the actual empty state instead of invalid SVG', () => {
    const html = render([]);
    assert.match(html, /trend-empty/);
    assert.doesNotMatch(html, /<svg/);
});
check('a missing container is harmless', () => context.renderTrendChart(null, [], false, false));
for (const score of [0, 40, 50, 79.99, 80, 90, 93, 100]) {
    check('rendered score ' + score + ' follows the current broken-axis geometry', () => {
        const html = render([score]);
        const match = html.match(/<circle cx="(50)" cy="([^"]+)"/);
        assert.ok(match);
        const expected = score >= 80
            ? 14 + (100 - score) / 20 * (94 * 0.667)
            : 14 + 94 * 0.667 + (80 - score) / 80 * (94 * 0.333);
        assert.ok(Math.abs(Number(match[2]) - expected) < 1e-8);
        assert.ok(Number(match[2]) >= 14 - 1e-8 && Number(match[2]) <= 108 + 1e-8);
        assert.match(html, new RegExp('>' + score + '%</text>'));
        assert.doesNotMatch(html, /NaN|Infinity/);
    });
}
check('single-point chart uses the actual first-position anchor', () => {
    assert.match(render([80], true), /<circle cx="50"/);
});
check('multiple scores render connected paths and individual labels', () => {
    const html = render([50, 80, 93]);
    assert.equal((html.match(/<path /g) || []).length, 2);
    assert.match(html, /Score progress chart showing 3 tests/);
    assert.match(html, /Test 1/);
    assert.match(html, /Test 3/);
});
check('chart has a singular accessible description for one score', () => {
    assert.match(render([0]), /role="img" aria-label="Score progress chart showing 1 test"/);
});
check('scores below 80 preserve the court zone and dropping-line signal', () => {
    const html = render([90, 50]);
    assert.match(html, /FOUL TROUBLE/);
    assert.match(html, /stroke-dasharray="6 4"/);
});
check('grade reference lines remain visible', () => {
    const html = render([80]);
    assert.match(html, />A<\/text>/);
    assert.match(html, />B<\/text>/);
});
check('green score highlight begins at 93, not 90', () => {
    assert.doesNotMatch(render([90]), /r="2" fill="#3FB950"/);
    assert.match(render([93]), /r="2" fill="#3FB950"/);
});
console.log(passed + ' checks: ' + passed + ' passed, 0 failed');

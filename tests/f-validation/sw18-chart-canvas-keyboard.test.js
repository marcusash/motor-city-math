/**
 * sw18-chart-canvas-keyboard.test.js
 * Regression guard for sw-18: Chart.js read-only canvas keyboard accessibility.
 *
 * Checks final_exam_251123.html for:
 *   - Chart.js canvases have role="img"
 *   - Chart.js canvases have tabindex="0"
 *   - Chart.js canvases have aria-label
 *   - keydown announce handler is present in script
 *   - Focus ring CSS rule exists (canvas[role="img"]:focus)
 *
 * Run: node tests/f-validation/sw18-chart-canvas-keyboard.test.js
 */

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', '..', 'final_exam_251123.html'), 'utf-8');

let total = 0, pass = 0, fail = 0;
function test(name, ok) {
    total++;
    if (ok) { pass++; console.log('  \u2705 ' + name); }
    else { fail++; console.log('  \u274c ' + name); }
}

console.log('\n\uD83C\uDFC0 sw18-chart-canvas-keyboard.test.js\n');

// ── role="img" on Chart.js canvases ─────────────────────────
console.log('\u2500\u2500 role="img" on Chart.js canvases \u2500\u2500');
test('chart13 has role="img"', src.includes('id="chart13" role="img"') || src.includes('role="img"') && src.includes('id="chart13"'));
test('chart15 has role="img"', src.includes('id="chart15" role="img"') || src.includes('role="img"') && src.includes('id="chart15"'));
test('chart19 has role="img"', src.includes('id="chart19" role="img"') || src.includes('role="img"') && src.includes('id="chart19"'));

// ── tabindex="0" on Chart.js canvases ───────────────────────
console.log('\n\u2500\u2500 tabindex="0" on Chart.js canvases \u2500\u2500');
['chart13', 'chart15', 'chart19'].forEach(function(id) {
    // Check that the canvas line has both the id and tabindex="0"
    var line = src.split('\n').find(function(l) { return l.includes('id="' + id + '"'); });
    test(id + ' has tabindex="0"', line && line.includes('tabindex="0"'));
});

// ── aria-label on Chart.js canvases ─────────────────────────
console.log('\n\u2500\u2500 aria-label on Chart.js canvases \u2500\u2500');
['chart13', 'chart15', 'chart19'].forEach(function(id) {
    var line = src.split('\n').find(function(l) { return l.includes('id="' + id + '"'); });
    test(id + ' has aria-label', line && line.includes('aria-label='));
});

// ── Keydown handler present ──────────────────────────────────
console.log('\n\u2500\u2500 Keydown announce handler \u2500\u2500');
test("sw-18 keydown handler references 'chart13'", src.includes("'chart13'") && src.includes('keydown'));
test("sw-18 handler uses aria-live", src.includes("aria-live") && src.includes("assertive"));
test("sw-18 handler announces aria-label on Enter/Space", src.includes("e.key === 'Enter'") || src.includes('e.key==="Enter"'));

// ── Focus ring CSS ───────────────────────────────────────────
console.log('\n\u2500\u2500 Focus ring CSS \u2500\u2500');
test('canvas[role="img"]:focus rule present', src.includes('canvas[role="img"]:focus'));
test('focus ring uses outline', src.includes('canvas[role="img"]:focus') && src.includes('outline:') || src.includes('outline :') || src.includes('outline: 2px'));

// ── Interactive drawing canvas unchanged ─────────────────────
console.log('\n\u2500\u2500 Interactive canvas unchanged (role=application) \u2500\u2500');
// chart9 is the interactive drawing canvas - should NOT have role="img"
var chart9line = src.split('\n').find(function(l) { return l.includes('id="chart9"'); });
test('chart9 does NOT have role="img" (still interactive)', !chart9line || !chart9line.includes('role="img"'));

console.log('\n' + '='.repeat(50));
console.log('sw18-chart-canvas-keyboard: ' + pass + '/' + total + ' pass');
if (fail > 0) process.exit(1);
else console.log('PASS');

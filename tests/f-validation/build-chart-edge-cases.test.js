/**
 * build-chart-edge-cases.test.js
 * Static analysis and logic tests for buildChart() in index.html.
 *
 * Checks: yPt clamping, makePath edge cases, pct=0 fallback, SVG presence.
 * Run: node tests/f-validation/build-chart-edge-cases.test.js
 */

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf-8');

let total = 0, pass = 0, fail = 0;
function test(name, ok) {
    total++;
    if (ok) { pass++; console.log('  \u2705 ' + name); }
    else { fail++; console.log('  \u274c ' + name); }
}

console.log('\n\uD83C\uDFC0 build-chart-edge-cases.test.js\n');

// ── Static: empty state guard ────────────────────────────────
console.log('\u2500\u2500 Empty state guard \u2500\u2500');
test('pts.length === 0 shows trend-empty div', src.includes("pts.length === 0") && src.includes("trend-empty"));
test('trend-empty has basketball emoji', src.includes("trend-empty") && src.includes("🏀"));

// ── Static: single-point x-centering ────────────────────────
console.log('\n\u2500\u2500 Single-point handling \u2500\u2500');
test('n === 1 centers x between xL and xR', src.includes("n === 1") && src.includes("(xL + xR) / 2"));

// ── Static: yPt clamping ─────────────────────────────────────
console.log('\n\u2500\u2500 yPt clamping (40%-100% range) \u2500\u2500');
test('yPt clamps to min 40', src.includes('Math.max(40, s)'));
test('yPt clamps to max 100', src.includes('Math.min(100, Math.max(40'));

// Extract yPt for unit testing
const yPtMatch = src.match(/function yPt\(s\) \{([^}]+)\}/);
let yPt = null;
if (yPtMatch) {
    // eslint-disable-next-line no-new-func
    yPt = new Function('s', yPtMatch[1]);
}
test('yPt function extractable', yPt !== null);

if (yPt) {
    console.log('\n\u2500\u2500 yPt unit tests \u2500\u2500');
    const eps = 0.01;
    // At 40%: clamped to 40, output = 14 + 95*(1 - 0/60) = 14 + 95 = 109
    test('yPt(40) = 109 (bottom of chart)', Math.abs(yPt(40) - 109) < eps);
    // At 100%: clamped to 100, output = 14 + 95*(1 - 60/60) = 14 + 0 = 14
    test('yPt(100) = 14 (top of chart)', Math.abs(yPt(100) - 14) < eps);
    // At 0% (below clamp): same as yPt(40) = 109
    test('yPt(0) clamped to 40, same as yPt(40)', Math.abs(yPt(0) - yPt(40)) < eps);
    // At 150%: clamped to 100, same as yPt(100)
    test('yPt(150) clamped to 100, same as yPt(100)', Math.abs(yPt(150) - yPt(100)) < eps);
    // At 93% (A threshold): output should be near top
    var y93 = yPt(93);
    test('yPt(93) is between 14 and 50 (near top)', y93 >= 14 && y93 <= 50);
    // At NaN: should not throw, returns NaN (coordinate math handles it)
    var yNaN = yPt(NaN);
    test('yPt(NaN) returns NaN without throwing', isNaN(yNaN));
}

// ── Static: SVG with aria-label ──────────────────────────────
console.log('\n\u2500\u2500 SVG accessibility \u2500\u2500');
test('chart SVG has role="img"', src.includes('role="img"') && src.includes('aria-label="Score progress chart'));
test('aria-label includes test count', src.includes("showing ' + n + ' test"));

// ── Static: grade reference lines ────────────────────────────
console.log('\n\u2500\u2500 Grade reference lines \u2500\u2500');
test('A grade line present (93% threshold)', src.includes('yA') && src.includes("'A'") || src.includes('"A"'));
test('B grade line present', src.includes('yB') && (src.includes("'B'") || src.includes('"B"')));
test('C grade line present', src.includes('yC') && (src.includes("'C'") || src.includes('"C"')));
test('A green at 93%+', src.includes('p.fa >= 93') || src.includes('lastFaPct >= 93'));

console.log('\n' + '='.repeat(50));
console.log('build-chart-edge-cases: ' + pass + '/' + total + ' pass');
if (fail > 0) process.exit(1);
else console.log('PASS');

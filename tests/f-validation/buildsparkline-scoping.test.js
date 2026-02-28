// Regression: buildSparkline() variable scoping fix
// Prior bug: tkCorrect/tkRed/tkBlue referenced from buildChart() scope (ReferenceError)
// Fix: variables now declared locally inside buildSparkline with getComputedStyle

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} buildsparkline-scoping.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
const start = src.indexOf('function buildSparkline(');
test('buildSparkline function exists', start !== -1);
const fn = start !== -1 ? src.substring(start, start + 1500) : '';

// ── Local variable declarations ────────────────────────────────
console.log('\u2500\u2500 CSS token variables declared locally \u2500\u2500');
test('tkBlue declared inside buildSparkline', fn.includes('var tkBlue'));
test('tkCorrect declared inside buildSparkline', fn.includes('var tkCorrect'));
test('tkRed declared inside buildSparkline', fn.includes('var tkRed'));
test('getComputedStyle used to resolve tokens', fn.includes('getComputedStyle(document.documentElement)'));

// ── Fallback values present ────────────────────────────────────
console.log('\n\u2500\u2500 Fallback hex values present \u2500\u2500');
test('tkBlue has fallback hex', fn.includes('#1D42BA'));
test('tkCorrect has fallback hex', fn.includes('#1B7D3A'));
test('tkRed has fallback hex', fn.includes('#C8102E'));

// ── Null/short-array guard ─────────────────────────────────────
console.log('\n\u2500\u2500 Null/empty guard \u2500\u2500');
test('null values guard', fn.includes('!values'));
test('short array guard (< 2)', fn.includes('values.length < 2'));

// ── SVG output ─────────────────────────────────────────────────
console.log('\n\u2500\u2500 SVG output \u2500\u2500');
test('returns SVG string', fn.includes("'<svg") || fn.includes('"<svg'));
test('SVG viewBox set', fn.includes('viewBox'));

console.log('\n' + '='.repeat(50));
console.log('buildsparkline-scoping: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

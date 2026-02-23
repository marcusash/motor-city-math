// CSS custom property count regression test
// Locks the token count at 63 (±5). Prevents accidental token removal or bloat.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-custom-property-count.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Count all --token-name: declarations
var tokenDeclarations = src.match(/--[a-z][a-z0-9-]+\s*:/g) || [];
var uniqueTokens = Array.from(new Set(tokenDeclarations.map(function(t) { return t.replace(/\s*:$/, '').trim(); })));

console.log('\u2500\u2500 Token inventory \u2500\u2500');
console.log('  Total declarations: ' + tokenDeclarations.length);
console.log('  Unique token names: ' + uniqueTokens.length);

// 1. Token count is in expected range
var MIN = 58, MAX = 68;
test('Token count in range ' + MIN + '-' + MAX + ' (baseline 63)', tokenDeclarations.length >= MIN && tokenDeclarations.length <= MAX);

// 2. Core brand tokens present (Pistons palette)
test('--accent-red defined (Pistons #C8102E)', src.includes('--accent-red'));
test('--accent-blue defined (Pistons #1D42BA)', src.includes('--accent-blue'));
test('--bg-page defined', src.includes('--bg-page'));

// 3. Key text tokens present
test('--text-primary defined', src.includes('--text-primary'));
test('--text-secondary defined', src.includes('--text-secondary'));

// 4. Feedback tokens present
test('--color-correct defined', src.includes('--color-correct'));
test('--color-incorrect defined', src.includes('--color-incorrect'));

console.log('\n  Sample tokens: ' + uniqueTokens.slice(0, 8).join(', '));

console.log('\n' + '='.repeat(50));
console.log('css-custom-property-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

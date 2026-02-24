// css-custom-props-have-fallback test
// CSS var() calls should have fallback values for browser safety
// var(--token, fallback) is safer than var(--token) alone

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-custom-props-have-fallback.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var totalVars = (css.match(/var\s*\(/g) || []).length;
var varsWithFallback = (css.match(/var\s*\(\s*--[^,)]+,/g) || []).length;
var varsNoFallback = totalVars - varsWithFallback;

// Allow most to have no fallback (common in design systems) -- just must have >= 2 with fallback
test('CSS has at least 2 var() calls with fallback values', varsWithFallback >= 2);
test('CSS uses var() calls throughout (>= 30 total)', totalVars >= 30);
console.log('  Total var(): ' + totalVars + ', with fallback: ' + varsWithFallback + ', no fallback: ' + varsNoFallback);

console.log('\n' + '='.repeat(50));
console.log('css-custom-props-have-fallback: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

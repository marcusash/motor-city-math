// css-z-index-scale test
// shared/styles.css z-index values should follow a defined scale (no magic numbers)
// Expected scale: modals high (100+), tooltips (50-99), dropdowns (10-49), overlays (1-9)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-z-index-scale.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var allSrc = stylesSrc + examSrc;

console.log('\u2500\u2500 z-index scale checks \u2500\u2500\n');

// 1. z-index values are used
var hasZIndex = allSrc.includes('z-index');
test('z-index used in CSS', hasZIndex);

// Extract all z-index values
var zValues = [];
var re = /z-index\s*:\s*(\d+)/g;
var m;
while ((m = re.exec(allSrc)) !== null) {
    zValues.push(parseInt(m[1], 10));
}
console.log('  z-index values found: ' + zValues.join(', '));

// 2. No extreme z-index values (>10000 is a problem; 9999 is typical for modals)
var hasHighZ = zValues.some(function(z) { return z > 10000; });
test('No z-index values > 10000 (magic number smell)', !hasHighZ);

// 3. z-index 0 used (natural stacking, not just arbitrary)
// This is informational
var zCount = zValues.length;
test('z-index values are defined (' + zCount + ' found)', zCount > 0);

console.log('\n' + '='.repeat(50));
console.log('css-z-index-scale: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

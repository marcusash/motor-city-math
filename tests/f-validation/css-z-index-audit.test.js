// CSS z-index audit test
// z-index values must be reasonable (not 9999999 escalation wars)
// MCM spec: z-index values should be in documented layers (0, 10, 100, 1000, 9999)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-z-index-audit.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 CSS z-index audit \u2500\u2500\n');

// Find all z-index values
var re = /z-index\s*:\s*(\d+)/g;
var m;
var zIndexValues = [];
var combined = cssSrc + '\n' + examSrc;
while ((m = re.exec(combined)) !== null) {
    zIndexValues.push(parseInt(m[1], 10));
}

console.log('  z-index values found: ' + zIndexValues.join(', '));

test('At least 1 z-index rule exists', zIndexValues.length >= 1);

// No unreasonably high z-index (> 10000 is a code smell)
var highZIndex = zIndexValues.filter(function(z) { return z > 10000; });
test('No z-index > 10000 (no escalation wars)', highZIndex.length === 0);
if (highZIndex.length) console.log('  ! Suspicious z-index values: ' + highZIndex.join(', '));

// Max z-index is reasonable
var maxZ = Math.max.apply(null, zIndexValues);
test('Max z-index <= 9999 (sane layer system)', maxZ <= 9999);
console.log('  Max z-index: ' + maxZ);

console.log('\n' + '='.repeat(50));
console.log('css-z-index-audit: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

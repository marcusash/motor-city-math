// css-z-index-range test
// CSS z-index values should be in a reasonable range (0-1000)
// Very high z-index values (99999) indicate stacking context confusion

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-z-index-range.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var zIndexValues = [];
var re = /z-index\s*:\s*(\d+)/g;
var m;
while ((m = re.exec(css)) !== null) {
    zIndexValues.push(parseInt(m[1], 10));
}

var maxZ = zIndexValues.length ? Math.max.apply(null, zIndexValues) : 0;
var hasHighZ = zIndexValues.some(function(z) { return z > 10000; });

test('CSS has z-index values defined', zIndexValues.length >= 1);
test('Max z-index is <= 10000 (no magic numbers)', !hasHighZ);
console.log('  z-index values: [' + zIndexValues.join(', ') + '], max: ' + maxZ);

console.log('\n' + '='.repeat(50));
console.log('css-z-index-range: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// css-no-negative-z-index test
// Negative z-index values can hide content behind the page background
// This causes invisible elements that are still in the tab order (a11y bug)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-negative-z-index.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var negativeZIndex = [];
var re = /z-index\s*:\s*(-\d+)/g;
var m;
while ((m = re.exec(css)) !== null) {
    negativeZIndex.push('z-index: ' + m[1]);
}

test('No negative z-index values (' + negativeZIndex.length + ' violations)', negativeZIndex.length === 0);
if (negativeZIndex.length) negativeZIndex.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('css-no-negative-z-index: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

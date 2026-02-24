// css-grid-not-used test
// CSS should not rely on display: grid as it has less cross-browser support
// in older WebViews that Kai's Chromebook may use; flexbox is preferred

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-grid-not-used.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var gridCount = (css.match(/display\s*:\s*grid/g) || []).length;
var MAX_GRID = 3;

test('CSS uses display:grid sparingly (<= ' + MAX_GRID + ' occurrences, actual: ' + gridCount + ')', gridCount <= MAX_GRID);
if (gridCount > MAX_GRID) {
    console.log('    ! ' + gridCount + ' grid usages found (prefer flexbox for Chromebook compat)');
}

console.log('\n' + '='.repeat(50));
console.log('css-grid-not-used: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

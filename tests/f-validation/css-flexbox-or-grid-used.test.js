// css-flexbox-or-grid-used test
// shared/styles.css must use flexbox or CSS grid for layout
// Float-based layouts are inaccessible and fragile

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-flexbox-or-grid-used.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var flexCount = (css.match(/display\s*:\s*flex\b/g) || []).length;
var gridCount = (css.match(/display\s*:\s*grid\b/g) || []).length;
var floatCount = (css.match(/\bfloat\s*:\s*(left|right)\b/g) || []).length;

test('CSS uses flexbox or grid for layout (flex: ' + flexCount + ', grid: ' + gridCount + ')', flexCount + gridCount >= 5);
test('CSS avoids float-based layout (float usages: ' + floatCount + ')', floatCount === 0);

console.log('\n' + '='.repeat(50));
console.log('css-flexbox-or-grid-used: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

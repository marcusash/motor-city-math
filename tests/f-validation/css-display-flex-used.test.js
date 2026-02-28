// css-display-flex-used test
// CSS must use flexbox (display: flex) for layout
// Without flexbox, responsive alignment falls back to old float-based hacks

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-display-flex-used.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var flexCount = (css.match(/display\s*:\s*flex/g) || []).length;
test('CSS uses display: flex (' + flexCount + ' occurrences)', flexCount > 0);

console.log('\n' + '='.repeat(50));
console.log('css-display-flex-used: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

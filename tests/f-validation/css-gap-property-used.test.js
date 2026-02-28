// css-gap-property-used test
// CSS should use the gap property (not margin tricks) for flex/grid spacing
// gap is cleaner and avoids first/last child margin hacks

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-gap-property-used.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var gapCount = (css.match(/\bgap\s*:/g) || []).length;

test('CSS uses the gap property (' + gapCount + ' occurrences)', gapCount > 0);

console.log('\n' + '='.repeat(50));
console.log('css-gap-property-used: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

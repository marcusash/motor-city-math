// css-font-weight-defined test
// CSS should define at least one font-weight rule for text hierarchy
// Without font-weight variation, all text appears equally weighted (poor hierarchy)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-font-weight-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var weightCount = (css.match(/font-weight\s*:/g) || []).length;
test('CSS defines font-weight rules (' + weightCount + ' found)', weightCount > 0);

console.log('\n' + '='.repeat(50));
console.log('css-font-weight-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

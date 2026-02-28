// css-font-weight-bold-defined test
// CSS should define bold/700 font-weight for emphasis elements (headers, labels)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-font-weight-bold-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasBold = /font-weight\s*:\s*(bold|700|600)/.test(css);
var count = (css.match(/font-weight\s*:\s*(bold|700|600)/g) || []).length;

test('CSS defines bold/700/600 font-weight (count: ' + count + ')', hasBold);

console.log('\n' + '='.repeat(50));
console.log('css-font-weight-bold-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

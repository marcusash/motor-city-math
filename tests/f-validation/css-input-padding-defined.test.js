// css-input-padding-defined test
// CSS must define padding for input elements (accessibility + touch targets)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-input-padding-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// CSS must have a padding rule scoped to inputs
var hasInputPadding = /input\s*\{[^}]*padding\s*:/i.test(css) || /input[^{]*\{[^}]*padding\s*:/i.test(css);

test('CSS defines padding for input elements', hasInputPadding);

console.log('\n' + '='.repeat(50));
console.log('css-input-padding-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

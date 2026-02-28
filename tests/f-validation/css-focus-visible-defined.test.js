// css-focus-visible-defined test
// shared/styles.css must use :focus-visible for keyboard focus indicators (not just :focus)
// This avoids showing focus rings on mouse clicks (better UX)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-focus-visible-defined.test.js\n');

var f = path.join(__dirname, '../../shared/styles.css');
var css = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Focus state CSS checks \u2500\u2500\n');

var hasFocusVisible = css.includes(':focus-visible');
var focusCount = (css.match(/:focus\b/g) || []).length;

test('CSS uses :focus-visible for keyboard focus', hasFocusVisible);
test('CSS has limited raw :focus rules (<=10)', focusCount <= 10);
console.log('  Raw :focus count: ' + focusCount);

console.log('\n' + '='.repeat(50));
console.log('css-focus-visible-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// css-cursor-pointer-buttons test
// shared/styles.css must define cursor:pointer for clickable interactive elements
// This ensures WCAG 2.1 pointer usability and standard browser affordance

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-cursor-pointer-buttons.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 cursor:pointer checks \u2500\u2500\n');

var cursorPointerCount = (css.match(/cursor\s*:\s*pointer/g) || []).length;

test('CSS defines cursor:pointer at least once', cursorPointerCount >= 1);
test('CSS defines cursor:pointer multiple times (buttons + links + interactive)', cursorPointerCount >= 2);

console.log('  cursor:pointer declarations found: ' + cursorPointerCount);

console.log('\n' + '='.repeat(50));
console.log('css-cursor-pointer-buttons: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

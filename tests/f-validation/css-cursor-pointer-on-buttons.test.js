// css-cursor-pointer-on-buttons test
// Buttons and clickable elements must have cursor:pointer
// Without it, users don't get visual affordance of clickability

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-cursor-pointer-on-buttons.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasCursorPointer = /cursor\s*:\s*pointer/.test(css);
var count = (css.match(/cursor\s*:\s*pointer/g) || []).length;

test('CSS defines cursor:pointer', hasCursorPointer);
test('cursor:pointer used multiple times (>= 2)', count >= 2);
console.log('  cursor:pointer count: ' + count);

console.log('\n' + '='.repeat(50));
console.log('css-cursor-pointer-on-buttons: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

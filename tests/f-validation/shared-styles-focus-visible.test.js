// shared-styles-focus-visible test
// shared/styles.css must use :focus-visible, not :focus
// :focus creates ugly focus rings on mouse click; :focus-visible is WCAG-correct

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-focus-visible.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Focus visible checks \u2500\u2500\n');

// 1. :focus-visible is used (WCAG 2.4.7 modern approach)
var hasFocusVisible = stylesSrc.includes(':focus-visible');
test(':focus-visible used in shared/styles.css', hasFocusVisible);

// 2. :focus alone (without -visible) is used sparingly (<=3 times)
var focusCount = (stylesSrc.match(/:focus(?!-visible)/g) || []).length;
test(':focus (without -visible) used sparingly (<=10 times): ' + focusCount, focusCount <= 10);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-focus-visible: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// css-input-focus-ring test
// Input elements must have visible focus ring (not outline:none without replacement)
// Critical for keyboard-only users

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-input-focus-ring.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Input focus ring checks \u2500\u2500\n');

// Check that if outline:none appears, there's a compensating focus style
var outlineNoneCount = (css.match(/outline\s*:\s*none/g) || []).length;
var outlineZeroCount = (css.match(/outline\s*:\s*0[^\.]/g) || []).length;
var hasFocusVisible = css.includes(':focus-visible');
var hasFocusOutline = /outline\s*:\s*[^none0]/.test(css);

// Acceptable: outline removed only when :focus-visible provides alternative
var outlineSuppressed = outlineNoneCount + outlineZeroCount;
test('CSS provides :focus-visible ring (WCAG 2.4.7)', hasFocusVisible);
test('When outline is suppressed, focus-visible replacement exists', outlineSuppressed === 0 || hasFocusVisible);
test('CSS has at least one non-zero outline or box-shadow for focus', hasFocusOutline || css.includes('box-shadow') && hasFocusVisible);

console.log('  outline:none count: ' + outlineNoneCount + ', :focus-visible defined: ' + hasFocusVisible);

console.log('\n' + '='.repeat(50));
console.log('css-input-focus-ring: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

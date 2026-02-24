// css-no-outline-none-without-focus-visible test
// outline: none on :focus without :focus-visible is an a11y violation
// Removes keyboard focus indicator for all users (WCAG 2.4.7)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-outline-none-without-focus-visible.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// If outline:none on :focus exists, :focus-visible must also be defined
var hasFocusOutlineNone = /:focus\b[^{]*\{[^}]*outline\s*:\s*none/s.test(css);
var hasFocusVisible = /:focus-visible/.test(css);

if (hasFocusOutlineNone) {
    test(':focus outline:none requires :focus-visible to be defined', hasFocusVisible);
} else {
    test('No unsafe :focus outline:none found (safe)', true);
}

console.log('\n' + '='.repeat(50));
console.log('css-no-outline-none-without-focus-visible: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

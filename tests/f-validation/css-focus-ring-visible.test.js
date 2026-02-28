// css-focus-ring-visible test
// Focus ring must be visible in styles.css -- not removed with outline:none
// WCAG 2.4.7 requires visible focus indicators

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-focus-ring-visible.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Focus ring checks \u2500\u2500\n');

// No blanket outline:0 or outline:none without :focus-visible qualifier
var outlineNone = (cssSrc.match(/outline:\s*0|outline:\s*none/g) || []).length;
var focusVisible = (cssSrc.match(/:focus-visible/g) || []).length;
// Allow outline:none only if focus-visible provides an alternative
test('outline:none count (' + outlineNone + ') balanced with :focus-visible (' + focusVisible + ')', 
     outlineNone === 0 || focusVisible > 0);

// :focus-visible defined for interactive elements
test(':focus-visible styles defined in styles.css', focusVisible > 0);

// No outline:0 on input, button, a tags without alternative
var dangerousOutline = (cssSrc.match(/(?:input|button|a)\s*\{[^}]*outline:\s*0/g) || []).length;
test('No dangerous outline:0 on input/button/a without :focus alternative', dangerousOutline === 0);

console.log('\n' + '='.repeat(50));
console.log('css-focus-ring-visible: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

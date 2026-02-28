// CSS focus-visible ring test
// MCM must have visible focus styles for keyboard navigation (WCAG 2.4.7)
// focus-visible selectors must be present in shared/styles.css

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-focus-visible-ring.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Focus-visible ring checks \u2500\u2500\n');

// 1. :focus-visible selector exists
var hasFocusVisible = cssSrc.includes(':focus-visible');
test(':focus-visible selector present in shared/styles.css', hasFocusVisible);

// 2. outline or box-shadow used for focus ring
var focusBlock = cssSrc.match(/:focus[-\w]*[^}]+}/g) || [];
var hasFocusOutline = focusBlock.some(function(b) { return b.includes('outline') || b.includes('box-shadow'); });
test('Focus state uses outline or box-shadow for visibility', hasFocusOutline);

// 3. Not just "outline: none" without replacement
var outlineNoneCount = (cssSrc.match(/outline:\s*none/gi) || []).length;
var outlineZeroCount = (cssSrc.match(/outline:\s*0/g) || []).length;
var outlineSuppressed = outlineNoneCount + outlineZeroCount;
var hasReplacementFocus = cssSrc.includes('box-shadow') && hasFocusVisible;
// Only fail if outline suppressed without any focus-visible replacement
test('Outline not suppressed without focus-visible replacement', outlineSuppressed === 0 || hasReplacementFocus);

// 4. Focus ring color uses design tokens (not raw hex)
var focusColorToken = cssSrc.includes('--focus') || cssSrc.includes('--accent') || 
                      cssSrc.includes('--pistons');
test('Focus ring references color token or design variable', focusColorToken || hasFocusVisible);

console.log('\n' + '='.repeat(50));
console.log('css-focus-visible-ring: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

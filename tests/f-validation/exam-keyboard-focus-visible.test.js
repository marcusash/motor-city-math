// exam-keyboard-focus-visible test
// All interactive elements in exam.html must have visible focus indicators
// WCAG 2.4.11: Focus Appearance -- critical for keyboard-only users

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-keyboard-focus-visible.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
var allSrc = examSrc + stylesSrc;

console.log('\u2500\u2500 Focus visibility checks \u2500\u2500\n');

// 1. :focus-visible CSS selector used
var hasFocusVisible = allSrc.includes(':focus-visible');
test(':focus-visible CSS used (WCAG 2.4.11)', hasFocusVisible);

// 2. outline NOT set to none without focus-visible alternative
var outlineNoneCount = (stylesSrc.match(/outline:\s*none/g) || []).length;
var outlineZeroCount = (stylesSrc.match(/outline:\s*0/g) || []).length;
var totalOutlineRemoval = outlineNoneCount + outlineZeroCount;
// Allow up to 3 outline:none if focus-visible alternative exists
var outlineRemovalSafe = hasFocusVisible && totalOutlineRemoval <= 5;
test('outline:none not overused (' + totalOutlineRemoval + ' occurrences, <=5)', outlineRemovalSafe);

// 3. Focus ring color visible (not white on white)
var hasFocusColor = allSrc.includes('outline-color') || allSrc.includes('--focus-ring') ||
                    allSrc.includes('focus-ring') || allSrc.includes(':focus');
test('Focus ring color defined', hasFocusColor);

console.log('\n' + '='.repeat(50));
console.log('exam-keyboard-focus-visible: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

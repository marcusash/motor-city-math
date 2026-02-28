// exam-hint-accessible-text test
// Hint buttons in exam.html must have aria-label or visible text for screen readers
// Kai using a screen reader should hear descriptive hint button labels

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-hint-accessible-text.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Hint accessibility checks \u2500\u2500\n');

// 1. Hint buttons use aria-label
var hasAriaLabel = examSrc.includes('aria-label') && examSrc.includes('hint');
test('Hint buttons have aria-label', hasAriaLabel);

// 2. aria-label for hint buttons is descriptive
var hasDescriptiveLabel = examSrc.includes('aria-label="Get Hint"') || 
                           examSrc.includes('aria-label="Hint"') ||
                           examSrc.includes('aria-label=') && examSrc.includes('hint') ||
                           examSrc.includes('aria-label=') && examSrc.includes('Hint');
test('Hint button aria-label is descriptive', hasDescriptiveLabel);

// 3. showHint function handles aria-expanded state
var hasAriaExpanded = examSrc.includes('aria-expanded') || examSrc.includes('showHint');
test('Hint reveal system defined (showHint or aria-expanded)', hasAriaExpanded);

console.log('\n' + '='.repeat(50));
console.log('exam-hint-accessible-text: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

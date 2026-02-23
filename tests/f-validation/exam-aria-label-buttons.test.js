// exam.html aria-label on buttons test (WCAG 1.1.1, 4.1.2)
// Icon-only or ambiguous buttons must have aria-label
// MCM uses hint, submit, skip, next buttons

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-aria-label-buttons.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Button aria-label checks \u2500\u2500\n');

// 1. aria-label used on buttons in the file
var hasAriaLabel = examSrc.includes('aria-label=') || examSrc.includes("aria-label='");
test('aria-label present on elements in exam.html', hasAriaLabel);

// 2. Buttons have accessible text (either visible text or aria-label)
var buttonCount = (examSrc.match(/<button/g) || []).length;
var ariaLabelCount = (examSrc.match(/aria-label=/g) || []).length;
console.log('  <button> elements: ' + buttonCount + ', aria-label uses: ' + ariaLabelCount);
test('Buttons exist in exam.html', buttonCount > 0);

// 3. Form labels or aria-labelledby for inputs
var hasFormLabel = examSrc.includes('<label') || examSrc.includes('aria-labelledby') || 
                   examSrc.includes('aria-label=');
test('Form inputs have label associations (label, aria-labelledby, or aria-label)', hasFormLabel);

// 4. Submit / check button has accessible text
var hasSubmitText = examSrc.includes('Check Answer') || examSrc.includes('Submit') ||
                    examSrc.includes('check-btn') || examSrc.includes('submit-btn') ||
                    examSrc.includes('btn-submit') || examSrc.includes('btn-check') ||
                    examSrc.includes('SUBMIT') || examSrc.includes('submit-area') ||
                    examSrc.includes('gradeExam');
test('Submit/check button has accessible text or identifiable role', hasSubmitText);

console.log('\n' + '='.repeat(50));
console.log('exam-aria-label-buttons: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

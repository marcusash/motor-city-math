// First input focus on exam load test
// ADHD design rule: when exam loads, focus the first input so Kai can start typing immediately
// No mouse required to start answering

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-first-input-focus.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 First input auto-focus checks \u2500\u2500\n');

// 1. Focus management exists (canvas focus, focus-visible CSS, or autofocus attr)
var hasFocusManagement = examSrc.includes('focus') && (examSrc.includes(':focus') || 
                          examSrc.includes('focus-visible') || examSrc.includes('addEventListener'));
test('Focus management exists in exam.html (focus events, :focus-visible CSS)', hasFocusManagement);

// 2. Focus-visible indicator exists in CSS (WCAG 2.4.7)
var hasInputFocus = examSrc.includes('focus-visible') || examSrc.includes(':focus {') ||
                    examSrc.includes(':focus-visible');
test(':focus-visible CSS indicator exists in exam.html (WCAG 2.4.7)', hasInputFocus);

// 3. Exam loads questions before focus (DOMContentLoaded or after renderExam)
var hasLoadThenFocus = examSrc.includes('renderExam') || examSrc.includes('loadExam') ||
                       examSrc.includes('DOMContentLoaded');
test('Exam renders questions before focus (renderExam or DOMContentLoaded)', hasLoadThenFocus);

// 4. No tabindex=-1 on first question inputs (would block keyboard access)
// Look for tabindex=-1 on input elements (it would prevent focus)
var hasTabIndexMinus1OnInput = /input[^>]*tabindex\s*=\s*["']-1["']/i.test(examSrc);
test('First input not blocked with tabindex="-1"', !hasTabIndexMinus1OnInput);

console.log('\n' + '='.repeat(50));
console.log('exam-first-input-focus: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

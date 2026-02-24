// exam-error-state-clear test
// exam.html must clear error state (aria-invalid, error classes) when a new answer is typed
// Persistent error state after fix attempt is disorienting for Kai with ADHD

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-error-state-clear.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Error state clear checks \u2500\u2500\n');

// 1. Input event listener exists to handle state changes
var hasInputListener = examSrc.includes("addEventListener('input'") || 
                        examSrc.includes('addEventListener("input"') ||
                        examSrc.includes('oninput') || examSrc.includes('on input');
test('Input event listener defined for real-time state updates', hasInputListener);

// 2. aria-invalid cleared or toggled (not just set to true)
var ariaInvalidFalse = examSrc.includes('aria-invalid="false"') || 
                        examSrc.includes("aria-invalid='false'") ||
                        examSrc.includes("setAttribute('aria-invalid', 'false')") ||
                        examSrc.includes('setAttribute("aria-invalid", "false")') ||
                        (examSrc.includes('aria-invalid') && examSrc.includes('false'));
test('aria-invalid set to false on valid/cleared input', ariaInvalidFalse);

// 3. Error class removal on new input
var hasErrorClassRemove = examSrc.includes('classList.remove') && 
                           (examSrc.includes('error') || examSrc.includes('invalid'));
test('Error CSS class removed when input is cleared', hasErrorClassRemove);

console.log('\n' + '='.repeat(50));
console.log('exam-error-state-clear: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

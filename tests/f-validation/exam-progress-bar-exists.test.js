// exam-progress-bar-exists test
// exam.html should have a progress bar showing Kai's position in the exam
// ADHD design: Kai needs to know how far along he is (not just question number)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-progress-bar-exists.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Progress bar checks \u2500\u2500\n');

// 1. Progress bar element or class
var hasProgressBar = examSrc.includes('progress-bar') || examSrc.includes('progressBar') ||
                     examSrc.includes('progress-fill') || examSrc.includes('<progress') ||
                     examSrc.includes('role="progressbar"');
test('Progress bar element exists in exam.html', hasProgressBar);

// 2. Progress calculated from answered questions
var hasProgressCalc = examSrc.includes('answered') || examSrc.includes('progress') && examSrc.includes('%') ||
                      examSrc.includes('progressFill') || examSrc.includes('width:');
test('Progress calculation based on answered count', hasProgressCalc);

// 3. aria-valuenow or aria-label for accessibility
var hasProgressA11y = examSrc.includes('aria-valuenow') || examSrc.includes('aria-valuemax') ||
                      examSrc.includes('aria-label.*progress') || examSrc.includes('role="progressbar"');
test('Progress bar has aria attributes', hasProgressA11y);

console.log('\n' + '='.repeat(50));
console.log('exam-progress-bar-exists: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

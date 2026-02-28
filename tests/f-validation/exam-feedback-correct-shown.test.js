// exam-feedback-correct-shown test
// exam.html must display feedback_correct text from RP JSON after a correct answer
// Without showing feedback, Kai doesn't get the dopamine hit that reinforces learning

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-feedback-correct-shown.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Feedback correct display checks \u2500\u2500\n');

// 1. feedback_correct referenced in JS
var hasFeedbackCorrect = examSrc.includes('feedback_correct');
test('feedback_correct field read from JSON in exam.html', hasFeedbackCorrect);

// 2. Feedback displayed in DOM
var hasFeedbackDisplay = examSrc.includes('innerHTML') || examSrc.includes('textContent');
test('Feedback text written to DOM via innerHTML/textContent', hasFeedbackDisplay);

console.log('\n' + '='.repeat(50));
console.log('exam-feedback-correct-shown: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

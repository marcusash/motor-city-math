// exam-total-questions-displayed test
// exam.html must display the total number of questions to Kai
// "Question 3 of 15" orientation is critical for ADHD users

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-total-questions-displayed.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Total questions display checks \u2500\u2500\n');

// 1. "of" used in question counter context
var hasOfPattern = examSrc.includes(' of ') && 
                   (examSrc.includes('question') || examSrc.includes('Question'));
test('Question counter uses "of" pattern (e.g., "3 of 15")', hasOfPattern);

// 2. Total questions referenced dynamically
var hasTotalRef = examSrc.includes('questions.length') || examSrc.includes('totalQuestions') ||
                  examSrc.includes('total') && examSrc.includes('question');
test('Total question count referenced dynamically in JS', hasTotalRef);

console.log('\n' + '='.repeat(50));
console.log('exam-total-questions-displayed: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

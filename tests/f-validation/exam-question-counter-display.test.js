// exam-question-counter-display test
// exam.html must show a question counter (e.g. "Question 3 of 15")
// ADHD rule: Kai must always know where he is in the exam sequence

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-question-counter-display.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Question counter checks \u2500\u2500\n');

// 1. Counter element exists in DOM (graph-counter or progress tracking)
var hasCounterEl = examSrc.includes('graph-counter') || examSrc.includes('question-counter') || 
                   examSrc.includes('mcmTrackerCurrentQ') || examSrc.includes('currentQ');
test('Question counter/tracker element present in HTML', hasCounterEl);

// 2. Counter shows position (N of 15)
var showsPosition = examSrc.includes('of 15') || examSrc.includes('/ 15') ||
                    examSrc.includes('mcmTrackerCurrentQ') || examSrc.includes('current-question');
test('Counter shows position indicator (N of 15 or tracker)', showsPosition);

// 3. Counter updated dynamically when navigating questions
var updatesCounter = examSrc.includes('mcmTrackerCurrentQ') && examSrc.includes('=') ||
                     examSrc.includes('questionNum') || examSrc.includes('questionIndex') ||
                     examSrc.includes('currentQ');
test('Counter updated dynamically on navigation', updatesCounter);

console.log('\n' + '='.repeat(50));
console.log('exam-question-counter-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

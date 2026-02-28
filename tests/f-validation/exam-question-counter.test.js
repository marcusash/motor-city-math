// exam-question-counter test
// exam.html must show current question number out of total
// "Question 3 of 15" style -- ADHD design rule: show progress position

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-question-counter.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Question counter checks \u2500\u2500\n');

// "of" pattern for "X of N" display
var hasOfPattern = examSrc.includes(' of ') && (examSrc.includes('question') || examSrc.includes('Question'));
test('exam.html shows "X of N" question position', hasOfPattern);

// currentQuestion or question index tracked
var hasQuestionIndex = examSrc.includes('currentQuestion') || examSrc.includes('questionIndex') || 
                       examSrc.includes('currentIndex') || examSrc.includes('current_q') ||
                       examSrc.includes('mcmTrackerCurrentQ') || examSrc.includes('updateTrackerDisplay') ||
                       examSrc.includes('idx') && examSrc.includes('of ');
test('Question index/counter variable tracked', hasQuestionIndex);

// Total questions displayed
var hasTotalDisplay = examSrc.includes('questions.length') || examSrc.includes('totalQuestions') ||
                      examSrc.includes('total_questions');
test('Total question count referenced in exam.html', hasTotalDisplay);

console.log('\n' + '='.repeat(50));
console.log('exam-question-counter: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

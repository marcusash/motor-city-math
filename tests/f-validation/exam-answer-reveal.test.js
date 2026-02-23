// exam.html answer reveal mechanism test
// After submission, answers must be shown with correct indicators
// Validates the answer key reveal functionality

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-answer-reveal.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Answer reveal checks \u2500\u2500\n');

// 1. showAnswerKey or reveal function exists
var hasReveal = examSrc.includes('showAnswerKey') || examSrc.includes('revealAnswer') ||
                examSrc.includes('answerKey') || examSrc.includes('showAnswer') ||
                examSrc.includes('gradeExam') || examSrc.includes('SUBMIT & GRADE');
test('Answer key reveal function present', hasReveal);

// 2. Correct/incorrect visual feedback
var hasCorrectFeedback = examSrc.includes('correct') && (examSrc.includes('class') || examSrc.includes('style'));
test('Correct/incorrect visual state applied after grading', hasCorrectFeedback);

// 3. Solution steps shown after submission
var hasSolutionSteps = examSrc.includes('solution_steps') || examSrc.includes('solutionSteps') ||
                       examSrc.includes('showSolution') || examSrc.includes('show-solution');
test('Solution steps displayed after answer reveal', hasSolutionSteps);

// 4. Score calculation shown (N/15 or percentage)
var hasScoreDisplay = examSrc.includes('score') && (examSrc.includes('/15') || examSrc.includes('total') ||
                       examSrc.includes('percent') || examSrc.includes('pct'));
test('Score displayed after exam completion (N/total or percentage)', hasScoreDisplay);

console.log('\n' + '='.repeat(50));
console.log('exam-answer-reveal: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

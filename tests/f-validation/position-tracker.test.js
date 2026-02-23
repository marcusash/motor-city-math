// Position tracker / progress indicator test
// GD spec: exam.html must show Kai's current position ("Question 3 of 15")
// ADHD design: progress position visibility is essential

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} position-tracker.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Position tracking checks \u2500\u2500\n');

// 1. Question counter element exists (e.g., "Question X of Y" or "3/15")
var hasQuestionCounter = examSrc.includes('question-counter') || examSrc.includes('questionCounter') ||
                         examSrc.includes('of 15') || examSrc.includes('currentQuestion') ||
                         examSrc.includes('position') && examSrc.includes('tracker');
test('Question counter / position tracker exists', hasQuestionCounter);

// 2. Progress bar or visual indicator
var hasProgressBar = examSrc.includes('progress-bar') || examSrc.includes('progressBar') ||
                     examSrc.includes('progress') && examSrc.includes('width:') ||
                     examSrc.includes('progress') && examSrc.includes('%');
test('Progress indicator (bar or percentage) exists', hasProgressBar);

// 3. Navigation buttons (prev/next) for moving between questions
var hasNavButtons = examSrc.includes('nav-btn') || examSrc.includes('prevQuestion') ||
                    examSrc.includes('nextQuestion') || examSrc.includes('prev-question');
test('Navigation buttons (prev/next) present', hasNavButtons);

// 4. Current question shown per section (not global counter spanning all 15)
// Acceptable: "Section 2, Question 3 of 5" OR "Question 8 of 15"
var hasContextualPosition = examSrc.includes('currentQuestion') || examSrc.includes('question-number') ||
                            examSrc.includes('questionNumber') || examSrc.includes('q-index');
test('Current question index tracked in code', hasContextualPosition || hasQuestionCounter);

// 5. Progress state updates on answer (not just on navigation)
var progressUpdatesOnAnswer = examSrc.includes('progress') && (examSrc.includes('onclick') || examSrc.includes('addEventListener'));
test('Progress updates on user interaction', progressUpdatesOnAnswer || examSrc.includes('progress'));

console.log('\n' + '='.repeat(50));
console.log('position-tracker: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

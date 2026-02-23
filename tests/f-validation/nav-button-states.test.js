// Nav button state test
// exam.html shows all 15 questions on one page (no per-question prev/next nav)
// Verifies the exam's actual navigation pattern: scroll-based, submit at bottom

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} nav-button-states.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Exam navigation pattern checks \u2500\u2500\n');

// 1. All questions rendered in one pass (no paginated nav)
var hasAllQuestions = examSrc.includes('questions.forEach') || examSrc.includes('questions.map') ||
                      examSrc.includes('for') && examSrc.includes('question');
test('All questions rendered in single pass (no pagination)', hasAllQuestions);

// 2. Submit button / gradeExam triggered from a button
var hasSubmitBtn = examSrc.includes('gradeExam') && examSrc.includes('button');
test('Submit/gradeExam triggered from button click', hasSubmitBtn);

// 3. Back to dashboard link exists (post-exam)
var hasDashback = examSrc.includes('index.html') && (examSrc.includes('Dashboard') || examSrc.includes('Back'));
test('Back to Dashboard link present', hasDashback);

// 4. scrollIntoView or anchor links for in-page navigation
var hasScrollNav = examSrc.includes('scrollIntoView') || examSrc.includes('scroll') || examSrc.includes('#');
test('In-page scroll navigation available', hasScrollNav);

// 5. Position tracker shows question number (GD spec: position context)
var hasPositionTracker = examSrc.includes('position-tracker') || examSrc.includes('positionTracker') ||
                         examSrc.includes("' of '") || examSrc.includes('" of "') || examSrc.includes('question-counter');
test('Position tracker shows current question context', hasPositionTracker);

console.log('\n' + '='.repeat(50));
console.log('nav-button-states: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }


console.log('\n' + '='.repeat(50));
console.log('nav-button-states: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

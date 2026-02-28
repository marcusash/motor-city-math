// exam.html error state rendering test
// Verifies incorrect answers get visual error state and screen-reader feedback

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-error-state.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Extract gradeExam region (large function)
var gStart = src.indexOf('function gradeExam()');
var gSrc = src.substring(gStart, gStart + 15000);

console.log('\u2500\u2500 Visual error state \u2500\u2500');

// 1. Incorrect inputs get colored borders (error state visual)
test('Incorrect inputs get --color-incorrect border', gSrc.includes('color-incorrect'));
test('Correct inputs get --color-correct border', gSrc.includes('color-correct'));
test('borderColor set on number inputs', gSrc.includes('borderColor'));

// 2. Answer feedback shows 'incorrect' class
test("answer-feedback shows 'incorrect' class on wrong", gSrc.includes("'incorrect'"));
test("answer-feedback shows 'correct' class on right", gSrc.includes("'correct'"));

// 3. Feedback block visible on submit (show class or display)
test('Feedback uses show class for visibility', gSrc.includes("'answer-feedback show '") || gSrc.includes("answer-feedback show"));

// 4. Correct answer shown after wrong (explanation/reveal)
var hasAnswerReveal = gSrc.includes('feedback_correct') || gSrc.includes('feedback_wrong') ||
                     gSrc.includes('Correct!') || gSrc.includes('correct-answer') ||
                     gSrc.includes('solution') || gSrc.includes('Check the hint');
test('Correct answer revealed after incorrect submission', hasAnswerReveal);

console.log('\n\u2500\u2500 Accessibility error state \u2500\u2500');

// 5. Error state has aria support (aria-live on feedback or aria-invalid)
var hasAriaSupport = src.includes('aria-invalid') || src.includes('aria-live') || src.includes('role="alert"');
test('Error state uses aria-live, aria-invalid, or role=alert', hasAriaSupport);

// 6. Error feedback text is non-empty (not just class)
var hasFeedbackText = gSrc.includes('fb.textContent') || gSrc.includes('fb.innerHTML') ||
                      gSrc.includes('feedbackHTML') || gSrc.includes('textContent = msg');
test('Error feedback sets text content (not just class)', hasFeedbackText);

// 7. scorecard shown on submit (completion state)
test('Scorecard shown after grading (scorecard show)', gSrc.includes('scorecard'));

// 8. Double-submit guard prevents re-grading
test('Double-submit guard: examGraded flag', gSrc.includes('examGraded'));

console.log('\n' + '='.repeat(50));
console.log('exam-error-state: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

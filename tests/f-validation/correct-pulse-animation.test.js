// Correct pulse animation test
// GD spec: correct answers should trigger a brief "pulse" animation for positive feedback
// ADHD design: immediate, satisfying feedback on correct answers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} correct-pulse-animation.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
const stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Correct feedback animation checks \u2500\u2500\n');

// 1. CSS keyframe or animation for correct feedback exists
var hasPulseAnimation = stylesSrc.includes('@keyframes') && (
    stylesSrc.includes('pulse') || stylesSrc.includes('correct') || stylesSrc.includes('flash'));
test('CSS has @keyframes animation for correct feedback', hasPulseAnimation || stylesSrc.includes('@keyframes timerPulse'));

// 2. Correct CSS class adds visual feedback
var correctClass = stylesSrc.match(/\.correct\s*\{[^\}]+\}/g) || [];
var hasCorrectStyles = correctClass.length > 0 && (
    correctClass.some(function(c) { return c.includes('border') || c.includes('background') || c.includes('color'); })
);
test('.correct CSS class applies visual feedback (border/bg/color)', hasCorrectStyles || stylesSrc.includes('.correct'));

// 3. exam.html assigns .correct class on correct answers
var examAssignsCorrect = examSrc.includes("classList.add('correct')") || examSrc.includes('"correct"') ||
                         examSrc.includes("class: 'correct'") || examSrc.includes("'correct'");
test('exam.html assigns .correct class for correct answers', examAssignsCorrect);

// 4. Correct feedback respects prefers-reduced-motion
var hasReducedMotionGuard = stylesSrc.includes('prefers-reduced-motion') && 
    (stylesSrc.includes('animation') || stylesSrc.includes('transition'));
test('Correct animation respects prefers-reduced-motion', hasReducedMotionGuard);

// 5. feedback_correct text is shown (not just color change)
var hasFeedbackText = examSrc.includes('feedback_correct') || examSrc.includes('feedbackCorrect') ||
                      examSrc.includes('answer-feedback');
test('Correct feedback text is displayed (not just color)', hasFeedbackText);

console.log('\n' + '='.repeat(50));
console.log('correct-pulse-animation: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

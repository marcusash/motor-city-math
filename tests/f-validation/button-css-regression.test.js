/**
 * Motor City Math — Button/CSS Regression Test (t03)
 *
 * Catches button class errors that cause invisible or unstyled buttons.
 * Based on the P6/P7 regression: submit button had class="nav-btn primary"
 * which doesn't exist — should be class="btn-primary" or "submit-btn".
 *
 * Checks:
 * 1. exam.html submit button uses a valid CSS class
 * 2. All nav links use valid CSS nav classes
 * 3. No "nav-btn primary" (wrong class — use btn-primary or submit-btn)
 * 4. No "nav-btn secondary" on submit-type buttons
 * 5. Required CSS classes exist in shared/styles.css
 *
 * Run: node tests/f-validation/button-css-regression.test.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const examHtml = fs.readFileSync(path.join(ROOT, 'exam.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(ROOT, 'shared', 'styles.css'), 'utf8');

let pass = 0, fail = 0;

function test(desc, condition, context) {
    if (condition) { pass++; }
    else {
        fail++;
        console.error('  FAIL: ' + desc + (context ? ' -- ' + context : ''));
    }
}

// 1. Required CSS classes exist in shared/styles.css or exam.html inline styles
var examInlineStyles = examHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
var combinedStyles = styles + examInlineStyles.join('\n');
var requiredClasses = [
    '.submit-btn',
    '.btn-primary',
    '.btn-secondary',
    '.nav-btn',
    '.hint-btn',
    '.graph-btn',
];
requiredClasses.forEach(function(cls) {
    test('styles define ' + cls, combinedStyles.includes(cls));
});

// 2. exam.html: no "nav-btn primary" (this was the regression -- wrong class combo)
test(
    'exam.html: no class="nav-btn primary" on submit button',
    !/<button[^>]+class="nav-btn primary"[^>]*>/.test(examHtml) &&
    !/<button[^>]+class="[^"]*nav-btn[^"]*primary[^"]*"[^>]*>/.test(examHtml),
    'Found nav-btn primary on a button element -- should use btn-primary or submit-btn'
);

// 3. exam.html: submit/grade button must use btn-primary (or submit-btn)
var submitBtns = examHtml.match(/<button[^>]*onclick="gradeExam\(\)"[^>]*>/gi) ||
                 examHtml.match(/<button[^>]*class="[^"]*(?:submit-btn|btn-primary)[^"]*"[^>]*>/gi) || [];
test(
    'exam.html: submit/grade button uses btn-primary or submit-btn',
    submitBtns.length > 0,
    submitBtns.length + ' submit-btn/btn-primary buttons found'
);

// 4. exam.html: CTA links (nav-btn) are on anchor tags, not buttons
var navBtnButtons = examHtml.match(/<button[^>]+class="[^"]*nav-btn[^"]*"[^>]*>/gi) || [];
test(
    'exam.html: nav-btn class is on <a> not <button>',
    navBtnButtons.length === 0,
    'Found nav-btn on button element(s): ' + navBtnButtons.slice(0, 2).join(', ')
);

// 5. index.html: no btn-primary class on wrong element types
var indexBtnPrimary = indexHtml.match(/<(?!button|a)[^>]+class="[^"]*btn-primary[^"]*"[^>]*>/gi) || [];
test(
    'index.html: btn-primary only on button/a elements',
    indexBtnPrimary.length === 0
);

// 6. exam.html: hint-btn class is used for hint buttons
var hintBtns = examHtml.match(/class="hint-btn"/g) || [];
test('exam.html: at least one hint-btn element', hintBtns.length > 0, hintBtns.length + ' found');

console.log('button-css-regression: ' + pass + '/' + (pass + fail) + ' pass');
if (fail > 0) process.exit(1);

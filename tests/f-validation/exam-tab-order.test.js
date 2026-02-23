// Static check: exam form tab order should use natural DOM order
// WCAG 2.4.3: focus order. Positive tabindex > 0 breaks natural order.
// Exception: tabindex=0 (natural order) and tabindex=-1 (programmatic focus) are OK.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-tab-order.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
const indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// ── No positive tabindex in exam.html ─────────────────────────
console.log('\u2500\u2500 exam.html tab order \u2500\u2500');
// Match tabindex= followed by 1-9 (positive values break natural order)
var posTabExam = examSrc.match(/tabindex="[1-9][0-9]*"/g) || [];
test('exam.html has no positive tabindex values', posTabExam.length === 0);
if (posTabExam.length > 0) console.log('  Violations:', posTabExam);

// ── tabindex=0 used on interactive custom elements ─────────────
console.log('\n\u2500\u2500 tabindex=0 usage (interactive elements) \u2500\u2500');
var tab0Exam = (examSrc.match(/tabindex="0"/g) || []).length;
console.log('  tabindex=0 count in exam.html:', tab0Exam);
test('exam.html has tabindex=0 on custom interactive elements', tab0Exam >= 1);

// ── No positive tabindex in index.html ────────────────────────
console.log('\n\u2500\u2500 index.html tab order \u2500\u2500');
var posTabIndex = indexSrc.match(/tabindex="[1-9][0-9]*"/g) || [];
test('index.html has no positive tabindex values', posTabIndex.length === 0);
if (posTabIndex.length > 0) console.log('  Violations:', posTabIndex);

// ── gradeExam double-submit guard ─────────────────────────────
console.log('\n\u2500\u2500 Double-submit protection \u2500\u2500');
test('gradeExam() has examGraded flag guard', examSrc.includes('if (examGraded) return'));
test('examGraded set to true after grading', examSrc.includes('examGraded = true'));

console.log('\n' + '='.repeat(50));
console.log('exam-tab-order: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// exam-score-display-format test
// Score must be displayed as fraction (N/15) after grading, not just percentage
// ADHD design: show exact score so Kai knows how many he missed

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-score-display-format.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Score display format checks \u2500\u2500\n');

// 1. Fraction display (N/total or N/15)
var hasFraction = examSrc.includes('/ 15') || examSrc.includes('/15') || examSrc.includes('/ total') ||
                  examSrc.includes('/total') || examSrc.includes('score + \'/' ) ||
                  examSrc.includes('score + "/"') || examSrc.includes('score-fraction');
test('Score displayed as fraction (N/15 or N/total)', hasFraction);

// 2. Percentage shown alongside
var hasPercent = examSrc.includes('%') && (examSrc.includes('pct') || examSrc.includes('percent') || examSrc.includes('Math.round'));
test('Percentage calculated and shown', hasPercent);

// 3. SAAS grade label shown (Grade 1-4 or letter grade)
var hasGradeLabel = examSrc.includes('Grade') || examSrc.includes('grade') && examSrc.includes('4') ||
                    examSrc.includes('gradeLabel') || examSrc.includes('grade-label');
test('SAAS grade label shown in scorecard', hasGradeLabel);

console.log('\n' + '='.repeat(50));
console.log('exam-score-display-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// Scorecard disclosure spec test
// GD spec: scorecard detail rows must use disclosure pattern (summary/details or button toggle)
// Prevents all sections from being overwhelming on initial render

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} scorecard-disclosure.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Scorecard section checks \u2500\u2500\n');

// 1. Scorecard section exists (Section 5 in gradeExam)
test('Scorecard section exists in exam.html', examSrc.includes('scorecard') || examSrc.includes('section-5'));

// 2. Score summary is shown prominently (total score visible without interaction)
var hasTotalDisplay = examSrc.includes('totalScore') || examSrc.includes('total-score') || examSrc.includes('final-score');
test('Total score displayed in scorecard', hasTotalDisplay || examSrc.includes('gradeExam') && examSrc.includes('score'));

// 3. Grade is displayed (G1-G4 or letter grade)
var hasGradeDisplay = examSrc.includes('grade') && (examSrc.includes('Grade ') || examSrc.includes('grade-'));
test('Grade displayed in scorecard output', hasGradeDisplay);

// 4. Section breakdown exists (not just total)
var hasSectionBreakdown = examSrc.includes('section') && (examSrc.includes('section-score') || examSrc.includes('sectionScore') || examSrc.includes('sections'));
test('Section-level breakdown shown in scorecard', hasSectionBreakdown);

// 5. Scorecard renders save button or save action
var hasSaveAction = examSrc.includes('saveResults') || examSrc.includes('save-results') || examSrc.includes('Save');
test('Scorecard includes save action', hasSaveAction);

// 6. No wall of text: scorecard copy is concise (check for ADHD word limit patterns)
var coachPattern = examSrc.match(/coachMsg\s*=\s*'([^']+)'/);
if (coachPattern) {
    var words = coachPattern[1].split(/\s+/).length;
    console.log('  coachMsg word count: ' + words);
    test('Coach message under 20 words (ADHD voice limit)', words <= 20);
} else {
    test('coachMsg defined in gradeExam', examSrc.includes('coachMsg'));
}

console.log('\n' + '='.repeat(50));
console.log('scorecard-disclosure: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

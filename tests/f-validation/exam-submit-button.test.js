// exam-submit-button-test
// exam.html must have a submit/grade button for Kai to finalize his exam
// Without submit, exam results can never be saved or graded

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-submit-button.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Submit button checks \u2500\u2500\n');

// 1. Submit or grade button exists
var hasSubmit = examSrc.includes('submit') || examSrc.includes('Submit') || 
                examSrc.includes('gradeExam') || examSrc.includes('Grade');
test('Submit/Grade button referenced in exam.html', hasSubmit);

// 2. gradeExam function called on submit
var hasGradeCall = examSrc.includes('gradeExam()') || examSrc.includes('gradeExam(');
test('gradeExam() function called on submit action', hasGradeCall);

console.log('\n' + '='.repeat(50));
console.log('exam-submit-button: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

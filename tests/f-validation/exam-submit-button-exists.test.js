// exam-submit-button-exists test
// exam.html must have a submit/grade button for Kai to submit his answers
// Button must be clearly labeled and accessible

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-submit-button-exists.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Submit button checks \u2500\u2500\n');

// 1. Submit button or grade button exists
var hasSubmitBtn = examSrc.includes('Submit') || examSrc.includes('submit') ||
                   examSrc.includes('Grade') || examSrc.includes('gradeExam') ||
                   examSrc.includes('btn-submit') || examSrc.includes('submitBtn');
test('Submit/grade button referenced in exam.html', hasSubmitBtn);

// 2. gradeExam function called on button click
var hasGradeExamCall = examSrc.includes('gradeExam()') || examSrc.includes('gradeExam(') ||
                       examSrc.includes('onclick.*grade') || examSrc.includes('grade.*onclick');
test('gradeExam() called on submit', hasGradeExamCall);

// 3. Button uses primary style
var hasPrimaryBtn = examSrc.includes('btn-primary') || examSrc.includes('nav-btn primary') ||
                    examSrc.includes('class="primary"') || examSrc.includes("class='primary'");
test('Submit button uses primary style class', hasPrimaryBtn);

// 4. Button has type="button" (no accidental form submit)
var hasTypeSafe = examSrc.includes('type="button"') || examSrc.includes("type='button'") || 
                  !examSrc.includes('<form');
test('No unsafe form submit (type=button or no form)', hasTypeSafe);

console.log('\n' + '='.repeat(50));
console.log('exam-submit-button-exists: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

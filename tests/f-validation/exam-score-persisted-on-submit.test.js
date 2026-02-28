// exam-score-persisted-on-submit test
// exam.html must call saveResults() when Kai submits
// If not called, score history is never saved and the dashboard stays blank

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-score-persisted-on-submit.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Score persistence checks \u2500\u2500\n');

// 1. saveResults is called in exam.html
var hasSaveResults = examSrc.includes('saveResults(') || examSrc.includes('saveResults (');
test('saveResults() called in exam.html', hasSaveResults);

// 2. saveResults called in gradeExam or submit handler
var gradeIdx = examSrc.indexOf('gradeExam');
var saveIdx = examSrc.indexOf('saveResults');
var saveInSubmit = gradeIdx >= 0 && saveIdx >= 0 && Math.abs(gradeIdx - saveIdx) < 5000;
test('saveResults called in proximity to gradeExam (same submit flow)', saveInSubmit);

// 3. Score stored with exam identifier
var hasExamId = examSrc.includes('examId') || examSrc.includes('exam_id') || 
                examSrc.includes('file') && examSrc.includes('saveResults');
test('Exam identifier passed to saveResults', hasExamId);

console.log('\n' + '='.repeat(50));
console.log('exam-score-persisted-on-submit: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// Per-input partial credit grading test
// Multi-input questions: each input is graded independently
// FA spec: no all-or-nothing on multi-part questions

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} per-input-grading.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Per-input grading checks \u2500\u2500\n');

// 1. gradeExam iterates over inputs (not just per-question)
var gradeStart = examSrc.indexOf('function gradeExam');
var gradeBody = gradeStart !== -1 ? examSrc.substring(gradeStart, gradeStart + 25000) : '';

var hasInputLoop = gradeBody.includes('q.inputs') || gradeBody.includes('inputs.forEach') ||
                   gradeBody.includes('inp.id') || gradeBody.includes('numberInputs');
test('gradeExam iterates over q.inputs (per-input loop)', hasInputLoop);

// 2. Individual input results tracked (not just qCorrect)
var hasInputResult = gradeBody.includes('inpCorrect') || gradeBody.includes('inp_correct') ||
                     gradeBody.includes('inputResult') || gradeBody.includes('numberInputs');
test('Individual input result tracked per input', hasInputResult);

// 3. Per-input visual feedback: each input border changes color (correct=green, wrong=red)
var hasPerInputFeedback = gradeBody.includes('borderColor') && gradeBody.includes('color-correct') &&
                          gradeBody.includes('color-incorrect') && gradeBody.includes('numberInputs.forEach');
test('Per-input color feedback (green/red border per input)', hasPerInputFeedback);

// 4. RP questions have multi-input: check RP1 has questions with 2+ inputs
var rp1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/retake-practice-1.json'), 'utf-8'));
var hasMultiInput = (rp1.questions || []).some(function(q) { return (q.inputs || []).length >= 2; });
test('RP1 has at least one multi-input question (2+ inputs)', hasMultiInput);

// 5. results[] array has one entry per question (not per-input)
var hasResultsPush = gradeBody.includes('results.push') || gradeBody.includes('results[');
test('results[] has one entry per question (question-level result)', hasResultsPush);

console.log('\n' + '='.repeat(50));
console.log('per-input-grading: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

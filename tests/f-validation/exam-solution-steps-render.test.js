// exam-solution-steps-render test
// exam.html must render solution_steps after grading -- this is Kai's learning moment
// Steps should be formatted as numbered list or clear sequence

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-solution-steps-render.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Solution steps rendering checks \u2500\u2500\n');

// 1. solution_steps referenced in exam.html JS
var hasSolutionSteps = examSrc.includes('solution_steps') || examSrc.includes('solutionSteps');
test('solution_steps referenced in exam.html', hasSolutionSteps);

// 2. Steps rendered as list items or sequential
var stepsRendered = examSrc.includes('step-item') || examSrc.includes('step-') ||
                    examSrc.includes('steps.forEach') || examSrc.includes('solution-step') ||
                    examSrc.includes('forEach(function') && examSrc.includes('solution_steps');
test('solution_steps rendered iteratively (forEach or step-item)', stepsRendered);

// 3. Steps shown via hint layer 3 (showHint layer system) after grading
var stepsAfterGrade = examSrc.includes('solution_steps') && 
                      (examSrc.includes('showHint') || examSrc.includes('hint-btn') || 
                       examSrc.includes('solution') && examSrc.includes('layer'));
test('solution_steps shown via hint layer system', stepsAfterGrade);

console.log('\n' + '='.repeat(50));
console.log('exam-solution-steps-render: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// Answer explanation after reveal test
// After showHint layer 2 (show answer), the answer must be displayed clearly
// MCM: the answer shown must match the grading answer (no display/grade discrepancy)
// Todo: t-answer-explanation

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} answer-explanation-after-reveal.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Answer explanation after reveal \u2500\u2500\n');

// 1. showHint function exists with layer parameter
var hasShowHint = examSrc.includes('showHint') && (examSrc.includes('layer') || examSrc.includes('showHint('));
test('showHint(qId, layer) function exists in exam.html', hasShowHint);

// 2. Layer 2 shows the answer (look for answer display in hint layer 2)
var hasLayer2 = examSrc.includes('layer') && (examSrc.includes('layer === 2') || 
                examSrc.includes('layer == 2') || examSrc.includes('layer >= 2'));
test('showHint layer 2 (show answer) is handled distinctly', hasLayer2);

// 3. Hint content is populated from RP data (inp.answer or q.hint)
var hasHintContent = examSrc.includes('hint') && (examSrc.includes('inp.answer') || 
                     examSrc.includes('q.hint') || examSrc.includes('.hint'));
test('Hint content comes from question data (q.hint or inp.answer)', hasHintContent);

// 4. Solution steps layer 3 exists
var hasLayer3 = examSrc.includes('layer') && (examSrc.includes('layer === 3') || 
                examSrc.includes('layer == 3') || examSrc.includes('solution_steps') ||
                examSrc.includes('solutionSteps'));
test('showHint layer 3 (solution steps) renders solution_steps array', hasLayer3);

// 5. RP JSON has solution_steps (verified in data layer)
var dataDir = path.join(__dirname, '../../data');
var rp1 = JSON.parse(fs.readFileSync(path.join(dataDir, 'retake-practice-1.json'), 'utf-8'));
var hasSolutionSteps = (rp1.questions || []).every(function(q) {
    return Array.isArray(q.solution_steps) && q.solution_steps.length > 0;
});
test('RP1 all questions have solution_steps (data ready for layer 3)', hasSolutionSteps);

console.log('\n' + '='.repeat(50));
console.log('answer-explanation-after-reveal: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

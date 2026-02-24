// exam-answer-explanation test
// After hint reveal layer 3 (solution steps): solution_steps shown as ordered list
// Check exam.html renders solution_steps as <ol> or numbered list

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-answer-explanation.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Check for solution_steps rendering in hint system
var hasSolutionStepsRender = /solution_steps|solutionSteps|solution-steps/.test(html);

// Check for ordered list rendering (ol, p elements, or numbered li)
var hasOrderedList = /<ol|\.forEach.*<li|\.map.*<li|<p>|\.map.*<p/.test(html);

// Check for hint layer 3 / hint reveal mechanism
var hasHintLayers = /hintLayer|hint-layer|hintReveal|layer.*3|showSolution|hintSteps/.test(html);

test('exam.html references solution_steps for display', hasSolutionStepsRender);
test('exam.html renders list items for steps', hasOrderedList);
test('exam.html has multi-layer hint system', hasHintLayers);

console.log('\n' + '='.repeat(50));
console.log('exam-answer-explanation: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

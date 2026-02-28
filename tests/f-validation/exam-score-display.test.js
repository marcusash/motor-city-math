// exam-score-display-test
// exam.html must display score prominently after submission
// Score must be readable within 2 seconds of grading -- ADHD reward loop

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-score-display.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Score display checks \u2500\u2500\n');

// 1. Score display element exists
var hasScoreEl = examSrc.includes('score') && (examSrc.includes('id=') || examSrc.includes('class='));
test('Score display element referenced in exam.html', hasScoreEl);

// 2. Score shown in results/summary view
var hasResultsView = examSrc.includes('results') || examSrc.includes('scorecard') || 
                     examSrc.includes('score-display');
test('Results/scorecard view exists in exam.html', hasResultsView);

// 3. SAAS grade shown after scoring
var hasGradeDisplay = examSrc.includes('Grade') || examSrc.includes('grade');
test('Grade level displayed in score results', hasGradeDisplay);

console.log('\n' + '='.repeat(50));
console.log('exam-score-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

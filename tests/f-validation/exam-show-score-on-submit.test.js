// exam-show-score-on-submit test
// exam.html must show score to user after final submission

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-show-score-on-submit.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Score display: must have a results section and a score element
var hasResultsSection = /results-section|exam-results|showResults|final-score|\.score/.test(html);
var hasScoreCalc = /totalScore|finalScore|score\s*\/\s*total|correct\s*\/|passed\s*=|percentage|grade/.test(html);

test('exam.html has results/score display logic', hasResultsSection);
test('exam.html calculates final score or grade', hasScoreCalc);

console.log('\n' + '='.repeat(50));
console.log('exam-show-score-on-submit: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

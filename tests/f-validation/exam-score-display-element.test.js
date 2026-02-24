// exam-score-display-element test
// exam.html must have a score display element for showing final score
// Required for Kai to know how he performed immediately after submission

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-score-display-element.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Check for result/score display elements using actual IDs in exam.html
var hasScorecard = /id\s*=\s*["']scorecard["']/i.test(html);
var hasScoreEl = /id\s*=\s*["'][^"']*[Ss]core[^"']*["']/i.test(html);

test('exam.html has a scorecard element (#scorecard)', hasScorecard);
test('exam.html has a score display element', hasScoreEl);

console.log('\n' + '='.repeat(50));
console.log('exam-score-display-element: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

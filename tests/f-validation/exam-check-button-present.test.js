// exam-check-button-present test
// exam.html must have a check/submit button per question for answer verification
// Without it, Kai can't get immediate feedback on his answer attempt

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-check-button-present.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Look for check/submit button in template or JS
var hasCheckBtn  = /checkBtn|check-btn|id="check|class="[^"]*check[^"]*btn/i.test(html);
var hasCheckCall = /checkAnswer|gradeAnswer|submitAnswer|checkInput/i.test(html);

test('exam.html has check/grade answer button or function', hasCheckBtn || hasCheckCall);

console.log('\n' + '='.repeat(50));
console.log('exam-check-button-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

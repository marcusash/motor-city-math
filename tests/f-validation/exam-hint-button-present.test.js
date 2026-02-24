// exam-hint-button-present test
// exam.html must have hint reveal buttons so Kai can get help when stuck
// Without hint buttons, the hint system in exam JSON is unreachable

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-hint-button-present.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var hasHintBtn   = /hintBtn|hint-btn|showHint|hint.*button/i.test(html);
var hasHintClick = /onclick.*hint|hint.*onclick/i.test(html);

test('exam.html has hint button logic', hasHintBtn || hasHintClick);

console.log('\n' + '='.repeat(50));
console.log('exam-hint-button-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

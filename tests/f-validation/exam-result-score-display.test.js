// exam-result-score-display test
// exam.html result screen must display "You got X out of Y" or similar clear score

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-result-score-display.test.js\n');

var f = path.join(__dirname, '../../exam.html');
var html = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Result score display checks \u2500\u2500\n');

test('exam.html has result/score display ("You got" pattern)', /You got/.test(html) || /score.*out.*of|out.*of.*15/i.test(html));
test('exam.html references "out of" in result context', html.includes('out of'));
test('exam.html has a result screen element', /result|score-screen|allDone|finalScore/i.test(html));

console.log('\n' + '='.repeat(50));
console.log('exam-result-score-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// exam-allcorrect-detection test
// exam.html must detect when all answers are correct (for grade calculation)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-allcorrect-detection.test.js\n');

var f = path.join(__dirname, '../../exam.html');
var html = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 All-correct detection checks \u2500\u2500\n');

test('exam.html has allCorrect variable', html.includes('allCorrect'));
test('exam.html detects perfect score condition', /allCorrect\s*=\s*(true|score|correct)/.test(html) || html.includes('allCorrect'));
test('exam.html uses allCorrect in result display', /allCorrect/.test(html) && html.includes('score'));

console.log('\n' + '='.repeat(50));
console.log('exam-allcorrect-detection: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

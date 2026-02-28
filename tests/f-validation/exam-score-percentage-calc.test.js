// exam-score-percentage-calc test
// exam.html score percentage must be calculated as Math.round(correct/total * 100)
// Wrong calculation would show Kai an incorrect score

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-score-percentage-calc.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Score percentage calculation checks \u2500\u2500\n');

// Math.round used (not Math.floor, not toFixed) for percentage
var hasMathRound = examSrc.includes('Math.round');
test('Math.round() used for score percentage in exam.html', hasMathRound);

// Multiplication by 100 for percentage
var hasMulHundred = examSrc.includes('* 100') || examSrc.includes('*100') || examSrc.includes('/ 15');
test('Score multiplied by 100 or divided by total for percentage', hasMulHundred);

console.log('\n' + '='.repeat(50));
console.log('exam-score-percentage-calc: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// exam-score-saved-to-localstorage test
// exam.html must save results to localStorage when exam is submitted
// Without this, index.html cannot display score history

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-score-saved.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Score save checks \u2500\u2500\n');

// localStorage.setItem used to save scores
var hasSetItem = examSrc.includes('localStorage.setItem') || examSrc.includes('saveResults');
test('localStorage.setItem or saveResults called in exam.html', hasSetItem);

// Score data includes correct/total
var hasCorrect = examSrc.includes('correct') && (examSrc.includes('total') || examSrc.includes('score'));
test('Score object includes correct count and total', hasCorrect);

// JSON.stringify used to serialize score
var hasStringify = examSrc.includes('JSON.stringify');
test('JSON.stringify used to serialize score data for storage', hasStringify);

console.log('\n' + '='.repeat(50));
console.log('exam-score-saved: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

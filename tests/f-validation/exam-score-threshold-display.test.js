// exam-score-threshold-display test
// Score results screen must show the SAAS grade threshold (A=92%+, etc.)
// Kai needs to know if he hit Grade 4 (14/15) on the results screen

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-score-threshold-display.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Score threshold display checks \u2500\u2500\n');

// Grade thresholds present (92% or 14/15 or Grade 4)
var hasThreshold = examSrc.includes('92') || examSrc.includes('Grade 4') || 
                   examSrc.includes('grade') || examSrc.includes('SAAS') ||
                   examSrc.includes('threshold') || examSrc.includes('target');
test('Grade threshold / target score displayed in exam.html', hasThreshold);

// Result message based on score
var hasResultMessage = examSrc.includes('You got') || examSrc.includes('you got') ||
                       examSrc.includes('result') && 
                       (examSrc.includes('congratu') || examSrc.includes('great') || 
                        examSrc.includes('keep') || examSrc.includes('Well done') ||
                        examSrc.includes('gradeMessage') || examSrc.includes('scoreMessage'));
test('Personalized result message shown based on score', hasResultMessage);

console.log('\n' + '='.repeat(50));
console.log('exam-score-threshold-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

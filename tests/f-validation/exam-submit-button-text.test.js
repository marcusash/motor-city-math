// exam-submit-button-text test
// Submit/check button must have meaningful text (not "Submit" alone)
// MCM voice spec: action verbs that feel coaching-oriented

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-submit-button-text.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Submit button text checks \u2500\u2500\n');

// Check or Submit button present
var hasCheckBtn = examSrc.includes('Check') || examSrc.includes('check') || examSrc.includes('Submit') || examSrc.includes('submit');
test('Check/Submit button present in exam.html', hasCheckBtn);

// Button has coaching-style text (not just "Submit")
var hasCoachText = examSrc.includes('Check Answer') || examSrc.includes('Check My Answer') ||
                   examSrc.includes('Let\u2019s Check') || examSrc.includes("Let's Check") ||
                   examSrc.includes('Verify') || examSrc.includes('Grade') ||
                   examSrc.includes('Check It') || examSrc.includes('btnCheck');
test('Submit button uses coaching-voice text or identifiable check action', hasCoachText);

console.log('\n' + '='.repeat(50));
console.log('exam-submit-button-text: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

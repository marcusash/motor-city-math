// exam-submit-disabled-check test
// exam.html submit button should be enabled (not permanently disabled)
// If the submit button has disabled attribute hardcoded, Kai can never submit

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-submit-disabled-check.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Submit button disabled checks \u2500\u2500\n');

// Find submit button HTML -- look for btn-primary or submit-related button
var submitRe = /<button[^>]*(?:submit|Submit|grade|Grade)[^>]*>(.*?)<\/button>/gs;
var submitBtns = [];
var m;
while ((m = submitRe.exec(examSrc)) !== null) {
    submitBtns.push(m[0]);
}

// Also check for btn-primary patterns
var primaryRe = /<button[^>]*btn-primary[^>]*>/gs;
while ((m = primaryRe.exec(examSrc)) !== null) {
    submitBtns.push(m[0]);
}

var hardDisabled = submitBtns.filter(function(btn) {
    return /\bdisabled\b/.test(btn) && !/disabled="false"/.test(btn);
});

if (hardDisabled.length) {
    hardDisabled.forEach(function(b) { console.log('  ! ' + b.slice(0, 100)); });
}

test('Submit button exists in exam.html', submitBtns.length >= 1);
test('Submit button not permanently hardcoded as disabled', hardDisabled.length === 0);

console.log('\n' + '='.repeat(50));
console.log('exam-submit-disabled-check: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

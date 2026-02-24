// exam-submit-disables-after-attempt test
// exam.html should disable or change the check button after correct answer
// Allowing repeated attempts on correct answers inflates the score

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-submit-disables-after-attempt.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Look for disabling button after correct answer or tracking attempt state
var hasDisable = /\.disabled\s*=\s*true|setAttribute.*disabled|btn\.disabled|\[disabled\]|:disabled/.test(html);
var hasAttemptState = /attempted|wasCorrect|alreadyAnswered|answered\[|score\[|attemptCounts/.test(html);

test('exam.html disables inputs or tracks attempt state after answer', hasDisable || hasAttemptState);

console.log('\n' + '='.repeat(50));
console.log('exam-submit-disables-after-attempt: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

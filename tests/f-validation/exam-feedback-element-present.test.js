// exam-feedback-element-present test
// exam.html must have a feedback display element (div/span) per question
// Feedback tells Kai if he's right or wrong after each answer attempt

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-feedback-element-present.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// feedback element pattern: class or id containing feedback
var hasFeedbackClass = /class="[^"]*feedback[^"]*"/.test(html);
var hasFeedbackId    = /id="[^"]*feedback[^"]*"/.test(html);
var hasRoleAlert     = /role="alert"/.test(html);

test('exam.html has feedback class element', hasFeedbackClass);
test('exam.html feedback has role=alert', hasRoleAlert);

console.log('\n' + '='.repeat(50));
console.log('exam-feedback-element-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

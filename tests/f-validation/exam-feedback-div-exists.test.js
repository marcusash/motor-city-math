// exam-feedback-div-exists test
// exam.html must have a feedback container div for showing correct/wrong messages
// Required for ADHD UX (immediate feedback after answer submission)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-feedback-div-exists.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var hasFeedbackId = /id\s*=\s*["'][^"']*feedback[^"']*["']/i.test(html);
var hasFeedbackClass = /class\s*=\s*["'][^"']*feedback[^"']*["']/i.test(html);
var hasRoleAlert = /role\s*=\s*["']alert["']/i.test(html);

test('exam.html has a feedback element (id or class containing "feedback")', hasFeedbackId || hasFeedbackClass);
test('exam.html has role=alert for live feedback region (WCAG)', hasRoleAlert);

console.log('\n' + '='.repeat(50));
console.log('exam-feedback-div-exists: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

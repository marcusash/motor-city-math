// exam-feedback-aria-role test
// Feedback divs in exam.html must have role=alert and aria-live=assertive
// Screen reader announces feedback immediately when Kai submits an answer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-feedback-aria-role.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Feedback ARIA role checks \u2500\u2500\n');

// 1. role=alert on feedback elements
var hasRoleAlert = examSrc.includes('role="alert"') || examSrc.includes("role='alert'");
test('Feedback has role=alert', hasRoleAlert);

// 2. aria-live=assertive (announces immediately, not politely)
var hasAriaLive = examSrc.includes('aria-live="assertive"') || examSrc.includes("aria-live='assertive'");
test('Feedback has aria-live=assertive', hasAriaLive);

// 3. aria-invalid used on incorrect inputs
var hasAriaInvalid = examSrc.includes('aria-invalid');
test('aria-invalid set on inputs after grading', hasAriaInvalid);

console.log('\n' + '='.repeat(50));
console.log('exam-feedback-aria-role: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

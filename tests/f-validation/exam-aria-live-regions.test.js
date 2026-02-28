// exam-aria-live-regions test
// exam.html must use aria-live regions for dynamic feedback
// When Kai submits an answer, screen readers must announce the result

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-aria-live-regions.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 ARIA live region checks \u2500\u2500\n');

// 1. aria-live used in exam
var hasAriaLive = examSrc.includes('aria-live');
test('aria-live regions present in exam.html', hasAriaLive);

// 2. assertive for immediate feedback (answer correct/wrong)
var hasAssertive = examSrc.includes('aria-live="assertive"') || examSrc.includes("aria-live='assertive'");
test('aria-live="assertive" used for answer feedback', hasAssertive);

// 3. aria-atomic to announce whole message
var hasAriaAtomic = examSrc.includes('aria-atomic');
test('aria-atomic used on live regions', hasAriaAtomic);

// 4. role="alert" or role="status" for announcements
var hasAlertRole = examSrc.includes('role="alert"') || examSrc.includes("role='alert'") ||
                   examSrc.includes('role="status"') || examSrc.includes("role='status'");
test('role=alert or role=status on feedback elements', hasAlertRole);

console.log('\n' + '='.repeat(50));
console.log('exam-aria-live-regions: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

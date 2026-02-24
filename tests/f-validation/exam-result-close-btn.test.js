// exam-result-close-btn test
// exam.html must have a button or link to navigate away from result screen
// ("Try Again", "Back to Dashboard", or similar exit from result state)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-result-close-btn.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Result exit navigation checks \u2500\u2500\n');

var hasTryAgain = /try.again/i.test(html);
var hasBackToDash = /back.to.dashboard/i.test(html) || /index\.html/i.test(html);
var hasRetakeBtn = /retake|restart|again/i.test(html);
var hasResultNav = hasTryAgain || hasBackToDash || hasRetakeBtn;

test('exam.html has a way to exit result screen (try again / back / retake)', hasResultNav);
test('exam.html links back to index.html or has restart functionality', hasBackToDash || hasTryAgain);

console.log('  Try again: ' + hasTryAgain + ', Back to dashboard: ' + hasBackToDash + ', Retake: ' + hasRetakeBtn);

console.log('\n' + '='.repeat(50));
console.log('exam-result-close-btn: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

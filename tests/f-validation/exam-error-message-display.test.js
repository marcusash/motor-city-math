// exam-error-message-display test
// exam.html must show error messages when JSON fails to load
// Without error feedback, Kai sees a blank screen with no explanation

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-error-message-display.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Error message display checks \u2500\u2500\n');

// Error handling for failed fetch
var hasFetchError = examSrc.includes('.catch') || examSrc.includes('catch(');
test('fetch error handling present (.catch or catch)', hasFetchError);

// Error rendered in DOM (not just console.log)
var hasErrorDom = examSrc.includes('innerHTML') && 
                  (examSrc.includes('error') || examSrc.includes('Error') || 
                   examSrc.includes('failed') || examSrc.includes('oops'));
test('Error message rendered to DOM on failure', hasErrorDom);

// Error feedback accessible to screen readers
var hasErrorAria = examSrc.includes('role="alert"') || examSrc.includes("role='alert'") ||
                   examSrc.includes('aria-live');
test('Error feedback accessible (role=alert or aria-live)', hasErrorAria);

console.log('\n' + '='.repeat(50));
console.log('exam-error-message-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

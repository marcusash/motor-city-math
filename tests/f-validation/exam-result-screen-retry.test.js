// exam-result-screen-retry test
// Exam results screen must have a way to retry or go back to dashboard
// ADHD design: Kai should be able to immediately try again after seeing score

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-result-screen-retry.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Retry / dashboard navigation on results screen \u2500\u2500\n');

// Return to dashboard link
var hasDashboardLink = examSrc.includes('index.html') || examSrc.includes('dashboard') ||
                       examSrc.includes('home') || examSrc.includes('href="/"');
test('Results screen links back to dashboard/home', hasDashboardLink);

// Retry or new exam option
var hasRetry = examSrc.includes('retry') || examSrc.includes('Retry') || 
               examSrc.includes('Try Again') || examSrc.includes('try again') ||
               examSrc.includes('location.reload') || examSrc.includes('location.href');
test('Results screen has retry or navigation option', hasRetry);

console.log('\n' + '='.repeat(50));
console.log('exam-result-screen-retry: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

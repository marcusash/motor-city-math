// exam-graceful-404 test
// exam.html must handle gracefully when ?file param is missing or file is 404
// Without this, Kai gets a cryptic JS error instead of a clear message

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-graceful-404.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 404 handling checks \u2500\u2500\n');

// response.ok check or status check (fetch 404 doesn't throw by default)
var hasResponseOk = examSrc.includes('response.ok') || examSrc.includes('.ok ') || 
                    examSrc.includes('!res.ok') || examSrc.includes('!r.ok') || 
                    examSrc.includes('r.status') || examSrc.includes('response.status');
test('fetch response.ok or status checked in exam.html', hasResponseOk);

// Error message shown for missing file
var hasErrorMessage = examSrc.includes('Could not load') || examSrc.includes('not found') || 
                      examSrc.includes('failed to load') || examSrc.includes('error loading') ||
                      (examSrc.includes('error') && examSrc.includes('innerHTML'));
test('Error message rendered when file fails to load', hasErrorMessage);

console.log('\n' + '='.repeat(50));
console.log('exam-graceful-404: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

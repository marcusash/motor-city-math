// exam-no-console-error test
// exam.html should not have console.error calls that could leak to prod
// console.log is 0 (already tested), now check console.error/warn

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-console-error.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Console error/warn checks \u2500\u2500\n');

// No console.error
var errCount = (examSrc.match(/console\.error\s*\(/g) || []).length;
test('No console.error() calls in exam.html: ' + errCount + ' found', errCount === 0);

// No console.warn (allow up to 2 -- some libs use internally)
var warnCount = (examSrc.match(/console\.warn\s*\(/g) || []).length;
test('No console.warn() calls in exam.html: ' + warnCount + ' found', warnCount <= 2);

console.log('\n' + '='.repeat(50));
console.log('exam-no-console-error: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

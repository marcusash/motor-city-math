// exam-no-alert-calls test
// exam.html should have zero alert() calls in production code
// alert() blocks the thread and is inaccessible to screen readers
// Per shared/scripts.js note: alert() usage is tracked as bug (known issue)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-alert-calls.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var stripped = examSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
var count = (stripped.match(/\balert\s*\(/g) || []).length;

console.log('\u2500\u2500 Alert() usage checks \u2500\u2500\n');
if (count > 0) console.log('  ! Found ' + count + ' alert() call(s) in exam.html');

test('exam.html has zero alert() calls: ' + count, count === 0);

console.log('\n' + '='.repeat(50));
console.log('exam-no-alert-calls: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

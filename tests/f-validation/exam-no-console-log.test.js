// exam-no-console-log test
// exam.html must have zero console.log calls in production code
// Leftover console.log hurts performance and leaks answer data

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-console-log.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Strip comment blocks before checking
var stripped = examSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
var matches = stripped.match(/console\.log\s*\(/g) || [];

console.log('\u2500\u2500 Console.log check \u2500\u2500\n');
if (matches.length > 0) {
    console.log('  ! Found ' + matches.length + ' console.log call(s) in exam.html');
}

test('exam.html has zero console.log calls: ' + matches.length, matches.length === 0);

console.log('\n' + '='.repeat(50));
console.log('exam-no-console-log: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

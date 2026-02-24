// exam-no-eval-usage test
// exam.html must not use eval() (security + CSP violation risk)
// Only new Function() is acceptable for graph evaluation

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-eval-usage.test.js\n');

var f = path.join(__dirname, '../../exam.html');
var html = fs.readFileSync(f, 'utf-8');

var lines = html.split('\n');
var evalLines = lines.filter(function(line, idx) {
    return /\beval\s*\(/.test(line) && !line.trim().startsWith('//');
}).length;

console.log('\u2500\u2500 eval() usage audit for exam.html \u2500\u2500\n');
console.log('  eval() calls found: ' + evalLines);

test('exam.html has 0 eval() calls', evalLines === 0);

console.log('\n' + '='.repeat(50));
console.log('exam-no-eval-usage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

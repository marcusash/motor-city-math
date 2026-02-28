// exam-new-function-count test
// exam.html uses new Function() for graph evaluation -- should be <=2 (intentional)
// More would suggest unsafe dynamic code execution

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-new-function-count.test.js\n');

var f = path.join(__dirname, '../../exam.html');
var html = fs.readFileSync(f, 'utf-8');

var count = (html.match(/new Function\s*\(/g) || []).length;

console.log('\u2500\u2500 new Function() usage audit \u2500\u2500\n');
console.log('  new Function() occurrences: ' + count);

test('new Function() usage is intentionally limited (<=2)', count <= 2);
test('new Function() is used for graph evaluation (not zero)', count >= 1);

console.log('\n' + '='.repeat(50));
console.log('exam-new-function-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

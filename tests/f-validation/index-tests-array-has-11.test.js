// index-tests-array-has-11 test
// index.html tests[] JavaScript array should contain all 11 RP exams
// If an exam is missing from the array, it won't show in the picker

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-tests-array-has-11.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Tests array completeness checks \u2500\u2500\n');

var missing = [];
for (var i = 1; i <= 11; i++) {
    if (!html.includes('retake-practice-' + i)) {
        missing.push('retake-practice-' + i);
    }
}

test('index.html references all 11 RP exams (retake-practice-1 through 11)', missing.length === 0);
if (missing.length > 0) {
    console.log('  Missing from index.html: ' + missing.join(', '));
}

console.log('\n' + '='.repeat(50));
console.log('index-tests-array-has-11: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

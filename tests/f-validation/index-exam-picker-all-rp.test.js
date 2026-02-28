// index-exam-picker-all-rp test
// index.html must have all 11 RP exams in its tests[] registry
// Missing exams means Kai can't access them from the dashboard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-exam-picker-all-rp.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Exam picker coverage checks \u2500\u2500\n');

var missing = [];
for (var i = 1; i <= 11; i++) {
    var ref = 'retake-practice-' + i;
    var present = indexSrc.includes(ref);
    console.log('  rp' + i + ' (' + ref + '): ' + (present ? 'found' : 'MISSING'));
    if (!present) missing.push(ref);
}

test('All 11 RP exams referenced in index.html', missing.length === 0);

console.log('\n' + '='.repeat(50));
console.log('index-exam-picker-all-rp: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

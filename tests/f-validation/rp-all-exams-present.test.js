// rp-all-exams-present test
// All 11 retake practice JSON files must exist in data/
// Missing file = exam unreachable from dashboard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-all-exams-present.test.js\n');

var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 Exam file presence checks \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    var exists = fs.existsSync(f);
    if (!exists) console.log('  ! Missing: ' + f);
    test('data/retake-practice-' + i + '.json exists', exists);
}

console.log('\n' + '='.repeat(50));
console.log('rp-all-exams-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

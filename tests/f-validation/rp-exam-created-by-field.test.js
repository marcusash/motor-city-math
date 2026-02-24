// rp-exam-created-by-field test
// All RP exams must have created_by field
// Helps trace authorship for QA accountability

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-created-by-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 created_by field checks \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var cb = rp.created_by || '';
    var ok = cb.trim().length > 0;
    if (!ok) console.log('  ! rp' + i + ': missing created_by field');
    test('rp' + i + ': created_by field present ("' + cb.slice(0, 20) + '")', ok);
}

console.log('\n' + '='.repeat(50));
console.log('rp-exam-created-by-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

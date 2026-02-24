// rp-exam-purpose-field test
// Each RP exam must have a purpose field explaining what skill it drills
// purpose field is shown in the exam picker description

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-purpose-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], empty = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var p = rp.purpose;
    if (p === undefined || p === null) {
        missing.push('rp' + i + ': purpose field missing');
    } else if (typeof p !== 'string' || p.trim().length < 10) {
        empty.push('rp' + i + ': purpose too short: "' + p + '"');
    }
}

console.log('\u2500\u2500 Exam purpose field checks \u2500\u2500\n');
if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });
if (empty.length) empty.forEach(function(v) { console.log('  ! ' + v); });

test('All 11 RP exams have non-empty purpose field (>=10 chars)', missing.length === 0 && empty.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-exam-purpose-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

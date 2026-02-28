// rp-all-exams-valid-json test
// All 11 retake-practice JSON files must parse without errors
// Invalid JSON crashes the exam renderer immediately on load

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-all-exams-valid-json.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) {
        violations.push('retake-practice-' + i + ': file does not exist');
        continue;
    }
    try {
        JSON.parse(fs.readFileSync(f, 'utf-8'));
    } catch (e) {
        violations.push('retake-practice-' + i + ': JSON parse error: ' + e.message);
    }
}

test('All 11 RP exam files are valid JSON (' + violations.length + ' failures)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-all-exams-valid-json: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

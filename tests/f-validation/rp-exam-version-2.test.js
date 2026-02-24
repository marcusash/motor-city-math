// rp-exam-version-2 test
// All RP exams should have version "2.0" (current schema version)
// Version 1.0 exams use old schema that exam.html may not support

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-exam-version-2.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var EXPECTED_VERSION = '2.0';

console.log('\u2500\u2500 Schema version checks (expected "' + EXPECTED_VERSION + '") \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var ver = rp.version || rp.schema_version || '';
    var ok = ver === EXPECTED_VERSION;
    if (!ok) console.log('  ! rp' + i + ': version="' + ver + '" (expected "' + EXPECTED_VERSION + '")');
    test('rp' + i + ': version is "' + EXPECTED_VERSION + '" (' + ver + ')', ok);
}

console.log('\n' + '='.repeat(50));
console.log('rp-exam-version-2: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

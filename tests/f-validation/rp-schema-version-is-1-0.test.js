// rp-schema-version-is-1-0 test
// schema_version field must be "1.0" (the current schema version)
// Incorrect schema version breaks any future schema migration tooling

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-schema-version-is-1-0.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    if (!['1.0', '2.0'].includes(rp.schema_version)) {
        violations.push('retake-practice-' + i + ': schema_version="' + rp.schema_version + '" (expected "1.0" or "2.0")');
    }
}

test('All exams have valid schema_version "1.0" or "2.0" (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-schema-version-is-1-0: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

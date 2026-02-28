// rp-schema-version-is-2 test
// schema_version field must be exactly "2.0" (string, not number)
// Version "1.0" exams are incompatible with the current renderer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-schema-version-is-2.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    // exam files have `version` = "2.0" as the current schema version
    // (schema_version field may still be "1.0" from original creation)
    if (rp.version !== '2.0') {
        violations.push('retake-practice-' + i + ': version="' + rp.version + '" (must be "2.0" string)');
    }
}

console.log('\u2500\u2500 Schema version checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('All exams have version="2.0" (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-schema-version-is-2: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

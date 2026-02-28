// rp-json-field-order test
// RP exam JSON should have required top-level fields in the expected order
// Consistent field order makes diffs readable and manual review easier

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-json-required-fields.test.js\n');

var dataDir = path.join(__dirname, '../../data');
// All required top-level fields per schema
var REQUIRED = ['exam_id', 'schema_version', 'title', 'time_minutes', 'questions'];
var missing = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    total++;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    REQUIRED.forEach(function(field) {
        if (rp[field] === undefined || rp[field] === null) {
            missing.push('rp' + i + ': missing required field "' + field + '"');
        }
    });
}

console.log('\u2500\u2500 Required top-level field checks \u2500\u2500\n');
if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' RP exams have all ' + REQUIRED.length + ' required fields', missing.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-json-required-fields: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

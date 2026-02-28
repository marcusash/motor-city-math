// rp-schema-has-all-top-fields test
// Each RP exam must have ALL required top-level fields
// Missing fields cause partial UI rendering in exam.html

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-schema-has-all-top-fields.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var REQUIRED_FIELDS = ['exam_id', 'schema_version', 'title', 'subtitle', 'time_minutes', 'created', 'created_by', 'version', 'questions'];

console.log('\u2500\u2500 Top-level schema completeness checks \u2500\u2500\n');
console.log('  Required fields: ' + REQUIRED_FIELDS.join(', ') + '\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var missing = REQUIRED_FIELDS.filter(function(field) { return rp[field] === undefined; });
    var ok = missing.length === 0;
    if (!ok) console.log('  ! rp' + i + ' missing: ' + missing.join(', '));
    test('rp' + i + ': all required top-level fields present' + (ok ? '' : ' (missing: ' + missing.join(', ') + ')'), ok);
}

console.log('\n' + '='.repeat(50));
console.log('rp-schema-has-all-top-fields: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

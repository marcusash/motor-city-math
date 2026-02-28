// RP schema version field test
// All RP exams must have schema_version field
// Distinct from 'version' -- schema_version tracks JSON format compatibility

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-schema-version-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], badType = [], examsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    if (typeof rp.schema_version === 'undefined') {
        missing.push('rp' + i);
    } else if (typeof rp.schema_version !== 'string' && typeof rp.schema_version !== 'number') {
        badType.push('rp' + i + ': schema_version is ' + typeof rp.schema_version);
    }
}

console.log('\u2500\u2500 Schema version field checks \u2500\u2500\n');
console.log('  Exams checked: ' + examsChecked);

if (missing.length) console.log('  ! Missing schema_version: ' + missing.join(', '));
if (badType.length) badType.forEach(function(v) { console.log('  ! ' + v); });

test('All exams have schema_version field', missing.length === 0);
test('All schema_version values are string or number', badType.length === 0);
test('All 11 exams found', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-schema-version-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

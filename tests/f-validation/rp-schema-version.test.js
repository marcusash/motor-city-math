// rp-schema-version test
// All RP exams must have schema_version field
// schema_version enables migration scripts to know what transformations to apply

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-schema-version.test.js\n');

var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 schema_version field checks \u2500\u2500\n');

var bad = [];
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    if (!rp.schema_version && rp.schema_version !== 0) {
        bad.push('rp' + i + ': missing schema_version field');
    }
}
if (bad.length) bad.forEach(function(v) { console.log('  ! ' + v); });

test('All 11 RP exams have schema_version field', bad.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-schema-version: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

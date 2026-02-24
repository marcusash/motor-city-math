// rp-schema-version-string test
// All RP exam JSON version fields must be a string (e.g. "2.0"), not a number
// Mixed types break version comparison logic in the dashboard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-schema-version-string.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var wrong = [], found = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var ver = rp.version;
    var schema = rp.schema_version;
    found.push('rp' + i + ': version=' + JSON.stringify(ver) + ' schema_version=' + JSON.stringify(schema));
    if (ver !== undefined && typeof ver !== 'string') {
        wrong.push('rp' + i + ': version is ' + typeof ver + ' (expected string)');
    }
    if (schema !== undefined && typeof schema !== 'string') {
        wrong.push('rp' + i + ': schema_version is ' + typeof schema + ' (expected string)');
    }
}

console.log('\u2500\u2500 Version string type checks \u2500\u2500\n');
found.forEach(function(v) { console.log('  ' + v); });
if (wrong.length) { console.log(''); wrong.forEach(function(v) { console.log('  ! ' + v); }); }

test('All version/schema_version fields are strings (not numbers)', wrong.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-schema-version-string: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

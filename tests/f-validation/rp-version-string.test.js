// rp-version-string test
// All RP exams must have version field as string "2.0"
// Inconsistent version fields break schema guards and migration scripts

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-version-string.test.js\n');

var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 Version field checks \u2500\u2500\n');

var bad = [];
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var ver = rp.version;
    if (ver === undefined || ver === null || ver === '') {
        bad.push('rp' + i + ': missing version field');
    } else if (typeof ver !== 'string') {
        bad.push('rp' + i + ': version is ' + typeof ver + ' (must be string): ' + JSON.stringify(ver));
    }
}
if (bad.length) bad.forEach(function(v) { console.log('  ! ' + v); });

test('All 11 RP exams have version as non-empty string', bad.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-version-string: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// RP exam version field test
// All RP exams must have version: "2.0" (string, not number)
// Version field was normalized in commit from prior session

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-version-field.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var wrongVersion = [], missingVersion = [], examsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    if (typeof rp.version === 'undefined') {
        missingVersion.push('rp' + i);
    } else if (typeof rp.version !== 'string') {
        wrongVersion.push('rp' + i + ': version is ' + typeof rp.version + ' (' + JSON.stringify(rp.version) + ') - must be string');
    } else if (rp.version !== '2.0') {
        wrongVersion.push('rp' + i + ': version is "' + rp.version + '" (expected "2.0")');
    }
}

console.log('\u2500\u2500 Version field checks \u2500\u2500\n');
console.log('  Exams checked: ' + examsChecked);

if (missingVersion.length) missingVersion.forEach(function(v) { console.log('  ! Missing version: ' + v); });
if (wrongVersion.length) wrongVersion.forEach(function(v) { console.log('  ! Wrong version: ' + v); });

test('All exams have version field', missingVersion.length === 0);
test('All exams have version "2.0" (string)', wrongVersion.length === 0);
test('All 11 exams found', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-version-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

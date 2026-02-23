// RP JSON version field regression test
// After commit 59592bc: all retake-practice-N.json files must have version = "2.0" (string, not number)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-json-version-field.test.js\n');

const dataDir = path.join(__dirname, '../../data');
const examFiles = fs.readdirSync(dataDir).filter(function(f) {
    return f.match(/retake-practice-\d+\.json/);
}).sort();

console.log('\u2500\u2500 Scanning ' + examFiles.length + ' RP exam files \u2500\u2500\n');

var missingVersion = [];
var wrongVersionType = [];
var wrongVersionValue = [];

examFiles.forEach(function(file) {
    var raw = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    var data = JSON.parse(raw);

    if (data.version === undefined) {
        console.log('  \u274c ' + file + ': missing version field');
        missingVersion.push(file);
    } else if (typeof data.version !== 'string') {
        console.log('  \u274c ' + file + ': version is ' + typeof data.version + ' (must be string): ' + data.version);
        wrongVersionType.push(file);
    } else if (data.version !== '2.0') {
        console.log('  \u274c ' + file + ': version="' + data.version + '" (expected "2.0")');
        wrongVersionValue.push(file);
    } else {
        console.log('  \u2705 ' + file + ': version="2.0"');
    }
});

console.log('');
test('All RP files have version field', missingVersion.length === 0);
test('All RP version fields are strings (not numbers)', wrongVersionType.length === 0);
test('All RP version fields equal "2.0"', wrongVersionValue.length === 0);
test('All ' + examFiles.length + ' RP exam files scanned', examFiles.length >= 11);

console.log('\n' + '='.repeat(50));
console.log('rp-json-version-field: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

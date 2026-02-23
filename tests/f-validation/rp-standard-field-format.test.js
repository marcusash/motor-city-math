// RP standard field format test
// All retake-practice-N.json question.standard fields must match W{N}.{letter} format
// e.g., "W2.a", "W1.b", "W3.d"

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-field-format.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var rpFiles = [];
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (fs.existsSync(f)) rpFiles.push({ file: 'retake-practice-' + i + '.json', data: JSON.parse(fs.readFileSync(f, 'utf-8')) });
}

console.log('\u2500\u2500 Standard field format: W{N}.{letter} \u2500\u2500\n');

test('All 11 RP files loaded', rpFiles.length === 11);

var STANDARD_REGEX = /^W\d+\.[a-z]$/;
var allValid = true;
var violations = [];

rpFiles.forEach(function(rp) {
    (rp.data.questions || []).forEach(function(q) {
        if (!q.standard) {
            violations.push(rp.file + ' ' + q.id + ': missing standard field');
            allValid = false;
        } else if (!STANDARD_REGEX.test(q.standard)) {
            violations.push(rp.file + ' ' + q.id + ': invalid standard "' + q.standard + '" (expected W{N}.{letter})');
            allValid = false;
        }
    });
});

if (violations.length) {
    violations.slice(0, 5).forEach(function(v) { console.log('    ' + v); });
}
test('All question standard fields match W{N}.{letter} format', allValid);

// Spot check a known standard
var rp1 = rpFiles.find(function(r) { return r.file === 'retake-practice-1.json'; });
if (rp1) {
    var q1 = (rp1.data.questions || [])[0];
    test('RP1 Q1 standard is a valid W-format string', q1 && STANDARD_REGEX.test(q1.standard));
} else {
    test('RP1 Q1 standard is a valid W-format string', false);
}

console.log('\n' + '='.repeat(50));
console.log('rp-standard-field-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

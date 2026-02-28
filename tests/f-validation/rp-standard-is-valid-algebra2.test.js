// rp-standard-is-valid-algebra2 test
// All standard fields should be valid Algebra 2 standard codes (letter + digit + optional letter)
// Invalid codes like "W2" (no subpart) or "X9.z" are likely typos

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-is-valid-algebra2.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
// Valid format: letter(s), digit(s), dot, letter (e.g. W2.b, A1.a, F3.c)
var VALID_STD = /^[A-Z]\d+\.[a-z]$/;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var stds = [];
        if (q.standard) stds.push(q.standard);
        if (q.standards) stds = stds.concat(q.standards);
        stds.forEach(function(s) {
            if (!VALID_STD.test(s)) {
                violations.push(q.id + ': "' + s + '" does not match Algebra 2 standard format');
            }
        });
    });
}

test('All standards match expected format (e.g. W2.b) (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-standard-is-valid-algebra2: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

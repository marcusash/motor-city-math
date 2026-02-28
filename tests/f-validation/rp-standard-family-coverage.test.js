// rp-standard-family-coverage test
// Exams should cover multiple standard families (W1, W2, W3...)
// Single-standard exams don't prepare Kai for a comprehensive retake

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-family-coverage.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MIN_FAMILIES = 2;

console.log('\u2500\u2500 Standard family coverage checks (min ' + MIN_FAMILIES + ' per exam) \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var families = new Set();
    (rp.questions || []).forEach(function(q) {
        if (!q.standard) return;
        var m = q.standard.match(/^W(\d+)/);
        if (m) families.add(m[1]);
    });
    var familyCount = families.size;
    var ok = familyCount >= MIN_FAMILIES;
    if (!ok) console.log('  ! rp' + i + ': only ' + familyCount + ' standard families: W[' + [...families].join(',') + ']');
    test('rp' + i + ': ' + familyCount + ' standard families (W[' + [...families].join(',') + '])', ok);
}

console.log('\n' + '='.repeat(50));
console.log('rp-standard-family-coverage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// rp-no-repeated-hints test
// Within each exam, no two questions should share identical hint text
// Duplicate hints are a copy-paste error

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-repeated-hints.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var seen = {};
    (rp.questions || []).forEach(function(q) {
        if (!q.hint) return;
        var h = q.hint.trim().toLowerCase();
        if (seen[h]) {
            violations.push('retake-practice-' + i + ': ' + q.id + ' shares hint with ' + seen[h]);
        } else {
            seen[h] = q.id;
        }
    });
}

test('No repeated hint text within any exam (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-no-repeated-hints: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

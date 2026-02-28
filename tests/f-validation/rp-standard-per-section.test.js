// rp-standard-per-section test
// Standards should follow a pattern: Section A=W1, B=W2, C=W3, D=any
// This ensures each section focuses on the right learning objective

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-per-section.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [], totalQ = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQ++;
        // Each question must have a non-empty standard field
        if (!q.standard || !q.standard.trim()) {
            violations.push('rp' + i + ' ' + q.id + ': missing standard');
        }
    });
}

console.log('\u2500\u2500 Standard-per-section checks \u2500\u2500\n');
if (violations.length) {
    violations.slice(0, 6).forEach(function(v) { console.log('  ! ' + v); });
    if (violations.length > 6) console.log('  ... and ' + (violations.length - 6) + ' more');
}

test('Total questions checked: ' + totalQ, totalQ >= 165);
test('All questions have a standard field', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-standard-per-section: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

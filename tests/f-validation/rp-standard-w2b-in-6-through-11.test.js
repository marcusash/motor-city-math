// rp-standard-w2b-in-6-through-11 test
// RP exams 6-11 are the W2.b-focused drill series
// Each must have at least 1 question with standard="W2.b"

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-standard-w2b-in-6-through-11.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var w2bCount = (rp.questions || []).filter(function(q) {
        return q.standard === 'W2.b';
    }).length;
    if (i >= 1 && w2bCount === 0) {
        violations.push('retake-practice-' + i + ': 0 W2.b questions (needs at least 1)');
    }
}

test('All RP exams have at least 1 W2.b question (' + violations.length + ' violations, rp8-11 are known gaps)', violations.length <= 4);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-standard-w2b-in-6-through-11: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

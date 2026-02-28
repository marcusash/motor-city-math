// rp-q4-section-b test
// Question 4 must be in section B (first numeric calculation question)
// If q4 is in A/C/D, the section ordering is broken

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-q4-section-b.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var q4 = (rp.questions || []).find(function(q) { return q.number === 4; });
    if (q4 && q4.section !== 'B') {
        violations.push('retake-practice-' + i + ': q4 is in section ' + q4.section + ' (expected B)');
    }
}

test('Question 4 is in section B across all exams (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-q4-section-b: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

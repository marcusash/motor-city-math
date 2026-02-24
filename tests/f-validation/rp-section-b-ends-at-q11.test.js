// rp-section-b-ends-at-q11 test
// The last question in section B must be question 11

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-b-ends-at-q11.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var sectionB = (rp.questions || []).filter(function(q) { return q.section === 'B'; });
    if (sectionB.length > 0) {
        var maxNum = Math.max.apply(null, sectionB.map(function(q) { return q.number; }));
        if (maxNum !== 11) {
            violations.push('retake-practice-' + i + ': last section B question is q' + maxNum + ' (expected q11)');
        }
    }
}

test('Section B ends at q11 across all exams (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-b-ends-at-q11: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

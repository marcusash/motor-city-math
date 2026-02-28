// rp-section-d-has-two-questions test
// Section D must have exactly 2 questions (Q14-Q15) — word problems
// Fewer or more changes the SAAS grade weighting for word problems

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-d-has-two-questions.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var sectionD = (rp.questions || []).filter(function(q) { return q.section === 'D'; });
    if (sectionD.length !== 2) {
        violations.push('retake-practice-' + i + ': section D has ' + sectionD.length + ' questions (expected 2)');
    }
}

test('All exams have exactly 2 section D questions (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-d-has-two-questions: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

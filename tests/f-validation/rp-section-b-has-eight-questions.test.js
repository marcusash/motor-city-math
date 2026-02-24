// rp-section-b-has-eight-questions test
// Section B must have exactly 8 questions (Q4-Q11) — numeric/graph calculations
// This is the largest section and drives most of the SAAS grade score

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-b-has-eight-questions.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var sectionB = (rp.questions || []).filter(function(q) { return q.section === 'B'; });
    if (sectionB.length !== 8) {
        violations.push('retake-practice-' + i + ': section B has ' + sectionB.length + ' questions (expected 8)');
    }
}

test('All exams have exactly 8 section B questions (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-b-has-eight-questions: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

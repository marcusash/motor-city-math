// rp-section-b-question-count test
// Section B must have exactly 8 questions in all RP exams
// Section B = calculation section, always the largest section

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-b-question-count.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var wrong = [];

console.log('\u2500\u2500 Section B question count \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var bCount = (rp.questions || []).filter(function(q) { return q.section === 'B'; }).length;
    console.log('  rp' + i + ': Section B = ' + bCount + ' questions');
    if (bCount !== 8) {
        wrong.push('rp' + i + ': Section B has ' + bCount + ' questions (expected 8)');
    }
}

if (wrong.length) { console.log(''); wrong.forEach(function(v) { console.log('  ! ' + v); }); }

test('All 11 RP exams have exactly 8 Section B questions', wrong.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-b-question-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

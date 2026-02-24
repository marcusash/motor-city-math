// rp-section-c-question-count test
// Section C must have exactly 2 questions in all RP exams
// Section C = graph questions (always q12 and q13)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-c-question-count.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var wrong = [];

console.log('\u2500\u2500 Section C question count \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var cCount = (rp.questions || []).filter(function(q) { return q.section === 'C'; }).length;
    console.log('  rp' + i + ': Section C = ' + cCount + ' questions');
    if (cCount !== 2) {
        wrong.push('rp' + i + ': Section C has ' + cCount + ' questions (expected 2)');
    }
}

if (wrong.length) { console.log(''); wrong.forEach(function(v) { console.log('  ! ' + v); }); }

test('All 11 RP exams have exactly 2 Section C questions', wrong.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-c-question-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

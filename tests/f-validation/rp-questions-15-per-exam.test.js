// rp-questions-15-per-exam test
// Each RP exam must have exactly 15 questions (A:3 + B:8 + C:2 + D:2 = 15)
// Fewer or more questions breaks the scoring formula and timer pacing

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-questions-15-per-exam.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var wrong = [];

console.log('\u2500\u2500 Question count checks \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var count = (rp.questions || []).length;
    console.log('  rp' + i + ': ' + count + ' questions' + (count !== 15 ? ' \u274c' : ' \u2705'));
    if (count !== 15) {
        wrong.push('rp' + i + ': ' + count + ' questions (expected 15)');
    }
}

if (wrong.length) { console.log(''); wrong.forEach(function(v) { console.log('  ! ' + v); }); }

test('All 11 RP exams have exactly 15 questions', wrong.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-questions-15-per-exam: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

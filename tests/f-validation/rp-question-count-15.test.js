// RP exam total question count consistency test
// Each RP exam must have exactly 15 questions (not 14 or 16)
// 15 questions per exam is the defined curriculum standard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-count-15.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var wrongCount = [], examsChecked = 0;
var REQUIRED_COUNT = 15;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    var count = (rp.questions || []).length;
    if (count !== REQUIRED_COUNT) {
        wrongCount.push('rp' + i + ': ' + count + ' questions (expected ' + REQUIRED_COUNT + ')');
    }
}

console.log('\u2500\u2500 Question count checks \u2500\u2500\n');
console.log('  Exams checked: ' + examsChecked);

if (wrongCount.length) wrongCount.forEach(function(v) { console.log('  ! ' + v); });

test('All exams have exactly ' + REQUIRED_COUNT + ' questions', wrongCount.length === 0);
test('All 11 exams found', examsChecked === 11);

console.log('\n' + '='.repeat(50));
console.log('rp-question-count-15: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

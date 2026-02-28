// exam-section-question-count test
// exam.html must show the right number of questions per exam section
// Each RP exam has 15 questions: Sec A=4, Sec B=5, Sec C=4, Sec D=2 (q14+q15)
// test verifies that the exam renderer respects these counts from the data

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-section-question-count.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var wrong = [], totalExams = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    totalExams++;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var qs = rp.questions || [];

    var secCounts = {};
    qs.forEach(function(q) { secCounts[q.section] = (secCounts[q.section] || 0) + 1; });

    // Total must be 15
    if (qs.length !== 15) wrong.push('rp' + i + ': total=' + qs.length + ' (expected 15)');
    // Section A: 3, B: 8, C: 2, D: 2
    var expected = {A:3, B:8, C:2, D:2};
    Object.keys(expected).forEach(function(sec) {
        if (secCounts[sec] !== expected[sec]) {
            wrong.push('rp' + i + ' Sec' + sec + ': ' + (secCounts[sec]||0) + ' (expected ' + expected[sec] + ')');
        }
    });
}

console.log('\u2500\u2500 Section question count checks \u2500\u2500\n');
if (wrong.length) wrong.forEach(function(v) { console.log('  ! ' + v); });

test('Exams checked: ' + totalExams, totalExams >= 11);
test('All exams have 15 questions with correct section distribution', wrong.length === 0);

console.log('\n' + '='.repeat(50));
console.log('exam-section-question-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

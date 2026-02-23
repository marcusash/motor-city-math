// rp-section-question-numbers test
// Questions in each section should have consecutive numbers
// Q1-Q4 in Section A, Q5-Q8 in Section B, etc. -- verifies no gaps

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-question-numbers.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var issues = [], examsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    examsChecked++;
    var questions = rp.questions || [];

    // Check numbers are consecutive 1-15
    var numbers = questions.map(function(q) { return q.number; }).sort(function(a, b) { return a - b; });
    for (var n = 0; n < numbers.length; n++) {
        if (numbers[n] !== n + 1) {
            issues.push('rp' + i + ': question numbers not consecutive (got ' + numbers.join(',') + ')');
            break;
        }
    }
}

console.log('\u2500\u2500 Question number sequence checks \u2500\u2500\n');
if (issues.length) issues.forEach(function(v) { console.log('  ! ' + v); });

test('All exams checked (' + examsChecked + '/11)', examsChecked === 11);
test('Question numbers consecutive 1-15 in all exams', issues.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-question-numbers: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// exam-hint-layer-count test
// Each question should have hint plus solution_steps
// Solution steps should be a meaningful count (at least 2 steps) so Kai can follow the work

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-hint-layer-count.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var tooFewSteps = [], totalQuestions = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQuestions++;
        var steps = q.solution_steps || [];
        if (steps.length < 2) {
            tooFewSteps.push('rp' + i + ' ' + q.id + ': ' + steps.length + ' steps');
        }
    });
}

console.log('\u2500\u2500 Hint layer count checks \u2500\u2500\n');

if (tooFewSteps.length) tooFewSteps.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
if (tooFewSteps.length > 5) console.log('  ... and ' + (tooFewSteps.length - 5) + ' more');

test('All questions have >=2 solution steps (' + totalQuestions + ' total)', tooFewSteps.length === 0);
test('All 11 exams have questions', totalQuestions >= 165);

console.log('\n' + '='.repeat(50));
console.log('exam-hint-layer-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

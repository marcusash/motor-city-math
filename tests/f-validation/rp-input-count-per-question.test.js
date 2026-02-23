// rp-input-count-per-question test
// Each question should have at least 1 input (otherwise Kai has nothing to answer)
// Multi-part questions (graph, identify) often have 2-4 inputs

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-count-per-question.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noInputs = [], multiInput = 0, totalQuestions = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQuestions++;
        var inputs = q.inputs || [];
        if (inputs.length === 0) {
            noInputs.push('rp' + i + ' ' + q.id + ': 0 inputs');
        } else if (inputs.length > 1) {
            multiInput++;
        }
    });
}

console.log('\u2500\u2500 Input count per question checks \u2500\u2500\n');
console.log('  Total questions: ' + totalQuestions);
console.log('  Multi-input questions: ' + multiInput);
if (noInputs.length) noInputs.forEach(function(v) { console.log('  ! ' + v); });
console.log('');

test('All questions have >=1 input', noInputs.length === 0);
test('Questions verified: ' + totalQuestions, totalQuestions >= 165);

console.log('\n' + '='.repeat(50));
console.log('rp-input-count-per-question: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

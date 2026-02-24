// rp-feedback-fields-exist test
// Every question must have both feedback_correct and feedback_wrong fields
// Without feedback, Kai gets no response after submitting answers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-fields-exist.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missingCorrect = [];
var missingWrong = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.feedback_correct || q.feedback_correct.trim().length === 0) missingCorrect.push(q.id);
        if (!q.feedback_wrong || q.feedback_wrong.trim().length === 0) missingWrong.push(q.id);
    });
}

test('All questions have non-empty feedback_correct (' + missingCorrect.length + ' missing)', missingCorrect.length === 0);
test('All questions have non-empty feedback_wrong (' + missingWrong.length + ' missing)', missingWrong.length === 0);
if (missingCorrect.length) console.log('    ! Missing feedback_correct: ' + missingCorrect.slice(0,5).join(', '));
if (missingWrong.length) console.log('    ! Missing feedback_wrong: ' + missingWrong.slice(0,5).join(', '));

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-fields-exist: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

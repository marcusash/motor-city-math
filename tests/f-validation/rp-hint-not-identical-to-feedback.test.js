// rp-hint-not-identical-to-feedback test
// hint and feedback_correct should not be identical strings
// hint is given BEFORE the answer; feedback_correct is shown AFTER

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-hint-not-identical-to-feedback.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (typeof q.hint !== 'string' || typeof q.feedback_correct !== 'string') return;
        total++;
        if (q.hint.trim() === q.feedback_correct.trim()) {
            violations.push('rp' + i + ' ' + q.id + ': hint === feedback_correct');
        }
    });
}

console.log('\u2500\u2500 Hint vs feedback distinctness checks \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total checked: ' + total);

test('No question has identical hint and feedback_correct (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-hint-not-identical-to-feedback: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

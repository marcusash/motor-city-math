// rp-feedback-correct-present test
// Every question must have a feedback_correct field (Kai gets positive feedback on correct answers)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-correct-present.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        if (typeof q.feedback_correct !== 'string' || q.feedback_correct.trim() === '') {
            violations.push('rp' + i + ' ' + q.id + ': missing or empty feedback_correct');
        }
    });
}

console.log('\u2500\u2500 feedback_correct presence checks \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total questions checked: ' + total);

test('All questions have non-empty feedback_correct (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-correct-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

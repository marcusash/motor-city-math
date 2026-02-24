// rp-feedback-correct-min-length test
// feedback_correct strings should have at least 10 chars
// Single-word responses like "Yes!" lack warmth for ADHD encouragement

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-correct-min-length.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var MIN = 10;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.feedback_correct && q.feedback_correct.length < MIN) {
            violations.push(q.id + ': feedback_correct too short (' + q.feedback_correct.length + ' chars): "' + q.feedback_correct + '"');
        }
    });
}

test('All feedback_correct strings are >= ' + MIN + ' chars (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-correct-min-length: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

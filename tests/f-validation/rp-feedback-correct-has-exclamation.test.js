// rp-feedback-correct-has-exclamation test
// feedback_correct strings should contain enthusiasm (!, Great, Excellent, etc.)
// Positive reinforcement for Kai when he gets it right

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-correct-has-exclamation.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

var ENTHUSIASTIC = /[!\u2728\u{1F525}\u{1F3C6}\u{1F44F}]|great|perfect|excellent|nailed|yes|correct|nice/ui;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (!inp.feedback_correct) return;
            checked++;
            if (!ENTHUSIASTIC.test(inp.feedback_correct)) {
                violations.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': feedback_correct lacks enthusiasm');
            }
        });
    });
}

console.log('\u2500\u2500 Feedback correct enthusiasm checks \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
if (violations.length > 5) console.log('  ... and ' + (violations.length - 5) + ' more');
console.log('  Feedback_correct strings checked: ' + checked);

test('feedback_correct strings contain enthusiasm (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-correct-has-exclamation: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

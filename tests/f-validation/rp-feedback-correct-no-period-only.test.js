// rp-feedback-correct-no-period-only test
// feedback_correct strings must not be a single period or just punctuation
// "." as feedback is not useful and confuses Kai

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-correct-no-period-only.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (!inp.feedback_correct) return;
            checked++;
            var fc = inp.feedback_correct.trim();
            // Must have at least 3 meaningful characters (not just punctuation)
            var wordChars = fc.replace(/[^a-zA-Z0-9\u{1F000}-\u{1FFFF}]/gu, '').length;
            if (wordChars < 3) {
                violations.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': feedback_correct="' + fc + '" lacks content');
            }
        });
    });
}

console.log('\u2500\u2500 Feedback correct content checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Feedback_correct strings checked: ' + checked);

test('All feedback_correct strings have meaningful content (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-correct-no-period-only: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

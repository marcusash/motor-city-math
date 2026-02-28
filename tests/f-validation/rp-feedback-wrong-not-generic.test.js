// rp-feedback-wrong-not-generic test
// feedback_wrong must not be generic phrases like "Incorrect." or "Try again."
// Per voice guide: feedback must be specific and teaching-oriented

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-wrong-not-generic.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var GENERIC = ['incorrect', 'wrong', 'try again', 'not quite', 'nope'];
var violations = [], totalQ = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQ++;
        var fw = (q.feedback_wrong || '').toLowerCase().trim();
        // Generic if it is ONLY one of the generic phrases (with optional punctuation)
        var stripped = fw.replace(/[.!?]$/, '').trim();
        if (GENERIC.indexOf(stripped) !== -1) {
            violations.push('rp' + i + ' ' + q.id + ': "' + q.feedback_wrong + '"');
        }
    });
}

console.log('\u2500\u2500 Feedback wrong quality checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('Total questions checked: ' + totalQ, totalQ >= 165);
test('No generic feedback_wrong (Incorrect./Try again.)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-wrong-not-generic: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

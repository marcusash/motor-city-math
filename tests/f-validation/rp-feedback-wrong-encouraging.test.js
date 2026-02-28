// rp-feedback-wrong-is-encouraging test
// feedback_wrong must not be harsh or discouraging
// Per MCM voice guide: failures get empathy, not criticism
// Check for harsh words: "wrong", "incorrect", "fail", "bad"

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-wrong-encouraging.test.js\n');

var dataDir = path.join(__dirname, '../../data');
// These are patterns that would be harsh/discouraging
var HARSH_PATTERNS = ['you are wrong', 'that is wrong', 'you failed', 'incorrect!', 'bad answer', 'nope!'];
var harsh = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.feedback_wrong) return;
        total++;
        var fb = q.feedback_wrong.toLowerCase();
        HARSH_PATTERNS.forEach(function(p) {
            if (fb.includes(p)) {
                harsh.push('rp' + i + ' ' + q.id + ': "' + p + '" in feedback_wrong');
            }
        });
    });
}

console.log('\u2500\u2500 Encouraging feedback checks \u2500\u2500\n');
if (harsh.length) harsh.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' feedback_wrong strings avoid harsh language', harsh.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-wrong-encouraging: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

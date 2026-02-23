// rp-feedback-wrong-length test
// feedback_wrong strings must be brief per ADHD design rules (max ~20 words)
// Wrong answer feedback should be corrective, not a lecture

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-wrong-length.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var tooLong = [], totalChecked = 0;
var MAX_WORDS = 20;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (q.feedback_wrong) {
            totalChecked++;
            var words = q.feedback_wrong.trim().split(/\s+/).length;
            if (words > MAX_WORDS) {
                tooLong.push('rp' + i + ' ' + q.id + ': ' + words + ' words');
            }
        }
    });
}

console.log('\u2500\u2500 Feedback wrong length checks \u2500\u2500\n');
if (tooLong.length) {
    tooLong.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
    if (tooLong.length > 5) console.log('  ... and ' + (tooLong.length - 5) + ' more');
}

test('feedback_wrong checked: ' + totalChecked, totalChecked >= 100);
test('All feedback_wrong strings <=20 words (ADHD rule)', tooLong.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-wrong-length: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

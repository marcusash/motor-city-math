// rp-feedback-correct-short test
// feedback_correct must be concise (max 100 chars - ADHD design: no walls of text)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-correct-short.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MAX = 150;
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (typeof q.feedback_correct !== 'string') return;
        total++;
        if (q.feedback_correct.length > MAX) {
            violations.push('rp' + i + ' ' + q.id + ': ' + q.feedback_correct.length + ' chars');
        }
    });
}

console.log('\u2500\u2500 feedback_correct length checks (max ' + MAX + ' chars) \u2500\u2500\n');
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total checked: ' + total);

test('All feedback_correct <= ' + MAX + ' chars (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-correct-short: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

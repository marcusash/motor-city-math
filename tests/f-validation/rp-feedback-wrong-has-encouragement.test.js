// rp-feedback-wrong-has-encouragement test
// feedback_wrong messages are worked solutions showing Kai the correct approach
// Verify they have meaningful content (not blank or placeholder)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-wrong-has-encouragement.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MIN_FEEDBACK_LEN = 10;
var tooShort = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        if (!q.feedback_wrong && q.feedback_wrong !== '') return;
        total++;
        if ((q.feedback_wrong || '').trim().length < MIN_FEEDBACK_LEN) {
            tooShort.push('rp' + i + ' ' + q.id + ': feedback_wrong too short: "' + q.feedback_wrong + '"');
        }
    });
}

console.log('\u2500\u2500 feedback_wrong content checks (min ' + MIN_FEEDBACK_LEN + ' chars) \u2500\u2500\n');
if (tooShort.length) tooShort.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total feedback_wrong checked: ' + total);

test('All feedback_wrong messages have >= ' + MIN_FEEDBACK_LEN + ' chars (' + tooShort.length + ' violations)', tooShort.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-wrong-has-encouragement: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// RP feedback_correct not generic test
// feedback_correct must NOT be generic strings like "Correct!", "Great job!", "That's right!"
// MCM voice: specific, motivating, content-aware (min 15 chars, not just generic praise)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-correct-not-generic.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var GENERIC = [
    /^correct[.!]?$/i,
    /^great job[.!]?$/i,
    /^that'?s right[.!]?$/i,
    /^well done[.!]?$/i,
    /^nice work[.!]?$/i,
    /^good job[.!]?$/i,
    /^excellent[.!]?$/i,
    /^perfect[.!]?$/i,
    /^yes[.!]?$/i,
];

var generic = [], tooShort = [], totalQuestions = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQuestions++;
        var fb = q.feedback_correct || '';
        if (fb.trim().length < 15) {
            tooShort.push('rp' + i + ' ' + q.id + ': feedback_correct too short: "' + fb + '"');
        }
        GENERIC.forEach(function(re) {
            if (re.test(fb.trim())) {
                generic.push('rp' + i + ' ' + q.id + ': generic feedback_correct: "' + fb + '"');
            }
        });
    });
}

console.log('\u2500\u2500 RP feedback_correct quality (165 questions) \u2500\u2500\n');
console.log('  Questions checked: ' + totalQuestions);

test('All 165 questions loaded', totalQuestions === 165);
test('No generic feedback_correct strings (MCM voice required)', generic.length === 0);
test('All feedback_correct >= 15 chars (substantive content)', tooShort.length === 0);

if (generic.length) generic.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });
if (tooShort.length) tooShort.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-correct-not-generic: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// rp-wrong-feedback-not-generic test
// feedback_wrong must give pedagogically useful feedback (not just "Incorrect!")
// MCM spec: wrong feedback should hint at the mistake type or approach

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-wrong-feedback-not-generic.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var GENERIC_WRONG = [
    /^incorrect[.!]?$/i,
    /^wrong[.!]?$/i,
    /^no[.!]?$/i,
    /^try again[.!]?$/i,
    /^not quite[.!]?$/i,
    /^nope[.!]?$/i,
];

var generic = [], tooShort = [], totalChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalChecked++;
        var fb = q.feedback_wrong || '';
        if (fb.trim().length < 10) {
            tooShort.push('rp' + i + ' ' + q.id + ': feedback_wrong too short: "' + fb + '"');
        }
        GENERIC_WRONG.forEach(function(re) {
            if (re.test(fb.trim())) {
                generic.push('rp' + i + ' ' + q.id + ': generic feedback_wrong: "' + fb + '"');
            }
        });
    });
}

console.log('\u2500\u2500 RP feedback_wrong quality \u2500\u2500\n');
console.log('  Questions checked: ' + totalChecked);

test('All 165 questions checked', totalChecked === 165);
test('No generic feedback_wrong strings (pedagogical value required)', generic.length === 0);
test('All feedback_wrong >= 10 chars (substantive guidance)', tooShort.length === 0);

if (generic.length) generic.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });
if (tooShort.length) tooShort.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-wrong-feedback-not-generic: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

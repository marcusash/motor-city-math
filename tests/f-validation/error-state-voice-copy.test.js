// Error state voice copy test
// MCM voice: error state messages must use MCM tone (direct, motivating, Kai-specific)
// Must NOT use clinical language like "invalid input", "error occurred", "please try again"
// GD spec: error-state-voice-spec (20260224-0055)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} error-state-voice-copy.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var sharedSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');
var combined = examSrc + '\n' + sharedSrc;

console.log('\u2500\u2500 Error state voice copy checks \u2500\u2500\n');

// 1. Clinical error language is absent from JS strings
var clinicalPhrases = [
    'invalid input',
    'an error occurred',
    'please try again',
    'error occurred',
    'something went wrong',
];
var found = clinicalPhrases.filter(function(p) {
    return combined.toLowerCase().includes(p.toLowerCase());
});
test('No clinical error language in exam.html/scripts.js', found.length === 0);
if (found.length) found.forEach(function(p) { console.log('  ! Clinical phrase found: "' + p + '"'); });

// 2. Rescue message uses MCM voice (not clinical)
var hasRescue = combined.includes('scheduleRescue') || combined.includes('rescueMsg');
test('Rescue message system exists (ADHD: auto-hint after 3 wrong)', hasRescue);

// 3. Error messages in data/retake-practice JSON use MCM voice
// feedback_wrong should use direct language, not "Please ensure..."
var dataDir = path.join(__dirname, '../../data');
var clinicalFeedback = [];
for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        var fb = q.feedback_wrong || '';
        if (/please ensure|please check|please verify|you must|you need to/i.test(fb)) {
            clinicalFeedback.push('rp' + i + ' ' + q.id + ': "' + fb.slice(0, 60) + '"');
        }
    });
}
test('No clinical "please ensure/check/verify" in feedback_wrong', clinicalFeedback.length === 0);
if (clinicalFeedback.length) clinicalFeedback.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('error-state-voice-copy: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
